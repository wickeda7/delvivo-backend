"use strict";

const { addOrder } = require("../utils");
/**
 * order service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::order.order", ({ strapi }) => ({
  postOrders: async (ctx, next) => {
    // console.log("ctx.createCoreSeorderrvice", order); //api::order.order
    try {
      const res = await addOrder(ctx.request.body);
      // @ts-ignore
      //   if (!res) {
      //     throw new Error("Error creating order");
      //   }
      //console.log("data11", res.data);
    } catch (error) {
      throw new Error(error.message);
    }
  },
}));
