var express = require('express');
var router = express.Router();
const userModel = require('./users');
const messageModel = require('./message');
const passport = require('passport');
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/login', function (req, res, next) {
  res.render('login');
});
router.get('/register', function (req, res, next) {
  res.render('register');
});
router.get('/profile', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  }).populate('messages');
  const message = await messageModel.find({},).populate('sender');
  // const messages = await messageModel.
  res.render('profile', { user, message });
});
router.post('/post', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  });
  const newMessage =await messageModel.create({
    messageText: req.body.message,
    sender: user._id
  });
  user.messages.push(newMessage._id);
  await user.save();
  res.redirect('/profile');
});
router.post('/register', function (req, res) {
  const { username, fullname, email } = req.body;
  const newUser = new userModel({ username, fullname, email });
  userModel.register(newUser, req.body.password)
    .then(function (user) {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/profile');
      });

    })
});
router.post('/login', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/"
}), function (req, res) {
});
router.get('/logout', function (req, res) {
  req.logout(function(err){
    if(err){ return next(err); }
    res.redirect('/');
  });
});
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}
module.exports = router;
