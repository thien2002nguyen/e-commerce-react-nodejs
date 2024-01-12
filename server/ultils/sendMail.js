const nodemailer = require('nodemailer')
const asyncHandler = require('express-async-handler')

const sendMail = asyncHandler(async ({ email, html, subject }) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"E-Commerce" <no-relply@ecommerce.com>', // sender address
        to: email, // list of receivers
        subject, // Subject line
        html, // html body
    });
    return info;
})

module.exports = sendMail