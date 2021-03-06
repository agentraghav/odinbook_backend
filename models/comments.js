const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: { type: String },
  image: { type: Object },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Comment', commentSchema);
