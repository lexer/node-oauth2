var https = require('https')
  , qs = require('querystring');
  

exports.OAuth2 = OAuth2 = function(options) {
  this.host = options.host;
  this.authorizePath = options.authorizePath;
  this.accessTokenPath = options.accessTokenPath;
  this.clientId = options.clientId;
  this.clientSecret = options.clientSecret;

  this.version = '0.0.1';
}

OAuth2.prototype.request = function request(opt, fn) {
  var self = this
    , method = opt.method || "GET"
    , path = opt.path
    , headers = opt.headers || {}
    , params = opt.params || {}    
    , body;

  if (Object.keys(params).length > 0) {  
    var paramStr = qs.stringify(params) 
    
    if (method !== "GET") {
      body = new Buffer(paramStr);
      headers['content-type'] = 'application/x-www-form-urlencoded';
      headers['content-length'] = body.length;      
    } else {
      path = path + "?" + paramStr;
    }   
  } 

  headers['accept'] = 'application/json';
  
  var options = {
    host: self.host,
    port: 443,
    path: path,
    method: method,
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
        fn(err);
      }

      fn(null, result);
    });
  });

  req.write(body);
  
  req.on('error', function(err) {
    fn(err);
  });
  
  req.end(); 
}

OAuth2.prototype.get = function(options, fn) {
  options.method = "GET";
  return this.request(options, fn);
} 

OAuth2.prototype.post = function(options, fn) {
  options.method = "POST";
  return this.request(options, fn);
} 

OAuth2.prototype.put = function(options, fn) {
  options.method = "PUT";
  return this.request(options, fn);
} 

OAuth2.prototype.del = function(options, fn) {
  options.method = "DELETE";
  return this.request(options, fn);
} 

OAuth2.prototype.tokenRequest = function(options, fn) {
   
  options.params['client_id'] = this.clientId;
  options.params['client_secret'] = this.clientSecret;
  options.path = this.accessTokenPath;
  
  return this.post(options, fn);
}


OAuth2.prototype.getAccessToken = function(code, redirectUri, fn) {
  this.tokenRequest({
    params: { 
      'code': code,
      'redirect_uri': redirectUri,
      'grant_type': 'authorization_code'
    }
  }, fn);
}


OAuth2.prototype.refreshToken = function(refreshToken, fn) {
  this.tokenRequest({
    params: { 
      'refresh_token': refreshToken, 
      'grant_type': 'refresh_token'
    }
  }, fn);
}

/*OAuth2.prototype.request = function(options, fn) {
  headers['Authorization'] = 'OAuth ' + auth['access_token'];
  headers['Host'] = this.base;

  return this.client.request(method, url, headers);
}*/
