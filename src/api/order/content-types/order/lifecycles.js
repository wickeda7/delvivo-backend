const {
  sendCustomerEmail,
  sendMerchantEmail,
} = require("../../email/sendEmail");

const { pushNotification } = require("../../pushToken");
module.exports = {
  async afterUpdate(event, options) {
    const { result, params } = event;
    const merchant_id = result.merchant_id;
    let pushToken = null;
    const departureTime = params.data.departureTime;
    if (result.user) {
      pushToken = result.user.pushToken;
    }
    const socketId = await strapi.plugins["rest-cache"].services.cacheStore.get(
      merchant_id
    );
    if (pushToken && departureTime) {
      let temp = [];
      temp.push(pushToken);
      // @ts-ignore
      pushNotification(temp, result);
    }
    const userid = result.user.id;
    const socketuserId = await strapi.plugins[
      "rest-cache"
    ].services.cacheStore.get(userid);
    if (socketuserId) {
      const data = { id: result.id };
      if (params.data.departureTime)
        data.departureTime = params.data.departureTime;
      if (params.data.arriveTime) data.arriveTime = params.data.arriveTime;
      // @ts-ignore
      strapi.ioServer.to(socketuserId).emit("updateOrder", data);
    }

    const updateType = result.putType;
    if (updateType === "Mobile") {
      // @ts-ignore
      // strapi.ioServer.emit("updateOrder", result);
      try {
        // console.log("socketId", socketId);
        // @ts-ignore
        strapi.ioServer.to(socketId).emit("updateOrder", result);
      } catch (error) {
        console.log(error);
      }
    }
  },
  async afterCreate(event, options) {
    let order = {};
    const {
      result: { id, orderId, merchant_id, createdAt, order_content },
    } = event;
    const socketMechant = await strapi.plugins[
      "rest-cache"
    ].services.cacheStore.get(merchant_id);
    console.log("socketId22", socketMechant);
    if (typeof order_content === "object") {
      order = order_content;
    } else {
      order = JSON.parse(order_content);
    }
    try {
      await sendMerchantEmail(orderId, merchant_id, createdAt, order);
    } catch (error) {
      console.log(error);
    }
    setTimeout(async () => {
      const entry = await strapi.entityService.findOne("api::order.order", id, {
        fields: ["itemContent"],
        populate: ["user"],
      });
      try {
        const socketuserId = await strapi.plugins[
          "rest-cache"
        ].services.cacheStore.get(`drivers_${merchant_id}`);
        await sendCustomerEmail({ type: "new", resOrder: order, entry });
        // @ts-ignore
        strapi.ioServer
          .to(socketMechant)
          .emit("newOrder", { order: event.result, entry });
        console.log("socketuserId", socketuserId);
      } catch (error) {
        console.log(error);
      }
    }, 5000);
  },
};
