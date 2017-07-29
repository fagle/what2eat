
var imgReady = (function(){
	var
	list = [],
	intervalId = null,
	tick = function(){
		var i = 0;
		for(; i < list.length; i++){
			list[i].end ? list.splice(i--, 1) : list[i]();
		};
		!list.length && stop();
	},
	stop = function(){
		clearInterval(intervalId);
		intervalId = null;
	};
	
	return function(url, ready, load, error){
		var onready, width, height, newWidth, newHeight, img = new Image();
		
		img.src = url;
		
		if(img.complete){
			ready.call(img);
			load && load.call(img);
			return;
		};
		
		width = img.width;
		height = img.height;
		
		img.onerror = function(){
			error && error.call(img);
			onready.end = true;
			img = img.onload = img.onerror = null;
		};
		
		onready = function(){
			newWidth = img.width;
			newHeight = img.height;
			if (newWidth !== width || newHeight !== height || newWidth * newHeight > 1024) {
				ready.call(img);
				onready.end = true;
			};
		};
		onready();
		
		img.onload = function(){
			!onready.end && onready();
			
			load && load.call(img);
			
			img = img.onload = img.onerror = null;
		};
		
		if(!onready.end){
			list.push(onready);
			
			if(intervalId === null){
				intervalId = setInterval(tick, 40);
			}
		};
	};
})();

var AD = {
	init: function(o){
		var self = this;
		
		imgReady(o.img, function(){
			if(self.getCookie('ad') == ''){
				var img = this;
				
				self.width = img.width;
				self.height = img.height;
				
				self.box = jQuery('<div style="position:fixed; top:50%; left:50%; z-index:1000000;"></div>');
				
				var html = [];
				html.push('<a href="' + (o.href || 'javascript:void(0);') + '" style="display:block;" data-role="wrapper"></a>');
				html.push('<a style="position:absolute; top:-26px; right:0; width:75px; height:24px; color:#fff;" data-role="close">');
				html.push('<span style="float:left; display:block; width:50px; height:24px; background-color:#999; margin-right:1px; text-align:center; line-height:24px;">关闭</span>');
				html.push('<span style="float:left; display:block; width:24px; height:24px; background-color:#999; text-align:center; line-height:24px;">×</span>');
				html.push('</a>');
				
				self.box.append(html.join('')).find('[data-role="wrapper"]').append(img);
				
				jQuery('body').append(self.box);
				
				self.setPosition();
				self.bindEvents();
				
				self.setCookie('ad', '1', 8);
			}
		}, function(){
			
		}, function(){
			
		});
	},
	setPosition: function(){
		var self = this;
		
		self.box.css({
			marginTop: -(self.height / 2),
			marginLeft: -(self.width / 2)
		});
	},
	bindEvents: function(){
		var self = this;
		
		self.box.on('click.close', '[data-role="close"]', function(){
			self.box.remove();
		});
	},
	setCookie: function(name, value, expiresHours){
		var cookieString = name + '=' + escape(value);
		
		if(expiresHours > 0){
			var date = new Date();
			date.setTime(date.getTime + expiresHours * 3600 * 1000);
			cookieString = cookieString + '; expires=' + date.toGMTString();
		} 
		document.cookie = cookieString;
	},
	getCookie: function(name){
		var strCookie = document.cookie;
		var arrCookie = strCookie.split('; ');
		for(var i = 0; i < arrCookie.length; i++){
			var arr = arrCookie[i].split('=');
			if(arr[0] == name){
				return arr[1];
			}
		}
		return '';
	},
	deleteCookie: function(name){
		var date = new Date();
		date.setTime(date.getTime() - 10000);
		document.cookie = name + '=v; expires=' + date.toGMTString();
	}
};
