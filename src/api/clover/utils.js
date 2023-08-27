require("dotenv").config();
const axios = require("axios");
const CLOVER_APP_ID = process.env.CLOVER_APP_ID;
const CLOVER_APP_SECRET = process.env.CLOVER_APP_SECRET;
const CLOVER_APP_URL = process.env.CLOVER_APP_URL;
const CLOVER_APIS_URL = process.env.CLOVER_APIS_URL;
const CLOVER_TOKEN_URL = process.env.CLOVER_TOKEN_URL;
const CLOVER_SCL_URL = process.env.CLOVER_SCL_URL;

const getPakms = async (merchant_id) => {
  const entry = await strapi.db.query("api::merchant.merchant").findOne({
    where: { merchant_id: merchant_id },
  });
  return entry;
};

const getAccessToken = async (code) => {
  // @ts-ignore
  const token = await axios.get(
    `${CLOVER_APP_URL}/oauth/token?client_id=${CLOVER_APP_ID}&client_secret=${CLOVER_APP_SECRET}&code=${code}`
  );
  return token.data.access_token;
};

const getMerchantName = async (merchant_id, access_token) => {
  const headers = {
    "Content-Type": "application/json",
    accept: "application/json",
    authorization: `Bearer ${access_token}`,
  };
  try {
    //https://sandbox.dev.clover.com/v3/merchants/mId/?expand=owner
    // @ts-ignore
    const res = await axios.get(
      `${CLOVER_APP_URL}/v3/merchants/${merchant_id}`,
      {
        headers: headers,
      }
    );
    return res.data.name;
  } catch (error) {
    const { response } = error;
    const { request, ...errorObject } = response; // take everything but 'request'
    console.log(
      "-----------------------getAuth ERROR--------------------------------------------"
    );
    console.log(errorObject.data);
  }
};

const createPakms = async (access_token) => {
  const headers = {
    "Content-Type": "application/json",
    accept: "application/json",
    authorization: `Bearer ${access_token}`,
  };

  // @ts-ignore
  const result = await axios.get(`${CLOVER_APIS_URL}/pakms/apikey`, {
    headers: headers,
  });
  console.log("result", result.data);
  return result.data.apiAccessKey;
};

const updateMerchantDB = async (
  type,
  merchant_id,
  merchant_name,
  access_token,
  apiAccessKey,
  employee_id,
  orderTypes
) => {
  let data = { access_token, apiAccessKey };
  let entry = null;
  if (type === "update") {
    data = {
      merchant_name,
      access_token,
      apiAccessKey,
      order_types: orderTypes,
    };
    entry = await strapi.db
      .query("api::merchant.merchant")
      .update({ where: { merchant_id: merchant_id }, data: data });
  } else {
    data = {
      access_token,
      apiAccessKey,
      merchant_id,
      merchant_name,
      employee_id,
      client_id: CLOVER_APP_ID,
      order_types: orderTypes,
    };
    entry = await strapi.db
      .query("api::merchant.merchant")
      .create({ data: data });
  }
  return entry;
};

const createOrderTypes = async (access_token, merchant_id) => {
  let orderTypes = {};
  const pickup = {
    taxable: true,
    isDefault: "false",
    filterCategories: "false",
    isHidden: "false",
    isDeleted: "false",
    label: "Delvivo In-store Pickup",
    labelKey: "PICKUP",
    systemOrderTypeId: "PICK-UP-TYPE",
  };
  const delivery = {
    taxable: true,
    isDefault: "false",
    filterCategories: "false",
    isHidden: "false",
    isDeleted: "false",
    label: "Delvivo Local Delivery",
    minOrderAmount: 2500,
    maxRadius: 25,
    fee: 0,
    systemOrderTypeId: "DELIVERY-TYPE",
  };
  const headers = {
    "Content-Type": "application/json",
    accept: "application/json",
    authorization: `Bearer ${access_token}`,
  };
  // @ts-ignore
  const pickupRes = await axios.post(
    `${CLOVER_APP_URL}/v3/merchants/${merchant_id}/order_types`,
    pickup,
    {
      headers: headers,
    }
  );
  console.log("pickupRes", pickupRes.data);
  if (pickupRes.data.id) {
    orderTypes.pickup = { id: pickupRes.data.id };
    // @ts-ignore
    const deliveryRes = await axios.post(
      `${CLOVER_APP_URL}/v3/merchants/${merchant_id}/order_types`,
      delivery,
      {
        headers: headers,
      }
    );
    console.log("deliveryRes", deliveryRes.data);
    if (deliveryRes.data.id) {
      orderTypes.delivery = {
        id: deliveryRes.data.id,
        fee: deliveryRes.data.fee,
        maxRadius: deliveryRes.data.maxRadius,
        minOrderAmount: deliveryRes.data.minOrderAmount,
      };
    }
  }
  return orderTypes;
};
const getAuth = async (code, employee_id, merchant_id) => {
  // https://sandbox.dev.clover.com/v3/merchants/mId/?expand=owner
  let apiAccessKey = "";
  let merchant_name = "";
  try {
    // // create access token
    const access_token = await getAccessToken(code);
    if (access_token) {
      // create pakms api key
      apiAccessKey = await createPakms(access_token);
      // get merchant name
      merchant_name = await getMerchantName(merchant_id, access_token);
    }
    // // create order types
    const orderTypes = await createOrderTypes(access_token, merchant_id);

    // update merchant db
    const entry = await getPakms(merchant_id);
    console.log("entry", entry.access_token);
    const type = entry ? "update" : "create";
    updateMerchantDB(
      type,
      merchant_id,
      merchant_name,
      access_token,
      apiAccessKey,
      employee_id,
      JSON.stringify(orderTypes)
    );
    return {
      access_token,
      orderTypes,
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
    const result = await axios.post(`${CLOVER_TOKEN_URL}/v1/tokens`, card, {
      headers: headers,
    });
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

  try {
    // @ts-ignore
    const result = await axios.post(
      `${CLOVER_APP_URL}/v3/merchants/${merchant_id}/atomic_order/orders`,
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

const orderPayment = async (order, token, access_token, customerInfo) => {
  const headers = {
    "Content-Type": "application/json",
    accept: "application/json",
    authorization: `Bearer ${access_token}`,
  };
  const body = {
    ecomind: "ecom",
    source: token,
    //customer: customerInfo.customerId, ///response The customer does not have a Card on File. need to save customer id and transaction id to order table
    email: customerInfo.email,
    // customerId: customerInfo.customerId,
  };
  try {
    // @ts-ignore
    const result = await axios.post(
      `${CLOVER_SCL_URL}/v1/orders/${order}/pay`,
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
