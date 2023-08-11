require("dotenv").config();
const axios = require("axios");
const CLOVER_APP = process.env.CLOVER_APP;
const CLOVER_APP_ID = process.env.CLOVER_APP_ID;
const ACCESS_TOKEN = process.env.CLOVER_ACCESS_TOKEN;
const ENVIRONMENT = process.env.ENVIRONMENT;
const API_KEY = process.env.API_KEY;
const MERCHANT_ID = process.env.CLOVER_MERCHANT_ID;
const CLOVER_ECOMMERCE_API_TOKEN = process.env.CLOVER_ECOMMERCE_API_TOKEN;
const CLOVER_PAKMS_API_KEY = process.env.CLOVER_PAKMS_API_KEY;
const Clover = require("clover-ecomm-sdk");
const sdk = require("api")("@clover-platform/v3#1sr4iljgx5yiu");
const cloverInst = new Clover(ACCESS_TOKEN, {
  environment: ENVIRONMENT,
});

//service
const createCardToken = async (card) => {
  const headers = {
    "Content-Type": "application/json",
    accept: "application/json",
    apikey: CLOVER_PAKMS_API_KEY,
  };
  try {
    // @ts-ignore
    const result = await axios.post(
      "https://token-sandbox.dev.clover.com/v1/tokens",
      card,
      {
        headers: headers,
      }
    );
    return result.data;
  } catch (error) {
    const { response } = error;
    const { request, ...errorObject } = response; // take everything but 'request'
    console.log(
      "-----------------------TOKEN ERROR--------------------------------------------"
    );
    console.log(errorObject.data);
    return errorObject.data;
  }
};

const buildOrder = async (items, currency, email) => {
  const body = { orderCart: items };
  const headers = {
    "Content-Type": "application/json",
    accept: "application/json",
    authorization: `Bearer ${ACCESS_TOKEN}`,
  };
  try {
    // @ts-ignore
    const result = await axios.post(
      `https://sandbox.dev.clover.com/v3/merchants/${MERCHANT_ID}/atomic_order/orders`,
      body,
      {
        headers: headers,
      }
    );
    return result.data;
  } catch (error) {
    const { response } = error;
    const { request, ...errorObject } = response; // take everything but 'request'
    console.log(
      "----------------------ORDER ERROR--------------------------------------------"
    );
    console.log(errorObject.data);

    return errorObject.data;
  }
};
const orderPayment = async (order, token) => {
  // const options = {
  //   method: "POST",
  //   headers: {
  //     accept: "application/json",
  //     "content-type": "application/json",
  //     authorization: `Bearer ${ACCESS_TOKEN}`,
  //   },
  //   body: JSON.stringify({ ecomind: "ecom", source: token }),
  // };

  // fetch(`https://scl-sandbox.dev.clover.com/v1/orders/${order}/pay`, options)
  //   .then((response) => response.json())
  //   .then((response) => console.log(response))
  //   .catch((err) => console.error(err));

  const headers = {
    "Content-Type": "application/json",
    accept: "application/json",
    authorization: `Bearer ${ACCESS_TOKEN}`,
  };
  const body = {
    ecomind: "ecom",
    source: token,
    ///customer: "John Doe", need to add customer info to order
    email: "kfjsalfk@lkajsf.com",
  };
  try {
    // @ts-ignore
    const result = await axios.post(
      `https://scl-sandbox.dev.clover.com/v1/orders/${order}/pay`,
      body,
      {
        headers: headers,
      }
    );
    return result.data;
  } catch (error) {
    const { response } = error;
    const { request, ...errorObject } = response; // take everything but 'request'
    console.log(
      "--------------------- PAYMENT ERROR--------------------------------------------"
    );
    console.log(errorObject.data);

    return errorObject.data;
  }
};
module.exports = {
  cloverGetAuth: async (ctx) => {
    let orderInfo,
      order = null;
    try {
      const body = ctx.request.body;
      const card = { card: body.card };
      const token = await createCardToken(card);
      console.log("create token", token);
      console.log(
        "-------------------------------------------------------------------"
      );
      if (token)
        order = await buildOrder(
          body.orderCart,
          body.currency,
          body.user.email
        );
      console.log("create order", order);
      console.log(
        "-------------------------------------------------------------------"
      );
      if (order) orderInfo = await orderPayment(order.id, token.id);
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
