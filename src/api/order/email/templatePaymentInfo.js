const _ = require("lodash");
const templatePaymentInfo = (data) => {
  const template = `
    <table class="table-inner" cellspacing="0" cellpadding="0" border="0" width="100%" style="min-width: 100%;" role="presentation">
    <!-- PAYMENT INFO -->
      <tbody><tr>
        <th colspan="2" style="mso-line-height-rule: exactly;" bgcolor="#ffffff" valign="top">
          <h3 data-key="1468272_payment_info" style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; color: #bdbdbd; font-size: 16px; line-height: 52px; font-weight: 700; text-transform: uppercase; border-bottom-width: 0; border-bottom-color: #dadada; border-bottom-style: solid; letter-spacing: 1px; margin: 0;" align="left">Payment Info</h3>
        </th>
      </tr>
          <!-- PAYMENT METHOD IMAGE -->
                  <tr>
                    <th class="table-title" style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: bold; color: #666363; width: 65%; padding: 6px 0;" align="left" bgcolor="#ffffff" valign="top">
                      <table cellspacing="0" cellpadding="0" border="0" width="100%" style="min-width: 100%; font-weight: bold;" role="presentation">
                        <tbody><tr style="font-weight: bold;">
                          <th style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: bold; color: #666363; padding: 8px 0;" align="left" bgcolor="#ffffff" valign="middle">
                         <%- cardName %> <br>
                          <%- brand %>
                              <span class="table-muted" style="font-size: 14px; font-weight: bold; color: #bdbdbd; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla';"> (••••••••••••<%- last4 %>)</span>
                          </th>
                        </tr>
                      </tbody></table>
                    </th>
                    <th class="table-text" style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; width: 35%; padding: 13px 0;" align="right" bgcolor="#ffffff" valign="middle">
                    <%- total %>
                      </th>
                    </tr>
              </tbody></table>`;
  var compiled = _.template(template);
  return compiled(data);
};
module.exports = { templatePaymentInfo };
