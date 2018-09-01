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
//Creates a function for the difficulty hard.
function Hard() {
    Opponent.call(this);
    this.name = "Hard";
}
// Copy the base class prototyp, but keep the constructor
RandomOpponent.prototype = Object.create(Opponent.prototype);
RandomOpponent.prototype.constructor = RandomOpponent;
// Override the play function
RandomOpponent.prototype.play = function(game_board, x, o, available) {
}
