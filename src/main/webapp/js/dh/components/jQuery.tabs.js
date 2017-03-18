/**
 * Description: jQuery.tabs.js
 * Modified by: 
 * Modified contents: 
**/
(function($){
    // 
    var g = {
        // 获取url地址
        getTabUrl: function(url){
            if(url){
                switch(typeof url){
                    case 'string':
                        url = url;
                        break;
                    case 'function':
                        url = url();
                        break;
                    default:
                        url = null;
                        break;
                }
                // 页面路径必须为字符串格式
                if(core.isString(url)){
                    // 添加随机数参数防止缓存
                    return core.modifyUrl(url, 'random', Math.random());
                }
            }
            return '';
        },
        // 获取页卡头容器宽度
        getHeadContainerWidth: function(head){
            return head.parent().width();
        },
        // 获取可见页卡的总宽度
        getVisibleItemsWidth: function(lis){
            var total = lis.filter(':visible').length, width = total * 71;
            return width;
        }
    };

    $.fn.tabs = function(o){
        o = $.extend({}, {
            items: null,
            defaultShowPage: 0,
            beforeOnSwitch: null,
            onSwitch: null
        }, o);

        return this.each(function(){
            // 获取页卡头容器、页卡躯体容器
            var oContianer = $(this), head = oContianer.find('.ui-tabs-head ul').eq(0), body = oContianer.find('.ui-tabs-body').eq(0);

            // 添加动态页卡项
            if(o.items){
                var items = [], iframes = [];
                for(var i = 0, len = o.items.length; i < len; i++){
                    var item = o.items[i];
                    if(item){
                        items.push('<li data-index="' + i + '"><h4>' + item.display + '</h4></li>');
                        iframes.push('<div class="ui-tabs-iframe"></div>');
                    }
                }
                head.append(items.join(''));
                body.append(iframes.join(''));
            }

            // 获取页卡项集合
            var lis = head.children('li'), divs = body.children('div');

            // 预加载
            for(var i = 0, len = lis.length; i < len; i++){
                var li = lis.eq(i), idx = li.attr('data-index'), title = li.find('h4').text(), div = divs.eq(i);
                li.attr('title', title);
                if(idx === undefined){
                    continue;
                }
                var item = o.items[idx];
                if(item.loadType == 'load'){
                    (function(li, div, item){
                        div.load(g.getTabUrl(item.url), function(){
                            if(core.isFunction(item.loadReady)){
                                item.loadReady(li.get(0), div.get(0));
                            }
                        });
                    })(li, div, item);
                }
            }

            oContianer
            // 注册页卡切换事件
            .on('click.tabs', '.ui-tabs-head:first li', function(e){
                var i = lis.index(this), li = lis.eq(i), idx = li.attr('data-index'), div = divs.eq(i), flag = true;

                // 切换前回调函数
                if(core.isFunction(o.beforeOnSwitch)){
                    flag = o.beforeOnSwitch(this, div.get(0));
                }

                // 切换时回调函数
                if(core.isFunction(o.onSwitch)){
                    flag = o.onSwitch(this, div.get(0));
                }

                if(flag !== false){
                    // 切换显隐状态
                    li.addClass('active').siblings().removeClass('active');
                    div.css('display', 'block').siblings().css('display', 'none');

                    if(idx){
                        var item = o.items[idx];
                        if(item.loadType == 'click'){
                            var isLoaded = li.attr('isloaded');
                            if(!isLoaded){
                                div.load(g.getTabUrl(item.url), function(){
                                    if(core.isFunction(item.loadReady)){
                                        item.loadReady(li.get(0), this);
                                    }
                                    if(!item.reloadOnClick){
                                        li.attr('isloaded', true)
                                    }
                                });
                            }
                        }
                    }
                }

                // 阻止事件冒泡
                e.stopPropagation();
            })

            // 激活指定的页卡
            lis.eq(o.defaultShowPage).trigger('click');
        });
    };
})(jQuery);
