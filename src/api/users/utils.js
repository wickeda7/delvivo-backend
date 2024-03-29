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

//const { Order } = require("./testOrder");
const {
  sendCustomerEmail,
  sendMerchantEmail,
} = require("../order/email/sendEmail");
const merchant = require("../merchant/controllers/merchant");

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel("plugin::users-permissions.user");

  return sanitize.contentAPI.output(user, userSchema, { auth });
};

// const testEmail = async (email) => {
//   const orderId = "SPJAW4PNKVZAG";
//   const merchant_id = "M04E9FZBWVB71";
//   const createdAt = "2023-09-17T06:15:37.909Z";
//   try {
//     await sendMerchantEmail(orderId, merchant_id, createdAt, Order);
//     return { message: "success" };
//   } catch (error) {
//     console.log(error);
//   }
// };
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
  let {
    firstName,
    lastName,
    email,
    password,
    merchant_id,
    phoneNumber,
    isMember,
    address,
    city,
    state,
    zip,
  } = ctx.request.body;
  if (isMember) {
    isMember = true;
  }
  // const entry = await getPakms(merchant_id);
  // console.log("merchant_id", merchant_id);
  // console.log("entry", entry);
  //if (entry.access_token) {
  const pluginStore = await strapi.store({
    type: "plugin",
    name: "users-permissions",
  });
  const settings = await pluginStore.get({ key: "advanced" });
  //const cloverId = await createCloverUser(ctx, entry.access_token);
  const role = await getRoleId(isMember, settings.default_role, "cloveradmin");
  const params = {
    ..._.omit(
      {
        firstName,
        lastName,
        email,
        password,
        // cloverId,
        phoneNumber,
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
  //}
  //return { error: "No access token" };
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
      populate: ["role", "drivers", "is_driver", "is_driver.user"],
      where: {
        provider,
        $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
      },
    });
    if (!user) {
      throw new ValidationError("Invalid Credentials");
    }

    if (!user.password) {
      throw new ValidationError("Invalid Credentials");
    }
    const validPassword = await getService("user").validatePassword(
      params.password,
      user.password
    );
    if (!validPassword) {
      throw new ValidationError("Invalid Credentials");
    }
    // if (user.merchant_id != merchant_id) {
    //   throw new ValidationError("Invalid merchant");
    // }

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
    if (user.roleId === 3) {
      if (user.drivers.length > 0) {
        const driverIds = user.drivers.reduce((acc, driver) => {
          if (driver.available) acc.push(driver.id);
          return acc;
        }, []);
        registerRedish(`drivers_${user.merchant_id}`, driverIds);
      }
    }
    return {
      jwt: getService("jwt").issue({ id: user.id }),
      user: await sanitizeUser(user, ctx),
    };
  }
};
const getUser = async (ctx, next) => {
  const { customerId, merchantId, accessToken } = ctx.params;
  const headers = {
    "Content-Type": "application/json",
    accept: "application/json",
    authorization: `Bearer ${accessToken}`,
  };
  try {
    // @ts-ignore
    const res = await axios.get(
      `${CLOVER_APP_URL}/v3/merchants/${merchantId}/customers/${customerId}?expand=addresses`,
      {
        headers: headers,
      }
    );
    if (res.data.addresses) {
      const userData = await userDb(res.data);
      return userData;
    }
  } catch (error) {
    if (error.message) {
      return { error: error.message };
    }
    const { response } = error;
    const { request, ...errorObject } = response; // take everything but 'request'
    return { error: errorObject.data };
  }
};
const userDb = async (data) => {
  const {
    id,
    addresses: { elements },
  } = data;

  try {
    const user = await strapi
      .query("plugin::users-permissions.user")
      .findOne({ where: { cloverId: id } });
    if (!user) {
      throw new ApplicationError("User not found");
    }
    const entry = await getService("user").edit(user.id, {
      address: elements[0].address1,
      city: elements[0].city,
      state: elements[0].state,
      zip: elements[0].zip,
    });
    return entry;
  } catch (error) {
    throw new Error(error.message);
  }
};
const updateUser = async (ctx) => {
  const data = ctx.request.body.data;
  const { id } = ctx.params;
  try {
    const user = await strapi
      .query("plugin::users-permissions.user")
      .findOne({ where: { id: id }, populate: ["is_driver"] });
    if (!user) {
      throw new ApplicationError("User not found");
    }
    if (data.currentPassword && data.newPassword) {
      const validPassword = await getService("user").validatePassword(
        data.currentPassword,
        user.password
      );
      if (!validPassword) {
        throw new ValidationError("Invalid Credentials");
      }
      //data.password = bcrypt.hashSync(data.newPassword, 10);
      data.password = data.newPassword;
      data.resetPasswordToken = null;
      delete data.currentPassword;
      delete data.newPassword;
    }
    const entry = await getService("user").edit(user.id, data);
    entry.is_driver = user.is_driver;
    return entry;
    //  // Return new jwt token
    //  ctx.send({
    //   jwt: strapi.service("plugin::users-permissions.jwt").issue({
    //     id: user.id,
    //   }),
    //   user: sanitizeOutput(user),
    // });
  } catch (error) {
    throw new Error(error.message);
  }
};
const registerRedish = async (merchant_id, socket_id) => {
  const EXPIRE = 60;
  try {
    strapi.plugins["rest-cache"].services.cacheStore.set(
      merchant_id,
      socket_id,

      { XX: true, NX: true }
    );
  } catch (error) {
    console.log(error);
  }
};
module.exports = { register, login, getUser, updateUser, registerRedish };
