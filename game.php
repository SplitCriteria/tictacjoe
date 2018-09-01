<!doctype html>
<html lang="en">
    <head>
        <title>Tic Tac Joe</title>
        <link rel="stylesheet" href="styles.css">
        <script src="opponent.js"></script>
        <script src="data.js"></script>
        <script src="main.js"></script>
    </head>
    <body>
        <h1>Tic Tac Joe</h1>
        <p id="last_play">
        <p>Choose your opponent type! 
        <select id="opponent"></select>
        <p id="plea_for_help" class="emphasis gone">You're obviously very good at this... Please help make the opponent smarter by programming me with better AI (<a href="https://github.com/SplitCriteria/tictacjoe">click here</a>)
        <table>
            <tr><td><td><td>
            <tr><td><td><td>
            <tr><td><td><td>
        </table>
        <p id="score"></p>
        <button id="new_game" type="button" onclick="reset()">New Game</button>
    </body>
</html>
