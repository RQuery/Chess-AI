// Computer makes a move with algorithm choice and skill/depth level
var makeMove = function(algo, skill=3) {
  // exit if the game is over
  if (game.game_over() === true) {
    console.log('game over');
    return;
  }
  // Calculate the best move, using chosen algorithm
  if (algo === 1) {
    var move = randomMove();
  } else if (algo === 2) {
    var move = calcBestMoveOne(game.turn());
  } else if (algo === 3) {
    var move = calcBestMoveNoAB(skill, game, game.turn())[1];
  } else if (algo === 4) {
    var move = calcBestMove(skill, game, game.turn())[1];
  } else if (algo === 5) {
    var move = calcBestMovePSQT(skill, game, game.turn())[1];
  } else if(algo === 6) {
    var move = calcBestMoveAll(skill, game, game.turn())[1];
  }
  // Make the calculated move
  game.move(move);
  // Update board positions
  board.position(game.fen());
}

// Computer vs Computer
var playGame = function(algo=4, skillW=2, skillB=2) {
  if (game.game_over() === true) {
    console.log('game over');
    return;
  }
  var skill = game.turn() === 'w' ? skillW : skillB;
  algo = game.turn() === 'w'? 6: 4;
  makeMove(algo, skill);
  window.setTimeout(function() {
    playGame(algo, skillW, skillB);
  }, 250);
};




// Computer vs Computer
var playGameDepthFixed = function(algo1, algo2, skill) {
  if (game.game_over() === true) {
    //console.log('game over');
    if(game.in_checkmate()){       
        if(game.turn() === 'w'){
            return -1;
        }
        else{
            return 1;
        }
    }
    else{

        return 0;
    }
  }
  // added line for testing
  algo = game.turn() === 'w' ? algo1 : algo2;
  makeMove(algo, skill);

  result = playGameDepthFixed(algo1, algo2, skill);
  return result;


};


var eval1 = {
    games: 0,
    wins: 0,
    draws: 0,
    losses: 0,
};

var eval2 = {
    games: 0,
    wins: 0,
    draws: 0,
    losses: 0,
};

var eval3 = {
    games: 0,
    wins: 0,
    draws: 0,
    losses: 0,
};

evalArray = [eval1, eval2, eval3];

// automatically make bots play each other and post results
// depth fixed
var botTestsEvaluationDepthFixed = function(depth) {
    game.reset();
    board.position('start');
    for(var i = 0; i < 30; i++) {

        // get number between 0 and 2
        indexWhite = Math.floor(Math.random() * 3);
        indexBlack = Math.floor(Math.random() * 3); 
        
        while(indexWhite === indexBlack){
            indexBlack = Math.floor(Math.random() * 3);
        }
        evalArray[indexWhite]['games'] += 1;
        evalArray[indexBlack]['games'] += 1;
        result = playGameDepthFixed(indexWhite + 4, indexBlack + 4, depth);

        if(result === -1){
            evalArray[indexWhite]['losses'] += 1;
            evalArray[indexBlack]['wins'] += 1;
        }
        else if(result === 0){
            evalArray[indexWhite]['draws'] += 1;
            evalArray[indexBlack]['draws'] += 1;            
        }
        else if(result === 1){
            evalArray[indexWhite]['wins'] += 1;
            evalArray[indexBlack]['losses'] += 1;
        }
    

        game.reset();
        board.position('start');
        console.log('eval1');
        console.table(eval1);
        console.log('eval2');
        console.table(eval2);
        console.log('eval3');
        console.table(eval3); 
        
    }
    
    console.log("Final results");
    console.log('eval1');
    console.table(eval1);
    console.log('eval2');
    console.table(eval2);
    console.log('eval3');
    console.table(eval3);  
    
    console.log("Done...");
}

// eval fixed, variable depth
var playGameEvalFixed = function(algo, skillW, skillB) {
  if (game.game_over() === true) {
    //console.log('game over');
    if(game.in_checkmate()){       
        if(game.turn() === 'w'){
            return -1;
        }
        else{
            return 1;
        }
    }
    else{

        return 0;
    }
  }
  // added line for testing
  var skill = game.turn() === 'w' ? skillW : skillB;
  makeMove(algo, skill);

  result = playGameEvalFixed(algo, skillW, skillB);
  return result;
};

