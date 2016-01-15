var Main = function() {
  var frame = new CanvasFrame();
  frame.init();

  $(".tetris-button").click(function() {executeButtonAction(this, frame)});

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
    case 16: //Shift
      event.preventDefault();
      frame.holdBlock();
      break;

    case 32: //Spacebar
      event.preventDefault();
      frame.pauseResumeGame();
      break;

    case 37: //Left Arrow
      event.preventDefault();
      frame.moveLeft();
      break;

    case 38: //Up Arrow
      event.preventDefault();
      frame.instantDrop();
      break;

    case 39: //Right Arrow
      event.preventDefault();
      frame.moveRight();
      break;

    case 40: //Down Arrow
      event.preventDefault();
      frame.moveDown();
      break;

    case 90: //Z Key
    case 188: //, Key
      event.preventDefault();
      frame.rotateLeft();
      break;

    case 88: //X Key  
    case 190: //. Key
      event.preventDefault();
      frame.rotateRight();
      break;

    case 78: //N Key
      event.preventDefault();
      frame.newGame();
      break;
    
    case 81: //Q Key
      event.preventDefault();
      frame.stopGame();
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
    case "pause-resume":
      frame.pauseResumeGame();
      break;
    default:
      //Nothing
  };
};

function showGameState(obj, id) {
  var $text = $("#" + id);
  $text.fadeTo(0, 0.7);
  $text.stop();
  if ((obj instanceof CanvasFrame) && (obj.gameState == obj.GameStateEnum.PLAYING)) {
    $text.fadeTo(3000, 0)
  } else if (obj instanceof Game) {
    $text.removeClass("rainbow");
    if ($text.text() == obj.ClearTextEnum[4]) {
      $text.addClass("rainbow");
      $text.fadeTo(3000, 0);
    } else {
      $text.fadeTo(2000, 0);
    };
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
    if (frame.gameState != frame.GameStateEnum.STOPPED) {
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
      document.getElementById("level-check").checked = true;
      frame.updatePeripherals();
    };
  }
};

$(document).ready(Main);
