/**
 * Author: dingwei 2014-05-13
 * Description: crm.disableButton.js
 * Modified by: 
 * Modified contents: 
 */
(function($){
	var factory = {
		// 禁用按钮
		disableButton: function(button){
			var btn = $(button);
			if(!btn.attr('disabled')){
				var text = btn.find('.ui-button-text').eq(0).text();
				btn.addClass('none').attr('disabled', true).after('<a class="ui-button-disabled"><label class="ui-button-text">' + text + '</label></a>');
			}
		},
		// 启用按钮
		enableButton: function(button){
			var btn = $(button);
			if(btn.attr('disabled')){
				btn.removeClass('none').removeAttr('disabled').next('.ui-button-disabled').remove();
			}
		}
	};
	
	$.fn.disableButton = function(flag){
		return this.each(function(){
			if(flag){
				factory.disableButton(this);
			}else{
				factory.enableButton(this);
			}
		});
	};
})(jQuery);