var depth1 = {
    games: 0,
    wins: 0,
    draws: 0,
    losses: 0,
};

var depth2 = {
    games: 0,
    wins: 0,
    draws: 0,
    losses: 0,
};

var depth3 = {
    games: 0,
    wins: 0,
    draws: 0,
    losses: 0,
};

depthArray = [depth1, depth2, depth3];
// eval fixed, depth randomized
// make bots play each other
var botTestsEvaluationEvalFixed = function(eval) {
    game.reset();
    board.position('start');
    for(var i = 0; i < 30; i++) {

        // get number between 0 and 2
        indexWhite = Math.floor(Math.random() * 3);
        indexBlack = Math.floor(Math.random() * 3); 
        
        while(indexWhite === indexBlack){
            indexBlack = Math.floor(Math.random() * 3);
        }
        depthArray[indexWhite]['games'] += 1;
        depthArray[indexBlack]['games'] += 1;
        result = playGameEvalFixed(eval, indexWhite+1, indexBlack+1);

        if(result === -1){
            depthArray[indexWhite]['losses'] += 1;
            depthArray[indexBlack]['wins'] += 1;
        }
        else if(result === 0){
            depthArray[indexWhite]['draws'] += 1;
            depthArray[indexBlack]['draws'] += 1;            
        }
        else if(result === 1){
            depthArray[indexWhite]['wins'] += 1;
            depthArray[indexBlack]['losses'] += 1;
        }
    

        game.reset();
        board.position('start');
        console.log('depth1');
        console.table(depth1);
        console.log('depth2');
        console.table(depth2);
        console.log('depth3');
        console.table(depth3); 
        
    }
    
    console.log("Final results");
    console.log('depth1');
    console.table(depth1);
    console.log('depth2');
    console.table(depth2);
    console.log('depth3');
    console.table(depth3);  
    
    console.log("Done...");
}


// eval fixed, variable depth
var playGameRandomEvalAndDepth = function(algo1, algo2, skillW, skillB) {

  if (game.game_over() === true) {
    console.log('algo white:' + algo1);
    console.log('algo black:' + algo2);
    console.log(game.pgn());
    console.log(game.turn());
    //console.log('game over');
    if(game.in_checkmate()){       
        if(game.turn() === 'w'){
            return -1;
        }
        else{
            return 1;
        }
    }
    else{

        return 0;
    }
  }
  // added line for testing
  var algo = game.turn() === 'w' ? algo1: algo2;
  var skill = game.turn() === 'w' ? skillW : skillB;
  
  makeMove(algo, skill);

  result = playGameRandomEvalAndDepth(algo1, algo2, skillW, skillB);
  return result;
};

// for absolutely randomized tables
var tableDepth1 = {
    eval1: {
        games: 0,
        wins: 0,
        draws: 0,
        losses: 0
    },
    eval2: {
        games: 0,
        wins: 0,
        draws: 0,
        losses: 0
    },
    eval3: {
        games: 0,
        wins: 0,
        draws: 0,
        losses: 0
    }
};

var tableDepth2 = {
    eval1: {
        games: 0,
        wins: 0,
        draws: 0,
        losses: 0
    },
    eval2: {
        games: 0,
        wins: 0,
        draws: 0,
        losses: 0
    },
    eval3: {
        games: 0,
        wins: 0,
        draws: 0,
        losses: 0
    }
};

var tableDepth3 = {
    eval1: {
        games: 0,
        wins: 0,
        draws: 0,
        losses: 0
    },
    eval2: {
        games: 0,
        wins: 0,
        draws: 0,
        losses: 0
    },
    eval3: {
        games: 0,
        wins: 0,
        draws: 0,
        losses: 0
    }
};

tableD1 = [tableDepth1.eval1, tableDepth1.eval2, tableDepth1.eval3];
tableD2 = [tableDepth2.eval1, tableDepth2.eval2, tableDepth2.eval3];
tableD3 = [tableDepth3.eval1, tableDepth3.eval2, tableDepth3.eval3];
tableArray = [tableD1, tableD2, tableD3];

