import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

// Initialize Resend client
let resendClient = null;

if (process.env.RESEND_API_KEY) {
  resendClient = new Resend(process.env.RESEND_API_KEY);
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
      return {
        success: false,
        error: "Email service not configured. Please contact support.",
      };
    }

    const result = await resendClient.emails.send({
      from: process.env.EMAIL_USER || "noreply@livique.co.in",
      to: to,
      subject: subject,
      html: html || text || "",
      text: text || "",
    });

    if (result.error) {
      return {
        success: false,
        error: "Failed to send email. Please try again later.",
      };
    }

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
