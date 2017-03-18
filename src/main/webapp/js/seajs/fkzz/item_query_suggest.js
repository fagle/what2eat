define( function( require, exports, module ) {
	var oldSuggest = require( 'item_query_suggest.js' );
	
	var itemList;
	var fnList = [];
	
	void function loadData() {
		var ajaxOption = new Object;
		//ajaxOption.url = 'index.php?/open/getItemInfo';
		ajaxOption.type = 'get';
		ajaxOption.dataType = 'json';
		ajaxOption.success = function( response ) {
			itemList = response;
			for( var i = 0; i < fnList.length; i++ ) {
				typeof( fnList[ i ] ) == 'function' && fnList[ i ]();
			}
			fnList = [];
		}
		$.ajax( ajaxOption );
	}();
	
	function m3dldItemSuggest( inputID, placeholderID, callback ) {
		if( !itemList ) {
			fnList.push( function() {
				oldSuggest.m3dldItemSuggest( itemList, inputID, placeholderID, callback );
			} );
			return;
		}
		oldSuggest.m3dldItemSuggest( itemList, inputID, placeholderID, callback );
	}
	
	function itemIdExists( itemId ) {
		for( var i = 0; i < itemList.length; i++ ) {
			if( itemList[ i ].itemID == itemId ) {
				return true;
			}
		}
		return false;
	}
	
	exports.m3dldItemSuggest = m3dldItemSuggest;
	exports.itemIdExists = itemIdExists;
} );