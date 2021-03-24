const router = require('express').Router();

const passport = require('passport');

const authController = require('../controllers/auth');
const userController = require('../controllers/user');
const postController = require('../controllers/post');
const commentController = require('../controllers/comment');
const friendController = require('../controllers/friendrequest');
router.post('/login', authController.login);

router.post('/register', authController.register);

// facebook auth

router.get(
  '/auth/facebook',
  passport.authenticate('facebook', { session: false })
);

router.get('/auth/facebook/callback', authController.facebook_callback);

router.get('/logout', authController.logout);

router.get(
  '/isLoggedIn',
  passport.authenticate('jwt', { session: false }),
  authController.isLoggedIn
);

router.get(
  '/getToken',
  passport.authenticate('jwt', { session: false }),
  authController.getUserToken
);

router.get('/users', userController.getAllUsers);

router.get('/users/search/:pattern', userController.search_user);

router.get('/users/:userid', userController.getUserById);

router.delete('/users/:userid', userController.deleteUser);
router.get(
  '/users/:userid/friendrequests',
  userController.getUserFriendRequest
);
router.get('/users/:userid/posts', userController.get_user_posts);

router.put('/users/:userid/friend', userController.addFriend);

router.put('/users/:userid/unfriend', userController.remove_friend);

router.get('/posts', postController.get_posts);
router.get('/posts/relevant/:userid', postController.get_relevant_posts);
router.get('/posts/:postid', postController.get_post_by_id);
router.post('/posts', postController.create_post);
router.delete('/posts/:postid', postController.delete_post);
router.put('/posts/:postid/like', postController.like_post);
router.put('/posts/:postid/dislike', postController.dislike_post);

router.get('/posts/:postid/comments', commentController.get_all_comments);
router.get(
  '/posts/:postid/comments/:commentid',
  commentController.get_comment_with_id
);
router.post('/posts/:postid/comments', commentController.create_comment);
router.delete(
  '/posts/:postid/comments/:commentid',
  commentController.delete_comment
);
router.put(
  '/posts/:postid/comments/:commentid/like',
  commentController.like_comment
);
router.put(
  '/posts/:postid/comments/:commentid/dislike',
  commentController.dislike_comment
);

router.get('/friendrequests', friendController.get_all_requests);
router.get('/friendrequests/:requestid', friendController.get_request_by_id);
router.post('/friendrequests', friendController.create_request);
router.put('/friendrequests/:requestid', friendController.update_request);
router.delete('/friendrequests/:requestid', friendController.delete_request);

module.exports = router;
