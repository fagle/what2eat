define( function( require, exports, module ) {
	var UIBase = require( 'uibase' );

	//聊天展示
	var SOCKET_STATE_CONNECT = 0;
	var SOCKET_STATE_DATA = 1;
	var SOCKET_STATE_CLOSE = 2;
	var SOCKET_STATE_ERROR = 3;
    var SOCKET_STATE_TIMEOUT = 4;
	
	var CMD_RECONNECT = 'reconnect';
	
	function Chat( webSocketAddress, chatServerAddresss, areaInfo ) {
		var self = this;
		var ws;
		var isPause = false;
        var currAreaId;

		var connectToChatServer = function() {
            ws.send( JSON.stringify( chatServerAddresss ) );
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

		var messageView = function( wsData ) {
			var event = wsData.event;
			var time = formatTime( wsData.time );
            var data = wsData.data;
            var areaId = data.areaId;
            var playerId = data.playerId;
            var content = data.content;

            switch( event ) {
			case SOCKET_STATE_CONNECT:
				createMessage( '', time, '系统提示', content, event );
				break;
			case SOCKET_STATE_DATA:
				if( isPause ) {
					break;
				}
                if( currAreaId && currAreaId != areaId ) {
                    break;
                }
				createMessage( areaId, time, playerId, content, event );
				break;
			case SOCKET_STATE_CLOSE:
				createMessage( '', time, '系统提示', content, event );
				break;
			case SOCKET_STATE_ERROR:
				createMessage( '', time, '系统提示', content, event );
				break;
				default:
			}
		}

        var createMessage = function( areaID, time, uid, msg, event ) {
            var msgClass = '';
            if( event != SOCKET_STATE_DATA ) {
                msgClass = 'warning';
            }
            var btnHtml = '';
            if( event === SOCKET_STATE_DATA ) {
                btnHtml += "<a href='javascript:;' name='account_lock'>封号</a>&nbsp;&nbsp;<a href='javascript:;' name='forbidden_chat'>禁言</a>";
            }
            var messageHtml = '<tr class="list_item" area_id="'+ areaID +'" uid="'+ uid +'" event="'+ event +'">';
            messageHtml += "<td width='120'>"+ (areaInfo.getAreaNameById(areaID) || '') +"</td>";
            messageHtml += '<td width="160">'+ time +'</td>';
            messageHtml += '<td width="120">'+ uid +'</td>';
            messageHtml += "<td><span class='"+ msgClass +"'>"+ msg +"</span></td>";
            messageHtml += "<td width='90' style='border-left:none; text-align: right;'>"+ btnHtml +"</td>";
            messageHtml += '</tr>';
            var maxRecordCount = 2000;
            if( $( '#msg_list tr' ).length > maxRecordCount ) {
                $( '#msg_list tr:gt('+ maxRecordCount +')' ).remove();
            }
            $( '#msg_list' ).prepend( messageHtml );
        }

        var initBtnEvent = function() {
            $( '#msg_list a[name="forbidden_chat"]').live( 'click', function() {
                var tableRow = $( this).parents('tr');
                var areaId = tableRow.attr('area_id');
                var uid = tableRow.attr( 'uid' );
                window.parent.showForbiddenTalkDialog( areaId, uid );
            } );
            $( '#msg_list a[name="account_lock"]').live( 'click', function() {
                var tableRow = $( this).parents('tr');
                var areaId = tableRow.attr('area_id');
                var uid = tableRow.attr( 'uid' );
                window.parent.showLockAccountDialog( areaId, uid );
            } );
        }

        this.setAreaId = function( areaId ) {
            currAreaId = areaId;
        }

		this.pause = function( pause ) {
			isPause = pause;
		}

		this.reconnect = function() {
			ws.send( JSON.stringify( { 'cmd': CMD_RECONNECT } ) );
		}
		
        this.init = function() {
    		var wsHost = webSocketAddress.host;
            var wsPort = webSocketAddress.port;
            var address = 'ws://' + wsHost + ':' + wsPort;
            ws = new WebSocket( address );
   	        ws.onopen = function( e ){
                console.log( e );
   	        	createMessage( '', formatTime(new Date()), '系统提示', 'WebSocket服务器已连接', '' );
   	        	connectToChatServer();
   	        };
   	        ws.onmessage = function( e ){
   				console.log( e );
   				messageView( JSON.parse( e.data ) );
   	        };
   	        ws.onerror = function( e ){
   	   	        console.log( e );
   	        	createMessage( '',  formatTime(new Date()), '系统提示', 'WebSocket服务器连接异常', '' );
   	        };
   	        ws.onclose = function( e ){
   	        	console.log( e );
   	        	createMessage( '',  formatTime(new Date()), '系统提示', 'WebSocket服务器连接断开', '' );
   	        };

            initBtnEvent();
        }
	}
	
	Chat.SOCKET_STATE_CONNECT = SOCKET_STATE_CONNECT;
	Chat.SOCKET_STATE_DATA = SOCKET_STATE_DATA;
	Chat.SOCKET_STATE_CLOSE = SOCKET_STATE_CLOSE;
	Chat.SOCKET_STATE_ERROR = SOCKET_STATE_ERROR;
    Chat.SOCKET_STATE_TIMEOUT = SOCKET_STATE_TIMEOUT;

	exports.Chat = Chat;
} );