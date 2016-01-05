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
  this.idMatrix;
  this.idList;
  this.idCount;

  this.TRADITIONAL_NUM_BLOCKS = 7;
  this.CUSTOM_NUM_BLOCKS = 14;
  this.customBlocks = true;

  this.clearedRows;
  this.emptyRow;
  this.chainBlocks;

  this.clearChain;
  this.chainLoop;
  this.gameOver;
  this.verbose = false;

  this.ClearTextEnum = {
    2 : "Double!!",
    3 : "Triple!!!",
    4 : "Tetris!!!!"
  };
};

Game.prototype.init = function() {
  this.matrix = create2DArray(this.ROWS, this.COLS);
  this.score = 0;
  this.level = 1;
  this.calculateNextScore();
  this.calculatePeripherals();

  this.idMatrix = create2DArray(this.ROWS, this.COLS);
  this.idList = this.createIdList(this.ROWS * this.COLS);
  this.idCount = setAll([], (this.ROWS * this.COLS) + 1, 0);
  this.clearedRows = {};
  this.clearChain = 0;

  this.emptyRow = setAll([], this.COLS, 0);
  this.gameOver = false;
};

Game.prototype.createIdList = function(length) {
  var list = [];
  for (var i = 0; i < length; ++i) {
    list.push(length - i);
  };
  return list;
};

Game.prototype.generateBlock = function(block) {
  if (typeof block === "undefined") {
    this.currentBlock = this.getNewBlock(this.idList.pop());
  } else {
    this.currentBlock = block;
  };
  this.x = (this.COLS - this.currentBlock.MATRIX_SIZE) / 2;
  this.y = this.currentBlock.y;
  this.chainLoop = false;
  this.clearChain = 0;
};

Game.prototype.addBlockToMatrix = function(row, col) {
  this.matrix[this.y + row][this.x + col] = this.currentBlock.matrix[row][col];
  this.idMatrix[this.y + row][this.x + col] = this.currentBlock.id;
  ++this.idCount[this.currentBlock.id];
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
    if (this.currentBlock.lDistance[i] != 0 &&
         ((checkX + 3 - this.currentBlock.lDistance[i]) < 0 ||
         ((checkY + i) >= 0 && this.matrix[checkY + i][checkX + 3 - this.currentBlock.lDistance[i]] != 0))) {
      return true;
    };
  };
  return false;
};

