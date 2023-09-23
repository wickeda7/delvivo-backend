"use strict";

/**
 * driver controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::driver.driver", ({ strapi }) => ({
  postDriver: async (ctx, next) => {
    try {
      const data = await strapi
        .service("api::driver.driver")
        .postDriver(ctx, next);
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
