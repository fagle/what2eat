
function requireCallback (ec) {
	var height = document.documentElement.clientHeight;
	$('#main').height(height);
	draw_map(ec);
}

var myChart;
var echarts;

var random = function(){
	
	if( Math.random() < 0.5 ){
		return Math.random()* Math.random();
	}else{
		return Math.random()*Math.random() * -1;
	}
}

var buildOption = function( online , title){
	
	var geoCoord = window.geoCoord;
	var i = 0, tmp, key, value,placeList = [],unknow=[];
	
	for( i; i < online.length; i++){
		tmp = online[i];
		key = tmp.key;
		value = tmp.value;
		if( !geoCoord[key] ){
			unknow.push(key);
		}else{
			var d = {};
			d.name = key;
			d.geoCoord = geoCoord[key];
			d.value = value;
			placeList.push(d);
		}
	}
	//打印出在city.coord中找不到的城市
	console.log(unknow);
    
    var data = [];
    var len = placeList.length;
    while(len--) {
   	 geoCoord = placeList[len].geoCoord;
   	 var value = placeList[len].value;
   	 var length = Math.ceil( value/20 );
   	 
   	 for(var i = 0; i < length; i++){
            data.push({
                name : placeList[len].name,
                value : value,
                geoCoord : [ 
                    geoCoord[0] + random(),
                    geoCoord[1] + random()
                ]
            })                                		 
   		 
   	 }
    }
    
	var option = {
            backgroundColor: '#1b1b1b',
            color: [
                '#00ffff'
            ],
            title : {
                text: title ? title : '梦三在线人数实时分布',
    	         x:'center',
   	         y: 140,
   	         textStyle : {
   	        	fontSize: 42,
   	            color: '#E6E6FA'
   	        }
            },
            legend: {
                orient: 'vertical',
                x:'left',
                data:[ ],
                textStyle : {
                    color: '#fff'
                }
            },
            series : [

                {
                    type: 'map',
                    mapType: 'china',
                    itemStyle:{
                        normal:{
                            borderColor:'rgba(100,149,237,1)',
                            borderWidth:1,
                            areaStyle:{
                                color: '#1b1b1b'
                            }
                        }
                    },
                    hoverable: false,
                    roam:false,
                    data : [],
                    markPoint : {
                        symbol : 'diamond',
                        symbolSize: 1,
                        large: true,
                        effect : {
                        	show: true,
                        	shadowBlur : 4,
                        	period : 4
                            
                        },
                        data : data
                    }
                }
            ]
        };
	
	return option;
}

function draw_map( echarts ){
	var domMain = document.getElementById('main');
	var curTheme = 'default';
	myChart = echarts.init(domMain, curTheme);
	
	var option = buildOption( online , '');
	
    myChart.setOption(option, true);
}

function refresh(){
	
	var config = {
			'0':{'url':'online','title':'梦三在线人数实时分布'},
			'1':{'url':'mtdonline','title':'梦塔防在线人数实时分布'}
	};//梦三和塔防切换
	
	var date = new Date();
	var minute = date.getMinutes();
	var current = minute%2;
	
	var cconfig = config[current];
	
	var url = $('#main').attr('url') + '/' + cconfig['url'];
	
	
	var domMain = document.getElementById('main');
	var curTheme = 'default';

	$.post( url, {'visit':'ajax'}, function( response ){

		response = $.parseJSON( response );
		var option = buildOption( response , cconfig['title']);
		
		myChart.setOption( option , true );
		
	});
}
