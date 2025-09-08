const nodemailer = require("nodemailer");
require('dotenv').config();


/**
 * Fonction pure pour envoyer un email
 * @param {string} to - Adresse du destinataire
 * @param {string} subject - Sujet de l'email
 * @param {string} html - Contenu HTML de l'email
 */
const  sendEmailNew = async (to, subject, html) => {
 try {
    // Transporteur SMTP avec Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_SENDER,           // Ton adresse email
        pass: process.env.EMAIL_PASSWORD,     // Mot de passe d'application Gmail 0835728874
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_SENDER,
      to: to,
      subject: subject,
      html:html,
    };

    // Envoie de l'email
    await transporter.sendMail(mailOptions);
    console.log('email send ')

    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
     return false;
  }

};

module.exports = sendEmailNew;
