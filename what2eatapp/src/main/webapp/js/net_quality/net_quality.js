(function(){	
	require.config({
		paths: {
			echarts: 'js/net_quality/lib'
		},
		packages: [
			{
				name: 'BMap',
				location: 'js/net_quality/lib/package',
				main: 'main'
			}
		]
	});
		
	function buildOption() {
		var option = {
	            // 标题
				title: {
					text: '全国网络质量监控',
					x: 600,
					y: 50,
					textStyle: {
						color: '#fff',
						fontSize: 40,
						fontWeight: 400,
						fontFamily: 'microsoft yahei'
					}
				},
	            // 提示
				tooltip: {
					trigger: 'item',
					formatter: function(v){
						return v[1].replace(':', '>');
					}
				},
				dataRange: {
					min: 0,
					max: 100,
					orient: 'horizontal',
					x: 76,
					y: 50,
					calculable: true,
					color: ['#8B0000','#FF0000','#FF4500','#FFA500','#26ff00'],
				//	color: ['#ff3333', 'orange', 'yellow', 'lime', 'aqua'],
					textStyle: {
						color: '#fff'
					}
	            },
				series: [
			    	        {
			    	            name: '低延迟',
			    	            type: 'map',
			    	            hoverable: false,
			    	            mapType: 'none',
			    	            itemStyle:{
			    	                normal:{
			    	                    borderColor:'rgba(100,149,237,1)',
			    	                    borderWidth: 0.6,
			    	                    areaStyle:{
			    	                        color: '#1b1b1b'
			    	                    }
			    	                }
			    	            },
			    	            
			    	            data:[],
			    	            markLine : {
			    	                smooth:true,
			    	                symbolSize : 0.4,
			    	                itemStyle : {
			    	                    normal: {
			    	                    	color:'#26ff00',
			    	                        borderWidth:0.4,
			    	                        label: { show: false },
			    	                        lineStyle: {
			    	                            shadowBlur: 6,
			    	                           // type: 'solid'
			    	                        }
			    	                    }
			    	                },
			    	                data : rrd_data.low
			    	            },

			    	            geoCoord: {
			    	                '北京_兆维_双线_119.90.35.132':[116.4166,39.9166],
			    	                '北京_兆维_双线_123.103.17.150': [116.3706,40.1052],
			    	                '北京_兆维_双线_223.203.210.58': [116.8923,40.2121],
			    	                '北京_兆维_双线_106.3.35.125': [116.4631,39.4353],
			    	                '广东_顺德_电信_113.105.247.12': [112.8955,23.1097],
			    	                '杭州_公司_电信_192.168.12.21': [119.5313,29.8773],
			    	                '杭州_公司_电信_122.224.197.39': [119.0313,29.373],
			    	                '杭州_世纪城_电信_183.136.237.178':[118.9313,28.473],
			    	                '上海_南汇_电信_222.73.123.219':[121.3755,30.954],
			    	                '沈阳_915_联通_218.60.54.132' : [123.1238,41.1216],
			    	                '沈阳_滑翔_联通_218.60.54.130' : [122.1238,42.1216],
			    	                '济南_担山屯_联通_123.129.234.30' : [117.1582,36.8701],
			    	                '天津_华苑_联通_111.161.79.221': [117.1527,39.1065],
			    	                '上海_北艾_电信_114.80.107.136': [121.7755,31.554],
			    	                '武汉_南苑_电信_59.175.132.227': [114.3896,30.6628],
			    	                '郑州_花园路_联通_182.118.23.66':[112.4668,34.6234]
			    	            }
			    	        },
			    	        {
			    	        	name: '中延迟',
			    	            type: 'map',
			    	            hoverable: false,
			    	            mapType: 'none',
			    	            data:[],
			    	            markLine : {
			    	                smooth:true,
			    	                symbol: ['circle', 'arrow'],
			    	                symbolSize : 0.4,
			    	                itemStyle : {
			    	                    normal: {
			    	                    	label: { show: false },
			    	                        borderWidth:0.8,
			    	                        lineStyle: { 
			    	                        	shadowBlur: 6,
			    	                        	//type: 'solid'
			    	                        }
			    	                    }
			    	                },
			    	                data : rrd_data.normal,
			    	            }
			    	        },
			    	        
			    	        {
			    	            name: '高延迟',
			    	            type: 'map',
			    	            mapType: 'none',
			    	            data:[],
			    	            markLine : {
			    	                smooth:true,
			    	                effect : {
			    	                    show: true,
			    	                    scaleSize: 1,
			    	                    period: 30,
			    	                    color: '#fff',
			    	                    shadowBlur: 10
			    	                },
			    	                symbolSize : 0.8,
			    	                itemStyle : {
			    	                    normal: {
			    	                        borderWidth:0.8,
			    	                        label: { show: false },
			    	                        lineStyle: {
			    	                        	type: 'solid',
			    	                            shadowBlur: 6
			    	                        }
			    	                    }
			    	                },
			    	                data : rrd_data.delay
			    	            },
			    	            markPoint : {
			    	                symbol:'emptyCircle',
			    	                symbolSize : function (v){
			    	                    return 5 + v/10
			    	                },
			    	                effect : {
			    	                    show: true,
			    	                    shadowBlur : 6
			    	                },
			    	                itemStyle:{
			    	                    normal:{
			    	                        label:{show:false}
			    	                    }
			    	                },
			    	                data : rrd_data.value
			    	            }
			    	        }
	            ]
	        };
		return option;
	}
	
	require(['echarts', 'BMap', 'echarts/chart/map'], function(echarts, BMapExtension){
			$('#main').css({
				height: $('body').height(),
				width: $('body').width()
			});
			
	        // 初始化地图
			BMapExt = new BMapExtension(document.getElementById('main'), BMap, echarts,{
				enableMapClick: false
			});
			var map = BMapExt.getMap();
			var container = BMapExt.getEchartsContainer();
			var startPoint = {
				x: 116.114129,
				y: 37.550339
			};
			var point = new BMap.Point(startPoint.x, startPoint.y);
			map.centerAndZoom(point, 5);
			map.enableScrollWheelZoom(true);
	        // 地图自定义样式
	        map.setMapStyle({
				styleJson: [
					// 海洋
					{
						featureType: 'water',
						elementType: 'all',
						stylers: {
							color: '#031529'
						}
					},
					// 陆地
					{
						featureType: 'land',
						elementType: 'all',
						stylers: {
							color: '#000002'
						}
					},
					// 边界
					{
						featureType: 'boundary',
						elementType: 'geometry',
						stylers: {
							color: '#485b6c'
						}
					},
					// 边界
					{
						featureType: 'boundary',
						elementType: 'geometry.fill',
						stylers: {
							color: '#485b6c'
						}
					},
					// 标签
					{
						featureType: 'label',
						elementType: 'all',
						stylers: {
							visibility: 'off'
						}
					},
					{
						featureType: 'railway',
						elementType: 'all',
						stylers: {
							visibility: 'off'
						}
					},
					{
						featureType: 'highway',
						elementType: 'geometry',
						stylers: {
							visibility: 'off'
						}
					},
					{
						featureType: 'highway',
						elementType: 'geometry.fill',
						stylers: {
							visibility: 'off'
						}
					},
					{
						featureType: 'highway',
						elementType: 'labels',
						stylers: {
							visibility: 'off'
						}
					},
					{
						featureType: 'arterial',
						elementType: 'geometry',
						stylers: {
							visibility: 'off'
						}
					},
					{
						featureType: 'arterial',
						elementType: 'geometry.fill',
						stylers: {
							visibility: 'off'
						}
					},
					{
						featureType: 'poi',
						elementType: 'all',
						stylers: {
							visibility: 'off'
						}
					},
					{
						featureType: 'green',
						elementType: 'all',
						stylers: {
							visibility: 'off'
						}
					},
					{
						featureType: 'subway',
						elementType: 'all',
						stylers: {
							visibility: 'off'
						}
					},
					{
						featureType: 'manmade',
						elementType: 'all',
						stylers: {
							visibility: 'off'
						}
					},
					{
						featureType: 'local',
						elementType: 'all',
						stylers: {
							visibility: 'off'
						}
					},
					{
						featureType: 'arterial',
						elementType: 'labels',
						stylers: {
							visibility: 'off'
						}
					},
					{
						featureType: 'building',
						elementType: 'all',
						stylers: {
							visibility: 'off'
						}
					}
	            ]
	        });
			
	        var myChart = BMapExt.initECharts(container);
	        render();
		}
	);
	
	function forDight(Dight,How) {     
		  Dight = Math.round(Dight*Math.pow(10,How))/Math.pow(10,How);
	      return Dight;
	}
	
	function setDelayBoxHtml() {
		var logList = rrd_data.info;
		if( logList.length == 0 ) {
			return;
		}
		var logItem = logList[ 0 ];
		var dblHtml = '';
		var id = logItem._id['$id'];
		if( logItem.loss != 0 ){
			var percent = forDight(logItem.loss * 5, 2) ;
			dblHtml = '<span class="rate">丢包率'+ percent +'%</span>';
		}
		var html =  '       	 <li style="display:none;" id="'+ id +'">'+
					'                        <div class="node">'+
					'                            <p>'+ logItem.from +'</p>'+
					'                            <p>'+ logItem.to +'</p>'+
					'                        </div>'+
					'                        <div class="info clearfix">'+
					'                            <span class="time">'+ formatTime( logItem.time.sec ) +'</span>'+
												 dblHtml + 
					'                            <span class="delay">延时'+ logItem.value +'ms</span>'+
					'                        </div>'+
					'             </li>';
		var element = $( html );
		if( document.getElementById( id ) ) {
			logList.shift();
			setDelayBoxHtml();
		} else {			
			$( '#delayBox' ).prepend( element );
			element.animate({height: 'toggle'}, function(){
				logList.shift();
				setDelayBoxHtml();
			} );
		}
		if( $( '#delayBox li' ).length > 20 ) {
			$( '#delayBox li' ).last().remove();
		}
	}
	
	function formatTime( sec ) {
		var date = new Date( sec * 1000 );
		var year = date.getFullYear();
		var month  = date.getMonth() + 1;
		var day = date.getDate();
		var hour = date.getHours();
		var minute = date.getMinutes();
		var second = date.getSeconds();
		return year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
	}
	
	function setReportCountHtml() {
		var ajaxOption = {};
		ajaxOption.url = 'index.php?/net/reportCount';
		ajaxOption.dataType = 'JSON';
		ajaxOption.type = 'POST';
		ajaxOption.success = function( response ) {
			if( response.error === 1 ) {
				console.log( response );
				$( '#report_count' ).html('');
			}
			var data = response.data;
			var html = '';
			var index = 0;
			for( var key in data ) {
				index ++;
				name = key.replace( /_[\d].+/,'' );
				var item = {};
				var className = "no";
				if( index <= 3 ) {
					className += " highlight"
				}
				html += '<li class="clearfix"><i class="'+ className +'">'+ index +'</i><span class="node">'+ name +'</span><span class="total">'+ data[key] +'</span></li>'
				if( index >= 10 ) break;
			}
			$( '#report_count' ).html( html );
		}
		$.ajax( ajaxOption );
	}
	
	var BMapExt;
		
	function render() {
		var ajaxOption = {};
		ajaxOption.url = 'index.php?/net/quality';
		ajaxOption.dataType = 'JSON';
		ajaxOption.type = 'POST';
		ajaxOption.data = { 'visit': 'ajax' };
		ajaxOption.success = function( response ) {
			rrd_data = response;
			BMapExt.setOption( buildOption(), true );
			setDelayBoxHtml();
			playAudio( response.info );
		}
		$.ajax( ajaxOption );
	}
	
	var oldinfo = parseInfoId();
	
	function _playAudio(){
		var id = 'audio';
		var audio = document.getElementById(id);
		audio.play();
	}
	
	function playAudio(info){
		var play = false;
		if(info.length == 0){
			return true;
		}
		for(i in info){
			var k = info[i]['_id']['$id'];
			if(!in_array(k, oldinfo)){
				play = true;
				break;
			}
		}
		oldinfo = parseInfoId(info);
		if(play){ _playAudio(); }
	}
	
	function parseInfoId(info){
		var id = [],tmp;
		for( var i in info ) {
			tmp = info[i];
			id.push(tmp['_id']['$id']);
		}
		return id;
	}
	
	function in_array(needle,array){  
	    if(typeof needle=="string"||typeof needle=="number"){  
	        for(var i in array){  
	            if(needle===array[i]){  
	                return i;  
	            }  
	        }  
	        return false;  
	    }  
	}
	
	setReportCountHtml();
	window.setInterval( render, 10000 );
	window.setInterval( setReportCountHtml, 10000 );
})();