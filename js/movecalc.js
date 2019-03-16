

// make a copy of the reversed array
var reverseArray = function(array) {
    // slice() to make a copy, reverse to reverse it
    return array.slice().reverse();
};

// Piece square tables (adapted from Lauri Hartikka's piece square tables. These are multiplied by 10 since our piece values were a factor of 10 higher)
// Update: chess programming wiki has Lauri Hartikka's values multiplied by 10 as well.
var pawnEvalWhite =
    [
        [00,  00,  00,  00,  00,  00,  00,  00],
        [50,  50,  50,  50,  50,  50,  50,  50],
        [10,  10,  20,  30,  30,  20,  10,  10],
        [05,  05,  10,  25,  25,  10,  05,  05],
        [00,  00,  00,  20,  20,  00,  00,  00],
        [05, -05, -10,  00,  00, -10, -05,  05],
        [05,  10,  10, -20, -20,  10,  10,  05],
        [00,  00,  00,  00,  00,  00,  00,  00]
    ];

var pawnEvalBlack = reverseArray(pawnEvalWhite);

var knightEval =
    [
        [-50, -40, -30, -30, -30, -30, -40, -50],
        [-40, -20,  00,  00,  00,  00, -20, -40],
        [-30,  00,  10,  15,  15,  10,  00, -30],
        [-30,  05,  15,  20,  20,  15,  05, -30],
        [-30,  00,  15,  20,  20,  15,  00, -30],
        [-30,  05,  10,  15,  15,  10,  05, -30],
        [-40, -20,  00,  05,  05,  00, -20, -40],
        [-50, -40, -30, -30, -30, -30, -40, -50]
    ];

var bishopEvalWhite = [
    [ -20, -10, -10, -10, -10, -10, -10, -20],
    [ -10,  00,  00,  00,  00,  00,  00, -10],
    [ -10,  00,  05,  10,  10,  05,  00, -10],
    [ -10,  05,  05,  10,  10,  05,  05, -10],
    [ -10,  00,  10,  10,  10,  10,  00, -10],
    [ -10,  10,  10,  10,  10,  10,  10, -10],
    [ -10,  05,  00,  00,  00,  00,  05, -10],
    [ -20, -10, -10, -10, -10, -10, -10, -20]
];

var bishopEvalBlack = reverseArray(bishopEvalWhite);

var rookEvalWhite = [
    [  00,  00,  00,  00,  00,  00,  00,  00],
    [  05,  10,  10,  10,  10,  10,  10,  05],
    [ -05,  00,  00,  00,  00,  00,  00, -05],
    [ -05,  00,  00,  00,  00,  00,  00, -05],
    [ -05,  00,  00,  00,  00,  00,  00, -05],
    [ -05,  00,  00,  00,  00,  00,  00, -05],
    [ -05,  00,  00,  00,  00,  00,  00, -05],
    [  00,  00,  00,  05,  05,  00,  00,  00]
];

var rookEvalBlack = reverseArray(rookEvalWhite);

var evalQueen = [
    [ -20, -10, -10, -05, -05, -10, -10, -20],
    [ -10,  00,  00,  00,  00,  00,  00, -10],
    [ -10,  00,  05,  05,  05,  05,  00, -10],
    [ -05,  00,  05,  05,  05,  05,  00, -05],
    [  00,  00,  05,  05,  05,  05,  00, -05],
    [ -10,  05,  05,  05,  05,  05,  00, -10],
    [ -10,  00,  05,  00,  00,  00,  00, -10],
    [ -20, -10, -10, -05, -05, -10, -10, -20]
];

var kingEvalWhite = [

    [ -30, -40, -40, -50, -50, -40, -40, -30],
    [ -30, -40, -40, -50, -50, -40, -40, -30],
    [ -30, -40, -40, -50, -50, -40, -40, -30],
    [ -30, -40, -40, -50, -50, -40, -40, -30],
    [ -20, -30, -30, -40, -40, -30, -30, -20],
    [ -10, -20, -20, -20, -20, -20, -20, -10],
    [  20,  20,  00,  00,  00,  00,  20,  20 ],
    [  20,  30,  10,  00,  00,  10,  30,  20 ]
];

var kingEvalBlack = reverseArray(kingEvalWhite);

/**
 * Finds a random move to make
 * @return {string} move to make
 */
var randomMove = function() {
  var possibleMoves = game.moves();
  var randomIndex = Math.floor(Math.random() * possibleMoves.length);
  return possibleMoves[randomIndex];
};

/**
 * Evaluates current chess board relative to player
 * @param {string} color - Players color, either 'b' or 'w'
 * @return {Number} board value relative to player
 */
 
 // This is Eval 1, which only looks at material
