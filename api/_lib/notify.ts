import nodemailer from "nodemailer"
import twilio from "twilio"

const VOLT = "#ccff00"
const INK = "#0a0a0a"

/**
 * Confirmation email for email signups. Inline styles are required in email
 * HTML (mail clients strip <style>/external CSS) — this is the one place the
 * project's no-inline-styles rule doesn't apply.
 */
function confirmationHtml(): string {
  return `
  <div style="margin:0;padding:32px 16px;background:${INK};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;">
      <tr><td style="background:${VOLT};padding:22px 32px;">
        <span style="font-size:20px;font-weight:900;letter-spacing:0.04em;color:${INK};">ARMO</span>
      </td></tr>
      <tr><td style="padding:36px 32px;">
        <h1 style="margin:0 0 12px;font-size:26px;font-weight:800;color:${INK};">You&rsquo;re on the list.</h1>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3a3a3d;">
          Thanks for requesting early access to ARMO. You&rsquo;re officially in the queue &mdash;
          we&rsquo;ll reach out the moment your spot opens up.
        </p>
        <p style="margin:0;font-size:15px;line-height:1.6;color:#3a3a3d;">Make fitness fun. 🎮</p>
      </td></tr>
      <tr><td style="padding:20px 32px;border-top:1px solid #ececef;">
        <p style="margin:0;font-size:12px;color:#8a8a8f;">
          You received this because you signed up for ARMO early access. If this wasn&rsquo;t you, ignore this email.
        </p>
      </td></tr>
    </table>
  </div>`
}

/**
 * Send the confirmation email from a Gmail account via SMTP.
 * Requires GMAIL_USER + GMAIL_APP_PASSWORD (a 16-char Google App Password —
 * generated at myaccount.google.com/apppasswords with 2-Step Verification on).
 * No-ops (with a warning) if unconfigured.
 */
export async function sendEmail(to: string): Promise<void> {
  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "") // strip spaces
  if (!user || !pass) {
    console.warn("[notify] Gmail not configured (GMAIL_USER/GMAIL_APP_PASSWORD) — email skipped.")
    return
  }
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  })
  await transporter.sendMail({
    from: `ARMO <${user}>`,
    to,
    subject: "You're on the ARMO early access list",
    html: confirmationHtml(),
  })
}

/** Send the confirmation SMS. No-ops (with a warning) if Twilio isn't configured. */
export async function sendSms(to: string): Promise<void> {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_FROM_NUMBER
  if (!sid || !token || !from) {
    console.warn("[notify] Twilio not configured (TWILIO_*) — SMS skipped.")
    return
  }
  const client = twilio(sid, token)
  await client.messages.create({
    to,
    from,
    body: "You're on the ARMO early access list. We'll text you the moment your spot opens. Make fitness fun.",
  })
}
