




const nodemailer = require("nodemailer");
require('dotenv').config();


async function sendEmail(req, res) {
  const { email, message, title,prix,commune,adresse } = req.body;

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
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nouveau message NDAKO</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f2f4f8;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(90deg, #1976d2, #42a5f5);
            color: #fff;
            padding: 20px;
            text-align: center;
            font-size: 20px;
            font-weight: bold;
          }
          .content {
            padding: 24px;
            color: #1F2937;
          }
          .content p {
            margin: 12px 0;
          }
          .card {
            background: #f9fafb;
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
          }
          .card strong {
            color: #1976d2;
          }
          .footer {
            padding: 16px;
            text-align: center;
            font-size: 12px;
            color: #64748B;
          }
          @media (max-width: 600px) {
            .container { width: 95% !important; margin: 20px auto; }
            .header { font-size: 18px; padding: 16px; }
            .content { padding: 16px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            Nouveau message pour votre bien immobilier
          </div>
          <div class="content">
            <p>Bonjour,</p>
            <p>Vous avez reçu un nouveau message d'un client concernant votre bien immobilier 🏡 :</p>
            
            <div class="card">
              <p><strong>Message du client :</strong><br>${message}</p>
              <p><strong>Bien concerné :</strong></p>
              <p>Titre : ${title || ""}</p>
              <p>Prix : ${prix|| ""} FC</p>
              <p>Commune : ${commune || 'Non précisée'}</p>
              <p>Adresse : ${adresse || ""}</p>
            </div>

            <p>Vous pouvez répondre directement au client en utilisant son email.</p>
            <p>Cordialement,<br><strong>L'équipe NDAKO</strong></p>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} NDAKO — Tous droits réservés
          </div>
        </div>
      </body>
      </html>
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
