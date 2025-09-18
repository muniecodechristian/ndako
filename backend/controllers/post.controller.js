const postModel = require("../models/post.model");
const ObjectId = require("mongoose").Types.ObjectId;

// 📌 Récupération des posts
module.exports.getPosts = async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .populate("posterId", "-password")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    console.error("❌ Erreur getPosts :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// 📌 Création d’un post
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
      idee,
      location, // déjà fourni par le front
      photos,   // déjà des URLs Cloudinary
    } = req.body;

    if (!photos || photos.length === 0) {
      return res.status(400).json({ message: "Veuillez ajouter au moins une photo." });
    }

    const isTrue = (v) => v === "true" || v === true;

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
      location: location ? [location.lon, location.lat] : undefined,
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
      reglement,
      prixType,
      periode,
      idee,
      photos, // URLs Cloudinary
    });

    const savedPost = await newPost.save();
    res.status(201).json({ message: "✅ Post créé avec succès", post: savedPost });
  } catch (err) {
    console.error("❌ Erreur createPost :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// 📌 Mise à jour d’un post
module.exports.updatePost = async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID invalide : " + id });
  }

  try {
    const updated = await postModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    res.status(200).json({ message: "✅ Post mis à jour", post: updated });
  } catch (err) {
    console.error("❌ Erreur updatePost :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// 📌 Suppression d’un post
module.exports.deletePost = async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID invalide : " + id });
  }

  try {
    const deleted = await postModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    res.status(200).json({ message: "✅ Post supprimé" });
  } catch (err) {
    console.error("❌ Erreur deletePost :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};


