"use strict";

const { addOrder, getCloverOrders, parseMobileData } = require("../utils");
const { sendCustomerEmail } = require("../email/sendEmail");
const e = require("cors");
/**
 * order service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::order.order", ({ strapi }) => ({
  storeOrders: async (ctx, next) => {
    const { type, created } = ctx.request.query;
    console.log("created", created);
    try {
      const entries = await strapi.entityService.findMany("api::order.order", {
        filters: {
          created: { $eq: created },
        },
        populate: "*", //customer
      });

      if (type) {
        const res = entries.reduce((acc, cur) => {
          const data = parseMobileData(cur);
          if (data) {
            acc.push(data);
          }
          return acc;
        }, []);
        return res;
      }
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
  sendemail: async (ctx, next) => {
    const { order } = ctx.request.body;
    try {
      // convert order to lifecycle format
      const newOrder = {};
      newOrder["type"] = "update";
      newOrder["entry"] = { itemContent: order.itemContent, user: order.user };
      order["email"] = order.user.email;
      delete order.itemContent;
      delete order.user;
      //console.log("order", order);
      const order_content = order.order_content;
      newOrder["resOrder"] = {
        ...order,
        ...order_content,
      };
      const data = await sendCustomerEmail(newOrder);
      console.log("sendEmail", data);
      if (data.status === "success") {
        try {
          await strapi.entityService.update("api::order.order", order.id, {
            data: { notifiedDate: new Date() },
          });
          return { id: order.id, notifiedDate: new Date() };
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      ctx.badRequest(error.message, { moreDetails: error });
    }
  },
}));
