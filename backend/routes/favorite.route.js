const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/favorite.controller');


router.get('/ids', auth, ctrl.listFavoriteIds);
router.get('/', auth, ctrl.listFavorites);
router.post('/:postId', auth, ctrl.addFavorite);
router.delete('/:postId', auth, ctrl.removeFavorite);


module.exports = router;