const nodemailer = require('nodemailer')

const transporterOptions = {
  service: 'gmail',
  scope: 'https://mail.google.com',
  auth: {
    type: 'OAuth2',
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    accessToken: process.env.OAUTH_ACCESS_TOKEN,
  },
}

const sendMail = async (toEmail, subject, text) => {
  const transporter = nodemailer.createTransport(transporterOptions)

  let mailOptions = {
    from: 'admin@gmail.com',
    to: toEmail,
    subject,
    text,
  }

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) console.log(err)
    else console.log('Email sent')
  })
}

module.exports = { sendMail }
