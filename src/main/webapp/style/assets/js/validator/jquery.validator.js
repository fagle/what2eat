/**
 * Author: dingwei 2015-04-27
 * Description: jquery.validator.js
**/
(function($){
	
	var
	_bracketsSplit = /(?=\[)/g,
	_bracketsFilter = /(^\[*)|(\]*$)/g,
	
	_toString = Object.prototype.toString,
	_hasOwnProperty = Object.prototype.hasOwnProperty,
	
	_util = {
		getType: function(obj){
		    return _toString.call(obj);
		},
		isWindow: function(obj){
		    return obj && obj == obj.window;
		},
		isNumber: function(num){
			return this.getType(num) === '[object Number]';
		},
		isString: function(str){
			return this.getType(str) === '[object String]';
		},
		isArray: function(arr){
			return this.getType(arr) === '[object Array]';
		},
		isBoolean: function(bool){
			return this.getType(bool) === '[object Boolean]';
		},
		isDate: function(date){
			return this.getType(date) === '[object Date]';
		},
		isFunction: function(fn){
			return this.getType(fn) === '[object Function]';
		},
		isRegex: function(rgx){
			return this.getType(rgx) === '[object RegExp]';
		},
		isObject: function(obj){
			return this.getType(obj) === '[object Object]';
		},
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
		clone: function(obj){
			if(!this.isArray(obj) && !this.isPlainObject(obj)){
				return obj;
			}
			var copy = this.isArray(obj) ? [] : {};
		    for(var key in obj){
		        if(obj.hasOwnProperty(key)){
		            copy[key] = this.isPlainObject(obj[key]) ? this.clone(obj[key]) : obj[key];
		        }
		    }
		    return copy;
		}
	},
	
	_vQuery = {
		
		errorStyle: 'has-error',
		
		setErrorStyle: function(style){
			
			this.errorStyle = style || 'has-error';
			
		},
		
	    defaultRules: {
	    	
	    	'required': { title: '此项必填', rule: /.+/ },
	    	
		    'number': { title: '只允许输入数字', rule: /^(-?\d+)(\.\d+)?$/ },
		    
		    'posNumber': { title: '只允许输入正数', rule: /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/ },
		    
		    'negNumber': { title: '只允许输入负数', rule: /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/ },
		    
		    'integer': { title: '只允许输入整数', rule: /^-?[1-9]\d*$/ },
		    
		    'posInteger': { title: '只允许输入正整数', rule: /^[0-9]*[1-9][0-9]*$/ },
		    
		    'negInteger': { title: '只允许输入负整数', rule: /^-[0-9]*[1-9][0-9]*$/ },
		    
		    'unNegInteger': { title: '只允许输入非负整数', rule: /^\d+$/ },
		    
		    'unPosInteger': { title: '只允许输入非正整数', rule: /^((-\d+)|(0+))$/ },
		    
		    'decimal': { title: '只允许输入浮点数', rule: /^(-?\d+)(\.\d+)?$/ },
		    
		    'posDecimal': { title: '只允许输入正浮点数', rule: /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/ },
		    
		    'negDecimal': { title: '只允许输入负浮点数', rule: /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/ },
		    
		    'unNegDecimal': { title: '只允许输入非负浮点数', rule: /^\d+(\.\d+)?$/ },
		    
		    'unPosDecimal': { title: '只允许输入非正浮点数', rule: /^((-\d+(\.\d+)?)|(0+(\.0+)?))$/ },
		    
		    'date': { title: '日期格式不正确', rule: /^(\d{4})(-|\/)(\d{1,2})\2(\d{1,2})$/ },
		    
		    'email': { title: '邮箱格式不正确', rule: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/ },
		    
		    'areaCode': { title: '区号格式不正确', rule: /(0[0-9]{2,3})/ },
		    
		    'telephone': { title: '电话号码格式不正确', rule: /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/ },
		    
		    'mobile': { title: '手机号码格式不正确', rule: /^1[0-9]{10}$/ },
		    
		    'idCard': { title: '身份证格式不正确', rule: /^[1-9]([0-9]{14}|[0-9]{17})$/ },
		    
		    'qq': { title: 'QQ号码格式不正确', rule: /^[1-9][0-9]{4,}$/ },
		    
		    'zipCode': { title: '邮政编码格式不正确', rule: /^[1-9]\d{5}$/ },
		    
		    'url': { title: 'URL地址格式不正确', rule: /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/ },
		    
		    'ip4': { title: 'IP4地址格式不正确', rule: /^(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)$/ },
		    
		    'zip': { title: '不是有效的压缩文件', rule: /(.*)\.(rar|zip|7zip|tgz)$/ },
		    
		    'image': { title: '图片格式不正确', rule: /(.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/ },
		    
		    'letter': { title: '只允许输入字母', rule: /^[A-Za-z]+$/ },
		    
		    'upperLetter': { title: '只允许输入大写字母', rule: /^[A-Z]+$/ },
		    
		    'lowerLetter': { title: '只允许输入小写字母', rule: /^[a-z]+$/ },
		    
		    'ch': { title: '只允许输入中文', rule: /^[\u4E00-\u9FA5\uF900-\uFA2D]+/ },
		    
		    'color': { title: '不是有效的颜色值', rule: /^[a-fA-F0-9]{6}$/ },
		    
		    'ascii': { title: '不是有效的ACSII编码', rule: /^[\x00-\xFF]+$/ },
		    
		    'account': { title: '用户名必须由数字、字母或下划线组成', rule: /^\w+$/ },
		    
		    'specialAccount': { title: '用户名必须由中英文、数字或下划线组成', rule: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/ },
		    
		    'money': {
		    	
		    	title: '金额格式不正确，只允许输入整数或小数',
		    	
		    	rule: function(elem){
		    		
		    		var flag = true, n1 = this.range[0], n2 = this.range[1], rule = /^(-?\d+)(\.\d+)?$/, val = $.trim(elem.val());
		    		
		    		if(val != ''){
		    			
		    			flag = rule.test(val);
			    		
			    		if(flag){
			    			
			    			val = val.split('.');
			    			
			    			var integer = val[0], decimal = val[1], title = [];
			    			
			    			if(n1 && integer && integer.length > n1){
			    				
			    				title.push('小数点前最多' + n1 + '位');
			    				
			    				flag = false;
			    				
			    			}
			    			
			    			if(n2 && decimal && decimal.length > n2){
			    				
			    				title.push('小数点后最多' + n2 + '位');
			    				
			    				flag = false;
			    				
			    			}
			    			
			    			this.title = title.join('，');
			    			
			    		}else{
			    			
			    			this.title = '金额格式不正确，只允许输入整数或小数';
			    			
			    		}
			    		
		    		}
		    		
		    		return flag;
		    		
		    	}
		    	
		    },
		    
		    'check': {
		    	
		        title: '选择不正确',
		        
		        rule: function(elem){
		        	
		            var flag = true, min = this.range[0], max = this.range[1], len = elem.filter(':checked').length;
		            
	                if(min && len < parseInt(min, 10)){
	                	
	                	this.title = '最少选择' + min + '项';
	                	
	                    flag = false;
	                    
	                }
	                
	                if(max && len > parseInt(max, 10)){
	                	
	                	this.title = '最多选择' + max + '项';
	                	
	                    flag = false;
	                    
	                }
	                
	                return flag;
		        }
		        
		    }
		    
	    },
	    
	    addRule: function(rule){
	    	
	        if(_util.isPlainObject(rule)){
	        	
	            var key = rule.name;
	            
	            delete rule.name;
	            
	            this.defaultRules[key] = rule;
	            
	        }
	        
	    },
	    
	    addRules: function(rules){
	    	
	        if(_util.isArray(rules)){
	        	
	            for(var i = 0, len = rules.length; i < len; i++){
	            	
	                this.addRule(rules[i]);
	                
	            }
	            
	        }
	        
	    },
	    
		resolveStringRule: function(rule){
			
			var name, range, defaultRules = this.defaultRules;
			
		    if(rule.indexOf('[') == -1){
		    	
		        name = rule;
		        
		    }else{
		    	
		        rule = rule.split(_bracketsSplit);
		        
		        name = rule[0];
		        
		        range = rule[1];
		        
		    }
		    
		    var copy = _util.clone(defaultRules[name]);
		    
		    copy['name'] = name;
		    
		    if(range){
		    	
		        copy['range'] = range.replace(_bracketsFilter, '').split(',');
		        
		    }
		    
		    return copy;
		    
		},
		
		resolveObjectRule: function(rule){
			
		    var name, range, defaultRules = this.defaultRules;
		    
		    if(rule.name.indexOf('[') == -1){
		    	
		        name = rule.name;
		        
		    }else{
		    	
				rule.name = rule.name.split(_bracketsSplit);
				
				name = rule.name[0];
				
				range = rule.name[1];
				
		    }
		    
		    var copy = _util.clone(defaultRules[name]);
		    
		    copy['name'] = name;
		    
		    if(range){
		    	
		        copy['range'] = range.replace(_bracketsFilter, '').split(',');
		        
		    }
		    
		    for(var key in rule){
		    	
		    	if(key === 'name'){
		    		
		    		continue;
		    		
		    	}
		    	
		    	copy[key] = rule[key];
		    	
		    }
		    
		    return copy;
		    
		},
		
		verifyCaches: [
			
			
			
		],
		
		setVerifyCache: function(selector, arr){
			
			return {
				
				selector: selector,
				
				rules: arr
				
			};
		    
		},
		
		verifyInput: function(elem, json){
			
			 elem = $(elem);
			
		    var flag = true, errorStyle = this.errorStyle;
		    
		    if(elem.data('verify') == false){
		    	
		        elem.removeAttr('title').removeClass(errorStyle);
		        
		        return flag;
		        
		    }
		    
		    if(_util.isRegex(json.rule)){
		    	
		    	var val = $.trim(elem.val());
		    	
		        if(val == ''){
		        	
		            if(json.name === 'required'){
		            	
		                flag = json.rule.test(val);
		                
		            }
		            
		        }else{
		        	
		            flag = json.rule.test(val);
		            
		        }
		        
		    }else if(_util.isFunction(json.rule)){
		    	
		        flag = json.rule(elem);
		        
		    }
		    
			if(flag){
				
		        elem.removeAttr('title').removeClass(errorStyle);
		        
		    }else{
		    	
		        elem.attr('title', json.title).addClass(errorStyle);
		        
		    }
		    
		    return flag;
		    
		},
		
		verifyCheck: function(elem, json){
			
			elem = $(elem);
			
		    var flag = true, errorStyle = this.errorStyle;
		    
		    if(elem.data('verify') == false){
		    	
		        elem.removeAttr('title').removeClass(errorStyle);
		        
		        return flag;
		        
		    }
		    
		    if(_util.isRegex(json.rule)){
				
				
				
		    }else if(_util.isFunction(json.rule)){
		    	
				flag = json.rule(elem);
		        
		    }
		    
		    if(flag){
		    	
		        elem.removeAttr('title').removeClass(errorStyle);
		        
		    }else{
		    	
		        elem.attr('title', json.title).addClass(errorStyle);
		        
		    }
		    
		    return flag;
		    
		},
		
		initVerify: function(selector, rules){
			
		    var _this = this, arr = [];
		    
		    if(_util.isString(rules)){
		    	
		        rules = rules.split(' ');
		        
		        for(var i = 0, len = rules.length; i < len; i++){
		        	
		            var rule = _this.resolveStringRule(rules[i]);
		            
		            arr.push(rule);
		            
		        }
		        
		    }else if(_util.isPlainObject(rules)){
		    	
		        var rule = _this.resolveObjectRule(rules);
		        
		        arr.push(rule);
		        
		    }else if(_util.isArray(rules)){
		    	
		        for(var i = 0, len = rules.length; i < len; i++){
		        	
		            var rule;
		            
		            if(_util.isString(rules[i])){
		            	
		                rule = _this.resolveStringRule(rules[i]);
		                
		            }else if(_util.isPlainObject(rules[i])){
		            	
		                rule = _this.resolveObjectRule(rules[i]);
		                
		            }
		            
		            arr.push(rule);
		            
		        }
		        
		    }
		    
		    _this.verifyCaches.push(_this.setVerifyCache(selector, arr));
		    
		    $(selector).each(function(){
		    	
		    	var elem = $(this);
		    	
		    	if(elem.is(':text') || elem.is(':password') || elem.is('textarea')){
			    	
			    	elem.on('blur.verify', function(){
			    		
			    		for(var i = 0, len = arr.length; i < len; i++){
			    			
			                var flag = _this.verifyInput(this, arr[i]);
			                
			                if(!flag){
			                	
			                    break;
			                    
			                }
			                
			            }
			            
			    	});
			    	
			    }else if(elem.is('select') || elem.is(':file')){
			    	
			    	elem.on('change.verify', function(){
			    		
			    		for(var i = 0, len = arr.length; i < len; i++){
			    			
			                var flag = _this.verifyInput(this, arr[i]);
			                
			                if(!flag){
			                	
			                    break;
			                    
			                }
			                
			            }
			    		
			    	});
			    	
			    }else if(elem.is(':radio') || elem.is(':checkbox')){
			    	
			    	elem.on('click.verify', function(){
			    		
			    		for(var i = 0, len = arr.length; i < len; i++){
			    			
			                var flag = _this.verifyCheck(selector, arr[i]);
			                
			                if(!flag){
			                	
			                    break;
			                    
			                }
			                
			            }
			            
			    	});
			    	
			    }
		    	
		    });
		    
		},
		
		verifyAll: function(selector){
			
		    var _this = this, form = $(selector || 'body'), flag = true;
		    
		    for(var idx = 0, total = _this.verifyCaches.length; idx < total; idx++){
		    	
		        var json = _this.verifyCaches[idx], elems = $(json.selector, form);
		        
				if(elems.length > 0){
					
					elems.each(function(){
						
						var elem = $(this);
						
						if(elem.is(':text') || elem.is(':password') || elem.is('textarea') || elem.is('select') || elem.is(':file')){
							
							var rules = json.rules;
		                    
		                    for(var i = 0, len = rules.length; i < len; i++){
		                    	
		                        flag = _this.verifyInput(this, rules[i]) && flag;
		                        
		                        if(!flag){
		                        	
		                            break;
		                            
		                        }
		                        
		                    }
							
						}else if(elem.is(':radio') || elem.is(':checkbox')){
							
							var rules = json.rules;
		                	
			                for(var i = 0, len = rules.length; i < len; i++){
			                	
			                    flag = _this.verifyCheck(json.selector, rules[i]) && flag;
			                    
			                    if(!flag){
			                    	
			                        break;
			                        
			                    }
			                    
			                }
							
						}
						
					});
					
		        }
		        
		    }
		    
		    return flag;
		    
		},
		
		verify: function(selector, rules){
			
			if(rules){
				
	            this.initVerify(selector, rules);
	            
			}else{
				
		        return this.verifyAll(selector);
		        
			}
			
		},
		
		disableVerify: function(selector){
			
		    if(!selector){
		    	
		        return false;
		        
		    }
		    
		    $(selector).data('verify', false).removeAttr('title').removeClass(errorStyle);
		    
		},
		
		enableVerify: function(selector){
			
		    if(!selector){
		    	
		        return false;
		        
		    }
		    
		    $(selector).data('verify', true);
		    
		},
		
		deleteErrorStyle: function(selector){
			
			var _this = this;
			
		    if(!selector){
		    	
		        return false;
		        
		    }
		    
		    $(selector).each(function(){
		        
		        $(this).removeAttr('title').removeClass(_this.errorStyle);
		        
		    });
		    
		}
		
	};
	
	$.extend(_vQuery);
	
	$.fn.verify = function(rules){
		
		var selector = this.selector;
		
		if(rules){
			
			$.verify(selector, rules);
			
		}else{
			
			return $.verify(selector);
			
		}
		
	};
	
	$.fn.disableVerify = function(){
		
		var selector = this.selector;
		
		$.disableVerify(selector);
		
	};
	
	$.fn.enableVerify = function(){
		
		var selector = this.selector;
		
		$.enableVerify(selector);
		
	};
	
})(jQuery);
