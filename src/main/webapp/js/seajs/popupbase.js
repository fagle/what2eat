define( function( require, exports, module ) {
	var UIBase = require( 'uibase' );

	//弹窗基础类
	var PopupBase = function( openAndClose ) {
	    UIBase.call( this );
	    
	    var self = this;

	    this.open = function() {
	        openAndClose.open();
	    }
	    
	    this.close = function() {
	        openAndClose.close();
	    }
	    
	    this._close = function() {
	        this.fireEvent( 'mouseClickClose' );
	        this.close();    
	    }
	    
	    
	    var supperDispose = this.dispose;
	    this.dispose = function() {
	        supperDispose.apply( this, arguments );
	        this.fireEvent( 'disposed' );
	    }
	    
	    this.initialize = function() {
	        this.render( document.body );
	        this.getJDom().hide();
	        openAndClose.setJDom( this.getJDom() );
	        openAndClose.addListener( 'opened', function() {
	            self.fireEvent( 'opened' );
	        });
	        openAndClose.addListener( 'closed', function() {
	            self.fireEvent( 'closed' );
	        });
	        
	        this.fireEvent( 'initialized' );
	    }
	}

	module.exports = PopupBase;	
});