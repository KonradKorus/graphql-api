const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');

const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find();
  res.status(200).json(posts);
});

const addPost = asyncHandler(async (req, res) => {
  const postFromBody = req.body;
  const fieldNames = Object.keys(postFromBody);

  if (fieldNames.length === 0) {
    res.status(400);
    throw new Error('Request body is empty');
  }
  const post = await Post.create(postFromBody);

  res.status(200).json(post);
});

const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(400);
    throw new Error('post not found');
  }

  const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatePost);
});

const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(400);
    throw new Error('Post not found');
  }

  const deletedPost = await Post.findByIdAndDelete(req.params.id);
  res.status(200).json({ id: req.params.id });
});

const getSinglePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(400);
    throw new Error('post not found');
  }

  res.status(200).json(post);
});

module.exports = {
  getPosts,
  addPost,
  updatePost,
  deletePost,
  getSinglePost,
};
