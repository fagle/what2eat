function loadNetBar()
{
	var $netbar = $('.netbar');
	var provice = $('#province').val() ?  $('#province').val() : $('#province').attr('prival');
	var city = $('#city').val() ? $('#city').val() : $('#city').attr('prival');
	var data = {'provice' : provice, 'city' : city};
	var id = $("#netbar").attr('prival');
	var url = $netbar.attr('loadurl');
	$.ajaxSetup({  
	    async : false  
	}); 
	$.post(url,data,function(response)
		{
			var response = $.parseJSON(response);
			var $netbar = $('#netbar');
			$netbar.empty();
			$.each(response, function(k, v){
					var checked = id == v['netbar_id'] ? 'selected ' : '';
					if(v['netbar_name'] != '__ALL__'){
						$netbar.append('<option value = "' + v['netbar_id'] + '" ' + checked + '>' + v['netbar_name'] + '(ID:'+ v['netbar_id'] +')' + '</option>');
					}else{
						$netbar.append('<option value = "' + v['netbar_id'] + '" ' + checked + '>' + v['netbar_name'] + '</option>');
					}
					
				})
			
			$("#netbar").select2();	
		}
	);
}

$(function(){
	var Province_City =  new Array();
	Province_City=["\u4e0a\u6d77\u5e02","\u4e91\u5357\u7701","\u5185\u8499\u53e4\u81ea\u6cbb\u533a","\u5317\u4eac\u5e02","\u5409\u6797\u7701","\u56db\u5ddd\u7701","\u5929\u6d25\u5e02","\u5b81\u590f\u56de\u65cf\u81ea\u6cbb\u533a","\u5b89\u5fbd\u7701","\u5c71\u4e1c\u7701","\u5c71\u897f\u7701","\u5e7f\u4e1c\u7701","\u5e7f\u897f\u58ee\u65cf\u81ea\u6cbb\u533a","\u65b0 \u7586\u7ef4\u543e\u5c14\u81ea\u6cbb\u533a","\u6c5f\u82cf\u7701","\u6c5f\u897f\u7701","\u6cb3\u5317\u7701","\u6cb3\u5357\u7701","\u6d59\u6c5f\u7701","\u6d77\u5357\u7701","\u6e56\u5317\u7701","\u6e56\u5357\u7701","\u7518\u8083\u7701","\u798f\u5efa\u7701","\u897f\u85cf\u81ea\u6cbb\u533a","\u8d35\u5dde\u7701","\u8fbd\u5b81\u7701","\u91cd\u5e86\u5e02","\u9655\u897f\u7701","\u9752\u6d77\u7701","\u9999\u6e2f\u7279\u522b\u884c\u653f\u533a","\u9ed1\u9f99\u6c5f\u7701"];
	
	Province_City['上海市'] = '__ALL__|上海市';
	Province_City['云南省'] = '__ALL__|临沧市|保山市|大理白族自治州|文山壮族苗族自治州|昆明市|昭通市|普洱市|曲靖市|楚雄彝族自治州|玉溪市|红河哈尼族彝族自治州|西双版纳傣族自治州';
	Province_City['内蒙古自治区'] = '__ALL__|乌兰察布市|乌海市|兴安盟|包头市|呼伦贝尔市|呼和浩特市|巴彦淖尔市|赤峰市|通辽市|鄂尔多斯市|锡林郭勒盟|阿拉善盟';
	Province_City['北京市'] = '__ALL__|北京市';
	Province_City['吉林省'] = '__ALL__|吉林市|四平市|延边朝鲜族自治州|松原市|白城市|白山市|辽源市|通化市|长春市';
	Province_City['四川省'] = '__ALL__|乐山市|内江市|凉山彝族自治州|南充市|宜宾市|巴中市|广元市|广安市|德阳市|成都市|攀枝花市|泸州市|甘孜藏族自治州|眉山市|绵阳市|自贡市|资阳市|达州市|遂宁市|阿坝藏族羌族自治州|雅安市';
	Province_City['天津市'] = '__ALL__|天津市';
	Province_City['宁夏回族自治区'] = '__ALL__|中卫市|吴忠市|固原市|石嘴山市|银川市';
	Province_City['安徽省'] = '__ALL__|亳州市|六安市|合肥市|安庆市|宣城市|宿州市|巢湖市|池州市|淮北市|淮南市|滁州市|芜湖市|蚌埠市|铜陵市|阜阳市|马鞍山市|黄山市';
	Province_City['山东省'] = '__ALL__|东营市|临沂市|威海市|德州市|日照市|枣庄市|泰安市|济南市|济宁市|淄博市|滨州市|潍坊市|烟台市|聊城市|莱芜市|菏泽市|青岛市';
	Province_City['山西省'] = '__ALL__|临汾市|吕梁市|大同市|太原市|忻州市|晋中市|晋城市|朔州市|运城市|长治市|阳泉市';
	Province_City['广东省'] = '__ALL__|东莞市|中山市|云浮市|佛山市|广州市|惠州市|揭阳市|梅州市|汕头市|汕尾市|江门市|河源市|深圳市|清远市|湛江市|潮州市|珠海市|肇庆市|茂名市|阳江市|韶关市';
	Province_City['广西壮族自治区'] = '__ALL__|北海市|南宁市|崇左市|来宾市|柳州市|桂林市|梧州市|河池市|玉林市|百色市|贵港市|贺州市|钦州市';
	Province_City['新 疆维吾尔自治区'] = '__ALL__|乌鲁木齐市|克孜勒苏柯尔克孜自治州|克拉玛依市|博尔塔拉蒙古自治州|和田地区|哈密地区|喀什地区|塔城地区|巴音郭楞蒙古自治州|昌吉回族自治州|石河子市|阿克苏地区|阿拉尔市';
	Province_City['江苏省'] = '__ALL__|南京市|南通市|宿迁市|常州市|徐州市|扬州市|无锡市|泰州市|淮安市|盐城市|苏州市|连云港市|镇江市';
	Province_City['江西省'] = '__ALL__|上饶市|九江市|南昌市|吉安市|抚州市|新余市|景德镇市|萍乡市|赣州市|鹰潭市';
	Province_City['河北省'] = '__ALL__|保定市|唐山市|廊坊市|张家口市|承德市|沧州市|石家庄市|衡水市|邢台市|邯郸市';
	Province_City['河南省'] = '__ALL__|三门峡市|信阳市|南阳市|周口市|商丘市|安阳市|平顶山市|开封市|新乡市|洛阳市|济源市|漯河市|濮阳市|焦作市|许昌市|郑州市|驻马店市|鹤壁市';
	Province_City['浙江省'] = '__ALL__|丽水市|台州市|嘉兴市|宁波市|杭州市|温州市|湖州市|绍兴市|舟山市|衢州市|金华市';
	Province_City['海南省'] = '__ALL__|万宁市|三亚市|临高县|乐东黎族自治县|定安县|屯昌县|文昌市|海口市|澄迈县|琼海市|陵水黎族自治县';
	Province_City['湖北省'] = '__ALL__|仙桃市|十堰市|咸宁市|天门市|孝感市|宜昌市|恩施土家族苗族自治州|武汉市|潜江市|荆州市|荆门市|襄樊市|鄂州市|随州市|黄冈市|黄石市';
	Province_City['湖南省'] = '__ALL__|娄底市|岳阳市|常德市|张家界市|怀化市|株洲市|永州市|湘潭市|湘西土家族苗族自治州|益阳市|衡阳市|邵阳市|郴州市|长沙市';
	Province_City['甘肃省'] = '__ALL__|兰州市|嘉峪关市|天水市|平凉市|庆阳市|张掖市|武威市|酒泉市|金昌市|陇南市';
	Province_City['福建省'] = '__ALL__|三明市|南平市|厦门市|宁德市|泉州市|漳州市|福州市|莆田市|龙岩市';
	Province_City['西藏自治区'] = '__ALL__|山南地区|日喀则地区';
	Province_City['贵州省'] = '__ALL__|六盘水市|安顺市|毕节地区|贵阳市|遵义市|铜仁地区|黔东南苗族侗族自治州|黔南布依族苗族自治州|黔西南布依族苗族自治州';
	Province_City['辽宁省'] = '__ALL__|丹东市|大连市|抚顺市|朝阳市|本溪市|沈阳市|盘锦市|营口市|葫芦岛市|辽阳市|铁岭市|锦州市|阜新市|鞍山市';
	Province_City['重庆市'] = '__ALL__|重庆市';
	Province_City['陕西省'] = '__ALL__|咸阳市|商洛市|安康市|宝鸡市|延安市|榆林市|汉中市|渭南市|西安市|铜川市';
	Province_City['青海省'] = '__ALL__|海北藏族自治州|海南藏族自治州|海西蒙古族藏族自治州|玉树藏族自治州|西宁市';
	Province_City['香港特别行政区'] = '__ALL__|香港特别行政区';
	Province_City['黑龙江省'] = '__ALL__|七台河市|伊春市|佳木斯市|双鸭山市|哈尔滨市|大兴安岭地区|大庆市|牡丹江市|绥化市|鸡西市|鹤岗市|黑河市|齐齐哈尔市';
	if( $('#province').length !=  0 ) {
		//$('#province').append('<option value=""  >--请选择省--</option>');
		var province_val = $('#province').attr('prival');
		var city_val =  $('#city').attr('prival');
		
		$.each( Province_City , function( k,v ){	//初始化省
			var checked = v == province_val ? 'selected ' :'';
				$('#province').append( '<option value="' + v + '"  ' + checked + ' >' + v + '</option>' );
			});
		if( province_val != ''   ){
			$.each(  Province_City[province_val].split( '|' ) ,function( kk , vv ){	//初始化市
				var checked = vv == city_val ? 'selected ' :'';
				$('#city').append( '<option value="' + vv + '"  ' + checked + ' >' + vv + '</option>' );
				});
			}
		$('#province').change( function(){	//联动效果
				var p_val = $(this).val();
				if( p_val == '' || $('#city').length== 0) {	//如果省的值为空，或者没有市级需求，将不会执行市级循环
					return false;
				}
				
				var province_ = Province_City[ p_val ];
				$('#city').empty();
				
				$.each(  province_.split('|') ,function(kk,vv){
					$('#city').append( '<option value="' + vv + '" >' + vv + '</option>' );
					});

				$('#city').select2();
				loadNetBar();
				$("#netbar_form").trigger('submit');
		});
		
		$("#city").change( function(){
			loadNetBar();
			$("#netbar_form").trigger('submit');
		});
		
		$("#netbar").change( function(){
			$("#netbar_form").trigger('submit');
		});
	}
});


