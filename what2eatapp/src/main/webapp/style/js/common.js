
// 页签
if(window.top.tabs){
	var tabs = window.top.tabs;
}

// 连续发送多个Ajax请求，只记录最后一次请求
(function($){
	var xhr = {};
	$.ajaxSingle = function(o){
		o = $.extend({}, {
			space: 'ajaxSingle'
		}, o);
		if(xhr[o.space]){
			xhr[o.space].abort();
		}
		xhr[o.space] = $.ajax(o);
	}
})(jQuery);

// Ajax请求队列
(function($){ 
	var ajaxRequest = {};
	$.ajaxQueue = function(o){
		o = $.extend({
			space: 'ajaxQueue'
		}, $.ajaxSettings, o);
		var _complete = o.complete;
		$.extend(o, {
			complete: function(){
				if(_complete){
					_complete.apply(this, arguments);
				}
				if($(document).queue(o.space).length > 0){
					$(document).dequeue(o.space);
				}else{
					ajaxRequest[o.space] = false;
				}
			}
		});
		$(document).queue(o.space, function(){
			$.ajax(o);
		});
		if($(document).queue(o.space).length == 1 && !ajaxRequest[o.space]){
			ajaxRequest[o.space] = true;
			$(document).dequeue(o.space);
		}
	};
})(jQuery); 

// 下载
var downattach = function(url){
	if(!url){
		return false;
	}
    var isExisted = $('#downIframe').length > 0;
    if(!isExisted){
        $('body').append('<iframe id="downIframe" style="display:none; height:0; border:0;" frameborder="0" scrolling="no"></iframe>');
    }
    $('#downIframe').attr('src', url);
}

// 
$(function(){
    $('body')
    // 
    .off('click.collapsible').on('click.collapsible', '.panel-collapse .panel-heading', function(){
        var n = $(this).next();
        if(n.is(':visible')){
            n.css('display', 'none');
        }else{
            n.css('display', 'block');
        }
    });
    
    // 初始化日期选择控件
    if($('[data-plugin="datepicker"]').length > 0 && $.fn.datepicker){
    	$('[data-plugin="datepicker"]').datepicker();
    }
    
    // 
    $('.filter').on('click.check', 'a', function(){
		var a = $(this), type = a.data('type');
		if(type == 'all'){
			a.addClass('active').siblings('a').removeClass('active');
		}else{
			a[a.hasClass('active') ? 'removeClass' : 'addClass']('active');
			if(a.siblings('a.active').length == 0){
				a.siblings('a[data-type="all"]').addClass('active');
			}else{
				a.siblings('a[data-type="all"]').removeClass('active');
			}
		}
	}).on('click.toggle', '.toggle', function(){
		var span = $(this), div = span.parent();
		if(div.hasClass('unfold')){
			span.text('展开');
			div.removeClass('unfold');
		}else{
			span.text('收起');
			div.addClass('unfold');
		}
	});
});
