
//单个Iframe刷新方法
//author:qianweifeng

var ReinitIframe = function(option){
	var self = this;
	this.height = 0;
	this.calcHeight = function(){
		var iframe = document.getElementById(option.id);
		try{
			var bHeight = iframe.contentWindow.document.body.scrollHeight;
			var dHeight = iframe.contentWindow.document.documentElement.scrollHeight;
			var cHeight = document.documentElement.clientHeight - option.parent;
			var mHeight = option.minHeight;
			
			var height;
			if(dHeight > cHeight){
				height = Math.max(bHeight, cHeight, mHeight);
			}
			else{
				height = Math.max(bHeight, dHeight, cHeight, mHeight);
			}
			this.height = height;
		}
		catch (ex){
			//alert(ex);
		}				
	};

	this.resizeHeight = function(){
		this.height = document.documentElement.clientHeight - option.parent;
		$('#'+ option.id).height(this.height);
	};
	
	this.setHeight = function(){
		this.calcHeight();
		$('#'+ option.id).height(this.height);
	};

	this.autoResize = function(){
		self.calcHeight();	
		$('#'+ option.id).height(self.height);
	};
	
	(function __construction(){
		self.setHeight();
		setInterval(self.autoResize, 100);
		// window.onresize = function(){self.setHeight();}
	})(self);
}

//id 是iframe单个框架，parent是头部和底部加起来的高度, minHeight 是最小高度可调，不能小于parent的高度。
$(function(){
	new ReinitIframe({'id' : 'content-frame','parent':176,'minHeight' : 400});
})