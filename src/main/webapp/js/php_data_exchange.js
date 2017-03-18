

function hander_realtime_data(data)
{
	var len = data.length;
	
	var result = [];
	
	var tmp, i;
	
	for(i = 0; i < len; i++)
	{
		tmp = data[i];

		if(tmp == 'null')
		{
			tmp = null;
		}
		else 
		{
			tmp = parseInt(tmp, 10);
		}
		result.push(tmp);
	}
	
	
	return result;
	
}

function hander_zone_time_data(data)
{
	var result = {};
	
	var i,j,k;
	
	for(i = 0; i < data.length; i++)
	{
		for(j in data[i])
		{
			for(k = 0; k < data[i][j].length; k++)
			{
				if(data[i][j][k] == 'null')
				{
					data[i][j][k] = null;
				}
				else
				{
					data[i][j][k] = parseInt(data[i][j][k],10);
				}
			}	
			result[j] = data[i][j];
		}	
	}	
	return result;
}


function hander_Area_data(data)
{
	var result = [];
	
	for(var i = 0; i < data.length; i++)
	{
		var one = data[i];
		
		if(one.region != '未知')
		{
			result.push({'provice' : one.region, 'count' : one.users, 'percent' : one.percent});
		}
	}
	
	return result;
}

function hander_reg_isp_data(chart_data)
{
	var tmp, pieData = [], val , final_data = 100, percent;

	for(var i = 0; i < chart_data.length; i++)
	{
		tmp = chart_data[i];
		
		percent = parseFloat(tmp.percents, 10);

		final_data -= percent;
		
		if(i == 0)
		{
			
			val = {
                    name: tmp.isp,
                    y: percent,
                    sliced: true,
                    selected: true
				};
		}
		else 
		{
			val = [tmp.isp, percent];
		}
			
		pieData.push(val);
	}

	final_data = parseFloat(final_data.toFixed(4),10);	
	pieData.push(['其他', final_data]);
	
	return pieData;
}

function hander_str_to_number_active(data)
{
	var i, j, tmp, name,value;

	for(i = 0; i < data.length; i++)
	{
		tmp = data[i];
		
		for(name in tmp)
		{
			value = tmp[name];
			for(j = 0; j < value.length; j++)
			{
				if(value[j] === 'null')
				{
					value[j] = null;
				}
				else
				{
					if(arguments.length = 2){ value[j] = parseFloat(value[j], 10);}
					else{ value[j] = parseInt(value[j], 10);}
					
				}	
				
			}	
		}	
	}
	return data;
}

function hander_str_to_number_media(data)
{
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
}

function hander_array_to_num(data)
{
	for(var i = 0 ; i < data.length; i++){
		
		if(data[i] == 'null'){
			data[i] = null;
		}else{
			data[i] = parseInt(data[i], 10);
		}
	}
	return data;
}