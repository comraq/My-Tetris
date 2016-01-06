function CanvasFrame() {
  this.tick = 0;
  this.prevX = [];
  this.prevY = [];

  this.canvas;
  this.context;
  this.height;
  this.width;
  this.blockHeight;
  this.blockWidth;

  this.previewFrame;

  this.game;
  this.gameSpeed;
  this.gameState;
  this.stopAnimation = 0;

  this.GameStateEnum = {
    PLAYING : "- Game Active! -",
    STOPPED : "- Game Stopped -",
    PAUSED : "- Game Paused -"
  };

  this.clearCount;
  this.CLEAR_REPEAT = 14;

  this.dropChainBlock;
  this.chainTick;
  this.CHAIN_SPEED = 0.05;

  this.coloursList = [
    "",
    "#ff0000", //LineBlock
    "#71c837", //SquareBlock
    "#ffcc00", //LeftHookBlock
    "#0000ff", //RightHookBlock
    "#89a02c", //ArrowBlock
    "#a0892c", //LeftBoltBlock
    "#ffbbbb", //RightBoltBlock
    "#2caa87", //CrossBlock
    "#2d87aa", //LargeLeftBoltBlock
    "#ffa833", //LargeRightBoltBlock
    "#c0c0c0", //LeftHookArrowBlock
    "#ff5599", //RightHookArrowBlock
    "#c82dab", //LeftTonfaBlock
    "#cccc00"  //RightTonfaBlock
  ];
};

CanvasFrame.prototype.init = function() {
  this.canvas = document.getElementsByClassName("tetris-frame")[0];
  this.context = this.canvas.getContext("2d");
  this.game = new Game();
  this.game.init();
  this.updateGameState(this.GameStateEnum.STOPPED);

  this.previewFrame = new PreviewFrame();
  this.previewFrame.init();

  //Manually scaling up the canvas element size by the CSS transformed sizes
  this.updateSizes();
};

/* We resize canvas to match the current CSS transformed sizes */
CanvasFrame.prototype.updateSizes = function() {
  if (this.canvas.height != this.canvas.offsetHeight || this.canvas.width != this.canvas.offsetWidth) {
    this.canvas.height = this.canvas.offsetHeight;
    this.canvas.width = this.canvas.offsetWidth;

    this.height = this.canvas.height;
    this.width = this.canvas.width;
    this.blockHeight = this.height / this.game.ROWS;
    this.blockWidth = this.width / this.game.COLS;

    this.drawAll();
    this.previewFrame.updateSizes(this);

    //Restore the drawing styles lost due to resizing
    if (typeof this.game.currentBlock !== "undefined") this.setColours();
  };
};

CanvasFrame.prototype.updateSpeed = function() {
  //Update the rate of which blocks fall
  this.gameSpeed = (this.game.level + 3) * 0.01;
};

CanvasFrame.prototype.stopGame = function() {
  if (this.gameState != this.GameStateEnum.STOPPED) {
    cancelAnimationFrame(this.stopAnimation);
    if (confirm("Are you sure you want to quit the current game?")) {
      this.gameOver();
    } else if (this.gameState == this.GameStateEnum.PLAYING) {
      this.draw();
    };
  };
};

CanvasFrame.prototype.newGame = function() {
  cancelAnimationFrame(this.stopAnimation);
  if (confirm("Start a new game?")) {
    this.game.init();
    this.clearAll();

    this.updateGameState(this.GameStateEnum.PLAYING);
    this.dropChainBlock = false;
    
    this.previewNext();
    this.generateBlock();
  } else if (this.gameState == this.GameStateEnum.PLAYING) {
    this.draw();
  };
};

CanvasFrame.prototype.pauseResumeGame = function() {
  if (this.gameState == this.GameStateEnum.PLAYING) {
    cancelAnimationFrame(this.stopAnimation);
    this.updateGameState(this.GameStateEnum.PAUSED);
  } else if (this.gameState == this.GameStateEnum.PAUSED) {
    this.updateGameState(this.GameStateEnum.PLAYING);
    this.draw();
  };
};

CanvasFrame.prototype.gameOver = function() {
  alert("Game Over! Your current score is: " + this.game.score);
  this.updateGameState(this.GameStateEnum.STOPPED);
};

