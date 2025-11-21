const router = require('express').Router();
const postController = require('../controllers/post.controller');
const userController = require('../controllers/user.controller');
const upload = require('../middleware/multerconfig');



router.get('/', postController.getPosts);
router.get('/getPostsVideo', postController.getPostsVideo);
router.post('/', upload.array('photos', 20), postController.createPost);
router.post('/video', postController.createPostVideo);
router.post('/:id', postController.updatePost);





router.delete('/:id', postController.deletePost);

router.post("/toggle-taken/:id", postController.togglePostTaken);


module.exports = router;
