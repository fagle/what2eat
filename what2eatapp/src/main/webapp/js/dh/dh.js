
// 获取当前窗口对象和顶级窗口对象
var win = window, winTop = win.top;

// 引用顶级窗口的tabs对象
var tabs = winTop.tabs;

$(function(){
    $('body')
    .off('click.collapsible').on('click.collapsible', '.panel-collapse .panel-heading', function(){
        var n = $(this).next();
        if(n.is(':visible')){
            n.css('display', 'none');
        }else{
            n.css('display', 'block');
        }
    });
});
