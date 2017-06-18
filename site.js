function makeBoard(size) {
  /*
  // get gameboard height and recalculate box percentages
  /*
  let height = $('#newBoard').height();
  let fontHeight = 0.8 * height / size;
  let fontpx = fontHeight + "px";
  let percent = 100/size + "%";
  */

  // using .remove on previous board HTML
  $('#newBoard').children().remove();

  // using .append $('element') to create gameBoard
  var $cell = {},
    $gameBoard = {};
  for (let r = 1; r <= size; r++) {
    for (let c = 1; c <= size; c++) {
      let classes = ['game-cell', 'box' + size, 'r' + r, 'c' + c].join(' ');
      $cell = $('<div/>').addClass(classes);
      if (r === c) {
        $cell.addClass('d1');
      }
      if (r === size + 1 - c) {
        $cell.addClass('d2');
      }
      if (r === size) {
        $cell.addClass('rLast');
      }
      if (c === size) {
        $cell.addClass('cLast');
      }
      $cell.append($('<span/>'));
      $cell.children('span').html('&nbsp;');
      $('#newBoard').append($($cell));
    }
  }
}

// based on the size of the board label winning in-a-rows
/*
function pushWinArray(size) {
  winArray = [];
  let possWins = [];
  for (let i = 0; i < (2 * size + 2); i++) {
    possWins.push(0);
  }
  console.log(possWins.join(", "));
  console.log(winArray.join(", "));
  for (let i = 0; i < 3; i++) {
    winArray.push(possWins);
  }
  for (let i = 1; i <= size; i++) {
    winArray[2][i - 1] = 'r' + i;
    winArray[2][i - 1 + size] = 'c' + i;
  }
  winArray[2][2 * size] = 'd1';
  winArray[2][2 * size + 1] = 'd2';
  console.log(winArray.join(", "));
}
*/

function makeWinArray(size) {
  winArray = [
    [],
    [],
    [],
    []
  ];
  for (let i = 0; i < (2 * size + 2); i++) {
    winArray[0][i] = 0;
    winArray[1][i] = 0;

    winArray[2][i] = (i < size) ? `r${i + 1}` : `c${i - size + 1}`;
    winArray[3][i] = (i < size) ? 'winRow' : 'winCol';
  }
  winArray[2][2 * size] = 'd1';
  winArray[2][2 * size + 1] = 'd2';
  winArray[3][2 * size] = 'winDiag1';
  winArray[3][2 * size + 1] = 'winDiag2';

  console.log(winArray);
}

// distill Row, Col, Diag1, Diag2 from cell
function makeMoveArr(cell) {
  let classes = $(cell)[0].classList;
  // console.log(classes);
  let possArrWins = [];
  for (let i = 0; i < (size * 2 + 2); i++) {
    possArrWins.push(0);
  }
  possArrWins[parseInt(classes[2][1]) - 1] = 1;
  possArrWins[size + parseInt(classes[3][1]) - 1] = 1;
  if (classes.length > 4 && classes[4][0] == 'd') {
    possArrWins[size * 2 + parseInt(classes[4][1]) - 1] = 1;
  }
  if (classes.length > 5 && classes[5][0] == 'd') {
    possArrWins[size * 2 + parseInt(classes[5][1]) - 1] = 1;
  }
  // console.log(possArrWins);
  moves.push(possArrWins);
  console.log(moves);

  return possArrWins;
}

// based on mark update win array
function updateWinArray(player, cellArrWins) {
  let index = 0;
  let maxWins = 0;
  for (var i = 0; i < winArray[0].length; i++) {
    maxWins = incTest(player, cellArrWins, i);
    if (maxWins === size) {
      index = i;
      gameOver = true;
      console.log(`maxWins: ${maxWins} index: ${index}`);
      $(`.${winArray[2][index]}`).addClass(winArray[3][index]);
    };
  }

  // incTest(player, cellWins[0] - 1);
  // maxWins = Math.max(incTest(player, size + cellWins[1] - 1));
  // if (maxWins === size) {
  //   index = size + cellWins[1] - 1
  // };
  // if (cellWins.length > 2) {
  //   maxWins = Math.max(maxWins, incTest(player, 2 * size + cellWins[2] - 1));
  //   if (maxWins === size) {
  //     index = 2 * size + cellWins[2] - 1
  //   };
  // }
  // if (cellWins.length > 3) {
  //   maxWins = Math.max(maxWins, incTest(player, 2 * size + cellWins[3] - 1));
  //   if (maxWins === size) {
  //     index = 2 * size + cellWins[3] - 1
  //   };
  // }


  console.log(`${symbols[0]}: [${winArray[0]}]`);
  console.log(`${symbols[1]}: [${winArray[1]}]`);
  // console.log(`class: [${winArray[2]}]`);
  // console.log(`winLine: [${winArray[3]}]`);

  isWinPossible();
}

