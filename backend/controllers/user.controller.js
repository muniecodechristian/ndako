const { console } = require("inspector");
const UserModel = require("../models/user.model");
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
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        if (err) return res.status(500).send({ message: err });
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.remove({ _id: req.params.id }).exec();
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





// Configuration de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max
}).single("file");

// Contrôleur de l'upload
// controllers/user.controller.js

module.exports.uploadPicture = async (req, res) => {
  try {
    // Vérification de l'existence du fichier
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier envoyé." });
    }

    // Vérification du type MIME
    const mimeType = req.file.mimetype; // propriété correcte
    if (
      mimeType !== "image/jpg" &&
      mimeType !== "image/jpeg" &&
      mimeType !== "image/png"
    ) {
      throw new Error("Fichier invalide, seul JPG/JPEG/PNG autorisé");
    }

    // Vérification de la taille
    if (req.file.size > 5 * 1024 * 1024) {
      throw new Error("Fichier trop volumineux (max 5 Mo)");
    }

    // URL publique du fichier
    const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    // Nom du fichier côté client
    const filename = req.body.name || req.file.filename;

    // Sauvegarde physique du fichier
    await pipeline(
      req.file.stream || fs.createReadStream(req.file.path), // fallback si stream non dispo
      fs.createWriteStream(`${__dirname}/../client/public/uploads/profile/${filename}`)
    );

    // Retour OK
    res.status(200).json({ message: "Upload réussi", url });

  } catch (error) {
    console.error("Erreur upload :", error);
    res.status(500).json({ error: error.message });
  }
};
