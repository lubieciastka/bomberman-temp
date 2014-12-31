function MapEntity() {

	this.x = 0;
	this.y = 0;

	this.tileX = 0;
	this.tileY = 0;

	this.tileSize = 0;
	this.tileMid = 0;
	this.tileMaxX = 0;
	this.tileMaxY = 0;

	this.maxX = 0;
	this.maxY = 0;

	this.getPosition = function( ) {
		
		return { 'x' : this.x, 'y' : this.y, 'tileX' : this.tileX, 'tileY' : this.tileY };
	};

	this.setPositionTile = function ( tileX, tileY ){

		if ( tileX < 1 || tileX > this.tileMaxX || tileY < 1 || tileY > this.tileMaxY ) {

			return false;
		}

		this.tileX = tileX;
		this.tileY = tileY;

		this.setPositionXYTile( tileX, tileY );

		return true;
	};

	this.setPositionTileXY = function ( x, y ){

		this.tileX = Math.floor( x / this.tileSize );
		this.tileY = Math.floor( y / this.tileSize );
	};


	this.setPositionXY = function ( x, y ){

		if ( x < this.tileSize + this.tileMid || x > this.maxX || y < this.tileSize + this.tileMid || y > this.maxY ) {

			return false;
		}

		this.x = x;
		this.y = y;

		this.setPositionTileXY( x, y );
		return true;
	};

	this.setPositionXYTile = function ( tileX, tileY ){

		this.x = (tileX) * this.tileSize + this.tileMid;
		this.y = (tileY) * this.tileSize + this.tileMid;
	};

	this.setTileMax = function ( tileMaxX, tileMaxY ){

		this.tileMaxX = tileMaxX;
		this.tileMaxY = tileMaxY;

		this.maxX = (tileMaxX) * this.tileSize + this.tileMid;
		this.maxY = (tileMaxY) * this.tileSize + this.tileMid;
	};

	this.setTileSize = function ( tileSize, tileMid ){

		this.tileSize = tileSize;
		this.tileMid = tileMid;
	};

}

exports.MapEntity = MapEntity;
