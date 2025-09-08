const { console } = require("inspector");
const UserModel = require("../models/user.model");
const postModel = require("../models/post.model");
const ObjectID = require("mongoose").Types.ObjectId;


const fs = require("fs");
const { pipeline } = require("stream");



const multer = require("multer");
const path = require("path");

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};
module.exports.userInfo = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    const user = await UserModel.findById(req.params.id).select("-password");
    if (!user) return res.status(404).send("Utilisateur non trouvé");
    res.status(200).json(user);
  } catch (err) {
    console.error("Erreur lors de la récupération de l'utilisateur :", err);
    res.status(500).send("Erreur serveur");
  }
};

module.exports.updateUser = async (req, res) => {

     console.log(req.body);

const  { userId, bioValue  }=req.body;
  if (!ObjectID.isValid(userId))

 
    return res.status(400).send("ID unknown : " + userId);

  try {
     

    const user = await UserModel.findByIdAndUpdate(
 userId,
      { bio: bioValue }, // on stocke directement l'URL envoyée
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ message: "Utilisateur introuvable" });
    }

    res.status(200).send(user);
  } catch (error) {
    console.error("❌ Erreur uploadPicture:", error);
    res.status(500).send({ message: "Erreur serveur interne" });
  }
};

module.exports.deleteUser = async (req, res) => {

 

  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + userId);

  try {
      await UserModel.findByIdAndDelete(req.params.id);

    // 2. Supprimer toutes les publications de l'utilisateur
    await postModel.deleteMany({  posterId:req.params.id });
    res.status(200).json({ message: "Successfully deleted. " });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.follow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToFollow)
  )
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    // add to the follower list
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) res.status(201).json(docs);
        else return res.status(400).jsos(err);
      }
    );
    // add to following list
    await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: req.params.id } },
      { new: true, upsert: true },
      (err, docs) => {
        // if (!err) res.status(201).json(docs);
        if (err) return res.status(400).jsos(err);
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.unfollow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToUnfollow)
  )
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { following: req.body.idToUnfollow } },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) res.status(201).json(docs);
        else return res.status(400).jsos(err);
      }
    );
    // remove to following list
    await UserModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      { $pull: { followers: req.params.id } },
      { new: true, upsert: true },
      (err, docs) => {
        // if (!err) res.status(201).json(docs);
        if (err) return res.status(400).jsos(err);
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};







module.exports.uploadPicture = async (req, res) => {



 

  try {

    
    const { userId, pictureUrl } = req.body; 
 
    // URL déjà générée côté frontend

    if (!pictureUrl) {
      return res.status(400).send({ message: "Aucune URL fournie" });
      

    }

    const user = await UserModel.findByIdAndUpdate(
 userId,
      { picture: pictureUrl }, // on stocke directement l'URL envoyée
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ message: "Utilisateur introuvable" });
    }

    res.status(200).send(user);
  } catch (error) {
    console.error("❌ Erreur uploadPicture:", error);
    res.status(500).send({ message: "Erreur serveur interne" });
  }
};



// ✅ Toggle Favori optimisé avec PATCH
module.exports.toggleFavorite = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    if (!userId || !postId) {
      return res.status(400).json({ message: "userId et postId requis" });
    }

    // Vérifier si le postId est déjà dans les favoris
    const user = await UserModel.findOne({ _id: userId, favorites: postId });

    let updateQuery;
    let message;

    if (user) {
      // ✅ Déjà en favoris → retirer
      updateQuery = { $pull: { favorites: postId } };
      message = "Retiré des favoris";
    } else {
      // ✅ Pas encore en favoris → ajouter
      updateQuery = { $addToSet: { favorites: postId } }; // addToSet évite les doublons
      message = "Ajouté aux favoris";
    }

    // Mise à jour et retour du user avec les favoris actualisés
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      updateQuery,
      { new: true } // retourne la version mise à jour
    ).select("favorites");

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    return res.status(200).json({
      message,
      favorites: updatedUser.favorites
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
