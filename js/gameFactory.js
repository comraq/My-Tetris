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

  this.gameMatrix = create2DArray(this.ROWS, this.COLS);
  this.gameLevel = 5;
  this.gameSpeed;
  this.currentBlock;

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
  this.updateSizes();
};

/* We resize canvas to match the current CSS transformed sizes */
Frame.prototype.updateSizes = function() {
  this.canvas.height = this.canvas.offsetHeight;
  this.canvas.width = this.canvas.offsetWidth;

  this.height = this.canvas.height;
  this.width = this.canvas.width;
  this.blockHeight = this.height / this.ROWS;
  this.blockWidth = this.width / this.COLS;	

  //Restore the drawing styles lost due to resizing
  this.setColours();

  //Update the rate of which blocks fall
  this.gameSpeed = (parseFloat(this.gameLevel) + 5) * 0.01 * this.blockHeight; 
};

Frame.prototype.getSize = function() {
  alert("Height: " + this.height + " Width: " + this.width +
        "\nBlockHeight: " + this.blockHeight + " BlockWidth: " + this.blockWidth);
};

Frame.prototype.draw = function(deltaX, deltaY) {
  for (var r = 0; r < this.currentBlock.MATRIX_SIZE; ++r) {
  	for (var c = 0; c < this.currentBlock.MATRIX_SIZE; ++c) {
      if (this.currentBlock.matrix[r][c] != 0) this.drawSquare(this.x + c * this.blockWidth, this.y + r * this.blockHeight);
  	};
  };
  if (!isNaN(deltaX)) this.x += deltaX;
  if (!isNaN(deltaY)) this.y += deltaY;
};

/* Clears all drawn elements from the canvas */
Frame.prototype.clear = function() {
  //Check whether the browser window has been resized
  if (this.canvas.offsetWidth != this.width || this.canvas.offsetHeight != this.height) {
    this.x /= this.blockWidth;
    this.y /= this.blockHeight;
  	
  	this.updateSizes();
  	this.x *= this.blockWidth;
  	this.y *= this.blockHeight;
  } else {
    this.context.clearRect(0, 0, this.width, this.height);
  };
};

Frame.prototype.generateBlock = function(block) {
  if (typeof block === "undefined") {
    this.currentBlock = getNewBlock();
  } else {
    this.currentBlock = block;
  }
  this.x = this.blockWidth * (this.COLS - this.currentBlock.MATRIX_SIZE) / 2;
  this.y = 0;
  this.drawLoop();
};

Frame.prototype.drawLoop = function() {
  var frame = this;
  
  this.clear();
  if (Math.round(this.y) >= this.height) {
    this.generateBlock();
  } else {
    this.draw(0, this.gameSpeed); 
    this.stopAuto = requestAnimFrame(function() {frame.drawLoop()});
  }
};