// increment the winArray tallies & check if someone won
function incTest(player, cellArr, index) {
  return winArray[player][index] += cellArr[index];
}

// decrement the winArray tallies for undo
function decTest(player, cellArr, index) {
  return winArray[player][index] -= cellArr[index];
}

// add method to rollback last move
function undoLastMove(player, lastMove) {
  // TODO remove win/tie results then deduct last move from winArray
  var cellRow = "",
    cellCol = "";

  for (let i = 0; i < lastMove.length; i++) {
    decTest(player, lastMove, i);
    if (lastMove[i] == 1) {
      if (i < size) {
        cellRow = `r${i+1}`
      };
      if (i < 2 * size) {
        cellCol = `c${i-size+1}`
      };
    }
  }
  console.log(`lastMove at ${cellRow} ${cellCol}`);

  let $cells = $('.game-cell ');
  for (let i = 0; i < $cells.length; i++) {
    $($cells[i])
      .removeClass('winRow winCol winDiag1 winDiag2');
    if ($($cells[i]).hasClass(cellRow) && $($cells[i]).hasClass(cellCol)) {
      $($cells[i]).removeClass('marked').children('span').html('&nbsp;');
    }
  }
  moves.length = moves.length - 1;
  gameOver = false;
  console.log(symbols[turn % 2] + ': ' + moves[turn]);
  showOutcome(symbols[turn % 2], 'Playing')
  isWinPossible();
}

// test to see if it is still possible to win
// if both players already played in every poss win in-a-row
function isWinPossible() {
  let winPoss = [],
    winPossTest = false;
  for (let i = 0; i < winArray[0].length; i++) {
    winPoss.push(!((winArray[0][i] > 0) && (winArray[1][i] > 0)));
    winPossTest = winPossTest || winPoss[winPoss.length - 1];
  }
  console.log(`winPoss: [${winPoss}]? ${winPossTest}`);

  if (!winPossTest) {
    $('#info').text('Tie Game');
  }
}

// display game over results
function showOutcome(symbol, message) {
  $('#info').text(message);
  $('#big-symbol').text(symbol);
}

// live code
var size = 3;
var symbols = ['', ''];
var winArray = [];
var turn = 0,
  moves = [];
var gameOver = false,
  winPossible = true;

// show mark in a cell after checking if it is open
$(document).on('click', '.game-cell', function (e) {
  // console.log($(this));
  if (!$(this).hasClass('marked') && !gameOver) {
    $(this).addClass('marked').children('span').text(symbols[turn % 2]);
    updateWinArray(turn % 2, makeMoveArr($(this)));
    if (gameOver) {
      showOutcome(symbols[turn % 2], 'Wins!');
    } else if (turn === size * size - 1) {
      gameOver = true;
      showOutcome('Tie', 'No Winner');
    } else {
      turn++;
      $('#big-symbol').text(symbols[turn % 2]);
    }
  }
})

// apply the size & symbols in the form to create a new board
$('#setup').on('submit', function (e) {
  e.preventDefault();
  size = parseInt($('#boardSize').val());
  symbols[0] = $('#symbol0').val();
  symbols[1] = $('#symbol1').val();
  if (symbols[0] !== symbols[1]) {
    makeBoard(size);
    makeWinArray(size);
    gameOver = false;
    turn = 0, moves = [];
    $('#big-symbol').text(symbols[turn % 2]).parent('div');
    $('#info').text('Playing');
  } else {
    alert('Use different symbols for each player');
  }
})

// on document load create a default 3x3 board using X & O
$(function () {
  $('#setup').trigger('submit');
});

// secret undo button triggered by clicking symbol
$(document).on('click', '.prettydiv', function () {
  if (turn > 0) {
    if (!gameOver) { turn--; };
    console.log(moves[turn]);
    undoLastMove(turn % 2, moves[turn]);
  }
})