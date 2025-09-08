// controllers/post.controller.js

const postModel = require('../models/post.model');
const ObjectId = require("mongoose").Types.ObjectId;
const getLocation = require('../middleware/Geocode');


// 📌 Récupération des posts
module.exports.getPosts = async (req, res) => {
  try {
    const posts = await postModel.find()
      .populate('posterId', '-password') // populate le User
      .sort({ createdAt: -1 });         // optionnel : trier par date descendante

    res.status(200).json(posts);
  } catch (err) {
    console.error("Erreur lors de la récupération des posts :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// 📌 Création d'un post avec géocodage
module.exports.createPost = async (req, res) => {
  try {
    const {
      posterId,
      title,
      description,
      prix,
      bienImmo,
      annonce,
      commune,
      chambre,
      salleDeBain,
      adresse,
      salon,
      cuisine,
      salleManger,
      parking,
      piscine,
      balcon,
      terrasse,
      climatiseur,
      meuble,
      lit,
      surface,
      reglement,
        prixType,
         periode,
          idee
    } = req.body;

    // 📷 Gestion des photos
    const photos = req.files?.map((file) => file.filename) || [];
    if (photos.length === 0) {
      return res.status(400).json({ message: "Veuillez ajouter au moins une photo." });
    }

    // Conversion booléens
    const isTrue = (v) => v === 'true' || v === true;

    // 🗺 Géocodage de l'adresse
    const location = await getLocation(adresse);
    if (!location) {
      return res.status(400).json({ message: "Adresse introuvable ou invalide" });
    }
    const { lat, lon } = location;

    // 📦 Création du post
    const newPost = new postModel({
      posterId,
      title,
      description,
      prix: parseInt(prix, 10) || 0,
      bienImmo,
      annonce,
      commune,
      chambre: parseInt(chambre, 10) || 0,
      salleDeBain: parseInt(salleDeBain, 10) || 0,
      adresse,
      location: [lon, lat], // format GeoJSON [longitude, latitude]
      salon: isTrue(salon),
      cuisine: isTrue(cuisine),
      salleManger: isTrue(salleManger),
      parking: isTrue(parking),
      piscine: isTrue(piscine),
      balcon: isTrue(balcon),
      terrasse: isTrue(terrasse),
      climatiseur: isTrue(climatiseur),
      meuble: isTrue(meuble),
      lit: parseInt(lit, 10) || 0,
      surface: parseInt(surface, 10) || 0,
      reglement: reglement || '',
      prixType:prixType,
         periode:periode,
          idee:idee,
      photos
    });

    const savedPost = await newPost.save();
    res.status(201).json({
      message: "Post créé avec succès",
      post: savedPost
    });

  } catch (err) {
    console.error("Erreur lors de l'enregistrement :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// 📌 Mise à jour d’un post

module.exports.updatePost = async (req, res) => {
  console.log("Message reçu :", req.body.message);
  console.log("ID reçu :", req.params.id);

  // ✅ Vérification de l'ID
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID invalide : " + req.params.id });
  }

  try {
    // ✅ Mise à jour du post
    const updated = await postModel.findByIdAndUpdate(
      req.params.id,
      {  description: req.body.message},
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    res.status(200).json({
      message: "Post mis à jour avec succès",
      post: updated,
    });

    console.log("✅ updatePost exécuté avec succès");
  } catch (err) {
    console.error("❌ Erreur updatePost :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// 📌 Suppression d’un post
module.exports.deletePost = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "ID invalide : " + req.params.id });
  }

  try {
    const deleted = await postModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    res.status(200).json({ message: "Post supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// 📌 Recherche (full-text)
module.exports.searchPosts = async (req, res) => {
  const { query } = req.query;
  try {
    const posts = await postModel.find({
      $text: { $search: query },
    });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }


    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }

