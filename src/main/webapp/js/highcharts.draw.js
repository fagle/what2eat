/**
 *  需要先引入highcharts插件。
 *  config = {
 *  	'start' : '2014-07-01',
 *  	'data' : {'key':[1,2,3,4,5,6]}, //data采用每个key对应一个数组，数组中为起始日期到结束日期的各个值，中间是空的必须补全
 *  	'key' : {'key':'key代表的说明'},
 *  	'title' : ' ',
 *  	'hidden' : []
 *  }
 *  
 *  $(function(){
		var config = {
				'start'  : '<?php echo $start;?>',
				'data'   : <?php echo $chart;?>,
				'key'    : <?php echo json_encode($config);?>,
				'title'  : ' ',//默认为空
				'y_text' : ' ',//默认为空
				'type'   : 'datetime', // x轴坐标类型, 默认为datetime
				'xrotation'		: '-90', // x轴文字方向, 默认0
				'xalign' : 'right', // x轴文字对齐设置, 默认center
				'xAxis_labels_enabled'		: 是否显示x轴文字, 默认true
				'categories'	: null, // x轴坐标设置, 默认null
				'pointFormat'	: undefined, // tips格式设置, 默认undefined
				'headerFormat'	: undefined, // tips格式设置, 默认 '<span style="font-size: 10px">{point.key}</span><br/>'
				'hidden' : [], //默认为空
			}
		new Line( config );
	});

 */

