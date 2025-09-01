const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

//? Load dotenv into process
dotenv.config();

//? Create function to send email

const sendEmail = async (to, resetToken) => {
    try {
        //? Create transport
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.APP_PWD,
            },
        });
        // Create msg
        const message = {
            to,
            subject: "Password reset",
            html: `
                    <p>You are receiving this email because you (or someone else) have requested the reset of a password.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process:</p>
        <p>https://localhost:3000/reset-password/${resetToken}</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            `,
        };
        //send the email 
        const info = await  transporter.sendMail(message);
        console.log("Email sent", info.messageId);

    } catch {
        console.log("Email sending Failed!");
    }
};

module.exports = sendEmail;