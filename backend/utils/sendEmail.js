import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

console.log("📧 Email Configuration (Resend):");
console.log("- Email From:", process.env.EMAIL_USER);
console.log(
  "- Resend API Key Configured:",
  process.env.RESEND_API_KEY ? "✅ Yes" : "❌ No"
);

// Initialize Resend client
let resendClient = null;

if (process.env.RESEND_API_KEY) {
  resendClient = new Resend(process.env.RESEND_API_KEY);
  console.log("✅ Resend client initialized successfully");
} else {
  console.error(
    "❌ RESEND_API_KEY not found in environment variables"
  );
  console.log(
    "💡 Get your API key from: https://resend.com/api-keys"
  );
}

/**
 * Sends an email using Resend.
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} [options.text] - Plain text content
 * @param {string} [options.html] - HTML content
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    if (!resendClient) {
      console.error("❌ Cannot send email: Resend client not initialized");
      return {
        success: false,
        error: "Email service not configured. Please contact support.",
      };
    }

    console.log("📤 Attempting to send email via Resend to:", to);

    const result = await resendClient.emails.send({
      from: process.env.EMAIL_USER || "noreply@livique.co.in",
      to: to,
      subject: subject,
      html: html || text || "",
      text: text || "",
    });

    if (result.error) {
      console.error("❌ ERROR: Failed to send email via Resend");
      console.error("   - Error:", result.error.message);
      return {
        success: false,
        error: "Failed to send email. Please try again later.",
      };
    }

    console.log("✅ Email sent successfully via Resend");
    console.log("   - Message ID:", result.data.id);

    return {
      success: true,
      messageId: result.data.id,
    };
  } catch (error) {
    console.error("❌ ERROR: Failed to send email via Resend");
    console.error("   - Error Code:", error.code || "unknown");
    console.error("   - Error Message:", error.message);

    let errorMessage = "Failed to send email. Please try again later.";

    if (error.message?.includes("401")) {
      errorMessage = "Email service authentication failed. Please contact support.";
      console.error("💡 Check if RESEND_API_KEY is correct");
      console.error("💡 Visit https://resend.com/api-keys to verify");
    } else if (error.message?.includes("invalid_request")) {
      errorMessage = "Invalid email configuration. Please contact support.";
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

export default sendEmail;
