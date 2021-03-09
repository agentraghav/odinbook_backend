const { validationResult } = require('express-validator');

const Post = require('../models/posts');
const User = require('../models/users');

exports.get_posts = async (req, res) => {
  try {
    const posts = await Post.find().lean().populate('user');
    if (posts.length === 0) {
      return res.status(400).json({ message: 'Posts not found' });
    }
    return res.json(posts);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.get_post_by_id = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postid).lean().populate('user');
    if (!post) {
      return res.status(400).json({ message: 'Posts not found' });
    }
    return res.json(post);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.create_post = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    const { user, photo, content } = req.body;
    const post = new Post({
      user: user,
      content: content,
      photo: photo || '',
      likes: [],
    });
    const result = await post.save();
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.delete_post = async (req, res) => {
  try {
    const deleteResult = await Post.deleteOne({ _id: req.params.postid });
    if (deleteResult.deletedCount === 1) {
      return res.json({ _id: req.params.postid });
    } else {
      return res.status(400).json({ message: 'Post not exist' });
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.get_relevant_posts = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.userid });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const friendList = user.friends;
    friendList.push(req.params.userid);
    const posts = await Post.find({ user: { $in: friendList } })
      .sort({ timestamp: -1 })
      .limit(30)
      .lean()
      .populate('user');
    if (posts.length === 0) {
      return res.status(400).json({ message: 'posts not found' });
    }
    return res.json(posts);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.like_post = async (req, res) => {
  try {
    const post = Post.findById(req.params.postid);
    if (!post) {
      return res.status(400).json({ message: 'Post not found' });
    }
    const likes = [...post.likes];
    const foundUser = likes.find((user) => user.toString() === req.body._id);

    if (foundUser !== undefined) {
      return res.status(400).json({ message: 'Post already liked' });
    }
    likes.push(req.body._id);
    const result = await Post.updateOne({ _id: req.params.postid }, { likes });
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.dislike_post = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postid);
    if (!post) {
      return res.status(400).json({ message: 'Post not found' });
    }
    if (post.likes.indexOf(req.body._id) === -1) {
      return res.status(400).json({ message: 'Post is not liked before' });
    }
    const likes = [...post.likes].filter(
      (user) => user._id.toString() !== req.body._id
    );
    const result = await Post.updateOne({ _id: req.params.postid }, { likes });
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
