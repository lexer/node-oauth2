module.exports.OAuth2 = function(providers) {

}

module.exports.OAuth2.prototype.routes = function(app) {
  providers.forEach(function(p){
    app.get('/auth/' + provider.name, function(req, res){
      var client_id = provider.clientId;
      var redirect_uri = 'http://' + req.headers.host + '/auth/' + provider.name + '/callback';

      res.redirect('https://www.facebook.com/dialog/oauth?client_id=' + client_id + '&redirect_uri='+ redirect_uri); 
    });
  });
}
