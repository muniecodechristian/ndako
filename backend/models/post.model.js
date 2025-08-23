const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    posterId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    prix: {
      type: Number,
      required: true,
    },
    bienImmo: {
      type: String,
      enum: ['maison', 'appartement', 'studio', 'bureau', 'maison de vente'],
      required: true,
    },
    annonce: {
      type: String,
      enum: ['vente', 'à louer'],
      required: true,
    },
    commune: {
      type: String,
      required: true,
    },
    chambre: {
      type: Number,
      default: 0,
      min: 0,
      max: 20,
    },
    salleDeBain: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    adresse: {
      type: String,
      required: true,
    },
    salon: {
      type: Boolean,
      default: false,
    },
    cuisine: {
      type: Boolean,
      default: false,
    },
    salleManger: {
      type: Boolean,
      default: false,
    },
    parking: {
      type: Boolean,
      default: false,
    },
    piscine: {
      type: Boolean,
      default: false,
    },
    balcon: {
      type: Boolean,
      default: false,
    },
    terrasse: {
      type: Boolean,
      default: false,
    },
    climatiseur: {
      type: Boolean,
      default: false,
    },
    meuble: {
      type: Boolean,
      default: false,
    },
    lit: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    surface: {
      type: Number,
      default: 0,
      min: 0,
    },
    reglement: {
      type: String,
      default: '',
    },
  location: {
  type: [Number], // [lat, lon]
  index: '2dsphere' // pour les requêtes géospatiales
}
,
    photos: {
      type: [String],
      required: true,
      validate: [arrayLimit, '{PATH} doit contenir au moins une image'],
    },
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length > 0;
}

module.exports = mongoose.model('annonce', PostSchema);
