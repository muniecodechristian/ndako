const router = require('express').Router();
const postController = require('../controllers/post.controller');
const userController = require('../controllers/user.controller');
const upload = require('../middleware/multerconfig');



router.get('/', postController.getPosts);
router.post('/', upload.array('photos', 20), postController.createPost);
router.put('/:id', postController.updatePost);


router.delete('/:id', postController.deletePost);

module.exports = router;