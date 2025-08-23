const nodemailer = require('nodemailer');
const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../utils/errors.utils');

const maxAge = 3 * 24 * 60 * 60 * 1000; // JWT expiration time (3 days)

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: maxAge });
};

// Configurer le transporteur nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "maddison53@ethereal.email",  // Utilise bien l'email généré par Ethereal
    pass: "jn7jnAPss4f63QBp6D",         // Et son mot de passe
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Fonction d'envoi d'email
const sendWelcomeEmail = async (email) => {
  try {
    const info = await transporter.sendMail({
      from: '"Ndako Support" <maddison53@ethereal.email>',
      to: email,
      subject: "Bienvenue sur Ndako !",
      text: "Merci de vous être inscrit sur notre plateforme.",
      html: "<b>Merci de vous être inscrit sur notre plateforme.</b>",
    });

    console.log("Email envoyé :", info.messageId);
  } catch (emailErr) {
    console.error("Erreur d'envoi d'email :", emailErr.message);
  }
};

// Inscription de l'utilisateur
module.exports.signUp = async (req, res) => {
  const { pseudo, email, password, phone } = req.body;

  try {
    const user = await UserModel.create({ pseudo, email, password, phone });

    await sendWelcomeEmail(email);

    const token = createToken(user._id);
    res.status(201).json({ user: user._id, token });
  } catch (err) {
    const errors = signUpErrors(err);
    res.status(200).json({ errors });
  }
};

// Connexion
module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.login(email, password);
    const token = createToken(user._id);

    res.cookie('jwt', token, { httpOnly: true, maxAge });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = signInErrors(err);
    res.status(200).json({ errors });
  }
};

// Déconnexion
module.exports.logout = (req, res) => {
  console.log('logout')
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};
