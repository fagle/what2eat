define( function( require, exports, module ) {
	var NewOpenAndClose = require( 'gm_openandclose' );
	var HtmlFramework = require( 'htmlframework' );
	var PopupLayer = require( 'popuplayer' );
	var Mask = require( 'mask' );

	var DialogHtml = function( className ) {
		HtmlFramework.call( this );
		
		this.getContent = function( content ) {
			return '<div class="'+ className +'" id="##">' + content + '</div>';
		}
	}

	//显示武将信息
	function showDialog( opt ) {
		var htmlDialog = opt.htmlDialog;
		var className = opt.className || '';
		
		var mask = Mask.create();
		var oc = new NewOpenAndClose();
		var html = new DialogHtml( className );
		var dialog = dialogAlias = new PopupLayer( oc, html, htmlDialog );
		dialog.addListener( 'opened', function() {
			mask.show();
		} );
		dialog.addListener( 'closed', function() {
			mask.hide();
			dialog.dispose();
		} );
		dialog.addListener( 'renderComplete', function() {
			
		} );
		dialog.initialize();
		dialog.open();
	}
	
	function createDialogForChatMonitor( opt ) {
		var htmlDialog = opt.htmlDialog;
		var className = opt.className || '';
		
		var mask = Mask.create();
		var oc = new NewOpenAndClose();
		var html = new DialogHtml( className );
		var dialog = dialogAlias = new PopupLayer( oc, html, htmlDialog );
		dialog.addListener( 'opened', function() {
			mask.show();
		} );
		dialog.addListener( 'closed', function() {
			mask.hide();
			dialog.dispose();
		} );
		dialog.addListener( 'renderComplete', function() {
			if( typeof( opt.onRenderComplete ) == 'function' ) {
				opt.onRenderComplete.call( dialog );
			}
		} );
		dialog.initialize();
		dialog.open();
		return dialog;
	}
	
	exports.showDialog = showDialog;
	exports.createDialogForChatMonitor = createDialogForChatMonitor;
} );