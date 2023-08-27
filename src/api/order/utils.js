"use strict";
require("dotenv").config();
const axios = require("axios");
const utils = require("@strapi/utils");
const CLOVER_APP_URL = process.env.CLOVER_APP_URL;

const { ApplicationError } = utils.errors;
const getCloverOrders = async (ctx) => {
  console.log("ctx", ctx.params);
  const axios = require("axios");
  const from = "clientCreatedTime<1693119599000";
  const to = "clientCreatedTime>1692514800000";
  const expand = "payments,lineItems,orderType,credits,customers";
  const options = {
    method: "GET",
    url: `https://sandbox.dev.clover.com/v3/merchants/M04E9FZBWVB71/orders?filter=${from}&filter=${to}&expand=${expand}`,
    headers: {
      accept: "application/json",
      authorization: "Bearer 645ba9d6-9cf7-4b0c-3785-6f8fb109779b",
    },
  };
  try {
    // @ts-ignore
    const result = await axios.request(options);
    //console.log("result", result.data);
    return result.data;
  } catch (error) {
    console.log(error);
  }

  //   axios
  //     .request(options)
  //     .then(function (response) {
  //       //console.log(response.data);
  //       return response.data;
  //     })
  //     .catch(function (error) {
  //       console.error(error);
  //     });
};

const addOrder = async (body) => {
  if (body.order) {
    const {
      order: { cloverId, id, created, items },
    } = body;
    const data = {
      cloverId,
      created,
      orderId: id,
      merchant_id: body.merchant_id,
      orderContent: JSON.stringify(body.order),
    };
    const entry = await strapi.db
      .query("api::order.order")
      .create({ data: data });
    if (entry.id) {
      try {
        await getItems(entry.id, items, body.access_token, body.merchant_id);
      } catch (error) {
        throw new Error(error.message);
      }
    }
  } else {
    const data = { itemContent: JSON.stringify(body.items) };
    try {
      const entry = await strapi.db
        .query("api::order.order")
        .update({ where: { id: body.entryId }, data: data });
    } catch (error) {
      throw new Error(error.message);
    }
  }
};
const getItems = async (entryId, items, access_token, merchant_id) => {
  const ids = items.map(({ inventory_id }) => inventory_id);

  const headers = {
    "Content-Type": "application/json",
    accept: "application/json",
    authorization: `Bearer ${access_token}`,
  };
  try {
    const idsMap = ids
      .map(function (item) {
        return "'" + item + "'";
      })
      .join(",");

    //@ts-ignore
    const res = await axios.get(
      `${CLOVER_APP_URL}/v3/merchants/${merchant_id}/items?filter=item.id in (${idsMap})&expand=menuItem`,
      {
        headers: headers,
      }
    );

    if (res.data) {
      addOrder({ items: res.data, entryId });
    }
  } catch (error) {
    const { response } = error;
    const { request, ...errorObject } = response; // take everything but 'request'

    throw new Error(errorObject.data.message);
  }
};

module.exports = { getCloverOrders, addOrder };
