require("dotenv").config();
const axios = require("axios");
const utils = require("../../../node_modules/@strapi/utils");
const _ = require("lodash");

const {
  validateCallbackBody,
  validateRegisterBody,
  validateSendEmailConfirmationBody,
  validateForgotPasswordBody,
  validateResetPasswordBody,
  validateEmailConfirmationBody,
  validateChangePasswordBody,
} = require("../../../node_modules/@strapi/plugin-users-permissions/server/controllers/validation/auth");
const {
  getService,
} = require("../../../node_modules/@strapi/plugin-users-permissions/server/utils/index");

const { getAbsoluteAdminUrl, getAbsoluteServerUrl, sanitize } = utils;
const { ApplicationError, ValidationError } = utils.errors;

const { getPakms } = require("../clover/utils");

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel("plugin::users-permissions.user");

  return sanitize.contentAPI.output(user, userSchema, { auth });
};

const register = async (ctx) => {
  const { firstName, lastName, email, password, merchant_id } =
    ctx.request.body;
  let cloverId = null;
  const entry = await getPakms(merchant_id);
  if (entry.access_token) {
    const pluginStore = await strapi.store({
      type: "plugin",
      name: "users-permissions",
    });

    const settings = await pluginStore.get({ key: "advanced" });

    if (!settings.allow_register) {
      throw new ApplicationError("Register action is currently disabled");
    }

    const headers = {
      "Content-Type": "application/json",
      accept: "application/json",
      authorization: `Bearer ${entry.access_token}`,
    };
    const customer = {
      emailAddresses: [{ emailAddress: email }],
      firstName: firstName,
      lastName: lastName,
    };
    // @ts-ignore
    const customerRes = await axios.post(
      `https://sandbox.dev.clover.com/v3/merchants/${merchant_id}/customers`,
      customer,
      {
        headers: headers,
      }
    );
    if (customerRes.data.id) {
      cloverId = customerRes.data.id;
    }
    console.log("response", customerRes.data.id);
    const params = {
      ..._.omit({ firstName, lastName, email, password, cloverId }, [
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
      ]),
      provider: "local",
    };

    const role = await strapi
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: settings.default_role } });

    if (!role) {
      throw new ApplicationError("Impossible to find the default role");
    }
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

module.exports = { register };
