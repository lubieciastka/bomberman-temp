ig.module(

	"game.entities.bombflame"

).requires(

	"impact.entity"

).defines(function(){

	EntityBombflame = ig.Entity.extend({

		size: { x : 32, y : 32 },

		bombTimer : null,

		lifeTime : 1,

		direction : null,

		animations : {

			"up1" : [ 0 , 1 , 2 , 3 ],
			"down1" : [ 8 , 9 , 10 , 11 ],
			"left1" : [ 12 , 13 , 14 , 15 ],
			"right1" : [ 4 , 5 , 6 , 7 ]
		},

		type: ig.Entity.TYPE.A,

		animSheet: new ig.AnimationSheet("media/bomb.png", 32, 32),

		init: function(x, y, settings){

			this.parent(x, y, settings);
			
			this.addAnim( "active" , 0.5 , this.animations[this.direction]);
			
			this.bombTimer = new ig.Timer();
			this.bombTimer.set( 1 );

		},

		update: function(){

			if( this.bombTimer.delta() > this.lifeTime ) {

				this.kill();
			}

			this.parent();

		}

	});

});
