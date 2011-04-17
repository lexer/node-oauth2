var https = require('https')
  , qs = require('querystring');


exports.OAuth2 = OAuth2 = function(options) {
  this.base = options.base;
  this.tokenUrl = options.tokenUrl;
  this.redirectUri = options.redirectUri;
  this.id = options.id;
  this.secret = options.secret;

  this.version = '0.0.1';
}

OAuth2.prototype.tokenRequest = function(params, headers, callback) {
  var self = this
    , body
    , headers
    , params
    , req;

  params['client_id'] = self.id;
  params['client_secret'] = self.secret;
  params['redirect_uri'] = self.redirectUri;

  body = new Buffer(qs.stringify(params));

  headers['host'] = self.base;
  headers['accept'] = 'application/json';
  headers['content-type'] = 'application/x-www-form-urlencoded';
  headers['content-length'] = body.length;
  
  var options = {
    host: self.base,
    port: 443,
    path: self.tokenUrl,
    method: 'POST',
    headers: headers
  };

  var req = https.request(options, function(res) {
    res.setEncoding('utf8');

    var result = '';

    res.on('data', function(data) {
      result += data;
    });
    res.on('end', function() {
      try {
        result = JSON.parse(result);
      } catch(err) {
        console.log(err); 
      }

      if(callback) callback(res.statusCode, result);
    });
  });

  req.write(body);
  req.end();

  req.on('error', function(e) {
    console.error(e);
  });
  
  req.write(body);
}


OAuth2.prototype.accessToken = function(code, headers, callback) {
  var params = { 'code': code
               , 'grant_type': 'authorization_code'
               };

  this.tokenRequest(params, headers, callback);
}


OAuth2.prototype.refreshToken = function(refreshToken, headers, callback) {
  var params = { 'refresh_token': refreshToken
               , 'grant_type': 'refresh_token'
               };

  this.tokenRequest(params, headers, callback);
}

OAuth2.prototype.request = function(method, url, headers, auth) {
  headers['Authorization'] = 'OAuth ' + auth['access_token'];
  headers['Host'] = this.base;

  return this.client.request(method, url, headers);
}
