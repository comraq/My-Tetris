function Frame() {
  this.ROWS = 20;
  this.COLS = 10;
  this.x = 0;
  this.y = 0;
};

/* Draws a square at coordinates x, y */
Frame.prototype.drawSquare = function(x, y) {
  //this.context.rect(x, y, this.blockWidth - 1, this.blockHeight - 1);
  this.context.rect(x, y, this.blockWidth - 1, 5);
  this.context.stroke();
  this.context.fill();
};

Frame.prototype.setColours = function() {
  this.context.strokeStyle = "black";
  this.context.fillStyle = "green";
};

Frame.prototype.init = function() {
  this.canvas = document.getElementsByClassName("tetris-frame")[0];
  this.context = this.canvas.getContext("2d");
  this.height = this.canvas.height;
  this.width = this.canvas.width;
  this.blockHeight = this.height / this.ROWS;
  this.blockWidth = this.width / this.COLS;
};

Frame.prototype.getSize = function() {
  alert("Height: " + this.height + " Width: " + this.width +
        "\nBlockHeight: " + this.blockHeight + " BlockWidth: " + this.blockWidth);
};

Frame.prototype.draw = function() {
  this.drawSquare(this.x, this.y);
  this.x += this.blockWidth;
  //this.y += this.blockHeight;
};
