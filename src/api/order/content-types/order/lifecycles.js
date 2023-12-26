const {
  sendCustomerEmail,
  sendMerchantEmail,
} = require("../../email/sendEmail");
const { pushNotification } = require("../../pushToken");
module.exports = {
  async afterUpdate(event, options) {
    const { result, params } = event;
    let pushToken = null;
    console.log("afterUpdate", result.user);
    console.log("params", params);
    const departureTime = params.data.departureTime;
    if (result.user) {
      pushToken = result.user.pushToken;
    }
    console.log("pushToken", pushToken);

    if (pushToken && departureTime) {
      let temp = [];
      temp.push(pushToken);
      // @ts-ignore
      pushNotification(temp, result);
    }
    const updateType = result.putType;
    if (updateType === "Mobile") {
      // @ts-ignore
      strapi.ioServer.emit("updateOrder", result);
    }
    //io.sockets.emit('new-message', {data: data, item: num});
    //   socket.on('new-message', function(msgData){
    //     if (msgData.item === xx) {
    //         // handle just a particular message number here
    //     }
    // }
  },
  async afterCreate(event, options) {
    let order = {};
    const {
      result: { id, orderId, merchant_id, createdAt, order_content },
    } = event;
    if (typeof order_content === "object") {
      order = order_content;
    } else {
      order = JSON.parse(order_content);
    }
    try {
      await sendMerchantEmail(orderId, merchant_id, createdAt, order);
      console.log("sendMerchantEmail", orderId);
    } catch (error) {
      console.log(error);
    }
    setTimeout(async () => {
      const entry = await strapi.entityService.findOne("api::order.order", id, {
        fields: ["itemContent"],
        populate: ["user"],
      });
      try {
        await sendCustomerEmail({ type: "new", resOrder: order, entry });
        // @ts-ignore
        strapi.ioServer.emit("newOrder", { order: event.result, entry });
        console.log("sendCustomerEmail", orderId);
      } catch (error) {
        console.log(error);
      }
    }, 5000);
  },
};
