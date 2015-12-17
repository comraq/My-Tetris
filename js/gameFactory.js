function Frame() {
  this.ROWS = 20;
  this.COLS = 10;
  this.x = 0;
  this.y = 0;

  this.canvas;
  this.context;
  this.height;
  this.width;
  this.blockHeight;
  this.blockWidth;

  this.stopAuto = 0;
};

/* Draws a square at coordinates x, y */
Frame.prototype.drawSquare = function(x, y) {
  this.context.strokeRect(x, y, this.blockWidth - 1, this.blockHeight - 1);
  this.context.fillRect(x, y, this.blockWidth - 1, this.blockHeight - 1);
};

Frame.prototype.setColours = function() {
  this.context.strokeStyle = "black";
  this.context.fillStyle = "green";
};

Frame.prototype.init = function() {
  this.canvas = document.getElementsByClassName("tetris-frame")[0];
  this.context = this.canvas.getContext("2d");

  //Manually scaling up the canvas element size by the CSS transformed sizes
  this.canvas.height = this.canvas.offsetHeight;
  this.canvas.width = this.canvas.offsetWidth;

  this.height = this.canvas.height;
  this.width = this.canvas.width;
  this.blockHeight = this.height / this.ROWS;
  this.blockWidth = this.width / this.COLS;
};

Frame.prototype.getSize = function() {
  alert("Height: " + this.height + " Width: " + this.width +
        "\nBlockHeight: " + this.blockHeight + " BlockWidth: " + this.blockWidth);
};

Frame.prototype.draw = function() {
  this.drawSquare(this.x, this.y);
  ++this.x;
  //this.x += this.blockWidth;
  //this.y += this.blockHeight;
};

/* Clears all drawn elements from the canvas */
Frame.prototype.clear = function() {
  this.context.clearRect(0, 0, this.width, this.height);
};

Frame.prototype.reset = function() {
  this.x = 0;
  this.y = 0;
};

Frame.prototype.autoDraw = function() {
  var frame = this;
  
  this.clear();
  if (Math.round(this.x) >= this.width) {
    this.reset();
  };
  this.draw();
  this.stopAuto = requestAnimFrame(function() {frame.autoDraw()});
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