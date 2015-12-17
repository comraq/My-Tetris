/* 
 * Base class for all tetris blocks
 */
function Block() {
  this.x = 0;
  this.y = 0;
  this.locked = false;
  //this.rotateValid = false;
 
  this.height = 0;
  this.width = 0;
  this.MATRIX_SIZE = 4;
  this.matrix = [ [0,0,0,0],
                  [0,0,0,0],
                  [0,0,0,0],
                  [0,0,0,0] ];
};

// Method moveUp may be unecessary
Block.prototype.moveUp = function() {
  if (!this.locked) --this.y;  
};

Block.prototype.moveDown = function() {
  if (!this.locked) ++this.y;
};

Block.prototype.moveLeft = function() {
  if (!this.locked) --this.x;  
};

Block.prototype.moveRight = function() {
  if (!this.locked) ++this.x;
};

Block.prototype.rotateLeft = function() {
  if (!this.locked) {
    var temp = this.width;
    this.width = this.height;
    this.height = this.width;

    this.rLeftRecurse(this.MATRIX_SIZE);
  };
};

Block.prototype.rLeftRecurse = function(size) {
  if (size < 2) return;

  var temp;
  var offset = (this.MATRIX_SIZE - size) / 2;
  for (var i = 0; i < size - 1; ++i) {
    // Store Top
    temp = this.matrix[offset][offset + i];

    // Top get Right  
    this.matrix[offset][offset + i] = this.matrix[offset + i][offset + size - 1];

    // Right gets Bottom
    this.matrix[offset + i][offset + size - 1] = this.matrix[offset + size - 1][offset + size - 1 - i];

    // Bottom gets Left
    this.matrix[offset + size - 1][offset + size - 1 - i] = this.matrix[offset + size - 1 - i][offset];

    // Left gets Top
    this.matrix[offset + size - 1 - i][offset] = temp;
  };
  this.rLeftRecurse(size - 2);
};

Block.prototype.rotateRight = function() {
  if (!this.locked) {
    var temp = this.width;
    this.width = this.height;
    this.height = this.width;

    this.rRightRecurse(this.MATRIX_SIZE);
  };
};

Block.prototype.rRightRecurse = function(size) {
  if (size < 2) return;

  var temp;
  var offset = (this.MATRIX_SIZE - size) / 2;
  for (var i = 0; i < size - 1; ++i) {
    // Store Top
    temp = this.matrix[offset][offset + i];

    // Top get Left  
    this.matrix[offset][offset + i] = this.matrix[offset + size - 1 - i][offset];

    // Left gets Bottom
    this.matrix[offset + size - 1 - i][offset] = this.matrix[offset + size - 1][offset + size - 1 - i];

    // Bottom gets Right
    this.matrix[offset + size - 1][offset + size - 1 - i] = this.matrix[offset + i][offset + size - 1];

    // Right gets Top
    this.matrix[offset + i][offset + size - 1] = temp;
  };
  this.rRightRecurse(size - 2);
};

/* . x . . 
 * . x . . 
 * . x . . 
 * . x . . 
 */
function LineBlock() {
  Block.call(this);

  this.x = 1;
  this.color = 1;

  this.height = 4;
  this.width = 1;
  this.matrix[0][1] = this.color;
  this.matrix[1][1] = this.color;
  this.matrix[2][1] = this.color;
  this.matrix[3][1] = this.color;
}

LineBlock.prototype = new Block();
LineBlock.prototype.constructor = LineBlock;

/* . x x . 
 * . x x . 
 * . . . . 
 * . . . . 
 */
function SquareBlock() {
  Block.call(this);

  this.x = 1;
  this.color = 1;

  this.height = 2;
  this.width = 2;
  this.matrix[0][1] = this.color;
  this.matrix[0][2] = this.color;
  this.matrix[1][1] = this.color;
  this.matrix[1][2] = this.color;
}

SquareBlock.prototype = new Block();
SquareBlock.prototype.constructor = SquareBlock;

SquareBlock.prototype.rotateRight = function() { /* Do Nothing! No rotations for SquareBlock */ };
SquareBlock.prototype.rotateLeft = function() { /* Do Nothing! No rotations for SquareBlock */ };