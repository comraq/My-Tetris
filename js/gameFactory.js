function Frame() {
  this.ROWS = 20;
  this.COLS = 10;
  this.x = 0;
  this.y = 0;
  this.deltaX = 0;
  this.deltaY = 0;

  this.prevX = [];
  this.prevY = [];

  this.canvas;
  this.context;
  this.height;
  this.width;
  this.blockHeight;
  this.blockWidth;

  this.gameMatrix;
  this.gameLevel = 10;
  this.gameSpeed;
  this.currentBlock;

  this.gameOver;
  this.stopAuto = 0;

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
  if (typeof this.currentBlock !== "undefined") this.setColours();

  //Update the rate of which blocks fall
  this.gameSpeed = (parseFloat(this.gameLevel) + 5) * 0.01;
};

Frame.prototype.getSize = function() {
  alert("Height: " + this.height + " Width: " + this.width +
        "\nBlockHeight: " + this.blockHeight + " BlockWidth: " + this.blockWidth);
};

Frame.prototype.setColours = function() {
  this.context.fillStyle = this.coloursList[this.currentBlock.colour];
};

/* Draws a square at coordinates x, y */
Frame.prototype.drawSquare = function(x, y) {
  this.context.fillRect(x, y, this.blockWidth - 1, this.blockHeight - 1);
};

Frame.prototype.drawBlock = function() {
  for (var r = this.currentBlock.MATRIX_SIZE - 1; r >= 0; --r) {
    for (var c = 0; c < this.currentBlock.MATRIX_SIZE; ++c) {
      if (this.currentBlock.matrix[r][c] != 0) {
        this.drawSquare((this.x + this.deltaX + c) * this.blockWidth, (this.y + this.deltaY + r) * this.blockHeight);
        //console.log("block: " + this.currentBlock.colour + " y: " + this.y + " dy: " + this.deltaY + " coord: " + r + "," + c + " downLocked: " + this.currentBlock.downLocked);

        //Marking gameMatrix with the colour of the currently dropped block 
        if(this.currentBlock.downLocked) {
          if (this.y + r <= 0) {
            this.gameOver = true;
            return;
          } else {
            this.gameMatrix[this.y + r][this.x + c] = this.currentBlock.matrix[r][c];
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

/* Clears all drawn elements from the canvas */
Frame.prototype.clearAll = function() {
  //Check whether the browser window has been resized
  if (this.canvas.offsetWidth != this.width || this.canvas.offsetHeight != this.height) {
    this.updateSizes();
  } else {
    this.context.clearRect(0, 0, this.width, this.height);
  };
};

/* Only clear the current active block from the canvas */
Frame.prototype.clearCurrent = function() {
  if (typeof this.currentBlock !== "undefined") {
    while (this.prevX.length != 0) {
      this.context.clearRect(this.prevX.pop() * this.blockWidth - 1, this.prevY.pop() * this.blockHeight - 1, this.blockWidth + 1 , this.blockHeight + 1);
    };
  };
};

Frame.prototype.generateBlock = function(block) {
  if (typeof block === "undefined") {
    this.currentBlock = getNewBlock();
  } else {
    this.currentBlock = block;
  }
  this.x = (this.COLS - this.currentBlock.MATRIX_SIZE) / 2;
  this.y = this.currentBlock.y;
  this.deltaX = 0;  
  this.deltaY = 0;
  this.setColours();
  this.drawLoop();
  //for (var row in this.gameMatrix) console.log(this.gameMatrix[row]);
};

Frame.prototype.drawLoop = function() {
  if (this.currentBlock.downLocked) {
    if (!this.gameOver) {
      this.generateBlock();
    } else {
      alert("Game Over! Your current score is: (to be implemented), y: " + this.y);
    };
  } else {  
    var frame = this;
  
    this.clearCurrent();
    if (this.deltaY > 1) {
      this.currentBlock.downLocked = this.checkDownLocked(this.x, this.y++); 
      this.deltaX = 0;
      this.deltaY = 0;
    };
    this.drawBlock();
    this.stopAuto = requestAnimationFrame(function() {frame.drawLoop()});
    this.deltaY += this.gameSpeed;
  };
  //console.log("block: " + this.currentBlock.colour + " this.y: " + this.y + " downLocked: " + this.currentBlock.downLocked + " GameOver: " + this.gameOver);
};

Frame.prototype.checkDownLocked = function(checkX, checkY) {
  for (var i = 0; i < this.currentBlock.distance.length; ++i) {
    if (this.currentBlock.distance[i] != 0 && (
          (checkY + 1 + this.currentBlock.distance[i]) >= this.ROWS ||
          this.gameMatrix[checkY + this.currentBlock.distance[i] + 1][checkX + i] != 0
        )) {
      //console.log("y: " + checkY + " coord: " + (checkY + this.currentBlock.distance[i] + 1) + "," + (checkX + i));
      return true;
    };  
  };
  return false;
};

Frame.prototype.newGame = function() {
  this.gameMatrix = create2DArray(this.ROWS, this.COLS);
  this.gameOver = false;
  this.clearAll();
  this.generateBlock();
};

Frame.prototype.rotateLeft = function() {
  //Need to check for leftLocked before rotateLeft
  this.currentBlock.rotateLeft();
};

Frame.prototype.rotateRight = function() {
  //Need to check for rightLocked before rotateRight
  this.currentBlock.rotateRight();
};

Frame.prototype.instantDrop = function() {
  cancelAnimationFrame(this.stopAuto);
  for (var i = 0; i + this.y < this.ROWS; ++i) {
    if (this.checkDownLocked(this.x, this.y + i)) {
      this.deltaX = 0;
      this.deltaY = 0;
      this.y += i + 1;

      this.currentBlock.downLocked = true;
      this.clearCurrent();
      this.drawBlock();
      break;
    };
  };
  this.drawLoop();
};