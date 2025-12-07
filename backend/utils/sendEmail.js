import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

console.log("📧 Email Configuration (SendGrid):");
console.log("- Email From:", process.env.EMAIL_USER);
console.log("- SendGrid API Key Configured:", process.env.SENDGRID_API_KEY ? "✅ Yes" : "❌ No");

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log("✅ SendGrid initialized successfully");
} else {
    console.error("❌ SENDGRID_API_KEY not found in environment variables");
    console.log("💡 Get your API key from: https://app.sendgrid.com/settings/api_keys");
}

/**
 * Sends an email using SendGrid.
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} [options.text] - Plain text content
 * @param {string} [options.html] - HTML content
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
const sendEmail = async ({ to, subject, text, html }) => {
    try {
        if (!process.env.SENDGRID_API_KEY) {
            console.error("❌ Cannot send email: SENDGRID_API_KEY not configured");
            return { 
                success: false, 
                error: "Email service not configured. Please contact support." 
            };
        }

        console.log("📤 Attempting to send email via SendGrid to:", to);
        
        const msg = {
            to: to,
            from: {
                email: process.env.EMAIL_USER || 'noreply@livique.co.in',
                name: 'Livique'
            },
            subject: subject,
            text: text || '',
            html: html || text || '',
        };

        const response = await sgMail.send(msg);
        
        console.log("✅ Email sent successfully via SendGrid");
        console.log("   - Status Code:", response[0].statusCode);
        console.log("   - Message ID:", response[0].headers['x-message-id']);
        
        return { 
            success: true, 
            messageId: response[0].headers['x-message-id'] 
        };
        
    } catch (error) {
        console.error("❌ ERROR: Failed to send email via SendGrid");
        console.error("   - Error Code:", error.code);
        console.error("   - Error Message:", error.message);
        
        if (error.response) {
            console.error("   - Response Body:", JSON.stringify(error.response.body, null, 2));
        }
        
        // Return user-friendly error message
        let errorMessage = "Failed to send email. Please try again later.";
        
        if (error.code === 401 || error.code === 403) {
            errorMessage = "Email service authentication failed. Please contact support.";
            console.error("💡 Check if SENDGRID_API_KEY is valid and has send permissions");
        } else if (error.code === 400) {
            errorMessage = "Invalid email configuration. Please contact support.";
        }
        
        return { 
            success: false, 
            error: errorMessage 
        };
    }
};

export default sendEmail;