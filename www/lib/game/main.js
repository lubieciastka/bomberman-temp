ig.module(

	'game.main'

)
.requires(

	'impact.game',
	'impact.debug.debug',

	'game.entities.paczka',
	'game.entities.player',
	'game.entities.powerup',

	'plugins.helper',
	'plugins.helperhtml'
		
)
.defines(function(){

	MyGame = ig.Game.extend({

		tilesImage: new ig.Image( 'media/wall.png' ), // spritesheet z roznymi "tiles" dla mapy
		
		tilesSize : 32,

		mapTiles : [],
		mapCollisions : [],

		justDroppedBomb : false,

		map : null,
		collisionMap : null,
		
		mapBombs : [],

		server : null,

		helper : null,
		helperHtml : null,

		player : {
			
			id : null,
			ready : null,
			sessionId : null,
			socketId : null

		},

		players : { 1:null, 2:null, 3:null, 4:null, 5:null },

		init: function() {

			this.helper = new Helper( this );
			this.helperHtml = new Helperhtml( this );
			
			this.connect();
			
		},

		bindKeys : function(){

			ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
			ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
			ig.input.bind( ig.KEY.UP_ARROW, 'up' );
			ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
			ig.input.bind( ig.KEY.S, 'dropbomb' );

			ig.input.bind( ig.KEY.M, 'restartmap' );
			
		},

		connect : function(){

			_this = this;

			this.server = io.connect('http://bomberman.tank:3000');


			this.server.on( 'playermove', function( data ) {

				if ( data.data === "error" ) {

					console.log( data.errorMessage );

					return false;
				}

				//console.log( data ) ;

				_this.players[data.playerId].move( data.x, data.y );

			});

			this.server.on( 'newplayer', function( data ) {
				
				if ( data.data === "error" ) {

					console.log( data.errorMessage );

					return false;
				}

				_this.players[data.playerId] = _this.spawnEntity ( EntityPlayer , data.playerData.position.x, data.playerData.position.y );

			});

			this.server.on( 'getmap', function ( data ) {

				_this.loadMap( data );

				_this.spawnPlayers ( data.players, _this.server );

				_this.helperHtml.updatePlayersTable ( data.players );

			});

			this.server.on( 'updateplayers' , function ( data ) {

				_this.spawnPlayers ( data, _this.server );

				_this.helperHtml.updatePlayersTable ( data );

			});

			this.server.on( 'initplayer', function( data ) {
				
				if ( data.data === "error" ) {

					console.log( data.errorMessage );

					return false;
				}
				
				_this.updateCurrentPlayerData( data.playerData );
				
				this.emit('getmap');

			});

			this.server.on( 'connect', function() {
				
				var sessionId = _this.helper.getSessionId();

				this.emit( 'initplayer', { 'sessionId' : sessionId } );

				_this.bindKeys();

			});
			
		},

		updateCurrentPlayerData : function ( playerData ) {

			this.player.id = playerData.playerId;
			this.player.sessionId = playerData.sessionId;
			this.player.socketId = playerData.socketId;
			
		},

		spawnPlayers : function ( players, server ) {

			this.removeAllPlayersEntities();

			this.clearPlayers();

			for (var key in players) {

				var obj = players[key];
				
				if ( obj === null ) continue;

				this.players[obj.playerId] = this.spawnEntity ( EntityPlayer, obj.x, obj.y );

				this.players[obj.playerId].connectId( obj.playerId );

				this.players[obj.playerId].setColor( obj.playerId );

				if ( obj.playerId === this.player.id ) {

					this.players[obj.playerId].connect( server, this.player.sessionId );
				}
				
			}
			
		},

		removeAllPlayersEntities : function() {

			var temp = this.getEntitiesByType( 'EntityPlayer' );

			for ( var i = 0 ; i < temp.length ; i++ ){

				this.removeEntity( temp[i] );
			}

			return false;

		},

		clearPlayers : function() {

			for (var key in this.players) {

				this.players[key] = null;

			}

			return false;

		},

		update: function() {

			if( ig.input.state("restartmap") ) {

				this.server.emit('restartmap');

			}

			//TODO : do przeniesienia do player.js

			if( ig.input.state("dropbomb") ) {

				_this = this;

				if ( this.justDroppedBomb === false){

					this.justDroppedBomb = true;

					this.server.emit('dropbomb');

					setTimeout( function(){ _this.setJustDroppedBombFalse(); } , 200 );
					
				}

			}
			
			this.parent();

		},

		setJustDroppedBombFalse : function () {

			this.justDroppedBomb = false;
			
			return;

		},

		draw: function() {

			this.parent();
			
		},

//		manageBombs : function() {
//
//			this.mapBombs = this.player.bombs.slice(0);
//
//			this.counterTemp++;
//
//			for ( i = 0; i < this.mapBombs.length; i++){
//
//				if (  this.mapBombs[i]['finished'] ){
//
//					for( var j = 0; j < this.mapBombs[i].bombPower ; j++ ){
//
//						this.deleteTileFromMap ( parseInt( this.mapBombs[i].last.x / this.tilesSize + j ) , parseInt( this.mapBombs[i].last.y / this.tilesSize ) );
//						this.deleteTileFromMap ( parseInt( this.mapBombs[i].last.x / this.tilesSize - j ), parseInt( this.mapBombs[i].last.y / this.tilesSize ) );
//						this.deleteTileFromMap ( parseInt( this.mapBombs[i].last.x / this.tilesSize ) , parseInt( this.mapBombs[i].last.y / this.tilesSize + j ) );
//						this.deleteTileFromMap ( parseInt( this.mapBombs[i].last.x / this.tilesSize ) , parseInt( this.mapBombs[i].last.y / this.tilesSize - j ) );
//					}
//
//					this.mapBombs.splice( i , 1 );
//					this.player.removeBomb( i );
//
//					i--;
//
//				}
//
//			}
//
//		},

		loadMap : function( data ){

			this.mapCollisions = data.mapCollisions ;
			this.mapTiles = data.mapTiles;

			this.collisionMap = new ig.CollisionMap( this.tilesSize , this.mapCollisions );

			this.map = new ig.BackgroundMap( this.tilesSize , this.mapTiles, this.tilesImage );

			this.backgroundMaps.push( this.map );

		}

	});

	ig.main( '#gameCanvas', MyGame, 60, 1120, 1120, 1 );

});
