define( function( require, exports, module ) {
	function fn( url ) {
		var areaID = $.trim( $( 'select[name="area_id"]' ).val() );
		var itemID = $.trim( $( this ).val() );
		if( areaID != '' && itemID != '' ) {
			var ajaxOption = new Object;
			ajaxOption.url = url;
			ajaxOption.dataType = 'JSON';
			ajaxOption.type = 'POST';
			ajaxOption.data = {
				area_id: areaID,
				item: itemID
			}
			ajaxOption.success = function( response ) {
				var msg = response.message;
				if( msg ) {
					var name = msg[ '物品名字' ];
					var count = msg[ '物品叠加数' ];
					var quality = msg[ '品质' ];
					var desc = "";
					if( name ) {
						desc += '<span>道具名称：' + name + '</span>';
					}
					if( count ) {
						desc += '<span>叠加数：' + count + '</span>'; 
					}
					if( quality ) {
						desc += '<span>品质：' + quality + "</span>";
					}
					if( desc == '' ) {
						desc += '<span>没有找到数据，请检查ID输入是否正确</span>';
					}
					$( '#show_item_name' ).html( desc );	
				}
			}
			$.ajax( ajaxOption );
		}		
	}
	
	function initShowItemDetail( url ) {
		$( '#item_c' ).bind( 'blur', function() {
			fn.call( this, url );
		} );		
	}
	
	function findItemDetail( inputID, url ) {
		fn.call( $( '#' + inputID ).get( 0 ), url )
	}
	
	//根据道具ID查询显示道具的详细信息
	exports.initShowItemDetail = initShowItemDetail;
	exports.findItemDetail = findItemDetail;
	
	function initShowItemDetail_v2( townItemList, url, suggest ) {
		var timer;
		suggest.itemQuerySuggest( townItemList, 'item_c', 'suggest_placeholder',  function( value ) {
			window.clearTimeout( timer );
			findItemDetail( 'item_c', url );
		} );
		$( '#item_c' ).bind( 'blur', function() {
			timer = window.setTimeout( function() {
				findItemDetail( 'item_c', url );
			}, 1000 );
		} );
	}
	
	function datepickerErrorMessage( id ) {	
		window.setInterval( function() {
			if( $( '#' + id ).hasClass( 'error' ) ) {
				$( '#' + id ).parents( '[data-plugin="datepicker"]' ).addClass( 'error' );
			} else {
				$( '#' + id ).parents( '[data-plugin="datepicker"]' ).removeClass( 'error' );
			}
		}, 100 );
	}
	
	exports.initShowItemDetail_v2 = initShowItemDetail_v2;
	exports.datepickerErrorMessage = datepickerErrorMessage;
});