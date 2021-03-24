const Comment = require('../models/comments');
const Post = require('../models/posts');
const User = require('../models/users');

const { validationResult } = require('express-validator');

exports.get_all_comments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postid })
      .populate('user')
      .populate('post');
    if (comments.length === 0) {
      return res.status(400).json({ message: 'Comments not found' });
    }
    return res.json(comments);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.get_comment_with_id = async (req, res) => {
  try {
    const comment = await Comment.find(req.params.commentid);
    if (!comment) {
      return res.status(400).json({ message: 'Comment not found' });
    }
    return res.json(comment);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.create_comment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    const { content, user } = req.body;
    const post = req.params.postid;
    const comment = new Comment({
      user: user,
      content: content,
      post: post,
      likes: [],
    });
    const result = await comment.save();
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.delete_comment = async (req, res) => {
  try {
    const deleted = await Comment.deleteOne({ _id: req.params.commentid });
    if (deleted.deletedCount === 1) {
      return res.json({ _id: req.params.commentid });
    } else {
      return res.status(400).json({ message: 'Comment not found' });
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.like_comment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentid);
    if (!comment) {
      return res.status(400).json({ message: 'Comment not found' });
    }
    const likes = [...comment.likes];
    const foundUser = likes.filter(
      (user) => user._id.toString() === req.body._id
    );
    if (foundUser) {
      return res.status(400).json({ message: 'Comment already liked' });
    }
    likes.push(req.body._id);
    const result = await Comment.updateOne(
      { _id: req.params.commentid },
      { likes }
    );
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.dislike_comment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentid);
    if (!comment) {
      return res.status(400).json({ message: 'Comment not found' });
    }
    if (comment.likes.indexOf(req.body._id) === -1) {
      return res.status(400).json({
        message: 'User has not liked this comment before.',
      });
    }

    const likes = [...comment.likes].filter(
      (user) => user._id.toString() !== req.body._id
    );
    const result = await Comment.updateOne(
      { _id: req.params.commentid },
      { likes }
    );
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
