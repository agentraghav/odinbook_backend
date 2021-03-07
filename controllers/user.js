const User = require('../models/users');
const Post = require('../models/posts');
const FriendRequest = require('../models/friend-request');

exports.getAllUsers = async (req, res) => {
  try {
    const user = await User.find().lean().populate('friends');
    if (user.length === 0) {
      return res.status(400).json({
        message: 'user not found',
      });
    } else {
      return res.json(user);
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userid).populate('friends');
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    } else {
      return res.json(user);
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.deleteOne({ _id: req.params.userid });
    if (deleted.deletedCount === 1) {
      return res.json({ message: 'deleted successfully' });
    } else {
      return res.status(400).json({ message: 'Not able to delete the user' });
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.getUserFriendRequest = async (req, res) => {
  try {
    const friendrequests = await FriendRequest.find({ to: req.params.id })
      .lean()
      .populate('from')
      .populate('to');
    if (friendrequests.length === 0) {
      return res.status(400).json({ message: 'No requests found' });
    }
    return res.json(friendrequests);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.addFriend = async (req, res) => {
  try {
    if (!req.body._id) {
      return res.status(400).json({ message: 'User id not find' });
    }
    const user_to = await User.findById(req.body._id);
    if (!user_to) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user_from = await User.findById(req.params.userid);
    if (user_from.friends.indexOf(req.body._id) !== -1) {
      return res.status(400).json({
        message: 'User already has the requester ID on friend array.',
      });
    }

    user_from.friends.push(req.body._id);
    const save_result = await user_from.save();
    return res.json(save_result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.remove_friend = async (req, res) => {
  try {
    if (!req.body._id) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = await User.findById(req.params.userid);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    user.friends = [...user.friends].filter(
      (friend) => friend.toString() !== req.body._id
    );

    const update_result = await User.updateOne(
      { _id: req.params.userid },
      { friends: user.friends }
    );
    return res.json(update_result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.get_user_posts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userid })
      .sort({ timestamp: -1 })
      .populate('user');
    if (posts.length === 0) {
      return res.status(400).json({ message: 'Post not found' });
    }
    return res.json(posts);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.search_user = async (req, res) => {
  try {
    let query = req.params.pattern.split(' ');
    if (query.length === 1) {
      query = [req.params.pattern, req.params.pattern];
    }
    const matches = await User.find({
      $or: [
        { firstname: { $regex: query[0], $options: 'i' } },
        { lastname: { $regex: query[1], $options: 'i' } },
      ],
    });
    if (matches.length === 0) {
      return res.status(400).json({ message: 'No matches found' });
    }

    return res.json(matches);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
