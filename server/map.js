var player = require('./player.js');

function Map() {

	this.tileSize = 32;
	this.tileSizeMid = Math.floor( this.tileSize / 2 );
	
	this.mapGeneratorBrickChance = 50; // how often floor can be brick
	this.mapGeneratorWallChance = 40; // walls can be generated where x % 4 !== 0 && y % 4 !== 0, after checking it we then draw using random()
	this.mapGeneratorPowerupChance = 30; 

	this.mapTiles = []; // draw basic map, 1 - stone, 2 - floor, 3 - brick
	this.mapCollisions = []; // check for collisions for player movement, 0 - no collision, 1 - collision
	this.mapPowerups = []; // where power ups are hidden under bricks, 0 - no powerup, 1 - life, 2 - speed, 3 - bomb, 4 - range, 5 - god, 6 - miner
	this.mapEntities = []; // what is being shown besides player and tiles, 0 - empty, 1-9 players, 10 - bomb, 11 - life, 12 - speed, 13 bomb (power up), 14 range, 15 god mode, 16 miner

	this.players = { 1:null, 2:null, 3:null, 4:null, 5:null };

	this.mapSizeX = 35;
	this.mapSizeY = 30;
	this.mapMidX = 0;
	this.mapMidY = 0;

	this.generate = function() {

		this.mapTiles = [];
		this.mapCollisions = [];
		this.mapPowerups = [];
		this.mapEntities = [];

		this.mapMidX = Math.floor( this.mapSizeX / 2 );
		this.mapMidY = Math.floor( this.mapSizeY / 2 );

		var debug = { 'all' : 0, 'bricks' : 0, 'couldbewalls' : 0, 'walls' : 0, 'floor' : 0, 'powerups' : 0, 'powerups_bomb' : 0, 'powerups_range' : 0, 'powerups_life' : 0, 'powerups_speed' : 0, 'powerups_god' : 0 , 'powerups_miner' : 0 };
		
		for( var y = 0; y < this.mapSizeY ; y++ ){

			var rowTiles = [], rowCollision = [], rowPowerups = [], rowEntities = [];

			for( var x = 0; x < this.mapSizeX ; x++ ){
				
				// we just draw entities map
				rowEntities[x] = 0;

				// map walls
				if ( x === 0 || x === this.mapSizeX - 1 || y === 0 || y === this.mapSizeY - 1 ) {

					rowTiles[x] = 1;
					rowCollision[x] = 1;
					rowPowerups[x] = 0;
					continue;

				}

				debug.all++;

				// floor planned for players start-up positions
				if (
					// player 1
					( x === 1 && y === 1 ) || ( x === 2 && y === 1 ) || ( x === 1 && y === 2 )
					|| // player 2
					( x === this.mapSizeX - 2 && y === this.mapSizeY - 2 ) || ( x === this.mapSizeX - 3 && y === this.mapSizeY - 2 ) || ( x === this.mapSizeX - 2 && y === this.mapSizeY - 3 )
					|| // player 3
					( x === this.mapSizeX - 2 && y === 1 ) || ( x === this.mapSizeX - 3 && y === 1 ) || ( x === this.mapSizeX - 2 && y === 2 )
					|| // player 4
					( x === 1 && y === this.mapSizeY - 2 ) || ( x === 2 && y === this.mapSizeY - 2 ) || ( x === 1 && y === this.mapSizeY - 3 )
					|| // player 5
					( x === this.mapMidX && y === this.mapMidY ) || ( x === this.mapMidX + 1 && y === this.mapMidY + 1 ) || ( x === this.mapMidX && y === this.mapMidY + 1 ) || ( x === this.mapMidX - 1 && y === this.mapMidY - 1 ) || ( x === this.mapMidX && y === this.mapMidY - 1 )
				) {

					debug.floor++;
					
					rowTiles[x] = 2;
					rowCollision[x] = 0;
					rowPowerups[x] = 0;

					continue;
				}
				
				// map bricks and powerups
				if ( Math.random() * 100 < this.mapGeneratorBrickChance ) {

					rowTiles[x] = 3;
					rowCollision[x] = 1;

					debug.bricks++;

					if ( Math.random() * 100 > this.mapGeneratorPowerupChance ) {

						// no powerups here
						rowPowerups[x] = 0;
						continue;
					}

					debug.powerups++;

					// now we draw specific powerups
					var powerup = Math.random() * 100;

					// bomb 35 % chance
					if ( powerup < 35 ) {

						debug.powerups_bomb++;

						rowPowerups[x] = 3;
						continue;
					}

					// range 35 % chance
					if ( powerup < 70 ) {

						debug.powerups_range++;

						rowPowerups[x] = 4;
						continue;
					}

					// speed 10 % chance
					if ( powerup < 80 ) {

						debug.powerups_speed++;

						rowPowerups[x] = 2;
						continue;
					}

					// life 10 % chance
					if ( powerup < 90 ) {

						debug.powerups_life++;

						rowPowerups[x] = 1;
						continue;
					}

					// god mode 10 % chance
					if ( powerup < 95 ) {

						debug.powerups_god++;

						rowPowerups[x] = 5;
						continue;
					}

					debug.powerups_miner++;

					// miner 5% chance
					rowPowerups[x] = 6;
					continue;
				}

				rowPowerups[x] = 0;

				if ( x > 1 && x < this.mapSizeX - 2 && y > 1 && y < this.mapSizeY - 2 && x % 4 !== 0 && y % 4 !== 0 ) {

					debug.couldbewalls++;

					if( Math.random() * 100 < this.mapGeneratorWallChance ) {

						debug.walls++;

						rowTiles[x] = 1;
						rowCollision[x] = 1;
						continue;

					}

				}				

				debug.floor++;

				rowTiles[x] = 2;
				rowCollision[x] = 0;
			}

			this.mapCollisions.push ( rowCollision );
			this.mapPowerups.push ( rowPowerups );
			this.mapEntities.push ( rowEntities );
			this.mapTiles.push( rowTiles );
		}
		
		console.log( debug );

	};

	this.playersAdd = function( slots ) {

		var tmp = slots.getReadyPlayers( );

		if ( tmp === [] ) {

			console.warn( "ERROR EMPTY READY PLAYERS LIST" );
			return false;
		}

		for( var i = 0; i < tmp.length; i++ ) {

			var pid = tmp[i];

			this.players[pid] = new player.Player;
			this.players[pid].setPlayerId( pid );
			this.players[pid].setTileSize( this.tileSize, this.tileSizeMid );
			this.players[pid].setTileMax( this.mapSizeX -2, this.mapSizeY -2 );

			if ( i === 0 ) {

				this.players[pid].setPositionTile( 1, 1 );
				continue;
			}

			if ( i === 1 ) {

				this.players[pid].setPositionTile( this.mapSizeX - 2, this.mapSizeY - 2 );
				continue;
			}

			if ( i === 2 ) {

				this.players[pid].setPositionTile( this.mapSizeX - 2, 1 );
				continue;
			}

			if ( i === 3 ) {

				this.players[pid].setPositionTile( 1, this.mapSizeY - 2 );
				continue;
			}

			if ( i === 4 ) {

				this.players[pid].setPositionTile( this.mapMidX, this.mapMidY );
				continue;
			}
		}

	};

	this.playerRemove = function ( playerId ){
		
		this.players[ playerId ] = null;
		
		return true;

	};

	this.getPlayers = function ( ){

		return this.players;

	};

	this.playerCheck = function ( id ) {

		return ( this.players[id] === null ) ? false : true;
		
	};

	this.playerMove = function( id, x, y ) {
		
		if ( this.players[id].move( this.mapEntities, this.mapCollisions, x, y ) === false ) {

			return false;
		}
		
	};

}

exports.Map = Map;