var evaluateBoard = function(board, color) {
  // Sets the value for each piece using standard piece value
  var pieceValue = {
    'p': 100,
    'n': 350,
    'b': 350,
    'r': 525,
    'q': 1000,
    'k': 10000
  };

  // Loop through all pieces on the board and sum up total
  var value = 0;
  board.forEach(function(row) {
    row.forEach(function(piece) {
      if (piece) {
        // Subtract piece value if it is opponent's piece
        value += pieceValue[piece['type']]
                 * (piece['color'] === color ? 1 : -1);
      }
    });
  });

  return value;
};

// This is Eval 2, which looks at material with piece square tables
// evaluate the board using piece square tables (adapted from Lauri Hartikka's piece square tables)
// Material with Piece square tables
var evaluateBoardPSQT = function(board, color) {
  // Sets the value for each piece using piece value system from chess programming wiki
  // https://www.chessprogramming.org/Simplified_Evaluation_Function
  var pieceValue = {
    'p': 100,
    'n': 320,
    'b': 330,
    'r': 500,
    'q': 900,
    'k': 20000
  };
  
  // adapted from Lauri Hartikka's piece square table function
  var absolutePieceValue = function(piece, isWhite, y, x) {
    
    if (piece.type === 'p') {
        return pieceValue['p'] + ( isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x] );
    } else if (piece.type === 'r') {
        return pieceValue ['r'] + ( isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x] );
    } else if (piece.type === 'n') {
        return pieceValue['n'] + knightEval[y][x];
    } else if (piece.type === 'b') {
        return pieceValue['b'] + ( isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x] );
    } else if (piece.type === 'q') {
        return pieceValue['q'] + evalQueen[y][x];
    } else if (piece.type === 'k') {
        return pieceValue['k'] + ( isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x] );
    }
    throw "Unknown piece type: " + piece.type;      
  }

  // Loop through all pieces on the board and sum up total (with piece square values)
  var value = 0;
  board.forEach(function(row, rowIndex) {
    row.forEach(function(piece, colIndex) {
      if (piece) {
        // Subtract piece value if it is opponent's piece
        value += (absolutePieceValue(piece, piece.color === 'w', rowIndex, colIndex) * (piece['color'] === color ? 1 : -1));
      }
    });
  });

  return value;
};


/*

Passed Pawn heuristic, this is the main difference in eval 3
NOTE: This is not eval 3, eval 3 simply calls this function.

What is a passed pawn?

Board representation:
   0   1   2   3   4   5   6   7
  -------------------------------
0 |B   B   B   B   B   B   B   B|
1 |B   B   B   B   B   B   B   B|
2 |0   0   0   0   0   0   0   0|
3 |0   0   0   0   0   0   0   0|
4 |0   0   0   0   0   0   0   0|
5 |0   0   0   0   0   0   0   0|
6 |W   W   W   W   W   W   W   W|
7 |W   W   W   W   W   W   W   W|
  -------------------------------

When there are no opposing pawns in front of a pawn or on the columns next to it,
The pawn has a clear path to push forward without being challenged by another pawn.
This is called a passed pawn.

Passed Pawn example:

   0   1   2   3   4   5   6   7
  -------------------------------
0 |0   0   0   0   0   0   0   0
1 |0   0   0   0   0   0   0   0|
2 |0   0   0   0   0   0   0   0|
3 |0   0   0   0   0   0   0   0|
4 |0   0   0   0   0   P   0   0|
5 |0   0   0   0   0   0   0   0|
6 |0   0   0   0   0   0   0   0|
7 |0   0   0   0   0   0   0   0|
  -------------------------------
  
If there were opposing passed pawns in column 4, 5 or 6, the pawn marked 'P' would not be a passed pawn. 
*/

// value of passed pawn depending on how far ahead it is
var PawnPassed = [0, 5, 10, 20, 35, 60, 100, 200];

