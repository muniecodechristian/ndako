const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Import des routes
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const emailRoutes = require('./routes/email.routes');
const commentRoutes = require('./routes/comment.route');
const notificationRoutes = require('./routes/notification.route');

// Import des middlewares
const { checkUser, requireAuth } = require('./middleware/auth.middleware');

// Configuration .env et base de données
dotenv.config({ path: './config/.env' });
require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middlewares globaux
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: true, // à remplacer par l'URL de ton frontend en production
  credentials: true
}));

// Static folder pour les uploads
app.use('/uploads', express.static('uploads'));

// Vérification de l'utilisateur sur chaque requête
app.get('*', checkUser);

// Route pour récupérer l'ID utilisateur via JWT
app.get('/jwtid', requireAuth, (req, res) => {
  res.status(200).send(res.locals.user?._id);
});

// ✅ Routes API
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/sendEmail', emailRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
// app.use('/api/favorites', require('./routes/favorite.route'));

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

