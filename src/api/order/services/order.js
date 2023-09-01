"use strict";

const { addOrder, getCloverOrders } = require("../utils");
/**
 * order service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::order.order", ({ strapi }) => ({
  storeOrders: async (ctx, next) => {
    const { created } = ctx.request.query;
    // console.log("ctx.createCoreSeorderrvice", created); //api::order.order  2023-08-29T00:00:00.000Z  2023-08-29T23:59:00.000Z
    const am = `${created}T00:00:00.000Z`;
    const pm = `${created}T23:59:00.000Z`;
    try {
      const entries = await strapi.entityService.findMany("api::order.order", {
        filters: {
          created: { $gt: am, $lt: pm },
        },
        populate: "*", //customer
      });
      return entries;
    } catch (error) {
      throw new Error(error.message);
    }
  },
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
  cloverOrders: async (ctx, next) => {
    try {
      const res = await getCloverOrders(ctx);
    } catch (error) {
      console.log(error.message);
    }
  },
}));
