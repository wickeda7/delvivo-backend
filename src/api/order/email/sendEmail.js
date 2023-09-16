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
  console.log("start");

  console.log("orderTemplate");
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
    console.log("email sent");
    return { status: "success" };
  } catch (error) {
    console.log("error", error);
    return { message: "error", error };
  }
};
module.exports = sendEmail;
