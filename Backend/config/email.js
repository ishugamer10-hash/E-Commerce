import nodemailer from "nodemailer";

const createTransporter = () => {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_SECURE,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error("Email service is not configured");
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

const sendOtpEmail = async (to, subject, otp, purpose) => {
  const transporter = createTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const appName = process.env.APP_NAME || "Forever";
  const purposeLabel =
    purpose === "login" ? "login" : purpose === "password reset" ? "password reset" : purpose;

  await transporter.sendMail({
    from,
    to,
    subject,
    text: `Your ${appName} ${purposeLabel} OTP is ${otp}. It will expire in 10 minutes. If you did not request this code, please ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; color: #111827;">
        <h2 style="margin: 0 0 12px;">${appName} Verification Code</h2>
        <p style="margin: 0 0 16px; line-height: 1.6;">
          Use the OTP below to complete your ${purposeLabel}.
        </p>
        <div style="margin: 0 0 16px; padding: 16px; text-align: center; background: #f3f4f6; border-radius: 10px; font-size: 28px; font-weight: 700; letter-spacing: 6px;">
          ${otp}
        </div>
        <p style="margin: 0 0 8px; line-height: 1.6;">This OTP will expire in 10 minutes.</p>
        <p style="margin: 0; line-height: 1.6; color: #6b7280;">
          If you did not request this code, you can safely ignore this email.
        </p>
      </div>
    `,
  });
};

export default sendOtpEmail;
