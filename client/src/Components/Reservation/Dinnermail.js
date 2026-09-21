const nodemailer = require('nodemailer');

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'SMTP',
  auth: {
    user: 'ghabsadinnerreservations@gmail.com', // Replace with your email address
    pass: 'afprnthgbdwezggv' // Replace with your email password
  }
});

// Function to send the confirmation email
const Dinnermail = async (email, reservationReference) => {
  try {
    // Define the email content
    const mailOptions = {
      from: 'ghabsadinnerreservations@gmail.com', // Replace with your email address
      to: email,
      subject: 'Reservation Confirmation',
      text: `Thank you for your reservation. Your reservation reference is ${reservationReference}.`
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully');
  } catch (error) {
    console.log('Error sending confirmation email:', error);
    throw error;
  }
};

module.exports = {
  Dinnermail
};
