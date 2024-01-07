"use strict";
const {
  getService,
} = require("@strapi/plugin-users-permissions/server/utils/index");
const _ = require("lodash");
const utils = require("@strapi/utils");
const { ApplicationError } = utils.errors;
/**
 * driver service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::driver.driver", ({ strapi }) => ({
  postDriver: async (ctx, next) => {
    const {
      firstName,
      lastName,
      email,
      password,
      merchant_id,
      phone,
      address,
      city,
      state,
      zip,
      dl,
      make,
      model,
      year,
      color,
      plate,
      available,
      profileImg,
      carImg,
    } = ctx.request.body.data;
    const params = {
      ..._.omit(
        {
          firstName: firstName,
          lastName,
          email,
          password,
          phoneNumber: phone,
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
      role: 4,
      email: email.toLowerCase(),
      confirmed: true,
    };
    const user = await getService("user").add(newUser);
    if (user) {
      const connect = { id: user.id };
      const data = {
        firstName,
        lastName,
        email,
        password,
        merchant_id,
        phone,
        address,
        city,
        state,
        zip,
        dl,
        make,
        model,
        year,
        color,
        plate,
        available,
        profileImg,
        carImg,
        user: connect,
        is_user: { id: user.id },
      };
      try {
        //@ts-ignore
        const entry = await strapi.db
          .query("api::driver.driver")
          .create({ data: data });
        const driverid = entry.id;
        const merch = await strapi
          .query("plugin::users-permissions.user")
          .findOne({ where: { merchant_id } });
        const id = merch.id;
        const drivers = {
          disconnect: [],
          connect: [{ id: driverid, position: { start: true } }],
        };
        const connect = { id: driverid, position: { start: true } };
        const dataUser = await getService("user").edit(id, {
          drivers,
        });
        return entry;
      } catch (error) {
        throw new Error(error.message);
      }
    }
  },
}));
