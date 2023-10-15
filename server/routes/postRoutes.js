const express = require('express');
const router = express.Router();
const {
  getPosts,
  addPost,
  updatePost,
  deletePost,
  getSinglePost,
} = require('../controllers/postController');

router.route('/').get(getPosts).post(addPost);
router.route('/:id').put(updatePost).delete(deletePost).get(getSinglePost);

module.exports = router;
