const nodemailer = require("nodemailer");
require("dotenv/config");

//Precisa alterar o sevice de acordo com o servidor de email
const transporter = nodemailer.createTransport({
  service: process.env.NODEMAILER_SERVICE,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

const sendMessage = (email, description) => {
  let emailApplication = process.env.NODEMAILER_USER;
  let active = process.env.NODEMAILER_ACTIVE;

  if (active == "false") {
    return true;
  }

  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: `<${emailApplication}>`,
        to: email,
        subject: "Nova transação",
        text: description,
      },
      (err, result) => {
        if (err) {
          return reject(err);
        } else return resolve(true);
      }
    );
  }).catch((err) => {
    console.log(err);
  });
};

module.exports = { sendMessage };
