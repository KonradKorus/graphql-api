const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  date: {
    type: Date,
  },
  category: {
    type: String,
  },
  content: {
    type: String,
  },
  likeCount: {
    type: Number,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Post', PostSchema);
