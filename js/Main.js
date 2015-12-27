var Main = function() {
  var frame = new CanvasFrame();
  frame.init();

  $("button").click(function() {executeButtonAction(this, frame)});

  $(".level-button").on({mouseenter: peripherals.markActive,
                         mouseleave: peripherals.markInactive,
                         click:      function() {peripherals.updateLevel(this, frame)}});

  $("body").bind("keydown", function(event) {
    parseInput(event, frame);
  });
};

function parseInput(event, frame) {
  var key = event.keyCode;
  switch(key) {
    case 37:
      //Left Arrow
      event.preventDefault();
      frame.moveLeft();
      break;
    case 38:
      //Up Arrow
      event.preventDefault();
      frame.instantDrop();
      break;
    case 39:
      //Right Arrow
      event.preventDefault();
      frame.moveRight();
      break;
    case 40:
      //Down Arrow
      event.preventDefault();
      frame.moveDown();
      break;
    case 188:
      // ','
      event.preventDefault();
      frame.rotateLeft();
      break;
    case 190:
      // '.'
      event.preventDefault();
      frame.rotateRight();
      break;
    default:
      //Nothing!
  };
};

function executeButtonAction(button, frame) {
  switch($(button).attr("id")) {
    case "new-game":
      frame.newGame();
      break;
    case "stop":
      frame.stopGame();
      break;
    default:
      alert("Button action not yet implemented");
  };
};

var peripherals = {
  markInactive: function() {
    if ($(this).hasClass("level-button")) $(this).fadeTo(100, 0.3);
  },

  markActive: function() {
    if ($(this).hasClass("level-button")) $(this).fadeTo(100, 1);
  },

  updateLevel: function(levelButton, frame) {
    if ($(levelButton).is("#increase-level")) {
      if(frame.game.level < 10) {
        ++frame.game.level;
        frame.game.calculateNextScore();
      };
    } else if ($(levelButton).is("#decrease-level")) {
      if(frame.game.level > 1) {
        --frame.game.level;
        frame.game.calculateNextScore();
      };
    };
  }
};

$(document).ready(Main);
