Util.namespace('com');

// 初始化滚动条控件
com.scroller = function(selecter){
	var wraps = jQuery(selecter);
	
	for(var i = 0, len = wraps.length; i < len; i++){
		(function(wrap){
			wrap.mCustomScrollbar({
				theme: 'minimal-dark',
				scrollInertia: 100
			});
		})(wraps.eq(i));
	}
};

// 初始化日期控件
com.datepicker = function(selecter, option){
	var oInputs = jQuery(selecter);
	
	for(var i = 0, len = oInputs.length; i < len; i++){
		(function(oInput, option){
			var oBtn = oInput.next('.input-group-btn');
			
			oInput.prop('id') || oInput.prop('id', 'txtDatepicker' + Util.com.getRandomAlphaNum(10));
			oInput.prop('readonly', true);
			
			var config = {
				el: oInput.prop('id'),
				dateFmt: oInput.data('format') || 'yyyy-MM-dd',
				errDealMode: 1,
				qsEnabled: false
			};
			
			jQuery.extend(config, option);
			
			oInput.focus(function(){
				WdatePicker(config);
			});
			
			oBtn.length > 0 && oBtn.click(function(){
				WdatePicker(config);
			});
		})(oInputs.eq(i), option);
	}
};

// 初始化自动完成控件
com.autoComplete = function(){
	
};

// 页面类
com.page = {
	// 打开页面
	open: function(link){
		link = jQuery(link);
		
		var
		w = window;
		title = link.data('title') || jQuery('title').eq(0).text(),
		url = link.data('href'),
		type = parseInt(link.data('type'), 10) || 1;
		
		// 当前页跳转
		if(type == 1){
			w.location.href = url;
		}
		// 新对话框
		else if(type == 2){
			w.top.Window.openDialog({
				id: Util.com.getRandomAlphaNum(10),
				title: title,
				icon: 'default.png',
				width: 1000,
				height: 650,
				url: url
			});
		}
		// 新标签页
		else if(type == 3){
			w.top.open(url);
		}
	},
	// 返回上一页
	back: function(){
		window.history.go(-1);
	}
};

// 页面加载完成
jQuery(function(){
	
	com.scroller('[data-plugin="scroller"]');
	
	com.datepicker('[data-plugin="datepicker"]');
	
	com.autoComplete('[data-plugin="autoComplete"]');
	
});







