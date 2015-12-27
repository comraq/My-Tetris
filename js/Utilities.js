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
    array[i] = value;
  };
  return array;
};

function isEmpty(obj) {
  if (numProperties(obj) == 0) {
    return true;
  };
  return false;
};

function numProperties(obj) {
  var count = 0;
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop)) ++count;
  };
  return count;
};

function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
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
