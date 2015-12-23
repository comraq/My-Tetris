function Game() {
  this.ROWS = 20;
  this.COLS = 10;
  this.x = 0;
  this.y = 0;
  this.deltaX = 0;
  this.deltaY = 0;

  this.prevX = [];
  this.prevY = [];

  this.matrix;
  this.level = 10;
  this.currentBlock;

  this.gameOver;

};

Game.prototype.init = function() {
  this.matrix = create2DArray(this.ROWS, this.COLS);
  this.gameOver = false;

};

Game.prototype.generateBlock = function(block) {
  if (typeof block === "undefined") {
    this.currentBlock = getNewBlock();
  } else {
    this.currentBlock = block;
  }
  this.x = (this.COLS - this.currentBlock.MATRIX_SIZE) / 2;
  this.y = this.currentBlock.y;
  this.setColours();
  this.drawLoop();
  //for (var row in this.matrix) console.log(this.matrix[row]);
};

/* Methods for controlling the current active tetris block */

Game.prototype.moveLeft = function() {
  if (this.checkLeftLocked(this.x - 1, this.y)) {
    this.currentBlock.leftLocked = true;
    return false;
  } else {
    //--this.x; or smooth animation with -0.5deltaX?
    return true;
  };
};

Game.prototype.moveRight = function() {
  if (this.checkRightLocked(this.x + 1, this.y)) {
    this.currentBlock.rightLocked = true;
    return false;
  } else {
    // ++this.x; or smooth animation with 0.5deltaX?
    return true;
  };
};

Game.prototype.moveDown = function() {
  if (this.checkRightLocked(this.x, this.y + 1)) {
    this.currentBlock.downLocked = true;
    return false;
  } else {
    // ++this.y; or smooth animation with 0.5deltaY?
    return true;
  };
};

Game.prototype.instantDrop = function() {
  for (var i = 0; i + this.y < this.ROWS; ++i) {
    if (this.checkDownLocked(this.x, this.y + i)) {
      this.y += i + 1;
      this.currentBlock.downLocked = true;
      return true;
    };
  };
  return false;
};

Game.prototype.rotateLeft = function() {
  //Need to check for leftLocked before rotateLeft
  this.currentBlock.rotateLeft();
};

Game.prototype.rotateRight = function() {
  //Need to check for rightLocked before rotateRight
  this.currentBlock.rotateRight();
};


/* Methods for checking the vacancy of squares adjacent to the current block */

Game.prototype.checkLeftLocked = function(checkX, checkY) {

};

Game.prototype.checkRightLocked = function(checkX, checkY) {

};

Game.prototype.checkDownLocked = function(checkX, checkY) {
  for (var i = 0; i < this.currentBlock.distance.length; ++i) {
    if (this.currentBlock.distance[i] != 0 && (
          (checkY + 1 + this.currentBlock.distance[i]) >= this.ROWS ||
          this.matrix[checkY + this.currentBlock.distance[i] + 1][checkX + i] != 0
        )) {
      //console.log("y: " + checkY + " coord: " + (checkY + this.currentBlock.distance[i] + 1) + "," + (checkX + i));
      return true;
    };
  };
  return false;
};

/* Methods for drawing and clearing the canvas */

Game.prototype.drawBlock = function() {
  for (var r = this.currentBlock.MATRIX_SIZE - 1; r >= 0; --r) {
    for (var c = 0; c < this.currentBlock.MATRIX_SIZE; ++c) {
      if (this.currentBlock.matrix[r][c] != 0) {
        this.drawSquare((this.x + this.deltaX + c) * this.blockWidth, (this.y + this.deltaY + r) * this.blockHeight);
        //console.log("block: " + this.currentBlock.colour + " y: " + this.y + " dy: " + this.deltaY + " coord: " + r + "," + c + " downLocked: " + this.currentBlock.downLocked);

        //Marking matrix with the colour of the currently dropped block 
        if(this.currentBlock.downLocked) {
          if (this.y + r <= 0) {
            this.gameOver = true;
            return;
          } else {
            this.matrix[this.y + r][this.x + c] = this.currentBlock.matrix[r][c];
          };
        } else {
          this.prevX.push(this.x + this.deltaX + c);
          this.prevY.push(this.y + this.deltaY + r);
        };
      };  
    };
  };
  //console.log("currY * blockHeight: " + ((this.y + this.deltaY) * this.blockHeight) + " currY: " + (this.y + this.deltaY) + " y-coord: " + this.y);
};