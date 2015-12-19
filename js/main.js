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
    frame.clear();
  });
  $("#draw-rand").click(function() {
    frame.generateBlock();
  });  
  $("#test-rotate-left").click(function() {
    frame.currentBlock.rotateLeft();
  });
  $("#test-rotate-right").click(function() {
    frame.currentBlock.rotateRight();
  });
};

$(document).ready(main);
