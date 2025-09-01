const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

//? Load dotenv into process
dotenv.config();

//create a function to send email
const sendAccountVerificationEmail = async(to, verificationToken) => {
    try {
        //create transport
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.APP_PWD,
            },
        });
        // create msg
        const message = {
            to,
            subject: "Account Verification",
            html: ` 
            <p>You are receiving this email because you (or someone else) have requested to verify your account.</p>
            <p>Please click on the following link, or paste this into your browser to complete the process:</p>
        <p>https://localhost:3000/verify-account/${verificationToken}</p>
        <p>If you did not request this, please ignore this email.</p>        

            `,
        };
        //send the email
        const info = await transporter.sendMail(message);
        console.log("Email sent", info.messageId);
    } catch (error) {
        console.log(error);
        throw new Error("Email sending failed!");
    }

    };

    module.exports = sendAccountVerificationEmail;

