require("dotenv").config();
const axios = require("axios");
const utils = require("@strapi/utils");
const _ = require("lodash");
const CLOVER_APP_URL = process.env.CLOVER_APP_URL;

const {
  getService,
} = require("@strapi/plugin-users-permissions/server/utils/index");

const { sanitize } = utils;
const { ApplicationError, ValidationError } = utils.errors;

const { getPakms } = require("../clover/utils");
const admin = require("../../../config/admin");

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel("plugin::users-permissions.user");

  return sanitize.contentAPI.output(user, userSchema, { auth });
};

const getRoleId = async (isMember, default_role, cloveradmin) => {
  let role = null;
  if (!isMember) {
    role = await strapi
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: default_role } });
    if (!role) {
      throw new ApplicationError("Impossible to find the default role");
    }
  } else {
    role = await strapi
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: cloveradmin } });
    if (!role) {
      throw new ApplicationError("Impossible to find the default role");
    }
  }
  return role;
};

const createCloverUser = async (ctx, access_token) => {
  const {
    firstName,
    lastName,
    email,
    merchant_id,
    isMember,
    address,
    city,
    state,
    zip,
    country,
  } = ctx.request.body;
  let cloverId = null;
  if (!isMember) {
    const headers = {
      "Content-Type": "application/json",
      accept: "application/json",
      authorization: `Bearer ${access_token}`,
    };
    const customer = {
      merchant: { id: merchant_id },
      emailAddresses: [{ emailAddress: email }],
      firstName: firstName,
      lastName: lastName,
      addresses: [
        {
          address1: address,
          city: city,
          state: state,
          zip: zip,
          country,
        },
      ],
    };

    try {
      // @ts-ignore
      const customerRes = await axios.post(
        `${CLOVER_APP_URL}/v3/merchants/${merchant_id}/customers`,
        customer,
        {
          headers: headers,
        }
      );
      if (!customerRes.data.id) {
        throw new ApplicationError("Check your clover credentials");
      }
      return customerRes.data.id;
    } catch (error) {
      const { response } = error;
      const { request, ...errorObject } = response; // take everything but 'request'
      console.log(
        "-----------------------createCloverUser ERROR--------------------------------------------"
      );
      throw errorObject.data;
    }
  }
  return cloverId;
};
const register = async (ctx) => {
  const {
    firstName,
    lastName,
    email,
    password,
    merchant_id,
    isMember,
    address,
    city,
    state,
    zip,
  } = ctx.request.body;

  const entry = await getPakms(merchant_id);
  if (entry.access_token) {
    const pluginStore = await strapi.store({
      type: "plugin",
      name: "users-permissions",
    });
    const settings = await pluginStore.get({ key: "advanced" });
    const cloverId = await createCloverUser(ctx, entry.access_token);
    const role = await getRoleId(
      isMember,
      settings.default_role,
      "cloveradmin"
    );
    const params = {
      ..._.omit(
        {
          firstName,
          lastName,
          email,
          password,
          cloverId,
          merchant_id,
          address,
          city,
          state,
          zip,
        },
        [
          "confirmed",
          "blocked",
          "confirmationToken",
          "resetPasswordToken",
          "provider",
          "id",
          "createdAt",
          "updatedAt",
          "createdBy",
          "updatedBy",
          "role",
        ]
      ),
      provider: "local",
    };

    const { provider } = params;
    const identifierFilter = {
      $or: [{ email: email.toLowerCase() }],
    };
    const conflictingUserCount = await strapi
      .query("plugin::users-permissions.user")
      .count({
        where: { ...identifierFilter, provider },
      });
    if (conflictingUserCount > 0) {
      throw new ApplicationError("Email is already taken");
    }

    const newUser = {
      ...params,
      role: role.id,
      email: email.toLowerCase(),
      confirmed: !settings.email_confirmation,
    };
    const user = await getService("user").add(newUser);
    const sanitizedUser = await sanitizeUser(user, ctx);

    sanitizedUser["roleId"] = role.id;
    if (settings.email_confirmation) {
      try {
        await getService("user").sendConfirmationEmail(sanitizedUser);
      } catch (err) {
        throw new ApplicationError(err.message);
      }

      return ctx.send({ user: sanitizedUser });
    }
    const jwt = getService("jwt").issue(_.pick(user, ["id"]));

    return {
      jwt,
      user: sanitizedUser,
    };
  }
  return { error: "No access token" };
};

const login = async (ctx) => {
  const provider = ctx.params.provider || "local";
  const params = ctx.request.body;

  const store = strapi.store({ type: "plugin", name: "users-permissions" });
  const grantSettings = await store.get({ key: "grant" });

  const grantProvider = provider === "local" ? "email" : provider;

  if (!_.get(grantSettings, [grantProvider, "enabled"])) {
    throw new ApplicationError("This provider is disabled");
  }

  if (provider === "local") {
    const { identifier, merchant_id } = params;

    // Check if the user exists.
    const user = await strapi.query("plugin::users-permissions.user").findOne({
      populate: ["role", "merchant"],
      where: {
        provider,
        $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
      },
    });
    if (!user) {
      throw new ValidationError("Invalid identifier or password");
    }

    if (!user.password) {
      throw new ValidationError("Invalid identifier or password");
    }
    const validPassword = await getService("user").validatePassword(
      params.password,
      user.password
    );

    if (!validPassword) {
      throw new ValidationError("Invalid identifier or password");
    }
    if (user.merchant_id != merchant_id) {
      throw new ValidationError("Invalid merchant");
    }

    const advancedSettings = await store.get({ key: "advanced" });
    const requiresConfirmation = _.get(advancedSettings, "email_confirmation");

    if (requiresConfirmation && user.confirmed !== true) {
      throw new ApplicationError("Your account email is not confirmed");
    }

    if (user.blocked === true) {
      throw new ApplicationError(
        "Your account has been blocked by an administrator"
      );
    }

    user.roleId = user.role.id;
    if (user.merchant) {
      user.merchant_name = user.merchant.merchant_name;
      delete user.merchant;
    }
    delete user.role;
    return {
      jwt: getService("jwt").issue({ id: user.id }),
      user: await sanitizeUser(user, ctx),
    };
  }
};
module.exports = { register, login };
