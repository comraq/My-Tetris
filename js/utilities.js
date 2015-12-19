var create2DArray = function(rows, cols) {
  var result = [];
  for (var row = 0; row < rows; ++row) {
    result[row] = [];
    for (var col = 0; col < cols; ++col) {
      result[row][col] = 0;
    };
  };
  return result;
};

window.requestAnimFrame = (function() {
	return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(callback){
				window.setTimeout(callback, 1000 / 60);
			};
})();