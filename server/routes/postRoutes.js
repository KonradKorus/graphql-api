const express = require('express');
const router = express.Router();
const {
  getPosts,
  addPost,
  updatePost,
  deletePost,
  getSinglePost,
} = require('../controllers/postController');

router.route('/').get(getPosts);
router.route('/').post(addPost);
router.route('/:id').put(updatePost);
router.route('/:id').delete(deletePost);
router.route('/:id').get(getSinglePost);

module.exports = router;
