/* 
 * Base class for all tetris blocks
 */
function Block(id) {
  this.y = 0;
  this.leftLocked = false;
  this.rightLocked = false;
  this.downLocked = false;
  this.colour = 0;
  this.id = (typeof id === "undefined")? 0 : id;
 
  this.MATRIX_SIZE = 4;
  this.matrix = create2DArray(this.MATRIX_SIZE, this.MATRIX_SIZE);
  this.lDistance = setAll([], this.MATRIX_SIZE, 0);
  this.rDistance = setAll([], this.MATRIX_SIZE, 0);
  this.dDistance = setAll([], this.MATRIX_SIZE, 0);
};

Block.prototype.rotateLeft = function() {
  this.rLeftRecurse(this.MATRIX_SIZE);
  this.updateDistance();
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
  this.rRightRecurse(this.MATRIX_SIZE);
  this.updateDistance();
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

Block.prototype.updateDistance = function() {
  setAll(this.dDistance, this.dDistance.length, 0);
  for (var r = this.MATRIX_SIZE - 1; r >= 0; --r) {
    for (var c = 0; c < this.MATRIX_SIZE; ++c) {
      if (this.dDistance[c] == 0 && this.matrix[r][c] != 0) this.dDistance[c] = r + 1;
    };
  };

  setAll(this.rDistance, this.rDistance.length, 0);
  for (var c = this.MATRIX_SIZE - 1; c >= 0; --c) {
    for (var r = 0; r < this.MATRIX_SIZE; ++r) {
      if (this.rDistance[r] == 0 && this.matrix[r][c] != 0) this.rDistance[r] = c + 1;
    };
  };

  setAll(this.lDistance, this.lDistance.length, 0);
  for (var c = 0; c < this.MATRIX_SIZE; ++c) {
    for (var r = 0; r < this.MATRIX_SIZE; ++r) {
      if (this.lDistance[r] == 0 && this.matrix[r][c] != 0) this.lDistance[r] = this.MATRIX_SIZE - c;
    };
  };
};

/* . . . . 
 * x x x x 
 * . . . . 
 * . . . . 
 */
function LineBlock(id) {
  Block.call(this, id);

  this.y = -2;
  this.colour = 1;

  this.matrix[1][0] = this.colour;
  this.matrix[1][1] = this.colour;
  this.matrix[1][2] = this.colour;
  this.matrix[1][3] = this.colour;
  this.updateDistance();
};

LineBlock.prototype = new Block();
LineBlock.prototype.constructor = LineBlock;

/* . . . . 
 * . x x . 
 * . x x . 
 * . . . . 
 */
function SquareBlock(id) {
  Block.call(this, id);

  this.y = -3;
  this.colour = 2;

  this.matrix[1][1] = this.colour;
  this.matrix[1][2] = this.colour;
  this.matrix[2][1] = this.colour;
  this.matrix[2][2] = this.colour;
  this.updateDistance();
};

SquareBlock.prototype = new Block();
SquareBlock.prototype.constructor = SquareBlock;

SquareBlock.prototype.rotateRight = function() { /* Do Nothing! No rotations for SquareBlock */ };
SquareBlock.prototype.rotateLeft = function() { /* Do Nothing! No rotations for SquareBlock */ };

/* . . x . 
 * . . x . 
 * . x x . 
 * . . . . 
 */
function LeftHookBlock(id) {
  Block.call(this, id);

  this.y = -3;
  this.colour = 3;

  this.matrix[0][2] = this.colour;
  this.matrix[1][2] = this.colour;
  this.matrix[2][1] = this.colour;
  this.matrix[2][2] = this.colour;
  this.updateDistance();
};

LeftHookBlock.prototype = new Block();
LeftHookBlock.prototype.constructor = LeftHookBlock;

/* . x . . 
 * . x . . 
 * . x x . 
 * . . . . 
 */
function RightHookBlock(id) {
  Block.call(this, id);

  this.y = -3;
  this.colour = 4;

  this.matrix[0][1] = this.colour;
  this.matrix[1][1] = this.colour;
  this.matrix[2][1] = this.colour;
  this.matrix[2][2] = this.colour;
  this.updateDistance();
};

RightHookBlock.prototype = new Block();
RightHookBlock.prototype.constructor = RightHookBlock;

/* . x . . 
 * . x x . 
 * . x . . 
 * . . . . 
 */
function ArrowBlock(id) {
  Block.call(this, id);

  this.y = -3;
  this.colour = 5;

  this.matrix[0][1] = this.colour;
  this.matrix[1][1] = this.colour;
  this.matrix[1][2] = this.colour;
  this.matrix[2][1] = this.colour;
  this.updateDistance();
};

ArrowBlock.prototype = new Block();
ArrowBlock.prototype.constructor = ArrowBlock;

/* . x . . 
 * . x x . 
 * . . x . 
 * . . . . 
 */
function LeftBoltBlock(id) {
  Block.call(this, id);

  this.y = -3;
  this.colour = 6;

  this.matrix[0][1] = this.colour;
  this.matrix[1][1] = this.colour;
  this.matrix[1][2] = this.colour;
  this.matrix[2][2] = this.colour;
  this.updateDistance();
};

LeftBoltBlock.prototype = new Block();
LeftBoltBlock.prototype.constructor = LeftBoltBlock;

/* . . x . 
 * . x x . 
 * . x . . 
 * . . . . 
 */
function RightBoltBlock(id) {
  Block.call(this, id);

  this.y = -3;
  this.colour = 7;

  this.matrix[0][2] = this.colour;
  this.matrix[1][1] = this.colour;
  this.matrix[1][2] = this.colour;
  this.matrix[2][1] = this.colour;
  this.updateDistance();
};

RightBoltBlock.prototype = new Block();
RightBoltBlock.prototype.constructor = RightBoltBlock;

/* . x . .
 * x x x .
 * . x . .
 * . . . .
 */
function CrossBlock(id) {
  Block.call(this, id);

  this.y = -3;
  this.colour = 8;

  this.matrix[0][1] = this.colour;
  this.matrix[1][0] = this.colour;
  this.matrix[1][1] = this.colour;
  this.matrix[1][2] = this.colour;
  this.matrix[2][1] = this.colour;
  this.updateDistance();
};

CrossBlock.prototype = new Block();
CrossBlock.prototype.constructor = CrossBlock;

CrossBlock.prototype.rotateRight = function() { /* Do Nothing! No rotations for CrossBlock */ };
CrossBlock.prototype.rotateLeft = function() { /* Do Nothing! No rotations for CrossBlock */ };

/* x . . .
 * x x x .
 * . . x .
 * . . . .
 */
function LargeLeftBoltBlock(id) {
  Block.call(this, id);

  this.y = -3;
  this.colour = 9;

  this.matrix[0][0] = this.colour;
  this.matrix[1][0] = this.colour;
  this.matrix[1][1] = this.colour;
  this.matrix[1][2] = this.colour;
  this.matrix[2][2] = this.colour;
  this.updateDistance();
};

LargeLeftBoltBlock.prototype = new Block();
LargeLeftBoltBlock.prototype.constructor = LargeLeftBoltBlock;

/* . . . x
 * . x x x
 * . x . .
 * . . . .
 */
function LargeRightBoltBlock(id) {
  Block.call(this, id);

  this.y = -3;
  this.colour = 10;

  this.matrix[0][3] = this.colour;
  this.matrix[1][1] = this.colour;
  this.matrix[1][2] = this.colour;
  this.matrix[1][3] = this.colour;
  this.matrix[2][1] = this.colour;
  this.updateDistance();
};

LargeRightBoltBlock.prototype = new Block();
LargeRightBoltBlock.prototype.constructor = LargeRightBoltBlock;

/* . . x .
 * . . x x
 * . x x .
 * . . . .
 */
function LeftHookArrowBlock(id) {
  Block.call(this, id);

  this.y = -3;
  this.colour = 11;

  this.matrix[0][2] = this.colour;
  this.matrix[1][2] = this.colour;
  this.matrix[1][3] = this.colour;
  this.matrix[2][1] = this.colour;
  this.matrix[2][2] = this.colour;
  this.updateDistance();
};

LeftHookArrowBlock.prototype = new Block();
LeftHookArrowBlock.prototype.constructor = LeftHookArrowBlock;

/* . x . .
 * x x . .
 * . x x .
 * . . . .
 */
function RightHookArrowBlock(id) {
  Block.call(this, id);

  this.y = -3;
  this.colour = 12;

  this.matrix[0][1] = this.colour;
  this.matrix[1][0] = this.colour;
  this.matrix[1][1] = this.colour;
  this.matrix[2][1] = this.colour;
  this.matrix[2][2] = this.colour;
  this.updateDistance();
};

RightHookArrowBlock.prototype = new Block();
RightHookArrowBlock.prototype.constructor = RightHookArrowBlock;

/* . . . .
 * x x x x
 * . x . .
 * . . . .
 */
function LeftTonfaBlock(id) {
  Block.call(this, id);

  this.y = -3;
  this.colour = 13;

  this.matrix[1][0] = this.colour;
  this.matrix[1][1] = this.colour;
  this.matrix[1][2] = this.colour;
  this.matrix[1][3] = this.colour;
  this.matrix[2][1] = this.colour;
  this.updateDistance();
};

LeftTonfaBlock.prototype = new Block();
LeftTonfaBlock.prototype.constructor = LeftTonfaBlock;

/* . . . .
 * x x x x
 * . . x .
 * . . . .
 */
function RightTonfaBlock(id) {
  Block.call(this, id);

  this.y = -3;
  this.colour = 14;

  this.matrix[1][0] = this.colour;
  this.matrix[1][1] = this.colour;
  this.matrix[1][2] = this.colour;
  this.matrix[1][3] = this.colour;
  this.matrix[2][2] = this.colour;
  this.updateDistance();
};

RightTonfaBlock.prototype = new Block();
RightTonfaBlock.prototype.constructor = RightTonfaBlock;