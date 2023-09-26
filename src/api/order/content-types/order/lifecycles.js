const {
  sendCustomerEmail,
  sendMerchantEmail,
} = require("../../email/sendEmail");
module.exports = {
  async afterUpdate(event, options) {
    const { result, params } = event;
    //console.log("afterUpdate result", result);
    const updateType = result.putType;
    if (updateType === "Mobile") {
      // @ts-ignore
      strapi.ioServer.emit("updateOrder", result);
    }
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
      } catch (error) {
        console.log(error);
      }
    }, 5000);

    /*

  
  
}
Order id 15
Order order id CF650V2M7XXA6
Order created 2023-09-11T04:39:49.000Z
*/
    //         const { id, email } = order;
    //         const { subject, text, html } = orderTemplate2;
    //         const templateVars = {
    //             id,
    //             email,
    //         };
    //         const template = new Template({
    //             subject,
    //             text,
    //             html,
    //         });
    //         const templateEmail = await template.compile(templateVars);
    //         const emailData = {
    //             to: email,
    //             from: "",
  },
};
