const nodemailer = require('nodemailer')

const transporterOptions = {
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
}

const sendMail = async (email) => {
  const transporter = nodemailer.createTransport(transporterOptions)

  let mailOptions = {
    from: 'tomerpacific@gmail.com',
    to: 'miguelcastillo1000@gmail.com',
    subject: 'Nodemailer Project',
    text: 'Hi from your nodemailer project',
  }

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) console.log(err)
    else console.log('Email sent')
  })
}

module.exports = { sendMail }
