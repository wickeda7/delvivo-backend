const _ = require("lodash");

const templateConfirm = (data) => {
  const temp = `                                  <!-- BEGIN SECTION: Heading -->
  <tr id="section-1468266" class="section heading">
      <th style="mso-line-height-rule: exactly; color: #4b4b4b; padding: 26px 52px 13px;" bgcolor="#ffffff">
            <table cellspacing="0" cellpadding="0" border="0" width="100%" role="presentation" style="color: #4b4b4b;" bgcolor="#ffffff">
                <tbody>
                    <tr style="color: #4b4b4b;" bgcolor="#ffffff">
                        <th style="mso-line-height-rule: exactly; color: #4b4b4b;" bgcolor="#ffffff" valign="top">
                          <h1 data-key="1468266_heading" style="font-family: Georgia,serif,'Playfair Display'; font-size: 28px; line-height: 46px; font-weight: 700; color: #4b4b4b; text-transform: none; background-color: #ffffff; margin: 0;"><%- title %></h1>
                        </th>
                    </tr>
                </tbody>
            </table>
      </th>
  </tr>
  <!-- END SECTION: Heading -->
  <!-- BEGIN SECTION: Introduction -->
  <tr id="section-1468267" class="section introduction">
  <th style="mso-line-height-rule: exactly; padding: 13px 52px;" bgcolor="#ffffff">
      <p style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; margin: 0 0 13px;" align="center">
        <span data-key="1468267_greeting_text" style="text-align: center; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363;"> Hello</span>
        <%- name %>,
      </p>
      <p data-key="1468267_introduction_text" class="text" style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; margin: 13px 0;" align="center"></p>
      <p style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; margin: 13px 0;" align="center"><%- message1 %> </p>
      <p style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 16px; line-height: 26px; font-weight: 400; color: #666363; margin: 13px 0;" align="center"><%- message2 %></p>
  </th>
  </tr>
  <!-- END SECTION: Introduction -->
  <!-- BEGIN SECTION: Order Number And Date -->
  <tr id="section-1468270" class="section order_number_and_date">
  <th style="mso-line-height-rule: exactly; padding: 13px 52px;" bgcolor="#ffffff">
    <h2 style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; color: #4b4b4b; font-size: 20px; line-height: 26px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0;" align="center">
      <span data-key="1468270_order_number">Order No.</span> <%- oderId %>
    </h2>
    <p class="muted" style="mso-line-height-rule: exactly; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,'Karla'; font-size: 14px; line-height: 26px; font-weight: normal; color: #bdbdbd; margin: 0;" align="center"><%- date %></p>
    <% if(track) { %>
      <p  style="mso-line-height-rule: exactly;  font-size: 14px; line-height: 26px; font-weight: bole; color: #bdbdbd; margin: 0;" align="center">
      <a href="<%- url %>" target="_blank">TRACK YOUR DELIVERY</a>
      </p>
    <% } %>
  </th>
  </tr>
  <!-- END SECTION: Order Number And Date -->`;

  var compiled = _.template(temp);
  var template = compiled(data);
  return template;
};
module.exports = { templateConfirm };
