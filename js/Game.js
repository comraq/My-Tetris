function Game() {
  this.ROWS = 20;
  this.COLS = 10;
  this.x = 0;
  this.y = 0;

  this.matrix;
  this.level;
  this.score;
  this.currentBlock;
  /*this.dirMatrix;
  this.DIR_LEFT = 1;
  this.DIR_RIGHT = 2;
  this.DIR_BOTH = 3;
  this.DIR_VERTICAL = 4;*/

  this.clearedRows;
  this.emptyRow;
  //this.colGaps;
  this.gameOver;
};

Game.prototype.init = function() {
  this.matrix = create2DArray(this.ROWS, this.COLS);
  this.score = 0;
  this.level = 1;
  this.updatePeripherals();
  //this.dirMatrix = create2DArray(this.ROWS, this.COLS);
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
  this.updatePeripherals();
  this.clearedRows = {};
};

Game.prototype.addBlockToMatrix = function(row, col) {
  this.matrix[this.y + row][this.x + col] = this.currentBlock.matrix[row][col];
  /*if (col == this.currentBlock.MATRIX_SIZE - 1) {
    if (this.currentBlock.matrix[row][col - 1] != 0) {
      this.dirMatrix[this.y + row][this.x + col] = this.DIR_LEFT;
    } else {
      this.dirMatrix[this.y + row][this.x + col] = this.DIR_VERTICAL;
    };
    return;
  } else if (col == 0) {
    if (this.currentBlock.matrix[row][col + 1] != 0) {
      this.dirMatrix[this.y + row][this.x + col] = this.DIR_RIGHT;
    } else {
      this.dirMatrix[this.y + row][this.x + col] = this.DIR_VERTICAL;
    };
    return;
  };
  if (this.currentBlock.matrix[row][col - 1] != 0 && this.currentBlock.matrix[row][col + 1] != 0) {
    this.dirMatrix[this.y + row][this.x + col] = this.DIR_BOTH;
  } else if (this.currentBlock.matrix[row][col - 1] != 0 && this.currentBlock.matrix[row][col + 1] == 0) {
    this.dirMatrix[this.y + row][this.x + col] = this.DIR_LEFT;
  } else if (this.currentBlock.matrix[row][col - 1] == 0 && this.currentBlock.matrix[row][col + 1] != 0) {
    this.dirMatrix[this.y + row][this.x + col] = this.DIR_RIGHT;
  } else {
    this.dirMatrix[this.y + row][this.x + col] = this.DIR_VERTICAL;
  };*/
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
  var leftGap = this.currentBlock.MATRIX_SIZE - getMaxOfArray(this.currentBlock.lDistance);
  var rightGap = this.currentBlock.MATRIX_SIZE - getMaxOfArray(this.currentBlock.rDistance);
  
  this.currentBlock.rotateLeft();
  if (!this.checkValid()) {
    //Checking for available "Wall Kicks"
    for (var left = 1; left <= leftGap; ++left) {
      if (this.checkValid(this.x + left, this.y)) {
        this.x += left;
        return;
      };
    };
    for (var right = 1; right <= rightGap; ++right) {
      if (this.checkValid(this.x - right, this.y)) {
        this.x -= right;
        return;
      };
    };
    this.currentBlock.rotateRight();
  };
};

Game.prototype.rotateRight = function() {
  var leftGap = this.currentBlock.MATRIX_SIZE - getMaxOfArray(this.currentBlock.lDistance);
  var rightGap = this.currentBlock.MATRIX_SIZE - getMaxOfArray(this.currentBlock.rDistance);

  this.currentBlock.rotateRight();
  if (!this.checkValid()) {
    //Checking for available "Wall Kicks"
    for (var left = 1; left <= leftGap; ++left) {
      if (this.checkValid(this.x + left, this.y)) {
        this.x += left;
        return;
      };
    };
    for (var right = 1; right <= rightGap; ++right) {
      if (this.checkValid(this.x - right, this.y)) {
        this.x -= right;
        return;
      };
    };
    this.currentBlock.rotateLeft();
  };
};


/* Methods for checking the vacancy of squares adjacent to the current block */

Game.prototype.checkLeftLocked = function(checkX, checkY) {
  for (var i = 0; i < this.currentBlock.lDistance.length; ++i) {
    if (this.currentBlock.lDistance[i] != 0 && (checkY + i) >= 0 &&
          ((checkX + 3 - this.currentBlock.lDistance[i]) >= this.COLS ||
          this.matrix[checkY + i][checkX + 3 - this.currentBlock.lDistance[i]] != 0)) {
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
    return false;
  } else {
    return true;
  };
};

Game.prototype.dropFilledRows = function() {
  for (var rowIndex in this.clearedRows) {
    this.matrix.splice(rowIndex, 1);
    this.matrix.unshift(this.emptyRow.slice());
  };
  //Also dropping isolated blocks due to gravity
};

Game.prototype.updatePeripherals = function() {
  var numLinesCleared = numProperties(this.clearedRows);
  this.score += 10 * Math.pow(numLinesCleared, 2);
  if (this.level < 10 && (this.score / 100 - this.level) >= 1) ++this.level;

  document.getElementById("level-field").innerHTML = " " + this.level;
  document.getElementById("score-field").innerHTML = this.score; 
};