CanvasFrame.prototype.updateGameState = function(gameState) {
  if (typeof gameState !== "undefined") {
    var buttonStop = document.getElementById("stop");
    var buttonPause = document.getElementById("pause-resume");
    var gameStateText = document.getElementById("game-state-text");
    switch(gameState) {
      case this.GameStateEnum.PLAYING:
        buttonPause.innerHTML = "Pause";
        buttonPause.disabled = false;
        buttonStop.disabled = false;
        break;
      case this.GameStateEnum.PAUSED:
        buttonPause.innerHTML = "Resume";
        buttonPause.disabled = false;
        break;
      case this.GameStateEnum.STOPPED:
        buttonPause.innerHTML = "Pause/Resume";
        buttonPause.disabled = true;
        buttonStop.disabled = true;
        break;
      default:
        //Nothing
    };
    this.gameState = gameState;
    gameStateText.innerHTML = gameState;
    //statusText.style.opacity = 0.7;
    showGameState(this, "game-state-text");
  };
};

CanvasFrame.prototype.generateBlock = function() {
  var tempBlock = this.previewFrame.currentBlock;
  this.previewNext();
  this.game.generateBlock(tempBlock);
  this.clearCount = 0;
  this.setColours();
  this.draw();
};

CanvasFrame.prototype.setColours = function(colour) {
  if (typeof colour !== "undefined") {
    this.context.fillStyle = colour;
  } else {
    this.context.fillStyle = this.coloursList[this.game.currentBlock.colour];
  };
};

CanvasFrame.prototype.previewNext = function() {
  this.game.customBlocks = document.getElementById("custom-block-check").checked;
  this.game.generateBlock();
  this.previewFrame.currentBlock = this.game.currentBlock;
  this.previewFrame.showNextBlock(this);
};

/* Methods for controlling the current active tetris block */

CanvasFrame.prototype.moveLeft = function() {
  if (this.gameState == this.GameStateEnum.PLAYING) this.game.moveLeft();
};

CanvasFrame.prototype.moveRight = function() {
  if (this.gameState == this.GameStateEnum.PLAYING) this.game.moveRight();
};

CanvasFrame.prototype.moveDown = function() {
  if (this.gameState == this.GameStateEnum.PLAYING) this.game.moveDown();
};

CanvasFrame.prototype.instantDrop = function() {
  if (this.gameState == this.GameStateEnum.PLAYING) {
    cancelAnimationFrame(this.stopAnimation);
    this.game.instantDrop();
    this.draw();
  };
};

CanvasFrame.prototype.rotateLeft = function() {
  if (this.gameState == this.GameStateEnum.PLAYING) this.game.rotateLeft();
};

CanvasFrame.prototype.rotateRight = function() {
  if (this.gameState == this.GameStateEnum.PLAYING) this.game.rotateRight();
};

/* Methods for drawing and clearing the canvas */

/* Call this method to enter drawLoop, ensuring proper initialization of fields */
CanvasFrame.prototype.draw = function() {
  this.tick = 0;
  this.drawLoop();
}

/* The method that is looped for the necessary animation */
CanvasFrame.prototype.drawLoop = function() {
  var frame = this;
  var gravityCheck = document.getElementById("gravity-check");
  this.updateSizes();
  this.updateSpeed();
  this.updatePeripherals();

  if (this.tick > 1) {
    this.game.moveDown();
    this.game.currentBlock.leftLocked = this.game.checkLeftLocked(this.game.x, this.game.y);
    this.game.currentBlock.rightLocked = this.game.checkRightLocked(this.game.x, this.game.y);
    this.tick = 0;
  };

  if (this.clearCount == 0 && !this.dropChainBlock && !this.game.chainLoop) {
    this.clearCurrent();
    this.drawBlock();
  } else {
    this.clearAll();
    this.drawAll();
  };

  if (this.game.currentBlock.downLocked) {
    if (!this.game.gameOver) {

      if (this.clearCount < this.CLEAR_REPEAT && (this.clearCount > 0 || this.game.clearFilledRows())) {
        //Loop through frames for flashing the rows which are about to be cleared
        for (var rowIndex in this.game.clearedRows) {
          if (this.clearCount % 2 == 0) {
            this.game.matrix[rowIndex] = this.game.emptyRow;
          } else {
            this.game.matrix[rowIndex] = this.game.clearedRows[rowIndex];
          };
        };
        ++this.clearCount;
        this.stopAnimation = requestAnimationFrame(function() {frame.drawLoop()});

      } else if (this.clearCount == this.CLEAR_REPEAT) {
        //Actually remove the cleared rows from game.matrix
        this.game.dropFilledRows();
        ++this.clearCount;
        if (gravityCheck.checked) this.dropChainBlock = this.game.dropChainBlocks();
        this.chainTick = 0;
        this.stopAnimation = requestAnimationFrame(function() {frame.drawLoop()});

      } else if (this.dropChainBlock) {
        //Chain reaction, frames for dropping the free blocks
        if (this.chainTick > 1) {
          this.dropChainBlock = this.game.dropChainBlocks();
          if (!this.dropChainBlock) this.clearCount = 0;
          this.tick = 0;
        };
        this.stopAnimation = requestAnimationFrame(function() {frame.drawLoop()});
        this.chainTick += this.CHAIN_SPEED; 

      } else {
        //Time to generate new block
        this.generateBlock();
      };
    } else {
      this.gameOver();
    };
  } else {
    this.stopAnimation = requestAnimationFrame(function() {frame.drawLoop()});
    this.tick += this.gameSpeed;
  };
};

