const { htmlTemplate } = require("./orderTemplate");
const _ = require("lodash");

const sendCustomerEmail = async (ctx) => {
  const { resOrder, entry, type } = ctx;

  let subject = "";
  if (type === "new") {
    subject = "New Order from Delvivo";
  } else {
    resOrder["type"] = type;
    subject = resOrder.isPickup
      ? "Your Order Is Ready For Pickup"
      : "Your Order Is On The Way";
  }

  const user = {
    email: resOrder.email,
    subject,
  };
  //console.log("sendCustomerEmail", resOrder, entry);
  try {
    const orderTemplate = htmlTemplate({ resOrder, entry });
    await strapi.plugins["email"].services.email.sendTemplatedEmail(
      {
        to: user.email,
        // from: is not specified, the defaultFrom is used.
      },
      orderTemplate,
      {
        user: _.pick(user, ["subject", "email"]),
      }
    );
    return { status: "success" };
  } catch (error) {
    console.log("error", error);
    return { message: "error", error };
  }
};
const sendMerchantEmail = async (orderId, merchant_id, createdAt, order) => {
  const daten = new Date(createdAt);
  const date = daten.toLocaleDateString();
  const time = daten.toLocaleTimeString();
  const subject = `New Order at ${time} on ${date}`;
  const text = `New order #${orderId} on ${date} at ${time} ${order.createdOrders.note}`;
  const entry = await strapi.db.query("api::merchant.merchant").findOne({
    where: { merchant_id: merchant_id },
  });
  const { notify_email } = entry;

  if (!notify_email) {
    return;
  }
  try {
    await strapi.plugins["email"].services.email.send({
      to: notify_email,
      subject: subject,
      text: text, // Replace with a valid field ID
      // html: 'Hello world!',
    });
  } catch (err) {
    console.log("err,err,err", err);
  }
};
module.exports = { sendCustomerEmail, sendMerchantEmail };
