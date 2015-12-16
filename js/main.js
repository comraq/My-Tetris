var main = function() {
  var frame = new Frame();
  frame.init();
  frame.setColours();
  $("#test-button").click(function() {frame.getSize()});
  $("#test-button-2").click(function() {frame.draw()});
};

$(document).ready(main);
