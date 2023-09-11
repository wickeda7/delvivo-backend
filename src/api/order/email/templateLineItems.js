const _ = require("lodash");
const templateLineItems = (data) => {
  let html = "";
  for (const item of data) {
    const template = `
        <tr class="row-border-bottom">
        <th class="table-stack product-image-wrapper stack-column-center" width="1" style="mso-line-height-rule: exactly; border-bottom-width: 2px; border-bottom-color: #dadada; border-bottom-style: solid; padding: 13px 13px 13px 0;" bgcolor="#ffffff" valign="middle">
                <img width="140" class="product-image" src="<%- image %>" alt="<%- name %>" style="vertical-align: middle; text-align: center; width: 140px; max-width: 140px; height: auto !important; border-radius: 1px; padding: 0px;">
        </th>
        
        <th class="product-details-wrapper table-stack stack-column" style="mso-line-height-rule: exactly; padding-top: 13px; padding-bottom: 13px; border-bottom-width: 2px; border-bottom-color: #dadada; border-bottom-style: solid;" bgcolor="#ffffff" valign="middle">
            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="min-width: 100%;" role="presentation">
                <tbody>
                    <tr>
                        <th class="line-item-description" style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; padding: 13px 6px 13px 0;" align="left" bgcolor="#ffffff" valign="top">
                        <p style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; margin: 0;" align="left">
                            <a style="color: #666363; text-decoration: none !important; text-underline: none; word-wrap: break-word; text-align: left !important; font-weight: bold;"><%- name %></a>
                            <br>
                            <span class="muted" style="text-align: center; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 14px; line-height: 26px; font-weight: normal; color: #bdbdbd; word-break: break-all;"> <%- description %>
                            </span>
                        </p>
                        </th>
                        <th style="mso-line-height-rule: exactly;" bgcolor="#ffffff" valign="top"></th>
                        <th class="right line-item-qty" width="1" style="mso-line-height-rule: exactly; white-space: nowrap; padding: 13px 0 13px 13px;" align="right" bgcolor="#ffffff" valign="top">
                        <p style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; margin: 0;" align="right">
                            ×&nbsp;<%- quantity %>
                        </p>
                        </th>
                        <th class="right line-item-line-price" width="1" style="mso-line-height-rule: exactly; white-space: nowrap; padding: 13px 0 13px 26px;" align="right" bgcolor="#ffffff" valign="top">
                        <p style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; margin: 0;" align="right">
                        <%- price %>
                        </p>
                        </th>
                    </tr>
                </tbody>
            </table>
        </th>
        </tr>
        
        <tr>
            <th colspan="2" class="product-empty-row" style="mso-line-height-rule: exactly;" bgcolor="#ffffff" valign="top"></th>
        </tr>
        `;
    var compiled = _.template(template);
    html += compiled(item);
  }
  return html;
};

module.exports = { templateLineItems };