var Line = function( config )
{
	this.option = {};
	
	this.chart = null;
	
	var self = this;
	
	this._getSepDate = function( date ){
		var arr, result;
		if (date === null) {
			return null;
		}
		
		arr = date.split(' ');
		
		result = {};
		
		if(arr[0])
		{
			var y = arr[0].split('-');
			result['year'] = y[0];
			result['month'] = y[1] - 1;
			result['day'] = y[2];		
		}	

		if(arr[1])
		{
			var t = arr[1].split(':');
			result['hour'] = parseInt(t[0],10);
			result['minute'] = parseInt(t[1],10);
		}else{
			result['hour'] = 0;
			result['minute'] = 0;
		}	
		
		return result;
	};
	
	this.setColor = function(){
		if(config.color){
		    Highcharts.setOptions({
		    	colors: config.color
		    });
		}
	};
	
	/**
	 * 将数据转成highcharts可识别的数据
	 */
	this._handerData = function( data ){
		for(i in data)
		{
			for(j = 0; j < data[i].length; j++ ){
				if(data[i][j] == 'null'){
					data[i][j] = null;
				}
				else{
					data[i][j] = parseFloat(data[i][j]);
				}
			}
			
		}
		return data;
	};
	
	/**
	 * 检测data中key的个数，如果为1，隐藏图标中legend
	 */
	this._checkKey = function(){
		var data = config.data;
		var count = 0;
		for(var i in data){
			count ++ ;
		}
		return count;
	}
	
	/**
	 * highchart series 转化
	 */
	this._buildSeries = function(  ){
		var data = config.data;
		var key = config.key;
		
		data = this._handerData( data );
		
		var series = [];
		
		var name, tmp;
		
		for(name in data)
		{
			tmp = {};
			tmp['name'] = key[name];
			tmp['data'] = data[name];
			series.push(tmp);
		}
		return series;
		
	};
	
	this._buildOption = function(){
		
		var start = config.start ? config.start : null;
		var date = this._getSepDate( start );
		
		var option = {
				title : config.title ? config.title : ' ',
				series : (config.key === undefined) ? config.data : this._buildSeries(),
				pointInterval : config.pointInterval ? config.pointInterval : 86400000,
				pointStart : (date === null) ? null : Date.UTC(date.year, date.month, date.day, date.hour, date.minute, 0),
				y_text : config.y_text ? config.y_text : ' ',
				xAxisLabelFormat : {day:'%b-%e(%a)',week:'%b-%e(%a)',month:'%b-%e(%a)'},
				xAxis_labels_enabled: config.xAxis_labels_enabled === undefined ? true : config.xAxis_labels_enabled,
				show : config.show ? config.show : '',
				type: config.type ? config.type : 'datetime',
				categories: config.categories ? config.categories : null,
				xalign: config.xalign ? config.xalign : "center",
				xrotation: config.xrotation ? config.xrotation : 0,
				pointFormat: config.pointFormat ? config.pointFormat : undefined,
				headerFormat: config.headerFormat ? config.headerFormat : '<span style="font-size: 10px">{point.key}</span><br/>'
			};
		
		return option;
	};
	
	this._hiddenSeries = function(){
		
		var hidden = config.hidden;

		if( hidden.length ){
		    var series = this.chart.series;
			
		    for(var i = 0; i < hidden.length; i++)
		    {
		    	series[hidden[i]].hide();
		    }			
		}
	};
	
	this.draw = function(  ){
        
		var option = this._buildOption();
		
		if(!option.xAxisLabelFormat)
		{
			option.xAxisLabelFormat = {day: '%H:%M'}
		}

		if(!option.pointFormat){
			if(option.show == 'percent'){
				option.pointFormat = '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}%</b><br/>';
			}
			else{
				option.pointFormat = '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>';
			}
		}
		
		this.option = {
	            chart: {
	                renderTo: 'chart',
	                type: 'spline'
	            },
	            title: {
	                text: option.title,
	                x: -20 //center
	            },             
	            xAxis: {
	                type: option.type,
					dateTimeLabelFormats: option.xAxisLabelFormat,
					categories: option.categories,
					labels: {
						align: option.xalign,
						rotation: option.xrotation,
						enabled: option.xAxis_labels_enabled
					}
	            },
	            yAxis: {
	                title: {
	                    text: option.y_text
	                },
					plotLines: [{
						value: 0,
						width: 1,
						color: '#808080'
					}],
	                min: 0,
	                minorGridLineWidth: 1
	            },
	            tooltip: {
	            	dateTimeLabelFormats : {
	            		day: '%y-%b-%e(%a)',
	            		minute: '%y-%b-%e, %H:%M (%a)',
	            		hour: '%y-%b-%e, %H:%M (%a)',
	            	},
	            	pointFormat: option.pointFormat,
	            	formatter : option.formatter ? option.formatter : null,
					headerFormat: option.headerFormat,
	                crosshairs: true,
	                shared: true
	            },
	            plotOptions: {
	                spline: {
	                    lineWidth: 1,
	                    states: {
	                        hover: {
	                            lineWidth: 2
	                        }
	                    },
	                    marker: {
	                        enabled: false,
	                        states: {
	                            hover: {
	                                enabled: true,
	                                symbol: 'circle',
	                                radius: 5,
	                                lineWidth: 1
	                            }
	                        }
	                    },
	                    pointInterval: option.pointInterval,
	                    pointStart: option.pointStart
	                }
	            },
	            series: option.series,
	            navigation: {
	                menuItemStyle: {
	                    fontSize: '12px'
	                }
	            },
		        legend: {
		            align: 'right',
		            verticalAlign: 'top',
		            y: -10,
		            floating: true,
		            borderWidth: 0
		        }
	    	};
		
		//隐藏legend;
		var keycount = this._checkKey();
		if(keycount <= 1){
			this.option.legend.y = -60;
		}
		
		this.chart = new Highcharts.Chart(this.option);
		
		(config.hidden === undefined) || this._hiddenSeries();
	};
	
	//设置月份可时间
	(function __construct(){
	    
		Highcharts.setOptions({
			lang : {
					shortMonths: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
				}
		});
		
		Highcharts.setOptions({
	        global: {
	            useUTC: true
	        }
	    });
		self.setColor();
		self.draw();
	    
	})(self)
}


/**
 * 柱状图
 * config = {
 * 		 'data' : [{},{}],
 * 		 'key'  : "key", //需要好几个值才能组合的key需要用"tmp.key1 + '_' + tmp.key2"的方法
 * 		 'value': 'value'
 * 		 'info' : {}
 * 
 * }
 */
