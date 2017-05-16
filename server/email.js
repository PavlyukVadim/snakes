const nodemailer = require('nodemailer');
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport('smtps://@smtp.gmail.com');
let sendMail = (data) => {
  console.log('send mail...');
  const mailOptions = {
    from: data.email,
    to: 'pavlyuk.dev@gmail.com',
    subject: 'Snakes ✔',
    text: data.message + ' 🐴'
  };
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if(error) {
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });
}

module.exports = sendMail;
