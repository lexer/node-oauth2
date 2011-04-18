var Facebook = module.exports.Facebook = function(clientId, clientSecret) {
  this.clientId = clientId;
  this.clientSecret = clientSecret;
};

Facebook.prototype.authorizeUrl = function(redirectUrl) {
  'https://www.facebook.com/dialog/oauth?client_id=' + this.clientId + '&redirect_uri='+ redirectUrl
}

Facebook.
