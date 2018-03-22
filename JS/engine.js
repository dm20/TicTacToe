/* *********************************/
/* CHANGE THE STARTING MARKER STYLE
/*      .__.               
/*      |  |               
/*      |  |    
/*   .__|  |__.              
/*    \      /
/*     \    /
/*      \  /
/*       \/
*/

var markerStyle = "exxe";
/* var markerStyle = "circle"; */

var gameOver = false;

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var newGame = document.getElementById("newGame");
document.body.append(newGame);
newGame.style.position = "absolute";

/* document.body.style.backgroundColor = '#EAEAEA'; */

var grid = [
  ["empty", "empty", "empty"],
  ["empty", "empty", "empty"],
  ["empty", "empty", "empty"]
];

var frameX = 65;
var frameY = 5;
var frameWidth = 250;
var frameHeight = 250;
var gridDivisionWidth = frameWidth / 3;
var gridDivisionHeight = frameWidth / 3;
var dx = 42;
var dy = 42;

document.onclick = function(e) {
  drawSymbol(e, markerStyle);
};

newGame.onclick = function() {
  resetGame();
  resetGame();
}

var drawSymbol = function(e, markerStyle) {
  coord1 = normalizeCoord(e.clientX - 70);
  coord2 = normalizeCoord(e.clientY - 70);
  if (!gameOver && openSpacesRemain) {
    if (grid[coord1][coord2] == "empty") {
      if (markerStyle == 'circle') {
        grid[coord1][coord2] = "circle";
        player1.moves.push([coord1, coord2]);
        drawCircle(coord1, coord2);
        if (player1.checkMoves() == "win") {
          console.log("player 1 wins");
          gameOver = true;
        }
      } else if (markerStyle == "exxe") {
        player2.moves.push([coord1, coord2]);
        grid[coord1][coord2] = "exxe";
        drawX(coord1, coord2);
        if (player2.checkMoves() == "win") {
          console.log("player 2 wins");
          gameOver = true;
        }
      }
      switchMarker();
    }
  }
  if (player1.moves.length + player2.moves.length == 9) {
    sleep(2000);
    resetGame();
    resetGame();
  }
}

var drawCircle = function(coord1, coord2) {
  ctx.beginPath();
  ctx.arc(frameX + coord1 * (gridDivisionWidth) + (gridDivisionWidth / 2), frameY + coord2 * (gridDivisionHeight) + (gridDivisionHeight / 2), gridDivisionWidth / 3, 0, 2 * Math.PI);
  ctx.stroke();
}

var drawX = function(coord1, coord2) {
  var offset = 10;
  ctx.beginPath();
  ctx.moveTo(offset + frameX + coord1 * (gridDivisionWidth), frameY + coord2 * (gridDivisionHeight) + offset);
  ctx.lineTo(frameX + coord1 * (gridDivisionWidth) + 2 * dx - offset, frameY + coord2 * (gridDivisionHeight) + 2 * dy - offset);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(gridDivisionWidth + frameX + coord1 * (gridDivisionWidth) - offset, frameY + coord2 * (gridDivisionHeight) + offset);
  ctx.lineTo(offset + frameX + coord1 * (gridDivisionWidth), frameY + coord2 * (gridDivisionHeight) + 2 * dy - offset);
  ctx.stroke();
}

var openSpacesRemain = function() {
  var foundOne = false;
  for (var i = 0; !foundOne && i < grid[0].length; i += 1) {
    for (var j = 0; !foundOne && j < grid[0].length; j += 1) {
      foundOne = (grid[i][j] == "empty");
    }
  }
  return foundOne;
};

var resetGame = function() {
  ctx.clearRect(0, 0, 1000, 1000);
  grid = [
    ["empty", "empty", "empty"],
    ["empty", "empty", "empty"],
    ["empty", "empty", "empty"]
  ];
  player1.moves = [];
  player2.moves = [];
  gameOver = false;
  drawGrid();
}

class Actor {
  constructor(marker) {
    this.marker = marker;
    this.moves = [];
  }

  printMoves() {
    for (var i = 0; i < this.moves.length; i += 1) {
      console.log(this.moves[i]);
    }
  }

  checkMoves() {
    var diagLR = (hasElement(this.moves, [0, 0]) && hasElement(this.moves, [1, 1]) && hasElement(this.moves, [2, 2]));
    var diagRL = (hasElement(this.moves, [2, 0]) && hasElement(this.moves, [1, 1]) && hasElement(this.moves, [0, 2]));
    if (diagLR) {
      drawWinIndicator("LR");
      return "win";
    } else if (diagRL) {
      drawWinIndicator("RL");
      return "win";
    }

    var vert = true;
    for (var j = 0; j < grid[1].length; j += 1) {
      vert = hasElement(this.moves, [j, 0]) && hasElement(this.moves, [j, 1]) && hasElement(this.moves, [j, 2]);
      if (vert) {
        if (j == 0) {
          drawWinIndicator("LEFT_VERT")
        } else if (j == 1) {
          drawWinIndicator("MID_VERT")
        } else if (j == 2) {
          drawWinIndicator("RIGHT_VERT")
        }
        return "win"
      }
    }

    var horiz = true;
    for (var i = 0; i < grid[1].length; i += 1) {
      horiz = hasElement(this.moves, [0, i]) && hasElement(this.moves, [1, i]) && hasElement(this.moves, [2, i]);
      if (horiz) {
        if (i == 0) {
          drawWinIndicator("TOP_HORIZ")
        } else if (i == 1) {
          drawWinIndicator("MID_HORIZ")
        } else if (i == 2) {
          drawWinIndicator("BOTTOM_HORIZ")
        }
        return "win";
      }
    }
  }
}