// calculates the score for extra passed pawns
// Source: All the sources online used bitboards and bitmasks for passed pawns, so I wrote this myself 
var passedPawnScore = function(board, playerColor) {

    score = 0;
    // iterate through board and look for pawns
    for(var i = 0; i < 8; i++){
        for(var j = 0; j < 8; j++){
            // if pawn found
            if(board[i][j] != null && board[i][j].type == 'p'){
                pawn = board[i][j]
                // check if white pawn
                if(board[i][j].color === 'w'){
                    passedPawn = true
                    // look for all rows below to look for opposing pawns
                    // (since the white pawn faces the direction with lower numbers)
                    row = i-1;
                    /* make sure we don't go out of bounds with our columns
                       We want to look at one column on the right, the current column, and one on the left */    
                    startCol = j === 0? j: j - 1;
                    endCol = j === 7? j: j + 1;
                    
                    // check for all black pawns on the columns before to after it, rows further up. 
                    // If we find a black pawn then our pawn is not a passed pawn.
                    for(k = row; k > 0; k--){
                        for(l = startCol; l <= endCol; l++){
                            if(board[k][l] != null && board[k][l].type === 'p' && board[k][l].color != pawn.color){
                                passedPawn = false
                                break;
                            }                        
                        }
                    }
                    if(passedPawn){
                        // We need to wrap around.
                        // example, white might be on the '2nd' rank from their perspective, but the index should be equal to 6.                        
                        score += PawnPassed[7 - i];
                    }
                }
                // Black piece
                else {
                    passedPawn = true
                    row = i+1;
                    // make sure we don't go out of bounds with our columns
                    startCol = j === 0? j: j - 1;
                    endCol = j === 7? j: j + 1;
                    // check for all white pawns on the columns before to after it, rows further down. 
                    // If we find a white pawn then our pawn is not a passed pawn.
                    for(k = row; k < 7; k++){
                        for(l = startCol; l <= endCol; l++){
                            if(board[k][l] != null && board[k][l].type === 'p' && board[k][l].color != pawn.color){
                                passedPawn = false
                                break;
                            }                        
                        }
                    }
                    if(passedPawn){
                        score -= PawnPassed[i];
                    }                    
                }
            }
        }
    }
    return playerColor === 'w'? score: -score;
}

// Eval 3, which uses our previous heuristics of piece square tables with material, 
// but also adds in a passed pawn heuristic 
// Material with Piece Square Tables + Passed pawn heuristic
var evaluateBoardAll = function(board, color){  
    var score = evaluateBoardPSQT(board, color) + passedPawnScore(board, color);
    return score;
}

/**
 * Calculates the best move looking one move ahead
 * @param {string} playerColor - Players color, either 'b' or 'w'
 * @return {string} the best move
 */
var calcBestMoveOne = function(playerColor) {
  // List all possible moves
  var possibleMoves = game.moves();
  // Sort moves randomly, so the same move isn't always picked on ties
  possibleMoves.sort(function(a, b){return 0.5 - Math.random()});

  // exit if the game is over
  if (game.game_over() === true || possibleMoves.length === 0) return;

  // Search for move with highest value
  var bestMoveSoFar = null;
  var bestMoveValue = Number.NEGATIVE_INFINITY;
  possibleMoves.forEach(function(move) {
    game.move(move);
    var moveValue = evaluateBoard(game.board(), playerColor);
    if (moveValue > bestMoveValue) {
      bestMoveSoFar = move;
      bestMoveValue = moveValue;
    }
    game.undo();
  });

  return bestMoveSoFar;
}

/**
 * Calculates the best move using Minimax without Alpha Beta Pruning.
 * @param {Number} depth - How many moves ahead to evaluate
 * @param {Object} game - The game to evaluate
 * @param {string} playerColor - Players color, either 'b' or 'w'
 * @param {Boolean} isMaximizingPlayer - If current turn is maximizing or minimizing player
 * @return {Array} The best move value, and the best move
 */
var calcBestMoveNoAB = function(depth, game, playerColor,
                                isMaximizingPlayer=true) {
  // Base case: evaluate board
  if (depth === 0) {
    value = evaluateBoard(game.board(), playerColor);

    return [value, null]
  }

  // Recursive case: search possible moves
  var bestMove = null; // best move not set yet
  var possibleMoves = game.moves();
  // Set random order for possible moves
  possibleMoves.sort(function(a, b){return 0.5 - Math.random()});
  // Set a default best move value
  var bestMoveValue = isMaximizingPlayer ? Number.NEGATIVE_INFINITY
                                         : Number.POSITIVE_INFINITY;
  // Search through all possible moves
  for (var i = 0; i < possibleMoves.length; i++) {
    var move = possibleMoves[i];
    // Make the move, but undo before exiting loop
    game.move(move);
    // Recursively get the value of this move
    value = calcBestMoveNoAB(depth-1, game, playerColor, !isMaximizingPlayer)[0];
    // Log the value of this move
    /* COMMENTED FOR SPEED */
    //console.log(isMaximizingPlayer ? 'Max: ' : 'Min: ', depth, move, value,
    //            bestMove, bestMoveValue);

    if (isMaximizingPlayer) {
      // Look for moves that maximize position
      if (value > bestMoveValue) {
        bestMoveValue = value;
        bestMove = move;
      }
    } else {
      // Look for moves that minimize position
      if (value < bestMoveValue) {
        bestMoveValue = value;
        bestMove = move;
      }
    }
    // Undo previous move
    game.undo();
  }
  // Log the best move at the current depth
  /* COMMENTED FOR SPEED */
  //console.log('Depth: ' + depth + ' | Best Move: ' + bestMove + ' | ' + bestMoveValue);
  // Return the best move, or the only move
  return [bestMoveValue, bestMove || possibleMoves[0]];
}

