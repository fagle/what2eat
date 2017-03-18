define( function( require, exports, module ){
	var fn = require( 'mgms/function' );
	function initSubmit( url ) {
		var submitButton = $( '#submit_button' );
		submitButton.bind( 'click', function() {
			var result = getFormData();
            if( result.error ) {
				alert( result.message );
				result.element && result.element.focus();
				return;
			}
			var ajaxOption = new Object;
			ajaxOption.dataType = 'JSON';
			ajaxOption.type = 'POST';
			ajaxOption.url = url;
			ajaxOption.data = { data: JSON.stringify( result.data ) };
			ajaxOption.beforeSend = function() {
				submitButton.attr( 'disabled', 'disabled' ).val( '提交中...' )
				.removeClass('btn-success').addClass('btn-default');
			}
			ajaxOption.success = function( response ) {
				fn.operateResultView( 'the_form', 'result_view', response );
			}
			ajaxOption.error = function() {
				alert( JSON.stringify( arguments ) );
			}
			ajaxOption.complete = function() {
				submitButton.removeAttr( 'disabled', 'disabled' ).val( '提交' )
				.addClass( 'btn-success' ).removeClass( 'btn-default' );
			}
			$.ajax( ajaxOption );
		} );
	}
	
	exports.initSubmit = initSubmit;
} )