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
  /*$("#test-instant-drop").click(function() {
    frame.instantDrop();
  });*/
};

$(document).ready(main);
