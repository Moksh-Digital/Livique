import Mailjet from "node-mailjet";
import dotenv from "dotenv";

dotenv.config();

console.log("📧 Email Configuration (Mailjet):");
console.log("- Email From:", process.env.EMAIL_USER);
console.log(
  "- Mailjet API Key Configured:",
  process.env.MAILJET_API_KEY ? "✅ Yes" : "❌ No"
);
console.log(
  "- Mailjet Secret Key Configured:",
  process.env.MAILJET_SECRET_KEY ? "✅ Yes" : "❌ No"
);

// ✅ Correct way: apiConnect
let mailjetClient = null;

if (process.env.MAILJET_API_KEY && process.env.MAILJET_SECRET_KEY) {
  // Debug: Check key format
  const apiKeyLength = process.env.MAILJET_API_KEY.length;
  const secretKeyLength = process.env.MAILJET_SECRET_KEY.length;
  
  console.log("🔍 API Key Debug Info:");
  console.log("   - API Key Length:", apiKeyLength);
  console.log("   - Secret Key Length:", secretKeyLength);
  console.log("   - API Key starts with:", process.env.MAILJET_API_KEY.substring(0, 8) + "...");
  console.log("   - Secret Key starts with:", process.env.MAILJET_SECRET_KEY.substring(0, 8) + "...");
  
  mailjetClient = Mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_SECRET_KEY
  );
  console.log("✅ Mailjet client initialized successfully");
} else {
  console.error(
    "❌ MAILJET_API_KEY or MAILJET_SECRET_KEY not found in environment variables"
  );
  console.log(
    "💡 Get your API credentials from: https://app.mailjet.com/account/apikeys"
  );
}

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    if (!mailjetClient) {
      console.error("❌ Cannot send email: Mailjet client not initialized");
      return {
        success: false,
        error: "Email service not configured. Please contact support.",
      };
    }

    console.log("📤 Attempting to send email via Mailjet to:", to);

    const result = await mailjetClient.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.EMAIL_USER || "noreply@livique.co.in",
            Name: "Livique",
          },
          To: [
            {
              Email: to,
              Name: to.split("@")[0],
            },
          ],
          Subject: subject,
          TextPart: text || "",
          HTMLPart: html || text || "",
        },
      ],
    });

    console.log("✅ Email sent successfully via Mailjet");
    console.log("   - Status:", result.body.Messages[0].Status);
    console.log("   - Message ID:", result.body.Messages[0].To[0].MessageID);

    return {
      success: true,
      messageId: result.body.Messages[0].To[0].MessageID,
    };
  } catch (error) {
    console.error("❌ ERROR: Failed to send email via Mailjet");
    console.error("   - StatusCode:", error.statusCode || "no status");
    console.error("   - Error Code:", error.code || "no code");
    console.error("   - Error Message:", error.message);
    
    if (error.response && error.response.body) {
      console.error(
        "   - Response Body:",
        JSON.stringify(error.response.body, null, 2)
      );
    }

    let errorMessage = "Failed to send email. Please try again later.";

    if (error.statusCode === 401) {
      errorMessage =
        "Email service authentication failed. Please contact support.";
      console.error(
        "💡 Check if MAILJET_API_KEY and MAILJET_SECRET_KEY are correct & active"
      );
      console.error("💡 Visit https://app.mailjet.com/account/apikeys to verify");
    } else if (error.statusCode === 403) {
      errorMessage =
        "Email sending is disabled for this account. Please contact support.";
    } else if (error.statusCode === 400) {
      errorMessage = "Invalid email configuration. Please contact support.";
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

export default sendEmail;
