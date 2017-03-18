define( function( require, exports, module ) {
	var UIBase = require( 'uibase' );
	
	//聊天监控消息列表菜单功能
	function Menu() {
		UIBase.call( this );
		
		var self = this;
		var sourceData;
		
		this.getHtmlTpl = function() {			
			var menuHtml = '<div class="menu" id="##" style="position:absolute; display:none;">'+
							'    <ul>'+
							'        <li act="lock_account">封号</li>'+
							'        <li act="forbidden_talk">禁言</li>'+
							'    </ul>'+
							'</div>';
			return menuHtml;
		}

		this.show = function( left, top ) {
			this.getJDom().css( { left: left, top: top } ).show();
		}
		
		this.hide = function() {
			this.getJDom().hide();
		}
		
		this.setSourceData = function( data ) {
			sourceData = data;
		}
		
		this.addListener( 'renderComplete', function() {
			this.getJDom().find( 'li' ).bind( 'click', function() {
				var act = $( this ).attr( 'act' );
				var arg = sourceData;
				arg.act = act;				
				self.fireEvent( 'onItemClick', arg );
			} );
		} );
	}
	
	Menu.ITEM_EVENT_LOCK_ACCOUNT = 'lock_account';
	Menu.ITEM_EVENT_FORBIDDEN_TALK = 'forbidden_talk';
	
	//聊天展示
	var SOCKET_STATE_CONNECT = 'connect';
	var SOCKET_STATE_DATA = 'data';
	var SOCKET_STATE_CLOSE = 'close';
	var SOCKET_STATE_ERROR = 'error';
	
	var CMD_RECONNECT = 'reconnect';
	
	function Chat( cd, currAreaID ) {
		var self = this;
		var ws;
		var userName;
		var currTownID;
		var isPause = false;
		var chatServers = cd.getAreaInfo( currAreaID );
		
		var connectToChatServer = function() {
			var areaID = chatServers['area_id'];
			var towns = chatServers[ 'towns' ];
			for( var townID in towns ) {
				var town = towns[ townID ];
				var data = {};
				data[ 'area_id' ] = areaID;
				data[ 'town_id' ] = townID;
				data[ 'host' ] = town.host;
				data[ 'port' ] = town.port;
				data[ 'user_name' ] = userName;
				ws.send( JSON.stringify( data ) );
			}
		}

		var formatTime = function( time ) {
			var date = new Date( time );
			var year  = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDate();
			var hour = date.getHours();
			var minute = date.getMinutes();
			var second = date.getSeconds();
			return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
		}

		var createMessage = function( areaID, townID, time, uid, msg, event ) {
			var msgClass = '';
			if( event != SOCKET_STATE_DATA ) {
				msgClass = 'warning';
			}
			var messageHtml = '<tr class="list_item" area_id="'+ areaID +'" uid="'+ uid +'" event="'+ event +'">';
			messageHtml += "<td width='120'>"+ cd.getAreaName( areaID ) +"</td>";
			messageHtml += "<td width='120'>"+ cd.getTownName( areaID, townID ) +"</td>";
			messageHtml += '<td width="160">'+ time +'</td>';
			messageHtml += '<td width="120">'+ uid +'</td>';
			messageHtml += "<td class='"+ msgClass +"'>"+ msg +"</td>";
			messageHtml += '</tr>';
			var maxRecordCount = 2000;
			if( $( '#msg_list tr' ).length > maxRecordCount ) {
				$( '#msg_list tr:gt('+ maxRecordCount +')' ).remove();
			}
			$( '#msg_list' ).prepend( messageHtml );
		}
		
		var messageView = function( data ) {
			var event = data.event;
			var content = data.content;
			var connectInfo = data.connectInfo;
			var areaID = connectInfo.area_id;
			var townID = connectInfo.town_id;
			var time = formatTime( data.time );
			switch( event ) {
			case SOCKET_STATE_CONNECT:
				createMessage( areaID, townID, time, '系统提示', content, event );
				break;
			case SOCKET_STATE_DATA:
				if( isPause ) {
					break;
				}
				var msgItems = content.split(',');
				var uid = msgItems[ 0 ];
				uid = uid.replace( /^[^\d]+/, '' );
				var msg = msgItems[ 1 ];
				if( !currTownID ) {
					createMessage( areaID, townID, time, uid, msg, event );
				} else if( townID == currTownID ) {
					createMessage( areaID, townID, time, uid, msg, event );
				}
				break;
			case SOCKET_STATE_CLOSE:
				createMessage( areaID, townID, time, '系统提示', content, event );
				break;
			case SOCKET_STATE_ERROR:
				createMessage( areaID, townID, time, '系统提示', content, event );
				break;
				default:
			}
		}

		this.setUserName = function( un ) {
			userName = un;
		}

		this.setCurrTownID = function( townID ) {
			currTownID = townID;
		}

		this.pause = function( pause ) {
			isPause = pause;
		}

		this.reconnect = function() {
			ws.send( JSON.stringify( { 'cmd': CMD_RECONNECT } ) );
		}
		
        this.init = function( address ) {
    		//var address = 'ws://192.168.12.120:3003';
   	        ws = new WebSocket( address );
   	        ws.onopen = function( e ){
   	        	createMessage( '', '', new Date().getTime(), '系统提示', 'WebSocket服务器已连接', '' );
   	        	connectToChatServer();
   	        };
   	        ws.onmessage = function( e ){
   				messageView( JSON.parse( e.data ) );
   	        };
   	        ws.onerror = function( e ){
   	   	        console.log( e );
   	        	createMessage( '', '', new Date().getTime(), '系统提示', 'WebSocket服务器连接异常', '' );
   	        };
   	        ws.onclose = function( e ){
   	        	console.log( e );
   	        	createMessage( '', '', new Date().getTime(), '系统提示', 'WebSocket服务器连接断开', '' );
   	        };
        }
	}
	
	Chat.SOCKET_STATE_CONNECT = SOCKET_STATE_CONNECT;
	Chat.SOCKET_STATE_DATA = SOCKET_STATE_DATA;
	Chat.SOCKET_STATE_CLOSE = SOCKET_STATE_CLOSE;
	Chat.SOCKET_STATE_ERROR = SOCKET_STATE_ERROR;
	
	//动态加载大区、城镇select元素和聊天监控iframe
	function Renderor( cd, contentUrl ) {
		var self = this;
		var chatServers = cd.getChatServers();

		this.initFilterControl = function() {
			this.initMonitorWindow();
			
			for( var key in chatServers ) {
				var areaItem = chatServers[ key ];
				$( '#area' ).append( '<option value="'+ key +'">'+ areaItem.area_name +'</option>' );
			}
			$( '#area' ).bind( 'change', function() {
				var areaID = this.value;
				var towns = chatServers[ areaID ][ 'towns' ];
				var townOptionHtml = '<option value="">-所有城镇-</option>';
				for( var key in towns ) {
					var town = towns[ key ];
					townOptionHtml += "<option value='"+ key +"'>"+ town.town_name +"</option>";
				}
				$( '#town' ).html( townOptionHtml )
				.unbind( 'change' )
				.bind( 'change', function() {
					var townID = this.value;
					if( typeof( self.onTownChange ) == 'function' ) {
						if( !townID ) {
							self.onTownChange( null );
							return;
						}
						var town = towns[ townID ];
						self.onTownChange( town );
					}
				} );
				if( typeof( self.onAreaChange ) == 'function' ) {
					var areaInfo = chatServers[ this.value ];
					self.onAreaChange( areaInfo );
				}
			} );
			
			$( '#area' ).trigger( 'change' );		
		}
		
		this.initMonitorWindow = function() {
			for( var areaID in chatServers ) {
				var areaItem = chatServers[ areaID ];
				var html = '<iframe area_id='+ areaID +' style="width:100%; height:600px; display:none;" marginheight="0" marginwidth="0" scrolling="no" frameborder="0" src="' + contentUrl + '?area_id=' + areaID +'"></iframe>';
				$( '#chat_monitor_content' ).append( html );
			}
		}
		
		this.getSelectedArea = function() {
			return $( '#area' ).val();
		}

		this.getSelectedTown = function() {
			return $( '#town' ).val();
		}

		this.getCurrIframeWindow = function() {
			var areaID = this.getSelectedArea();
			var currIframe = $( 'iframe[area_id='+ areaID +']' );
			var iframeWindow = currIframe.get( 0 ).contentWindow;
			return iframeWindow;
		}
	}	
	
	//配置数据操作
	var ConfigData = function( chatServers ) {
		this.getChatServers = function() {
			return chatServers;
		}
		
		this.getAreaInfo = function( areaID ) {
			return chatServers[ areaID ];
		}
		
		this.getAreaName = function( areaID ) {
			if( areaID ) {				
				return this.getAreaInfo( areaID )[ 'area_name' ]  
			} else {
				return '';
			}
		}
		
		this.getTownName = function( areaID, townID ) {
			if( areaID && townID ) {
				var areaInfo = this.getAreaInfo( areaID );
				var towns = areaInfo[ 'towns' ];
				return towns[ townID ][ 'town_name' ];
			} else {
				return '';
			}
		}
	}
	
	exports.Menu = Menu;
	exports.Chat = Chat;
	exports.Renderor = Renderor;
	exports.ConfigData = ConfigData;
} );