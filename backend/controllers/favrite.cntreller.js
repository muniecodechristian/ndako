const Favorite = require('../models/favrite');
exports.addFavorite = async (req, res) => {
try {
const { postId } = req.params;
const userId = req.userId;
const doc = await Favorite.findOneAndUpdate(
{ user: userId, post: postId },
{ $setOnInsert: { user: userId, post: postId } },
{ new: true, upsert: true }
);
res.json({ ok: true, favorite: doc });
} catch (err) {
res.status(500).json({ ok: false, message: err.message });
}
};


// DELETE /api/favorites/:postId — retire
exports.removeFavorite = async (req, res) => {
try {
const { postId } = req.params;
const userId = req.userId;
await Favorite.findOneAndDelete({ user: userId, post: postId });
res.json({ ok: true });
} catch (err) {
res.status(500).json({ ok: false, message: err.message });
}
};


// GET /api/favorites — liste des posts favoris du user (populate post)
exports.listFavorites = async (req, res) => {
try {
const userId = req.userId;
const favorites = await Favorite.find({ user: userId })
.sort({ createdAt: -1 })
.populate({ path: 'post', populate: { path: 'posterId', select: '-password' } });
res.json({ ok: true, favorites });
} catch (err) {
res.status(500).json({ ok: false, message: err.message });
}
};


// GET /api/favorites/ids — ids des posts favoris (pour badge/coeur rempli rapide)
exports.listFavoriteIds = async (req, res) => {
try {
const userId = req.userId;
const rows = await Favorite.find({ user: userId }).select('post -_id');
res.json({ ok: true, ids: rows.map(r => r.post.toString()) });
} catch (err) {
res.status(500).json({ ok: false, message: err.message });
}
};