var player1 = new Actor("circle");
var player2 = new Actor("exxe");

var hasElement = function(array, subArray) {
  var foundElement = false;
  for (var i = 0; !foundElement && i < array.length; i += 1) {
    foundElement = array[i][0] == subArray[0] && array[i][1] == subArray[1];
  }
  return foundElement;
}

var drawGrid = function() {
  ctx.strokeStyle = "#000000";
  var c = document.createElement("SVG");
  ctx.rect(frameX, frameY, frameWidth, frameHeight);
  ctx.stroke()
  ctx.beginPath();
  ctx.moveTo(frameX + frameWidth * (1 / 3), frameY);
  ctx.lineTo(frameX + frameWidth * (1 / 3), frameY + frameHeight);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(frameX + 2 * frameWidth * (1 / 3), frameY);
  ctx.lineTo(frameX + 2 * frameWidth * (1 / 3), frameY + frameHeight);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(frameX, frameY + frameHeight * (1 / 3));
  ctx.lineTo(frameX + frameWidth, frameY + frameWidth * (1 / 3));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(frameX, frameY + 2 * frameHeight * (1 / 3));
  ctx.lineTo(frameX + frameWidth, frameY + 2 * frameWidth * (1 / 3));
  ctx.stroke();
  document.body.appendChild(c);
}

var drawWinIndicator = async function(kind) {
  if (kind == "TOP_HORIZ") {
    ctx.strokeStyle = "#FF0000";
    ctx.beginPath();
    ctx.moveTo(frameX, frameY + gridDivisionWidth / 2);
    ctx.lineTo(frameX + gridDivisionWidth * 3, frameY + gridDivisionWidth / 2);
    ctx.stroke();
  }

  if (kind == "MID_HORIZ") {
    ctx.strokeStyle = "#FF0000";
    ctx.beginPath();
    ctx.moveTo(frameX, frameY + gridDivisionHeight / 2 + gridDivisionHeight);
    ctx.lineTo(frameX + gridDivisionWidth * 3, frameY + gridDivisionWidth / 2 + +gridDivisionHeight);
    ctx.stroke();
  }

  if (kind == "BOTTOM_HORIZ") {
    ctx.strokeStyle = "#FF0000";
    ctx.beginPath();
    ctx.moveTo(frameX, frameY + gridDivisionHeight / 2 + gridDivisionHeight * 2);
    ctx.lineTo(frameX + gridDivisionWidth * 3, frameY + gridDivisionWidth / 2 + +gridDivisionHeight * 2);
    ctx.stroke();
  }

  if (kind == "LEFT_VERT") {
    ctx.strokeStyle = "#FF0000";
    ctx.beginPath();
    ctx.moveTo(frameX + gridDivisionWidth / 2, frameY);
    ctx.lineTo(frameX + gridDivisionWidth / 2, frameY + frameHeight);
    ctx.stroke();
  }

  if (kind == "MID_VERT") {
    ctx.strokeStyle = "#FF0000";
    ctx.beginPath();
    ctx.moveTo(frameX + gridDivisionWidth / 2 + gridDivisionWidth, frameY);
    ctx.lineTo(frameX + gridDivisionWidth / 2 + gridDivisionWidth, frameY + frameHeight);
    ctx.stroke();
  }

  if (kind == "RIGHT_VERT") {
    ctx.strokeStyle = "#FF0000";
    ctx.beginPath();
    ctx.moveTo(frameX + gridDivisionWidth / 2 + gridDivisionWidth * 2, frameY);
    ctx.lineTo(frameX + gridDivisionWidth / 2 + gridDivisionWidth * 2, frameY + frameHeight);
    ctx.stroke();
  }

  if (kind == "LR") {
    ctx.strokeStyle = "#FF0000";
    ctx.beginPath();
    ctx.moveTo(frameX, frameY);
    ctx.lineTo(frameX + gridDivisionWidth * 3, frameY + gridDivisionHeight * 3);
    ctx.stroke();
  }

  if (kind == "RL") {
    ctx.strokeStyle = "#FF0000";
    ctx.beginPath();
    ctx.moveTo(frameX + gridDivisionWidth * 3, frameY);
    ctx.lineTo(frameX, frameY + gridDivisionHeight * 3);
    ctx.stroke();
  }
  await sleep(1000);
  resetGame();
  resetGame();
}

var sleep = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function switchMarker() {
  if (markerStyle == "circle") {
    markerStyle = "exxe";
  } else {
    markerStyle = "circle";
  }
}


var printGrid = function() {
  for (var i = 1; i < 3; i += 1) {
    console.log(grid[0][i] + " " + grid[1][i] + " " + grid[2][i]);
  }
}

var normalizeCoord = function(val) {
  var relPos = Math.floor(val / gridDivisionWidth);
  return relPos;
}

drawGrid();

/*     © Daniel McGrath 2018     */
