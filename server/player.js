
var mapEntity = require('./mapEntity.js');

function Player() {

	this.playerId = null;

	this.life = 2; // default 1
	this.bombs = 1; // defalt 1

	this.bombsMax = 3;
	this.lifeMax = 3;

	this.powers = { 'lives' : 2, 'bombs' : 1, 'speed' : 2, 'god' : false, 'miner' : false }

	this.setPlayerId = function ( playerId ){

		this.playerId = playerId;
	};

	this.getPlayerId = function ( ){

		return this.playerId;
	};

	// TODO : tu jest prawdopodobnie gdzies blad logiczny -> more info : ask Kuba
	
	this.move = function ( entities, collisions, x, y ) {
		
		var opos = this.getPosition( );

		if ( this.setPositionXY( x, y ) === false ) {

			return false;
		}

		var npos = this.getPosition( );

		if ( opos['tileX'] !== npos['tileX'] || opos['tileY'] !== npos['tileY'] ) {

			if ( collisions[ npos['tileY'] ][ npos['tileX'] ] === 1 ) {

				//TODO : wywala mi sie tutaj w przypadku jezeli jest dwoch playerow na mapie
				//i drugi player proboje chodzic
				
				// we got collision, we need to rewind

				this.setPositionXY( opos['x'], opos['y'] );

				return false;
				
			}

			collisions[ npos['tileY'] ][ npos['tileX'] ] = 1;
			collisions[ opos['tileY'] ][ opos['tileX'] ] = 0;

			entities[ npos['tileY'] ][ npos['tileX'] ] = this.getPlayerId();
			entities[ opos['tileY'] ][ opos['tileX'] ] = 0;

			return npos;
		}

		return true;
	};

	this.setBombs = function ( bombs ){

		if ( bombs > this.bombsMax ) return false;

		this.bombs = bombs;

		return true;

	};

	this.getBombs = function ( ){

		return this.bombs;
	};

	this.setLife = function ( life ){

		if ( life > this.lifeMax ) return false;

		this.life = life;

		return true;

	};

	this.getLife = function ( ){

		return this.life;
	};

}

Player.prototype = new mapEntity.MapEntity();

exports.Player = Player;
