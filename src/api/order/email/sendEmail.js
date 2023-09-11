const { htmlTemplate } = require("./orderTemplate");
const _ = require("lodash");

const sendEmail = async (ctx) => {
  const { resOrder, entry, type } = ctx;
  let subject = "";
  if (type === "new") {
    subject = "New Order";
  } else {
    subject = "Order Update";
  }

  const user = {
    email: resOrder.email,
    subject,
  };

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
  return { message: "success" };
};
module.exports = sendEmail;
