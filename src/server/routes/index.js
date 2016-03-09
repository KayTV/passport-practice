var express = require('express');
var router = express.Router();

var knex = require('../../../db/knex');
var passport = require('../lib/auth');
var helpers = require('../lib/helpers');


router.get('/', helpers.ensureAuthenticated, function(req, res, next) {
  res.render('index', {user: req.user});
});

router.get('/login', helpers.loginRedirect, function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user) {
    if (err) {
      return next(err);
    } else {
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
  })(req, res, next);
});

router.get('/signup', helpers.loginRedirect, function(req, res, next) {
  res.render('signup');
});

router.post('/signup', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  // check if email is unique
  knex('users').where('email', email)
    .then(function(data){
      // if email is in the database send an error
      if(data.length) {
        return res.send('crap');
      } else {
        // hash and salt the password
        var hashedPassword = helpers.hashing(password);
        // if email is not in the database insert it
        knex('users').insert({
          email: email,
          password: hashedPassword
        })
        .then(function(data) {
          return res.redirect('/login');
        })
        .catch(function(err) {
          return res.send('crap');
        });
      }
    })
    .catch(function(err){
      return next(err);
    });
});

router.get('/logout', helpers.ensureAuthenticated, function(req, res, next) {
  req.logout();
  res.redirect('/');
});


module.exports = router;
