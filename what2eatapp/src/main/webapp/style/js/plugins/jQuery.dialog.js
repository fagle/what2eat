/**
 * Description: jQuery.dialog.js
 * Modified by: 
 * Modified contents: 
**/
document.write('<link type="text/css" rel="stylesheet" href="http://ui.om.dianhun.cn/third/artDialog/dialog.css" />');
document.write('<script type="text/javascript" src="http://ui.om.dianhun.cn/third/artDialog/jQuery.artDialog.min.js"></script>');

window.core.includeCss('http://ui.om.dianhun.cn/third/artDialog/dialog.css');
window.core.includeJs('http://ui.om.dianhun.cn/third/artDialog/jQuery.artDialog.min.js', function(){

	var
	_jq = window.top.jQuery,
	_dialog = null,
	_extendDialogOpts = function(opts){
		var args = { lock: true };
		
		if(window.core.isString(opts)){
			args.content = '<div class="d-content-dialog">' + opts + '</div>';
		}else if(window.core.isPlainObject(opts)){
			for(var key in opts){
	            			args[key] = opts[key];
			}
			if(args.url){
	            			args.content = '<iframe src="' + args.url + '" style="width:' + (args.width || 680) + 'px; height:' + (args.height || 440) + 'px;" frameborder="0"></iframe>';
			}
		}

	    		return args;
	},
	_extendConfirmOpts = function(opts){
		var args = { icon: 'warning', lock: true, ok: true, cancel: false };
		
		if(window.core.isString(opts)){
			args.content = '<div class="d-content-warning"><span>' + opts + '</span></div>';
		}else if(window.core.isPlainObject(opts)){
			for(var key in opts){
				args[key] = opts[key];
			}
	        		var icon = args.icon, content = args.content;
	        		if(icon == 'warning'){
	        			args.cancel = false;
			}else if(icon == 'succeed'  || icon == 'error'){
				args.lock = false;
				args.time = 2000;
				args.ok = false;
				args.cancel = false;
			}
	        		args.content = '<div class="d-content-' + icon + '"><span>' + content + '</span></div>';
		}
		
		return args;
	};

	if(_jq){
		_dialog = _jq.dialog;
	}

	// 打开一个对话框
	jQuery.showDialog = function(opts){
		if(opts && _dialog){
			return _dialog(_extendDialogOpts(opts));
		}
		return null;
	};
	// window.showDialog = jQuery.showDialog;

	// 打开一个消息框
	jQuery.showConfirm = function(opts){
		if(opts && _dialog){
			return _dialog(_extendConfirmOpts(opts));
		}
		return null;
	};
	// window.showConfirm = jQuery.showConfirm;

	// 获取指定模态或消息对话框
	jQuery.getDialog = function(id){
		if(id && _dialog){
			return _dialog.get(id);
		}
		return null;
	};
	// window.getDialog = jQuery.getDialog;

	// 获取指定模态或消息对话框的内嵌iframe对象
	jQuery.getDialogIframe = function(id){
		var d = this.getDialog(id);
		if(d){
			var content = d.dom.content;
			return content.find('iframe').get(0);
		}
		return null;
	};
	// window.getDialogIframe = jQuery.getDialogIframe;

	// 获取指定模态或消息对话框的内嵌window对象
	jQuery.getDialogWindow = function(id){
		var iframe = this.getDialogIframe(id);
		if(iframe){
			return iframe.contentWindow;
		}
		return null;
	};
	// window.getDialogWindow = jQuery.getDialogWindow;

	artDialog.notice = function(options){
		var
		opt = options || {},
		api,
		aConfig,
		hide,
		wrap,
		top,
		duration = 800;

		var config = {
			id: 'Notice',
			left: '100%',
			top: '100%',
			fixed: true,
			drag: false,
			resize: false,
			follow: null,
			lock: false,
			init: function(here){
				api = this;
				aConfig = api.config;
				wrap = api.DOM.wrap;
				top = parseInt(wrap[0].style.top);
				hide = top + wrap[0].offsetHeight;
	    
	    			wrap.css('top', hide + 'px').animate({top: top + 'px'}, duration, function(){
	            			opt.init && opt.init.call(api, here);
	        			});
			},
			close: function(here){
				wrap.animate({top: hide + 'px'}, duration, function(){
					opt.close && opt.close.call(this, here);
					aConfig.close = $.noop;
					api.close();
				});
	    			return false;
			}
		};	

		for(var i in opt){
			if(config[i] === undefined){
				config[i] = opt[i];
			}
		};

		return artDialog(config);
	};


});



	

	