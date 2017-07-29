/**
 * Author: dingwei 2013-10-18
 * Description: jQuery.multiselecter.js
 * Modified by:
 * Modified contents:
 **/
(function($){
	
	var uiMultiSelecterOptsId = 0;
	
	// 
    $.fn.multiSelecter = function(o){
    	// 扩展默认参数
        o = $.extend({}, {
            url: '', // 请求地址
            data: null, // 请求参数
            type: 'GET', // 请求方式
            async: true, // 是否发送异步请求
            cache: false, // 是否缓存
            dataType: 'json', // 预期服务器返回的数据类型
            options: null, // 选项集合
            selected: null, // 默认勾选项
        	zIndex: 100, // 下拉复选框在当前文档中的显示层级
            readonly: true, // 文本框是否只读
            scrollRange: 10, // 选项超过多少条后出现纵向滚动条
            beforeOnSelect: null, // 勾选前事件处理函数
            onSelect: null // 勾选时事件处理函数
        }, o);
        
        // 公共函数
        var g = {
        	// 获取选项
        	getOptions: function(p){
        		var _g = this;
				
				// 发送请求获取选项
				if(o.url){
					var
					// 获取请求地址
					url = core.isFunction(o.url) ? o.url() : o.url,
					// 获取请求参数
					data = core.isFunction(o.data) ? o.data() : o.data;
					
					$.ajax({
						url: url,
						data: data,
						type: o.type,
						async: o.async,
						cache: o.cache,
						dataType: o.dataType,
						success: function(options){
							// 缓存选项
							p.options = options;
							// 填充选项
							_g.addOptions(p);
						},
						error: function(XMLHttpRequest, textStatus, errorThrown){
							// 抛出错误
							throw new Error('Request error: Option request failed!');
						}
					});
				}
				// 从参数配置中获取选项
				else if(o.options){
					// 缓存选项
					p.options = o.options;
					// 填充选项
					_g.addOptions(p);
				}
				// 从文本框data-options属性中获取选项
				else{
					var options = p.text.attr('data-options');
                    if(options){
                    	// 缓存选项
                        p.options = options.split(',');
                        // 填充选项
						_g.addOptions(p);
                    }
				}
        	},
        	// 插入选项
        	addOptions: function(p){
        		var _g = this;
        		
        		if(core.isArray(p.options) && p.options.length > 0){
        			var options = p.options, i = 0, len = options.length;
        			
        			// 设置选项容器id属性
        			var id = 'uiMultiSelecterOpts' + uiMultiSelecterOptsId++;
        			
        			// 设置选项容器高度
        			var height = (len > o.scrollRange) ? (29 * o.scrollRange + 'px') : 'auto';
	        		
	        		// 循环拼接选项
	        		var html = [];
	        		html.push('<div id="' + id + '" class="ui-multiselecter-options" style="height:' + height + ';">');
	        		html.push('<ul>');
	        		for(; i < len; i++){
	        			var opt = options[i], optId = id + i;
	        			// 
	        			if(core.isPlainObject(opt)){
	        				html.push('<li title="' + opt.display + '">');
	        				html.push('<label>');
	        				html.push('<input type="checkbox" class="checkbox" value="' + opt.value + '" />');
	        				html.push('<em>' + opt.display + '</em>');
	        				html.push('</label>');
	        				html.push('</li>');
	        			}
	        			// 
	        			else{
	        				html.push('<li title="' + opt + '">');
	        				html.push('<label>');
	        				html.push('<input type="checkbox" class="checkbox" value="' + opt + '" />');
	        				html.push('<em>' + opt + '</em>');
	        				html.push('</label>');
	        				html.push('</li>');
	        			}
	        		}
	        		html.push('</ul>');
	        		html.push('</div>');
					
					// 将选项插入到文档中
					p.box.css('zIndex', o.zIndex).append(html.join(''));
					
					// 缓存选项容器
					p.list = $('#' + id);
					
					// 定位选项容器
					_g.setListPos(p);
					
					// 初始化勾选项
					_g.initSelected(p);
					
					// 
					_g.addProp(p);
        		}
        	},
        	// 初始化勾选项
        	initSelected: function(p){
        		var allCheckboxs = p.list.find(':checkbox');
        		
        		if(p.selected == undefined){
        			// 从参数配置中获取勾选项
			        if(o.selected){
			        	p.selected = o.selected;
			        }
			        // 从文本框data-selected属性中获取勾选项
			        else{
			        	var attr = p.text.attr('data-selected');
			        	if(attr){
			        		p.selected = attr.split(',');
			        	}
			        }
        		}
		        
		        if(core.isArray(p.selected) && p.selected.length > 0){
		            // 移除所有复选框的勾选状态
		            allCheckboxs.removeAttr('checked');
		            
		            // 勾选相应的复选框
		            for(var i = 0, len = p.selected.length; i < len; i++){
		            	var val = p.selected[i];
		            	p.list.find(':checkbox[value="' + val + '"]').attr('checked', 'checked');
		            }
		        }else{
		            // 移除所有复选框的勾选状态
		            allCheckboxs.removeAttr('checked');
		        }
		    },
        	// 
        	addProp: function(p){
        		var _g = this;
        		
        		p.list.off()
        		// 
        		.on('click.list', function(e){
                    // 阻止事件冒泡
                    e.stopPropagation();
        		})
        		// 
        		.on('click.checkbox', ':checkbox', function(e){
                    // 赋值
                    _g.setValue(p);
                    // 阻止事件冒泡
                    e.stopPropagation();
                });
        	},
        	// 赋值
        	setValue: function(p){
        		var allCheckboxs = p.list.find(':checkbox'), display = [], value = [], result = [];
        		
		        allCheckboxs.filter(':checked').each(function(){
		        	var i = allCheckboxs.index(this), opt = p.options[i];
		        	
		        	// 
		        	if(core.isPlainObject(opt)){
		        		display.push(opt.display);
		            	value.push(opt.value);
		        	}
		        	// 
		        	else{
		        		display.push(opt);
		            	value.push(opt);
		        	}
		        	
		            result.push(opt);
		        });
		        
		        // 文本框赋值
		       	p.text.val(display.join(','));
		       	
		       	// 缓存勾选项
		       	p.selected = value;
		       	
		       	// 回调勾选时事件处理函数
		        if(core.isFunction(o.onSelect)){
		            o.onSelect(result);
		        }
        	},
        	// 定位选项容器
        	setListPos: function(p){
        		var docHeight = $(document).height(), // 文档高度
        		boxTop = p.box.offset().top, // 文本框距离顶部距离
        		boxHeight = p.box.outerHeight(), // 文本框高度（含边框和内边距）
        		listHeight = p.list.outerHeight(); // 选项容器高度（含边框和内边距）
        		
        		if((docHeight - (boxTop + boxHeight)) >= listHeight){
        			p.list.css('top', boxHeight - 2);
        		}else{
        			p.list.css('top', -listHeight);
        		}
        	}
        };

        return this.each(function(){
        	var _this = $(this);
        	
        	// 私有对象
        	var p = {};
        	
        	// 缓存文本框
			if(_this.is('div')){
			    p.text = _this.find('input.ui-text-text').eq(0);
				p.box = _this;
			}else if(_this.is(':text')){
			    p.text = _this;
				p.box = _this.parent();
			}
			
			// 设置只读属性
        	if(o.readonly === true){
        		p.text.attr('readonly', o.readonly);
        	}
            
            // 注册click事件
            p.box.addClass('ui-multiselecter').off('click.multiselecter').on('click.multiselecter', function(e){
            	// 收起组件
            	ui.components.collapse();
        		
        		// 移除前一次请求的选项
				if(p.list){
					// 移除选项标签
					p.list.off().remove();
					// 删除选项缓存
					delete p.list;
				}
            	
            	// 获取选项
            	g.getOptions(p);
            	
            	// 阻止事件冒泡
            	e.stopPropagation();
            });
            
            // 点击文档其它区域收起组件
            $(document).off('click.multiselecter').on('click.multiselecter', function(){
            	// 收起组件
                ui.components.collapse();
            });
        });
    };
    
})(jQuery);
