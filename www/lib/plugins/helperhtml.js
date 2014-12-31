ig.module(

    'plugins.helperhtml'

)
.requires(

    'impact.impact'

)
.defines(function() {

    Helperhtml = ig.Class.extend({

        entity: null,

        init:function(entity) {

	    this.entity = entity;

        },

	updatePlayersTable : function ( data ){

		this.clearAllTableData();

		for (var key in data) {

			var obj = data[key];

			if ( obj === null ) continue;

			$('.player-' + obj.playerId ).show();

			this.updatePlayersTableHealth ( obj.playerId , obj.life );
			this.updatePlayersTableBombs( obj.playerId , obj.bombs );

		}

		return false;

	},

	clearAllTableData : function ( ){

		$('#players-list .player').hide();

		$('#players-list .player .life').remove();
		$('#players-list .player .bomb').remove();

	},

	updatePlayersTableHealth : function ( playerId, health ) {

		for ( var i = 0 ; i < health ; i++){

			$('.player-' + playerId + " .lifes").append('<div class="life"></div>');
		}

		return false;

	},

	updatePlayersTableBombs : function ( playerId, bombs ) {

		for ( var i = 0 ; i < bombs ; i++){

			$('.player-' + playerId + " .bombs").append('<div class="bomb"></div>');
		}

		return false;

	}

    });

});
