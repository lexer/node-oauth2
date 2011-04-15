var http = require('http')
  , qs = require('querystring');


exports.OAuth2 = OAuth2 = function(options) {
  this.base = options.base;
  this.tokenUrl = options.tokenUrl;
  this.redirectUri = options.redirectUri;
  this.id = options.id;
  this.secret = options.secret;

  this.client = http.createClient(443, this.base, true);

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
  
  console.log(self.tokenUrl);
  console.log(headers);

  req = self.client.request('POST', self.tokenUrl, headers);
  
  req.write(body);
  
  req.on('response', function(res) {
    console.log(res);
    var body = '';

    res.on('data', function(data) {
      body += data.toString();
    });
    res.on('end', function() {
      try {
        body = JSON.parse(body);
      } catch(err) {
        console.dir(err);
      }

      if(callback) callback(res.statusCode, body);
    });
  });

  req.end();
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
