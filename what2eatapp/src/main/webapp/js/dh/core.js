// 
(function(window){
	
	var
	// 
	_indexPage = 'index.php',
	// 
	_siteBaseUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + (window.location.pathname.lastIndexOf(_indexPage) < 0 ? _indexPage : ''),
	// Save a reference to some core methods
	_toString = Object.prototype.toString, _hasOwnProperty = Object.prototype.hasOwnProperty, _indexOf = Array.prototype.indexOf,
	// 
	_core = {
		// 
		siteBaseUrl: _siteBaseUrl.replace(_indexPage, ''),
		// 判断当前页面是否是由iframe标签打开的页面
		isIframePage: !!window.frameElement,
		// 获取变量类型
		getType: function(obj){
		    return _toString.call(obj);
		},
		// 判断变量是否为Window对象
		isWindow: function(obj){
		    return obj && obj == obj.window;
		},
		// 判断变量是否为Number对象
		isNumber: function(num){
			return this.getType(num) === '[object Number]';
		},
		// 判断变量是否为String对象
		isString: function(str){
			return this.getType(str) === '[object String]';
		},
		// 判断变量是否为Array对象
		isArray: function(arr){
			return this.getType(arr) === '[object Array]';
		},
		// 判断变量是否为Boolean对象
		isBoolean: function(bool){
			return this.getType(bool) === '[object Boolean]';
		},
		// 判断变量是否为Date对象
		isDate: function(date){
			return this.getType(date) === '[object Date]';
		},
		// 判断变量是否为Function对象
		isFunction: function(fn){
			return this.getType(fn) === '[object Function]';
		},
		// 判断变量是否为Regex对象
		isRegex: function(rgx){
			return this.getType(rgx) === '[object RegExp]';
		},
		// 判断变量是否为Object对象
		isObject: function(obj){
			return this.getType(obj) === '[object Object]';
		},
		// 判断变量是否为纯粹的对象（纯粹的对象是指通过new Object()或{}声明的对象）
		isPlainObject: function(obj){
			if(!obj || !this.isObject(obj) || this.isWindow(obj) || obj.nodeType){
		        return false;
		    }
		    try{
		        if(obj.constructor && !_hasOwnProperty.call(obj, 'constructor') && !_hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')){
		            return false;
		        }
		    }catch(e){
		        return false;
		    }
		    var key;
		    for(key in obj){}
		    return key === undefined || _hasOwnProperty.call(obj, key);
		},
		// 判断变量是否为空对象
		isEmptyObject: function(obj){
			for(var key in obj){
		        return false;
		    }
		    return true;
		},
		// 对象深拷贝
		clone: function(obj){
			if(!this.isArray(obj) || !this.isPlainObject(obj)){
				return obj;
			}
			var n = this.isArray(obj) ? [] : {};
		    for(var key in obj){
		        if(obj.hasOwnProperty(key)){
		            n[key] = this.isPlainObject(obj[key]) ? this.clone(obj[key]) : obj[key];
		        }
		    }
		    return n;
		},
		// 判断变量是否存在于某个数组中
		inArray: function(target, array, i){
			var len;
		    if(array){
		        if(_indexOf){
		            return _indexOf.call(array, target, i);
		        }
		        len = array.length;
		        i = i ? i < 0 ? Math.max(0, len + i) : i : 0;
		        for(; i < len; i++){
		            if(i in array && array[i] === target){
		                return i;
		            }
		        }
		    }
		    return -1;
		},
		// 创建一个全局唯一标识符（GUID）
		getGuidChars: function(){
			var str = '';
		    for(var i = 1; i <= 32; i++){
				var n = Math.floor(Math.random() * 16.0).toString(16);
		      	str += n;
		      	if((i == 8) || (i == 12) || (i == 16) || (i == 20)){
		      		str += '-';
		      	}
		    }
		    return str;
		},
		// 在指定范围内创建一个随机数
		getRandomByRange: function(min, max){
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},
		// 创建一个指定长度且由字母和数字组成的随机字符串
		getRandomAlphaNum: function(len){
			var str = '';
		    for(; str.length < len; str += Math.random().toString(36).substr(2)){}
		    return  str.substr(0, len);
		},
		// 获取URL服务器地址
		getUrlServer: function(url){
			if(!url){
				url = document.location.href;
			}
			var n = url.indexOf('http://'), m = url.indexOf('/', 7);
			if(n != -1 && m != -1){
				return url.substr(7, m - 7);
			}
		},
		// 获取URL参数集合
		getUrlParams: function(url){
			if(!url){
				url = document.location.href;
			}
		    var s = url.indexOf('?'), str = '';
		    if(s >- 1){
		    	str = url.substr(s + 1, url.length - s - 1);
		    }
		    var parts = str.split('&'), params = {};
		    for(var i = 0, l = parts.length; i < l; i++){
		        var part = parts[i], ps = part.split('='), key = ps[0], value = ps[1];
		        params[key] = value;
		    }
		    return params;
		},
		// 解码URL参数
		decodeUrlParams: function(params){
			if(!params){
				return null;
			}
			for(var key in params){
				if(params[key]){
					params[key] = decodeURI(params[key]);
				}
			}
			return params;
		},
		// 获取、修改或添加URL参数
		modifyUrl: function(url, key, value){
			var rgx = new RegExp('(\\\?|&)' + key + '=([^&]+)(&|$)', 'i'), match = url.match(rgx);
		    if(value){
		        if(match){
		            return url.replace(rgx, function($0, $1, $2){
		                return ($0.replace($2, value));
		            });
		        }else{
		            if(url.indexOf('?') == -1){
		                return (url + '?' + key + '=' + value);
		            }else{
		                return (url + '&' + key + '=' + value);
		            }
		        }
		    }else{
		        if(match){
		            return match[2];
		        }else{
		            return '';
		        }
		    }
		},
		// 动态引入CSS
		includeCss: function(srcs, callback){
			var _this = this;
			srcs = srcs.split('&');
			if(_this.isArray(srcs)){
				for(var i = 0, len = srcs.length; i < len; i++){
					var src = srcs[i], link = document.createElement('link');
				    link.type = 'text/css';
				    link.rel = 'stylesheet';
				    link.href = src;
				    document.getElementsByTagName('head').item(0).appendChild(link);
				}
			}
		},
		// 动态引入JS
		includeJs: function(srcs, callback){
			var _this = this;
			srcs = srcs.split('&');
			if(_this.isArray(srcs)){
				var total = 0;
				for(var i = 0, len = srcs.length; i < len; i++){
					var src = srcs[i], script = document.createElement('script');
					script.type = 'text/javascript';
					script.src = src;
					script.onload = script.onreadystatechange = function(){
						if(!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete'){
							total++;
							if(total == len && _this.isFunction(callback)){
								callback();
							}
						}
				    };
				    document.getElementsByTagName('head').item(0).appendChild(script);
				}
			}
		},
		// 枚举对象属性
		displayProperties: function(obj){
			for(var key in obj){
				alert(key + ': ' + obj[key]);
				// console.log(key + ': ' + obj[key]);
			}
		}
	};
	
	// 浏览器类型及版本判断
	var _ua = navigator.userAgent.toLowerCase(), _s;
	(_s = _ua.match(/msie ([\d.]+)/)) ? _core.isIe = _s[1] :
	(_s = _ua.match(/firefox\/([\d.]+)/)) ? _core.isFirefox = _s[1] :
	(_s = _ua.match(/chrome\/([\d.]+)/)) ? _core.isChrome = _s[1] :
	(_s = _ua.match(/opera.([\d.]+)/)) ? _core.isOpera = _s[1] :
	(_s = _ua.match(/version\/([\d.]+).*safari/)) ? _core.isSafari = _s[1] : 0;
	_core.isIe6 = !-[1,] && !window.XMLHttpRequest;
	
	if(window.core){
		for(var key in _core){
			window.core[key] = _core[key];
		}
	}else{
		window.core = _core;
	}
	
})(window);


