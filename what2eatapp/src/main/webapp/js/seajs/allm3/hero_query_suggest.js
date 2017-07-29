define( function( require, exports, module ) {
	var oldSuggest = require( 'item_query_suggest.js' );
	
	var itemList;
	var fnList = [];
	
	void function loadData() {
		var ajaxOption = new Object;
		ajaxOption.url = 'index.php?/open/getHeroInfo';
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
	
	function heroItemSuggest( inputID, placeholderID, callback ) {
		if( !itemList ) {
			fnList.push( function() {
				oldSuggest.heroItemSuggest( itemList, inputID, placeholderID, callback );
			} );
			return;
		}
		oldSuggest.heroItemSuggest( itemList, inputID, placeholderID, callback );
	}
	
	function itemIdExists( itemId ) {
		for( var i = 0; i < itemList.length; i++ ) {
			if( itemList[ i ].pveHeroId == itemId ) {
				return true;
			}
		}
		return false;
	}
	
	exports.heroItemSuggest = heroItemSuggest;
	exports.itemIdExists = itemIdExists;
} );