/**
 * Calculates the best move using Minimax with Alpha Beta Pruning.
 * @param {Number} depth - How many moves ahead to evaluate
 * @param {Object} game - The game to evaluate
 * @param {string} playerColor - Players color, either 'b' or 'w'
 * @param {Number} alpha
 * @param {Number} beta
 * @param {Boolean} isMaximizingPlayer - If current turn is maximizing or minimizing player
 * @return {Array} The best move value, and the best move
 */
var calcBestMove = function(depth, game, playerColor,
                            alpha=Number.NEGATIVE_INFINITY,
                            beta=Number.POSITIVE_INFINITY,
                            isMaximizingPlayer=true) {
  // Base case: evaluate board
  if (depth === 0) {
    value =  ((game.in_stalemate() || game.in_draw() || game.in_threefold_repetition())? 0: evaluateBoard(game.board(), playerColor));
    if(game.in_checkmate()){
        if(game.turn() === playerColor){
            value = Number.NEGATIVE_INFINITY;
        }
        else{
            value = Number.POSITIVE_INFINITY;
        }
    }
    return [value, null];
  }

  // Recursive case: search possible moves
  var bestMove = null; // best move not set yet
  var possibleMoves = game.moves();
  // Set random order for possible moves
  possibleMoves.sort(function(a, b){return 0.5 - Math.random()});
  // Set a default best move value
  var bestMoveValue = isMaximizingPlayer ? Number.NEGATIVE_INFINITY
                                         : Number.POSITIVE_INFINITY;
  // Search through all possible moves
  for (var i = 0; i < possibleMoves.length; i++) {
    var move = possibleMoves[i];
    // Make the move, but undo before exiting loop
    game.move(move);
    // Recursively get the value from this move
    value = calcBestMove(depth-1, game, playerColor, alpha, beta, !isMaximizingPlayer)[0];
    // Log the value of this move
    /* COMMENTED FOR SPEED */
    //console.log(isMaximizingPlayer ? 'Max: ' : 'Min: ', depth, move, value,
    //            bestMove, bestMoveValue);

    if (isMaximizingPlayer) {
      // Look for moves that maximize position
      if (value > bestMoveValue) {
        bestMoveValue = value;
        bestMove = move;
      }
      alpha = Math.max(alpha, value);
    } else {
      // Look for moves that minimize position
      if (value < bestMoveValue) {
        bestMoveValue = value;
        bestMove = move;
      }
      beta = Math.min(beta, value);
    }
    // Undo previous move
    game.undo();
    // Check for alpha beta pruning
    if (beta <= alpha) {
      /* COMMENTED FOR SPEED */
      //console.log('Prune', alpha, beta);
      break;
    }
  }
  // Log the best move at the current depth
  /* COMMENTED FOR SPEED */
  //console.log('Depth: ' + depth + ' | Best Move: ' + bestMove + ' | ' + bestMoveValue + ' | A: ' + alpha + ' | B: ' + beta);
  // Return the best move, or the only move
  return [bestMoveValue, bestMove || possibleMoves[0]];
}

