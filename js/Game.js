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
  };
  this.x = (this.COLS - this.currentBlock.MATRIX_SIZE) / 2;
  this.y = this.currentBlock.y;
  //for (var row in this.matrix) console.log(this.matrix[row]);
  //console.log(this.currentBlock.rDistance);
};

Game.prototype.addToMatrix = function(row, col) {
  this.matrix[this.y + row][this.x + col] = this.currentBlock.matrix[row][col];
};

/* Methods for controlling the current active tetris block */

Game.prototype.moveLeft = function() {
  if (this.currentBlock.leftLocked || this.checkLeftLocked(this.x, this.y)) {
    this.currentBlock.leftLocked = true;
  } else {
    --this.x;
  };
};

Game.prototype.moveRight = function() {
  if (this.currentBlock.rightLocked || this.checkRightLocked(this.x, this.y)) {
    this.currentBlock.rightLocked = true;
  } else {
    ++this.x;
  };
};

Game.prototype.moveDown = function() {
  if (this.checkDownLocked(this.x, this.y)) {
    this.currentBlock.downLocked = true;
  } else {
    ++this.y;
  };
};

Game.prototype.instantDrop = function() {
  for (var i = 0; i + this.y < this.ROWS; ++i) {
    if (this.checkDownLocked(this.x, this.y + i)) {
      this.y += i;
      this.currentBlock.downLocked = true;
      return;
    };
  };
};

Game.prototype.rotateLeft = function() {
  this.currentBlock.rotateLeft();
  if (!this.rotateValid()) this.currentBlock.rotateRight();
};

Game.prototype.rotateRight = function() {
  this.currentBlock.rotateRight();
  if (!this.rotateValid()) this.currentBlock.rotateLeft();
};


/* Methods for checking the vacancy of squares adjacent to the current block */

Game.prototype.checkLeftLocked = function(checkX, checkY) {
  for (var i = 0; i < this.currentBlock.lDistance.length; ++i) {
    if (this.currentBlock.lDistance[i] != 0 && (checkY + i) >= 0 &&
          ((checkX + 3 - this.currentBlock.lDistance[i]) >= this.COLS ||
          this.matrix[checkY + i][checkX + 3 - this.currentBlock.lDistance[i]] != 0)) {
      //console.log("y: " + checkY + ", x: " + (checkX + i) + " coord: " + (checkX + this.currentBlock.lDistance[i]) );
      return true;
    };
  };
  return false;
};

Game.prototype.checkRightLocked = function(checkX, checkY) {
  for (var i = 0; i < this.currentBlock.rDistance.length; ++i) {
    if (this.currentBlock.rDistance[i] != 0 && (checkY + i) >= 0 &&
          ((checkX + this.currentBlock.rDistance[i]) >= this.COLS ||
          this.matrix[checkY + i][checkX + this.currentBlock.rDistance[i]] != 0)) {
      //console.log("y: " + checkY + ", x: " + (checkX + i) + " coord: " + (checkX + this.currentBlock.rDistance[i]) );
      return true;
    };
  };
  return false;
};

Game.prototype.checkDownLocked = function(checkX, checkY) {
  for (var i = 0; i < this.currentBlock.dDistance.length; ++i) {
    if (this.currentBlock.dDistance[i] != 0 && (checkY + this.currentBlock.dDistance[i]) >= 0 &&
          ((checkY + this.currentBlock.dDistance[i]) >= this.ROWS ||
          this.matrix[checkY + this.currentBlock.dDistance[i]][checkX + i] != 0)) {
      //console.log("y: " + checkY + " coord: " + (checkY + this.currentBlock.dDistance[i]) + ", x: " + (checkX + i));
      return true;
    };
  };
  return false;
};

Game.prototype.rotateValid = function() {
  for (var r = 0; r < this.currentBlock.MATRIX_SIZE; ++r) {
    for (var c = 0; c < this.currentBlock.MATRIX_SIZE; ++c) {
      if (this.currentBlock.matrix[r][c] != 0 &&
            ((this.y + r) >= this.ROWS || (this.x + c) < 0 || (this.x + c) >= this.COLS ||
            (this.y + r >= 0 && this.matrix[this.y + r][this.x + c] != 0))) {
        return false;
      };
    };
  };
  return true;
};