
/**
 * Module dependencies.
 */

var express = require('express')
  , fs = require('fs')
  , oauthSecrets = JSON.parse(fs.readFileSync('./secrets.json', 'utf-8'))
  , Oauth2 = require('../../lib/oauth2');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Node oauth 2'
  });
});

app.get('/auth/facebook', function(req, res){

  var client_id = oauthSecrets.facebook.clientId;
  var provider = 'facebook';
  var redirect_uri = 'http://localhost:3000/auth/facebook/callback';

  res.redirect('https://www.facebook.com/dialog/oauth?client_id=' + client_id + '&redirect_uri='+ redirect_uri); 
});

app.get('/auth/google', function(req, res){
  
  var client_id = '582833444971.apps.googleusercontent.com';
  var provider = 'google';
  var redirect_uri = 'http://127.0.0.1:3000/auth/google/callback';
  
  res.redirect(
    'https://accounts.google.com/o/oauth2/auth?client_id=' + client_id + '&redirect_uri=' + redirect_uri + 
    '&scope=https://www.google.com/m8/feeds/&response_type=code');
});

app.get('/auth/vkontakte', function(req,res){
  var client_id = oauthSecrets.vkontakte.clientId;
  var provider = 'vkontakte';
  var redirect_uri = 'http://127.0.0.1:3000/auth/vkontakte/callback';
  
  res.redirect(
    'http://api.vkontakte.ru/oauth/authorize?client_id=' + client_id + '&redirect_uri=' + redirect_uri + 
    '&scope=notify,friends/&response_type=code');  
});

app.get('/auth/:provider/callback', function(req, res){
  if (req.params.provider === "facebook") {
    var oauth2 = new OAuth2({
        host: "graph.facebook.com",
        accessTokenPath: "/oauth/access_token",
        clientId: oauthSecrets.facebook.clientId,
        clientSecret: oauthSecrets.facebook.clientSecret
      });

    oauth2.getAccessToken(req.query.code,'http://localhost:3000/auth/facebook/callback', function(error, result) {
      console.log(result);
      res.send("Success");
    });  
  }
  
  if (req.params.provider === "google") {
    var oauth2 = new OAuth2({
        host: "accounts.google.com",
        accessTokenPath: "/o/oauth2/token",
        clientId: oauthSecrets.google.clientId,
        clientSecret: oauthSecrets.google.clientSecret
      });
    oauth2.getAccessToken(req.query.code, 'http://127.0.0.1:3000/auth/google/callback', function(error, result) {
      res.send(JSON.stringify({
        error: error,
        result: result
      }));
    });
  }

  if (req.params.provider === "vkontakte") {
    var oauth2 = new OAuth2({
          host: "api.vkontakte.ru",
          accessTokenPath: "/oauth/access_token",
          clientId: oauthSecrets.vkontakte.clientId,
          clientSecret: oauthSecrets.vkontakte.clientSecret
        });

    oauth2.getAccessToken(req.query.code,'http://127.0.0.1:3000/auth/vkontakte/callback', function(error, result) {
      res.send(JSON.stringify({
        error: error,
        result: result
      }));
    });  
  }
});


// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
