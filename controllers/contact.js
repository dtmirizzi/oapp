const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type : 'OAuth2',
    user: process.env.GMAILAPI_USER,
    clientId: process.env.GMAILAPI_CLIENTID,
    clientSecret: process.env.GMAILAPI_SECRET,
    refreshToken: process.env.GMAILAPI_REFRESHTOKEN,
    accessToken: process.env.GMAILAPI_TOKEN,
    expires: 1484314697598
  }
});

/**
 * GET /contact
 * Contact form page.
 */
exports.getContact = (req, res) => {
  res.render('contact', {
    title: 'Contact'
  });
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */
exports.postContact = (req, res) => {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('subject', 'Subject cannot be blank').notEmpty();
  req.assert('message', 'Message cannot be blank').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/contact');
  }

  const mailOptions = {
    to: 'dtmirizzi@gmail.com',
    from: `${req.body.name} <${req.body.email}>`,
    subject: `Contact Form | Owave: ${req.body.subject}`,
    text: req.body.message
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      req.flash('errors', { msg: err.message });
      return res.redirect('/contact');
    }
    req.flash('success', { msg: 'Message Sent' });
    res.redirect('/contact');
  });
};
