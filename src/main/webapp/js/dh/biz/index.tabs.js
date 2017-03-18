
// 仿浏览器页签构造函数
var Tabs = function(o){
    o = jQuery.extend({
        max: 10,
        headId: 'tabs-head',
        bodyId: 'tabs-body',
		listId: 'tabs-list',
        btnTabsLeftId: 'btnTabsLeft',
        btnTabsRightId: 'btnTabsRight',
        btnTabsMoreId: 'btnTabsMore',
        btnTabsCloseId: 'btnTabsClose',
        btnTabsRefreshId: 'btnTabsRefresh',
        activeStyle: 'active'
    }, o);

    this.max = o.max;
    this.headContainer = jQuery('#' + o.headId);
    this.bodyContainer = jQuery('#' + o.bodyId);
    this.listContainer = jQuery('#' + o.listId);
    this.btnTabsLeft = jQuery('#' + o.btnTabsLeftId);
    this.btnTabsRight = jQuery('#' + o.btnTabsRightId);
    this.btnTabsMore = jQuery('#' + o.btnTabsMoreId);
    this.btnTabsClose = jQuery('#' + o.btnTabsCloseId);
    this.btnTabsRefresh = jQuery('#' + o.btnTabsRefreshId);
    this.activeStyle = o.activeStyle;
    this.addEvents();
};

