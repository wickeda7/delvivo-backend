"use strict";
require("dotenv").config();
const axios = require("axios");
const utils = require("@strapi/utils");
const CLOVER_APP_URL = process.env.CLOVER_APP_URL;
//const { readFile, writeFile } = require("./test");
const fs = require("fs");

const { ApplicationError } = utils.errors;

const getCloverOrders = async (ctx) => {
  const { from, to, merchantId, accesToken } = ctx.params;

  /// cloverId 3SMH16F5SHHRA
  const expand = "payments,lineItems,orderType,credits,customers"; //  from: '1693033200000' 26, to: ''1693206000000'',
  const options = {
    method: "GET",
    url: `https://sandbox.dev.clover.com/v3/merchants/${merchantId}/orders?filter=clientCreatedTime>${from}&filter=clientCreatedTime<${to}&expand=${expand}`,
    headers: {
      accept: "application/json",
      authorization: `Bearer ${accesToken}`,
    },
  };
  try {
    // @ts-ignore
    const result = await axios.request(options);
    let data = result.data.elements;
    // user id = 54 relation with customer field in orders table
    console.log("data", data);
    let paidOrders = data.reduce(
      function (accumulator, curValue) {
        if (curValue.paymentState === "PAID") {
          const connect = { id: 54 };
          let order = {
            cloverId: "3SMH16F5SHHRA", // temp for testing only get it from title field later
            created: curValue.createdTime,
            customer: "Hung Test",
            orderId: curValue.id,
            merchant_id: merchantId,
            orderContent: JSON.stringify(curValue),
            user: connect,
          };
          let item = {
            orderId: curValue.id,
            lineItems: curValue.lineItems.elements,
          };
          if (accumulator) {
            accumulator.orders.push(order);
            accumulator.items.push(item);
          }
        }
        return accumulator;
      },
      { orders: [], items: [] }
    );

    //const paidOrders = readFile("./test.json");
    console.log("paidOrders", paidOrders);
    if (paidOrders.orders.length > 0) {
      const orderRes = await addOrderBulk(paidOrders.orders, "create"); /// add orders to db
      const itemRes = await getItemsBulk(
        paidOrders.items,
        accesToken,
        merchantId
      );
    }

    return;
  } catch (error) {
    console.log(error);
  }
};
const addOrderBulk = async (data, type) => {
  try {
    if (type === "update") {
      return await strapi.db.query("api::order.order").updateMany(data);
    } else {
      return await strapi.db.query("api::order.order").createMany({ data });
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
const addOrder = async (body) => {
  if (body.order) {
    const {
      order: { userId, cloverId, id, created, items },
    } = body;
    const connect = { id: userId };
    const data = {
      // maybe add customer id here
      cloverId,
      created,
      orderId: id,
      user: connect,
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
const getItemsBulk = async (items, accesToken, merchantId) => {
  let totalItemIds = []; // get total item ids to get details from clover

  const data = items.reduce((accumulator, curValue) => {
    const ids = curValue.lineItems.reduce((acc, val) => {
      return acc.concat(val.item.id);
    }, []);
    totalItemIds = totalItemIds.concat(ids);
    return accumulator.concat({ orderid: curValue.orderId, itemIds: ids });
  }, []);
  //
  const res = await getCloverItems(totalItemIds, accesToken, merchantId);
  // console.log("res", res.data);
  if (res.data) {
    //writeFile("./test2.json",res.data);
    const itemsData = res.data.elements.reduce((accumulator, curValue) => {
      accumulator[curValue.id] = curValue;
      return accumulator;
    }, []);
    for (var item of data) {
      let params = {};
      //let elements = [];
      const orderId = item.orderid;
      params.where = { orderId };
      const elements = item.itemIds.reduce((acc, val) => {
        acc.push(itemsData[val]);
        return acc;
      }, []);
      params.data = {
        itemContent: JSON.stringify(elements),
      };
      const res = await addOrderBulk(params, "update");
      console.log("res", res);
    }
  }
  // const itemsRes = readFile("./test2.json");

  // console.log("data", data);
  // console.log("itemsData", itemsData);
};
const getCloverItems = async (ids, access_token, merchant_id) => {
  const headers = {
    "Content-Type": "application/json",
    accept: "application/json",
    authorization: `Bearer ${access_token}`,
  };

  // @ts-ignore
  let itemIds = [...new Set(ids)]; // remove duplicate ids
  const idsMap = itemIds
    .map(function (item) {
      return "'" + item + "'";
    })
    .join(",");

  try {
    //@ts-ignore
    const res = await axios.get(
      `${CLOVER_APP_URL}/v3/merchants/${merchant_id}/items?filter=item.id in (${idsMap})&expand=menuItem`,
      {
        headers: headers,
      }
    );
    return res;
  } catch (error) {
    const { response } = error;
    const { request, ...errorObject } = response; // take everything but 'request'

    throw new Error(errorObject.data.message);
  }
};
const getItems = async (entryId, items, access_token, merchant_id) => {
  const ids = items.map(({ inventory_id }) => inventory_id);
  const res = await getCloverItems(ids, access_token, merchant_id);
  if (res.data) {
    addOrder({ items: res.data, entryId });
  }
};

const formatPrice = (number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number / 100);
};

module.exports = { getCloverOrders, addOrder, formatPrice };