// 加减乘除运算
Math.plus = function(n1, n2){
    var r1, r2, m;
    try{
        r1 = n1.toString().split('.')[1].length;
    }catch(e){
        r1 = 0;
    }
    try{
        r2 = n2.toString().split('.')[1].length;
    }catch(e){
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (n1 * m + n2 * m) / m;
};
Math.minus = function(n1, n2){
    var r1, r2, m, n;
    try{
        r1 = n1.toString().split('.')[1].length;
    }catch(e){
        r1 = 0;
    }
    try{
        r2 = n2.toString().split('.')[1].length;
    }catch(e){
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return ((n1 * m - n2 * m) / m).toFixed(n);
};
Math.multiply = function(n1, n2){
    var m = 0, s1 = n1.toString(), s2 = n2.toString();
    try{
        m += s1.split('.')[1].length;
    }catch(e){

    }
    try{
        m += s2.split('.')[1].length;
    }catch(e){

    }
    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
};
Math.division = function(n1, n2){
    var t1 = 0, t2 = 0, r1, r2;
    try{
        t1 = n1.toString().split('.')[1].length;
    }catch(e){
		
    }
    try{
        t2 = n2.toString().split('.')[1].length;
    }catch(e){

    }
    with(Math){
        r1 = Number(n1.toString().replace('.', ''));
        r2 = Number(n2.toString().replace('.', ''));
    }
    return (r1 / r2) * Math.pow(10, t2 - t1);
};


// 命名空间注册函数
var Namespace = Namespace || {};
Namespace.register = function(path){
    var arr = path.split('.'), result = '', space = '';
    for(var i = 0, len = arr.length; i < len; i++){
        if(i != 0){
            space += '.';
        }
        space += arr[i];
        result += 'if(typeof ' + space + ' === "undefined" || typeof ' + space + ' !== "object"){' + space + ' = {};}';
        continue;
    }
    if(result.length > 0){
        eval(result);
    }
};
