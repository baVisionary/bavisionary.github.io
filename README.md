# tic-tac-toe-whoa

Started in CoderCamps as random daily challenge to build interactive Tic-Tac-Toe board using HTML5 & CSS3

Realized that the HTML classes that would enable drawing the board could also be used to track the state of the game. 

My idea for styling the board that works for any size board:
* each cell has a row "rX" class:
  * top row is always "r1"
  * to allow for different size boards add a class for "rLast"
* each cell has a column "cX" class:
  * leftmost column is always "c1"
  * add "cLast" to label last column

While considering the win conditions of the game, I realized any size board is defined by win possibilities:
* All wins require filling in a line with the same mark (number = size of board)
* Every cell in any row
* Every cell in any column
* Diagonal 1 "/"
* Diagonal 2 "\"

For any size board, the number of ways to win = 2 * size + 2 so it grows linearly.

Once the board was built & styled using the cell classes, a little Javascript with jQuery identified the target classes.
As the players click the cells, a "marked" class is added and a single array of possible wins is updated.
I also track the number of turns and alternate through the mark added to the cell.

Winning is easily identified when any win possibility for a single player reached the size of the board.
Once the program worked I improved the UI for adjusting the board size and changing the default marks.
Since larger board sizes make it hard to see which mark is next, I added an inidicator.
Another annoying aspect of playing on large boards is when winning is no longer possible before the game is over.
Added a test for whether a win is possible by checking the win array for any line that is unplayed by one player.
Created more CSS to draw a line "through" the winning marks and integrated the game status into the UI.
Lastly, I wanted to enable undoing a move to explore other outcomes. During the game, each move is pushed into an array.
Good luck finding the secret place to click to undo the last move (even if the game is over)!

Enjoy my pretty simple version of Tic-Tac-Toe with boards from 3x3 to 7x7 using custom marks!

Davin Nathanson
