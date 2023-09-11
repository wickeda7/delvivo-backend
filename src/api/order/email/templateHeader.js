const logo = "https://delvivo.netlify.app/logo2.jpg";
const link = "https://delvivo.netlify.app";
const templateHeader = `<table class="section_wrapper header" data-id="header" id="section-header" border="0" width="100%" cellpadding="0" cellspacing="0" align="center" style="min-width: 100%;" role="presentation" bgcolor="#ffffff">
<tbody>
    <tr>
          <td class="section_wrapper_th" style="mso-line-height-rule: exactly; padding-top: 52px; padding-bottom: 26px;" bgcolor="#ffffff">
                <table border="0" width="100%" cellpadding="0" cellspacing="0" align="center" style="min-width: 100%;" role="presentation">
                      <tbody>
                          <tr>
                            <th class="column_logo" style="mso-line-height-rule: exactly; padding-top: 13px; padding-bottom: 13px;" align="center" bgcolor="#ffffff">
                              <!-- Logo : BEGIN -->
                              <a href="${link}" target="_blank" style="color: #c3c3c3; text-decoration: none !important; text-underline: none;">
                                <img src="${logo}" class="logo " width="196" border="0" style="width: 196px; height: auto !important; display: block; text-align: center; margin: auto;">
                              </a>
                              <!-- Logo : END -->
                            </th>
                          </tr>
                    </tbody>
                </table>
          </td>
    </tr>
</tbody>
</table>
`;
module.exports = { templateHeader };
