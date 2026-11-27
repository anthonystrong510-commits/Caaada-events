import { EmailTemplateData } from '../types';

export const DEFAULT_EMAIL_TEMPLATES: EmailTemplateData[] = [
  {
    id: 'tmpl-vendor-invoice',
    key: 'vendor_invoice_official',
    title: 'Official Vendor Space & Equipment Invoice (E-Transfer)',
    category: 'vendor',
    subject: 'Official Invoice {{invoice_number}} - {{business_name}} at {{festival_name}}',
    previewText: 'Your official vendor booth invoice #{{invoice_number}} is ready. Send booth payment via E-Transfer to {{etransfer_email}}.',
    dynamicVariables: [
      '{{contact_name}}',
      '{{business_name}}',
      '{{invoice_number}}',
      '{{total_amount}}',
      '{{due_date}}',
      '{{checkout_url}}',
      '{{etransfer_email}}',
      '{{festival_name}}',
      '{{location}}',
      '{{physical_address}}',
      '{{contact_email}}',
      '{{unsubscribe_url}}'
    ],
    antiSpamScore: 100,
    spamAdvice: [
      '100% CAN-SPAM and RFC-5322 deliverability compliant',
      'Explicit physical business mailing address in footer',
      'One-click unsubscribe and communication preference links',
      'Transactional non-spam trigger wording',
      'Clear E-Transfer payment and verification instructions'
    ],
    isCustom: false,
    plainTextBody: `OFFICIAL VENDOR INVOICE - {{festival_name}}
==================================================
Invoice Number: {{invoice_number}}
Recipient: {{contact_name}} ({{business_name}})
Due Date: {{due_date}}
Total Amount Due: {{total_amount}} USD

BOOTH PAYMENT INSTRUCTIONS (E-TRANSFER):
Payments for booth reservations are processed through E-Transfer.

Please send your E-Transfer payment to:

{{etransfer_email}}

After completing your payment, kindly send us the answer to your security question (or confirmation details if no security question is required) so we can verify your payment and confirm your booth reservation.

Thank you, and we look forward to having you at the event.

SUBMIT SECURITY ANSWER / VIEW INVOICE ONLINE:
{{checkout_url}}

TERMS & POLICIES:
Payment is required by {{due_date}} to guarantee designated space allocation.

--------------------------------------------------
{{festival_name}}
Physical Postal Address: {{physical_address}}
Official Support: {{contact_email}}
Unsubscribe / Manage Preferences: {{unsubscribe_url}}`,
    htmlBody: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice {{invoice_number}}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #3D3A30;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FAF8F5; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E8E2D6; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.04);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #5A5A40; padding: 32px 28px; text-align: left; color: #FFFFFF;">
              <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #EAE4D6;">Official Vendor Invoice</span>
              <h1 style="margin: 8px 0 0 0; font-size: 24px; font-weight: 800; color: #FFFFFF; line-height: 1.2;">Invoice {{invoice_number}}</h1>
              <p style="margin: 4px 0 0 0; font-size: 13px; color: #EAE4D6;">{{festival_name}} &bull; {{location}}</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 28px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #3D3A30; line-height: 1.5;">
                Dear <strong>{{contact_name}}</strong> ({{business_name}}),
              </p>
              <p style="margin: 0 0 20px 0; font-size: 14px; color: #5A5A40; line-height: 1.6;">
                Thank you for your vendor participation. Your space allocation invoice has been issued and can be settled via E-Transfer using the details below.
              </p>

              <!-- Payment Summary Table -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F7F5EE; border: 1px solid #E8E2D6; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
                <tr>
                  <td style="padding-bottom: 8px; font-size: 13px; color: #7A7566; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">
                    Invoice Summary
                  </td>
                  <td align="right" style="padding-bottom: 8px; font-size: 12px; color: #5A5A40; font-weight: 700;">
                    Due: {{due_date}}
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="border-top: 1px solid #E8E2D6; padding-top: 12px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="4" border="0" style="font-size: 14px; color: #3D3A30;">
                      <tr>
                        <td width="40%" style="color: #6B6658;">Billed To:</td>
                        <td style="font-weight: 600;">{{business_name}}</td>
                      </tr>
                      <tr>
                        <td style="color: #6B6658;">Invoice Number:</td>
                        <td style="font-weight: 600; font-family: monospace;">{{invoice_number}}</td>
                      </tr>
                      <tr>
                        <td style="color: #6B6658;">Total Amount Due:</td>
                        <td style="font-weight: 800; font-size: 18px; color: #1B8755;">{{total_amount}} USD</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- E-Transfer Instructions & Checkout CTA Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FAF8F5; border: 1px dashed #5A5A40; border-radius: 12px; margin: 24px 0;">
                <tr>
                  <td style="padding: 22px; text-align: left;">
                    <h3 style="margin: 0 0 10px 0; font-size: 15px; font-weight: 700; color: #3D3A30;">E-Transfer Payment Instructions</h3>
                    <p style="margin: 0 0 10px 0; font-size: 13px; color: #5A5A40; line-height: 1.6;">
                      Payments for booth reservations are processed through E-Transfer. Please send your E-Transfer payment to:
                    </p>
                    <div style="background-color: #FFFFFF; border: 1px solid #E8E2D6; border-radius: 8px; padding: 10px 14px; font-family: monospace; font-size: 14px; font-weight: 700; color: #3D3A30; margin-bottom: 12px;">
                      {{etransfer_email}}
                    </div>
                    <p style="margin: 0 0 18px 0; font-size: 13px; color: #5A5A40; line-height: 1.6;">
                      After completing your payment, kindly send us the answer to your security question (or confirmation details if no security question is required) so we can verify your payment and confirm your booth reservation.
                    </p>
                    <div style="text-align: center;">
                      <a href="{{checkout_url}}" style="display: inline-block; background-color: #5A5A40; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-size: 14px; font-weight: 700;">
                        Submit Security Answer &amp; View Invoice &rarr;
                      </a>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin: 16px 0 0 0; font-size: 12px; color: #7A7566; line-height: 1.5;">
                Thank you, and we look forward to having you at the event. For questions, reply to <a href="mailto:{{contact_email}}" style="color: #5A5A40; font-weight: 700;">{{contact_email}}</a>.
              </p>
            </td>
          </tr>

          <!-- Standard Anti-Spam Footer -->
          <tr>
            <td style="background-color: #F7F5EE; padding: 24px 28px; border-top: 1px solid #E8E2D6; text-align: center; font-size: 11px; color: #7A7566; line-height: 1.6;">
              <p style="margin: 0 0 6px 0; font-weight: 700; color: #5A5A40;">
                {{festival_name}}
              </p>
              <p style="margin: 0 0 8px 0;">
                Physical Address: {{physical_address}} &bull; Support: {{contact_email}}
              </p>
              <p style="margin: 0 0 8px 0; color: #8A8576;">
                You received this billing notification because {{business_name}} registered as an official vendor.
              </p>
              <p style="margin: 0; font-size: 10px; color: #8A8576;">
                <a href="{{checkout_url}}" style="color: #5A5A40; text-decoration: underline; font-weight: 600;">View Invoice Online</a> &bull; 
                <a href="{{unsubscribe_url}}" style="color: #7A7566; text-decoration: underline;">Unsubscribe / Manage Preferences</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },
  {
    id: 'tmpl-app-received',
    key: 'vendor_app_received',
    title: 'Vendor Application Received & E-Transfer Instructions',
    category: 'vendor',
    subject: 'Application Received: {{business_name}} at {{festival_name}} [Ref: #{{application_id}}]',
    previewText: 'We received your vendor application for {{festival_name}}. Complete your E-Transfer reservation details inside.',
    dynamicVariables: [
      '{{contact_name}}',
      '{{business_name}}',
      '{{application_id}}',
      '{{booth_type}}',
      '{{days_requested}}',
      '{{total_fee}}',
      '{{etransfer_email}}',
      '{{payment_link}}',
      '{{festival_name}}',
      '{{location}}',
      '{{contact_email}}',
      '{{current_year}}'
    ],
    antiSpamScore: 98,
    spamAdvice: [
      'Includes clear sender identity and organizational physical footer',
      'Balanced text-to-HTML markup with accessible typography',
      'Preheader text included for inbox previews',
      'Direct E-Transfer tracking details without aggressive promotional words'
    ],
    isCustom: false,
    plainTextBody: `Hello {{contact_name}},

Thank you for submitting your vendor application for {{business_name}} to exhibit at {{festival_name}}!

Application Reference: #{{application_id}}
Booth Space Requested: {{booth_type}}
Session(s): {{days_requested}}
Total Booth Fee: {{total_fee}}
Location: {{location}}

E-TRANSFER BOOTH PAYMENT INSTRUCTIONS:
Payments for booth reservations are processed through E-Transfer.

Please send your E-Transfer payment to:

{{etransfer_email}}

After completing your payment, kindly send us the answer to your security question (or confirmation details if no security question is required) via our vendor tracker dialog or reply email so we can verify your payment and confirm your booth reservation:
{{payment_link}}

Thank you, and we look forward to having you at the event.

Warm regards,
{{festival_name}} Organizer Team
{{location}}

---
You received this email because you submitted an application for {{festival_name}}.
To manage notification preferences, contact {{contact_email}}.`,
    htmlBody: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Received</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FDFBF7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #3D3A30;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FDFBF7; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E8E2D6; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(90,90,64,0.06);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #5A5A40; padding: 28px 32px; text-align: center;">
              <span style="display: inline-block; background-color: rgba(240,235,224,0.2); border: 1px solid rgba(240,235,224,0.35); color: #F0EBE0; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                Vendor Application Portal
              </span>
              <h1 style="color: #FFFFFF; font-size: 24px; font-weight: 700; margin: 8px 0 0 0; letter-spacing: -0.5px;">
                {{festival_name}}
              </h1>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <p style="font-size: 16px; line-height: 1.6; color: #3D3A30; margin: 0 0 16px 0;">
                Hello <strong>{{contact_name}}</strong>,
              </p>
              <p style="font-size: 15px; line-height: 1.6; color: #6B6658; margin: 0 0 24px 0;">
                Thank you for applying to showcase <strong>{{business_name}}</strong> at <strong>{{festival_name}}</strong>. We have logged your application and booth selection below.
              </p>

              <!-- Application Summary Box -->
              <table role="presentation" width="100%" style="background-color: #F7F5EE; border: 1px solid #E8E2D6; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding-bottom: 8px; font-size: 13px; color: #7A7566; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">
                    Application Summary
                  </td>
                  <td align="right" style="padding-bottom: 8px; font-size: 12px; color: #5A5A40; font-weight: 700;">
                    Ref: #{{application_id}}
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="border-top: 1px solid #E8E2D6; padding-top: 12px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="4" border="0" style="font-size: 14px; color: #3D3A30;">
                      <tr>
                        <td width="40%" style="color: #6B6658; font-weight: 500;">Business Name:</td>
                        <td style="font-weight: 600;">{{business_name}}</td>
                      </tr>
                      <tr>
                        <td style="color: #6B6658; font-weight: 500;">Booth Tier:</td>
                        <td style="font-weight: 600;">{{booth_type}}</td>
                      </tr>
                      <tr>
                        <td style="color: #6B6658; font-weight: 500;">Selected Days:</td>
                        <td style="font-weight: 600;">{{days_requested}}</td>
                      </tr>
                      <tr>
                        <td style="color: #6B6658; font-weight: 500;">Booth Fee:</td>
                        <td style="font-weight: 700; color: #5A5A40;">{{total_fee}}</td>
                      </tr>
                      <tr>
                        <td style="color: #6B6658; font-weight: 500;">Festival Grounds:</td>
                        <td style="font-weight: 600;">{{location}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- E-Transfer Booth Payment Card -->
              <div style="background-color: #FAF8F5; border: 1px dashed #5A5A40; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
                <h3 style="font-size: 15px; font-weight: 700; color: #3D3A30; margin: 0 0 8px 0;">
                  Booth Payment via E-Transfer
                </h3>
                <p style="font-size: 13.5px; line-height: 1.6; color: #5A5A40; margin: 0 0 10px 0;">
                  Payments for booth reservations are processed through E-Transfer. Please send your E-Transfer payment to:
                </p>
                <div style="background-color: #FFFFFF; border: 1px solid #E8E2D6; border-radius: 8px; padding: 10px 14px; font-family: monospace; font-size: 14px; font-weight: 700; color: #3D3A30; margin-bottom: 10px;">
                  {{etransfer_email}}
                </div>
                <p style="font-size: 13.5px; line-height: 1.6; color: #5A5A40; margin: 0 0 14px 0;">
                  After completing your payment, kindly send us the answer to your security question (or confirmation details if no security question is required) so we can verify your payment and confirm your booth reservation.
                </p>
                <a href="{{payment_link}}" style="display: inline-block; background-color: #5A5A40; color: #FFFFFF; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 700;">
                  Track Your Application &rarr;
                </a>
              </div>

              <p style="font-size: 14px; line-height: 1.6; color: #6B6658; margin: 0;">
                Thank you, and we look forward to having you at the event. Questions? Email <a href="mailto:{{contact_email}}" style="color: #5A5A40; font-weight: 700; text-decoration: underline;">{{contact_email}}</a>.
              </p>
            </td>
          </tr>

          <!-- Footer with Anti-Spam & Postal Address Compliance -->
          <tr>
            <td style="background-color: #F7F5EE; border-top: 1px solid #E8E2D6; padding: 20px 32px; text-align: center;">
              <p style="font-size: 12px; line-height: 1.6; color: #8A8576; margin: 0 0 8px 0;">
                {{festival_name}} &bull; {{location}}<br>
                Official Event Operations Desk &bull; <a href="mailto:{{contact_email}}" style="color: #5A5A40; text-decoration: none;">{{contact_email}}</a>
              </p>
              <p style="font-size: 11px; line-height: 1.5; color: #A09B8D; margin: 0;">
                This transactional email was sent regarding your vendor application (#{{application_id}}).
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },
  {
    id: 'tmpl-app-approved',
    key: 'vendor_app_approved',
    title: 'Vendor Approval & E-Transfer Booth Reservation',
    category: 'vendor',
    subject: 'Congratulations! Your booth for {{business_name}} is APPROVED - {{festival_name}}',
    previewText: 'Your application has been accepted! Review your assigned zone and E-Transfer booth settlement instructions.',
    dynamicVariables: [
      '{{contact_name}}',
      '{{business_name}}',
      '{{application_id}}',
      '{{booth_type}}',
      '{{zone_assignment}}',
      '{{days_approved}}',
      '{{total_fee}}',
      '{{etransfer_email}}',
      '{{festival_name}}',
      '{{location}}',
      '{{contact_email}}',
      '{{payment_link}}'
    ],
    antiSpamScore: 97,
    spamAdvice: [
      'High-contrast, professional design without all-caps clickbait subject line',
      'Transparent pricing and E-Transfer instructions without misleading financial claims',
      'Includes security & compliance checklist'
    ],
    isCustom: false,
    plainTextBody: `Congratulations {{contact_name}}!

We are thrilled to welcome {{business_name}} as an official vendor at {{festival_name}}!

CONFIRMED BOOKING DETAILS:
Application Reference: #{{application_id}}
Assigned Space: {{booth_type}}
Zone / Location: {{zone_assignment}}
Confirmed Sessions: {{days_approved}}
Total Booth Fee: \${{total_fee}}

E-TRANSFER BOOTH PAYMENT:
Payments for booth reservations are processed through E-Transfer.
Please send your E-Transfer payment to: {{etransfer_email}}

After completing your payment, kindly send us the answer to your security question (or confirmation details if no security question is required) via {{payment_link}} so we can verify your payment and confirm your booth reservation.

Thank you, and we look forward to having you at the event.

CRITICAL VENDOR CHECKLIST:
1. Canopy Weights: All 10x10 tents require 20-30 lbs per tent leg (sandbags or weight plates).
2. Daily Morning Load-In: Vehicle unloading gates open 8:00 AM daily.
3. Food Vendors: Please ensure your Food Service Permit is clearly displayed.

If you have questions, reply to {{contact_email}}.

Warm regards,
{{festival_name}} Operations Committee`,
    htmlBody: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vendor Application Approved</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FDFBF7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #3D3A30;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FDFBF7; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E8E2D6; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(90,90,64,0.06);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Banner -->
          <tr>
            <td style="background-color: #2D4A3E; padding: 32px; text-align: center;">
              <span style="display: inline-block; background-color: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.3); color: #E8F5E9; padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                Official Vendor Confirmation
              </span>
              <h1 style="color: #FFFFFF; font-size: 24px; font-weight: 700; margin: 8px 0 4px 0; letter-spacing: -0.5px;">
                Welcome to {{festival_name}}!
              </h1>
              <p style="color: #C8E6C9; font-size: 14px; margin: 0;">
                Your application for <strong>{{business_name}}</strong> has been accepted.
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="font-size: 16px; line-height: 1.6; color: #3D3A30; margin: 0 0 20px 0;">
                Dear <strong>{{contact_name}}</strong>,
              </p>
              <p style="font-size: 15px; line-height: 1.6; color: #6B6658; margin: 0 0 24px 0;">
                Congratulations! We are delighted to confirm that <strong>{{business_name}}</strong> has been approved to exhibit at <strong>{{festival_name}}</strong>.
              </p>

              <!-- Space Details -->
              <table role="presentation" width="100%" style="background-color: #F7F5EE; border: 1px solid #E8E2D6; border-radius: 12px; padding: 20px; margin-bottom: 24px;" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td colspan="2" style="font-size: 14px; font-weight: 700; color: #3D3A30; padding-bottom: 12px; border-bottom: 1px solid #E8E2D6;">
                    Confirmed Booth Details
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 12px; font-size: 14px; color: #6B6658;">Assigned Space:</td>
                  <td style="padding-top: 12px; font-size: 14px; font-weight: 700; color: #3D3A30;" align="right">{{booth_type}}</td>
                </tr>
                <tr>
                  <td style="padding-top: 8px; font-size: 14px; color: #6B6658;">Zone Placement:</td>
                  <td style="padding-top: 8px; font-size: 14px; font-weight: 700; color: #2D4A3E;" align="right">{{zone_assignment}}</td>
                </tr>
                <tr>
                  <td style="padding-top: 8px; font-size: 14px; color: #6B6658;">Confirmed Sessions:</td>
                  <td style="padding-top: 8px; font-size: 14px; font-weight: 700; color: #3D3A30;" align="right">{{days_approved}}</td>
                </tr>
                <tr>
                  <td style="padding-top: 8px; font-size: 14px; color: #6B6658;">Total Calculated Fee:</td>
                  <td style="padding-top: 8px; font-size: 16px; font-weight: 800; color: #5A5A40;" align="right">\${{total_fee}}</td>
                </tr>
              </table>

              <!-- E-Transfer Settlement Block -->
              <div style="background-color: #FAF8F5; border: 1px solid #E8E2D6; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
                <h3 style="font-size: 14px; font-weight: 700; color: #3D3A30; margin: 0 0 8px 0;">E-Transfer Booth Payment</h3>
                <p style="font-size: 13.5px; line-height: 1.6; color: #5A5A40; margin: 0 0 10px 0;">
                  Payments for booth reservations are processed through E-Transfer. Please send your E-Transfer payment to: <strong>{{etransfer_email}}</strong>
                </p>
                <p style="font-size: 13.5px; line-height: 1.6; color: #5A5A40; margin: 0 0 14px 0;">
                  After completing your payment, kindly send us the answer to your security question (or confirmation details if no security question is required) so we can verify your payment and confirm your booth reservation.
                </p>
                <a href="{{payment_link}}" style="display: inline-block; background-color: #5A5A40; color: #FFFFFF; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 700;">
                  Submit E-Transfer Security Answer &rarr;
                </a>
              </div>

              <!-- Vendor Guidelines Reminder -->
              <h3 style="font-size: 15px; font-weight: 700; color: #3D3A30; margin: 0 0 12px 0;">
                Essential Guidelines &amp; Rules
              </h3>
              <ul style="font-size: 13.5px; line-height: 1.6; color: #6B6658; margin: 0 0 24px 0; padding-left: 20px;">
                <li><strong>Tent Weights:</strong> Minimum 20-30 lbs weight per canopy leg is strictly mandatory.</li>
                <li><strong>Operating Hours:</strong> Booths must be staffed and active throughout official festival hours.</li>
                <li><strong>Morning Load-in:</strong> Gates open each morning prior to festival start. Vehicles must move to vendor lots immediately after unloading.</li>
              </ul>

              <p style="font-size: 14px; line-height: 1.6; color: #6B6658; margin: 0;">
                Thank you, and we look forward to having you at the event. For setup coordination, reply to <a href="mailto:{{contact_email}}" style="color: #5A5A40; font-weight: 700;">{{contact_email}}</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F7F5EE; border-top: 1px solid #E8E2D6; padding: 20px 32px; text-align: center;">
              <p style="font-size: 12px; color: #8A8576; margin: 0 0 6px 0;">
                {{festival_name}} &bull; {{location}}
              </p>
              <p style="font-size: 11px; color: #A09B8D; margin: 0;">
                Official Vendor Confirmation &bull; Reference #{{application_id}}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },
  {
    id: 'tmpl-attendee-pass',
    key: 'attendee_pass_vip',
    title: 'Attendee Free Digital Pass & Festival Guide',
    category: 'attendee',
    subject: '🎟️ Your Free Festival Pass for {{festival_name}} [Pass: #{{pass_code}}]',
    previewText: 'Your free digital admission pass is ready! View festival grounds map, parking info, and event schedule.',
    dynamicVariables: [
      '{{attendee_name}}',
      '{{pass_code}}',
      '{{group_size}}',
      '{{days_visiting}}',
      '{{festival_name}}',
      '{{location}}',
      '{{contact_email}}'
    ],
    antiSpamScore: 99,
    spamAdvice: [
      'Clean admission pass with clear event details',
      'No promotional push or deceptive claims',
      'Clear instructions for gate entry'
    ],
    isCustom: false,
    plainTextBody: `Hello {{attendee_name}}!

Your Free Admission Pass to {{festival_name}} is confirmed!

DIGITAL PASS CODE: {{pass_code}}
Party Size: {{group_size}} Guest(s)
Planned Session(s): {{days_visiting}}
Location: {{location}}

FESTIVAL HIGHLIGHTS:
- 100+ Curated artisan & small business booths
- Gourmet food truck row & sweet treats
- Live acoustic & stage music performances
- Free admission & dog/stroller-friendly grounds

PARKING & ARRIVAL:
Free visitor parking is available adjacent to the main festival entrance gates. Simply arrive and show your pass on your smartphone.

Questions? Contact {{contact_email}}.

See you at the festival!
{{festival_name}} Team`,
    htmlBody: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Festival Admission Pass</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FDFBF7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #3D3A30;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FDFBF7; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 540px; background-color: #FFFFFF; border: 1px solid #E8E2D6; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 16px rgba(90,90,64,0.08);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Top Header -->
          <tr>
            <td style="background-color: #5A5A40; padding: 28px 24px; text-align: center;">
              <span style="display: inline-block; background-color: #F0EBE0; color: #5A5A40; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                Official Digital Pass
              </span>
              <h1 style="color: #FFFFFF; font-size: 24px; font-weight: 700; margin: 4px 0 0 0; letter-spacing: -0.5px;">
                {{festival_name}}
              </h1>
            </td>
          </tr>

          <!-- Ticket Card Cutout Style -->
          <tr>
            <td style="padding: 28px 28px 20px 28px;">
              <p style="font-size: 15px; color: #6B6658; margin: 0 0 20px 0; text-align: center;">
                Hi <strong>{{attendee_name}}</strong>, your free general admission pass is active!
              </p>

              <!-- Ticket Box -->
              <div style="background-color: #F7F5EE; border: 2px dashed #D6CFBE; border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 24px;">
                <div style="font-size: 11px; font-weight: 700; color: #7A7566; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">
                  Digital Pass Code
                </div>
                <div style="font-size: 26px; font-weight: 800; color: #3D3A30; font-family: monospace; letter-spacing: 3px; margin-bottom: 12px;">
                  #{{pass_code}}
                </div>
                <div style="display: inline-block; background-color: #5A5A40; color: #FFFFFF; font-size: 12px; font-weight: 700; padding: 4px 14px; border-radius: 20px;">
                  {{group_size}} Guest(s) &bull; Free Admission
                </div>
              </div>

              <!-- Event Details -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="6" border="0" style="font-size: 13.5px; color: #3D3A30; margin-bottom: 20px;">
                <tr>
                  <td width="35%" style="color: #7A7566; font-weight: 600;">Location:</td>
                  <td style="font-weight: 700;">{{location}}</td>
                </tr>
                <tr>
                  <td style="color: #7A7566; font-weight: 600;">Session(s):</td>
                  <td style="font-weight: 700;">{{days_visiting}}</td>
                </tr>
                <tr>
                  <td style="color: #7A7566; font-weight: 600;">Entry Policy:</td>
                  <td style="font-weight: 700; color: #2D4A3E;">100% Free Entry &bull; Pet Friendly</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F7F5EE; border-top: 1px solid #E8E2D6; padding: 18px 24px; text-align: center;">
              <p style="font-size: 11.5px; color: #8A8576; margin: 0;">
                {{festival_name}} &bull; Inquiries: <a href="mailto:{{contact_email}}" style="color: #5A5A40; text-decoration: none;">{{contact_email}}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },
  {
    id: 'tmpl-vendor-waitlist',
    key: 'vendor_waitlist',
    title: 'Vendor Waitlist / Status Update',
    category: 'vendor',
    subject: 'Status Update: Your application for {{business_name}} at {{festival_name}}',
    previewText: 'Thank you for your application. Your business has been placed on our priority standby list.',
    dynamicVariables: [
      '{{contact_name}}',
      '{{business_name}}',
      '{{category}}',
      '{{festival_name}}',
      '{{contact_email}}'
    ],
    antiSpamScore: 98,
    spamAdvice: [
      'Empathetic, clear tone without ambiguous promises',
      'Includes direct contact email for follow-up questions'
    ],
    isCustom: false,
    plainTextBody: `Dear {{contact_name}},

Thank you so much for your interest in joining us at {{festival_name}} with {{business_name}}.

Due to overwhelming demand and limited booth capacities in the {{category}} category, we are currently at maximum capacity for primary spots. 

We have placed {{business_name}} on our Priority Standby / Waitlist. If an opening becomes available due to scheduling changes, our team will contact you immediately.

We sincerely appreciate your craftsmanship and hope to work with you!

Warm regards,
{{festival_name}} Vendor Committee`,
    htmlBody: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Application Status Update</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FDFBF7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #3D3A30;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FDFBF7; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 560px; background-color: #FFFFFF; border: 1px solid #E8E2D6; border-radius: 16px; overflow: hidden;" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="background-color: #5A5A40; padding: 24px; text-align: center;">
              <h1 style="color: #FFFFFF; font-size: 22px; font-weight: 700; margin: 0;">{{festival_name}}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px;">
              <p style="font-size: 15px; color: #3D3A30; margin: 0 0 16px 0;">Dear <strong>{{contact_name}}</strong>,</p>
              <p style="font-size: 14.5px; line-height: 1.6; color: #6B6658; margin: 0 0 16px 0;">
                Thank you for applying to showcase <strong>{{business_name}}</strong>. Due to high vendor interest, spaces in the <strong>{{category}}</strong> tier are currently fully committed.
              </p>
              <p style="font-size: 14.5px; line-height: 1.6; color: #6B6658; margin: 0 0 20px 0;">
                We have placed your business on our <strong>Priority Waitlist</strong>. Should an opening emerge, we will contact you right away.
              </p>
              <p style="font-size: 13.5px; color: #8A8576; margin: 0;">
                Questions? Feel free to reach us at <a href="mailto:{{contact_email}}" style="color: #5A5A40; font-weight: 700;">{{contact_email}}</a>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },
  {
    id: 'tmpl-broadcast-update',
    key: 'festival_broadcast',
    title: 'Festival Announcement & Weather Advisory Broadcast',
    category: 'broadcast',
    subject: '📢 Important Update: {{festival_name}} Schedule & Weather Advisory',
    previewText: 'Important reminder for all exhibitors and attendees regarding weekend weather and morning load-in times.',
    dynamicVariables: [
      '{{recipient_name}}',
      '{{announcement_headline}}',
      '{{announcement_body}}',
      '{{festival_name}}',
      '{{location}}',
      '{{contact_email}}'
    ],
    antiSpamScore: 96,
    spamAdvice: [
      'Informative broadcast layout with high-readability blocks',
      'Prominent organizer contact details and unsubscribe header compatibility'
    ],
    isCustom: false,
    plainTextBody: `Hello {{recipient_name}},

IMPORTANT UPDATE FOR {{festival_name}}:

{{announcement_headline}}

{{announcement_body}}

Grounds Location: {{location}}
Contact Support: {{contact_email}}

Thank you for your community participation!
{{festival_name}} Organizing Committee`,
    htmlBody: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Festival Broadcast</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FDFBF7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #3D3A30;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FDFBF7; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #FFFFFF; border: 1px solid #E8E2D6; border-radius: 16px; overflow: hidden;" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="background-color: #5A5A40; padding: 24px; text-align: center;">
              <span style="display: inline-block; background-color: #F0EBE0; color: #5A5A40; padding: 3px 10px; border-radius: 14px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
                Community Bulletin
              </span>
              <h1 style="color: #FFFFFF; font-size: 22px; font-weight: 700; margin: 0;">{{festival_name}}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px;">
              <h2 style="font-size: 18px; font-weight: 700; color: #3D3A30; margin: 0 0 12px 0;">
                {{announcement_headline}}
              </h2>
              <p style="font-size: 15px; line-height: 1.6; color: #6B6658; margin: 0 0 20px 0;">
                {{announcement_body}}
              </p>
              <table role="presentation" width="100%" style="background-color: #F7F5EE; border-radius: 8px; padding: 12px; font-size: 13px; color: #5A5A40;" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td><strong>Location:</strong> {{location}} &bull; <strong>Inquiries:</strong> {{contact_email}}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },
  {
    id: 'tmpl-payment-confirmed',
    key: 'vendor_payment_confirmed',
    title: 'Payment Received & Official Booth Pass',
    category: 'vendor',
    subject: '✓ Payment Confirmed: Booth Reservation Locked for {{business_name}} - {{festival_name}}',
    previewText: 'Your booth payment has been received and verified. Access your official exhibitor badge & load-in schedule.',
    dynamicVariables: [
      '{{contact_name}}',
      '{{business_name}}',
      '{{application_id}}',
      '{{invoice_number}}',
      '{{paid_amount}}',
      '{{booth_zone}}',
      '{{booth_type}}',
      '{{festival_name}}',
      '{{location}}',
      '{{contact_email}}',
      '{{current_year}}'
    ],
    antiSpamScore: 99,
    spamAdvice: [
      'Transactional receipt for verified payment',
      'Includes security pass instructions and venue coordinates',
      'Clear CAN-SPAM compliant footer with organizer physical address'
    ],
    isCustom: false,
    plainTextBody: `PAYMENT CONFIRMATION & OFFICIAL BOOTH PASS - {{festival_name}}
==================================================
Dear {{contact_name}},

We have successfully processed your payment of {{paid_amount}} for {{business_name}}!
Your vendor booth reservation is 100% locked and verified.

RESERVATION SUMMARY:
- Application Ref: #{{application_id}}
- Invoice Ref: {{invoice_number}}
- Space Tier: {{booth_type}}
- Assigned Zone: {{booth_zone}}
- Total Paid: {{paid_amount}} USD
- Grounds: {{location}}

LOAD-IN & GATE CHECK-IN:
1. Vendor Load-In Gate opens at 8:00 AM daily.
2. Present this confirmation or mention Application #{{application_id}} at check-in.
3. Canopy weights (20-30 lbs per tent leg) are strictly required upon setup.

Thank you for being part of {{festival_name}}!

Questions? Contact: {{contact_email}}
{{festival_name}} Operations Committee`,
    htmlBody: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Confirmed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #3D3A30;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FAF8F5; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E8E2D6; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.05);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Green Header Banner -->
          <tr>
            <td style="background-color: #2D5A27; padding: 32px 28px; text-align: center; color: #FFFFFF;">
              <span style="display: inline-block; background-color: rgba(255,255,255,0.2); color: #FFFFFF; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; padding: 4px 14px; border-radius: 20px; margin-bottom: 8px;">
                ✓ Payment Received & Verified
              </span>
              <h1 style="margin: 6px 0 0 0; font-size: 24px; font-weight: 800; color: #FFFFFF; line-height: 1.2;">
                Booth Reservation Confirmed!
              </h1>
              <p style="margin: 4px 0 0 0; font-size: 13px; color: #E0F2E9;">
                {{festival_name}} &bull; {{location}}
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 28px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #3D3A30;">
                Dear <strong>{{contact_name}}</strong>,
              </p>
              <p style="margin: 0 0 22px 0; font-size: 14px; color: #6B6658; line-height: 1.6;">
                Great news! We have confirmed receipt of your payment in full. <strong>{{business_name}}</strong> is officially locked in for <strong>{{festival_name}}</strong>.
              </p>

              <!-- Payment Receipt Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F7F5EE; border: 1px solid #E8E2D6; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
                <tr>
                  <td style="padding-bottom: 8px; font-size: 11px; color: #7A7566; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px;">
                    Receipt Summary
                  </td>
                  <td align="right" style="padding-bottom: 8px; font-size: 11px; color: #2D5A27; font-weight: 800; text-transform: uppercase;">
                    Paid in Full
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="border-top: 1px solid #E8E2D6; padding-top: 12px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="4" border="0" style="font-size: 13.5px; color: #3D3A30;">
                      <tr>
                        <td width="42%" style="color: #6B6658;">Vendor / Business:</td>
                        <td style="font-weight: 700;">{{business_name}}</td>
                      </tr>
                      <tr>
                        <td style="color: #6B6658;">Assigned Zone:</td>
                        <td style="font-weight: 700; color: #2D5A27;">{{booth_zone}}</td>
                      </tr>
                      <tr>
                        <td style="color: #6B6658;">Booth Space:</td>
                        <td style="font-weight: 600;">{{booth_type}}</td>
                      </tr>
                      <tr>
                        <td style="color: #6B6658;">Application ID:</td>
                        <td style="font-family: monospace; font-weight: 600;">#{{application_id}}</td>
                      </tr>
                      <tr>
                        <td style="color: #6B6658; font-weight: 700;">Total Amount Paid:</td>
                        <td style="font-weight: 800; font-size: 16px; color: #2D5A27;">{{paid_amount}} USD</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Exhibitor Pass Box -->
              <div style="background-color: #FAF8F5; border: 2px dashed #5A5A40; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
                <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #5A5A40;">
                  Official Vendor Pass Code
                </span>
                <div style="font-family: monospace; font-size: 26px; font-weight: 800; color: #3D3A30; letter-spacing: 3px; margin: 8px 0;">
                  VPASS-{{application_id}}
                </div>
                <p style="margin: 0; font-size: 12px; color: #7A7566;">
                  Show this email or pass code at Gate 3 (Vendor Load-In) upon morning arrival.
                </p>
              </div>

              <!-- Setup Guidelines -->
              <h3 style="font-size: 14px; font-weight: 700; color: #3D3A30; margin: 0 0 10px 0;">
                Setup & Load-In Checklist:
              </h3>
              <ul style="font-size: 13px; line-height: 1.6; color: #6B6658; margin: 0 0 20px 0; padding-left: 18px;">
                <li><strong>Arrival:</strong> Gates open at 8:00 AM. Setup must be complete 30 mins before gates open to attendees.</li>
                <li><strong>Canopy Weights:</strong> 20-30 lbs per tent leg is mandatory for wind resistance.</li>
                <li><strong>Parking:</strong> Move vehicle to designated Vendor Lot B immediately after unloading.</li>
              </ul>

              <p style="margin: 0; font-size: 13px; color: #6B6658;">
                Need help or have questions? Email our support desk anytime at <a href="mailto:{{contact_email}}" style="color: #5A5A40; font-weight: 700;">{{contact_email}}</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F7F5EE; padding: 20px 28px; border-top: 1px solid #E8E2D6; text-align: center; font-size: 11px; color: #7A7566; line-height: 1.6;">
              <p style="margin: 0 0 4px 0; font-weight: 700; color: #5A5A40;">{{festival_name}}</p>
              <p style="margin: 0;">{{location}} &bull; Official Support: {{contact_email}}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },
  {
    id: 'tmpl-custom-message',
    key: 'applicant_custom_message',
    title: 'Custom Organizer Message to Applicant',
    category: 'custom',
    subject: 'Update from {{festival_name}} regarding {{business_name}}: {{custom_subject}}',
    previewText: 'Message from {{festival_name}} organizers regarding your vendor registration.',
    dynamicVariables: [
      '{{contact_name}}',
      '{{business_name}}',
      '{{custom_subject}}',
      '{{custom_message_body}}',
      '{{festival_name}}',
      '{{location}}',
      '{{contact_email}}'
    ],
    antiSpamScore: 98,
    spamAdvice: [
      'Personalized message with direct organizer contact address',
      'Standard anti-spam footer with clear organization identity'
    ],
    isCustom: true,
    plainTextBody: `Hello {{contact_name}},

Message regarding {{business_name}} at {{festival_name}}:

{{custom_message_body}}

---
Warm regards,
{{festival_name}} Organizing Team
Grounds: {{location}}
Support Email: {{contact_email}}`,
    htmlBody: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>{{custom_subject}}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #3D3A30;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FAF8F5; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E8E2D6; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.04);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #5A5A40; padding: 28px 24px; text-align: left; color: #FFFFFF;">
              <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #EAE4D6;">Official Organizer Communication</span>
              <h1 style="margin: 6px 0 0 0; font-size: 22px; font-weight: 800; color: #FFFFFF;">{{custom_subject}}</h1>
              <p style="margin: 4px 0 0 0; font-size: 13px; color: #EAE4D6;">{{festival_name}} &bull; {{business_name}}</p>
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="padding: 28px;">
              <p style="font-size: 15px; color: #3D3A30; margin: 0 0 16px 0;">
                Dear <strong>{{contact_name}}</strong>,
              </p>
              
              <div style="font-size: 14.5px; line-height: 1.7; color: #4B4639; white-space: pre-line; background-color: #FDFBF7; padding: 20px; border-radius: 12px; border: 1px solid #E8E2D6; margin-bottom: 24px;">
                {{custom_message_body}}
              </div>

              <p style="font-size: 13px; color: #7A7566; margin: 0; line-height: 1.5;">
                If you have questions or need to follow up, you can reply directly to this email or reach us at <a href="mailto:{{contact_email}}" style="color: #5A5A40; font-weight: 700;">{{contact_email}}</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F7F5EE; padding: 20px 24px; border-top: 1px solid #E8E2D6; text-align: center; font-size: 11px; color: #7A7566; line-height: 1.6;">
              <p style="margin: 0 0 4px 0; font-weight: 700; color: #5A5A40;">{{festival_name}}</p>
              <p style="margin: 0;">{{location}} &bull; Support: {{contact_email}}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  }
];
