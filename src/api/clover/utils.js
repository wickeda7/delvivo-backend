require("dotenv").config();
const axios = require("axios");
const CLOVER_PAKMS_API_KEY = process.env.CLOVER_PAKMS_API_KEY;
const ACCESS_TOKEN = process.env.CLOVER_ACCESS_TOKEN;
const MERCHANT_ID = process.env.CLOVER_MERCHANT_ID;
const CLOVER_APP_ID = process.env.CLOVER_APP_ID;
const CLOVER_APP_SECRET = process.env.CLOVER_APP_SECRET;

const getPakms = async (merchant_id) => {
  const entry = await strapi.db.query("api::merchant.merchant").findOne({
    where: { merchant_id: merchant_id },
  });
  return entry;
};

const getAuth = async (code, employee_id, merchant_id) => {
  // https://sandbox.dev.clover.com/v3/merchants/mId/?expand=owner
  let apiAccessKey = "";
  try {
    // @ts-ignore
    const token = await axios.get(
      `https://sandbox.dev.clover.com/oauth/token?client_id=${CLOVER_APP_ID}&client_secret=${CLOVER_APP_SECRET}&code=${code}`
    );
    console.log("token", token.data);
    if (token.data.access_token) {
      const headers = {
        "Content-Type": "application/json",
        accept: "application/json",
        authorization: `Bearer ${token.data.access_token}`,
      };
      // @ts-ignore
      const result = await axios.get(
        `https://apisandbox.dev.clover.com/pakms/apikey`,
        {
          headers: headers,
        }
      );
      console.log("result", result.data);
      apiAccessKey = result.data.apiAccessKey;
    }
    const entry = await getPakms(merchant_id);
    if (entry) {
      const update = await strapi.db.query("api::merchant.merchant").update({
        where: { merchant_id: merchant_id },
        data: {
          access_token: token.data.access_token,
          pakms_apikey: apiAccessKey,
        },
      });
    } else {
      const entry = await strapi.db.query("api::merchant.merchant").create({
        data: {
          access_token: token.data.access_token,
          pakms_apikey: apiAccessKey,
          merchant_id: merchant_id,
          employee_id: employee_id,
          client_id: CLOVER_APP_ID,
        },
      });
    }
    console.log("entry", entry);
    return {
      access_token: token.data.access_token,
    };
  } catch (error) {
    const { response } = error;
    const { request, ...errorObject } = response; // take everything but 'request'
    console.log(
      "-----------------------getAuth ERROR--------------------------------------------"
    );
    console.log(errorObject.data);
    return errorObject.data;
  }
};
const createCardToken = async (card, pakms_apikey) => {
  const headers = {
    "Content-Type": "application/json",
    accept: "application/json",
    apikey: pakms_apikey,
  };
  try {
    const data = card.card;
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

const buildOrder = async (items, access_token, merchant_id) => {
  const body = { orderCart: items };
  console.log("body", body.orderCart.lineItems);
  const headers = {
    "Content-Type": "application/json",
    accept: "application/json",
    authorization: `Bearer ${access_token}`,
  };
  console.log(
    `https://sandbox.dev.clover.com/v3/merchants/${merchant_id}/atomic_order/orders`
  );
  console.log(`Bearer ${ACCESS_TOKEN}`);
  try {
    // @ts-ignore
    const result = await axios.post(
      `https://sandbox.dev.clover.com/v3/merchants/${merchant_id}/atomic_order/orders`,
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
const orderPayment = async (order, token, access_token) => {
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
    authorization: `Bearer ${access_token}`,
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
  createCardToken,
  buildOrder,
  orderPayment,
  getAuth,
  getPakms,
};
