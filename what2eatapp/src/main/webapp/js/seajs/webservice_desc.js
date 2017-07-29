define( function( require, exports, module ) {
	var NewOpenAndClose = require( 'gm_openandclose' );
	var HtmlFramework = require( 'htmlframework' );
	var PopupLayer = require( 'popuplayer' );
	var Mask = require( 'mask' );
	var common = require( 'common' );
	var fn = require( 'mgms/function.js' );
	
	var dialogHtmlTpl;
	var paramHtmlTpl;
	var resultPlaceholder;
	
	function setDialogHtmlTpl( html ) {
		dialogHtmlTpl = html;
	}
	
	function setParamHtmlTpl( html ) {
		paramHtmlTpl = html;
	}
	
	function setResultPlaceholder( el ) {
		resultPlaceholder = el;
	}

	var dataAccess = function() {
		var index = 0;
		var dataList = {};
		
		this.add = function( data ) {
			index++;
			dataList[ index ] = data
		}
		
		this.remove = function( index ) {
			delete dataList[ index ];
		}
		
		this.replace = function( index, data ) {
			dataList[ index ] = data;
		}
		
		this.getDataItem = function( index ) {
			return dataList[ index ];
		}
		
		this.getAll = function() {
			return dataList;
		}
	
		this.getCurrIndex = function() {
			return index;
		}
		
		this.clear = function() {
			dataList = {};
		}
		
		return this;
	}();
	
	var DialogHtml = function( opt ) {
		HtmlFramework.call( this );
		
		this.getContent = function( content ) {
			var html = '    <div class="aui_state_focus webservice_desc_dialog" id="##">'+
			'        <div class="aui_outer">'+
			'            <table class="aui_border">'+
			'                <tbody>'+
			'                    <tr>'+
			'                        <td class="aui_nw"></td>'+
			'                        <td class="aui_n"></td>'+
			'                        <td class="aui_ne"></td>'+
			'                    </tr>'+
			'                    <tr>'+
			'                        <td class="aui_w"></td>'+
			'                        <td class="aui_c"><div class="aui_inner">'+
			'                                <table class="aui_dialog">'+
			'                                    <tbody>'+
			'                                        <tr>'+
			'                                            <td colspan="2" class="aui_header"><div'+
			'                                                    class="aui_titleBar">'+
			'                                                    <div class="aui_title"'+
			'                                                        style="display: block;">'+ opt.title +'</div>'+
			'                                                    <a class="aui_close" id="close_btn" href="javascript:/*artDialog*/;"'+
			'                                                        style="display: block;">×</a>'+
			'                                                </div></td>'+
			'                                        </tr>'+
			'                                        <tr>'+
			'                                            <td class="aui_icon" style="display: none;"><div'+
			'                                                    class="aui_iconBg" style="background: none;"></div></td>'+
			'                                            <td class="aui_main" style="width: auto; height: auto;">'+
			'                                                <div class="aui_content content">'+
			                                                      content +
			'                                                </div>'+
			'                                            </td>'+
			'                                        </tr>'+
			'                                        <tr>'+
			'                                            <td colspan="2" class="aui_footer"><div'+
			'                                                    class="aui_buttons">'+
			'                                                    <button class=" aui_state_highlight" type="button" id="submit_dialog_btn">确定</button>'+
			'                                                    <button type="button" id="cancel_dialog_btn">取消</button>'+
			'                                                </div></td>'+
			'                                        </tr>'+
			'                                    </tbody>'+
			'                                </table>'+
			'                            </div></td>'+
			'                        <td class="aui_e"></td>'+
			'                    </tr>'+
			'                    <tr>'+
			'                        <td class="aui_sw"></td>'+
			'                        <td class="aui_s"></td>'+
			'                        <td class="aui_se" style="cursor: se-resize;"></td>'+
			'                    </tr>'+
			'                </tbody>'+
			'            </table>'+
			'        </div>'+
			'    </div>';
			return html;
		}
	}
	
	function throwException( element, msg ) {
		throw { element: element, message: msg };
	}
	
	function getDialogData() {
		var nameEl = $( '#name' );
		var methodEl = $( '#method' );
		var urlEl = $( '#url' );
		var descEl = $( '#desc' );
		var returnValueEl = $( '#return_value' );
		
		var name = $.trim( nameEl.val() );
		var method = $.trim( methodEl.val() );
		var url = $.trim( urlEl.val() );
		var desc = $.trim( descEl.val() );
		var returnValue = $.trim( returnValueEl.val() );
		
		if( name === '' ){
			throwException( nameEl, '请输入接口名称' );
		}
		if( url === '' ) {
			throwException( urlEl, '请输入接口地址' );
		} 
		if( !common.regexLib.httpUrl.test( url ) ) {
			throwException( urlEl, '请正确输入接口地址' );
		}
		if( desc === '' ) {
			throwException( descEl, '请输入接口描述' );
		} 
		if( returnValue === '' ) {
			throwException( returnValueEl, '请输入接口返回值示例' );
		} 
		
		var paramElementList = $( '#param_list .param_item' );
		var paramList = [];
		var continueValid = false
		if( paramElementList.length == 1 ) {
			if( $.trim( $( paramElementList[ 0 ] ).find( '[name=param_name]' ).val() ) === '' && 
				$.trim( $( paramElementList[ 0 ] ).find( '[name=param_desc]' ).val() ) === '') {
				continueValid = true;
			}
		}
		if( !continueValid ) {			
			for( var i = 0; i < paramElementList.length; i++ ) {
				var paramElement = $( paramElementList[ i ] );
				var nameElement = paramElement.find( '[name=param_name]' );
				var descElement = paramElement.find( '[name=param_desc]' );
				var paramName = $.trim( nameElement.val() );
				var paramDesc = $.trim( descElement.val() );
				if( paramName === '' ) {
					throwException( nameElement, '请输入参数名' );
				}
				if( paramDesc === '' ) {
					throwException( descElement, '请输入参数说明' );
				}
				var dataItem = new Object;
				dataItem.paramName = paramName;
				dataItem.paramDesc = paramDesc;
				paramList.push( dataItem );
			}
		}
		
		var result = new Object;
		result.name = name;
		result.method = method;
		result.url = url;
		result.desc = desc;
		result.returnValue = returnValue;
		result.paramList = paramList;
		return result;
	}
	
	function getDescItemForViewPage( data ) {
		var html = '<tr name="list_item" style="cursor:pointer;"  index="'+ dataAccess.getCurrIndex() +'">'+
						'<td>'+ data.name +'</td>'+
						'<td>'+ data.method +'</td>'+
						'<td>'+ data.url +'</td>'+
						'<td> <a type="button" href="javascript:;" >测试</a></td>' +
					'</tr>';
		var element = $( html );
		bindViewAction( element );
		bindTry( element );
		return element;
	}
	
	function getDescItem( data ) {
		var html = '<tr name="list_item" style="cursor:pointer;"  index="'+ dataAccess.getCurrIndex() +'">'+
						'<td>'+ data.name +'</td>'+
						'<td>'+ data.method +'</td>'+
						'<td>'+ data.url +'</td>'+
						'<td>'+
						'            <a type="button" href="javascript:;">编辑</a>&nbsp;'+
						'            <a type="button" href="javascript:;" >移除</a>&nbsp;'+
						'            <a type="button" href="javascript:;" >测试</a>&nbsp;'+						
						'</td>'+
					'</tr>';
		
		var element = $( html );
		bindViewAction( element );
		bindTry( element );
		
		element.find( 'a:contains("编辑")' ).bind( 'click', function(){
			var index = element.attr( 'index' );
			var dataItem = dataAccess.getDataItem( index );
			showDialogForEdit( dataItem, index );
		} );
		
		element.find( 'a:contains("移除")' ).bind( 'click', function(){
			if( !confirm( '确定要移除吗？' ) ) {
				return;
			}
			element.remove();
			var index = element.attr( 'index' );
			dataAccess.remove( index );
		} );
		
		return element;
	}
	 
	function bindTry( element ) {
		element.find( 'a:contains("测试")' ).bind( 'click', function(){
			var html = '<table class="form" width="100%">';		
			var index = element.attr( 'index' );
			var dataItem = dataAccess.getDataItem( index );
			var paramList = dataItem.paramList || [];
			html += '<tr class="form-row">'+
						'<td width="10%" class="form-field">'+
							'<label class="star">地址</label>'+
						'</td>'+
						'<td class="form-component">'+
							dataItem.url +
						'</td>'+
					'</tr>'+
					"</tr>";				

			html += '<tr class="form-row">'+
						'<td width="10%" class="form-field">'+
							'<label class="star">方法</label>'+
						'</td>'+
						'<td class="form-component">'+
							dataItem.method +
						'</td>'+
					'</tr>'+
					"</tr>";							
			for( var i = 0; i < paramList.length; i++ ) {
				var param = paramList[ i ];
				html += '<tr class="form-row">'+
							'<td width="10%" class="form-field">'+
								'<label class="star">'+ param.paramName +'</label>'+
							'</td>'+
							'<td class="form-component">'+
								'<input type="text" class="form-control"  name="param_value" param_name="'+ param.paramName +'"  />'+
							'</td>'+
						'</tr>'+
						"</tr>";
			}
			html += "</table>";
			var dialog = getDefaultActionDialog( { htmlDialog: html, title: '填写参数' } );
			dialog.addListener( 'renderComplete', function() {
				var submitButtom = $( '#submit_dialog_btn' );
				submitButtom.bind( 'click', function() {
					var paramValueElements = dialog.getJDom().find( '[name=param_value]' );
					var paramValueList = {};
					for( var i = 0; i < paramValueElements.length; i++ ) {
						var paramValueElement = $( paramValueElements[ i ] );
						var paramName = paramValueElement.attr( 'param_name' );
						var paramValue = paramValueElement.val();
						if( paramValue === '' ) {
							alert( '请输入参数' );
							paramValueElement.focus();
							return;
						}
						paramValueList[ paramName ] = paramValue;
					}
					var tryData = {};
					tryData.url = dataItem.url;
					tryData.method = dataItem.method;
					tryData.paramValueList = paramValueList;
					
					var ajaxOption = {};
					ajaxOption.dataType = 'JSON';
					ajaxOption.type = 'POST';
					ajaxOption.url = 'index.php?/webservice_desc/tryAction';
					ajaxOption.data = { data: tryData };
					ajaxOption.beforeSend = function() {
						submitButtom.unbind( 'click' )
							.removeClass( 'aui_state_highlight' )
							.html( '测试中...' );
					}
					ajaxOption.success = function( response ) {
						if( response.error === 0 ) {
							var resultHtml = "<div class='try_response'>";
							resultHtml += "<h1>接口响应内容</h1>";
							resultHtml += '<pre>' + response.response + '</pre>';
							resultHtml += '</div>';
							dialog.getJDom().find( '.content' ).html( resultHtml );
						}
					};
					ajaxOption.complete = function() {
						submitButtom.hide();
					}
					$.ajax( ajaxOption );
				} ).html( '测试' );
			} );
			dialog.initialize();
			dialog.open();
		} );
	}
	
	function bindViewAction( element ) {
		element.bind( 'click', function( e ) {
			var target = e.target || e.srcElement;
			if( target.tagName === 'A' ) {
				return;
			}
			var index = element.attr( 'index' );
			var data = dataAccess.getDataItem( index );
			var paramList = data.paramList;
			var paramString = '';
			for( var key in paramList ) {
				var item = paramList[ key ];
				paramString += "<font color='#999999'>参数名：</font>" + item.paramName;
				paramString += "&nbsp;&nbsp;";
				paramString += '<font color="#999999">参数说明：</font>' + item.paramDesc;
				paramString += "&nbsp;&nbsp;&nbsp;&nbsp;"
			}
			var html = '<table class="form">'+
						'    <tr class="form-row">'+
						'        <th class="form-field" width="15%">'+
						'            接口名'+
						'        </th>'+
						'        <td  class="form-component">'+	data.name + '</td>'+
						'    </tr>'+
						'    <tr class="form-row"> ' +
						'        <th class="form-field">'+
						'            接口地址'+
						'        </th>'+
						'        <td class="form-component">'+ data.url +'</td>'+
						'    </tr>'+
						'    <tr class="form-row"> ' +					
						'        <th class="form-field">'+
						'            调用方法'+
						'        </th>'+
						'        <td class="form-component">'+ data.method +'</td>'+
						'    </tr>'+
						'    <tr class="form-row"> ' +
						'        <th class="form-field">'+
						'            参数'+
						'        </th>'+
						'        <td class="form-component">'+ paramString +'</td>                                                                                                                                                                        '+
						'    </tr>'+
						'    <tr class="form-row">'+
						'        <th class="form-field">接口说明</th>'+
						'        <td colspan="3" class="form-component">'+ data.desc  + '</td>'+
						'    </tr>'+
						'    <tr class="form-row"> ' +
						'        <th class="form-field">返回值示例</th>'+
						'        <td colspan="3" class="form-component">'+ data.returnValue +'</td>'+
						'    </tr>'+
						'</table> ';	
			var dialog = getDefaultActionDialog( { htmlDialog: html, title: '查看接口' } );
			dialog.addListener( 'renderComplete', function() {
				$( '#submit_dialog_btn' ).hide();
				$( '#cancel_dialog_btn' ).hide();
			} );
			dialog.initialize();
			dialog.open();			
		} );
	}
	
	function addDescItemToViewPage( data ) {
		dataAccess.add( data );
		var element = getDescItemForViewPage( data );
		resultPlaceholder.append( element );		
	}
	
	function addDescItem( data ) {
		dataAccess.add( data );
		var element = getDescItem( data );
		resultPlaceholder.append( element );
	}
	
	function replaceDescItem( index, data ) {
		dataAccess.replace( index, data ); 
		var element = getDescItem( data );
		resultPlaceholder.find( '[index='+ index +']' ).replaceWith( element );
	}
	
	function getDefaultActionDialog( opt ) {
		var title = opt.title;
		var htmlDialog = opt.htmlDialog;
		
		var mask = Mask.create();
		var oc = new NewOpenAndClose();
		var html = new DialogHtml( { title: title } );
		var dialog = dialogAlias = new PopupLayer( oc, html, htmlDialog );
		dialog.addListener( 'opened', function() {
			mask.show();
		} );
		dialog.addListener( 'closed', function() {
			mask.hide();
			dialog.dispose();
		} );
		dialog.addListener( 'renderComplete', function() {
			$( '#cancel_dialog_btn,#close_btn' ).bind( 'click', function() {
				dialog.close();
			} );
		});
		return dialog;
	}
	
	function fillDialog( data ) {
		var nameEl = $( '#name' );
		var methodEl = $( '#method' );
		var urlEl = $( '#url' );
		var descEl = $( '#desc' );
		var returnValueEl = $( '#return_value' );
		
		nameEl.val( data.name );
		methodEl.val( data.method );
		urlEl.val( data.url );
		descEl.val( data.desc );
		returnValueEl.val( data.returnValue );
		
		var paramListElement = new fn.InitItemControl( paramHtmlTpl, $( '#param_list' ), function( element, data ) {
			if( !data ) {
				return;
			}
			element.find( '[name=param_name]' ).val( data.paramName );
			element.find( '[name=param_desc]' ).val( data.paramDesc );
		} );
		if( data.paramList && data.paramList.length > 0 ) {			
			for( var i = 0; i < data.paramList.length; i++ ) {
				var dataItem = data.paramList[ i ];
				paramListElement.addItem( dataItem );
			}
		} else {
			paramListElement.addItem();
		}
	}	
	
	function showDialogForEdit( data, index ) {
		var dialog = getDefaultActionDialog( { htmlDialog: dialogHtmlTpl, title: '编辑接口说明' } );
		dialog.addListener( 'renderComplete', function() {
			$( '#submit_dialog_btn' ).bind( 'click', function() {
				try{
					var data = getDialogData();
					replaceDescItem( index, data );
					dialog.close();
				} catch( ex ) {
					ex.element.focus();
					alert( ex.message );
				}
			} );
		} );
		dialog.initialize();
		dialog.open();
		fillDialog( data );
	}
	
	function showDialog() {
		var dialog = getDefaultActionDialog( { htmlDialog: dialogHtmlTpl, title: '编辑接口说明' } );
		dialog.addListener( 'renderComplete', function() {
			var paramListElement = new fn.InitItemControl( paramHtmlTpl, $( '#param_list' ) );
			paramListElement.addItem();
			
			$( '#submit_dialog_btn' ).bind( 'click', function() {
				try{
					var data = getDialogData();
					addDescItem( data );
					dialog.close();
				} catch( ex ) {
					ex.element.focus();
					alert( ex.message );
				}
			} );
		} );
		dialog.initialize();
		dialog.open();
	}
	
	function getWebServiceDescList() {
		var result = dataAccess.getAll();
		var list = new Array;
		for( var key in result ) {
			list.push( result[ key ] );
		}
		return list;
	}
	
	function clearWebServiceDescList() {
		dataAccess.clear();
	}
	
	exports.showDialog = showDialog;
	exports.getWebServiceDescList = getWebServiceDescList;
	exports.addDescItem = addDescItem;
	exports.setDialogHtmlTpl = setDialogHtmlTpl;
	exports.setParamHtmlTpl = setParamHtmlTpl;
	exports.setResultPlaceholder = setResultPlaceholder;
	exports.clearWebServiceDescList = clearWebServiceDescList;
	exports.addDescItemToViewPage = addDescItemToViewPage;
} );