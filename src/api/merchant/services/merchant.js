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
    const entry = await strapi.db.query("api::merchant.merchant").findOne({
      where: { merchant_id: id },
    });
    if (entry) {
      const headers = {
        "Content-Type": "application/json",
        authorization: `Bearer ${entry.access_token}`,
      };
      try {
        //@ts-ignore
        const res = await axios.get(
          `${CLOVER_APP_URL}/v3/merchants/${id}/address`,
          {
            headers: headers,
          }
        );
        const address = `${res.data.address1}, ${res.data.city}, ${res.data.state}, ${res.data.zip}`;
        // @ts-ignore
        const geo = await axios.get(
          `${GOOGLE_URL}/maps/api/geocode/json?key=${GOOGLE_MAPS_API_KEY}&address=${address}`
        );
        console.log("address", geo.data.results[0].geometry.location);
      } catch (error) {}
    }
  },
  updateMerchant: async (ctx, next) => {
    const address = ctx.request.body.address;
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
          orderTypes: JSON.parse(entry.order_types),
          access_token: entry.access_token,
          address: JSON.parse(entry.address),
        };
        return response;
      } catch (error) {}
    }
    const {
      access_token,
      merchant_id,
      orderTypes: {
        delivery: { id, fee, maxRadius, minOrderAmount },
      },
      notify_email,
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
        };
        const entry = await strapi.db.query("api::merchant.merchant").update({
          where: { merchant_id: merchant_id },
          data: newData,
        });
        response = {
          merchant_id: entry.merchant_id,
          notify_email: entry.notify_email,
          orderTypes: JSON.parse(entry.order_types),
          access_token: entry.access_token,
          address: JSON.parse(entry.address),
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
