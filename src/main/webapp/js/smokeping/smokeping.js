jQuery( function( $ ) {
	var refresh = {
			timer: null,
			
			endable: function() {
				var step = $( 'HEAD>META[refresh=custom]' ).attr( 'content' ) * 1000;
				this.timer = window.setTimeout( function(){
					window.location.reload();
				}, step );
				return this;
			},
			
			disable: function() {
				window.clearTimeout( this.timer );
				return this;
			}
	}.endable();
		
	if( !/\d+(_\d+)+$/.test( window.location.href ) ) {
		return;
	}	
	
	void function() {
		$( 'div>a:gt(0)' ).each( function() {
			var self = $( this );
			var showChartBtn = $( '<input type="button" value="detail" />' );	
			self.after( showChartBtn );
			showChartBtn.css( { 'display': 'block', 'margin-left': '50%' } );
			var url = findUrl( self );
			var ip = getIpAddr( url );
			var timeRange = getTimeRange( self );
			showChartBtn.bind( 'click', function() {
				if( typeof( onShowChartBtnClick ) == 'function' ) {
					onShowChartBtnClick( ip, timeRange );
					refresh.disable();
				}
			} );
		} );
	}();
	
	function getServiceUrl( ip ) {
		var s = ip.src;
		var d = ip.dst;
		var url = 'http://gm.om.dianhun.cn/';                                           
		//url = 'http://192.168.12.142/samba/gm_chh/';
		var URL = url + 'web_service.php?controller=smokeping&action=index&key=a9b59dbb018e2a23297df9e36d59a868&callback=callbackFnName&src=' + s + '&dst=' + d;
		return URL;
	}
	
	function findUrl( element ) {
		var img = element.children( 'img' );
		var url = img.parents('a').attr( 'href' );
		//url = 'http://ping.om.dianhun.cn/?displaymode=n;start=2014-12-31%2005:36;end=now;target=HangZhou_ShiJiCheng_Telecom.HangZhou_ShiJiCheng_183_136_237_178~M3TD_S1_DR';
		return url;
	}
	
	function getTimeRange( element ) {
		var img = element.children( 'img' ).get(0);
		var value = img.src.match( /\d+(?=\.\w+$)/ )[ 0 ];
		return value;
	}
	
	function showLayer() {
		var layerHtml = "<div class='popup'><span class='close'></span><div id='view_route_info' class='view_route_info'><p class='loading'>loading...</p></div></div>";
		var layer = $( layerHtml );
		var maskHtml = "<div class='mask'></div>";
		var mask = $( maskHtml );
		mask.css( { 
            opacity: 0.5, 
        	height: $( document ).height()
        } );
		$( 'body' ).append( layer );
		showLayer.setLayerTop();
		$( 'body' ).append( mask );
		layer.find( '.close' ).bind( 'click', function() {
			showLayer.removeLayer();
		} );
	}
	
	showLayer.setLayerTop = function() {
		var layer = $( '.popup' );
		layer.css( { 'top': $( document ).scrollTop() + $( window ).height() / 2 - layer.height() / 2 } );
	}
	
	showLayer.removeLayer = function() {
		$( '.popup' ).remove();
		$( '.mask' ).remove();
		showDelayDetail.close();
		refresh.endable();
	}
	
	showLayer.getMask = function() {
		return $( '.mask' );
	}
	
	
	function renderTable( response ) {
		var data = response.route_info; 
		if(!data || data instanceof Array ) {
			$( '#view_route_info' ).html( '<div class="error">no data</div>' );
			return;
		}
		var src = response.src;
		var dst = response.dst;
		var timeRangeList = response.time_range_list;
		var startTime  = response.start_time;
		var endTime = response.end_time;
		var html = "<table class='table' cellspacing='1' cellpadding='5'>";
		html += "<tr><th colspan='11' class='thead'>" +
				src + ' <b>to</b> ' + dst + "&nbsp;&nbsp;&nbsp;&nbsp;<b>TimeRange: </b>" + startTime + ' <b>to</b> ' + endTime +
				"</th></tr>";
		html += "<tr>";
		html += "<th>IP Addr</th>";
		for( var i = 0; i < timeRangeList.length; i++ ) {
			var rangeStart = new Date( timeRangeList[ i ].start  * 1000 );
			var rangeEnd = new Date( timeRangeList[ i ].end * 1000 );
			var key = rangeStart.getHours() + '-' + rangeEnd.getHours();
			html += "<th>" + key + "</th>";
		}
		html += "</tr>";
		
		var detailMap = {};
		var mapKey = 0;
		for( var ip in data ) {
			var dataItem = data[ ip ];
			ip = ip.replace( 'to', '&nbsp<b>to</b>&nbsp;' );
			html += "<tr>";
			html += "<td>" + ip + "</td>";
			for( var key in dataItem ) {
				var item = dataItem[ key ];
				var highlightClass = "";
				if(item.delay_avg > 0 ) {
					highlightClass = "highlight";
				}
				mapKey ++
				detailMap[ mapKey.toString() ] = item.delay_detail;
				html += "<td class='"+ highlightClass +"' map_key="+ mapKey +">" + item.delay_avg + "</td>";
			}
			html += "</tr>";
		}
		html += "</table>";
		$( '#view_route_info' ).html( html );
		
		$( '#view_route_info' ).find( '[map_key]' ).bind( 'mouseover', function() {
			var mapKey = $( this ).attr( 'map_key' );
			var detailInfo = detailMap[ mapKey ];
			if( detailInfo.length == 0 ) {
				return;
			}
			showDelayDetail( detailInfo, $( this ) );
		} );
		
		$( '#view_route_info' ).bind( 'mouseout', function( e ) {
			var t = e.toElement || e.relatedTarget;
			if( showDelayDetail.element.get( 0 ).contains( t ) ) {
				return;
			}
			showDelayDetail.close();
		} );
		
		showLayer.getMask().bind( 'mouseenter', function() {
			showDelayDetail.close();
		} );
		
		showLayer.setLayerTop();
	}

	function showDelayDetail( data, refElement ) {
		data.sort( function( a, b ) {
			return new Date( a.time ).getTime() - new Date( b.time ).getTime();
		} );
		
		showDelayDetail.close();
		refElement.addClass( 'selected' );
		
		var html = "<div class='delay_detail'>";
		html += "<span class='close'></span>";
		html += "<div>";
		for( var i = 0; i < data.length; i++ ) {
			var dataItem = data[ i ];
			var className = '';
			if( parseInt( dataItem.value ) > parseInt( refElement.html() ) ) {
				className = 'highlight';
			}
			html += "<p class='"+ className +"'>";
			html += "<span>time: </span>" + dataItem.time;
			html += "&nbsp;";
			html += "<span>value: </span>" + dataItem.value;
			html += "</p>";
		}
		html += "</div>";
		html += "</div>";
		var detailElement = $( html );
		$( 'body' ).append( detailElement );	
		
		var style = {};
		style.left = refElement.offset().left;
		style.top = refElement.offset().top + refElement.get( 0 ).offsetHeight;
		detailElement.css( style );
		detailElement.find( '.close' ).bind( 'click', function() {
			showDelayDetail.close();
		} );
		showDelayDetail.element = detailElement;
	}
	
	showDelayDetail.element;
	
	showDelayDetail.close = function() {
		$( '.delay_detail' ).remove();
		$( '.selected' ).removeClass( 'selected' );
	}
	
	function getRouteTraceData( ip, timeRange ) {
		   var url = getServiceUrl( ip );                                        
		   var ajaxOption = {
				 type : "get",
				 url : url,
				 dataType : "jsonp",
				 data: { 'time_range': timeRange },
				 success : function(json){
					 renderTable( json );
				 },
				 error: function(){
					 alert( JSON.stringify( arguments ) );
					 showLayer.removeLayer();
				 }				   
		    };
		    $.ajax( ajaxOption );
	}
	
	function onShowChartBtnClick( ip, timeRange ) {
		if( !ip ) {
			alert( 'ip not exists' )
			return;
		}
		showLayer();
		getRouteTraceData( ip, timeRange );
	}
} );