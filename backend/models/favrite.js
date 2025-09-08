
const mongoose = require('mongoose');


const favoriteSchema = new mongoose.Schema(
{
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
},
{ timestamps: true }
);


// un seul index({ user: 1, post: 1 }, { unique: true });


module.exports = mongoose.model('Favorite', favoriteSchema);