Game.prototype.checkRightLocked = function(checkX, checkY) {
  for (var i = 0; i < this.currentBlock.rDistance.length; ++i) {
    if (this.currentBlock.rDistance[i] != 0 &&
         ((checkX + this.currentBlock.rDistance[i]) >= this.COLS ||
         ((checkY + i) >= 0 && this.matrix[checkY + i][checkX + this.currentBlock.rDistance[i]] != 0))) {            
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
  if (!this.chainLoop) {
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
  } else {
    for (var r = this.ROWS - 1; r >= 0; --r) {
      rowFilled = true;
      for (var c = 0; c < this.COLS; ++c) {
        if (this.matrix[r][c] == 0) {
          rowFilled = false;
          break;
        };
      };
      if (rowFilled) this.clearedRows[r] = this.matrix[r]; 
    };
  };

  if (isEmpty(this.clearedRows)) {
    return false;
  } else {
    this.calculatePeripherals();
    return true;
  };
};

Game.prototype.dropFilledRows = function() {
  if (this.verbose) {
    console.log("idMatrix: ");
    for (var row in this.idMatrix) console.log(this.idMatrix[row]);
  };

  var rowList = [];
  var clearedId;
  for (var rowIndex in this.clearedRows) {
    this.updateIdMatrix(parseInt(rowIndex));
    for (var i = 0; i < this.clearedRows[rowIndex].length; ++i) {
      clearedId = this.idMatrix[rowIndex][i];
      if (--this.idCount[clearedId] == 0) this.idList.push(clearedId); 
    };

    if ((rowIndex < this.ROWS - 1) && (!this.clearedRows.hasOwnProperty(parseInt(rowIndex) + 1))) rowList.push(this.matrix[parseInt(rowIndex) + 1]);
    this.matrix.splice(rowIndex, 1);
    this.matrix.unshift(this.emptyRow.slice());
    this.idMatrix.splice(rowIndex, 1);
    this.idMatrix.unshift(this.emptyRow.slice());
  };
  
  //Resetting previously cleared rows and discovered chain blocks
  this.clearedRows = {};
  this.chainBlocks = {};

  var rowEmpty, id;
  for (var r = this.ROWS - 1; r >= 0; --r) {
    rowEmpty = true;
    for (var c = 0; c < this.COLS; ++c) {
      if (this.matrix[r][c] != 0) {
        rowEmpty = false;
        id = this.idMatrix[r][c];
        if (!this.chainBlocks.hasOwnProperty(id)) {
          this.chainBlocks[id] = [[r, c]];
        };
      };
    };
    if (rowEmpty) break;
  };

  //Find all squares associated with the chain blocks
  for (var blockId in this.chainBlocks) {
    if (this.chainBlocks[blockId].length < this.idCount[blockId]) {
      this.findEntireBlock(blockId, this.chainBlocks[blockId][0][0], this.chainBlocks[blockId][0][1], r);
    };
  };

  if (this.verbose) {
    console.log("current block: ");
    for (var row in this.currentBlock.matrix) console.log(this.currentBlock.matrix[row]);
    console.log("idMatrix: ");
    for (var row in this.idMatrix) console.log(this.idMatrix[row]);
    console.log("idCount: " + this.idCount);
    console.log("idList: " + this.idList);
    console.log("After:");
    for (var blockId in this.chainBlocks) {
      for (var coord in this.chainBlocks[blockId]) console.log("id: " + blockId + " coord: " + this.chainBlocks[blockId][coord]);
    };
  };
};

Game.prototype.dropChainBlocks = function() {
  this.chainLoop = true;
  var locked, block, r, c, colour, skip;
  if (!isEmpty(this.chainBlocks)) {
    for (var id in this.chainBlocks) {
      block = this.chainBlocks[id];
      locked = false;
      skip = false;
      for (var i = 0; i < block.length; ++i) {
        r = block[i][0];
        c = block[i][1];
        if (r + 1 == this.ROWS || (this.idMatrix[r + 1][c] != 0 && !this.chainBlocks.hasOwnProperty(this.idMatrix[r + 1][c]))) {
          locked = true;
          break;
        } else if (this.idMatrix[r + 1][c] != id && this.chainBlocks.hasOwnProperty(this.idMatrix[r + 1][c])) {
          skip = true;
          break;
        };
      };
      if (locked) {
        delete this.chainBlocks[id];
      } else if (!skip) {
        colour = this.matrix[block[0][0]][block[0][1]];
        for (var i = 0; i < block.length; ++i) {
          r = block[i][0];
          c = block[i][1];
          this.matrix[r][c] = 0;
          this.idMatrix[r][c] = 0;
          this.matrix[r + 1][c] = colour;
          this.idMatrix[r + 1][c] = parseInt(id);
          ++block[i][0];
        };  
      };
    };
    return true;
  } else {
    return false;
  };
};

//Updates the idMatrix in case blocks are split by row clear
Game.prototype.updateIdMatrix = function(row) {
  if (row > 0 && row < this.ROWS - 1) {
    var commonIdList = [];
    for (var aboveCol = 0; aboveCol < this.COLS; ++aboveCol) {
      //Find common id in the above and below row arrays
      if (this.idMatrix[row - 1][aboveCol] != 0) {
        for (var belowCol = 0; belowCol < this.COLS; ++belowCol) {
          if (this.idMatrix[row - 1][aboveCol] == this.idMatrix[row + 1][belowCol]) {
            commonIdList.push(this.idMatrix[row - 1][aboveCol]);
            break;
          };
        };
      };
    };
    var newId;    
    for (var i = 0; i < commonIdList.length; ++i) {
      newId = this.idList.pop();
      for (var j = 1; j <= this.currentBlock.MATRIX_SIZE - 2; ++j) {
        if (row + j >= this.ROWS) break;
        for (var c = 0; c < this.COLS; ++c) {
          if (this.idMatrix[row + j][c] == commonIdList[i]) {
            this.idMatrix[row + j][c] = newId;
            ++this.idCount[newId];
            --this.idCount[commonIdList[i]];
          };
        };
      };
    };
  };  
};

//Finds all squares in the frame given a blockId
Game.prototype.findEntireBlock = function(id, foundRow, foundCol, topRow) {
  for (var c = 0; c < this.COLS; ++c) {
    for (var r = foundRow; r > topRow; --r) {
      if (this.idMatrix[r][c] == id && (r != foundRow || c != foundCol)) {
        this.chainBlocks[id].push([r, c]);
      };
      if (this.chainBlocks[id].length == this.idCount[id]) return;
    };
  };
};

Game.prototype.calculatePeripherals = function() {
  var levelCheck = document.getElementById("level-check");
  var numLinesCleared = numProperties(this.clearedRows);

  //document.getElementById("clear-text").innerHTML = this.ClearTextEnum[numLinesCleared];
  //showGameState(this);

  this.clearChain += numLinesCleared;
  this.score += 10 * Math.pow(this.clearChain, 2) * this.level;
  if (!levelCheck.checked && this.level < 10 && this.score >= this.nextLevelScore) {
    ++this.level;
    this.calculateNextScore();
  };
};

Game.prototype.calculateNextScore = function() {
  this.nextLevelScore = Math.pow(this.level, 2) * 150;
};

Game.prototype.getNewBlock = function(id) {
  var blockNum;

  //Decrease the probability of generating custom blocks to control the difficulty of the game
  if (this.customBlocks && (Math.floor(Math.random()*3) == 0)) {
    blockNum = Math.floor(Math.random()*(this.CUSTOM_NUM_BLOCKS - this.TRADITIONAL_NUM_BLOCKS) + (this.CUSTOM_NUM_BLOCKS - this.TRADITIONAL_NUM_BLOCKS) + 1);
  } else {
    blockNum = Math.floor(Math.random()*this.TRADITIONAL_NUM_BLOCKS + 1);
  };

  var newblock = null;
  switch(blockNum) {
    case 1:
      newblock = new LineBlock(id);
      break;

    case 2:
      newblock = new SquareBlock(id);
      break;

    case 3:
      newblock = new LeftHookBlock(id);
      break;

    case 4:
      newblock = new RightHookBlock(id);
      break;

    case 5:
      newblock = new ArrowBlock(id);
      break;

    case 6:
      newblock = new LeftBoltBlock(id);
      break;

    case 7:
      newblock = new RightBoltBlock(id);
      break;

    case 8:
      newblock = new CrossBlock(id);
      break;

    case 9:
      newblock = new LargeLeftBoltBlock(id);
      break;

    case 10:
      newblock = new LargeRightBoltBlock(id);
      break;

    case 11:
      newblock = new LeftHookArrowBlock(id);
      break;

    case 12:
      newblock = new RightHookArrowBlock(id);
      break;

    case 13:
      newblock = new LeftTonfaBlock(id);
      break;

    case 14:
      newblock = new RightTonfaBlock(id);
      break;

    default:
      return null;
  };
  return newblock;
};