ig.module(

	"game.entities.paczka"

).requires(

	"impact.entity"

).defines(function(){

	EntityPaczka = ig.Entity.extend({

		size: { x : 32, y : 32 },

		type: ig.Entity.TYPE.A,

		bombTimer : null,

		animSheet: new ig.AnimationSheet("media/wall.png", 32, 32),

		init: function(x, y, settings){

			this.parent(x, y, settings);
			
			this.addAnim( "active" , 0.3 , [ 2 , 3 , 4 , 5 , 6 , 7 ] );
		}

	});

});