CanvasFrame.prototype.drawAll = function() {
  for (var r = 0; r < this.game.ROWS; ++r) {
    for (var c = 0; c < this.game.COLS; ++c) {
      if (this.game.matrix[r][c] != 0) {
        this.setColours(this.coloursList[this.game.matrix[r][c]]);
        this.drawSquare((c) * this.blockWidth, (r) * this.blockHeight);
      };
    };
  };
};

CanvasFrame.prototype.drawBlock = function() {
  for (var r = this.game.currentBlock.MATRIX_SIZE - 1; r >= 0; --r) {
    for (var c = 0; c < this.game.currentBlock.MATRIX_SIZE; ++c) {
      if (this.game.currentBlock.matrix[r][c] != 0) {
        this.drawSquare((this.game.x + c) * this.blockWidth, (this.game.y + r) * this.blockHeight);

        //Marking gameMatrix with the colour of the currently dropped block 
        if(this.game.currentBlock.downLocked) {
          if (this.game.y + r <= 0) {
            this.game.gameOver = true;
            return;
          } else {
            this.game.addBlockToMatrix(r, c);
          };
        } else {
          this.prevX.push(this.game.x + c);
          this.prevY.push(this.game.y + r);
        };
      };  
    };
  };
};

/* Draws a square at coordinates x, y */
CanvasFrame.prototype.drawSquare = function(x, y) {
  this.context.fillRect(x, y, this.blockWidth - 1, this.blockHeight - 1);
};

/* Clears all drawn elements from the canvas */
CanvasFrame.prototype.clearAll = function() {
  //Check whether the browser window has been resized
  if (this.canvas.offsetWidth != this.width || this.canvas.offsetHeight != this.height) {
    this.updateSizes();
  } else {
    this.context.clearRect(0, 0, this.width, this.height);
  };
};

/* Only clear the current active block from the canvas */
CanvasFrame.prototype.clearCurrent = function() {
  if (typeof this.game.currentBlock !== "undefined") {
    while (this.prevX.length != 0) {
      this.context.clearRect(this.prevX.pop() * this.blockWidth - 1, this.prevY.pop() * this.blockHeight - 1, this.blockWidth + 1 , this.blockHeight + 1);
    };
  };
};

CanvasFrame.prototype.updatePeripherals = function() {
  document.getElementById("level-field").innerHTML = " " + this.game.level;
  document.getElementById("score-field").innerHTML = this.game.score; 
}

function PreviewFrame() {
  this.canvas;
  this.context;
  this.height;
  this.width;
  this.blockHeight;
  this.blockWidth;

  this.BLOCK_SIZE = 6;
  this.originX;
  this.originY;

  this.currentBlock;
};

PreviewFrame.prototype.init = function() {
  this.canvas = document.getElementsByClassName("preview-frame")[0];
  this.context = this.canvas.getContext("2d");

  this.updateSizes();
  this.originX = 1;
  this.originY = 1;
};

PreviewFrame.prototype.updateSizes = function(frame) {
  if (this.canvas.height != this.canvas.offsetHeight || this.canvas.width != this.canvas.offsetWidth) {
    this.canvas.height = this.canvas.offsetHeight;
    this.canvas.width = this.canvas.offsetWidth;

    this.height = this.canvas.height;
    this.width = this.canvas.width;
    this.blockHeight = this.height / this.BLOCK_SIZE;
    this.blockWidth = this.width / this.BLOCK_SIZE;

    //Redraw the preview/next block lost due to resizing
    if (typeof this.currentBlock !== "undefined") this.showNextBlock(frame);
  };
};

PreviewFrame.prototype.showNextBlock = function(frame) {
  frame.clearAll.call(this);
  frame.setColours.call(this, frame.coloursList[this.currentBlock.colour]);
  for (var r = this.currentBlock.MATRIX_SIZE - 1; r >= 0; --r) {
    for (var c = 0; c < this.currentBlock.MATRIX_SIZE; ++c) {
      if (this.currentBlock.matrix[r][c] != 0) {
        frame.drawSquare.call(this, (this.originX + c) * this.blockWidth, (this.originY + r) * this.blockHeight);
      };
    };
  };
};