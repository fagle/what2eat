define( function( require, exports, module ) {
    var PopupBase = require( 'popupbase' )
    //会话弹窗
    var PopupDialog = function( openAndClose, framework, url ) {
        PopupBase.call( this, openAndClose );
        framework.accep( this );
        
        var self = this;
        
        this.getHtmlTpl = function() {
            var content = '<iframe style="width:100%; height:100%;" frameborder="0" scrolling="no" marginwidth="0" marginheight="0" id="##-framedialog" src="' + url + '"></iframe>';
            return framework.getContent( content );
        }
        
        this.getDialogWindow = function() {
            var iframe = this.getJDom().find( 'iframe' ).get( 0 );
            return iframe.contentWindow;    
        }
    }    

    module.exports = PopupDialog;
});