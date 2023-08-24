require("dotenv").config();
const axios = require("axios");
const utils = require("../../../node_modules/@strapi/utils");
const _ = require("lodash");
const CLOVER_APP_URL = process.env.CLOVER_APP_URL;

const {
  getService,
} = require("../../../node_modules/@strapi/plugin-users-permissions/server/utils/index");

const { sanitize } = utils;
const { ApplicationError } = utils.errors;

const { getPakms } = require("../clover/utils");
const admin = require("../../../config/admin");

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel("plugin::users-permissions.user");

  return sanitize.contentAPI.output(user, userSchema, { auth });
};

const getRoleId = async (isMember, default_role, cloveradmin) => {
  if (!isMember) {
    const role = await strapi
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: default_role } });
    if (!role) {
      throw new ApplicationError("Impossible to find the default role");
    }
    return role;
  } else {
    const role = await strapi
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: cloveradmin } });
    if (!role) {
      throw new ApplicationError("Impossible to find the default role");
    }
    return role;
  }
};

const createCloverUser = async (ctx, access_token) => {
  const { firstName, lastName, email, merchant_id, isMember } =
    ctx.request.body;
  let cloverId = null;
  if (!isMember) {
    const headers = {
      "Content-Type": "application/json",
      accept: "application/json",
      authorization: `Bearer ${access_token}`,
    };
    const customer = {
      emailAddresses: [{ emailAddress: email }],
      firstName: firstName,
      lastName: lastName,
    };
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
  }
  return cloverId;
};
const register = async (ctx) => {
  const { firstName, lastName, email, password, merchant_id, isMember } =
    ctx.request.body;

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

    //console.log("response", customerRes.data.id);
    const params = {
      ..._.omit(
        { firstName, lastName, email, password, cloverId, merchant_id },
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
    sanitizedUser["role"] = role.id;
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

const login = async (ctx) => {};
module.exports = { register, login };
