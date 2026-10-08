const router = require("express").Router();
const nodemailer = require('nodemailer');

router.post('/send-email', (req, res) => {
    const { name, subject, email, message } = req.body;

    // Gmail credentials come from the environment (production: scripts/config/ghabsa-api.env).
    // MAIL_PASS must be a Gmail App Password; mail stays off until it is set.
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      return res.status(503).send('Email is not configured.');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      // Messages land in the same mailbox that sends them.
      to: process.env.MAIL_USER,
      subject: subject,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`
    };
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error(error);
        res.status(500).send('An error occurred while sending the email.');
      } else {
        console.log('Email sent: ' + info.response);
        res.send('Email has been sent successfully.');
      }
    });
  });

module.exports = router;
