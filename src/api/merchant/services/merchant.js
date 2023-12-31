"use strict";

/**
 * merchant service
 */
require("dotenv").config();
const axios = require("axios");
const CLOVER_APP_URL = process.env.CLOVER_APP_URL;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const GOOGLE_URL = process.env.GOOGLE_URL;

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::merchant.merchant", ({ strapi }) => ({
  getMerchant: async (ctx, next) => {
    const { id } = ctx.params;
    try {
      const entry = await strapi.db.query("api::merchant.merchant").findOne({
        where: { merchant_id: id },
      });
      return entry;
    } catch (error) {
      return error;
    }
  },
  updateMerchant: async (ctx, next) => {
    const address = ctx.request.body.address;
    // console.log("ctx.request.body.data", ctx.request.body);
    let response = {};
    if (address) {
      try {
        const { id } = ctx.params;
        const newData = {
          address: JSON.stringify(address),
        };
        const entry = await strapi.db.query("api::merchant.merchant").update({
          where: { merchant_id: id },
          data: newData,
        });
        response = {
          merchant_id: entry.merchant_id,
          notify_email: entry.notify_email,
          order_types: JSON.parse(entry.order_types),
          access_token: entry.access_token,
          address: JSON.parse(entry.address),
        };
        return response;
      } catch (error) {}
      return;
    }
    const {
      access_token,
      merchant_id,
      orderTypes: {
        delivery: { id, fee, maxRadius, minOrderAmount },
      },
      notify_email,
      logo,
    } = ctx.request.body.data;

    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${access_token}`,
    };
    const body = { fee, maxRadius, minOrderAmount };

    try {
      //@ts-ignore
      const res = await axios.post(
        `${CLOVER_APP_URL}/v3/merchants/${merchant_id}/order_types/${id}`,
        body,
        {
          headers: headers,
        }
      );
      if (res.data) {
        let ordertypes = ctx.request.body.data.orderTypes;
        ordertypes.delivery.id = res.data.id;
        ordertypes.delivery.fee = res.data.fee;
        ordertypes.delivery.maxRadius = res.data.maxRadius;
        ordertypes.delivery.minOrderAmount = res.data.minOrderAmount;
        const newData = {
          access_token,
          merchant_id,
          notify_email,
          order_types: JSON.stringify(ordertypes),
          logo,
        };
        const entry = await strapi.db.query("api::merchant.merchant").update({
          where: { merchant_id: merchant_id },
          data: newData,
        });
        response = {
          merchant_id: entry.merchant_id,
          notify_email: entry.notify_email,
          order_types:
            typeof entry.order_types === "string"
              ? JSON.parse(entry.order_types)
              : entry.order_types,
          access_token: entry.access_token,
          address:
            typeof entry.address === "string"
              ? JSON.parse(entry.address)
              : entry.address,
          logo: entry.logo,
        };
      }
      return response;
    } catch (error) {
      //   const { response } = error;
      //   const { request, ...errorObject } = response; // take everything but 'request'
      //   console.log(
      //     "-----------------------getAuth ERROR--------------------------------------------"
      //   );
      console.log(error.message);
      // return errorObject.data;
    }
  },
}));
