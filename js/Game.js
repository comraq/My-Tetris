function Game() {
  this.ROWS = 20;
  this.COLS = 10;
  this.x = 0;
  this.y = 0;

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
  //for (var row in this.matrix) console.log(this.matrix[row]);
};

Game.prototype.addToMatrix = function(row, col) {
  this.matrix[this.y + row][this.x + col] = this.currentBlock.matrix[row][col];
}

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
  if (this.checkDownLocked(this.x, this.y++)) this.currentBlock.downLocked = true;
};

Game.prototype.instantDrop = function() {
  for (var i = 0; i + this.y < this.ROWS; ++i) {
    if (this.checkDownLocked(this.x, this.y + i)) {
      this.y += i + 1;
      this.currentBlock.downLocked = true;
      return;
    };
  };
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