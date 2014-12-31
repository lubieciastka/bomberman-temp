ig.module(

    'plugins.helper'

)
.requires(

    'impact.impact'

)
.defines(function() {

    Helper = ig.Class.extend({

        entity: null,

        init:function(entity) {
            
	    this.entity = entity;

        },
	
	getSessionId : function ( ){

		if( this.getCookie ( 'sessionId' ) === "" ){

			sessionId = this.makeSessionId( );
			this.setCookie( 'sessionId' , sessionId , 1 );

			return sessionId;

		}

		return this.getCookie ( 'sessionId' );

	},

	setCookie : function( cname , cvalue , exdays ){

		var d = new Date();

		d.setTime( d.getTime() + ( exdays * 24 * 60 * 60 * 1000 ) );

		var expires = "expires=" + d.toGMTString();

		document.cookie = cname + "=" + cvalue + "; " + expires;

	},

	getCookie : function( cname ){

		var name = cname + "=";

		var ca = document.cookie.split(';');

		for(var i = 0 ; i < ca.length ; i++) {

			var c = ca[i].trim();

			if (c.indexOf(name) == 0) return c.substring(name.length,c.length);

		}

		return "";

	},

	makeSessionId : function( ){

		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for( var i = 0 ; i < 32 ; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;

	}

    });
    
});
