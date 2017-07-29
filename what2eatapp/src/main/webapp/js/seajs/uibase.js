define( function( require, exports, module ) {
	var EventBase = require( 'eventbase' );

	var magic = '$ROOT';
	var root = window[ magic ] = {};
	var uidCount = 0;

	var UIBase = function() {
	    EventBase.call( this );
		
		var self = this;
		var id;
		var globalKey;
		
		var setGlobal = function( id, obj ) {
			root[ id ] = obj;
			return magic + '[\''+ id +'\']';
		}

		var unsetGlobal = function( id ) {
			delete root[ id ];
		}
		
		var formatHtml = function( tpl ) {
			return ( tpl
				.replace( /##/g, id )
				.replace( /\$\$/g, globalKey ) );
		}    
			
		var initUIBase = function() {
			id = 'UI-NODE-' + ( ++uidCount );
			globalKey = setGlobal( id, self );
		}
	
		
		this.render = function( holder ) {
			var html = this.renderHtml();
			var jquery = $( html );
			var target;
			if( holder == null ) {
				target = $( document.body );
			} else if( typeof( holder ) == 'string' ) {
				target = $( document.getElementById( holder ) );
			} else if( holder.constructor == $ ) {
				target = holder;
			} else {
			   target = $( holder );
			}
			target.append( jquery );
			
			this.fireEvent( 'renderComplete' );
		}
			
		this.renderReplace = function( target ) {
		   target.replaceWith( this.renderHtml() ); 
		   this.fireEvent( 'renderComplete' );
		}
				
		this.getJDom = function( elementId ) {
		   if( elementId ) {
			   return $( document.getElementById( id + elementId ) )
		   } else {
			   return $( document.getElementById( id ) );			   
		   }
		}
			
		this.getHtmlTpl = function() {
			return '';
		}
			
		this.renderHtml = function() {
			return formatHtml( this.getHtmlTpl() );
		}
			
		this.dispose = function() {
			var box = this.getJDom();
			box.remove();
			unsetGlobal( id );
		}
		
		this.getId = function() {
			return id;
		}
		
		this.getGlobalKey = function() {
			return globalKey;
		}
		
		initUIBase();
	}

	UIBase.getMagic = function() {
		return magic;
	}

	UIBase.get = function( id ) {
		return root[ id ];
	}

	module.exports = UIBase;
} );