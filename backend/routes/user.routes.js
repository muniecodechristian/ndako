const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const upload = require('../middleware/multerconfig');


// auth
router.post("/register", authController.signUp);
router.post('/login', authController.signIn);
router.get('/logout', authController.logout);

// user display: 'block',
router.get('/', userController.getAllUsers);
router.get('/:id', userController.userInfo);
router.post("/updatebio/", userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.patch('/favorite/', userController.toggleFavorite);

router.patch('/follow/:id', userController.follow);
router.patch('/unfollow/:id', userController.unfollow);



router.post("/upload/", userController.uploadPicture);


module.exports = router;
router.post("/upload/", userController.uploadPicture);


module.exports = router;

module.exports = router;
