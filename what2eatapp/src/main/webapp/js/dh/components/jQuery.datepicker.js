/**
 * Description: jQuery.datepicker.js
 * Modified by: 
 * Modified contents: 
**/
if(typeof WdatePicker == 'undefined'){
	// 导入WdatePicker脚本
	window.core.includeJs('../../core/js/third/My97DatePicker/WdatePicker.js');
	// 
	(function($){
		$.fn.datepicker = function(o){
			// 扩展默认参数
			o = $.extend({}, {
				eventType: 'click',
				readonly: false,
				errDealMode: 1,
				qsEnabled: false
			}, o);
			
			return this.each(function(){
				var _this = $(this);
	        	
	        	// 私有对象
	        	var p = {};
	        	
	        	// 缓存文本框
				if(_this.is('div')){
				    p.text = _this.find('input.ui-text-text').eq(0);
				    p.icon = _this.find('i.ui-text-icon').eq(0);
					p.box = _this;
				}else if(_this.is(':text')){
				    p.text = _this;
				    p.icon = _this.next('i.ui-text-icon');
					p.box = _this.parent();
				}
				
				// 设置只读属性
	        	if(o.readonly === true){
	        		p.text.attr('readonly', o.readonly);
	        	}
	        	
	        	var id = p.text.attr('id');
	        	
	        	
	        	p.box.addClass('ui-datepicker');
				
				// 文本框触发日期选择
				p.text.on(o.eventType, function(){
					// 
					ui.components.collapse();
					// 
					WdatePicker(o);
				});
				
				// 图标触发日期选择
				p.icon.on('click', function(){
					// 设置 el 参数，指定文本框用于存储日历值
					o.el = p.text.attr('id');
					// 
					ui.components.collapse();
					// 
					WdatePicker(o);
				});
			});
		};
	})(jQuery);
}
