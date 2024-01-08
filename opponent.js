// The base opponent object from which to inherit
function Opponent() {
    this.name = "Stupid";
}
// Create a prototype play function which returns a cell that the opponent
// wants to play in on the game board (i.e. 0 through 8)
Opponent.prototype.play = function(game_board, x, o, available) {
    // The default opponent is dumb, it just plays in the first available spot
    return available[0];
}

// ----------------------
// -- Custom Opponents --
// ----------------------

// Random Opponent will play in a random available spot on the game board
function RandomOpponent() {
    Opponent.call(this);
    this.name = "Random";
}
// Copy the base class prototyp, but keep the constructor
RandomOpponent.prototype = Object.create(Opponent.prototype);
RandomOpponent.prototype.constructor = RandomOpponent;
// Override the play function
RandomOpponent.prototype.play = function(game_board, x, o, available) {
    // Pick a random index for the available list
    var indexPick = Math.floor(Math.random() * available.length);
    // Pick a random cell index from the available list
    return available[indexPick];
}

// Smart opponent should behave intelligently (minimax algorithm)
function SmartOpponent() {
    Opponent.call(this);
    this.name = "Smartie";
}

// Setup constructor
SmartOpponent.prototype = Object.create(Opponent.prototype);
SmartOpponent.prototype.constructor = SmartOpponent;

// Helper functions (all static functions)
// Translate board from list of X + O positions to a 2d array
SmartOpponent.prototype.translate = (xList, oList) => {
    let board = [['', '', ''], ['', '', ''], ['', '', '']];
    
    for (var o of oList)
        board[Math.floor(o / 3)][o % 3] = 'O';
    for (var x of xList)
        board[Math.floor(x / 3)][x % 3] = 'X';

    return board;
}

// Return list of available positions based on board (takes in board instead of doing this.board because this needs to work for hypothetical moves; same reason this is different from the get_available func in main.js) 
SmartOpponent.prototype.getAvailable = (board) => {
    let available = [];

    for (let i = 0; i < 3; ++i)
        for (let j = 0; j < 3; ++j)
            if (board[i][j] == '')
                available.push([i, j]);

    return available;
}

// return true if board is full
SmartOpponent.prototype.isFull = (board) => SmartOpponent.prototype.getAvailable(board).length == 0;

// Checks the state of the game: T (tie), X (X wins), O (O wins), P (game in play)
SmartOpponent.prototype.gameState = (board) => {
    // Check rows
    if (board[0][0] != '' && board[0][0] == board[0][1] && board[0][1] == board[0][2])
        return board[0][0]; // Return winner ('X' or 'O')
    if (board[1][0] != '' && board[1][0] == board[1][1] && board[1][1] == board[1][2])
        return board[1][0];
    if (board[2][0] != '' && board[2][0] == board[2][1] && board[2][1] == board[2][2])
        return board[2][0];

    // Check columns
    if (board[0][0] != '' && board[0][0] == board[1][0] && board[1][0] == board[2][0])
        return board[0][0];
    if (board[0][1] != '' && board[0][1] == board[1][1] && board[1][1] == board[2][1])
        return board[0][1];
    if (board[0][2] != '' && board[0][2] == board[1][2] && board[1][2] == board[2][2])
        return board[0][2];

    // Check diag
    if (board[1][1] != '' && ((board[0][0] == board[1][1] && board[1][1] == board[2][2]) || (board[2][0] == board[1][1] && board[1][1] == board[0][2])))
        return board[1][1];

    // Check if board is full (_after_ checking for a win)
    if (SmartOpponent.prototype.isFull(board))
        return 'T'; // Tie
    
    return 'P'; // Game still in play
}

// Evaluate game state for minimax: 1 for a win; -1 for a loss; 0 for a tie
SmartOpponent.prototype.eval = (board) => {
    let state = SmartOpponent.prototype.gameState(board);
    return state == 'O' ? 1 : (state == 'X' ? -1 : 0);
}

// Minimax function to determine the best move
SmartOpponent.prototype.minimax = (board, player) => {
    // Return score if game has ended
    if (SmartOpponent.prototype.gameState(board) != 'P')
        return {score: SmartOpponent.prototype.eval(board)};

    // Get available moves and create a list which will represent the score for each
    let avail = SmartOpponent.prototype.getAvailable(board);
    let moves = [];

    // Loop through every move and calculate score
    for (var hmove of avail) { // hypothetical move
        // Make move
        board[hmove[0]][hmove[1]] = player;

        // Calculate score from minimax and push it to moves list
        moves.push({index: hmove, score: SmartOpponent.prototype.minimax(board, player == 'O' ? 'X' : 'O').score});
        
        // Get rid of move
        board[hmove[0]][hmove[1]] = '';
    }
    
    // Initialize bestmove to the first element
    let bestMove = {index: moves[0].index, score: moves[0].score};

    // loop through each move to find best
    for (var move of moves) {
        // Maximize score to make the best move for AI; minimize score to make the best move to player (we should play against the hypothetical best player)
        if ((player == 'O' && move.score > bestMove.score) || (player == 'X' && move.score < bestMove.score)) {
            bestMove.index = move.index; // I hate that javascript doesn't copy objects properly
            bestMove.score = move.score;
        }
    }

    // Return the best
    return bestMove;
}

// Override the play function
SmartOpponent.prototype.play = (game_board, x, o, available) => {
    // translate the board
    let board = SmartOpponent.prototype.translate(x, o);

    // pick an index based on minimax then translate it to 1d board and return it
    var indexPick = SmartOpponent.prototype.minimax(board, 'O').index;
    return indexPick[0] * 3 + indexPick[1];
}
