const sendEmail = require("../../email/sendEmail");
module.exports = {
  async afterCreate(event, options) {
    const {
      result: { id, orderId, created, orderContent },
    } = event;
    const order = JSON.parse(orderContent);
    setTimeout(async () => {
      const entry = await strapi.entityService.findOne("api::order.order", id, {
        fields: ["itemContent"],
        populate: ["user"],
      });
      console.log("Entry", entry);
      try {
        await sendEmail({ type: "new", resOrder: order, entry });
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
