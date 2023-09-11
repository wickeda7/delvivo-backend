const _ = require("lodash");

const templateOrderType = (data) => {
  const template = `<table border="0" width="100%" cellpadding="0" cellspacing="0" align="center" style="min-width: 100%;" role="presentation">
        <tbody><tr>
        <!-- BEGIN : Column 1 of 2 : BILL_TO -->
          <th width="50%" class="column_1_of_2 column_bill_to " style="mso-line-height-rule: exactly;" align="left" bgcolor="#ffffff" valign="top">
            <table align="center" border="0" width="100%" cellpadding="0" cellspacing="0" style="min-width: 100%;" role="presentation">
              <tbody><tr>
                <th style="mso-line-height-rule: exactly; padding-right: 5%;" align="left" bgcolor="#ffffff" valign="top">
                  <h3 data-key="1468273_bill_to" style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; color: #bdbdbd; font-size: 16px; line-height: 52px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0;" align="left">Billing Info</h3>
                </th>
              </tr>
              <tr>
                <th class="billing_address " style="mso-line-height-rule: exactly; padding-right: 5%;" align="left" bgcolor="#ffffff" valign="top">
                  <p style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; margin: 0;" align="left">
                  <%- bname %><br>
                  <%- baddress %> <br>
                  <%- bcity %>,  <%- bstate %> <%- bzip %><br>
                      <a href="mailto:" style="color: #EADED7; text-decoration: none !important; text-underline: none; word-wrap: break-word;" target="_blank"><%- bemail %></a></p>
                </th>
              </tr></tbody>
            </table>
          </th>
        <!-- END : Column 1 of 2 : BILL_TO -->
        <!-- BEGIN : Column 2 of 2 : SHIP_TO -->
          <th width="50%" class="column_2_of_2 column_ship_to " style="mso-line-height-rule: exactly;" align="right" bgcolor="#ffffff" valign="top">
            <table align="center" border="0" width="100%" cellpadding="0" cellspacing="0" style="min-width: 100%;" role="presentation">
                <tbody><tr>
                  <th style="mso-line-height-rule: exactly; padding-left: 5%;" align="right" bgcolor="#ffffff" valign="top">
                    <h3 data-key="1468273_ship_to" style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; color: #bdbdbd; font-size: 16px; line-height: 52px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0;" align="right"><%- sorderType %><br></h3>
                  </th>
                </tr>
              <tr>
                <th class="shipping_address " style="mso-line-height-rule: exactly; padding-left: 5%;" align="right" bgcolor="#ffffff" valign="top">
                  <p style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; margin: 0;" align="right">
                  <%- sname %><br>
                  <%- saddress %><br> 
                  <%- scity %> <%- sState %><br>
                      </p>
                </th>
              </tr>
            </tbody></table>
          </th>
          <!-- END : Column 2 of 2 : SHIP_TO -->
        </tr></tbody>
        </table>`;
  var compiled = _.template(template);
  return compiled(data);
};

module.exports = { templateOrderType };
