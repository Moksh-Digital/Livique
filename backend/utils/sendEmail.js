import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

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

/**
 * Sends an email with the provided content.
 */
const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const mailOptions = {
            from: `Livique <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            text: text,
            html: html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully: %s", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("ERROR: Failed to send email.", error);
        return { success: false, error: error.message };
    }
};

export default sendEmail;