// Also uses Minimax Alpha Beta, with the evaluation function with piece square tables
// (Used so that bots can test against each other using evaluation functions)
// also evaluates draw positions and checkmate positions to return a true value
var calcBestMovePSQT = function(depth, game, playerColor,
                            alpha=Number.NEGATIVE_INFINITY,
                            beta=Number.POSITIVE_INFINITY,
                            isMaximizingPlayer=true) {
  // Base case: evaluate board
  if (depth === 0) {

    value = ((game.in_stalemate() || game.in_draw() || game.in_threefold_repetition())? 0: evaluateBoardPSQT(game.board(), playerColor));      
   
    if(game.in_checkmate()){
        if(game.turn() === playerColor){
            value = Number.NEGATIVE_INFINITY;
        }
        else{
            value = Number.POSITIVE_INFINITY;
        }
    }
    return [value, null]
  }

  // Recursive case: search possible moves
  var bestMove = null; // best move not set yet
  var possibleMoves = game.moves();
  // Set random order for possible moves
  possibleMoves.sort(function(a, b){return 0.5 - Math.random()});
  // Set a default best move value
  var bestMoveValue = isMaximizingPlayer ? Number.NEGATIVE_INFINITY
                                         : Number.POSITIVE_INFINITY;
  // Search through all possible moves
  for (var i = 0; i < possibleMoves.length; i++) {
    var move = possibleMoves[i];
    // Make the move, but undo before exiting loop
    game.move(move);
    // Recursively get the value from this move
    value = calcBestMovePSQT(depth-1, game, playerColor, alpha, beta, !isMaximizingPlayer)[0];
    // Log the value of this move
    /* COMMENTED FOR SPEED */
    //console.log(isMaximizingPlayer ? 'Max: ' : 'Min: ', depth, move, value,
     //           bestMove, bestMoveValue);

    if (isMaximizingPlayer) {
      // Look for moves that maximize position
      if (value > bestMoveValue) {
        bestMoveValue = value;
        bestMove = move;
      }
      alpha = Math.max(alpha, value);
    } else {
      // Look for moves that minimize position
      if (value < bestMoveValue) {
        bestMoveValue = value;
        bestMove = move;
      }
      beta = Math.min(beta, value);
    }
    // Undo previous move
    game.undo();
    // Check for alpha beta pruning
    if (beta <= alpha) {
      /* COMMENTED FOR SPEED */
      //console.log('Prune', alpha, beta);
      break;
    }
  }
  // Log the best move at the current depth
  /* COMMENTED FOR SPEED */
  //console.log('Depth: ' + depth + ' | Best Move: ' + bestMove + ' | ' + bestMoveValue + ' | A: ' + alpha + ' | B: ' + beta);
  // Return the best move, or the only move
  return [bestMoveValue, bestMove || possibleMoves[0]];
}

// Uses Minimax Alpha Beta as well, but uses eval 3 to evaluate positions
// Also returns a true value in draw positions and checkmate positions
var calcBestMoveAll = function(depth, game, playerColor,
                            alpha=Number.NEGATIVE_INFINITY,
                            beta=Number.POSITIVE_INFINITY,
                            isMaximizingPlayer=true) {
  // Base case: evaluate board
  if (depth === 0) {
    // if game is in draw, value is 0 because it's a draw, else we evaluate the board with our heuristics
    value = (game.in_stalemate() || game.in_draw() || game.in_threefold_repetition())? 0: evaluateBoardAll(game.board(), playerColor);
    // if game is in checkmate, return infinity as the value (highest possible value)
    if(game.in_checkmate()){
        if(game.turn() === playerColor){
            value = Number.NEGATIVE_INFINITY;
        }
        else{
            value = Number.POSITIVE_INFINITY;
        }
        
    }
    return [value, null]
  }

  // Recursive case: search possible moves
  var bestMove = null; // best move not set yet
  var possibleMoves = game.moves();
  // Set random order for possible moves
  possibleMoves.sort(function(a, b){return 0.5 - Math.random()});
  // Set a default best move value
  var bestMoveValue = isMaximizingPlayer ? Number.NEGATIVE_INFINITY
                                         : Number.POSITIVE_INFINITY;
  // Search through all possible moves
  for (var i = 0; i < possibleMoves.length; i++) {
    var move = possibleMoves[i];
    // Make the move, but undo before exiting loop
    game.move(move);
    // Recursively get the value from this move
    value = calcBestMoveAll(depth-1, game, playerColor, alpha, beta, !isMaximizingPlayer)[0];
    // Log the value of this move
    /* COMMENTED FOR SPEED */    
    //console.log(isMaximizingPlayer ? 'Max: ' : 'Min: ', depth, move, value,
    //            bestMove, bestMoveValue);

    if (isMaximizingPlayer) {
      // Look for moves that maximize position
      if (value > bestMoveValue) {
        bestMoveValue = value;
        bestMove = move;
      }
      alpha = Math.max(alpha, value);
    } else {
      // Look for moves that minimize position
      if (value < bestMoveValue) {
        bestMoveValue = value;
        bestMove = move;
      }
      beta = Math.min(beta, value);
    }
    // Undo previous move
    game.undo();
    // Check for alpha beta pruning
    if (beta <= alpha) {
      /* COMMENTED FOR SPEED */
      //console.log('Prune', alpha, beta);
      break;
    }
  }
  // Log the best move at the current depth
  /* COMMENTED FOR SPEED */
  //console.log('Depth: ' + depth + ' | Best Move: ' + bestMove + ' | ' + bestMoveValue + ' | A: ' + alpha + ' | B: ' + beta);
  // Return the best move, or the only move
  return [bestMoveValue, bestMove || possibleMoves[0]];
}