// Send an email from the server

const nodemailer = require('nodemailer');

module.exports = {
  sendEmail(recipient, subject, body) {
    // Configure email options
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: recipient,
      subject: subject,
      html: `<p>${body}</p>`
    };
    // Send email
    transport.sendMail(mailOptions, (err, info) => {
      if (err) throw err;
      console.log(`mail sent: ${info.response}`);
    });
  }
};
