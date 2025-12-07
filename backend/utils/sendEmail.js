import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log("📧 Email Configuration:");
console.log("- Email User:", process.env.EMAIL_USER);
console.log("- Email Pass Configured:", process.env.EMAIL_PASS ? "✅ Yes" : "❌ No");

// Create a transporter object
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, 
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Email transporter verification failed:", error);
    } else {
        console.log("✅ Email server is ready to send emails");
    }
});

/**
 * Sends an email with the provided content.
 */
const sendEmail = async ({ to, subject, text, html }) => {
    try {
        console.log("Attempting to send email to:", to);
        console.log("EMAIL_USER configured:", process.env.EMAIL_USER ? "Yes" : "No");
        console.log("EMAIL_PASS configured:", process.env.EMAIL_PASS ? "Yes" : "No");
        
        const mailOptions = {
            from: `Livique <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            text: text,
            html: html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully: %s", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("❌ ERROR: Failed to send email.");
        console.error("Error details:", error.message);
        console.error("Error code:", error.code);
        console.error("Full error:", error);
        return { success: false, error: error.message };
    }
};

export default sendEmail;