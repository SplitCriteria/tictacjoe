// A global flag which indicates if the game is over (someone won, or a tie)
var game_over = false;
// A list of all the available opponents for the user to pick from
var opponents = [new Opponent(), new RandomOpponent()];
// A list of losing responses from the opponent
var loser_responses = ['You win! Beginner\'s luck I guess...',
                       'You win again - I\'ll get you next time...',
                       'You win. I\'m starting to see a trend...',
                       'You win. Ugh, have you tried selecting a different opponent type?',
                       'You win. This is starting to get embarassing...',
                       'You win. Alright dude. Maybe just let me win a few? Please?',
                       'You win. Ok. I\'m not sure I\'m having fun anymore. :(',
                       'You win. DUDE! Seriously! You\'re amazing at this!',
                       'You win. Alright, one more time. I\'ll DESTROY you next time...',
                       'You win. Ok. I get it. You\'re better than me. If only someone would help me become a better opponent...'];

// This is the first function which executes after the script is linked
// to the HTML document. It adds an "event listener" which waits for a
// specific event (i.e. all the document objects are loaded, including
// the table which contains the spaces for the X's and O's) and then
// executes the function shown.
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the persistent data
    persistentData.init();
    // Get all the table cells in the document (i.e. the spaces for
    // the X's and O's
    var cells = document.getElementsByTagName("td");
    // Go through each table cell and attach an onclick listener
    // which will call the play() function every time the user
    // clicks a tic-tac-toe square
    for (var i = 0; i < cells.length; i++) {
        cells[i].onclick = function() { play(this); };
    }
    // Populate the opponent select list with possible opponents
    var opponent_list = document.getElementById("opponent");
    for (var i = 0; i < opponents.length; i++) {
        var opponent = document.createElement("option");
        opponent.value = i;
        opponent.innerHTML = opponents[i].name;
        opponent_list.appendChild(opponent);
    }
    // Set the default selected index
    opponent_list.selectedIndex = 0;
    // Update the game info for the user
    update_game_info();
    // Update the last play time to now
    persistentData.setLastPlay();
}, false);

// Updates the scores and other text
function update_game_info() {
    // Get the date the user last played
    var last_play = document.getElementById('last_play');
    if (persistentData.hasNeverPlayed()) {
        text = "Greetings! I haven't seen you before. Please select an opponent type and start playing!";
    } else {
        text = "Welcome back! You last played on " + persistentData.getLastPlay();
    }
    last_play.innerHTML = text;
    // Update the user scores
    var score = document.getElementById('score');
    var scores = persistentData.getScores();
    score.innerHTML = 'Wins: ' + scores.win + ' Losses: ' + scores.loss + ' Ties: ' + scores.tie;
    // Show the plea for help if the player has won a bunch
    if (scores.win >= 10) {
        var plea = document.getElementById('plea_for_help');
        plea.classList.remove('gone');
    }
}

// Returns an array of game cells with the inner contents trimmed
function get_cells() {
    var cells = document.getElementsByTagName("td");
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerHTML = cells[i].innerHTML.trim();
    }
    return cells;
}

// Resets the game board
function reset() {
    // If the user clicks on new game after they started
    // playing, then count that as a tie -- don't let them cheat!
    if (!is_full() && !is_empty() && !game_over) {
        persistentData.modifyScores(0, 0, 1);
    }
    // Reset the game board
    var cells = get_cells();
    for (var i = 0; i < cells.length; i++) {
        // Remove any X's or O's
        cells[i].innerHTML = "";
        // Remove "win" class to reset the color
        cells[i].classList.remove("win");
    }
    // Reset the game over flag
    game_over = false;
    // Update the game info (mainly for the updated last play data)
    update_game_info();
    // Update the last play time
    persistentData.setLastPlay();
}

// Plays the tic-tac-toe game when the user clicks on a specific square
function play(element) {
    // Don't let the user play if it's game over
    if (game_over) { 
        return;
    }
    // If the user clicked on an available game spot
    if (element.innerHTML.trim() == "") {
        // Put an "X" there
        element.innerHTML = "X";
        // Check to see if they've won
        if (has_won("X")) {
            game_over = true;
            persistentData.modifyScores(1, 0, 0);
            update_game_info();
            var scores = persistentData.getScores();
            alert(loser_responses[Math.min(loser_responses.length-1, scores.win-1)]);
        } else {
            // If not, then let the computer play if there's still room
            if (!is_full()) {
                // Get the opponent
                var selection = document.getElementById("opponent");
                var choice = selection.options[selection.selectedIndex].value;
                var opponent = opponents[choice];
                computer_play(opponent);
                // And see if the computer won
                if (has_won("O")) {
                    game_over = true;
                    persistentData.modifyScores(0, 1, 0);
                    update_game_info();
                    alert("You lose! Ha, you will never beat me!");
                }
            } else {
                // It's a tie if the board is full and no winners
                game_over = true;
                persistentData.modifyScores(0, 0, 1);
                update_game_info();
                alert("It's a tie!");
            }
        }
    }
}

// Returns a list of game board spots that are still in play (i.e. no X or O)
function get_available() {
    var available = [];
    var cells = get_cells();
    for (var i = 0; i < cells.length; i++) {
        if (cells[i].innerHTML == "") {
            available.push(i);
        }
    }
    return available;
}

// Returns true if the game board is full
function is_full() {
    return get_available().length == 0;
}

// Returns true if the game board is empty
function is_empty() {
    return get_available().length == 9;
}

// Returns true if the player, with token "X" or "O",  has won
function has_won(token) {
    var cells = get_cells();
    // Define a list of winning moves based on the cell indices
    var winning_moves = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    // Go through all the winning moves and check to see if there's a winner
    for (var move = 0; move < winning_moves.length; move++) {
        // Assume that this is a winning move (and wait to be proven wrong)
        var won = true;
        // Go through all the list of winning moves and check each one until we've
        // checked them all, or we've found a cell which doesn't contain our token
        for (var cell = 0; cell < winning_moves[move].length && won; cell++) {
            // If the cell doesn't contain the token, then we haven't won
            if (cells[winning_moves[move][cell]].innerHTML != token) {
                won = false;
            }
        }
        // If we've checked all the cells in this winning move and "won" is still
        // true, then the it's a win!
        if (won) {
            // Add a class tag to the winning cells
            for (var cell = 0; cell < winning_moves[move].length; cell++) {
                cells[winning_moves[move][cell]].classList.add("win");
            }
            return true;
        }
    }
    // We've checked all the possible winning move combinations and haven't found
    // a winning move, so return false
    return false;
}

// Lets the computer opponent make a play
function computer_play(opponent) {
    // Create lists which have the spots occupied by X, O, and available
    var x = [];
    var o = [];
    var available = [];
    // Get all the cells on the game board
    var cells = get_cells();
    // Check the cell to see if there's an X, an O, or if it's available
    for (var i = 0; i < cells.length; i++) {
        switch (cells[i].innerHTML) {
            case 'X':
                x.push(i);
                break;
            case 'O':
                o.push(i);
                break;
            default:
                available.push(i);
        }
    }
    // Only play if there is an available spot
    if (available.length > 0) {
        // Get the opponent's play
        var pick = opponent.play(cells, x, o, available);
        // Make sure it's in a valid available spot
        if (available.indexOf(pick) != -1) {
            // Set the game board cell to the "O" token
            cells[pick].innerHTML = "O";
        } else {
            console.log("Opponent error, picked " + pick + " out of " + available);
        }
    } else {
        console.log("The computer has no place to play.");
    }
}
