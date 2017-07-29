define( function( require, exports, module ) {
	var OpenAndCloseBase = require( 'openandclosebase' );
	//打开关闭方式类
	var OpenAndClose = function() {
	    OpenAndCloseBase.call( this );
	    
	    var self = this;
	    
	    this.setPosition = function() {
	        var jdom = self.getJDom();
	        var screenWidth = $( window ).width();
	        var screenHeight = $( window ).height();
	        var popWidth = jdom.width();
	        var popHeight = jdom.height();
	        var marginLeft = popWidth / 2 ;
	        var marginTop = popHeight / 2 > screenHeight / 2 ? screenHeight / 2 : popHeight / 2;
	        jdom.css( {
	            position: 'absolute',
	            zIndex: 999,
	            left: $( window ).width() / 2 - jdom.width() / 2,
	            top: $( document ).scrollTop() + $( window ).height()  / 2 - jdom.height() / 2
	        } );    
	    }
	    
	    this.open = function() {
	        this.setPosition();
	        self.getJDom().show();
	        this.fireEvent( 'opened' );
	    }
	    
	    this.close = function() {
	        self.getJDom().hide();
	        this.fireEvent( 'closed' );
	    }
	} 


	module.exports = OpenAndClose;
});