const nodemailer = require('nodemailer');
const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../utils/errors.utils');

const sendEmail=require('../middleware/newsenderemail')

require('dotenv').config();

const maxAge = 3 * 24 * 60 * 60 * 1000; // JWT expiration time (3 days)

// Génération du token JWT
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: maxAge });
};

// Transporteur SMTP Gmail


// ===== INSCRIPTION =====

module.exports.signUp = async (req, res) => {
  const { pseudo, email, password, phone } = req.body;

  try {
    //  Création de l’utilisateur
    const user = await UserModel.create({ pseudo, email, password, phone });

    // Génération du token
    const token = createToken(user._id);

    // Envoi de l’email de bienvenue
    await sendEmail(
      user.email,
      "Bienvenue sur NDAKO 🎉",
      `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: linear-gradient(135deg, #007BFF, #00C6FF); color: #fff; border-radius: 8px;">
        
          <h2>Bienvenue ${user.pseudo} 👋</h2>
          <p>Merci de vous être inscrit sur <strong>NDAKO</strong>.</p>
          <p>Nous sommes ravis de vous compter parmi nous.</p>
          <p> Téléphone : ${user.phone}</p>
            <p>  veuillez Nous  écrire si c'est ne pas vous.</p>
          <p style="margin-top: 20px;">Cordialement,<br/>L'équipe NDAKO</p>
        </div>
      `
    );

    // Réponse unique
    return res.status(201).json({
      user: {
        id: user._id,
        pseudo: user.pseudo,
        email: user.email,
        phone: user.phone,
      },
      token,
    });
  } catch (err) {
    //  Gestion des erreurs
    const errors = signUpErrors(err);
    return res.status(400).json({ errors });
  }
};
// ===== CONNEXION =====
module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.login(email, password);
    const token = createToken(user._id);

    if (!user) {
      console.log('user intruvable')
    }

    res.cookie("jwt", token, { httpOnly: true, maxAge  ,   secure: true,   // ✅ obligatoire en prod HTTPS
  sameSite: "none" });
    return res.status(200).json({ user: user._id });

  } catch (err) {
 
    const errors = signInErrors(err);
    return res.status(400).json({ errors });
  }
};

// ===== DÉCONNEXION =====
module.exports.logout = (req, res) => {
  console.log("logout");
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS obligatoire seulement en prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  return res.status(200).json({ message: "Déconnexion réussie" });
};



