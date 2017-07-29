//塔防GM工具物品掉落设置相关JavaScript
//2014/11/5
define( function( require, exports, module ) {
	var UIBase = require( 'uibase' );
	var EventBase = require( 'eventbase' );
	var DataSource = require( 'active_map_data' );
	var suggest = require( 'suggest' );
	var itemQuerySuggest = require( 'item_query_suggest' );
		
	
	function OnlineListItem() {
		this.getStateHtml = function() {
			return '正常';
		}
		
		this.getButtonsHtml = function( item ) {
			var html = '';
			html += "<button class='btn btn-default' name='edit' data_item_id='"+ item.ID +"'>编辑</button>&nbsp;&nbsp;";
			html +=	"<button class='btn btn-default' name='delete' area_id='"+ item.area_id +"' data_item_id='"+ item.ID +"'>删除</button>&nbsp;&nbsp;";
		    html += "<button class='btn btn-default' name='copy' area_id='"+ item.area_id +"' data_item_id='"+ item.ID +"'>复制</button>&nbsp;&nbsp;";
			html +=	 "<button class='btn btn-default' name='offline' area_id='"+ item.area_id +"' data_item_id='"+ item.ID +"'>下架</button>";		
			return html;
		}
	}
	
	function OfflineListItem() {
		this.getStateHtml = function() {
			return '<font color="red">已下架</font>';
		}
		
		this.getButtonsHtml = function( item ) {
			var html = '';
			html +=	"<button class='btn btn-default'  name='delete' area_id='"+ item.area_id +"' data_item_id='"+ item.ID +"'>删除</button>&nbsp;&nbsp;";
			html +=	 "<button class='btn btn-default' name='online' area_id='"+ item.area_id +"' data_item_id='"+ item.ID +"'>上架</button>";	
			return html;	
		}		
	}
	
	function getListItemStateObj( state ) {
		var map = {};
		map[ 'offline' ] = new OfflineListItem();
		map[ 'online' ] = new OnlineListItem();
		return map[ state ];
	}
	
	function createQueryPageFns() {
		var dataList;
		var areaInfo;
		
		function getDropItemsHtml( data ) {
			var html = '<div>';
			for( var i = 0; i < data.length; i++ ) {
				var dataItem = data[ i ];
				html += "<p>";
				for( var key in dataItem ) {
					html += '<font color="#999999">' + key;
					html += ':</font>';
					html += dataItem[ key ];
					html += '&nbsp;&nbsp;&nbsp;'
				}
				html += "</p>";
			}
			html += "</div>"
				return html;
		}
		
		function renderList( data ) {
			var html = '<table class="table table-bordered table-hover dh-datagrid" id="list_content">';
			html += "<thead>"
			html += '<tr>';
			html += '<th>大区</th>';
			html += '<th>ID</th>';
			html += '<th>名称</th>';
			html += '<th>地图</th>';
			html += '<th>地图类型</th>';
			html += '<th>掉落类型</th>';
			html += '<th>结算掉落类型</th>';
			//html += '<th>描述</th>';
//			html += '<th>时间特性A</th>';
//			html += '<th>时间数据A</th>';
//			html += '<th>时间特性B</th>';
//			html += '<th>时间数据B</th>';
			html += '<th>是否开始</th>';
			html += '<th>触发概率</th>';
			html += '<th>状态</th>';
			html += '<th>操作</th>';
			html += '</tr>';
			html += "</thead>";
			for( var i = 0; i < data.length; i++ ) {
				var item = data[ i ];
				
				var itemType = item.type || 'online';
				var stateObj = getListItemStateObj( itemType );
				
				html += "<tr name='list_item' state='"+ itemType +"' >";
				html += "<td>"+ areaInfo[ item.area_id ].area_name +"</td>";
				html += "<td>"+ item.ID +"</td>";
				html += "<td>"+ item['名称'] +"</td>";
				html += "<td>"+ ( item['地图'] && item['地图'].join( "," ) ) +"</td>";
				html += "<td>"+ item[ '地图类型' ] +"</td>";
				html += "<td>"+ item[ '掉落类型' ] +"</td>";
				html += "<td>"+ item[ '结算掉落类型' ] +"</td>";
				//html += "<td>"+ item[ '描述' ] +"</td>";
//				html += "<td>"+ item[ '时间特性A' ] +"</td>";
//				html += "<td>"+ item[ '时间数据A' ] +"</td>";
//				html += "<td>"+ item[ '时间特性B' ] +"</td>";
//				html += "<td>"+ item[ '时间数据B' ] +"</td>";
				html += "<td>"+ item[ '是否开始' ] +"</td>";
				html += "<td>"+ item[ '触发概率' ] +"</td>";
				html += "<td>"+  stateObj.getStateHtml() +"</td>";

				html += "<td>";
				html += stateObj.getButtonsHtml( item );
				html += "</td>";
				html += "</tr>";
				html += "<tr style='display:none;'><td colspan='15'>"+ 
						  "<p><font color='#999999'>时间特性A：</font>" + item[ '时间特性A' ] + "</p>" +
						  "<p><font color='#999999'>时间数据A：</font>" + item[ '时间数据A' ] + "</p>" +
						  "<p><font color='#999999'>时间特性B：</font>" + item[ '时间特性B' ] + "</p>" +
						  "<p><font color='#999999'>时间数据B：</font>" + item[ '时间数据B' ] + "</p>" +
								getDropItemsHtml( item[ '掉落物品' ] ) +
					 	"<p><font color='#999999'>描述：</font>"+  item[ '描述' ]  +"</p>" +
						"</td></tr>";
			}
			html += '</table>';
			$( '#list_content' ).replaceWith( $( html ) );
		}

		function getDataListByAreaID( areaID ) {
			if( !areaID ) {
				return dataList;
			}
			var result = [];
			for( var i = 0; i < dataList.length; i++ ) {
				if( dataList[ i ].area_id == areaID ) {
					result.push( dataList[ i ] );
				}
			}
			return result;
		}	
		
		function getDataItem( id ) {
			for( var i = 0; i < dataList.length; i++ ) {
				if( dataList[ i ].ID == id ) {
					return dataList[ i ];
				}
			}
			return null;
		}
		
		function postMessageFn( url ) {
			var id = $( this ).attr( 'data_item_id' );
			var dataItem = getDataItem( id );
			var iframe = window.frameElement;
			parent.receDropEditFn = function() {
				//console.log( 'iframe.contentWindow.location.href:' + iframe.contentWindow.location.href );
				//console.log( 'url:' + url );
				if( iframe.contentWindow.location.href.replace( ':80', '' ) == url.replace( ':80', ''  ) ) {
					//console.log('abc123');
					iframe.contentWindow.postMessage( dataItem, "*" );
				}
			}; 
			iframe.setAttribute( 'onload', 'receDropEditFn()' );
			iframe.src = url;			
		}
		//查询页面相关功能
		var queryPageFns = {
			baseUrl: '',
			initDataList: function( ) {
				var url = this.baseUrl + 'index.php?/race_drop/query?type=get_data';
				var ajaxOption = new Object;
				ajaxOption.url = url;
				ajaxOption.dataType = 'JSON';
				ajaxOption.type = 'GET';
				ajaxOption.success = function( response ) {
					//console.log( response );
					renderList( response );
					dataList = response;
				}
				$.ajax( ajaxOption );					
			},
			
			//跟据区域筛选数据
			initAreaFilter: function() {
				$( '#search_btn' ).bind( 'click', function() {
					var areaID = $( '#area' ). val(); 
					var result = getDataListByAreaID( areaID );
					renderList( result );
				} );
				
				$( '#reset' ).bind( 'click', function() {
					var result = getDataListByAreaID( '' );
					renderList( result );
				} );
			},
			
			//显示掉落的详细物品
			initShowDropItems: function() {
				$( '#list_content tr[name=list_item]' ).live( 'click', function( e ) {
					var target = e.target || e.srcElement;
					if( target.tagName != 'TR' && target.tagName != 'TD' ) {
						return;
					}
					$( this ).next().toggle();
				} );
			},
			
			//删除按扭
			initDelete: function() {
				var url = this.baseUrl + "index.php?/race_drop/delete";
				$( '#list_content button[name=delete]' ).live( 'click', function() {
					if( !confirm( '确定要删除吗?' ) ) {
						return;
					}
					var self = $( this );
					var state = self.parents( 'tr' ).attr('state');
					var areaID = $( this ).attr( 'area_id' );
					var id = $( this ).attr( 'data_item_id' );
					var ajaxOption = new Object;
					ajaxOption.url = url;
					ajaxOption.dataType = 'JSON';
					ajaxOption.type = 'POST';
					ajaxOption.data = { area_id: areaID, id: id, state: state };
					ajaxOption.success = function( response ) {
						alert( response.msg );
						var listItem = self.parents( 'tr[name=list_item]' );
						var dropItems = listItem.next();
						listItem.remove();
						dropItems.remove();
					}
					$.ajax( ajaxOption );
				} );
			},
			
			//编辑按扭
			initEdit: function() {
				var url = this.baseUrl + "index.php?/race_drop/edit";
				$( '#list_content button[name=edit]' ).live( 'click', function() {
					postMessageFn.call( this, url );
				} );
			},
			//复制按扭
			initCopy: function() {
				var url = this.baseUrl + "index.php?/race_drop/edit?page_type=copy";
				$( '#list_content button[name=copy]' ).live( 'click', function() {
					postMessageFn.call( this, url );
				} );				
			},
			
			//下架按扭
			initOffline: function() {
				var url = this.baseUrl + "index.php?/race_drop/offline";
				$( '#list_content button[name=offline]' ).live( 'click', function() {
					var areaID = $( this ).attr( 'area_id' );
					var id = $( this ).attr( 'data_item_id' );
					
					var ajaxOption = new Object;
					ajaxOption.url = url;
					ajaxOption.dataType = 'JSON';
					ajaxOption.type = 'POST';
					ajaxOption.data = {
						'area_id': areaID,
						'id': id
					}
					ajaxOption.success = function( response ) {
						alert( response.msg );
						if( response.success ) {
							window.location.reload();
						}
					}
					$.ajax( ajaxOption );
				} );				
			},
			//上架按扭
			initOnline: function() {
				var url = this.baseUrl + "index.php?/race_drop/edit?page_type=online";
				$( '#list_content button[name=online]' ).live( 'click', function() {
					postMessageFn.call( this, url );
				} );
			},
			
			setAreaInfo: function( data ) {
				areaInfo = data;
			},
			
			//初始化各部份
			init: function() {
				this.initDataList();
				this.initAreaFilter();
				this.initShowDropItems();
				this.initDelete();
				this.initEdit();
				this.initCopy();
				this.initOffline();
				this.initOnline();
			}
		}
		
		return queryPageFns;
	}
	
	
	
	function createEditPageFns() {
		
		function getMapType() {
			var values = [];
			$( 'input[name=map_type]' ).each( function() { 
				if( this.checked ) {
					values.push( this.value );
				} 
			} );
			return values;
		}

		function getDropEndType() {
			var values = [];
			$( 'input[name=drop_end_type]' ).each( function() { 
				if( this.checked ) {
					values.push( this.value );
				} 
			} );
			return values;
		}
		
		function getFormData() {
			var area = $( '#area' ).val();
			var name = $( '#name' ).val();
			var mapType = 0;
			var mapId = $( '#map_id' ).val();
			var dropType = $( '#drop_type' ).val();
			var dropEndType = 0;
			var timeTypeA = $( '#time_type_a' ).val();
			var timeDataA = $( '#time_data_a' ).val();
			var timeTypeB = $( '#time_type_b' ).val();
			var timeDataB = $( '#time_data_b' ).val();
			var desc = $( '#desc' ).val();
			var probability = $( '#probability' ).val();
			var id = $( '#id' ).val();
			var isNewPublish = $( '#is_new_publish' ).val();

			for( var i = 0; i < getMapType().length; i++ ) {
				mapType |= getMapType()[ i ];
			}

			for( var i = 0; i < getDropEndType().length; i++ ) {
				dropEndType |= getDropEndType()[ i ];
			}
		
			return {
				'area': $.trim( area ),
				'name': $.trim( name ),
				'map_type': $.trim( mapType ),
				'map_id': $.trim( mapId ),
				'drop_type': $.trim( dropType ),
				'drop_end_type': $.trim( dropEndType ),
				'time_type_a': $.trim( timeTypeA ),
				'time_data_a': $.trim( timeDataA ),
				'time_type_b': $.trim( timeTypeB ),
				'time_data_b': $.trim( timeDataB ),
				'desc': $.trim( desc ),
				'probability' : $.trim( probability ),
				'id': $.trim( id ),
				'is_new_publish': $.trim( isNewPublish )
			};
		}
		
		function getDropItemsData() {
			var itemElements = $( 'p[name=drop_item]' );
			var result = [];
			for( var i = 0; i < itemElements.length; i++ ) {
				var itemElement = $( itemElements.get( i ) );
				var itemIdEl = itemElement.find( '[name=item_id]' );
				var itemCountEl = itemElement.find( '[name=item_count]' );
				var isBindEl = itemElement.find( '[name=is_bind]' );
				var noticeIdEl = itemElement.find( '[name=notice_id]' );
				var lowLvlEl = itemElement.find( '[name=low_lvl]' );
				var highLvlEl = itemElement.find( '[name=high_lvl]' );
				var ptEl = itemElement.find( '[name=probability_type]' );
				var pEl = itemElement.find( '[name=probability]' );
				var peEl = itemElement.find( '[name=person_everyday]' );
				var paEl = itemElement.find( '[name=person_all]' );
				var seEl = itemElement.find( '[name=server_everyday]' );	
				var saEl = itemElement.find( '[name=server_all]' );	

				var itemId =  $.trim( itemIdEl.val() );
				var itemCount = $.trim( itemCountEl.val() );
				var isBind = isBindEl.val();
				var noticeId = $.trim( noticeIdEl.val() );
				var lowLvl = $.trim( lowLvlEl.val() );
				var highLvl = $.trim( highLvlEl.val() );
				var pt = $.trim( ptEl.val() );
				var p = $.trim( pEl.val() );
				var pe = $.trim( peEl.val() );
				var pa = $.trim( paEl.val() );
				var se = $.trim( seEl.val() );
				var sa = $.trim( saEl.val() );

				if( itemId == '' ) {
					return getErrorInfo( '请输入掉落物品ID', itemIdEl );
				}
				
				if( itemCount == '' || isNaN( itemCount ) ) {
					return getErrorInfo( '掉落物品数量值未输入或格式错误', itemCountEl );
				}

				if( isBind == '' ) {
					return getErrorInfo( '请选择掉落物品是否绑定', isBindEl );
				}
				
//				if( noticeId == '' ) {
//					return getErrorInfo( '请输入公告ID', noticeIdEl );
//				}

				if( lowLvl == '' ) {
					return getErrorInfo( '请输入最低等级', lowLvlEl );
				}
				
				if( isNaN( lowLvl ) ) {
					return getErrorInfo( '请正确输入最低等级', lowLvlEl );
				}

				if( highLvl == '' ) {
					return getErrorInfo( '请输入最高等级', highLvlEl );
				}
				
				if( isNaN( highLvl ) ) {
					return getErrorInfo( '请正确输入最高等级', highLvlEl );
				}
				
				if( pt == '' ) {
					return getErrorInfo( '请选择概率分布', ptEl );
				}
				
				if( p == '' ) {
					return getErrorInfo( '请输入概率', pEl );
				}
				
				if( isNaN( p ) ) {
					return getErrorInfo( '请正确输入概率', pEl );
				}

//				if( pe == '' ) {
//					return getErrorInfo( '请输入个人日产出', peEl );
//				}
//				
//				if( isNaN( pe ) ) {
//					return getErrorInfo( '请正确输入个人日产出', peEl );
//				}
//
//				if( pa == '' ) {
//					return getErrorInfo( '请输入个人总产出', paEl );
//				}
//				
//				if( isNaN( pa ) ) {
//					return getErrorInfo( '请正确输入个人总产出', paEl );
//				}
//
//				if( se == '' ) {
//					return getErrorInfo( '请输入服务器日产出', seEl );
//				}
//				
//				if( isNaN( se ) ) {
//					return getErrorInfo( '请正确输入服务器日产出', seEl );
//				}
//				
//				if( sa == '' ) {
//					return getErrorInfo( '请输入服务器总产出', saEl );
//				}
//				
//				if( isNaN( sa ) ) {
//					return getErrorInfo( '请正确输入服务器总产出', saEl );
//				}

				var dropItemInfo = {
						'item_id': itemId,
						'item_count': itemCount,
						'is_bind': isBind,
						'notice_id': noticeId,
						'lowLvl': lowLvl,
						'highLvl': highLvl,
						'pt': pt,
						'p': p,
						'pe': pe,
						'pa': pa,
						'se': se,
						'sa': sa
					};
				result.push( dropItemInfo );
			}
			return result;
		}

		function getErrorInfo( msg, errorElement ) {
			var error = {};
			error.err = true;
			error.errMsg = msg;
			error.errEl = errorElement;
			return error;
		}
		
		var PAGE_TYPE_ADD = 'add';
		var PAGE_TYPE_EDIT = 'edit';
		var PAGE_TYPE_COPY = 'copy';
		var PAGE_TYPE_ONLINE = 'online';
		var pageType = PAGE_TYPE_ADD;
		
		//编辑页面相关功能
		var editPageFns = {
			baseUrl : '',
			
			setPageType: function( type ) {
				pageType = type;
			},
			
			//提交数据部份
			initSubmitDataAction: function() {
				var self = this;
				$( '#submit_btn' ).bind( 'click', function() {
					$( '#the_form' ).submit();
				} );
				
				$.validator.addMethod( 'checkMapType', function() {
					return getMapType().length > 0;
				} );

				$.validator.addMethod( 'checkEndDropType', function() {
					return getDropEndType().length > 0;
				} );	

				$( '#the_form' ).validate( {
					rules: {
						area: {
							required: true
						},
						name:  {
							required: true
						},
						/*map_type_ref: {
							checkMapType: true
						},*/
						/*map_id: {
							required: true				
						},*/
						drop_type: {
							required: true
						},
						/*drop_end_type_ref: {
							checkEndDropType: true
						},*/
						desc: {
							required: true
						},
						probability: {
							required: true
						}
					},
					messages: {
						area: {
							required: '请选择大区'
						},
						name:  {
							required: '请输入名称'
						},
						map_type_ref: {
							checkMapType: '请选择地图类型'
						},
						map_id: {
							required: '请输入地图ID'				
						},
						drop_type: {
							required: '请选择掉落类型'
						},
						drop_end_type_ref: {
							checkEndDropType: '请选择结算掉落类型'
						},
						time_type_a: {
							required: '请选择时间特性A'
						},
						time_data_a: {
							required: '请输入时间数据A'
						},
						time_type_b: {
							required: '请选择时间特性B'
						},
						time_data_b: {
							required: '请输入时间数据B'
						},
						desc: {
							required: '请输入描述'
						},
						probability: {
							required: '请输入触发概率'
						}			
					},
					ignore: '',
					submitHandler: function( form ) {
						var submitUrl = self.baseUrl + 'index.php?/race_drop/add?type=save&mode=' + pageType;
						var listUrl = self.baseUrl + 'index.php?/race_drop/query';
						var dropItemsData = getDropItemsData();
						if( dropItemsData.err ) {
							alert( dropItemsData.errMsg );
							dropItemsData.errEl.focus();
							return;
						}
						var formData = getFormData();
						formData[ 'drop_items' ] = dropItemsData;

						var ajaxOption = new Object;
						ajaxOption.url = submitUrl;
						ajaxOption.dataType = 'JSON';
						ajaxOption.type = 'POST';
						ajaxOption.data = { data: JSON.stringify( formData ) };
						ajaxOption.success = function( response ) {
							alert( response.msg );
							if( response.error === 0 ) {
								window.location.href = listUrl;
							}
						}
						$.ajax( ajaxOption );
					}
				} );
			},
			
			//掉落具体物品设置相关
			initDropItemControl: function( townItems ) {
				var addButton = $( '<input type="button" value="增加" class="btn btn-default"/>' );
				
				var itemList = $( '#item_list' );
				var index = 0;
				function addItem( obj ) {		
					var html = $( '#item_template' ).html();
					var itemEl = $( html );
					
					if( obj ) {
						var itemElement = itemEl;
						var itemIdEl = itemElement.find( '[name=item_id]' );
						var itemCountEl = itemElement.find( '[name=item_count]' );
						var isBindEl = itemElement.find( '[name=is_bind]' );
						var noticeIdEl = itemElement.find( '[name=notice_id]' );
						var lowLvlEl = itemElement.find( '[name=low_lvl]' );
						var highLvlEl = itemElement.find( '[name=high_lvl]' );
						var ptEl = itemElement.find( '[name=probability_type]' );
						var pEl = itemElement.find( '[name=probability]' );
						var peEl = itemElement.find( '[name=person_everyday]' );
						var paEl = itemElement.find( '[name=person_all]' );
						var seEl = itemElement.find( '[name=server_everyday]' );	
						var saEl = itemElement.find( '[name=server_all]' );							
						
						itemIdEl.val( obj[ '物品ID' ] );
						itemCountEl.val( obj[ '数量' ] );
						isBindEl.val( obj[ '是否绑定' ] );
						noticeIdEl.val( obj[ '公告ID' ] );
						lowLvlEl.val( obj[ '最低等级' ] );
						highLvlEl.val( obj[ '最高等级' ] );
						ptEl.val( obj[ '概率类型' ] );
						pEl.val( obj[ '概率' ] );
						peEl.val( obj[ '个人每日产出' ] );
						paEl.val( obj[ '个人总量产出' ] )
						seEl.val( obj[ '服务器每日产出' ] );
						saEl.val( obj[ '服务器总产出' ] )  
					}
					itemList.append( itemEl );
					itemEl.find( '.row1' ).append( addButton ); 
				 	itemEl.find( 'input[name=remove]' ).bind( 'click', function() {
					 	if( itemEl.siblings().length == 0 ) {
						 	return;
					 	}
					 	if( itemEl.get( 0 ).contains( addButton.get( 0 ) ) ) {
							addButton.appendTo( itemEl.prev().find( '.row1' ) );
					 	}
						itemEl.remove();
				 	} );
					
					var inputID = 'item_id_' + ++index;
					var placeholderID = 'suggest_placeholder_' + index;
					itemEl.find('input[name="item_id"]').attr( 'id', inputID );
					itemEl.find('.suggest_placeholder').attr( 'id', placeholderID );
					itemQuerySuggest.itemQuerySuggest( townItems, inputID, placeholderID, function( arg ) {
						itemEl.find( 'input[name="item_id"]' ).val( arg.id );
					} );		  
				}
				
				this.addDropItem = addItem;

				addButton.bind( 'click', function() {
					if( $( 'p[name=scheme_item]' ).length >= 10 ) {
						return;
					}
					addItem();
				} );

				pageType == PAGE_TYPE_ADD && addItem();
			},
			
			//填充表单
			fillForm: function( data ) {
				var areaID = data.area_id;
				var id = data[ 'ID' ];
				var name = data[ '名称' ];
				var map = data[ '地图' ] || [];
				var mapType = data[ '地图类型' ];
				var dropItems = data[ '掉落物品' ];
				var dropType = data[ '掉落类型' ];
				var desc = data[ '描述' ];
				var timeDataA = data[ '时间数据A' ];
				var timeDataB = data[ '时间数据B' ];
				var timeTypeA = data[ '时间特性A' ];
				var timeTypeB = data[ '时间特性B' ];
				var isStart = data[ '是否开始' ];
				var dropEndType = data[ '结算掉落类型' ];
				var probability = data[ '触发概率' ];

				$( '#area' ).val( areaID );
				$( '#name' ).val( name );
				$( '[name=map_type]' ).each( function() {
					if( mapType & this.value ) {
						this.checked = true;
					}
				} );
				$( '#drop_type' ).val( dropType ).trigger('change');
				$( '[name=drop_end_type]' ).each( function(){
					if( dropEndType & this.value ) {
						this.checked = true;
					}
				} );
				$( '#time_type_a' ).val( timeTypeA );
				$( '#time_data_a' ).val( timeDataA );
				$( '#time_type_b' ).val( timeTypeB );
				$( '#time_data_b' ).val( timeDataB );
				$( '#desc' ).val( desc );
				$( '#probability' ).val( probability );

				for( var i = 0; i < map.length; i++ ) {
					var mapInfo = MapSelect.findMapInfo( map[ i ] );
					MapSelect.addMapID( mapInfo );
				}

				for( var i = 0; i < dropItems.length; i++ ) {
					var item = dropItems[ i ];
					this.addDropItem( item );
				}
				
				pageType == PAGE_TYPE_EDIT && $( '#id' ).val( id );
				pageType == PAGE_TYPE_EDIT && $( '#is_new_publish' ).val( 0 );
				
				pageType == PAGE_TYPE_ONLINE  && $( '#id' ).val( id );
			},
			
			//地图选择
			initMapSelectControl: function() {
				var mapIdInputOut = $( '#map_id_input_out' );
				var mapIdInput = $( '#map_id_input' );

				mapIdInputOut.bind( 'click', function( e ) {
					var t = e.target || e.srcElement;
					if( $( t ).attr( 'map_id' ) ) {
						return;
					}
					mapIdInput.focus();
				} );

				mapIdInputOut.find( 'div' ).live( 'dblclick', function() {
					$( this ).remove();
					MapSelect.setMapIDs();
				} );
				
				var ms = new MapSelect( 'map_id_input', 'map_select' );
				ms.addListener( 'onSelected', function( eventType, eventArg ) {
					MapSelect.addMapID( eventArg );
					$( '#map_id_input' ).val( '' ).focus();
				} );
				ms.init();
			},
			
			initDropTypeChange: function() {
				var dropType = $( '#drop_type' );
				var dropEndTypeWrapper = $( '#drop_end_type_wrapper' );
				dropEndTypeWrapper.hide();
				dropType.bind( 'change', function() {
					//结算掉落类型
					if( this.value ==  '2' ) {
						dropEndTypeWrapper.show();
					} else {
						dropEndTypeWrapper.hide();
					}
				} );
			}
		}
		
		return editPageFns;
	}
	
	//地图选择器
	function MapSelect( inputId, suggestPlaceHolderId ) {
		EventBase.call( this );
		var self = this;
		var ds;
				
		this.init = function() {
			ds = new DataSource();
			var dialog = new suggest.Suggest( suggestPlaceHolderId );
			var format = new suggest.MapDataFormat();
			
			dialog.entered = function( selected ) {
				dialog.hide();
				self.fireEvent( 'onSelected', selected );
			}
			
			$( document ).bind( 'click', function( e ) {
				var t = e.target || e.srcElement;
				if( $( '#' + suggestPlaceHolderId ).get( 0 ).contains( t ) ||
						$( '#' + inputId ).get( 0 ).contains( t ) ) {
					return;
				}
				dialog.hide();
			} );
			
			$( '#' + inputId ).bind( 'keyup', function( e ) {
			   var self = $( this );
			   if( e.keyCode <=40 && e.keyCode >= 37 || e.keyCode == 13) {
				   return;
			   }
				ds.search( $.trim( this.value ), function( result ) {
					if( result.length > 0 ) {
						format.setData( result );
						dialog.load( format );
						dialog.show( self.offset().left, self.offset().top + 35 );
						$( dialog.getDom() ).css( { 'z-index': '999' } )
					} else {
						dialog.hide();
					}
				});
			} );		
		}
	}	
	
	MapSelect.findMapInfo = function( mapID ) {
		var mapInfo = null;
		var ds = new DataSource();
		ds.search( mapID, function( result ){
			if( result && result.length > 0 ) {
				mapInfo = result[ 0 ];
			} else {
				mapInfo = {id: mapID, name: 'not found', level: 'not found' }
			}
		} );
		return mapInfo;
	}
	
	MapSelect.setMapIDs = function() {
		var ids = [];
		$( 'div[map_id]' ).each( function(){
			ids.push( $( this ).attr( 'map_id' ) );
		} );
		$( '#map_id' ).val( ids.join( '|' ) );
	}

	MapSelect.addMapID = function( map ) {
		var title = map.name + map.level;
		var mapIdInput = $( '#map_id_input' );
		mapIdInput.before('<div class="selected_item" map_id="'+ map.id +'" title="双击删除">'+ title  +';<input type="text" deleteable="1" maxlength="0" /></div>');
		MapSelect.setMapIDs();
	}

	exports.queryPageFns = createQueryPageFns();
	exports.editPageFns = createEditPageFns();
} );