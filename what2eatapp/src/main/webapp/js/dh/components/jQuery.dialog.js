/**
 * Description: jQuery.dialog.js
 * Modified by: 
 * Modified contents: 
**/
window.core.includeCss(window.core.siteBaseUrl + 'js/third/artDialog/dialog.css');
window.core.includeJs(window.core.siteBaseUrl + 'js/third/artDialog/jQuery.artDialog.min.js', function(){
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
//                args.url = window.core.modifyUrl(args.url, 'random', Math.random());
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
});
