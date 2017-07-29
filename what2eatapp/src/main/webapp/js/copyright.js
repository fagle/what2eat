var Copyright = function(){
	
	var option = {
			om_url : 'http://om.dianhun.cn',
			id : 'om_copyright',
			className : 'footer',
			content : 'Copyright © 2008 - 2013 Esoul Operation Management Department. All Rights Reserved',
			height : 25
	}; 

	var self = this;
	
	this.height = '';
	
	this.style = '';
	
	this.firstResize = false;
	
	this.timer;
	
	this.getHeight = function(){
        var clientHeight = 0;
         //获取窗口高度
         if (window.innerHeight)
        	 clientHeight = window.innerHeight;
         else if ((document.body) && (document.body.clientHeight))
        	 clientHeight = document.body.clientHeight;
         //通过深入Document内部对body进行检测，获取窗口大小
         if (document.documentElement  && document.documentElement.clientHeight)
         {
        	 clientHeight = document.documentElement.clientHeight;
         }
         
         clientHeight = clientHeight - 25;
         
         var scrollHeight = document.body.scrollHeight;
         
         this.height = Math.max(clientHeight, scrollHeight);
	
		
	};
	
	this.resizeHeight = function(){
		this.getHeight();
		this.style.top = this.height + 'px';
	};
	
	this.makeFooter = function(){
		//var copyright = "<div id="footer"><a><font class='font_2'></font></a></div>";
		var copyright = document.createElement('div');
		copyright.id = option.id;
		copyright.className = option.className;
		this.style = copyright.style;
		var copyStyle = copyright.style;
		copyStyle.height = option.height + 'px';
		copyStyle.lineHeight = option.height + 'px';
		copyStyle.width = '100%';
		copyStyle.fontWeight = 700;
		copyStyle.textAlign = 'center';
		copyStyle.fontFamily = 'Cambria,Georgia,serif';
		copyStyle.position = 'absolute';
		copyStyle.top = this.height + 'px';

		var link = document.createElement('span');
		link.innerHTML = option.content;
		link.style.cursor = 'pointer';
		link.onclick = function(){
			window.location.href = option.om_url;
		};
		copyright.appendChild(link);
		document.body.appendChild(copyright);
	};
	
	this.firstResizeFun =  function(){
		var first = self.height;
		self.getHeight();
//		console.log(self.firstResize);
		if(self.firstResize)
		{
			clearInterval(self.timer);
		}	
		if(first != self.height)
		{
			self.firstResize = true;
			self.resizeHeight();
		}	
	};
	
	(function __construction(){
		self.getHeight();
		self.makeFooter();
		self.timer = setInterval(self.firstResizeFun, 200);
		window.onresize = function(){self.resizeHeight();}
	})(self);
}

document.ready = function(){ new Copyright(); };

