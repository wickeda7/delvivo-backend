"use strict";

/**
 * merchant controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::merchant.merchant",
  ({ strapi }) => ({
    updateMerchant: async (ctx, next) => {
      const data = await strapi
        .service("api::merchant.merchant")
        .updateMerchant(ctx, next);
      ctx.send(
        {
          data,
        },
        200
      );
    },
  })
);
