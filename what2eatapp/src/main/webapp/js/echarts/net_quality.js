
function requireCallback ( echarts ) {
	var height = document.documentElement.clientHeight;
	$('#main').height(height);
	draw_map( echarts );
}

var myChart;
var echarts;

function draw_map( echarts ){
	var domMain = document.getElementById('main');
	var curTheme = 'default';
	myChart = echarts.init(domMain, curTheme);
	var option = buildOption( rrd );
//    window.onresize = myChart.resize;
    myChart.setOption(option, true);
}	


function buildOption( rrd_data ){
	
	var series = [
	    	        {
	    	            name: '低延迟',
	    	            type: 'map',
	    	            hoverable: false,
	    	            mapType: 'china',
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
	    	                        lineStyle: {
	    	                            shadowBlur: 6
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
	    	            mapType: 'china',
	    	            data:[],
	    	            markLine : {
	    	                smooth:true,
	    	                symbol: ['circle', 'arrow'],
	    	                symbolSize : 0.4,
	    	                itemStyle : {
	    	                    normal: {
	    	                        borderWidth:0.8,
	    	                    }
	    	                },
	    	                data : rrd_data.normal,
	    	            }
	    	        },
	    	        
	    	        {
	    	            name: '高延迟',
	    	            type: 'map',
	    	            mapType: 'china',
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
	    	    ];
	
	var option = {
    	    backgroundColor: '#1b1b1b',
    	    color: ['gold','aqua','lime'],
    	    title : {
    	        text: '全国网络质量监控',
    	        x:'center',
    	        y: 140,
    	        textStyle : {
    	        	fontSize: 42,
    	            color: '#E6E6FA'
    	        }
    	    },
    	    tooltip : {
    	        trigger: 'item',
    	        formatter: function (v) {
    	            return v[1] + ' 延迟 ' + v[3] + 'ms';
    	        }
    	    },
    	    legend: {
    	        orient: 'vertical',
    	        x:'left',
    	        data:[],
    	        selectedMode: 'multiple',
    	        selected:{
    	            '高延迟' : true
    	        },
    	        textStyle : {
    	            color: '#E6E6FA'
    	        }
    	    },
    	    dataRange: {
    	        min : 0,
    	        max : 100,
    	        calculable : true,
    	        color: ['#8B0000','#FF0000','#FF4500','#FFA500','#26ff00'],
    	        textStyle:{
    	            color:'#E6E6FA'
    	        }
    	    },
    	    series : series
    	};
	
	return option;
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

function ForDight(Dight,How)    
{     
	  Dight = Math.round(Dight*Math.pow(10,How))/Math.pow(10,How);
      return Dight;
}


var Timer = function(data){
	var self = this;
	this.log = data.info;
	this.timer = null;
	
	this.parseInfoId = function(info){
		
		var id = [],tmp;
		for( var i in info )
		{
			tmp = info[i];
//			alert(tmp);
			id.push(tmp['_id']['$id']);
		}
		return id;
	};
	
	this.oldinfo = this.parseInfoId();//记录前面一次上报的告警信息 ;
	
	this.setBoxInfo = function(){
		if(self.log.length == 0){
//			clearTimeout(self.timer);
		} else {
		 	var tmp = self.log[0] 
			if( $('#id_' + tmp['_id']['$id']).length ){
				self.log.shift();
				return ;
			}
		 	//alert( JSON.stringify( tmp ))
			var box = $('#delayBox');
			var timer = null;
			
			self._hideSameFromTo( tmp );
				
			var count = $('#delayBox div:visible').length;
			 
			if( count >= 8 ){
				$('#delayBox div:visible').eq( count -1 ).hide( 400 );
			}
			
//.selector {font-family:"Microsoft YaHei",微软雅黑,"Microsoft JhengHei",华文细黑,STHeiti,MingLiu}
			var info = "<div id='id_" + tmp['_id']['$id'] + "' style='font-family:Microsoft YaHei;color:#E6E6FA;display:none;line-height:30px;font-size:23px;-webkit-text-size-adjust:none;margin-top:15px'><span class='from2to'>" + tmp.from + " > " + tmp.to + "</span>";

			info += "&nbsp;&nbsp;<span style='color:#FF0000;font-weight:700'>延时" + tmp.value + "ms</span>";
			
			if(tmp.loss != 0){
				var percent = ForDight(tmp.loss * 5, 2) ; //20个包，每一个包5%
				info += "&nbsp;&nbsp;<span style='color:#00B8FF;font-weight:700'>丢包率" + percent + "%</span>";
			}
			
			var time = self.getLocalTime(tmp.time.sec);
			
			info += "<br>&nbsp;&nbsp;<span style='font-style:italic'>" + time + "<span>";
			
			info += "</div>";

			$info = $(info);
			
			box.prepend( $info );
			
			$('#delayBox div:first').show( 400 );
			
			$('#delayBox div:hidden').remove();
			
			self.log.shift();
		}
		   		
	};
	
	this.setData = function(data){
		self.log = self.log.concat(data);
	};
	
	this.getLocalTime = function(nS) {     
		   return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');     
	};   
	
	this._hideSameFromTo = function( tmp )
	{
		var $from2to = $('#delayBox div:visible').find('.from2to');
		
		var v = '';

		var value = tmp.from + " > " + tmp.to;
		
		for(var i = 0; i < $from2to.length; i++)
		{
			v = $from2to.eq(i).text();
			if( v == value ){
				
				$from2to.eq(i).parent().hide( 400 );
				return true;
			}
		}
		return false;
	};
	this._playAudio = function(){
		var id = 'audio';
		var audio = document.getElementById(id);
		audio.play();
	};
	
	this.playAudio = function(info){
		var self = this;
		var play = false;
		if(info.length == 0){
			return true;
		}

		for(i in info){
			var k = info[i]['_id']['$id'];
			if(!in_array(k, self.oldinfo)){
				play = true;
				break;
			}
		}
		self.oldinfo = self.parseInfoId(info);
		if(play){ self._playAudio(); }
	};
	
	(function __construction(){
		self.timer = setInterval(self.setBoxInfo, 500);
	})(self);
}


function refresh(){
	var url = $('#main').attr('url');
	var domMain = document.getElementById('main');
	var curTheme = 'default';

	$.post( url, {'visit':'ajax'}, function( response ){

		response = $.parseJSON( response );
		var option = buildOption( response );
		
		myChart.setOption( option , true );
		
		myTimer.setData( response.info );
		myTimer.playAudio( response.info );
	});
}

