function Game() {
  this.ROWS = 20;
  this.COLS = 10;
  this.x = 0;
  this.y = 0;

  this.matrix;
  this.level = 1;
  this.currentBlock;

  this.clearedRows;
  this.emptyRow;
  this.gameOver;
};

Game.prototype.init = function() {
  this.matrix = create2DArray(this.ROWS, this.COLS);
  this.emptyRow = setAll([], this.COLS, 0);
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
  this.clearedRows = {};
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
  if (!this.checkValid()) this.currentBlock.rotateRight();
};

Game.prototype.rotateRight = function() {
  this.currentBlock.rotateRight();
  if (!this.checkValid()) this.currentBlock.rotateLeft();
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

Game.prototype.checkValid = function(checkX, checkY) {
  if (typeof checkX === "undefined") checkX = this.x;
  if (typeof checkY === "undefined") checkY = this.y;
  for (var r = 0; r < this.currentBlock.MATRIX_SIZE; ++r) {
    for (var c = 0; c < this.currentBlock.MATRIX_SIZE; ++c) {
      if (this.currentBlock.matrix[r][c] != 0 &&
            ((checkY + r) >= this.ROWS || (checkX + c) < 0 || (checkX + c) >= this.COLS ||
            (checkY + r >= 0 && this.matrix[checkY + r][checkX + c] != 0))) {
        return false;
      };
    };
  };
  return true;
};

Game.prototype.clearFilledRows = function() {
  var rowFilled;
  for (var i = 0; i < this.currentBlock.lDistance.length; ++i) {
    if (this.currentBlock.lDistance[i] != 0) {
      rowFilled = true;
      for (var c = 0; c < this.COLS; ++c) {
        if (this.matrix[this.y + i][c] == 0) {
          rowFilled = false;
          break;
        };
      };
      if (rowFilled) this.clearedRows[this.y + i] = this.matrix[this.y + i];  
    };
  };

  if (isEmpty(this.clearedRows)) {
    //console.log("Last Block x: " + this.x + " y: " + this.y + " clearedRows: " + this.clearedRows + " rowFilled: " + false);
    return false;
  } else {
    //console.log("Last Block x: " + this.x + " y: " + this.y + " clearedRows: " + this.clearedRows + " rowFilled: " + true);
    return true;
  };
};

Game.prototype.dropFilledRows = function() {
  for (var rowIndex in this.clearedRows) {
    this.matrix.splice(rowIndex, 1);
    this.matrix.unshift(this.emptyRow);
  };  
};