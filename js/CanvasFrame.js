function CanvasFrame() {
  this.deltaY = 0;
  this.prevX = [];
  this.prevY = [];

  this.canvas;
  this.context;
  this.height;
  this.width;
  this.blockHeight;
  this.blockWidth;

  this.game;
  this.gameSpeed;
  this.gameActive;
  this.stopAnimation = 0;

  this.clearCount;
  this.CLEAR_REPEAT = 7; //This needs to be an odd value to end with the last cycle through the loop clearing filled rows

  this.coloursList = [
    "",
    "#ff0000", //LineBlock
    "#71c837", //SquareBlock
    "#ffcc00", //LeftHookBlock
    "#0000ff", //RightHookBlock
    "#89a02c", //ArrowBlock
    "#a0892c", //LeftBoltBlock
    "#ff00ff"  //RightBoltBlock
  ];
};

CanvasFrame.prototype.init = function() {
  this.canvas = document.getElementsByClassName("tetris-frame")[0];
  this.context = this.canvas.getContext("2d");
  this.game = new Game();
  this.game.init();
  this.gameActive = false;

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

    //Restore the drawing styles lost due to resizing
    if (typeof this.game.currentBlock !== "undefined") this.setColours();
  };
};

CanvasFrame.prototype.updateSpeed = function() {
  //Update the rate of which blocks fall
  this.gameSpeed = (parseFloat(this.game.level) + 3) * 0.01;
};

CanvasFrame.prototype.stopGame = function() {
  if (this.gameActive) {
    cancelAnimationFrame(this.stopAnimation);
    if (confirm("Are you sure you want to stop the current game?")) {
      this.gameOver();
      this.gameActive = false;
    } else {
      this.drawLoop();
    };
  };
};

CanvasFrame.prototype.newGame = function() {
  cancelAnimationFrame(this.stopAnimation);
  if (confirm("Start a new game?")) {
    this.game.init();
    this.clearAll();
    this.gameActive = true;
    this.generateBlock();
  } else if (this.gameActive) {
    this.drawLoop();
  };
};

CanvasFrame.prototype.gameOver = function() {
  alert("Game Over! Your current score is: " + this.game.score);
};

CanvasFrame.prototype.generateBlock = function(block) {
  this.game.generateBlock(block);
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

/* Methods for controlling the current active tetris block */

CanvasFrame.prototype.moveLeft = function() {
  this.game.moveLeft();
};

CanvasFrame.prototype.moveRight = function() {
  this.game.moveRight();
};

CanvasFrame.prototype.moveDown = function() {
  this.game.moveDown();
};

CanvasFrame.prototype.instantDrop = function() {
  cancelAnimationFrame(this.stopAnimation);
  this.game.instantDrop();
  this.draw();
};

CanvasFrame.prototype.rotateLeft = function() {
  this.game.rotateLeft();
};

CanvasFrame.prototype.rotateRight = function() {
  this.game.rotateRight();
};

/* Methods for drawing and clearing the canvas */

/* Call this method to enter drawLoop, ensuring proper initialization of fields */
CanvasFrame.prototype.draw = function() {
  this.deltaY = 0;
  this.drawLoop();
}

/* The method that is looped for the necessary animation */
CanvasFrame.prototype.drawLoop = function() {
  var frame = this;
  this.updateSizes();
  this.updateSpeed();
  this.game.updatePeripherals();

  if (this.deltaY > 1) {
    this.game.moveDown();
    this.game.currentBlock.leftLocked = this.game.checkLeftLocked(this.game.x, this.game.y);
    this.game.currentBlock.rightLocked = this.game.checkRightLocked(this.game.x, this.game.y);
    this.deltaY = 0;
  };
  if (this.clearCount == 0) {
    this.clearCurrent();
    this.drawBlock();
  } else {
    this.clearAll();
    this.drawAll();
  };
  if (this.game.currentBlock.downLocked) {
    if (!this.game.gameOver) {
      if (this.clearCount < this.CLEAR_REPEAT && (this.clearCount > 0 || this.game.clearFilledRows())) {
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
        this.game.dropFilledRows();
        ++this.clearCount;
        this.stopAnimation = requestAnimationFrame(function() {frame.drawLoop()});
      } else {
        this.generateBlock();
      };
    } else {
      this.gameOver();
    };
  } else {
    this.stopAnimation = requestAnimationFrame(function() {frame.drawLoop()});
    this.deltaY += this.gameSpeed;
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
  /*if (this.game.currentBlock.downLocked) {
    console.log("current block: ");
    for (var row in this.game.currentBlock.matrix) console.log(this.game.currentBlock.matrix[row]);
    console.log("dirMatrix: ");
    for (var row in this.game.dirMatrix) console.log(this.game.dirMatrix[row]);    
  };*/
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
