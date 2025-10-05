// models/video.model.js
const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    videoUrl: {
      type: String,
      required: true
    },
    description: {
      type: String,
      trim: true
    },
    posterId: {
      type:String,
    
      required: true
    }
  },
  { timestamps: true } // ajoute createdAt et updatedAt
);

module.exports = mongoose.model("Video", videoSchema);
