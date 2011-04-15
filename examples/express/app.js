
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
    title: 'Express'
  });
});

app.get('/signin', function(req, res){
  res.render('signin', {
    title: 'Sign in'
  });
});

app.get('/auth/facebook', function(req, res){
  var client_id = oauthSecrets.facebook.clientId;
  var provider = 'facebook';
  var redirect_uri = 'http://' + req.headers.host + req.url + '/callback';

  res.redirect('https://www.facebook.com/dialog/oauth?client_id=' + client_id + '&redirect_uri='+ redirect_uri); 
});

app.get('/auth/google', function(req, res){

/*https://accounts.google.com/o/oauth2/auth?
  client_id=824390819211.apps.googleusercontent.com&
  redirect_uri=https://www.example.com/back&
  scope=https://www.google.com/m8/feeds/&
  response_type=code*/
  
  var client_id = '582833444971.apps.googleusercontent.com';
  var provider = 'google';
  var redirect_uri = 'http://' + req.headers.host + req.url + '/callback';
  
  res.redirect(
    'https://accounts.google.com/o/oauth2/auth?client_id=' + client_id + '&redirect_uri=' + redirect_uri + 
    '&scope=https://www.google.com/m8/feeds/&response_type=code');
});

app.get('/auth/:provider/callback', function(req, res){
  /*var oauth2 = new OAuth2({
      base: "graph.facebook.com",
      tokenUrl: "/oauth/access_token",
      redirectUri: 'http://' + req.headers.host + req.url + '/callback',
      id: oauthSecrets.facebook.clientId,
      secret: oauthSecrets.facebook.clientSecret
    });
  oauth2.accessToken(req.params.code, {}, function(status, result) {
    res.send({
      status: status,
      result: result
    });
  });*/
  
  
  var oauth2 = new OAuth2({
      base: "accounts.google.com",
      tokenUrl: "/o/oauth2/token",
      redirectUri: 'http://' + req.headers.host + req.url + '/callback',
      id: oauthSecrets.google.clientId,
      secret: oauthSecrets.google.clientSecret
    });
  oauth2.accessToken(req.params.code, {}, function(status, result) {
    res.send({
      status: status,
      result: result
    });
  });  
});

/*https://accounts.google.com/o/oauth2/auth?
  client_id=824390819211.apps.googleusercontent.com&
  redirect_uri=https://www.example.com/back&
  scope=https://www.google.com/m8/feeds/&
  response_type=code
*/


// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