(function(_p, _jq){
	
	// 创建页签
	_p.add = function(o){
	    var id = o.id;
	    if(this.isExisted(id)){
	        this.click(o);
	    }else{
	        var max = this.max;
	        if((typeof max == 'number') && (this.getTotal() < max)){
	        	this.create(o);
	        }else{
	        	artDialog.alert('当前活动的页签数过多，请关闭后再操作！');
	        }
	    }
	};
	
	// 判断页签是否已创建
	_p.isExisted = function(id){
	    return _jq('#' + id).length > 0;
	};
	
	// 获取已创建的页签数量
	_p.getTotal = function(){
	    return this.headContainer.find('li').length;
	};
	
	// 获取当前iframe页面所对应的页签
	_p.getSelf = function(win){
	    if(win && win.frameElement){
	        var iframe = win.frameElement, id = _jq(iframe).attr('for'), obj = _jq('#' + id, this.headContainer);
	        if(obj.length > 0){
	            return obj;
	        }
	    }
	    return null;
	};
	
	// 获取当前iframe页面所对应的页签id属性
	_p.getSelfId = function(win){
	    var obj = this.getSelf(win);
	    if(obj){
	        return obj.attr('id');
	    }
	    return null;
	};
	
	// 获取当前iframe页面所对应的页签pid属性
	_p.getSelfPid = function(win){
	    var obj = this.getSelf(win);
	    if(obj){
	        return obj.attr('pid');
	    }
	    return null;
	};
	
	// 获取当前处于激活状态的页签
	_p.getActive = function(){
	    var obj = this.headContainer.find('li.' + this.activeStyle);
	    if(obj.length > 0){
	        return obj;
	    }
	    return null;
	};
	
	// 获取当前处于激活状态的页签id属性
	_p.getActiveId = function(){
	    var obj = this.getActive();
	    if(obj && obj.length > 0){
	        return obj.attr('id');
	    }
	    return null;
	};
	
	// 获取当前处于激活状态的页签pid属性
	_p.getActivePid = function(){
	    var obj = this.getActive();
	    if(obj && obj.length > 0){
	        return obj.attr('pid');
	    }
	    return null;
	};
	
	// 获取指定页签body内的iframe标签
	_p.getIframe = function(id){
	    if(!id){
	        return null;
	    }
	    var iframe = this.bodyContainer.find('#' + id + '-iframe');
	    if(iframe.length > 0){
	        return iframe.get(0);
	    }
	    return null;
	};
	
	// 获取指定页签body内的iframe标签的contentWindow对象
	_p.getIframeWindow = function(id){
	    if(!id){
	        return null;
	    }
	    var iframe = this.getIframe(id);
	    if(iframe){
	        return iframe.contentWindow;
	    }
	    return null;
	};
	
	// 创建新页签
	_p.create = function(o){
	    var _this = this;
	
	    // 创建页签头
	    var head = _jq(_this.getHtml('head', o));
	    _this.headContainer.append(head);
	    _this.setHeadWidth();
	    head.click(function(){
	        _this.click(o.id, o.reloadOnClick);
	    });
	    _jq('#' + o.id + '-close').click(function(e){
	        _this.close(o.id, o.confirmBeforeClose, false);
	        e.stopPropagation();
	    });
	
	    // 创建页签体
	    var body = _jq(_this.getHtml('body', o));
	    _this.bodyContainer.append(body);
	    _jq('#' + o.id + '-iframe').load(function(){
	        this.contentWindow.scrollTo(0, 0);
	    });
	
	    // 创建页签收藏夹
	    var li = _jq(_this.getHtml('item', o));
	    _this.listContainer.find('ul').append(li);
	    li.click(function(){
	        _this.click(o.id, o.reloadOnClick);
	        _this.listContainer.hide();
	    });
		
	    // 页签创建完成后通过模拟鼠标点击进行激活
	    _jq('#' + o.id).trigger('click');
	};
	
	// 创建html标签
	_p.getHtml = function(type, o){
	    var html = [];
	    switch(type){
	        case 'head':
	            var pid = o.pid ? ' pid="' + o.pid + '"' : '';
	            var name = o.name ? ' name="' + o.name + '"' : '';
	            var lockClass = o.lock ? ' class="lock"' : ' class="unlock"', btnClose = o.lock ? '' : '<b id="' + o.id + '-close" title="关闭"></b>';
	            html.push('<li id="' + o.id + '"' + name + pid + lockClass + '>');
	            html.push('<h4 id="' + o.id + '-title" title="' + o.display + '">' + o.display + '</h4>');
	            html.push(btnClose);
	            html.push('</li>');
	            break;
	        case 'body':
	            var url = o.url; // core.modifyUrl(o.url, 'random', Math.random());
	            html.push('<div id="' + o.id + '-body" class="iframe">');
	            html.push('<iframe id="' + o.id + '-iframe" for="' + o.id + '" frameborder="0" src="' + url + '"></iframe>');
	            html.push('</div>');
	            break;
	        case 'item':
	            html.push('<li id="' + o.id + '-fav" for="' + o.id + '"><a title="' + o.display + '">' + o.display + '</a></li>');
	            break;
	    }
	    return html.join('');
	};
	
	// 设置页签头容器的宽度
	_p.setHeadWidth = function(){
		var oLis = this.headContainer.find('li'), num = 0;
		
		for(var i = 0, len = oLis.length; i < len; i++){
			num += oLis.eq(i).outerWidth(true);
		}
		
	    this.headContainer.width(num);
	};
	
	// 设置页签标题
	_p.setTitle = function(id, text){
	    var title = _jq('#' + id + '-title'), fav = _jq('#' + id + '-fav');
	    
	    if(title.length > 0){
	        title.html(text).attr('title', text);
	    }
	    
	    if(fav.length > 0){
	        fav.find('h4').html(text).attr('title', text);
	    }
	};
	
	// 激活页签
	_p.click = function(){
	    var args = arguments, len = args.length;
	    
	    if(len == 2){
	        var id = args[0], reloadOnClick = args[1], head = _jq('#' + id);
	        
	        if(head.length > 0){
	            head.addClass(this.activeStyle).siblings().removeClass(this.activeStyle);
	            
	            if((head.position().left + this.headContainer.position().left) < 0){
	                this.scroll(3, 10, 20, id);
	            }else if((this.headContainer.parent().width() - (head.position().left + this.headContainer.position().left)) < head.outerWidth(true)){
	                this.scroll(4, 10, 20, id);
	            }
	            
	            this.showBody(id, reloadOnClick);
	        }
	    }else if(len == 1){
	        var o = args[0], head = _jq('#' + o.id);
	        
	        if(head.length > 0){
	            if(head.attr('name') == o.name){
	                this.click(o.id, o.reloadOnClick);
	            }else{
	                head.addClass(this.activeStyle).siblings().removeClass(this.activeStyle);
	                head.attr('name', o.name).find('h4').attr('title', o.display).html(o.display);
	                _jq('#' + o.id + '-fav').find('h4').attr('title', o.display).html(o.display);
	                
	                if((head.position().left + this.headContainer.position().left) < 0){
	                    this.scroll(3, 10, 20, o.id);
	                }else if((this.headContainer.parent().width() - (head.position().left + this.headContainer.position().left)) < head.width()){
	                    this.scroll(4, 10, 20, o.id);
	                }
	                
	                this.showBody(o);
	            }
	        }
	    }
	};
	
	// 显示页签
	_p.showBody = function(){
	    var args = arguments, len = args.length;
	    
	    if(len == 2){
	        var id = args[0], reloadOnClick = args[1], body = _jq('#' + id + '-body');
	        
	        if(body.length > 0){
	            body.css('display', 'block').siblings().css('display', 'none');
	            if(reloadOnClick){
	                this.reload(id, '');
	            }
	        }
	    }else if(len == 1){
	        var o = args[0], body = _jq('#' + o.id + '-body');
	        
	        if(body.length > 0){
	            body.css('display', 'block').siblings().css('display', 'none');
	            this.reload(o.id, o.url);
	        }
	    }
	};
	
	// 刷新页签
	_p.reload = function(id, url){
	    var iframe = _jq('#' + id + '-iframe');
	    
	    if(iframe.length > 0){
	        url = url || iframe.attr('src');
	        // url = core.modifyUrl(url, 'random', Math.random());
	        iframe.attr('src', url);
	    }
	};
	
	// 关闭页签
	_p.close = function(id, confirmBeforeClose, reloadParent){
	    var head = _jq('#' + id), body = _jq('#' + id + '-body'), fav = _jq('#' + id + '-fav');
	    
	    if(head.length == 0 || head.hasClass('lock')){
	        return false;
	    }
	    
	    // 判断关闭页签时是否需要进行确认对话
	    if(confirmBeforeClose){
	        var iframe = _jq('#' + id + '-iframe').get(0);
	        if(iframe){
	            var win = iframe.contentWindow, fn = win.confirmBeforeClose;
	            if(fn && typeof fn == 'function'){
	                if(!fn()){
	                    this.click(id, false);
	                    return false;
	                }
	            }else{
	                return false;
	            }
	        }
	    }
	    
	    // 如该页签处于激活状态，则第一步判断其是否存在父页签，存在则激活父页签；如父页签不存在，则查找该页签的
	    // 前一项，存在则激活前一项；如父页签及前一项都不存在，最后查找该页签的后一项，存在则激活后一项
	    if(head.hasClass(this.activeStyle)){
	        var par = _jq('#' + head.attr('pid')), prev = head.prev(), next = head.next();
	        if(par.length > 0){
	            this.click(par.attr('id'), reloadParent);
	        }else if(prev.length > 0){
	            this.click(prev.attr('id'), false);
	        }else if(next.length > 0){
	            this.click(next.attr('id'), false);
	        }
	    }
	    
	    head.remove();
	    body.remove();
	    fav.remove();
	    
	    this.setHeadWidth();
	    
    	this.scroll(2, 10, 10);
	};
	
	// 关闭所有页签
	_p.closeAll = function(){
	    var _this = this;
	    
	    _this.headContainer.find('li.unlock').each(function(){
	        _jq(this).find('b').trigger('click');
	    });
	    
	    // 如果所有未锁定的页签关闭后还存在锁定的页签且都不处于激活状态，则激活剩余的第一个页签
	    if(_this.headContainer.find('li').length > 0 && _this.headContainer.find('li.' + this.activeStyle).length == 0){
	        _this.click(_this.headContainer.find('li:first').attr('id'), false);
	    }
	};
	
	// 滑动页签头
	_p.scroll = function(type, time, speed, id){
	    var _this = this;
	
	    switch(type){
	        case 0:
	            clearInterval(_this.timer);
	            _this.timer = setInterval(function(){
                    var num = _this.headContainer.position().left;
                    if(num >= 0){
                        clearInterval(_this.timer);
                    }else{
                    	_this.headContainer.css({
                    		'left': num + Math.min(Math.abs(num), speed)
                    	});
                    }
                }, time);
	            break;
	        case 1:
	            clearInterval(_this.timer);
	            _this.timer = setInterval(function(){
					var num = (_this.headContainer.outerWidth(true) + _this.headContainer.position().left) - _this.headContainer.parent().width();
					if(num <= 0){
                        clearInterval(_this.timer);
                    }else{
                    	_this.headContainer.css({
                    		'left': _this.headContainer.position().left - (num < speed ? Math.abs(num) : speed)
                    	});
                    }
                }, time);
	            break;
	        case 2:
	            clearInterval(_this.timer);
	            _this.timer = setInterval(
	                function(){
	                    var num = _this.headContainer.position().left;
	                    if((num >= 0) || ((_this.headContainer.outerWidth(true) + num) >= _this.headContainer.parent().width())){
	                        clearInterval(_this.timer);
	                    }else{
	                    	_this.headContainer.css({
	                    		'left': num + Math.min(Math.abs(num), speed)
	                    	});
	                    }
	                },
	                time);
	            break;
	        case 3:
	            clearInterval(_this.timer);
	            _this.timer = setInterval(function(){
                    var num = $('#' + id).position().left + _this.headContainer.position().left;
                    if(num >= 0){
                        clearInterval(_this.timer);
                    }else{
                    	 _this.headContainer.css({
                    	 	'left': _this.headContainer.position().left + Math.min(Math.abs(num), speed)
                    	 });
                    }
                }, time);
	            break;
	        case 4:
	            clearInterval(_this.timer);
	            _this.timer = setInterval(function(){
                    var num = $('#' + id).outerWidth(true) - (_this.headContainer.parent().width() - ($('#' + id).position().left + _this.headContainer.position().left));
                    if(num <= 0){
                        clearInterval(_this.timer);
                    }else{
                    	_this.headContainer.css({
                    		'left': _this.headContainer.position().left - (num < speed ? Math.abs(num) : speed)
                    	});
                    }
                }, time);
	            break;
	    }
	};
	
	// 加载页签滑动、打开或关闭收藏夹以及关闭所有等事件处理
	_p.addEvents = function(){
		var _this = this;
	    	
		// 向左
		_this.btnTabsLeft.mousedown(function(){
			_this.scroll(0, 10, 20);
		}).mouseup(function(){
			clearInterval(_this.timer);
		});
		
		// 向右
		_this.btnTabsRight.mousedown(function(){
			_this.scroll(1, 10, 20);
		}).mouseup(function(){
			clearInterval(_this.timer);
		});
		
		// 查看已打开的页签
		var
		delay = null,
		fn = function(){
			_this.listContainer.hide();
			_this.btnTabsMore.removeClass('active');
		};
		_this.btnTabsMore.click(function(){
			var flag = _this.listContainer.is(':visible');
			if(flag){
				$(this).removeClass('active');
				_this.listContainer.hide();
			}else{
				$(this).addClass('active');
				_this.listContainer.show();
		}
		}).hover(function(){
			clearTimeout(delay);
		}, function(){
			delay = setTimeout(fn, 1000);
		});
		_this.listContainer.hover(function(){
			clearTimeout(delay);
		}, function(){
			delay = setTimeout(fn, 1000);
		});
		
		// 关闭所有页签
		_this.btnTabsClose.click(function(){
			_this.closeAll();
		});
		
		// 刷新当前页签
		_this.btnTabsRefresh.click(function(){
			_this.reload(_this.getActiveId());
		});
	};
	
})(Tabs.prototype, jQuery);
