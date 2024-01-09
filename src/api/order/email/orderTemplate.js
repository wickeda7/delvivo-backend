const { templateHeader } = require("./templateHeader");
const { templateOrderType } = require("./templateOrderType");
const { templateFooter } = require("./templateFooter");
const { templateFooter2 } = require("./templateFooter2");
const { templateCSS } = require("./templateCSS");
const { templateConfirm } = require("./templateConfirm");
const { templateLineItems } = require("./templateLineItems");
const { templateTotal } = require("./templateTotal");
const { templatePaymentInfo } = require("./templatePaymentInfo");
const { formatPrice } = require("../utils");
require("dotenv").config();

const htmlTemplate = (data) => {
  data.resOrder =
    typeof data.resOrder === "string"
      ? JSON.parse(data.resOrder)
      : data.resOrder;
  const {
    resOrder: {
      id,
      amount,
      tax_amount,
      created,
      items,
      createdOrders: {
        orderType: { label },
        note,
      },
      source: { brand, last4, name: cardName },
      path,
    },
    entry: {
      itemContent,
      user: { lastName, firstName, email, address, city, state, zip },
    },
  } = data;
  console.log("htmlTemplate", data.resOrder);
  let track = false;
  let url = "";
  const HOST_URL = process.env.HOST_URL;
  let confirmData = {};
  const name = firstName + " " + lastName;
  const dateObject = new Date(created);
  const date = dateObject.toLocaleString();
  console.log("path", path);
  if (path) {
    track = true;
    url = `${HOST_URL}/maps/${id}/${path.id}`;
  }
  if (data.resOrder.type) {
    const title = data.resOrder.isPickup
      ? "Your order is ready!"
      : "Your order is on the way!";
    const message1 = data.resOrder.isPickup
      ? "You may pick up your order at any time."
      : "Please expect your order to arrive soon.";
    confirmData = {
      name: name,
      oderId: id,
      date,
      title: title,
      message1: message1,
      message2: "",
      track,
      url,
    };
  } else {
    confirmData = {
      name: name,
      oderId: id,
      date,
      title: "Order Confirmed",
      message1: "We've got your order!",
      message2: "We'll drop you another email when your order is ready.",
      track,
      url,
    };
  }
  const confirm = templateConfirm(confirmData);
  let lineItems = [];
  if (typeof itemContent === "object") {
    lineItems = itemContent.elements;
  } else {
    lineItems = JSON.parse(itemContent).elements;
  }

  const orderItems = items.reduce((acc, item) => {
    const { parent, amount, quantity, description } = item;
    const lineItem = lineItems.find((item) => item.id === parent);
    const price = formatPrice(amount * quantity);
    acc.push({
      parent,
      price,
      quantity,
      description,
      name: lineItem.menuItem.name,
      image: lineItem.menuItem.imageFilename,
    });
    return acc;
  }, []);
  const lineItemsTemp = templateLineItems(orderItems);

  const total = templateTotal({
    total: formatPrice(amount),
    subtotal: formatPrice(amount - tax_amount),
    tax: formatPrice(tax_amount),
    orderType: label,
  });

  const paymentInfo = templatePaymentInfo({
    brand,
    last4,
    total: formatPrice(amount),
    cardName,
  });

  let saddress, scity, sState;
  const splitted = note.split(":");
  if (splitted[0] === "Pickup at") {
    saddress = splitted[1] + ":" + splitted[2];
    scity = "";
    sState = "";
  } else {
    [saddress, scity, sState] = splitted[1].split(",");
    scity = scity + ",";
  }

  const addressInfo = templateOrderType({
    bname: name,
    baddress: address,
    bcity: city,
    bstate: state,
    bzip: zip,
    bemail: email,
    sorderType: splitted[0],
    sname: name,
    saddress,
    scity,
    sState,
  });

  const html = `
  <body class="body" id="body" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" bgcolor="#EADED7" style="-webkit-text-size-adjust: none; -ms-text-size-adjust: none; margin: 0; padding: 0;">
    <!--[if !mso 9]><!-->
      <div style="display: none; overflow: hidden; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; mso-hide: all;">
        We've got your order! We'll drop you another email when your order is ready.
      </div>
    <!--<![endif]-->
      <!-- BEGIN: CONTAINER -->
      <table class="container container_full" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse; min-width: 100%;" role="presentation" bgcolor="#EADED7">
        <tbody>
          <tr>
            <th valign="top" style="mso-line-height-rule: exactly;">
              <center style="width: 100%;">
                <table border="0" width="600" cellpadding="0" cellspacing="0" align="center" style="width: 600px; min-width: 600px; max-width: 600px; margin: auto;" class="email-container" role="presentation">
                  <tbody
                  <tr>
                    <th valign="top" style="mso-line-height-rule: exactly;">
                          <!-- BEGIN : SECTION : HEADER -->${templateHeader}<!-- END : SECTION : HEADER -->
                      <!-- BEGIN : SECTION : MAIN -->
                      <table class="section_wrapper main" data-id="main" id="section-main" border="0" width="100%" cellpadding="0" cellspacing="0" align="center" style="min-width: 100%;" role="presentation" bgcolor="#ffffff">
                        <tbody>
                          <tr>
                          <td class="section_wrapper_th" style="mso-line-height-rule: exactly;" bgcolor="#ffffff">
                            <table border="0" width="100%" cellpadding="0" cellspacing="0" align="center" style="min-width: 100%;" id="mixContainer" role="presentation">
                              <tbody> ${confirm}
                                <!-- BEGIN SECTION: Products With Pricing -->
                                <tr id="section-1468271" class="section products_with_pricing">
                                  <th style="mso-line-height-rule: exactly; padding: 13px 52px;" bgcolor="#ffffff">
                                    <table class="table-inner" cellspacing="0" cellpadding="0" border="0" width="100%" style="min-width: 100%;" role="presentation">
                                      <tbody>
                                      <tr>
                                        <th class="product-table" style="mso-line-height-rule: exactly;" bgcolor="#ffffff" valign="top">
                                          <table cellspacing="0" cellpadding="0" border="0" width="100%" style="min-width: 100%;" role="presentation">
                                            <tbody>
                                                <tr>
                                                  <th colspan="2" class="product-table-h3-wrapper" style="mso-line-height-rule: exactly;" bgcolor="#ffffff" valign="top">
                                                    <h3 data-key="1468271_item" style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; color: #bdbdbd; font-size: 16px; line-height: 52px; font-weight: 700; text-transform: uppercase; border-bottom-width: 2px; border-bottom-color: #dadada; border-bottom-style: solid; letter-spacing: 1px; margin: 0;" align="left">
                                                      Items ordered
                                                    </h3>
                                                  </th>
                                                </tr>
                                                <!-- BEGIN : SECTION : LineItems -->${lineItemsTemp}<!-- END : SECTION : LineItems -->
                                            </tbody></table>
                                          </th>
                                        </tr>
                                        <tr>
                                          <th class="pricing-table" style="mso-line-height-rule: exactly; padding: 13px 0;" bgcolor="#ffffff" valign="top">
                                          <!-- BEGIN : SECTION : Total -->${total}<!-- END : SECTION : Total -->
                                            </th>
                                          </tr>
                                        </tbody></table>
                                      </th>
                                  </tr>
                                  <!-- END SECTION: Products With Pricing -->
                                  <!-- BEGIN SECTION: Payment Info -->
                                  <tr id="section-1468272" class="section payment_info">
                                    <th style="mso-line-height-rule: exactly; padding: 13px 52px;" bgcolor="#ffffff"><!-- PAYMENT INFO -->${paymentInfo}<!-- END SECTION: Payment Info --></th> 
                                  </tr>
                                  <!-- BEGIN SECTION: Customer And Shipping Address -->
                                  <tr id="section-1468273" class="section customer_and_shipping_address">
                                  <!-- BEGIN : 2 COLUMNS : BILL_TO -->
                                    <th style="mso-line-height-rule: exactly; padding: 13px 52px;" bgcolor="#ffffff"> ${addressInfo}</th>
                                  <!-- END : 2 COLUMNS : SHIP_TO -->
                                  </tr>
                                  <!-- END SECTION: Customer And Shipping Address -->
                                  <!-- BEGIN SECTION: Divider -->
                                  <tr id="section-1468275" class="section divider">
                                    <th style="mso-line-height-rule: exactly; padding: 26px 52px;" bgcolor="#ffffff">
                                      <table cellspacing="0" cellpadding="0" border="0" width="100%" role="presentation">
                                        <tbody><tr>
                                          <th style="mso-line-height-rule: exactly; border-top-width: 2px; border-top-color: #dadada; border-top-style: solid;" bgcolor="#ffffff" valign="top">
                                          </th>
                                        </tr>
                                      </tbody></table>
                                    </th>
                                  </tr>
                                  <!-- END SECTION: Divider -->
                                  ${templateFooter}
                              </tbody>
                            </table>
                          </td>
                          </tr>
                        </tbody>
                      </table>
                      <!-- END : SECTION : MAIN -->
                      <!-- BEGIN : SECTION : FOOTER -->${templateFooter2} <!-- END : SECTION : FOOTER -->
                    </th>
                  </tr>
                </tbody></table>
              </center>
            </th>
          </tr>
        </tbody>
      </table>
      <!-- END : CONTAINER -->
  </body>`;
  const template = {
    subject: "<%= user.subject %>",
    text: `We've got your order! We'll drop you another email when your order is ready.`,
    html: templateCSS + html,
  };
  return template;
};
module.exports = { htmlTemplate };
