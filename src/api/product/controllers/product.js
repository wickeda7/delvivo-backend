"use strict";

/**
 * product controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::product.product", ({ strapi }) => ({
  getCategories: async (ctx, next) => {
    try {
      const data = await strapi
        .service("api::product.product")
        .getCategories(ctx, next);
      ctx.send(
        {
          data,
        },
        200
      );
    } catch (error) {
      ctx.badRequest(error);
    }
  },
}));
