"use strict";
require("dotenv").config();
const axios = require("axios");
const CLOVER_APP_URL = process.env.CLOVER_APP_URL;

/**
 * product service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::product.product", ({ strapi }) => ({
  getCategories: async (ctx, next) => {
    const { merchantId } = ctx.params;
    try {
      const entry = await strapi.db.query("api::merchant.merchant").findOne({
        where: { merchant_id: merchantId },
      });
      if (!entry) {
        throw new Error("Merchant not found");
      }
      const { access_token } = entry;
      console.log("entry", access_token);
      const headers = {
        "Content-Type": "application/json",
        accept: "application/json",
        authorization: `Bearer ${access_token}`,
      };
      // @ts-ignore
      const res = await axios.get(
        `${CLOVER_APP_URL}/v3/merchants//${merchantId}/categories`,
        {
          headers: headers,
        }
      );
      console.log("res", res);
      //   const data = await strapi
      //     .service("api::product.product")
      //     .getCategories(ctx, next);
      //   return data;
    } catch (error) {
      console.log("error", error);
      return error;
    }
  },
}));
