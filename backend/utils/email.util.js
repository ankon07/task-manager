// backend/utils/email.util.js
// Placeholder for email sending logic [cite: 2]
// You would need to install and configure a library like Nodemailer
// and an email service (e.g., SendGrid, Mailgun, or SMTP server)

// const nodemailer = require('nodemailer');

// // Configure transporter (example using SMTP)
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// exports.sendVerificationEmail = (toEmail, verificationToken) => {
//   const verificationLink = `${process.env.APP_BASE_URL}/api/auth/verify/${verificationToken}`;

//   const mailOptions = {
//     from: `"Secure Task Manager" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
//     to: toEmail,
//     subject: 'Verify Your Email for Secure Task Manager',
//     html: `
//       <p>Thank you for registering!</p>
//       <p>Please click the link below to verify your email address:</p>
//       <a href="${verificationLink}">${verificationLink}</a>
//       <p>If you did not create an account, please ignore this email.</p>
//     `,
//     text: `Please verify your email by visiting this link: ${verificationLink}`
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error('Error sending verification email:', error);
//       // Implement proper error handling/logging
//     } else {
//       console.log('Verification email sent: %s', info.messageId);
//     }
//   });
// };

// Add other email functions if needed (e.g., password reset)

module.exports = {
    // Placeholder function - replace with actual implementation
    sendVerificationEmail: (toEmail, verificationToken) => {
        console.log(`--- Email Simulation ---`);
        console.log(`To: ${toEmail}`);
        console.log(`Subject: Verify Your Email`);
        console.log(`Token: ${verificationToken}`);
        // In a real app, construct the verification URL using APP_BASE_URL from .env
        console.log(`Verification Link (simulated): http://localhost:3000/verify/${verificationToken}`);
        console.log(`--- End Email Simulation ---`);
    }
};