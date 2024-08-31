import nodemailer from "nodemailer";
import { getCanonicalURL } from "./utils";
const gmailAccountUser = process.env.GMAIL_ACCOUNT_USER;
const gmailAccountKey = process.env.GMAIL_APP_KEY;
const emailFrom = process.env.GMAIL_ACCOUNT_FROM;
const emailTo = process.env.GMAIL_ACCOUNT_TO;

/**
 * Sends an email using Nodemailer.
 *
 * @param {string} subject - The email subject.
 * @param {string} html - The HTML content of the email.
 * @param {string} text - The plain text content of the email.
 * @param {string} [sendTo] - Optional recipient email address.
 * @param {string} [cc] - Optional CC email address.
 * @param {string} [bcc] - Optional BCC email address.
 * @returns {Promise<{ success: string}|{ success: string}>} - Object indicating success or error.
 */
export default async function sendEmail(
  subject: string,
  html: string,
  text: string,
  sendTo?: string,
  cc?: string,
  bcc?: string
): Promise<{ success: string } | { error: string }> {
  try {
    // nodemailer transporter obj
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailAccountUser,
        pass: gmailAccountKey,
      },
    });
    // nodemailer options
    const mailOptions = {
      from: emailFrom,
      // to: sendTo || undefined,
      to: sendTo || emailTo,
      subject,
      html,
      text,
      cc,
      bcc: emailTo + ", " + bcc,
    };
    // console.log(` > CHECKPOINT: Sending email`);
    // send email
    const result = await transporter.sendMail(mailOptions);
    if (result.accepted.length > 0) {
      console.log(" > email SENT: ", result);
      return { success: "email sent" };
    } else {
      console.error(" > ERROR: email not sent ");
      return { error: "Email not sent" };
    }
  } catch (err) {
    console.error(" > ERROR: email not sent \n > ", err);
    return { error: "Email not sent" };
  }
}

export function generateEmail(
  _type: keyof typeof config,
  name: string,
  url: string
) {
  if (!(_type in config)) {
    return {
      error: `missing config value in html template generation - ${_type}`,
    };
  }
  const { desc, title, parA_html, parA_text, links, cta } = config[_type];
  // Use 'type' to generate the email content (e.g., HTML or plain text)
  const html = templateHTML(desc, title, name, parA_html, links, url, cta);
  const text = templatePlaintext(name, parA_text, url);

  return { html, text };
}

// TEMPLATES

type EmailConfig = {
  desc: string;
  title: string;
  parA_html: string;
  parA_text: string;
  cta: string;
  links: { label: string; href: string }[];
};

const config: Record<string, EmailConfig> = {
  signUp: {
    desc: "Sign Up (bunge-scope)",
    title: "Set New Password",
    parA_html:
      "Welcome! Click the button below to complete your sign-up process; or alternatively use the link: ",
    parA_text:
      "Welcome! Click, or copy the link below into your browser's address bar to complete your sign-up: ",
    cta: "Complete Sign-Up",
    links: [{ label: "github", href: "https://github.com/goweki" }],
  },
  reset: {
    desc: "Set New Password (bunge-scope)",
    title: "Password Reset Info",
    parA_html:
      "We received a request to reset your password. Click the button below to set a new password; or alternatively use the link: ",
    parA_text:
      "We received a request to reset your password. Click, or copy the link below into your browser's address bar: ",
    cta: "Set New Password",
    links: [{ label: "github", href: "https://github.com/goweki" }],
  },
};

