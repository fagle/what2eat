define( function( require, exports, module ) {
	function listCheckboxInit() {
		$( '#check_all' ).bind( 'change', function() {
			$( 'input[name="id"]' ).attr( 'checked', this.checked );
		} );

		$( 'input[name="id"]' ).bind( 'change', function() {
			var checkAll = true;
			$( 'input[name="id"]' ).each( function() {
				if( !this.checked ) {
					checkAll = false;
				}
			} );
			$( '#check_all' ).attr( 'checked', checkAll );
		} );
	}
	
	function getIdList() {
		var list = [];
		$( 'input[name="id"]' ).each( function() {
			if( this.checked ) {
				list.push( this.value );
			}
		} );
		return list;
	}
	
	exports.listCheckboxInit = listCheckboxInit;
	exports.getIdList = getIdList;
} );