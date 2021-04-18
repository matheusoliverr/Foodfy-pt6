const nodemailer = require("nodemailer")

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "1a1d7ed266d426",
    pass: "cf47cf7441ca03"
  }
});