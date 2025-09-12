 const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const emailRoutes = require('./routes/email.routes');
const { checkUser, requireAuth } = require('./middleware/auth.middleware');
require('dotenv').config({ path: './config/.env' });
require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware généraux
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS configuration pour permettre l'envoi de cookies
app.use(cors({
   origin:' https://ndako-lg8h.onrender.com/', // Remplace avec ton frontend en prod
  credentials: true
}));
app.use('/uploads', express.static('uploads'));


// Vérifie l'utilisateur sur chaque requête
app.get('*', checkUser);

// Route de vérification du token (pour React)
app.get('/jwtid', requireAuth, (req, res) => {
  res.status(200).send(res.locals.user?._id);
});

// Routes API
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/sendEmail',emailRoutes );
//app.use('/api/favorites', require('./routes/favorite.route'));

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
