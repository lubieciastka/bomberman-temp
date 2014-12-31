
var allClients = [ ];

var map = require('./map.js');
var slots = require('./slots.js');

var app = require('http').createServer(), io = require('/usr/local/lib/node_modules/socket.io').listen( app );

io.set('log level', 1);

app.listen(3000);

var gameMap = new map.Map();


var gameSlots = new slots.Slots();

gameMap.generate();

io.sockets.on('connection', function( socket ) {

	var _this = this;

	allClients.push(socket);

	socket.on('disconnect', function( ) {

		var tempPlayer = gameSlots.getPlayerConnectionBySocketId( socket.id );

		if ( gameSlots.freeSlotBySocketId( socket.id ) ){

			gameMap.playerRemove( tempPlayer.playerId );

			socket.broadcast.emit( 'updateplayers' , gameMap.getPlayers( ) );

			var i = allClients.indexOf(socket);

			delete allClients[i];

		}

	});

	socket.on( 'initplayer' , function ( data ) {
		
		if ( data.sessionId === undefined || data.sessionId === "" ){

			io.sockets.socket( socket.id ).emit( 'initplayer' , { 'data' : 'error', 'errorMessage' : 'Bad sessionId' } );
			
			return false;
			
		}

		var playerConnection = gameSlots.getPlayerConnectionBySessionId( data.sessionId );

		if ( playerConnection === false ) {

			var playerConnection = gameSlots.newPlayerConnection( socket.id, data.sessionId );

		} else {

			playerConnection.setSocketId( socket.id );
			
		}
		
		if ( playerConnection === false ) {

			io.sockets.socket( socket.id ).emit( 'initplayer' , { 'data' : 'error', 'errorMessage' : 'All slots taken' } );
			
			return false;
			
		}
		
		io.sockets.socket( socket.id ).emit( 'initplayer' , { 'data' : 'true', 'playerData' : playerConnection } );

		socket.broadcast.emit( 'newplayer' ,   { 'playerData' : playerConnection } ); // We inform all other players that new player is in the game, so local versions could add new entity to the map
		
	});

	socket.on( 'getmap', function( data ) {
		
		gameMap.playersAdd( gameSlots );

		io.sockets.emit( 'getmap' , gameMap );
		
	});


	socket.on( 'restartmap', function( data ) {

		gameMap.generate();
		gameMap.playersAdd( gameSlots );

		io.sockets.emit( 'getmap' , gameMap );

	});

	socket.on( 'playermove', function( data ) {

		var playerConnection = gameSlots.getPlayerConnectionBySessionId( data.sessionId );

		if ( playerConnection === false ) {

			io.sockets.socket( socket.id ).emit( 'initplayer' , { 'data' : 'error', 'errorMessage' : 'Unknown session' } );

			return false;
			
		}

		if ( playerConnection.getPlayerId() !== data.playerId ) {

			console.log( 'Wrong sessionId' );
			console.log( data );

			io.sockets.socket( socket.id ).emit( 'initplayer' , { 'data' : 'error', 'errorMessage' : 'Security issues: wrong player id for the session' } );

			return false;
			
		}

		if ( playerConnection.getReady() === false ) {

			io.sockets.socket( socket.id ).emit( 'initplayer' , { 'data' : 'error', 'errorMessage' : 'Player not ready' } );

			return false;

		}

		if ( gameMap.playerCheck( data.playerId ) === false ) {

			io.sockets.socket( socket.id ).emit( 'initplayer' , { 'data' : 'error', 'errorMessage' : 'Player not on the map' } );

			return false;
			
		}

		if ( gameMap.playerMove( data.playerId, data.x, data.y ) === false ) {

			return false;
		}

		io.sockets.emit( 'playermove' , { 'playerId' : data.playerId, 'x' : data.x, 'y' : data.y } );

		//input
		//move player
		//data.sessionId
		//data.playerId
		//data.x
		//data.y
		
		// output to all players information, that player with such a playerId moves to such x,y position

	});

	socket.on( 'dropbomb', function( data ) {

		console.log( socket );
		//input
		//drop bomb
		//data.sessionId
		//data.playerId

		// output to all players, that such a bomb was set in x, y position

	});

	socket.on( 'bombblast', function( ) {

		//input
		//no input
		//
		// output to all players, with map with flame positions + new maps output after some timeout

	});

});
