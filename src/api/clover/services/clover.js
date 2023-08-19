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

//service

module.exports = {
  cloverGetAuth: async (ctx) => {
    const body = ctx.request.body;
    try {
      const result = await getAuth(
        body.code,
        body.employee_id,
        body.merchant_id
      );
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
      const result = await axios.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json?key=${GOOGLE_MAPS_API_KEY}&origins=${body.origins}&destinations=${body.destinations}&units=imperial`
      );
      return result.data;
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

      const { pakms_apikey, access_token } = await getPakms(merchant_id);

      const token = await createCardToken(card, pakms_apikey);
      console.log("create token", token);
      console.log(
        "-------------------------------------------------------------------"
      );
      if (token)
        order = await buildOrder(body.orderCart, access_token, merchant_id);
      console.log("create order", order);
      console.log(
        "-------------------------------------------------------------------"
      );
      if (order)
        orderInfo = await orderPayment(order.id, token.id, access_token);
      console.log("create orderInfo", orderInfo);
      console.log(
        "-------------------------------------------------------------------"
      );
      return orderInfo;
    } catch (err) {
      return err;
    }
  },
};
