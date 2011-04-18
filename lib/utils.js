exports.union = function(a, b){
  a = a || {};
  if (a && b) {
    var keys = Object.keys(b)
      , len = keys.length
      , key;
    for (var i = 0; i < len; ++i) {
      key = keys[i];
      if (!a.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
  }
  return a;
};


