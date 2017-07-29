/**
 * Author: dingwei 2015-04-27
 * Description: util.js
**/
(function(window, document){
	
	var
	_toString = Object.prototype.toString,
	_hasOwnProperty = Object.prototype.hasOwnProperty,
	_indexOf = Array.prototype.indexOf,
	
	// 工具类
	_Util = {
		// 顶级命名空间
		globalNamespace: window,
		// 注册命名空间
		namespace: function(name){
			if(!name){
				throw new Error('Util.namespace(): namespace required!');
			}
			if(!(/^[a-zA-Z\.]+$/.test(name)) || name.charAt(0) == '.' || name.charAt(name.length - 1) == '.' || name.indexOf('..') != -1){
				throw new Error('Util.namespace(): illegal namespace!');
			}
			
			var ns = this.globalNamespace, parts = name.split('.');
			for(var i = 0, len = parts.length; i < len; i++){
				var part = parts[i];
				if(!ns[part]){
					ns[part] = {};
				}else if(typeof ns[part] != 'object'){
					throw new Error(parts.slice(0, i).join('.') + 'already exists and is not an object!');
				}
				ns = ns[part];
			}
			
			return ns;
		},
		
		// 常规类
		com: {
			// 获取变量类型
			getType: function(obj){
			    return _toString.call(obj);
			},
			// 判断变量是否为Window对象
			isWindow: function(obj){
			    return obj != null && obj == obj.window;
			},
			// 判断变量是否为DOM对象
			isElement: function(obj){
				return !!(obj && obj.nodeType === 1);
			},
			// 判断变量是否为Number对象
			isNumber: function(obj){
				return this.getType(obj) === '[object Number]';
			},
			// 判断变量是否为String对象
			isString: function(obj){
				return this.getType(obj) === '[object String]';
			},
			// 判断变量是否为Array对象
			isArray: function(obj){
				return this.getType(obj) === '[object Array]';
			},
			// 判断变量是否为Boolean对象
			isBoolean: function(obj){
				return this.getType(obj) === '[object Boolean]';
			},
			// 判断变量是否为Date对象
			isDate: function(obj){
				return this.getType(obj) === '[object Date]';
			},
			// 判断变量是否为Function对象
			isFunction: function(obj){
				return this.getType(obj) === '[object Function]';
			},
			// 判断变量是否为Regex对象
			isRegex: function(obj){
				return this.getType(obj) === '[object RegExp]';
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
			// 判断变量是否为null
			isNull: function(obj){
				return obj === null;
			},
			// 判断变量是否为undefined
			isUndefined: function(obj){
				return obj === void 0;
			},
			// 创建一个全局唯一标识符
			guid: function(){
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
			random: function(min, max){
				if(max == null){
					max = min;
					min = 0;
				}
				return min + Math.floor(Math.random() * (max - min + 1));
			},
			// 创建一个指定长度且由字母和数字组成的随机字符串
			randomAlphaNum: function(len){
				var str = '';
			    for(; str.length < len; str += Math.random().toString(36).substr(2)){}
			    return  str.substr(0, len);
			}
		},
		
		// 校验类
		test: (function(){
			var
			rgx = {
				required: /.+/,
				number: /^(-?\d+)(\.\d+)?$/,
				posNumber: /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/,
				negNumber: /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/,
				integer: /^-?[1-9]\d*$/,
				posInteger: /^[0-9]*[1-9][0-9]*$/,
				negInteger: /^-[0-9]*[1-9][0-9]*$/,
				unNegInteger: /^\d+$/,
				unPosInteger: /^((-\d+)|(0+))$/,
				decimal: /^(-?\d+)(\.\d+)?$/,
				posDecimal: /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/,
				negDecimal: /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/,
				unNegDecimal: /^\d+(\.\d+)?$/,
				unPosDecimal: /^((-\d+(\.\d+)?)|(0+(\.0+)?))$/,
				date: /^(\d{4})(-|\/)(\d{1,2})\2(\d{1,2})$/,
				qq: /^[1-9][0-9]{4,}$/,
				email: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
				mobile: /^1[0-9]{10}$/,
				telephone: /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/,
				areaCode: /(0[0-9]{2,3})/,
				zipCode: /^[1-9]\d{5}$/,
				idCard: /^[1-9]([0-9]{14}|[0-9]{17})$/,
				url: /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,
				ip: /^(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)$/,
				zip: /(.*)\.(rar|zip|7zip|tgz)$/,
				image: /(.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/,
				letter: /^[A-Za-z]+$/,
				upperLetter: /^[A-Z]+$/,
				lowerLetter: /^[a-z]+$/,
				CH: /^[\u4E00-\u9FA5\uF900-\uFA2D]+/,
				color: /^[a-fA-F0-9]{6}$/,
				ascii: /^[\x00-\xFF]+$/,
				account: /^\w+$/,
				specialAccount: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/
			},
			judge = function(name, val){
				return rgx[name].test(val);
			};
			
			return {
				// 判断用户输入的是否非空
				required: function(val){
					return judge('required', val);
				},
				// 判断用户输入的是否为数字
				number: function(val){
					return judge('number', val);
				},
				// 判断用户输入的是否为正数
				posNumber: function(val){
					return judge('posNumber', val);
				},
				// 判断用户输入的是否为负数
				negNumber: function(val){
					return judge('negNumber', val);
				},
				// 判断用户输入的是否为整数
				integer: function(val){
					return judge('integer', val);
				},
				// 判断用户输入的是否为正整数
				posInteger: function(val){
					return judge('posInteger', val);
				},
				// 判断用户输入的是否为负整数
				negInteger: function(val){
					return judge('negInteger', val);
				},
				// 判断用户输入的是否为非负整数
				unNegInteger: function(val){
					return judge('unNegInteger', val);
				},
				// 判断用户输入的是否为非正整数
				unPosInteger: function(val){
					return judge('unPosInteger', val);
				},
				// 判断用户输入的是否为浮点数
				decimal: function(val){
					return judge('decimal', val);
				},
				// 判断用户输入的是否为正浮点数
				posDecimal: function(val){
					return judge('posDecimal', val);
				},
				// 判断用户输入的是否为负浮点数
				negDecimal: function(val){
					return judge('negDecimal', val);
				},
				// 判断用户输入的是否为非负浮点数
				unNegDecimal: function(val){
					return judge('unNegDecimal', val);
				},
				// 判断用户输入的是否为非正浮点数
				unPosDecimal: function(val){
					return judge('unPosDecimal', val);
				},
				// 判断用户输入的日期是否格式正确
				date: function(val){
					return judge('date', val);
				},
				// 判断用户输入的QQ号码是否格式正确
				qq: function(val){
					return judge('qq', val);
				},
				// 判断用户输入的邮箱地址是否格式正确
				email: function(val){
					return judge('email', val);
				},
				// 判断用户输入的手机号码是否格式正确
				mobile: function(val){
					return judge('mobile', val);
				},
				// 判断用户输入的电话号码是否格式正确
				telephone: function(val){
					return judge('telephone', val);
				},
				// 判断用户输入的区号是否格式正确
				areaCode: function(val){
					return judge('areaCode', val);
				},
				// 判断用户输入的邮政编码是否格式正确
				zipCode: function(val){
					return judge('zipCode', val);
				},
				// 判断用户输入的身份证号码是否格式正确
				idCard: function(val){
					return judge('idCard', val);
				},
				// 判断用户输入的URL地址是否格式正确
				url: function(val){
					return judge('url', val);
				},
				// 判断用户输入的IP4地址是否格式正确
				ip4: function(val){
					return judge('ip4', val);
				},
				// 判断用户选择的是否为有效的压缩文件
				zip: function(val){
					return judge('zip', val);
				},
				// 判断用户选择的是否为有效的图片文件
				image: function(val){
					return judge('image', val);
				},
				// 判断用户输入的是否为字母（不区分大小写）
				letter: function(val){
					return judge('letter', val);
				},
				// 判断用户输入的是否为大写字母
				upperLetter: function(val){
					return judge('upperLetter', val);
				},
				// 判断用户输入的是否为小写字母
				lowerLetter: function(val){
					return judge('lowerLetter', val);
				},
				// 判断用户输入的是否为中文
				CH: function(val){
					return judge('CH', val);
				},
				// 判断用户输入的是否为有效的RGB颜色值
				color: function(val){
					return judge('color', val);
				},
				// 判断用户输入的是否为有效的ACSII编码
				ascii: function(val){
					return judge('ascii', val);
				},
				// 判断用户的输入是否由数字、字母或下划线组成
				account: function(val){
					return judge('account', val);
				}
			};
		})(),
		
		// 对象类
		object: {
			// 判断对象是否为空
			isEmpty: function(obj){
				for(var key in obj){
			        return false;
			    }
			    return true;
			},
			// 对象深拷贝
			clone: function(obj){
				if(!_Util.com.isArray(obj) && !_Util.com.isPlainObject(obj)){
					return obj;
				}
				var copy = _Util.com.isArray(obj) ? [] : {};
			    for(var key in obj){
			        if(obj.hasOwnProperty(key)){
			            copy[key] = _Util.com.isPlainObject(obj[key]) ? this.clone(obj[key]) : obj[key];
			        }
			    }
			    return copy;
			},
			// 判断对象是否包含指定的键
			has: function(obj, key){
				return obj != null && _hasOwnProperty.call(obj, key);
			},
			// 获取对象的属性长度
			length: function(obj){
				var len = 0;
				for(var key in obj){
                    if(_hasOwnProperty.call(obj, key)){
                        len++;
                    }
				}
				return len;
			}
		},
		
		// 数组类
		array: {
			// 判断指定元素是否存在于某个数组中
			has: function(arr, target, i){
				var len;
			    if(arr){
			        if(_indexOf){
			            return _indexOf.call(arr, target, i);
			        }
			        len = arr.length;
			        i = i ? i < 0 ? Math.max(0, len + i) : i : 0;
			        for(; i < len; i++){
			            if(i in arr && arr[i] === target){
			                return i;
			            }
			        }
			    }
			    return -1;
			},
			// 移除数组中的指定元素
			remove: function(arr, target){
				for(var i = 0, len = arr.length; i < len; i++){
					if(arr[i] === target){
						arr.splice(i, 1);
						break;
					}
				}
				return arr;
			},
			// 数组去重
			unique: function(arr){
				var result = [], hash = {};
				for(var i = 0, len = arr.length; i < len; i++){
					var item = arr[i];
					if(!hash[item]){
						result.push(item);
						hash[item] = true;
					}
				}
				return result;
			},
			// 数组拷贝
			clone: function(arr){
				return arr.concat();
			},
			// 连接两个数组
			concat: function(arr1, arr2){
				return arr1.concat(arr2);
			},
			// 返回数字数组中的最小值
			min: function(arr){
				return Math.min.apply(Math, arr);
			},
			// 返回数字数组中的最大值
			max: function(arr){
				return Math.max.apply(Math, arr);
			}
		},
		
		// 数值类
		number: {
			// 格式化为含有千分位的字符串
			toThousandth: function(n, cent){
				n = n.toString().replace(/\$|\,/g,'');
				cent = cent || 2;
				
				// 检查传入数值为数值类型
				if(isNaN(n)){
					n = '0';
				}
				
		        // 获取符号（正/负数）
		        sign = (n == (n = Math.abs(n)));
		        
		        n = Math.floor(n * Math.pow(10, cent) + 0.50000000001);  // 把指定的小数位先转换成整数，多余的小数位四舍五入
		        cents = n % Math.pow(10, cent); // 求出小数位数值
		        n = Math.floor(n / Math.pow(10, cent)).toString(); // 求出整数位数值
		        cents = cents.toString(); // 把小数位转换成字符串，以便求小数位长度
		  
		        // 补足小数位到指定的位数
		        while(cents.length < cent){
		        	cents = '0' + cents;
		        }
		        
		        // 对整数部分进行千分位格式化
				for(var i = 0; i < Math.floor((n.length - (1 + i)) / 3); i++){
					n = n.substring(0, n.length - (4 * i + 3)) + ',' + n.substring(n.length - (4 * i + 3));
				}
		        
		        return cent > 0 ? (((sign) ? '' : '-') + n + '.' + cents) : (((sign) ? '' : '-') + n);
			},
			// 移除千分位
			unToThousandth: function(n){
				return parseFloat((n || 0).replace(/,/g, ''));
			}
		},
		
		// 字符串类
		string: {
			// 判断字符串是否为空
			isEmpty: function(str){
				return str != null && str.length > 0;
			},
			// 判断两个字符串是否相同
			isEqual: function(str1, str2){
				return str1 == str2;
			},
			// 不区分大小写判断两个字符串是否相同
			isEqualIgnoreCase: function(str1, str2){
				return str1.toLowerCase() == str2.toLowerCase();
			},
			// 获取字符串字节数（区分中英文，中文两个字节）
			getBytes: function(str){
				var cArr = str.match(/[^\x00-\xff]/ig);
				return str.length + (cArr == null ? 0 : cArr.length);
			},
			// 去除字符串左右空格
			trim: function(str){
				return str.replace(/(^\s*)|(\s*$)/g, '');
			},
			// 统计指定字符在某个字符串中出现的次数
			occurs: function(str, ch){
				return str.split(ch).length - 1;
			},
			// 是否是以指定字符开头
			startWith: function(str, tag){
				return str.substring(0, tag.length) == tag;
			},
			// 是否是以指定字符结尾
			endWith: function(str, tag){
				return str.substring(str.length - tag.length) == tag;
			},
			// 字符串截取后面加入...
			intercept: function(str, len){
				if(str.length > len){
					return str.substring(0, len) + '...';
				}else{
					return str;
				}
			},
			// 将字符串用指定的字符分割成数组
			toArray: function(str, ch){
				if(str.indexOf(ch) != -1){
					return str.split(ch);
				}else{
					if(str != ''){
						return [str.toString()];
					}else{
						return [];
					}
				}
			},
			// 将日期字符串如“1988-9-3 12:30:00”转换为Date对象
			toDate: function(str){
				return new Date(Date.parse(str.replace(/-/g, '/')));
			},
			// 格式化
			format: function(str, model){
				for(var key in model){
					str = str.replace(new RegExp('{' + key + '}', 'g'), model[key]);
				}
				return str;
			}
		},
		
		// 日期类
		date: {
			// 获取当前时间
			getNow: function(){
				return new Date();
			},
			// 获取年份
			getYear: function(){
				return this.getNow().getFullYear();
			},
			// 获取月份
			getMonth: function(){
				return this.getNow().getMonth() + 1;
			},
			// 获取日
			getDay: function(){
				return this.getNow().getDate();
			},
			// 获取周
			getWeekday: function(){
				return '日一二三四五六'.charAt(this.getNow().getDay());
			},
			// 获取小时
			getHour: function(){
				return this.getNow().getHours();
			},
			// 获取分钟
			getMinute: function(){
				return this.getNow().getMinutes();
			},
			// 获取秒钟
			getSecond: function(){
				return this.getNow().getSeconds();
			},
			// 获取本地日期
			getDate: function(){
				return this.getNow().toLocaleDateString();
			},
			// 获取本地时间
			getTime: function(){
				return this.getNow().toLocaleTimeString();
			},
			// 获取本地日期时间
			getDateTime: function(){
				return this.getNow().toLocaleString();
			},
			// 获取本地日期和周
			getDateWeek: function(){
				return this.getDate() + ' 星期' + this.getWeekday();
			}
		},
		
		// 运算类
		math: (function(){
			var
			padLeft = function(str, size, ch){
				len = str.length;
				ch = ch ? ch : '0';
				while(len < size){
					str = ch + str;
					len++;
				}
				return str;
			},
			padRight = function(str, size, ch){
				len = str.length;
				ch = ch ? ch : '0';
				while(len < size){
					str = str + ch;
					len++;
				}
				return str;
			},
			movePointLeft = function(str, scale){  
				var s1, s2, ch, ps, sign;
				
				ch = '.';
				sign = '';
				  
				if(scale <= 0){
					return str;
				}
				
				ps = str.split('.');
				s1 = ps[0] ? ps[0] : '';
				s2 = ps[1] ? ps[1] : '';
				
				if(s1.slice(0, 1) == '-'){
				    s1 = s1.slice(1);
				    sign = '-';
				}
				
				if(s1.length <= scale){
				    ch = '0.';
				    s1 = padLeft(s1, scale);
				}
				
				return sign + s1.slice(0, -scale) + ch + s1.slice(-scale) + s2;
			},
			movePointRight = function(str, scale){
				var s1, s2, ch, ps;
				
				ch = '.';
				
				if (scale <= 0){
					return str;
				}
				
				ps = str.split('.');
				s1 = ps[0] ? ps[0] : '';
				s2 = ps[1] ? ps[1] : '';
				
				if(s2.length <= scale){
					ch = '';
					s2 = padRight(s2, scale);
				}
				
				return s1 + s2.slice(0, scale) + ch + s2.slice(scale, s2.length);
			},
			movePoint = function(str, scale){
				if(scale >= 0){
					return movePointRight(str, scale);
				}else{
					return movePointLeft(str, -scale);
				}
			};
			
			return {
				// 求和运算，参数可以是数字、字符串和数组，或者三者的组合
				sum: function(){
					var total = 0;
					
					for(var i = 0; i < arguments.length; i++){
						var args = arguments[i];
						
						if(!args){
							continue;
						}
						
						var n;
						switch(typeof args){
							case 'number':
								n = args;
								break;
							case 'object':
								if(args instanceof Array){
									n = this.sum.apply(this, args);
								}else{
									n = args.valueOf();
								}
								break;
							case 'function':
								n = args();
								break;
							case 'string':
								n = parseFloat(args);
								break;
							case 'boolean':
								n = NaN;
								break;
						}
						
						if(typeof n == 'number' && !isNaN(n)){
							total += n;
						}else{
							throw new Error('Util.math.sum(): can not convert ' + args + ' to number!');
						}
					}
					
					return total;
				},
				// 加法运算
				plus: function(arg1, arg2){
					var n, n1, n2, s, s1, s2, ps;
					
					s1 = arg1.toString();
					ps = s1.split('.');
					n1 = ps[1] ? ps[1].length : 0;
					
					s2 = arg2.toString();
					ps = s2.split('.');
					n2 = ps[1] ? ps[1].length : 0;
					
					n = n1 > n2 ? n1 : n2;
					s = Number(movePoint(s1, n)) + Number(movePoint(s2, n));
					s = movePoint(s.toString(), -n);
					
					return Number(s);
				},
				// 减法运算
				sub: function(arg1, arg2){
					var n, n1, n2, s, s1, s2, ps;
					
					s1 = arg1.toString();
					ps = s1.split('.');
					n1 = ps[1] ? ps[1].length : 0;
					
					s2 = arg2.toString();
					ps = s2.split('.');
					n2 = ps[1] ? ps[1].length : 0;
					
					n = n1 > n2 ? n1 : n2;
					s = Number(movePoint(s1, n)) - Number(movePoint(s2, n));
					s = movePoint(s.toString(), -n);
					
					return Number(s);
				},
				// 乘法运算
				mul: function(arg1, arg2){
					var n, n1, n2, s, s1, s2, ps;
					
					s1 = arg1.toString();
					ps = s1.split('.');
					n1 = ps[1] ? ps[1].length : 0;
					
					s2 = arg2.toString();
					ps = s2.split('.');
					n2 = ps[1] ? ps[1].length : 0;
					
					n = n1 + n2;
					s = Number(s1.replace('.', '')) * Number(s2.replace('.', ''));
					s = movePoint(s.toString(), -n);
					
					return Number(s);
				},
				// 除法运算
				div: function(arg1, arg2){
					var n, n1, n2, s, s1, s2, ps;
					
					s1 = arg1.toString();
					ps = s1.split('.');
					n1 = ps[1] ? ps[1].length : 0;
					
					s2 = arg2.toString();
					ps = s2.split('.');
					n2 = ps[1] ? ps[1].length : 0;
					
					n = n1 - n2;
					s = Number(s1.replace('.', '')) / Number(s2.replace('.', ''));
					s = movePoint(s.toString(), -n);
					
					return Number(s);
				}
			};
		})(),
		
		// 浏览器类
		browser: (function(){
			var bro = {};
            
			bro.mozilla = false;
			bro.webkit = false;
			bro.opera = false;
			bro.msie = false;
			bro.name = window.navigator.appName;
			bro.fullVersion = '' + parseFloat(window.navigator.appVersion);
			bro.majorVersion = parseInt(window.navigator.appVersion, 10);
			
			var nAgt = window.navigator.userAgent, verOffset, nameOffset, ix;
			
			if((verOffset = nAgt.indexOf('Opera')) != -1){
				bro.opera = true;
				bro.name = 'Opera';
				bro.fullVersion = nAgt.substring(verOffset + 6);
				if((verOffset = nAgt.indexOf('Version')) != -1){
					bro.fullVersion = nAgt.substring(verOffset + 8);
				}
			}else if((verOffset = nAgt.indexOf('MSIE')) != -1){
				bro.msie = true;
				bro.name = 'Microsoft Internet Explorer';
				bro.fullVersion = nAgt.substring(verOffset + 5);
			}else if((verOffset = nAgt.indexOf('Chrome')) != -1){
				bro.webkit = true;
				bro.name = 'Chrome';
				bro.fullVersion = nAgt.substring(verOffset + 7);
			}else if((verOffset = nAgt.indexOf('Safari')) != -1){
				bro.webkit = true;
				bro.name = 'Safari';
				bro.fullVersion = nAgt.substring(verOffset + 7);
				if((verOffset = nAgt.indexOf('Version')) != -1){
					bro.fullVersion = nAgt.substring(verOffset + 8);
				}
			}else if((verOffset = nAgt.indexOf('Firefox')) != -1){
				bro.mozilla = true;
				bro.name = 'Firefox';
				bro.fullVersion = nAgt.substring(verOffset + 8);
			}else if((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))){
				bro.name = nAgt.substring(nameOffset, verOffset);
				bro.fullVersion = nAgt.substring(verOffset + 1);
				if(bro.name.toLowerCase() == bro.name.toUpperCase()){
					bro.name = window.navigator.appName;
				}
			}
			
			if((ix = bro.fullVersion.indexOf(';')) != -1){
				bro.fullVersion = bro.fullVersion.substring(0, ix);
			}
			if((ix = bro.fullVersion.indexOf(' ')) != -1){
				bro.fullVersion = bro.fullVersion.substring(0, ix);
				bro.majorVersion = parseInt('' + bro.fullVersion, 10);
			}
			if(isNaN(bro.majorVersion)){
				bro.fullVersion = '' + parseFloat(window.navigator.appVersion);
				bro.majorVersion = parseInt(window.navigator.appVersion, 10);
			}
			
			bro.version = bro.majorVersion;
			
			return bro;
		})(),
		
		// 页面类
		page: {
			// 判断当前页面是否由移动端打开
			inMobile: /mobile/i.test(window.navigator.userAgent),
			// 判断当前页面是否由iframe打开
			inIframe: !!window.frameElement,
			// 刷新当前页面
			refresh: function(){
				window.location.reload();
			},
			// 页面跳转
			go: function(url){
				window.location.href = url;
			}
		},
		
		// URL类
		url: {
			// 获取参数集合
			getParams: function(url){
				if(!url){
					url = window.location.href;
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
			// 获取、修改或添加参数
			modify: function(url, key, val){
				if(_Util.com.isPlainObject(key)){
					for(var i in key){
						url = this.modify(url, i, key[i]);
					}
					return url;
				}
				
				var rgx = new RegExp('(\\\?|&)' + key + '=([^&]+)(&|$)', 'i'), match = url.match(rgx);
			    if(val){
			        if(match){
			            return url.replace(rgx, function($0, $1, $2){
			                return ($0.replace($2, val));
			            });
			        }else{
			            if(url.indexOf('?') == -1){
			                return (url + '?' + key + '=' + val);
			            }else{
			                return (url + '&' + key + '=' + val);
			            }
			        }
			    }else{
			        if(match){
			            return match[2];
			        }else{
			            return '';
			        }
			    }
			}
		},
		
		// DOM类
		dom: {
			// DOM载入就绪，类似jQuery的$(document).ready
			ready: (function(){
			    var
			    doc = document,
			    branch = document.addEventListener ? 'w3c' : 'ie678',
			    dr = {
			        done: false,
			        fn: [],
			        push: function(fn){
			            if(!dr.done){
			                if(dr.fn.length === 0){
			                    dr.bind();
			                }
			                dr.fn.push(fn);
			            }else{
			                fn();
			            }
			        },
			        ready: function(){
			            dr.done = true;
			            
			            var fn = dr.fn;
			            for(var i = 0, len = fn.length; i < len; i++){
			                fn[i]();
			            }
			
			            dr.unbind();
			            dr.fn = null;
			        },
			        bind: {
			            w3c: function(){
			                doc.addEventListener('DOMContentLoaded', dr.ready, false);
			            },
			            ie678: function(){
			                var
			                done = false,
			                init = function(){
			                    if(!done){
			                        done = true;
			                        dr.ready();
			                    }
			                };
			                
			                (function(){
			                    try{
			                        doc.documentElement.doScroll('left');
			                    }catch(e){
			                        setTimeout(arguments.callee, 20);
			                        return;
			                    }
			                    init();
			                })();
			
			                doc.onreadystatechange = function(){
			                    if(doc.readyState == 'complete'){
			                        doc.onreadystatechange = null;
			                        init();
			                    }
			                };
			            }
			        }[branch],
			        unbind: {
			            w3c: function(){
			                doc.removeEventListener('DOMContentLoaded', dr.ready, false);
			            },
			            ie678: function(){
							
			            }
			        }[branch]
			    };
			
			    return dr.push;
			})()
		},
		
		// 事件类
		event: {
			// 添加事件处理函数
			bind: function(target, type, fn){
				if(target.addEventListener){
					target.addEventListener(type, fn, false);
				}else if(oTarget.attachEvent){
					target.attachEvent('on' + type, fn);
				}else{
					target['on' + type] = fn;
				}
			},
			// 删除事件处理函数
			unbind: function(target, type, fn){
				if(target.removeEventListener){
				    target.removeEventListener(type, fn, false);
				}else if(target.detachEvent){
				    target.detachEvent('on' + type, fn);
				}else{
				    target['on' + type] = null;
			    }
			}
		},
		
		// HTTP类
		http: {
			// 构造XMLHttpRequest对象的函数
			factory: null,
			// 构造XMLHttpRequest对象的函数集合，用于兼容不同浏览器
			factories: [
				function(){ return new XMLHttpRequest(); },
				function(){ return new ActiveXObject('Msxm12.XMLHTTP'); },
				function(){ return new ActiveXObject('Microsoft.XMLHTTP'); }
			],
			// 创建并返回一个XMLHttpRequest对象
			createXhr: function(){
				if(this.factory != null){
					return this.factory();
				}
				
				for(var i = 0, len = this.factories.length; i < len; i++){
					try{
						var factory = this.factories[i], xhr = factory();
						if(xhr != null){
							this.factory = factory;
							return xhr;
						}
					}catch(e){
						continue;
					}
				}
				
				// 无法创建XMLHttpRequest对象时抛出异常
				this.factory = function(){
					throw new Error('XMLHttpRequest not supported!');
				};
				this.factory();
			},
			// 请求入口
			ajax: function(group, o){
				var _this = this;
				
				if(o === undefined){
					o = group;
					group = null;
				}
				
				var
				// 请求地址
				url = o.url || '',
				// 请求类型
				method = o.method || 'GET',
				// 是否异步处理请求
				async = o.async !== false,
				// 请求参数
				data = o.data || null,
				// 请求成功回调函数
				success = o.success || function(){},
				// 请求失败回调函数
				error = o.error || function(){},
				// 请求完成回调函数
				complete = complete || function(){},
				// 请求状态发生变化时的处理函数
				onStateChange = function(xhr, success, error){
					if(xhr.readyState == 4){
						var status = xhr.status;
						if(status >= 200 && status < 300){
							success(xhr);
						}else{
							error(xhr);
						}
						
						complete(xhr);
						
						if(group){
							var arr = _this.queue[group];
							if(arr && arr.length > 0){
								arr.shift();
								_this.exeAjaxQueue(group);
							}
						}
					}
				};
				
				// 将请求类型转换为大写
				method = method.toUpperCase();
				
				// 创建XMLHttpRequest对象
				var xhr = this.createXhr();
				
				if(method == 'GET' && data){
					var args = '';
					if(_util.isString(data)){
			        	args = data;
			        }else if(_util.isPlainObject(data)){
			        	var str = [];
			        	for(var key in data){
			        		str.push(key + '=' + data[key]);
			        	}
			        	args = str.join('&');
			        }
					url += (url.indexOf('?') == -1 ? '?' : '&') + args;
					data = null;
				}
				
				if(method == 'POST'){
			        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			    }
				
				xhr.open(method, url, async);
				
				xhr.onreadystatechange = function(){
					onStateChange(xhr, success, error);
				};
			    
			    xhr.send(data);
			},
			// 队列集合，记录分组的队列
			queue: {},
			// 队列请求入口
			ajaxQueue: function(group, o){
				if(o === undefined){
					return false;
				}
				
				if(!this.queue[group]){
					this.queue[group] = [];
				}
				
				var arr = this.queue[group];
				
				arr.push(o);
				
				if(arr.length == 1){
					this.exeAjaxQueue(group);
				}
			},
			// 发起请求
			exeAjaxQueue: function(group){
				var arr = this.queue[group];
				if(arr && arr.length > 0){
					this.ajax(group, arr[0]);
			    }
			}
		},
		
		// Cookie类
		cookie: {
			// 获取cookie
			get: function(key){
				if(!key){
					return '';
				}
				if(document.cookie.length > 0){
			        var start = document.cookie.indexOf(key + '=');
			        if(start != -1){
			            start = start + key.length + 1;
			            var end = document.cookie.indexOf(';', start);
			            if(end == -1){
			                end = document.cookie.length;
			            }
			            return decodeURIComponent(document.cookie.substring(start, end));
			        }
			    }
			    return '';
			},
			// 设置cookie
			set: function(key, val, expireSeconds){
				if(!key){
					return;
				}
				var date = new Date();
				date.setTime(date.getTime() + expireSeconds * 1000);
				document.cookie = key + '=' + encodeURIComponent(val) + ';expires=' + date.toGMTString() + ';';
			},
			// 删除cookie
			remove: function(key){
				if(!key){
					return;
				}
				document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
			}
		},
		
		// Storage类
		storage: {
			// 获取Storage
			get: function(key){
				if(!key){
					return;
				}
				if(window.localStorage){
					return decodeURIComponent(window.localStorage.getItem(key));
				}else{
					return _Util.cookie.get(key);
				}
			},
			// 设置Storage
			set: function(key, val, expireSeconds){
				if(!key){
					return;
				}
				if(window.localStorage){
				    window.localStorage.setItem(key, encodeURIComponent(val));
				}else{
				    _Util.cookie.set(key, val, expireSeconds);
				}
			},
			// 删除Storage
			remove: function(key){
				if(!key){
					return;
				}
				if(window.localStorage){
				    window.localStorage.removeItem(key);
				}else{
				     _Util.cookie.remove(key);
				}
			}
		},
		
		
		// 移动类
		mobile: {
			// 根据屏幕大小动态设置相对单位
			rem: function(){
				var _this = this;
				_this.width = 640;
				_this.fontSize = 100;
				_this.widthProportion = function(){
					var p = document.documentElement.clientWidth / _this.width;
					return p > 1 ? 1 : p < 0.5 ? 0.5 : p;
				};
				_this.changeFontSize = function(){
					document.documentElement.style.fontSize = _this.widthProportion() * _this.fontSize + 'px';
				};
				_this.changeFontSize();
				var evt = 'orientationchange' in window ? 'orientationchange' : 'resize';
				window.addEventListener(evt, function(){
					_this.changeFontSize();
				}, false);
			}
		}
		
	};
	
	if(window.Util){
		for(var key in _Util){
			window.Util[key] = _Util[key];
		}
	}else{
		window.Util = _Util;
	}
	
})(window, document);
