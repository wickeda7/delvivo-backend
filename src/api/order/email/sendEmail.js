const { htmlTemplate } = require("./orderTemplate");
const _ = require("lodash");

const sendEmail = async (ctx) => {
  const { resOrder, entry, type } = ctx;

  let subject = "";
  if (type === "new") {
    subject = "New Order";
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
  const orderTemplate = htmlTemplate({ resOrder, entry });
  try {
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
    return { message: "error", error };
  }
};
module.exports = sendEmail;
