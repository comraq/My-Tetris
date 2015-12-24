function create2DArray(rows, cols) {
  var result = [];
  for (var row = 0; row < rows; ++row) {
    result[row] = [];
    for (var col = 0; col < cols; ++col) {
      result[row][col] = 0;
    };
  };
  return result;
};

function setAll(array, length, value) {
  for (var i = 0; i < length; ++i) {
    array[i] = 0;
  };
  return array;
};

function isEmpty(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop)) return false;
  };
  return true;
};

/* requestAnimationFrame Polyfill */
(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                               || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
}());