const templateHTML = (
  _description: string,
  _title: string,
  _name: string,
  _parA: string,
  _links: typeof config.signUp.links,
  _url: string,
  _cta: string
) => {
  /** return HTML as string
   */
  return `
        <!DOCTYPE html>
      <html xml:lang="en" lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
          xmlns:o="urn:schemas-microsoft-com:office:office">
      
      <head>
          <!--yahoo fix-->
      </head>
      
      <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta http-equiv="X-UA-Compatible" content="IE=Edge">
          <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
          <meta name="x-apple-disable-message-reformatting">
      
          <!--target dark mode-->
          <meta name="color-scheme" content="light dark">
          <meta name="supported-color-schemes" content="light dark only">
      
          <title>Password Reset Information</title>
      
          <!-- Allow for better image rendering on Windows hi-DPI displays. -->
          <!--[if mso]>
      <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:AllowPNG/>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
      </noscript>
      <![endif]-->
      
          <!--to support dark mode meta tags-->
          <style type="text/css">
              :root {
                  color-scheme: light dark;
                  supported-color-schemes: light dark;
              }
          </style>
      
          <style>
              body {
                  margin: 0;
                  padding: 0;
              }
      
              table {
                  border-collapse: collapse;
                  mso-table-lspace: 0;
                  mso-table-rspace: 0;
              }
      
              h1 {
                  margin: 0.67em 0;
                  font-size: 2em;
              }
      
              h2 {
                  margin: 0.83em 0;
                  font-size: 1.5em;
              }
      
              html[dir] h3,
              h3 {
                  margin: 1em 0;
                  font-size: 1.17em;
              }
      
              span.MsoHyperlinkFollowed {
                  color: inherit !important;
                  mso-style-priority: 99 !important;
              }
      
              #root [x-apple-data-detectors=true],
              a[x-apple-data-detectors=true] {
                  color: inherit !important;
                  text-decoration: inherit !important;
              }
      
              [x-apple-data-detectors-type="calendar-event"] {
                  color: inherit !important;
                  -webkit-text-decoration-color: inherit !important;
              }
      
              u+.body a {
                  color: inherit;
                  text-decoration: none;
                  font-size: inherit;
                  font-weight: inherit;
                  line-height: inherit;
              }
      
              .body {
                  word-wrap: normal;
                  word-spacing: normal;
              }
      
              div[style*="margin: 16px 0"] {
                  margin: 0 !important;
              }
      
              #message * {
                  all: revert
              }
          </style>
      
      
          <style>
              body {
                  height: 100% !important;
                  width: 100% !important;
                  -webkit-text-size-adjust: 100%;
                  -ms-text-size-adjust: 100%;
              }
      
              table,
              td {
                  -webkit-text-size-adjust: 100%;
                  -ms-text-size-adjust: 100%;
              }
      
              img {
                  border: 0;
                  line-height: 100%;
                  outline: none;
                  text-decoration: none;
                  display: block;
              }
      
              p,
              h1,
              h2,
              h3,
              h4 {
                  padding: 0;
                  margin: 0;
              }
      
              p,
              h1,
              h2,
              h3,
              img,
              ul li span {
                  color: #0a080b;
              }
      
              p,
              h1,
              h2,
              h3,
              a,
              ul,
              img,
              ul li span {
                  font-family: 'Trebuchet MS', Arial, sans-serif;
              }
      
              ul li {
                  font-size: 28px !important;
                  line-height: 28px !important;
              }
      
              ol li {
                  font-size: 18px !important;
              }
      
              h1 {
                  font-size: 36px;
                  line-height: 46px;
              }
      
              h1.jumbo {
                  font-size: 60px;
                  line-height: 70px;
              }
      
              h2 {
                  font-size: 30px;
                  line-height: 40px;
              }
      
              h3 {
                  font-size: 24px;
                  line-height: 34px;
              }
      
              h4 {
                  font-size: 18px;
                  line-height: 24px;
              }
      
              p,
              img {
                  font-size: 18px;
                  line-height: 28px;
              }
      
              p.subhead {
                  font-size: 30px;
                  line-height: 40px;
              }
      
              p.sm_subhead {
                  font-size: 24px;
                  line-height: 34px;
              }
      
              ul li span {
                  font-size: 18px;
                  line-height: 28px;
              }
      
              h1 a,
              h2 a,
              h3 a,
              h4 a {
                  color: #0a080b !important;
                  text-decoration: none !important;
              }
      
              a,
              .link {
                  color: #028383 !important;
                  text-decoration: underline !important;
              }
      
              .dark a {
                  color: #ffffff !important;
              }
      
              a:hover,
              .link:hover {
                  text-decoration: none !important;
              }
      
              .fadeimg {
                  transition: 0.3s !important;
                  opacity: 1 !important;
              }
      
              .fadeimg:hover {
                  transition: 0.3s !important;
                  opacity: 0.5 !important;
              }
      
              /* start CTA HOVER EFFECTS */
              a.cta {
                  text-decoration: none !important;
              }
      
              .cta {
                  transition: 0.3s !important;
              }
      
              .cta span {
                  transition: 0.3s !important;
                  color: #ffffff;
              }
      
              .cta:hover {
                  transition: 0.5s !important;
                  background-color: #004265 !important;
                  transform: scale(1.05);
              }
      
              .cta:hover span {
                  transition: 0.3s !important;
              }
      
              .cta-border:hover {
                  border-bottom: 3px solid transparent !important;
              }
      
              /* end CTA HOVER EFFECTS */
      
              .footer p {
                  font-size: 14px;
                  line-height: 24px;
                  color: #4B525D;
              }
      
              .footer a {
                  color: #4B525D !important;
              }
      
              .footer-dark p {
                  font-size: 14px;
                  line-height: 24px;
                  color: #fefefe;
              }
      
              .footer-dark a {
                  color: #fefefe !important;
              }
      
              .mobile {
                  display: none !important;
              }
      
              .mob-inline {
                  display: none !important;
              }
      
              .dark-img {
                  display: none !important;
              }
      
              .blueLinks a {
                  color: inherit !important;
                  text-decoration: none !important;
              }
          </style>
          <style>
              u+.body .gmail-screen {
                  background: #000;
                  mix-blend-mode: screen;
                  display: block;
              }
      
              u+.body .gmail-difference {
                  background: #000;
                  mix-blend-mode: difference;
                  display: block;
              }
      
              u+.body .cta:hover .gmail-screen {
                  background: transparent;
                  mix-blend-mode: normal;
              }
      
              u+.body .cta:hover .gmail-difference {
                  background: transparent;
                  mix-blend-mode: normal;
              }
          </style>
          <!--mobile styles-->
          <style>
              @media screen and (max-width:600px) {
                  .wMobile {
                      width: 95% !important;
                  }
      
                  .wInner {
                      width: 85% !important;
                  }
      
                  .wFull {
                      width: 100% !important;
                  }
      
                  .desktop {
                      width: 0 !important;
                      display: none !important;
                  }
      
                  .mobile {
                      display: block !important;
                  }
      
                  .mob-inline {
                      display: inline-block !important;
                  }
      
                  h1 {
                      font-size: 36px !important;
                      line-height: 46px !important;
                  }
      
                  .subhead {
                      font-size: 24px !important;
                      line-height: 34px !important;
                  }
              }
          </style>
          <style>
              @media (prefers-color-scheme: dark) {
      
                  .dark-img {
                      display: block !important;
                  }
      
                  .light-img {
                      display: none;
                      display: none !important;
                  }
      
                  .darkmode {
                      background-color: #354D3D !important;
                  }
      
                  /* .darkmode {
                      background: #262524 !important;
                  } */
      
                  .darkmode2 {
                      background-color: #19201b !important;
                  }
      
                  /* .darkmode2 {
                      background: #0e0e0e !important;
                  } */
      
                  h1,
                  h2,
                  h3,
                  p,
                  span,
                  .plainTxt li,
                  h1 a,
                  h2 a,
                  h3 a,
                  .header a,
                  img,
                  strong {
                      color: #EDEEEF !important;
                  }
      
                  a,
                  .link {
                      color: #7EABCE !important;
                  }
      
                  .footer .link,
                  .footer a {
                      color: #fdfdfd !important;
                  }
              }
      
              [data-ogsc] .dark-img {
                  display: block !important;
              }
      
              [data-ogsc] .light-img {
                  display: none;
                  display: none !important;
              }
      
              [data-ogsb] .darkmode {
                  background-color: #272623 !important;
              }
      
              [data-ogsb] .darkmode2,
              [data-ogsb] .callout {
                  background-color: #0e0e0e !important;
              }
      
              [data-ogsc] h1,
              [data-ogsc] h2,
              [data-ogsc] h3,
              [data-ogsc] p,
              [data-ogsc] span,
              [data-ogsc] .plainTxt li,
              [data-ogsc] h1 a,
              [data-ogsc] h2 a,
              [data-ogsc] h3 a,
              [data-ogsc] .header a,
              [data-ogsc] .footer a,
              [data-ogsc] img,
              [data-ogsc] strong {
                  color: #EDEEEF !important;
              }
      
              [data-ogsc] .link,
              [data-ogsc] p a {
                  color: #7EABCE !important;
              }
      
              [data-ogsc] .footer a {
                  color: #fdfdfd !important;
              }
          </style>
      
          <!--fix for Outlook bullet points-->
          <style>
              u+.body .glist {
                  margin-left: 15px !important;
              }
      
              @media only screen and (max-width: 640px) {
                  u+.body .glist {
                      margin-left: 25px !important;
                  }
              }
          </style>
      
          <!--[if (gte mso 9)|(IE)]>
      <style>
      li { 
      margin-left:27px !important;
      mso-special-format: bullet;
      }
      .forDumbOutlooks {
      margin-left: -25px !important;
      }
      </style>
      <![endif]-->
      </head>
      
      <body id="body" class="darkmode2 body" bgcolor="#EDEEEF" style="background-color:#EDEEEF;">
          <div role="article" aria-roledescription="email" aria-label="Email from GOWEKI" xml:lang="en" lang="en">
              <!--hidden preheader with pre-header spacer hack-->
              <div class="litmus-builder-preview-text" style="display:none;">${_description}
              </div>
              <!--start of email-->
              <table class="darkmode2" cellpadding="0" cellspacing="0" border="0" role="presentation"
                  style="width:100%; background-color: #f8f9fc;">
                  <tr>
                      <td class="darkmode" align="center" valign="top"
                          style="background-color: #354D3D; background: linear-gradient(#354D3D,#354D3D);">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                              <tr>
                                  <td align="center" valign="top" style="padding: 30px 0;">
                                      <!--Header with logo-->
      
                                      <!--light mode logo-->
                                      <a href="https://scope.goweki.com" target="_blank" rel="noopener noreferrer">
                                          <h2 style="color: #ffffff; text-decoration: none;" >BUNGE SCOPE</h2>
                                      </a>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
                  <tr>
                      <td align="center" valign="top" style="padding-top: 60px;">
                          <table class="wMobile darkmode dark-border" border="0" cellpadding="0" cellspacing="0"
                              role="presentation" style="width: 600px; background-color: #ffffff; border: 1px solid #DADDDE;">
                              <tr>
                                  <td align="center" valign="top">
                                      <table class="wInner" border="0" cellpadding="0" cellspacing="0" role="presentation"
                                          style="width:500px;">
                                          <tr>
                                              <td align="center" valign="top" style="padding: 60px 30px 0;">
                                                  <!--h1-->
                                                  <h1>${_title}</h1>
                                              </td>
                                          </tr>
      
                                          <tr>
                                              <td align="left" valign="top" style="padding: 50px 0 0;">
                                                  <div class="mktoText" id="body_copy" mktoname="body_copy">
                                                      <!--Paragraph block-->
                                                      <p style="text-align: left;">${_name}, ${_parA} 
                                                      ${_url || ""}
                                                      </p>
                                                  </div>
                                              </td>
                                          </tr>
                                          ${
                                            _url
                                              ? `<tr>
                                              <td align="center" valign="top" style="padding: 50px 0 0;">
                                                  <a href="${_url}" class="cta"
                                                      style="background-color: #19201b; font-size: 18px; font-family: 'Trebuchet MS', Arial, sans-serif; font-weight:bold; text-decoration: none; padding: 14px 20px; color: #ffffff; display:inline-block; mso-padding-alt:0;"><!--[if mso]><i style="letter-spacing: 25px;mso-font-width:-100%;mso-text-raise:30pt">&nbsp;</i><![endif]--><span
                                                          style="mso-text-raise:15pt;"><span class="gmail-screen"><span
                                                                  class="gmail-difference">${_cta}</span></span></span><!--[if mso]><i style="letter-spacing: 25px;mso-font-width:-100%">&nbsp;</i><![endif]--></a>
                                              </td>
                                          </tr>`
                                              : ""
                                          }
                                          <tr>
                                              <td align="left" valign="top" style="padding: 50px 0 0;">
                                                  <!--Paragraph block-->
                                                  <p style="text-align: left;"><strong>This link will expire in 1
                                                          hour.</strong> If you did not request a new password, please
                                                      disregard this message.<br /><br /><strong>Questions?</strong> Contact
                                                      <a href="mailto:scope@goweki.com">support@goweki.com</a>.
                                                  </p>
                                              </td>
                                          </tr>
                                          <tr>
                                              <td aria-hidden="true" align="left" valign="top"
                                                  style="font-size:60px;line-height:60px;mso-line-height-rule: exactly;">
                                                  &nbsp;</td>
                                          </tr>
                                      </table>
                                  </td>
                              </tr>
      
                          </table>
                      </td>
                  </tr>
      
                  <!--footer-->
                  <tr>
                      <td align="center" style="padding: 0px 15px;">
                          <table role="presentation" class="wMobile" cellpadding="0" cellspacing="0" border="0"
                              style="width: 600px; max-width: 600px;">
                              <tr>
                                  <td class="footer" align="center" valign="top" style="padding:50px 30px;">
                                      <!--Footer-->
                                      <p style="margin:0 auto 20px;">
                                          You&rsquo;re receiving this email because you registered an account with us.
                                      </p>
                                      <p style="mso-line-height-rule:exactly;margin-bottom:20px;">
                                         ${_links.map(
                                           ({ label, href }) => `
                                           <a href="${href}" class="link"
                                              target="_blank" style="color: #0a080b; text-decoration: underline;">${label}</a>
                                              `
                                         )}
                                      </p>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
              </table>
          </div>
          <!--analytics-->
      
      </body>
      
      </html>
      `;
};

const templatePlaintext = (_name: string, _parA: string, _url: string) => {
  return `
      
      ${_name}, 
      
      ${_parA}
      
      ${_url}
      
      
      BUNGE-SCOPE
      https://scope.goweki.com
      
      `;
};
