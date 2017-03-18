define( function( require, exports, module ) {
	var PopupBase = require( 'popupbase' );
	//常规弹窗
	var PopupLayer = function( openAndClose, framework, content ) {
	    PopupBase.call( this, openAndClose );
	    framework.accep( this );
	    
	    var self = this;

	    this.getHtmlTpl = function() {
	        return framework.getContent( content );
	    }
	}

	module.exports = PopupLayer;
});