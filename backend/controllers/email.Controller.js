




const nodemailer = require("nodemailer");
require('dotenv').config();


async function sendEmail(req, res) {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: "Email et message requis." });
  }

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
      to: email,
      subject: "Message de NDAKO",
      html: `
        <div style="font-family: Arial; font-size: 16px;">
          <p>Bonjour,</p>
          <p>${message}</p>
          <p style="margin-top: 20px;">Cordialement,<br/>L'équipe NDAKO</p>
        </div>
      `,
    };

    // Envoie de l'email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email envoyé avec succès !" });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    res.status(500).json({ error: "Erreur d'envoi de l'email." });
  }
}

module.exports = { sendEmail };
