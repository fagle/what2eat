define( function( require, exports, module ) {
	var UIBase = require( 'uibase' );
	var suggest = require( 'suggest' );
	var EventBase = require( 'eventbase' );
	
	var CurrDataSource;
	var CurrFormat;
	
	//legionCardBook数据操作
	function LegionCardDataSource( data ) {
		EventBase.call( this );
		
		var getDataByKeyword = function( keyword ) {
			keyword = keyword || '';
			var result = [];
			for( var i = 0; i < data.length; i++ ) {
				var item = data[ i ];
//				if( item.default_open == 1 ) {
//					continue;
//				}
				var id = item.card_id.toUpperCase();
				var name = item.card_name.toString();
				if( id.indexOf( keyword.toUpperCase() ) != -1 ) {
					result.push( item );
				} else if( name.indexOf( keyword ) != -1 ) {
					result.push( item );
				}
			}		
			return result;
		}
		
		this.search = function( keyword, callback ) {
			if( typeof( callback ) == 'function' ) {
				var result = getDataByKeyword( keyword );
				callback( result );
			}
		}		
	}
	
	//town_item数据操作
	function DataSource( data ) {
		EventBase.call( this );
		
		for( var i = 0; i < data.length; i++ ) {
			data[ i ][ 'name' ] += '('+ data[ i ][ 'pinzhi' ] +')';
		}
		
		var getDataByKeyword = function( keyword ) {
			keyword = keyword || '';
			var result = [];
			for( var i = 0; i < data.length; i++ ) {
				var item = data[ i ];
				var id = item.id.toUpperCase();
				var name = item.name.toString();
				if( id.indexOf( keyword.toUpperCase() ) != -1 ) {
					result.push( item );
				} else if( name.indexOf( keyword ) != -1 ) {
					result.push( item );
				}
			}		
			return result;
		}
		
		this.search = function( keyword, callback ) {
			if( typeof( callback ) == 'function' ) {
				var result = getDataByKeyword( keyword );
				callback( result );
			}
		}
	}
	
	function M3dldItemDataSource( data ) {
		EventBase.call( this );
		
		var getDataByKeyword = function( keyword ) {
			keyword = keyword || '';
			var result = [];
			for( var i = 0; i < data.length; i++ ) {
				var item = data[ i ];
				var id = item.itemID.toUpperCase();
				var name = item.itemName.toString();
				if( id.indexOf( keyword.toUpperCase() ) != -1 ) {
					result.push( item );
				} else if( name.indexOf( keyword ) != -1 ) {
					result.push( item );
				}
			}		
			return result;
		}
		
		this.search = function( keyword, callback ) {
			if( typeof( callback ) == 'function' ) {
				var result = getDataByKeyword( keyword );
				callback( result );
			}
		}		
	}
	
	function HeroItemDataSource( data ) {
		EventBase.call( this );
		
		var getDataByKeyword = function( keyword ) {
			keyword = keyword || '';
			var result = [];
			for( var i = 0; i < data.length; i++ ) {
				var item = data[ i ];
				var id = item.pvpHeroId.toUpperCase();
				var name = item.heroName.toString();
				if( id.indexOf( keyword.toUpperCase() ) != -1 ) {
					result.push( item );
				} else if( name.indexOf( keyword ) != -1 ) {
					result.push( item );
				}
			}		
			return result;
		}
		
		this.search = function( keyword, callback ) {
			if( typeof( callback ) == 'function' ) {
				var result = getDataByKeyword( keyword );
				callback( result );
			}
		}		
	}
	
	function querySuggest( data, inputId, suggestId, onSelected  ) {
		var suggestEl;
		var inputEl;
        suggestEl = $( document.getElementById( suggestId ) );
        inputEl = $( document.getElementById( inputId ) );

		var ds = new CurrDataSource( data );//new DataSource( data );
		var dialog = new suggest.Suggest( suggestId );
		var format = new CurrFormat( suggestId ); //new suggest.TownItemFormat();
		
		dialog.entered = function( selected ) {
			dialog.hide();
			inputEl.val( selected.id );
			if( typeof( onSelected ) == 'function' ) {
				onSelected( selected );
			}
		}
		
		$( document ).bind( 'click', function( e ) {
			var t = e.target || e.srcElement;
			if( suggestEl.get( 0 ).contains( t ) ||
					inputEl.get( 0 ).contains( t ) ) {
				return;
			}
			dialog.hide();
			prevValue = '';
		} );
		
		var prevValue = '';
		inputEl.bind( 'keyup', function( e ) {
		   value = $.trim( this.value );
		   if( value == prevValue ) {
			   return;
		   }
		   prevValue = value;
		   
		   if( e.keyCode <=40 && e.keyCode >= 37 || e.keyCode == 13) {
			   return;
		   }
		   
		   ds.search( $.trim( this.value ), function( result ) {
				if( result.length > 0 ) {
					format.setData( result );
					dialog.load( format );
					dialog.show();
				} else {
					dialog.hide();
				}
			});
		} );
	}
	
	function itemQuerySuggest( data, inputId, suggestId, onSelected ) {
		CurrDataSource = DataSource;
		CurrFormat = suggest.TownItemFormat;
		querySuggest( data, inputId, suggestId, onSelected  );
	}
	
	function legionCardQuerySuggest( data, inputId, suggestId, onSelected ) {
		CurrDataSource = LegionCardDataSource;
		CurrFormat = suggest.LegionCardFormat;
		querySuggest( data, inputId, suggestId, onSelected  );
	}
	
	//三国大乐斗物品选择向导
	function m3dldItemSuggest(  data, inputId, suggestId, onSelected  ) {
		CurrDataSource = M3dldItemDataSource;
		CurrFormat = suggest.M3dldItemFormat;
		querySuggest( data, inputId, suggestId, onSelected  );
	}
	
	//英雄信息
	function heroItemSuggest(  data, inputId, suggestId, onSelected  ) {
		CurrDataSource = HeroItemDataSource;
		CurrFormat = suggest.HeroItemFormat;
		querySuggest( data, inputId, suggestId, onSelected  );
	}
	
	
	exports.itemQuerySuggest = itemQuerySuggest;
	exports.legionCardQuerySuggest = legionCardQuerySuggest;
	exports.m3dldItemSuggest = m3dldItemSuggest;
	exports.heroItemSuggest = heroItemSuggest;
} );