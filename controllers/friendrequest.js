const FriendRequest = require('../models/friend-request');
const User = require('../models/users');

exports.get_all_requests = async (req, res) => {
  try {
    const requests = await FriendRequest.find()
      .lean()
      .populate('to')
      .populate('from');
    if (requests.length === 0) {
      return res.status(400).json({ message: 'Requests not found' });
    }
    return res.json(requests);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.get_request_by_id = async (req, res) => {
  try {
    const friendRequest = await FriendRequest.findById(req.params.requestid)
      .lean()
      .populate('to')
      .populate('from');
    if (!friendRequest) {
      return res.status(400).json({ message: 'Request not found' });
    }
    return res.json(friendRequest);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.create_request = async (req, res) => {
  try {
    const { to, from } = req.body;
    const newRequest = new FriendRequest({
      to: to,
      from: from,
    });
    const result = await newRequest.save();
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.update_request = async (req, res) => {
  try {
    const updated = await FriendRequest.updateOne({
      _id: req.params.requestid,
    });
    return res.json({ _id: req.params.requestid });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.delete_request = async (req, res) => {
  try {
    const deleted = await FriendRequest.deleteOne({
      _id: req.params.requestid,
    });
    if (deleted.deletedCount === 1) {
      return res.json({ _id: req.params.requestid });
    } else {
      return res.status(400).json({ message: 'Request not found' });
    }
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
