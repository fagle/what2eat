/**
 * Author: dingwei 2014-06-27
 * Description: jQuery.selecter.js
 * Modified by: 
 * Modified contents: 
**/
(function($){
	
	var g = {
		// 
		addOptions: function(target, o){
			var _this = this, url = core.isFunction(o.url) ? o.url() : o.url, params = core.isFunction(o.params) ? o.params() : o.params;
			$.ajax({
				url: url,
				data: params,
				type: o.type,
				async: o.async,
				cache: o.cache,
				dataType: o.dataType,
				success: function(result){
					var options = [];
					for(var i = 0, len = result.length; i < len; i++){
						var option = result[i], value, display, flag = core.isPlainObject(option);
						value = flag ? option.value : option;
						display = flag ? option.display : option;
						options.push('<option value="' + value + '">' + display + '</option>');
					}
					$(target).html(options.join(''));
					_this.dress(target, o);
				}
			});
		},
		// 
		dress: function(target, o){
			var _this = this, tg = $(target);
			
			if(!tg.data('selecter')){
				var select = $(_this.getSkin(target, o));
				
				tg.before(select).wrap('<div style="display:none;"></div>');
				
				select.click(function(e){
					if(tg.attr('disabled')){
						return false;
					}
					
	                $(this).find(':text').focus();
					
					if($(this).find('div.ui-selecter-options').is(':visible')){
						_this.clean($(this));
					}
					else{
						ui.components.collapse();
						
						if(core.isFunction(o.onDropdown)){
							o.onDropdown(target);
						}
						
						if(tg.find('option').length != 0){
							g.dropdown($(this), target, o);
						}
					}
					
					e.stopPropagation();
				});
				
				$(document).click(function(e){
					g.clean(select);
				});
				
				tg.data('selecter', select);
			}else{
				var i = target.selectedIndex, text = tg.find('option').eq(i).text();
				tg.data('selecter').find(':text').val(text);
			}
		},
		// 
		getSkin: function(target, o){
			var tg = $(target), html = [], id = '', className = '', style = '', disabled = '', readonly = '', value = '';
			
			if(tg.attr('id')){
				id = ' id="' + tg.attr('id') + '-selecter"';
			}
			if(tg.attr('class')){
				className = ' ' + tg.attr('class');
			}
			if(tg.attr('style')){
				style = ' style="' + tg.attr('style') + '"';
			}
			if(tg.attr('disabled')){
				disabled = ' disabled="disabled"';
			}
			if(tg.readonly){
				readonly = ' readonly="readonly"';
			}
			value = tg.find('option:selected').text();
			
			html.push('<div class="ui-text ui-selecter' + className + '"' + style + '>');
			html.push('<input type="text"' + id + ' class="ui-text-text"' + disabled + readonly + ' value="' + value + '" />');
			html.push('<i class="ui-text-icon ui-text-select"></i>');
			html.push('<div class="ui-selecter-options"></div>');
			html.push('</div>');
			
			return html.join('');
		},
		// 
		dropdown: function(select, target, o){
			var oOptions = $(target).find('option'), n1 = oOptions.length, n2 = o.scrollRange, nOptionsBox = select.find('div.ui-selecter-options'), nOptionsHtml = [];
			
			nOptionsBox.height(n1 > n2 ? (22 * n2) : 'auto');
			
			oOptions.each(function(){
				var oOption = $(this), text = oOption.text(), disabled = oOption.attr('disabled');
				nOptionsHtml.push('<li title="' + text + '"' + (disabled ? ' disabled="disabled"' : '') + '><label>' + text + '</label></li>');
			});
			
			nOptionsBox.html('<ul class="ui-selecter-options-ul">' + nOptionsHtml.join('') + '</ul>');
			
			var nOptions = select.find('li');
			
			nOptions.click(function(e){
				if($(this).attr('disabled')){
					return false;
				}
				
				var i = nOptions.index(this);
				
				if(core.isFunction(o.onSelect)){
					if(!o.onSelect(target, oOptions.get(i))){
						g.clean(select);
						return false;
					}
				}
				
				target.selectedIndex = i;
				
				$(target).change();
				
				var value = $(target).find('option:eq(' + i + ')').text();
				
				select.find(':text').val(value).focus().blur();
				
				g.clean(select);
				
				e.stopPropagation();
			}).mouseover(function(){
				if($(this).attr('disabled')){
					return false;
				}
				
				$(this).addClass('hover').siblings().removeClass('hover');
			});
			
			select.find('li:eq(' + target.selectedIndex + ')').addClass('hover');
			
			select.css('z-index', 100).find('div.ui-selecter-options').css('display', 'block');
		},
		// 
		clean: function(select){
			if(select.length > 0){
				select.css('z-index', '').find('div.ui-selecter-options').html('').css('display', 'none');
			}
		}
	};
	
	$.fn.selecter = function(o){
		o = $.extend({}, {
			url: null,
			params: null,
			type: 'POST',
			async: false,
			cache: false,
			dataType: 'json',
		    readonly: true,
			scrollRange: 10,
			onDropdown: null,
			onSelect: null
		}, o);
		
		return this.each(function(){
			if(o.url){
				g.addOptions(this, o);
			}else{
				g.dress(this, o);
			}
		});
	};
	
})(jQuery);
