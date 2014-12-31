ig.module(

	"game.entities.player"

).requires(

	"impact.entity",
	"game.entities.bomb"

).defines(function(){

	EntityPlayer = ig.Entity.extend ( {

		size: { x : 32, y : 32 },
		offset: { x : 0, y : 0 },

		type: ig.Entity.TYPE.B,
		
		speed: 1,

		positionX : 1,
		positionY : 1,

		checkAgainst: ig.Entity.TYPE.A,

		tilesSize : 32,

		bombs : [],

		playerId : null,
		server : null,
		sessionId : null,

		maxVel: {x: 500, y: 500},
		slope: { x: { make: false, speed: 0 }, y: { make: false, speed: 0 } },
		acceleration: 100,

		direction : {
			'UP': "up",
			'DOWN': "down",
			'LEFT': "left",
			'RIGHT': "right"
		},

		playerColorsList : { 1 : 'white' , 2 : 'green' , 3 : 'red' , 4 : 'blue' , 5 : 'yellow' },
		playerColor : "white",

		colorShift : {

			'white' : 0,
			'green' : 20,
			'red' : 40,
			'blue' : 60,
			'yellow' : 78 // TODO KUBA: sprawdzic dlaczego tutaj jest 78 a nie 80 ? zrobic check mapy animacji
		},

		animSheet: new ig.AnimationSheet( "media/player.png", 32, 32 ),

		init: function( x , y , settings ) {

			this.parent( x - 16, y - 16 , settings);
			
			this.positionX = x;
			this.positionY = y;
			
		},

		prepareAnimations : function( ) {

			var shift = this.colorShift [ this.playerColor ];

			this.addAnim( "idle" , 1 , [ shift ] );

			this.addAnim( "down" , 0.2 , [ shift , shift + 1 , shift + 2 ] );
			this.addAnim( "right" , 0.2 , [ shift + 3 , shift + 4 , shift + 5 ] );
			this.addAnim( "left" , 0.2 , [ shift + 6 , shift + 7 , shift + 8 ] );
			this.addAnim( "up" , 0.2 , [ shift + 9 ,  shift + 10 , shift + 11 ] );
			
			//this.addAnim( "kill" , 0.2 , [ 12 , 13 , 14 , 15 , 16 , 17 , 18 , 19 ] );

		},

		connect : function ( server, sessionId ) {

			this.server = server;
			this.sessionId = sessionId;
			
		},

		connectId : function ( playerId ) {

			this.playerId = playerId;

		},
		
		setColor : function ( playerId ){

			this.playerColor = this.playerColorsList[playerId];

			this.prepareAnimations ( );

		},

		check : function ( other ){
			
			this.kill();
		},
		
		update: function() {

			if ( this.sessionId !== null ) {

				this.move();
			}
			
			// movement & collision
			var mx = Math.round( this.vel.x * ig.system.tick * 10 ) / 10;
			var my = Math.round( this.vel.y * ig.system.tick * 10 ) / 10;
			
			var res = ig.game.collisionMap.trace(
				this.pos.x, this.pos.y, mx, my, this.size.x, this.size.y
			);
			this.handleMovementTrace( res );

			if( this.currentAnim ) {
				this.currentAnim.update();
			}

		},

		removeBomb : function ( i ){

			this.bombs.splice( i , 1 );
		},

		manageBombs : function(){

			if( this.bombs.length < 1) return false;

			for ( var i = 0; i < this.bombs.length ; i++ ){

				if ( this.bombs[i].isDone() ) {

					this.bombs[i]['finished'] = 1;

				}

			}

			return false;
			
		},
		
		/*
		tryMove : function ( direction ) {

			if( direction  === "left" ){

				this.server.emit( 'playermove', { 'sessionId' : this.sessionId, 'playerId' : this.playerId, 'x' : this.positionX - this.speed , 'y' : this.positionY } );

				return false;
				
			}

			else if( direction  === "right" ){

				this.server.emit( 'playermove', { 'sessionId' : this.sessionId, 'playerId' : this.playerId, 'x' : this.positionX + this.speed , 'y' : this.positionY } );

				return false;

			}

			else if( direction  === "down" ){

				this.server.emit( 'playermove', { 'sessionId' : this.sessionId, 'playerId' : this.playerId, 'x' : this.positionX, 'y' : this.positionY + this.speed } );

				return false;

			}

			else if( direction  === "up" ){

				this.server.emit( 'playermove', { 'sessionId' : this.sessionId, 'playerId' : this.playerId, 'x' : this.positionX, 'y' : this.positionY - this.speed } );

				return false;

			}

			return false;
			
		},*/

		move : function ( ) {
			
			var anim = false;
			this.vel.x = 0;
			this.vel.y = 0;

			if ( this.slope.x.make === 'move' ) {

				this.vel.x = this.slope.x.speed;

			} else if ( this.slope.x.make === 'jump' ) {

				this.pos.x = Math.round( this.pos.x ) +  this.slope.x.speed;
			}

			if ( this.slope.y.make === 'move' ) {

				this.vel.y = this.slope.y.speed;

			} else if ( this.slope.y.make === 'jump' ) {

				this.pos.y = Math.round( this.pos.y ) + this.slope.y.speed;
			}

			if( ig.input.state("left") ) {

				//this.vel.y = this.slope.y;
				this.vel.x = - this.speed * this.acceleration;
				this.setAnimation ( "left" );
				anim = true;

			} else if ( ig.input.state("right") ) {

				//this.vel.y = this.slope.y;
				this.vel.x = this.speed * this.acceleration;
				this.setAnimation ( "right" );
				anim = true;
				
			}

			if( ig.input.state("down") ) {

				this.vel.y = this.speed * this.acceleration;
				this.setAnimation ( "down" );
				anim = true;

			} else if ( ig.input.state("up") ) {

				this.vel.y = - this.speed * this.acceleration;
				this.setAnimation ( "up" );
				anim = true;

			}

			if ( !anim ) {

				this.setAnimation ( "idle" );
			}

			return false;

		},

		handleMovementTrace: function( res ) {

//			if ( res.collision.y || res.collision.x ) {
//
//				console.log( this.pos );
//			}


			this.slope.x = { make: false, speed: 0 };
			this.slope.y = { make: false, speed: 0 };
			var slope = false;

			if ( res.collision.y && this.vel.y > 32 ) {

//				console.log( this.pos.x );

				slope =  this.verifySlopeOptionsX( -1, 1 );
				slope = slope === false ? this.verifySlopeOptionsX( 1, 1 ) : slope;

				if ( slope !== false ) {
					
//					console.log( 'slope = ' );
//					console.log( slope );

					this.slope.x = slope;
					this.parent(res);
					return;

				}
			}

			if ( res.collision.y && this.vel.y < -32 ) {

//				console.log( this.pos.x );

				slope =  this.verifySlopeOptionsX( -1, -1 );
				slope = slope === false ? this.verifySlopeOptionsX( 1, -1 ) : slope;

				if ( slope !== false ) {

//					console.log( 'slope = ' );
//					console.log( slope );

					this.slope.x = slope;
					this.parent(res);
					return;

				}
			}

			if ( res.collision.x && this.vel.x > 32 ) {

//				console.log( this.pos.y );

				slope =  this.verifySlopeOptionsY( -1, 1 );
				slope = slope === false ? this.verifySlopeOptionsY( 1, 1 ) : slope;

				if ( slope !== false ) {

//					console.log( 'slope = ' );
//					console.log( slope );

					this.slope.y = slope;
					this.parent(res);
					return;

				}

			}

			if ( res.collision.x && this.vel.x < -32 ) {

//				console.log( this.pos.y );

				slope =  this.verifySlopeOptionsY( -1, -1 );
				slope = slope === false ? this.verifySlopeOptionsY( 1, -1 ) : slope;

				if ( slope !== false ) {

//					console.log( 'slope = ' );
//					console.log( slope );

					this.slope.y = slope;
					this.parent(res);
					return;

				}
				
			}

			this.parent(res);

			this.pos.x = Math.round( this.pos.x * 10 ) / 10;
			this.pos.y = Math.round( this.pos.y * 10 ) / 10;
			
		},

		verifySlopeOptionsX: function( slopeDirection, movementDirection ) {

			var max = (this.size.x - 2)*10;

			for ( var i=1; i<max; i++ ) {

				tmpx = Math.round( ( this.pos.x + i/10 * slopeDirection ) * 10 ) / 10;

				var tmp = ig.game.collisionMap.trace( tmpx , this.pos.y, 0, movementDirection, this.size.x, this.size.y );

//				console.log( 'X = ' + this.pos.x + ' I = ' + i + ' x+di = ' + (tmpx) );

				if ( tmp.collision.y === false ) {

//					console.log( 'SLOPE X TEST : ( ' + this.pos.x + ' : ' + this.pos.y + ' ) = OK' );

					if ( i < 5 ) {

						return { make : 'jump', speed : 0 }
					}

					if ( i < 15 ) {

						return { make : 'jump', speed : slopeDirection }
					}

					if ( i < 45 ) {

						return { make : 'move', speed : ( slopeDirection * this.acceleration / 4 ) }
					}

					return { make : 'move', speed : ( slopeDirection * this.speed * this.acceleration ) }
				}
			}

//			console.log( 'SLOPE X TEST : ( ' + this.pos.x + ' : ' + this.pos.y + ' = FALSE' );
			return false;
		},

		verifySlopeOptionsY: function( slopeDirection, movementDirection ) {

			var max = (this.size.y - 2)*10;

			for ( var i=1; i<max; i++ ) {

				tmpy = Math.round( ( this.pos.y + i/10 * slopeDirection ) * 10 ) / 10;

				var tmp = ig.game.collisionMap.trace( this.pos.x, tmpy , movementDirection, 0, this.size.x, this.size.y );

//				console.log( 'Y = ' + this.pos.y + ' I = ' + i + ' y+di = ' + (tmpy) );

				if ( tmp.collision.x === false ) {

//					console.log( 'SLOPE Y TEST : ( ' + this.pos.x + ' : ' + this.pos.y + ' ) = OK' );

					if ( i < 5 ) {

						return { make : 'jump', speed : 0 }
					}

					if ( i < 15 ) {

						return { make : 'jump', speed : slopeDirection }
					}

					if ( i < 45 ) {

						return { make : 'move', speed : ( slopeDirection * this.acceleration / 2 ) }
					}

					return { make : 'move', speed : ( slopeDirection * this.speed * this.acceleration ) }
				}
			}

//			console.log( 'SLOPE Y TEST : ( ' + this.pos.x + ' : ' + this.pos.y + ' = FALSE' );
			return false;
		},
		
		/*
		move : function ( x, y ) {

			this.positionX = x;
			this.positionY = y;

			this.pos.x = this.positionX - 16;
			this.pos.y = this.positionY - 16;

			this.currentAnim = this.anims.idle; //TODO : to jest hax, i tego nie powinno tutaj chyba byc, ale jest, bo działa w kilku przypadkach :) do refaktoryzacji kiedyś tam :)

		},*/

		setAnimation : function ( direction ){

			if( direction  === "left" ){

				this.currentAnim = this.anims.left;

				return false;

			}

			if( direction  === "right" ){

				this.currentAnim = this.anims.right;

				return false;

			}

			if( direction  === "down" ){

				this.currentAnim = this.anims.down;

				return false;

			}

			if( direction  === "up" ){

				this.currentAnim = this.anims.up;

				return false;

			}

			this.currentAnim = this.anims.idle;
			return false;

		},

//		checkInput : function () {
//
//			if( ig.input.pressed('shoot') ) {
//
//				this.dropBomb ( this.pos.x, this.pos.y );
//			}
//			
//		},

		dropBomb : function ( x , y ){

			x =  parseInt( x / this.tilesSize ) ;
			y = parseInt( y / this.tilesSize ) ;

			ig.game.collisionMap.data[y][x] = 1;
			this.bombs.push( ig.game.spawnEntity( EntityBomb , x * this.tilesSize, y * this.tilesSize ) );

		}


	});

});
