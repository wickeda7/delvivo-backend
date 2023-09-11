const templateCSS = `
<head>
<!--[if gte mso 15]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG />
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
<![endif]-->
<meta name="viewport" content="width=device-width">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<!-- Order confirmation email template for Shopify -->
<style type="text/css" data-premailer="ignore">
  /* What it does: Remove spaces around the email design added by some email clients. */
      /* Beware: It can remove the padding / Margin and add a background color to the compose a reply window. */
      html, body {
        Margin: 0 auto !important;
        padding: 0 !important;
        width: 100% !important;
          height: 100% !important;
      }
      /* What it does: Stops email clients resizing small text. */
      * {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
        text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
      }
      /* What it does: Forces Outlook.com to display emails full width. */
      .ExternalClass {
        width: 100%;
      }
      /* What is does: Centers email on Android 4.4 */
      div[style*="Margin: 16px 0"] {
          Margin:0 !important;
      }
      /* What it does: Stops Outlook from adding extra spacing to tables. */
      table,
      th {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      /* What it does: Fixes Outlook.com line height. */
      .ExternalClass,
      .ExternalClass * {
        line-height: 100% !important;
      }
      /* What it does: Fixes webkit padding issue. Fix for Yahoo mail table alignment bug. Applies table-layout to the first 2 tables then removes for anything nested deeper. */
      table {
        border-spacing: 0 !important;
        border-collapse: collapse !important;
        border: none;
        Margin: 0 auto;
      }
      div[style*="Margin: 16px 0"] {
          Margin:0 !important;
      }
      /* What it does: Uses a better rendering method when resizing images in IE. */
      img {
        -ms-interpolation-mode:bicubic;
      }
      /* What it does: Overrides styles added when Yahoo's auto-senses a link. */
      .yshortcuts a {
        border-bottom: none !important;
      }
      /* What it does: Overrides blue, underlined link auto-detected by iOS Mail. */
      /* Create a class for every link style needed; this template needs only one for the link in the footer. */
      /* What it does: A work-around for email clients meddling in triggered links. */
      *[x-apple-data-detectors],  /* iOS */
      .x-gmail-data-detectors,    /* Gmail */
      .x-gmail-data-detectors *,
      .aBn {
          border-bottom: none !important;
          cursor: default !important;
          color: inherit !important;
          text-decoration: none !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
      }
  
      /* What it does: Prevents Gmail from displaying an download button on large, non-linked images. */
      .a6S {
          display: none !important;
          opacity: 0.01 !important;
      }
      /* If the above doesn't work, add a .g-img class to any image in question. */
      img.g-img + div {
          display:none !important;
      }
      /* What it does: Prevents underlining the button text in Windows 10 */
      a,
      a:link,
      a:visited {
          color: #453227;
          text-decoration: none !important;
      }
      .header a {
          color: #795744;
          text-decoration: none;
          text-underline: none;
      }
      .main a {
          color: #795744;
          text-decoration: none;
          text-underline: none;
          word-wrap: break-word;
      }
      .main .section.customer_and_shipping_address a,
      .main .section.shipping_address_and_fulfillment_details a {
          color: #795744;
          text-decoration: none;
          text-underline: none;
          word-wrap: break-word;
      }
      .footer a {
          color: #795744;
          text-decoration: none;
          text-underline: none;
      }
  
      /* What it does: Overrides styles added images. */
      img {
        border: none !important;
        outline: none !important;
        text-decoration:none !important;
      }
      /* What it does: Fixes fonts for Google WebFonts; */
      [style*="Karla"] {
          font-family: 'Karla',-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif !important;
      }
      [style*="Karla"] {
          font-family: 'Karla',-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif !important;
      }
      [style*="Karla"] {
          font-family: 'Karla',-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif !important;
      }
      [style*="Playfair Display"] {
          font-family: 'Playfair Display',Georgia,serif !important;
      }
      td.menu_bar_1 a:hover,
      td.menu_bar_6 a:hover {
        color: #453227 !important;
      }
      th.related_product_wrapper.first {
        border-right: 13px solid #ffffff;
        padding-right: 6px;
      }
      th.related_product_wrapper.last {
        border-left: 13px solid #ffffff;
        padding-left: 6px;
      }
</style>
<!--[if (mso)|(mso 16)]>
  <style type="text/css" data-premailer="ignore">
    a {text-decoration: none;}
  </style>
<![endif]-->
<!--[if !mso]><!-->
<link href="https://fonts.googleapis.com/css?family=Karla:400,700%7CPlayfair+Display:700,400%7CKarla:700,400%7CKarla:700,700" rel="stylesheet" type="text/css" data-premailer="ignore">
<!--<![endif]-->
  <style type="text/css" data-premailer="ignore">
    /* Media Queries */
        /* What it does: Removes right gutter in Gmail iOS app */
        @media only screen and (min-device-width: 375px) and (max-device-width: 413px) { /* iPhone 6 and 6+ */
            .container {
                min-width: 375px !important;
            }
        }
        /* Main media query for responsive styles */
        @media only screen and (max-width:480px) {
          /* What it does: Overrides email-container's desktop width and forces it into a 100% fluid width. */
          .email-container {
            width: 100% !important;
            min-width: 100% !important;
          }
          .section > th {
            padding: 13px 26px 13px 26px !important;
          }
          .section.divider > th {
            padding: 26px 26px !important;
          }
          .main .section:first-child > th,
          .main .section:first-child > td {
              padding-top: 26px !important;
          }
            .main .section:nth-last-child(2) > th,
            .main .section:nth-last-child(2) > td {
                padding-bottom: 52px !important;
            }
          .section.recommended_products > th,
          .section.discount > th {
              padding: 26px 26px !important;
          }
          /* What it does: Forces images to resize to the width of their container. */
          img.fluid,
          img.fluid-centered {
            width: 100% !important;
            min-width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            Margin: auto !important;
            box-sizing: border-box;
          }
          /* and center justify these ones. */
          img.fluid-centered {
            Margin: auto !important;
          }
    
          /* What it does: Forces table cells into full-width rows. */
          th.stack-column,
          th.stack-column-left,
          th.stack-column-center,
          th.related_product_wrapper,
          .column_1_of_2,
          .column_2_of_2 {
            display: block !important;
            width: 100% !important;
            min-width: 100% !important;
            direction: ltr !important;
            box-sizing: border-box;
          }
          /* and left justify these ones. */
          th.stack-column-left {
            text-align: left !important;
          }
          /* and center justify these ones. */
          th.stack-column-center,
          th.related_product_wrapper {
            text-align: center !important;
            border-right: none !important;
            border-left: none !important;
          }
          .column_button,
          .column_button > table,
          .column_button > table th {
            width: 100% !important;
            text-align: center !important;
            Margin: 0 !important;
          }
          .column_1_of_2 {
            padding-bottom: 26px !important;
          }
          .column_1_of_2 th {
              padding-right: 0 !important;
          }
          .column_2_of_2 th {
              padding-left:  0 !important;
          }
          .column_text_after_button {
            padding: 0 13px !important;
          }
          /* Adjust product images */
          th.table-stack {
            padding: 0 !important;
          }
          th.product-image-wrapper {
              padding: 26px 0 13px 0 !important;
          }
          img.product-image {
                width: 240px !important;
                max-width: 240px !important;
          }
          tr.row-border-bottom th.product-image-wrapper {
            border-bottom: none !important;
          }
          th.related_product_wrapper.first,
          th.related_product_wrapper.last {
            padding-right: 0 !important;
            padding-left: 0 !important;
          }
          .text_banner th.banner_container {
            padding: 13px !important;
          }
          .mobile_app_download .column_1_of_2 .image_container {
            padding-bottom: 0 !important;
          }
          .mobile_app_download .column_2_of_2 .image_container {
            padding-top: 0 !important;
          }
        }
  </style>
  <style type="text/css" data-premailer="ignore">
    /* Custom Media Queries */
      @media only screen and (max-width:480px) {
        .column_logo {
            display: block !important;
            width: 100% !important;
            min-width: 100% !important;
            direction: ltr !important;
            text-align: center !important;
        }
        p,
        .column_1_of_2 th p,
        .column_2_of_2 th p,
        .order_notes *,
        .invoice_link * {
            text-align: center !important;
        }
        .line-item-description p {
            text-align: left !important;
        }
        .line-item-price p,
        .line-item-qty p,
        .line-item-line-price p {
          text-align: right !important;
        }
        h1, h2, h3,
        .column_1_of_2 th,
        .column_2_of_2 th {
            text-align: center !important;
        }
        td.order-table-title {
          text-align: center !important;
        }
        .footer .column_1_of_2 {
            border-right: 0 !important;
            border-bottom: 0 !important;
        }
        .footer .section_wrapper_th {
          padding: 0 17px;
        }
      }
  </style>
</head>
`;
module.exports = { templateCSS };
