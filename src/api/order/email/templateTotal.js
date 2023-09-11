const _ = require("lodash");
const templateTotal = (total) => {
  const template = `<table cellspacing="0" cellpadding="0" border="0" width="100%" style="min-width: 100%;" role="presentation">
  <tbody>
  
    <tr>
      <th class="table-title" data-key="1468271_subtotal" style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: bold; color: #666363; width: 65%; padding: 6px 0;" align="left" bgcolor="#ffffff" valign="top">Subtotal</th>
      <th class="table-text" style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; width: 35%; padding: 6px 0;" align="right" bgcolor="#ffffff" valign="middle"><%- subtotal %></th>
    </tr>
    <tr>
    <th class="table-title" style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: bold; color: #666363; width: 65%; padding: 6px 0;" align="left" bgcolor="#ffffff" valign="top">
      <span data-key="1468271_discount" style="font-weight: bold;">Tax</span> </th>
      <th class="table-text" style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; width: 35%; padding: 6px 0;" align="right" bgcolor="#ffffff" valign="middle"><%- tax %></th>
    </tr>
    <tr>
      <th class="table-title" style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: bold; color: #666363; width: 65%; padding: 6px 0;" align="left" bgcolor="#ffffff" valign="top"><%- orderType %></th>
      <th class="table-text" style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; width: 35%; padding: 6px 0;" align="right" bgcolor="#ffffff" valign="middle">$0.00</th>
    </tr>
    <tr class="pricing-table-total-row">
      <th class="table-title" data-key="1468271_total" style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: bold; color: #666363; width: 65%; padding: 6px 0;" align="left" bgcolor="#ffffff" valign="top">Total</th>
      <th class="table-text" style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; width: 35%; padding: 6px 0;" align="right" bgcolor="#ffffff" valign="middle"><%- total %></th>
    </tr>
  </tbody>
  </table>`;
  var compiled = _.template(template);
  return compiled(total);
};
module.exports = { templateTotal };
