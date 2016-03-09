var express = require('express');
var router = express.Router();
var knex = require('../../../db/knex');
var passport = require('../lib/auth')
function Users() {
  return knex('users');
}

router.get('/', function(req, res, next) {
  console.log(req.user);
  res.render('index', {title: 'Welcome', user: req.user});
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login Page' });
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

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.post('/signup', function(req, res, next) {
  //check if email is unique knex
  //if email is in the database, tell user
  //if email is not in database, insert it
  var email = req.body.email;
  var password = req.body.password;
  Users().where('email', email)
  .then(function(data){
    if(data.length) {
      res.render('signup', {title: 'Error', errors: ['Email already exists']})
    } else {
      Users().insert(req.body, 'id') //i think if you want the next id number say insert({email: email, password: password})
      .then(function(){
        res.redirect('/');
      }).catch(function(err){
        return next(err);
      })
    }
  }) .catch(function(err){
    return next(err);
  })
});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/')
});

module.exports = router;
