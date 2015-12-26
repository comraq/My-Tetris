function Game() {
  this.ROWS = 20;
  this.COLS = 10;
  this.x = 0;
  this.y = 0;

  this.matrix;
  this.level;
  this.score;
  this.nextLevelScore;
  this.currentBlock;
  this.dirMatrix;
  this.DIR_LEFT = 2;
  this.DIR_UP = 3;
  this.DIR_RIGHT = 5;
  this.DIR_DOWN = 7;

  this.clearedRows;
  this.emptyRow;
  this.chainBlocks;
  this.gameOver;
};

Game.prototype.init = function() {
  this.matrix = create2DArray(this.ROWS, this.COLS);
  this.score = 0;
  this.level = 1;
  this.calculateNextScore();
  this.calculatePeripherals();
  this.dirMatrix = create2DArray(this.ROWS, this.COLS);
  this.chainBlocks = [];
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
  this.calculatePeripherals();
  this.clearedRows = {};
  this.chainBlocks = [];
};

Game.prototype.addBlockToMatrix = function(row, col) {
  this.matrix[this.y + row][this.x + col] = this.currentBlock.matrix[row][col];
  var dir = 1;
  if (col != 0 && this.currentBlock.matrix[row][col - 1] != 0) dir *= this.DIR_LEFT;
  if (row != 0 && this.currentBlock.matrix[row - 1][col] != 0) dir *= this.DIR_UP;
  if (col != this.currentBlock.MATRIX_SIZE - 1 && this.currentBlock.matrix[row][col + 1] != 0) dir *= this.DIR_RIGHT;
  if (row != this.currentBlock.MATRIX_SIZE - 1 && this.currentBlock.matrix[row + 1][col] != 0) dir *= this.DIR_DOWN;
  this.dirMatrix[this.y + row][this.x + col] = dir;
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
  var chainSquares = [];
  var rowList = [];
  for (var rowIndex in this.clearedRows) {
    this.updateDirMatrix(parseInt(rowIndex));

    if ((rowIndex < this.ROWS - 1) && (!this.clearedRows.hasOwnProperty(parseInt(rowIndex) + 1))) rowList.push(this.matrix[parseInt(rowIndex) + 1]);
    this.matrix.splice(rowIndex, 1);
    this.matrix.unshift(this.emptyRow.slice());
    this.dirMatrix.splice(rowIndex, 1);
    this.dirMatrix.unshift(this.emptyRow.slice());
  };

  if (false) {
  var colList = [];
  for (var i = 0; i < rowList.length; ++i) {
    for (var c = 0; c < this.COLS; ++c) {
      if (rowList[i][c] == 0 && colList.indexOf(c) == -1) {
        for (var r = this.matrix.indexOf(rowList[i]) - 1; r >= 0; --r) {
          if (this.matrix[r][c] != 0) chainSquares.push([r, c]);
        };
        colList.push(c);
      };
    };
  };

  //Trace all the free block entities in the list of squares
  /*var len = chainSquares.length;
  for (var i = 0; i < len; ++i) {
    this.chainBlocks.push(this.traceBlocks(chainSquare[i], chainSquares));
    len = chainSquares.length;
  };*/



    console.log("current block: ");
    for (var row in this.currentBlock.matrix) console.log(this.currentBlock.matrix[row]);
    console.log("dirMatrix: ");
    for (var row in this.dirMatrix) console.log(this.dirMatrix[row]);
    console.log("chainSquares: ");
    for (var square in chainSquares) console.log(chainSquares[square]);
    console.log("colList: " + colList + "chainBlocks:");
    for (var block in this.chainBlocks) console.log(this.chainBlocks[block]);
  };
};

Game.prototype.dropChainBlocks = function() {
  return false;
};

//Updates the direction in blocks above and below the cleared row
Game.prototype.updateDirMatrix = function(clearedRow) {
  for (var c = 0; c < this.COLS; ++c) {
    if ((clearedRow > 0) && (this.dirMatrix[clearedRow - 1][c] % this.DIR_DOWN == 0)) {
      this.dirMatrix[clearedRow - 1][c] /= this.DIR_DOWN;
    };
    if ((clearedRow < this.ROWS - 1) && (this.dirMatrix[clearedRow + 1][c] % this.DIR_UP == 0)) {
      this.dirMatrix[clearedRow + 1][c] /= this.DIR_UP;
    };
  };
};

//Returns all the squares remaining of a previously generated block
Game.prototype.traceBlock = function(square, squaresList, colList) {
  if (false) {

  var block = [];
  var squareStack = [square];
  var curr, found, r, c;
  while (squareStack.length > 0) {
    curr = squareStack.pop();
    r = curr[0];
    c = curr[1];
    
    //Check Left
    if (this.dirMatrix[r][c] % this.DIR_LEFT == 0 && c > 0 && this.matrix[r][c - 1] == this.matrix[r][c]) {
      if (this.dirMatrix[r][c - 1] % this.DIR_RIGHT == 0) {
        if (colList.indexOf(c - 1) == -1) return;
        squareStack.push([r, c - 1]);
      };  
    };

    //Check Up

    //Check Right

    //Check Down


    found = squareList.indexOf(curr);
    if (found != -1 && curr != square) squareList.splice(found, 1);
    block.push(curr);
  };
  return block;

  };
};

Game.prototype.calculatePeripherals = function() {
  var numLinesCleared = numProperties(this.clearedRows);
  this.score += 10 * Math.pow(numLinesCleared, 2) * this.level;
  if (this.level < 10 && this.score >= this.nextLevelScore) {
    ++this.level;
    this.calculateNextScore();
  };
};

Game.prototype.calculateNextScore = function() {
  this.nextLevelScore = Math.pow(this.level, 2) * 100 / 2;
};
