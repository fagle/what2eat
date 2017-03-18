/**
 * Description: jQuery.datepicker.js
 * Modified by: Dingwei
 * Modified contents: 
**/
if(typeof WdatePicker === 'undefined'){
	// 引入WdatePicker脚本
	core.includeJs('http://ui.om.dianhun.cn/third/My97DatePicker/WdatePicker.js');
	// 
	(function($){
		$.fn.datepicker = function(o){
			// 扩展默认参数
			o = $.extend({}, {
				readonly: false,
				errDealMode: 1,
				qsEnabled: false
			}, o);
			
			// 创建一个指定长度且由字母和数字组成的随机字符串
			var getRandomAlphaNum = function(len){
				var str = '';
				for(; str.length < len; str += Math.random().toString(36).substr(2)){}
				return  str.substr(0, len);
			};
			
			return this.each(function(){
				var _this = $(this);
	        			
				// 私有对象
				var g = {};
					
				// 缓存文本框
				if(_this.is('div')){
					g.input = _this.find('input.form-control').eq(0);
					g.button = _this.find('button.btn').eq(0);
				}else if(_this.is(':text')){
					g.input = _this;
					g.button = null;
				}
	        			
	        			// 设置文本框id属性
	        			var id = g.input.attr('id') || ('txtDatepicker' + getRandomAlphaNum(20));
	        			g.input.attr('id', id);
				
				// 设置文本框readonly属性
				if(o.readonly){
					g.input.attr('readonly', o.readonly);
				}
				
				// 文本框触发日期选择
				g.input.on('focus', function(){
					o.el = id;
					WdatePicker(o);
				});
				
				// 图标按钮触发日期选择
				if(g.button != null){
					g.button.on('click', function(){
						o.el = id;
						WdatePicker(o);
					});
				}
			});
		};
	})(jQuery);
}
