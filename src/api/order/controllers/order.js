"use strict";

const { getCloverOrders } = require("../utils");

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  cloverOrders: async (ctx, next) => {
    console.log("ctx.params", ctx.params);
    const orders = await getCloverOrders(ctx);
    //const oo = await orders;
    console.log("orders", orders);
    //ctx.body = orders;
    ctx.send(
      {
        orders,
      },
      200
    );
  },
  postOrders: async (ctx, next) => {
    try {
      const data = await strapi.service("api::order.order").postOrders(ctx);
      ctx.send(
        {
          message: "postOrders",
        },
        200
      );
    } catch (error) {
      ctx.badRequest(error.message, { moreDetails: error });
    }
  },
}));
