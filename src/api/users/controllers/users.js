"use strict";

/**
 * A set of functions called "actions" for `users`
 */

module.exports = {
  getUser: async (ctx, next) => {
    try {
      const data = await strapi.service("api::users.users").getUser(ctx, next);
      if (data.error) {
        throw new Error(data.error);
      }
      ctx.send(
        {
          data,
        },
        200
      );
    } catch (err) {
      ctx.badRequest(err.message);
    }
  },
  async cloverRegister(ctx, next) {
    try {
      const data = await strapi.service("api::users.users").cloverRegister(ctx);
      ctx.send(
        {
          data,
        },
        200
      );
    } catch (err) {
      ctx.badRequest(err);
    }
  },
  async cloverLogin(ctx, next) {
    try {
      const data = await strapi.service("api::users.users").cloverLogin(ctx);
      ctx.send(
        {
          data,
        },
        200
      );
    } catch (err) {
      ctx.badRequest(err);
    }
  },
};
