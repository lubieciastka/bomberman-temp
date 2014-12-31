ig.module(

	"game.entities.bomb"

).requires(

	"impact.entity",
	"game.entities.bombflame"

).defines(function(){

	EntityBomb = ig.Entity.extend({

		size: { x : 32, y : 32 },
		
		bombTimer : null,

		lifeTime : 2, // lifetime obiektu w sekundach
		
		counter : 0,
		bombPower : 2,

		_isAnimationFinished : 0,

		animSheet: new ig.AnimationSheet("media/bomb.png", 32, 32),

		init: function(x, y, settings){
			
			this.parent(x, y, settings);
			
			this.addAnim( "idle" , 1 , [ 29 ] );
			this.addAnim( "active" , 0.6 , [ 24,25,26,27,28 ] );


			this.bombTimer = new ig.Timer();
			this.bombTimer.set( 3 );
			
		},

		update: function(){
			
			if( this.bombTimer.delta() > 0 ) {
				
				this.currentAnim = this.anims.active;

				if ( this.counter < 1 ){

					// Dodajemy płomienie, które sa EntityBombflame = innym entities
					
					for( var i = 1; i < this.bombPower ; i++ ){


						ig.game.spawnEntity( EntityBombflame, this.pos.x + i * 32, this.pos.y , { direction : "right1"} );
						ig.game.spawnEntity( EntityBombflame, this.pos.x - i * 32, this.pos.y , { direction : "left1"} );

						ig.game.spawnEntity( EntityBombflame, this.pos.x, this.pos.y + i * 32 , { direction : "down1"} );
						ig.game.spawnEntity( EntityBombflame, this.pos.x, this.pos.y - i * 32 , { direction : "up1"} );

					}

					this.counter++;
				}
				
			}

			if( this.bombTimer.delta() > this.lifeTime ) {

				//po 2 sekundach killujemy objekt z planszy

				this._isAnimationFinished = 1;
				
				this.kill();

			}

			this.parent();

		},

		isDone : function(){

			return this._isAnimationFinished;
		}

	});

});
