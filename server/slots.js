var playerConnection = require('./playerConnection.js');

function Slots() {

	this.slots = { 1:null, 2:null, 3:null, 4:null, 5:null };

	this.getFreeSlot = function( ) {

		for( i = 1; i < 6; i++ ) {

			if ( this.slots[i] === null ) {

				return i;
				
			}
		}

		return false;
		
	};

	this.getPlayerConnectionByPlayerId = function( playerId ) {

		return this.slots[playerId];
		
	};

	this.getPlayerConnectionBySessionId = function( sessionId ) {

		for( i = 1; i < 6; i++ ) {

			if ( this.slots[i] === null ) {

				continue;
			}

			if ( this.slots[i].getSessionId()  === sessionId ) {

				return this.slots[i];
			}
		}

		return false;
	};

	this.freeSlotBySocketId = function ( socketId ){

		for( i = 1; i < 6; i++ ) {

			if ( this.slots[i] === null ) {

				continue;
			}

			if ( this.slots[i].getSocketId()  === socketId ) {

				this.slots[i] = null;

				return true;

			}
		}

		return false;

	};

	this.getPlayerConnectionBySocketId = function( socketId ) {

		for( i = 1; i < 6; i++ ) {

			if ( this.slots[i] === null ) {

				continue;
			}

			if ( this.slots[i].getSocketId()  === socketId ) {

				return this.slots[i];
			}
		}

		return false;
	};

	this.newPlayerConnection = function( socketId, sessionId ) {

		var id = this.getFreeSlot( );

		if ( id === false ) {

			return false;

		}

		var p = new playerConnection.PlayerConnection();

		p.setSocketId ( socketId );
		p.setSessionId ( sessionId );
		p.setPlayerId ( id );

		this.slots[id] = p;

		return p;
		
	};

	this.getReadyPlayers = function( ) {

		var ready = [];

		for( i = 1; i < 6; i++ ) {

			if ( this.slots[i] === null ) {

				continue;
			}

			if ( this.slots[i].getReady() ) {

				ready.push( i );
			}
		}
		
		return ready;
	}

}

exports.Slots = Slots;
