const router = require("express").Router();
const nodemailer = require('nodemailer');

router.post('/send-email', (req, res) => {
    const { name, subject, email, message } = req.body;
  
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ghabsaitug@gmail.com',
        pass: 'erlenmeYer23'
      }
    });
  
    const mailOptions = {
      from: 'ghabsaitug@gmail.com',
      to: 'bralogicatlast@gmail.com',
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
