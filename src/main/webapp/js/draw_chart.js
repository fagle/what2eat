//柱状图和折线图	

Highcharts.setOptions({
	lang : {
			shortMonths: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
		}
});

function create_chart_1(option){
	    Highcharts.setOptions({
	        global: {
	            useUTC: true
	        }
	    });

		def_opt = {
					color:["#FF7F50","#00CED1"]
				}

		option = $.extend(def_opt,option);
         		
        var chart;
        chart = new Highcharts.Chart({
            chart: {
                renderTo: option.render,
                type : 'spline'
            },
            title: {
                text: ' '
            },   
            
            xAxis : {
            	type : 'datetime',
            	dateTimeLabelFormats:{day: '%b-%e(%a)',week:'%b-%e(%a)','month':'%b-%e(%a)'}
    		},
            
            yAxis: [{ // Primary yAxis
                gridLineWidth: 1,
                min : 0,
                title: {
                    text: option.ytitle
                }
    
            }],
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
                    }
                }
            },
            tooltip: {
//                formatter : option.tooltip
                crosshairs: true,
                shared: true
            },

            legend: {
                align: 'right',
                verticalAlign: 'top',
                y: -90,
                floating: true,
                borderWidth: 0
            },           
            series: option.series
        });
        
	    var series = chart.series;

	    for(var i = 0; i < option.hideSeries.length; i++)
	    {
	    	series[option.hideSeries[i]].hide();
	    }
	    
	    $(".Radio").bind('click',function(){
			var value = $(this).val();
			var series = chart.series;
			if(value == 'money'){
				series[0].show();
			    series[1].show();
			    series[2].hide();
			    series[3].hide();			
			}else{
			    series[0].hide();
			    series[1].hide();
			    series[2].show();
			    series[3].show();
			}
	    })
	}
	
	//多条折线
	function create_chart_2(option){
		
	    Highcharts.setOptions({
	        global: {
	            useUTC: false
	        }
	    });		
	    
	    var chart;

	    chart = new Highcharts.Chart({
	        chart: {
	            renderTo: 'chart',
	            type: 'line'
	        },
	        title: {
	            text: ' ',
	            x: -20 //center
	        },
	        xAxis: option.x_type,
	        
	        yAxis: { // Primary yAxis
	            min : 0,
	            title: {
	                text: '人数(K)',
	            },
	            plotLines: [{
	                value: 0,
	                width: 1,
	                color: '#808080'
	            }]

	        },
	        tooltip: {
	            formatter : option.format
	        },
	        
            legend: {
                align: 'right',
                verticalAlign: 'top',
                y: -90,
                floating: true,
                borderWidth: 0
            },
	        series: option.data
	    });
	} 
	//分区实时图
	function create_chart_3(option)
	{
		if(!option.xAxisLabelFormat)
		{
			option.xAxisLabelFormat = {day: '%H:%M'}
		}
		
		if(!option.pointFormat){
			option.pointFormat = '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>';
		}
		
//		window.fdsfa= option;
	    var chart;

	        chart = new Highcharts.Chart({
	            chart: {
	                renderTo: 'chart',
	                type: 'spline'
	            },
	            title: {
	                text: option.text ? option.text : ' ',
	                x: -20 //center 
	            },             
	            xAxis: {
					type: 'datetime',
					categories: option.categories,
					dateTimeLabelFormats:option.xAxisLabelFormat              
	            },
	            yAxis: {
	                title: {
	                    text: option.y_text
	                },
				plotLines: [{
								value: 0,
								width: 1,
								color: '#808080',
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
	                        enabled: option.enableMarker ? option.enableMarker : false,
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
	            series: option.series
	            ,
	            navigation: {
	                menuItemStyle: {
	                    fontSize: '12px'
	                }
	            },

				//legend 不显示
	            legend: {
	                align: 'right',
	                verticalAlign: 'top',
	                y: -90,
	                floating: true,
	                borderWidth: 0
	            }
	        });
	        
	    //隐藏不显示的series
	    var series = chart.series;

	    for(var i = 0; i < option.hideSeries.length; i++)
	    {
	    	series[option.hideSeries[i]].hide();
	    }    
	}
	
	function create_chart_3s(option)
	{
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
		

		
	    var chart;

	        chart = new Highcharts.Chart({
	            chart: {
	                renderTo: 'chart',
	                type: 'spline'
	            },
	            title: {
	                text: ' ',
	                x: -20 //center
	            },             
	            xAxis: {
	                type: 'datetime',
					dateTimeLabelFormats:option.xAxisLabelFormat              
	            },
	            yAxis: {
	                title: {
	                    text: option.y_text
	                },
				plotLines: [{
								value: 0,
								width: 1,
								color: '#808080',
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
	            series: option.series
	            ,
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
	        });
	        
	    //隐藏不显示的series
	    var series = chart.series;

	    for(var i = 0; i < option.hideSeries.length; i++)
	    {
	    	series[option.hideSeries[i]].hide();
	    }    
	}

	function create_chart_3f(option)
	{
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
		

		
	    var chart;

	        chart = new Highcharts.Chart({
	            chart: {
	                renderTo: 'chart',
	                type: 'spline'
	            },
	            title: {
	                text: ' ',
	                x: -20 //center
	            },             
	            xAxis: {
	                type: 'datetime',
					dateTimeLabelFormats:option.xAxisLabelFormat              
	            },
	            yAxis: {
	                title: {
	                    text: option.y_text
	                },
				plotLines: [{
								value: 0,
								width: 1,
								color: '#808080',
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
	            	formatter : option.formatter ? option.formatter : null
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
	            series: option.series
	            ,
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
	        });
	        
	    //隐藏不显示的series
	    var series = chart.series;

	    for(var i = 0; i < option.hideSeries.length; i++)
	    {
	    	series[option.hideSeries[i]].hide();
	    }    
	}	
	
	function create_chart_3c(option)
	{
		if(!option.xAxisLabelFormat)
		{
			option.xAxisLabelFormat = {day: '%H:%M'}
		}
//		window.fdsfa= option;
	    var chart;

	        chart = new Highcharts.Chart({
	            chart: {
	                renderTo: 'chart',
	                type: 'spline'
	            },
	            title: {
	                text: ' ',
	                x: -20 //center
	            },             
	            xAxis: {
	                type: 'datetime',
					dateTimeLabelFormats:option.xAxisLabelFormat              
	            },
	            yAxis: [{
	                title: {
	                    text: option.y_text
	                },
				plotLines: [{
								value: 0,
								width: 1,
								color: '#808080',
							}],
	                min: 0,
	                minorGridLineWidth: 1
	            },{
	                title: {
	                    text: option.y_text2
	                },
				plotLines: [{
								value: 0,
								width: 1,
								color: '#808080',
							}],
					min: 0,
	                minorGridLineWidth: 1
	            }],
	            tooltip: {
	            	dateTimeLabelFormats : {
	            		day: '%y-%b-%e(%a)',
	            		minute: '%y-%b-%e, %H:%M (%a)',
	            		hour: '%y-%b-%e, %H:%M (%a)',
	            	},
	            	formatter : option.formatter ? option.formatter : null,
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
	            series: option.series
	            ,
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
	        });
	        
	    //隐藏不显示的series
	    var series = chart.series;

	    for(var i = 0; i < option.hideSeries.length; i++)
	    {
	    	series[option.hideSeries[i]].hide();
	    }    
	}	
	
	//柱状图
	function create_chart_4(option)
	{		
	    var chart;
	    chart = new Highcharts.Chart({
	        chart: {
	            renderTo: 'chart',
	            type: 'column'
	        },
	        title: {
	            text: ' '
	        },
	        xAxis: {
	            categories: option.categories
	        },
	        yAxis: {
	            min: 0,
	            title: {
	                text: option.y_text
	            },
	            stackLabels: {
	                enabled: true,
	                style: {
	                    fontWeight: 'bold',
	                    color: 'gray'
	                }
	            }
	        },
	        tooltip: {
	            formatter: option.tooltip
	        },
	        plotOptions: {
	            column: {
	                stacking: 'normal',
	                dataLabels: {
	                    enabled: true,
	                    color: 'white',
	                    formatter: function() {
	                    	
	                    	if(this.y)
	                    	{
	                    		var y_max = this.series.yAxis.dataMax;
	                    		//用来标记是否线数百分比  当这段柱状图的百分比为最大值得1/4时，不显示百分比
	                    		var underLevel = parseInt(y_max/this.point.stackTotal);
	                    		
	                    		var percent = ((this.y/this.point.stackTotal)*100).toFixed(2);
	                    		
	                    		if(underLevel < 4)
	                    		{
	                    			//当小于10%的时候不显示
		                    		if(percent < 10)
		                    		{
		                    			return this.y;
		                    		}
		                    		else
		                    		{
		                    			return this.y + '<br>' + percent + '%';
		                    		}	                    			
	                    		}
	                    		else
	                    		{
	                    			return this.y;
	                    		}
	                    	}
	                    }
	                }
	            }  
	        },
	        series: option.series,
	        
	        legend: {
	            align: 'right',
	            verticalAlign: 'top',
	            y: -10,
	            floating: true,
	            borderWidth: 0
	        }
	    }); 
	    
	    $('.highcharts-axis-labels text').css("fontSize", "12px");
	}
	
	function create_pie_1(option)
	{
	 	var chart = new Highcharts.Chart({
	        chart: {
	            renderTo: option.render,
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false
	        },
	        title: {
	            text: ' '
	        },
	        tooltip: {
	    	    pointFormat: '{series.name}: <b>{point.percentage}%</b>',
	        	percentageDecimals: 1
	        },
	        plotOptions: {
	            pie: {
	                allowPointSelect: true,
	                cursor: 'pointer',
	                dataLabels: {
	                    enabled: true,
	                    color: '#000000',
	                    fontSize:'12px',
	                    connectorColor: '#000000',
	                    formatter: function() {
	                        return "<p>"+ this.point.name +'</p>: <strong>'+ this.percentage.toFixed(4) +' %</strong>';
	                    }
	                }
	            }
	        },
	        series: [{
	            type: 'pie',
	            name: option.name,
	            data: option.data,
	            dataLabels: {
                    enabled: true,
                    style: {
                    	fontSize:'12px'
                        }
                }
	        }]
	    });    
		//将图表中的字体设置为12号
	}	
	