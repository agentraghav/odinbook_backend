const mongoose = require('mongoose');

const Schema = require('mongoose');

const commentSchema = new Schema({
  content: { type: String },
  image: { type: Object },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
  comment: { type: Schema.Types.ObjectId, ref: 'Comment' },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Comment', commentSchema);