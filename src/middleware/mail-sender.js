const nodemailer = require("nodemailer");
const password = require('../middleware/password-generator');
// async..await is not allowed in global scope, must use a wrapper
exports.sendEmail = async (to, emailHeader) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'miduqasem74@gmail.com', // generated ethereal user
      pass: 'Al_Ahly74', // generated ethereal password
    },
  });
  let tempPassword =  password.customPassword() ; 
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: `${to}`, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello Hazem,</b>" +
    "This is your temporary password for achieve kpi dashboard, don't share this password with anyone "
    + `<b style="color:green">${tempPassword}</b>`
    , // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  return tempPassword;
}
