var Main = function() {
  var frame = new CanvasFrame();
  frame.init();

  $("#get-size").click(function() {
    frame.getSize();
  });
  $("#draw").click(function() {
    frame.draw(frame.blockWidth);
  });
  $("#clear").click(function() {
    frame.stopGame();
  });
  $("#new-game").click(function() {
    frame.newGame();
  });  
  $("#test-rotate-left").click(function() {
    frame.rotateLeft();
  });
  $("#test-rotate-right").click(function() {
    frame.rotateRight();
  });
  $("#test-instant-drop").click(function() {
    frame.instantDrop();
  });

  $("body").bind("keydown", function(event) {
    event.preventDefault();
    parseInput(event.keyCode, frame);
  });
};

function parseInput(key, frame) {
  switch(key) {
    case 37:
      //Left Arrow
      frame.moveLeft();
      break;
    case 38:
      //Up Arrow
      frame.instantDrop();
      break;
    case 39:
      //Right Arrow
      frame.moveRight();
      break;
    case 40:
      //Down Arrow
      frame.moveDown();
      break;
    case 188:
      // ','
      frame.rotateLeft();
      break;
    case 190:
      // '.'
      frame.rotateRight();
      break;
    default:
      //Nothing!
  };
};

$(document).ready(Main);
