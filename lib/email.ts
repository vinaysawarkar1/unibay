import nodemailer from 'nodemailer'

let transporter: nodemailer.Transporter | null = null

export function isEmailConfigured(): boolean {
  return Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD)
}

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  }
  return transporter
}

export async function sendOTPEmail(to: string, otp: string): Promise<void> {
  if (!isEmailConfigured()) {
    // Graceful degradation: without SMTP credentials we cannot send mail.
    // Log the code so the flow remains testable in development.
    console.log(`[email] (not configured) verification OTP for ${to}: ${otp}`)
    return
  }
  const transporter = getTransporter()

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #007bff; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
          .otp-code { font-size: 32px; font-weight: bold; color: #007bff; text-align: center; padding: 20px; background: white; border: 2px dashed #007bff; margin: 20px 0; border-radius: 5px; letter-spacing: 5px; }
          .footer { font-size: 12px; color: #666; text-align: center; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Email Verification</h1>
          </div>
          <div class="content">
            <p>Hi there!</p>
            <p>Your one-time password (OTP) for email verification is:</p>
            <div class="otp-code">${otp}</div>
            <p><strong>This code will expire in 10 minutes.</strong></p>
            <p>If you didn't request this code, please ignore this email.</p>
            <p>Never share your OTP with anyone.</p>
          </div>
          <div class="footer">
            <p>© 2026 Unibay. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `

  await transporter.sendMail({
    from: `"Unibay" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your Email Verification Code - Unibay',
    html: htmlContent,
    text: `Your OTP is: ${otp}. This code will expire in 10 minutes.`,
  })
}

export async function sendLoginOTPEmail(to: string, otp: string): Promise<void> {
  if (!isEmailConfigured()) {
    console.log(`[email] (not configured) login OTP for ${to}: ${otp}`)
    return
  }
  const transporter = getTransporter()

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
          .otp-code { font-size: 32px; font-weight: bold; color: #28a745; text-align: center; padding: 20px; background: white; border: 2px dashed #28a745; margin: 20px 0; border-radius: 5px; letter-spacing: 5px; }
          .footer { font-size: 12px; color: #666; text-align: center; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Login Verification</h1>
          </div>
          <div class="content">
            <p>Hi there!</p>
            <p>Your one-time password (OTP) for login is:</p>
            <div class="otp-code">${otp}</div>
            <p><strong>This code will expire in 10 minutes.</strong></p>
            <p>If you didn't request this code, please ignore this email and your account is safe.</p>
            <p>Never share your OTP with anyone.</p>
          </div>
          <div class="footer">
            <p>© 2026 Unibay. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `

  await transporter.sendMail({
    from: `"Unibay" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your Login Verification Code - Unibay',
    html: htmlContent,
    text: `Your login OTP is: ${otp}. This code will expire in 10 minutes.`,
  })
}
