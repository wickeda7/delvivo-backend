"use strict";

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  storeOrders: async (ctx, next) => {
    const data = await strapi
      .service("api::order.order")
      .storeOrders(ctx, next);
    ctx.send(
      {
        data: data,
      },
      200
    );
  },
  cloverOrders: async (ctx, next) => {
    try {
      const data = await strapi
        .service("api::order.order")
        .cloverOrders(ctx, next);
      ctx.send(
        {
          message: "postOrders",
        },
        200
      );
    } catch (error) {
      ctx.badRequest(error.message, { moreDetails: error });
    }
    // const orders = await getCloverOrders(ctx);
    // //const oo = await orders;
    // console.log("orders", orders);
    // //ctx.body = orders;
    // ctx.send(
    //   {
    //     orders,
    //   },
    //   200
    // );
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
