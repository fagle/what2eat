﻿/**
 * Author: dingwei 2015-04-27
 * Description: jquery.validator.js
**/
(function($){
	
	var
	_toString = Object.prototype.toString,
	_hasOwnProperty = Object.prototype.hasOwnProperty,
	_indexOf = Array.prototype.indexOf,
	_util = {
		getType: function(obj){
		    return _toString.call(obj);
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
		isEmptyObject: function(obj){
			for(var key in obj){
		        return false;
		    }
		    return true;
		},
		clone: function(obj){
			if(!this.isArray(obj) && !this.isPlainObject(obj)){
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
		inArray: function(target, arr, i){
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
		}
	},
	_bracketsSplit = /(?=\[)/g, _bracketsFilter = /(^\[*)|(\]*$)/g,
	_rules = [
		{ name: 'required', tips: '不能为空', rule: /.+/ },
	    { name: 'number', tips: '只允许输入数字', rule: /^(-?\d+)(\.\d+)?$/ },
	    { name: 'posiNumber', tips: '只允许输入正数', rule: /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/ },
	    { name: 'negaNumber', tips: '只允许输入负数', rule: /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/ },
	    { name: 'integer', tips: '只允许输入整数', rule: /^-?[1-9]\d*$/ },
	    { name: 'posiInteger', tips: '只允许输入正整数', rule: /^[0-9]*[1-9][0-9]*$/ },
	    { name: 'negaInteger', tips: '只允许输入负整数', rule: /^-[0-9]*[1-9][0-9]*$/ },
	    { name: 'nonNegaInteger', tips: '只允许输入非负整数', rule: /^\d+$/ },
	    { name: 'nonPosiInteger', tips: '只允许输入非正整数', rule: /^((-\d+)|(0+))$/ },
	    { name: 'decimal', tips: '只允许输入浮点数', rule: /^(-?\d+)(\.\d+)?$/ },
	    { name: 'posiDecimal', tips: '只允许输入正浮点数', rule: /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/ },
	    { name: 'negaDecimal', tips: '只允许输入负浮点数', rule: /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/ },
	    { name: 'nonNegaDecimal', tips: '只允许输入非负浮点数', rule: /^\d+(\.\d+)?$/ },
	    { name: 'nonPosiDecimal', tips: '只允许输入非正浮点数', rule: /^((-\d+(\.\d+)?)|(0+(\.0+)?))$/ },
	    { name: 'date', tips: '日期格式不正确', rule: /^(\d{4})(-|\/)(\d{1,2})\2(\d{1,2})$/ },
	    { name: 'email', tips: '邮箱格式不正确', rule: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/ },
	    { name: 'mobilephone', tips: '手机号码格式不正确', rule: /^1[0-9]{10}$/ },
	    { name: 'areaCode', tips: '区号格式不正确', rule: /(0[0-9]{2,3})/ },
	    { name: 'telephone', tips: '电话号码格式不正确', rule: /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/ },
	    { name: 'qq', tips: 'QQ号码格式不正确', rule: /^[1-9][0-9]{4,}$/ },
	    { name: 'idCard', tips: '身份证格式不正确', rule: /^[1-9]([0-9]{14}|[0-9]{17})$/ },
	    { name: 'zipCode', tips: '邮政编码格式不正确', rule: /^[1-9]\d{5}$/ },
	    { name: 'url', tips: 'URL地址格式不正确', rule: /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/ },
	    { name: 'ip4', tips: 'IP地址格式不正确', rule: /^(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)$/ },
	    { name: 'rar', tips: '不是有效的压缩文件', rule: /(.*)\.(rar|zip|7zip|tgz)$/ },
	    { name: 'image', tips: '图片格式不正确', rule: /(.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/ },
	    { name: 'letter', tips: '仅允许输入字母', rule: /^[A-Za-z]+$/ },
	    { name: 'upperLetter', tips: '只允许输入大写字母', rule: /^[A-Z]+$/ },
	    { name: 'lowerLetter', tips: '只允许输入小写字母', rule: /^[a-z]+$/ },
	    { name: 'Chinese', tips: '只允许输入中文', rule: /^[\u4E00-\u9FA5\uF900-\uFA2D]+/ },
	    { name: 'color', tips: '不是有效的颜色值', rule: /^[a-fA-F0-9]{6}$/ },
	    { name: 'ascii', tips: '不是有效的ACSII编码', rule: /^[\x00-\xFF]+$/ },
	    { name: 'account', tips: '用户名必须由数字、字母或下划线组成', rule: /^\w+$/ },
	    { name: 'specialAccount', tips: '用户名必须由中英文、数字或下划线组成', rule: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/ },
	    {
	    	name: 'money',
	    	tips: '金额格式不正确',
	    	rule: function(elem){
	    		var flag = true, n1 = this.range[0], n2 = this.range[1], rule = /^(-?\d+)(\.\d+)?$/, val = $.trim(elem.val());
	    		if(val != ''){
	    			flag = rule.test(val);
		    		if(flag){
		    			val = val.split('.');
		    			var integer = val[0], decimal = val[1];
		    			if(integer.length > n1 || decimal.length > n2){
		    				flag = false;
		    			}
		    			this.tips = '小数点前最多' + n1 + '位，小数点后最多' + n2 + '位';
		    		}else{
		    			this.tips = '金额格式不正确，只允许输入整数或小数';
		    		}
	    		}
	    		return flag;
	    	}
	    },
	    {
	        name: 'check',
	        tips: '选择不正确',
	        rule: function(elem){
	            var flag = true, min = this.range[0], max = this.range[1];
	            if(elem.is(':checkbox') || elem.is(':radio')){
	                var len = elem.filter(':checked').length;
	                if(min && len < parseInt(min)){
	                	this.tips = '最少选择' + min + '项';
	                    flag = false;
	                }
	                if(max && len > parseInt(max)){
	                	this.tips = '最多选择' + max + '项';
	                    flag = false;
	                }
	            }
                return flag;
	        }
	    }
	],
	_vQuery = {
		errorStyle: {
			text: 'text-error',
			box: 'box-error'
		},
		setErrorStyle: function(textStyle, boxStyle){
			textStyle && (this.errorStyle.text = textStyle);
			boxStyle && (this.errorStyle.box = boxStyle);
		},
	    rules: {
	    	
	    },
	    addRule: function(rule){
	        if(_util.isPlainObject(rule)){
	            var key = rule.name;
	            delete rule.name;
	            this.rules[key] = rule;
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
			var rules = this.rules, name, range;
			
		    if(rule.indexOf('[') == -1){
		        name = rule;
		    }else{
		        rule = rule.split(_bracketsSplit);
		        name = rule[0];
		        range = rule[1];
		    }
		    
		    var copy = _util.clone(rules[name]);
		    copy['name'] = name;
		    if(range){
		        copy['range'] = range.replace(_bracketsFilter, '').split(',');
		    }
		    
		    return copy;
		},
		resolveObjectRule: function(rule){
		    var rules = this.rules, name, range;
		    
		    if(rule.name.indexOf('[') == -1){
		        name = rule.name;
		    }else{
				rule.name = rule.name.split(_bracketsSplit);
				name = rule.name[0];
				range = rule.name[1];
		    }
		    
		    var copy = _util.clone(rules[name]);
		    copy['name'] = name;
		    if(range){
		        copy['range'] = range.replace(_bracketsFilter, '').split(',');
		    }
		    
		    for(var key in rule){
		    	if(key == 'name'){
		    		continue;
		    	}
		    	copy[key] = rule[key];
		    }
		    
		    return copy;
		},
		globalCache: [
			
		],
		spliceGlobalCache: function(selector, rule, cache){
		    if(cache.selector && cache.selector == selector){
		        cache.rules.push(rule);
		    }else{
		        cache.selector = selector;
		        cache.rules = [rule];
		    }
		},
		initElemsVerify: function(selector, rules){
		    var _this = this, localCache = [], globalCache = {};
		    
		    if(_util.isString(rules)){
		        rules = rules.split(' ');
		        for(var i = 0, len = rules.length; i < len; i++){
		            var rule = _this.resolveStringRule(rules[i]);
		            localCache.push(rule);
		            _this.spliceGlobalCache(selector, rule, globalCache);
		        }
		    }else if(_util.isPlainObject(rules)){
		        var rule = _this.resolveObjectRule(rules);
		        localCache.push(rule);
	            _this.spliceGlobalCache(selector, rule, globalCache);
		    }else if(_util.isArray(rules)){
		        for(var i = 0, len = rules.length; i < len; i++){
		            var rule;
		            if(_util.isString(rules[i])){
		                rule = _this.resolveStringRule(rules[i]);
		            }else if(_util.isPlainObject(rules[i])){
		                rule = _this.resolveObjectRule(rules[i]);
		            }
		            localCache.push(rule);
		            _this.spliceGlobalCache(selector, rule, globalCache);
		        }
		    }
		    
		    _this.globalCache.push(globalCache);
		    
		    var elem = $(selector);
		    
		    elem.data('verify') == true;
		    
		    if(elem.is(':text') || elem.is(':password') || elem.is('textarea')){
		    	elem.on('blur.verify', function(){
		    		for(var i = 0, len = localCache.length; i < len; i++){
		                var flag = _this.verifyText(this, localCache[i]);
		                if(!flag){
		                    break;
		                }
		            }
		    	});
		    }else if(elem.is(':radio') || elem.is(':checkbox')){
		    	elem.on('click.verify', function(){
		    		for(var i = 0, len = localCache.length; i < len; i++){
		                var flag = _this.verifyCheck(elem, localCache[i]);
		                if(!flag){
		                    break;
		                }
		            }
		    	});
		    }
		},
		verifyAllElems: function(selector){
		    var _this = this, form = $(selector || 'body'), flag = true;
		    
		    for(var index = 0, total = _this.globalCaches.length; index < total; index++){
		        var json = this.globalCaches[index], elem = $(json.selector, form);
		        if(elem.length > 0){
		            if(elem.is(':text') || elem.is(':password') || elem.is('textarea')){
		                elem.each(function(){
		                    var rules = json.rules;
		                    for(var i = 0, len = rules.length; i < len; i++){
		                        flag = _this.verifyText(this, rules[i]) && flag;
		                        if(!flag){
		                            break;
		                        }
		                    }
		                });
		            }
		            else if(elem.is(':radio') || elem.is(':checkbox')){
		                var rules = json.rules;
		                for(var i = 0, len = rules.length; i < len; i++){
		                    flag = _this.verifyCheck(elem, rules[i]) && flag;
		                    if(!flag){
		                        break;
		                    }
		                }
		            }
		        }
		    }
		    
		    return flag;
		},
		verifyText: function(elem, json){
		    var flag = true, errorStyle = this.errorStyle.text;
		    
		    elem = $(elem);
		    
		    if(elem.data('verify') == false){
		        elem.removeAttr('title').removeClass(errorStyle);
		        return flag;
		    }
		    
		    if(_util.isRegex(json.rule)){
		    	var val = $.trim(elem.val());
		        if(val == ''){
		            if(json.name == 'required'){
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
		        elem.attr('title', json.tips).addClass(errorStyle);
		    }
		    
		    return flag;
		},
		verifyCheck: function(elem, json){
		    var flag = true, errorStyle = this.errorStyle.box;
		    
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
		        elem.attr('title', json.tips).addClass(errorStyle);
		    }
		    
		    return flag;
		},
		verify: function(selector, rules){
			if(rules){
	            this.initElemsVerify(selector, rules);
			}else{
		        return this.verifyAllElems(selector);
			}
		},
		disableVerify: function(selector){
		    if(!selector){
		        return false;
		    }
		    
		    $(selector).data('verify', false);
		    
		    this.deleteVerifyStyle(selector);
		},
		enableVerify: function(selector){
		    if(!selector){
		        return false;
		    }
		    
		    $(selector).data('verify', true);
		},
		deleteVerifyStyle: function(selector){
			var _this = this;
			
		    if(!selector){
		        return false;
		    }
		    
		    $(selector).each(function(){
		        var elem = $(this);
		        
		        if(elem.is(':text') || elem.is(':password') || elem.is('textarea')){
		            elem.removeAttr('title').removeClass(_this.errorStyle.text);
		        }else if(elem.is(':radio') || elem.is('checkbox')){
		            elem.removeAttr('title').removeClass(_this.errorStyle.box);
		        }
		    });
		}
	};
	
	_vQuery.addRules(_rules);
	
	$.extend(_vQuery);
	
	$.fn.verify = function(rules){
		var selector = this.selector;
		
		if(rules){
			_vQuery.verify(selector, rules);
		}else{
			return _vQuery.verify(selector);
		}
	};
	
	$.fn.disableVerify = function(){
		var selector = this.selector;
		_vQuery.disableVerify(selector);
	};
	
	$.fn.enableVerify = function(){
		var selector = this.selector;
		_vQuery.enableVerify(selector);
	};
	
})(jQuery);