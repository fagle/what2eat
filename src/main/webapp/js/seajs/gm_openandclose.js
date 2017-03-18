define( function( require, exports, module) {
	var OpenAndClose = require( 'openandclose' );
	
	var NewOpenAndClose = function() {
		OpenAndClose.call( this );
		
		this.setPosition = function() {
	        var jdom = this.getJDom();
	        var screenWidth = $( parent ).width();
	        var screenHeight = $( parent ).height();
	        var popWidth = jdom.width();
	        var popHeight = jdom.height();
	        var marginLeft = popWidth / 2 ;
	        var marginTop = popHeight / 2 > screenHeight / 2 ? screenHeight / 2 : popHeight / 2;
	        jdom.css( {
	            position: 'absolute',
	            zIndex: 999,
	            left: $( parent ).width() / 2 - jdom.width() / 2,
	            top: $( parent.document ).scrollTop() + $( parent ).height()  / 2 - jdom.height() / 2 - (window === parent ? 0 : 100)
	        } );  
		}
	}
	
	module.exports = NewOpenAndClose;
});