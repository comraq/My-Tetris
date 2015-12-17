var main = function() {
  var frame = new Frame();
  frame.init();
  frame.setColours();

  $("#get-size").click(function() {
    frame.getSize();
  });
  $("#draw").click(function() {
    frame.draw(frame.blockWidth);
  });
  $("#clear").click(function() {
    frame.clear();
    frame.reset();
  });
  $("#auto-draw").click(function() {
    frame.autoDraw(frame);
  });  
  $("#stop-auto").click(function() {
    cancelAnimationFrame(frame.stopAuto);
  });

  $("#draw-line").click(function() {
    frame.drawBlock(new LineBlock());
  });  
  $("#test-rotate-left").click(function() {
    frame.currentBlock.rotateLeft();
    frame.clear();
    frame.drawBlock(frame.currentBlock);
  });
  $("#test-rotate-right").click(function() {
    frame.currentBlock.rotateRight();
    frame.clear();
    frame.drawBlock(frame.currentBlock);
  });
};

$(document).ready(main);
