ig.module(

	"game.entities.powerup"

).requires(

	"impact.entity"

).defines(function(){

	EntityPowerup = ig.Entity.extend({

		size: { x : 32, y : 32 },

		powerupTimer : null,

		animSheet: new ig.AnimationSheet("media/powerup.png", 32, 32),

		init: function(x, y, settings){

			this.parent(x, y, settings);

			this.addAnim( "idle" , 1 , [ 0 ] );
			
			//this.powerupTimer = new ig.Timer();
			//this.powerupTimer.set( 3 );

		},

		update: function(){

			
			this.parent();

		}

	});

});
