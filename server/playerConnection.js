function PlayerConnection() {

	this.playerId = null;
	this.socketId = null;
	this.sessionId = null;

	this.ready = true;


	this.setPlayerId = function ( playerId ) {

		this.playerId = playerId;
		
	};

	this.setSessionId = function ( sessionId ) {

		this.sessionId = sessionId;

	};

	this.setSocketId = function ( socketId ) {

		this.socketId = socketId;

	};

	this.getPlayerId = function ( ) {

		return this.playerId;

	};

	this.getSessionId = function ( ) {

		return this.sessionId;

	};

	this.getSocketId = function ( ) {

		return this.socketId;

	};

	this.getReady = function ( ) {

		return this.ready;

	}
	

}

exports.PlayerConnection = PlayerConnection;