var Column = function( config ){
	
	this.option = {};
	
	this.category = [];
	
	this.series = [];
	
	this.chart = null;
	
	this.rank = null;//rank 默认为空，显示所有.当要显示1-20， 21-40的分页显示的时候才起作用。
	
	var self = this;
	//柱的颜色
	var color = ['#B22222', '#DC143C','#C71585', '#FF4500', '#DAA520','#FFD700','#ADFF2F','#98FB98','#87CEFA','#E0FFFF'];
	
	this._setRank = function(){
		
		if( config.rank ){
			this.rank = config.rank;
		}
	};
	
	this._setSeries = function(){
		
		this._setRank();
		
		var seq = null;
		
		var def = { 
				data : [],
				name : config.info[ config.value ],
                dataLabels: {
                    enabled: true,
                    rotation: -90,
                    color: '#FFFFFF',
                    align: 'right',
                    x: 4,
                    y: 10,
                    style: {
                        fontSize: '10px'
                    }
                }
        };
		
		this.series.push( def );
		
		var data = config.data;
		
		var count = data.length;
		
		var cz = Math.ceil(count/10);
		
		if( this.rank ){
			
			var rank_array = this.rank.split('-');
			
			for(i = rank_array[0] - 1; i < rank_array[1]; i++)
			{
				seq = parseInt((i%20)/5, 10);
				var tmp = data[i];
				
				if( tmp[ config.key ] ){
					this.category.push( tmp[config.key] );
				}else{
					this.category.push( eval( config.key ) );
				}
				
				this.series[0]['data'].push({'y':parseFloat( tmp[ config.value ],10 ), 'color' : color[seq] } );
			}
			
			config.title = config.title+"（"+ this.rank +"）";
			
		}else{
			for( var i in data ){
				
				var tmp = data[i];
				
				if( tmp[ config.key ] ){
					this.category.push( tmp[config.key] );
				}else{
					this.category.push( eval( config.key ) );
				}
				
				seq = parseInt(i%(cz*10)/cz,10);

				this.series[0]['data'].push({'y':parseFloat( tmp[ config.value ],10 ), 'color' : color[seq] } );

			}		
		}

	};
	
	this.draw = function(){
		this._setSeries();
		
		this.option = {
		        chart: {
		            renderTo: 'chart',
		            type: 'column',
		        },
		        title: {
		            text: config.title
		        },
		        xAxis: {
		            categories: this.category,
		            labels: {
		                rotation: -90,
		                align : 'right',
		                style: {
		                    fontSize: config.xAxisFont ? config.xAxisFont : '12px'
		                }
		            }
		        },
		        yAxis: {
		            min: 0,
		            title: {
		                text: ' '
		            }
		        },
		        legend: {
		            enabled: false
		        },
		        //添加了点击时间
		        plotOptions : {
		        	column:{
			        	events : { click : config.click ? config.click : function(){}}	        		
		        	}
		        },
		        tooltip: {
		            formatter: function() {
		                return '<b>' + this.x +'</b><br/>'+
		                    '<b>' + this.series.name + '：' + Highcharts.numberFormat(this.y, 0) + '</b>';
		            }
		        },
		        series: this.series
			};
		
		this.chart = new Highcharts.Chart(this.option);
		
	};
	
	(function __construct(){
	    
		Highcharts.setOptions({
			lang : {
					shortMonths: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
				}
		});
		
		Highcharts.setOptions({
	        global: {
	            useUTC: true
	        }
	    });
		self.draw();
	    
	})(self)
	
}

/**
 * 饼图
 */

var Pie = function( config ){
	
	var self = this;
	
	this.draw = function(){
		
	 	var chart = new Highcharts.Chart({
	        chart: {
	            renderTo: config.render? config.render:'chart',
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false
	        },
	        title: {
	            text: config.title
	        },
	        tooltip: {
	    	    pointFormat: config.pointFormat ? config.pointFormat : '{series.name}: <b>{point.percentage}%</b>',
	        	percentageDecimals: 1
	        },
	        plotOptions: {
	            pie: {
	                allowPointSelect: true,
	                cursor: 'pointer',
	                dataLabels: {
	                    enabled: true,
	                    color: '#000000',
	                    connectorColor: '#000000',
	                    style:{
	                    	fontSize:'12px'
	                    },
	                    formatter: function() {
	                        return '<p>'+ this.point.name + '</font></p>: <strong>'+ this.percentage.toFixed(2) +' %</strong>';
	                    }
	                },
	                events:{
	                	click : config.click ? config.click : function(){}
	                }
	            }
	        },
	        series: [{
	            type: 'pie',
	            name: '占比',
	            size: 180,
	            data: config.data
	        }]
	    });

	};
	
	(function __construct(){
	    
		self.draw();
	    
	})(self)
}

