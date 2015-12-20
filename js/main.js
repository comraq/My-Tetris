var main = function() {
  var frame = new Frame();
  frame.init();

  $("#get-size").click(function() {
    frame.getSize();
  });
  $("#draw").click(function() {
    frame.draw(frame.blockWidth);
  });
  $("#clear").click(function() {
    cancelAnimationFrame(frame.stopAuto);
    frame.clearAll();
  });
  $("#new-game").click(function() {
    frame.newGame();
  });  
  $("#test-rotate-left").click(function() {
    frame.currentBlock.rotateLeft();
  });
  $("#test-rotate-right").click(function() {
    frame.currentBlock.rotateRight();
  });
  $("#test-instant-drop").click(function() {
    frame.instantDrop();
  });

  $("body").bind("keydown", function(event) {
    parseInput(event.keyCode, frame);
  });
};

function parseInput(key, frame) {
  switch(key) {
    case 37:
      //Left Arrow
      break;
    case 38: //Up Arrow
      frame.instantDrop();
      break;
    case 39:
      //Right Arrow
      break;
    case 40:
      //Down Arrow
      break;
    case 188: // ','
      frame.rotateLeft();
      break;
    case 190: // '.'
      frame.rotateRight();
      break;
    default:
      //Nothing!
  };
};

$(document).ready(main);
