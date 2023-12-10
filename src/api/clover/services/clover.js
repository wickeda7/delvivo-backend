require("dotenv").config();
const axios = require("axios");

// @ts-ignore
const {
  createCardToken,
  buildOrder,
  orderPayment,
  getAuth,
  getPakms,
} = require("../utils");

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const GOOGLE_URL = process.env.GOOGLE_URL;

//service

module.exports = {
  cloverGetAuth: async (ctx) => {
    const body = ctx.request.body.data;
    const { code, employeeId, merchantId } = body;

    try {
      const result = await getAuth(code, employeeId, merchantId);
      return result;
    } catch (error) {
      const { response } = error;
      const { request, ...errorObject } = response; // take everything but 'request'
      return errorObject.data;
    }
  },
  cloverGetMap: async (ctx) => {
    const body = ctx.request.body;
    try {
      // @ts-ignore
      const res = await axios.get(
        `${GOOGLE_URL}/maps/api/geocode/json?key=${GOOGLE_MAPS_API_KEY}&address=${body.destinations}`
      );
      if (res.data.results[0].geometry.location) {
        //@ts-ignore
        const result = await axios.get(
          `${GOOGLE_URL}/maps/api/distancematrix/json?key=${GOOGLE_MAPS_API_KEY}&origins=${body.origins}&destinations=${body.destinations}&units=imperial`
        );
        result.data["geometry"] = res.data.results[0].geometry.location;
        return result.data;
      }
    } catch (error) {
      const { response } = error;
      const { request, ...errorObject } = response; // take everything but 'request'
      return errorObject.data;
    }
  },
  cloverOrder: async (ctx) => {
    let orderInfo,
      order = null;

    try {
      const body = ctx.request.body;
      const card = { card: body.card };
      const merchant_id = body.merchant_id;
      const customerInfo = body.customerInfo;
      const { pakms_apikey, access_token } = await getPakms(merchant_id);
      console.log("pakms_apikey", pakms_apikey);
      console.log("access_token", access_token);
      const token = await createCardToken(card, pakms_apikey);
      // console.log("create token", token);
      // console.log(
      //   "-------------------------------------------------------------------"
      // );
      if (token)
        order = await buildOrder(body.orderCart, access_token, merchant_id);
      // console.log("create order", order);
      // console.log(
      //   "-------------------------------------------------------------------"
      // );
      if (order)
        orderInfo = await orderPayment(
          order.id,
          token.id,
          access_token,
          customerInfo
        );
      // console.log("create orderInfo", orderInfo);
      // console.log(
      //   "-------------------------------------------------------------------"
      // );
      if (orderInfo) {
        orderInfo["createdOrders"] = order;
      }
      return orderInfo;
    } catch (err) {
      return err;
    }
  },
};
