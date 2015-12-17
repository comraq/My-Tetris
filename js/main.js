var main = function() {
  var frame = new Frame();
  frame.init();
  frame.setColours();

  $("#get-size").click(function() {
    frame.getSize();
  });
  $("#draw").click(function() {
    frame.draw();
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

};

$(document).ready(main);
