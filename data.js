var persistentData = {
    init: function() {
        // Initialize items if none are currently found
        if (localStorage.getItem('scores') == null) {
            this.clear();
        }
    },
    clear: function() {
        // Clear out the scores and last play time
        localStorage.setItem('scores', '0,0,0');
        localStorage.setItem('opponent_scores', '0,0,0');
        localStorage.setItem('last_play', 'Never');
    },
    getScores: function() {
        var scores = localStorage.getItem('scores').split(',');
        return {win: Number(scores[0]), loss: Number(scores[1]), tie: Number(scores[2])};
    },
    getOpponentScores: function() {
        var scores = localStorage.getItem('opponent_scores').split(',');
        return {win: Number(scores[0]), loss: Number(scores[1]), tie: Number(scores[2])};
    },
    getLastPlay: function() {
        return localStorage.getItem('last_play');
    },
    setLastPlay: function() {
        localStorage.setItem('last_play', new Date().toLocaleString());
    },
    hasNeverPlayed: function() {
        return this.getLastPlay() == "Never";
    },
    setScores: function(scores) {
        localStorage.setItem('scores', [scores.win, scores.loss, scores.tie].join(','));
    },
    setOpponentScores: function(scores) {
        localStorage.setItem('opponent_scores', [scores.win, scores.loss, scores.tie].join(','));
    },
    modifyScores: function(win, loss, tie) {
        // Get both the user scores and the opponent scores
        var scores = this.getScores();
        var opponentScores = this.getOpponentScores();
        // User scores a win will increase the scores and increase the opponent losses
        scores.win = scores.win + win;
        opponentScores.loss = opponentScores.loss + win;
        // Vice versa with the losses increasing the opponent wins
        scores.loss = scores.loss + loss;
        opponentScores.win = opponentScores.win + loss;
        // And, a tie is a tie for both
        scores.tie = scores.tie + tie;
        opponentScores.tie = opponentScores.tie + tie;
        // Update both of the scores
        this.setScores(scores);
        this.setOpponentScores(opponentScores);
    },
    // Debug function which dumps information to the console
    dump: function() {
        var scores = this.getScores();
        var oppScores = this.getOpponentScores();
        var lastPlay = this.getLastPlay();
        console.log('Player scores, W:' + scores.win + ' L:' + scores.loss + ' T:' + scores.tie);
        console.log('Opponent scores, W:' + oppScores.win + ' L:' + oppScores.loss + ' T:' + oppScores.tie);
        console.log('Last played: ' + lastPlay);
    }
}