// The completely random tests
var botTestsRandomized = function() {
    game.reset();
    board.position('start');
    for(var i = 0; i < 1000; i++) {

        // get number between 0 and 2
        indexWhiteD = Math.floor(Math.random() * 3);
        indexBlackD = Math.floor(Math.random() * 3); 
        indexWhiteE = Math.floor(Math.random() * 3);
        indexBlackE = Math.floor(Math.random() * 3);         
        while((indexWhiteD === indexBlackD) && (indexWhiteE === indexBlackE)){
            indexBlackE = Math.floor(Math.random() * 3);
        }
        tableArray[indexWhiteD][indexWhiteE]['games'] += 1;
        tableArray[indexBlackD][indexBlackE]['games'] += 1;
        result = playGameRandomEvalAndDepth(indexWhiteE+4, indexBlackE+4, indexWhiteD+1, indexBlackD+1);

        if(result === -1){
            tableArray[indexWhiteD][indexWhiteE]['losses'] += 1;
            tableArray[indexBlackD][indexBlackE]['wins'] += 1;
        }
        else if(result === 0){
            tableArray[indexWhiteD][indexWhiteE]['draws'] += 1;
            tableArray[indexBlackD][indexBlackE]['draws'] += 1;            
        }
        else if(result === 1){
            tableArray[indexWhiteD][indexWhiteE]['wins'] += 1;
            tableArray[indexBlackD][indexBlackE]['losses'] += 1;
        }
    

        game.reset();
        board.position('start');
        console.log("Result:");
        for(var x = 0; x < 3; x++){
            console.log('depth' + (x+1));
            for(var y = 0; y < 3; y++){
                console.log('eval' + (y+1));
                console.table(tableArray[x][y]);
            }
        } 
        
    }
    
    console.log("Final results");
    for(var i = 0; i < 3; i++){
        console.log('depth' + (i+1));
        for(var j = 0; j < 3; j++){
            console.log('eval' + (j+1));
            console.table(tableArray[i][j]);
        }
    } 
    
    console.log("Done...");
}

eval3depth1 = {    
    games: 0,
    wins: 0,
    draws: 0,
    losses: 0       
}

eval1depth3 = {
    games: 0,
    wins: 0,
    draws: 0,
    losses: 0       
}

var depthEvalArray = [eval3depth1, eval1depth3];

// depth 3 eval 1 vs depth 1 eval 3 - to see which is better, depth or eval
var botTestsDepthVsEval = function() {
    game.reset();
    board.position('start');
    for(var i = 1; i <= 100; i++) {

        depthEvalArray[0]['games'] += 1;
        depthEvalArray[1]['games'] += 1;
        
        var indexWhite = 0;
        var indexBlack = 1;
        // make sure both get equal amount of white and black colors
        if(i % 2){
            // algo 6 = eval 3, algo 4 = eval 1, depth 3 and depth 1
            result = playGameRandomEvalAndDepth(6, 4, 1, 3);
        }
        else{
            indexWhite = 1;
            indexBlack = 0;
            result = playGameRandomEvalAndDepth(4, 6, 3, 1);    
        }
        if(result === -1){
            depthEvalArray[indexWhite]['losses'] += 1;
            depthEvalArray[indexBlack]['wins'] += 1;
        }
        else if(result === 0){
            depthEvalArray[indexWhite]['draws'] += 1;
            depthEvalArray[indexBlack]['draws'] += 1;            
        }
        else if(result === 1){
            depthEvalArray[indexWhite]['wins'] += 1;
            depthEvalArray[indexBlack]['losses'] += 1;
        }
    

        game.reset();
        board.position('start');
        console.log('depth1 eval 3');
        console.table(eval3depth1);
        console.log('depth3 eval 1');
        console.table(eval1depth3);
        
    }
    
    console.log("Final results");
    console.log('depth1 eval 3');
    console.table(eval3depth1);
    console.log('depth3 eval 1');
    console.table(eval1depth3);
    
    console.log("Done...");
}

// Handles what to do after human makes move.
// Computer automatically makes next move
var onDrop = function(source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // If illegal move, snapback
  if (move === null) return 'snapback';

  // Log the move
  console.log(move)

  // make move for black
  window.setTimeout(function() {
    makeMove(4, 3);
  }, 250);
};
