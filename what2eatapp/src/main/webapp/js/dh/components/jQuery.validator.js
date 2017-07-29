/**
 * Author: dingwei 2014-06-27
 * Description: jQuery.validator.js
 * Modified by:
 * Modified contents:
**/
(function($){
	
	var
	// Save a reference to some core methods
	_toString = Object.prototype.toString, _hasOwnProperty = Object.prototype.hasOwnProperty,
	// 
	_mode = {
		// Return the object type
		getType: function(obj){
			return obj && _toString.call(obj);
		},
		// Is window ?
		isWindow: function(obj){
			return obj && obj == obj.window;
		},
		// Is number ?
		isNumber: function(num){
			return this.getType(num) === '[object Number]';
		},
		// Is string ?
		isString: function(str){
			return this.getType(str) === '[object String]';
		},
		// Is array ?
		isArray: function(arr){
			return this.getType(arr) === '[object Array]';
		},
		// Is boolean ?
		isBoolean: function(flag){
			return this.getType(flag) === '[object Boolean]';
		},
		//  Is date ?
		isDate: function(){
			return this.getType(date) === '[object Date]';
		},
		// Is function ?
		isFunction: function(fn){
			return this.getType(fn) === '[object Function]';
		},
		// Is regex ?
		isRegex: function(rgx){
			return this.getType(rgx) === '[object RegExp]';
		},
		// Is object ?
		isObject: function(obj){
			return this.getType(obj) === '[object Object]';
		},
		// Is plain object ?
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
		// Is empty object ?
		isEmptyObject: function(obj){
			for(var key in obj){
		        return false;
		    }
		    return true;
		},
		// Clone object
		clone: function(obj){
			var n = this.isArray(obj) ? [] : {};
		    for(var key in obj){
		        if(obj.hasOwnProperty(key)){
		            n[key] = this.isPlainObject(obj[key]) ? this.clone(obj[key]) : obj[key];
		        }
		    }
		    return n;
		}
	},
	// Regex
	_bracketsSplit = /(?=\[)/g, _bracketsFilter = /(^\[*)|(\]*$)/g,
	// Define the default rules
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
	    {
	    	name: 'money',
	    	tips: '',
	    	rule: function(obj){
	    		var flag = true, n1 = this.range[0], n2 = this.range[1], rule = /^(-?\d+)(\.\d+)?$/, val = $.trim(obj.val());
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
	    { name: 'date', tips: '日期格式不正确', rule: /^(\d{4})(-|\/)(\d{1,2})\2(\d{1,2})$/ },
	    { name: 'email', tips: '邮箱格式不正确', rule: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/ },
	    { name: 'mobile', tips: '手机号码格式不正确', rule: /^1[0-9]{10}$/ },
	    { name: 'areaCode', tips: '本地区号格式不正确', rule: /(0[0-9]{2,3})/ },
	    { name: 'telephone', tips: '电话号码格式不正确', rule: /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/ },
	    { name: 'qq', tips: 'QQ号码格式不正确', rule: /^[1-9][0-9]{4,}$/ },
	    { name: 'idCard', tips: '身份证格式不正确', rule: /^[1-9]([0-9]{14}|[0-9]{17})$/ },
	    { name: 'zipCode', tips: '邮政编码格式不正确', rule: /^[1-9]\d{5}$/ },
	    { name: 'url', tips: 'URL地址格式不正确', rule: /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/ },
	    { name: 'ip4', tips: 'IP地址格式不正确', rule: /^(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)$/ },
	    { name: 'rar', tips: '不是有效的压缩文件', rule: /(.*)\.(rar|zip|7zip|tgz)$/ },
	    { name: 'picture', tips: '图片格式不正确', rule: /(.*)\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/ },
	    { name: 'letter', tips: '仅允许输入字母', rule: /^[A-Za-z]+$/ },
	    { name: 'upperLetter', tips: '只允许输入大写字母', rule: /^[A-Z]+$/ },
	    { name: 'lowerLetter', tips: '只允许输入小写字母', rule: /^[a-z]+$/ },
	    { name: 'chinese', tips: '只允许输入中文', rule: /^[\u4E00-\u9FA5\uF900-\uFA2D]+/ },
	    { name: 'color', tips: '不是有效的颜色值', rule: /^[a-fA-F0-9]{6}$/ },
	    { name: 'ascii', tips: '不是有效的ACSII编码', rule: /^[\x00-\xFF]+$/ },
	    { name: 'account', tips: '用户名必须由数字、字母或下划线组成', rule: /^\w+$/ },
	    { name: 'specialAccount', tips: '用户名必须由中英文、数字或下划线组成', rule: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/ },
	    {
	        name: 'check',
	        tips: '',
	        rule: function(obj){
	            var flag = true, min = this.range[0], max = this.range[1];
	            if(obj.is(':checkbox') || obj.is(':radio')){
	                var len = obj.filter(':checked').length;
	                if(min && len < parseInt(min)){
	                	this.tips = '最少勾选' + min + '项';
	                    flag = false;
	                }
	                if(max && len > parseInt(max)){
	                	this.tips = '最多勾选' + max + '项';
	                    flag = false;
	                }
	                return flag;
	            }
	        }
	    }
	],
	// 
	_vQuery = {
		// Error style
		errorStyle: {
			// For text & password & textarea
			text: 'ui-text-error',
			// For radio & checkbox
			box: 'ui-box-error'
		},
		// Set error style
		setErrorStyle: function(textStyle, boxStyle){
			// For text & password & textarea
			textStyle && (this.errorStyle.text = textStyle);
			// For radio & checkbox
			boxStyle && (this.errorStyle.box = boxStyle);
		},
		// Default rules
	    defaultRules: {},
	    // Add a rule
	    addRule: function(rule){
	        if(_mode.isPlainObject(rule)){
	            var key = rule.name;
	            delete rule.name;
	            this.defaultRules[key] = rule;
	        }
	    },
	    // Add more rules
	    addRules: function(rules){
	        if(_mode.isArray(rules)){
	            for(var i = 0, len = rules.length; i < len; i++){
	                this.addRule(rules[i]);
	            }
	        }
	    },
		// Resolve string rules
		resolveStringRules: function(rule){
			var name, range, defaultRules = this.defaultRules;
			
		    if(rule.indexOf('[') == -1){
		        name = rule;
		    }else{
		        rule = rule.split(_bracketsSplit);
		        name = rule[0];
		        range = rule[1];
		    }
		    
		    var single = _mode.clone(defaultRules[name]);
		    single['name'] = name;
		    if(range){
		        single['range'] = range.replace(_bracketsFilter, '').split(',');
		    }
		    
		    return single;
		},
		// Resolve object rules
		resolveObjectRules: function(rule){
		    var name, range, defaultRules = this.defaultRules;
		    
		    if(rule.name.indexOf('[') == -1){
		        name = rule.name;
		    }else{
		        rule.name = rule.name.split(_bracketsSplit);
		        name = rule.name[0];
		        range = rule.name[1];
		    }
		    
		    var single = _mode.clone(defaultRules[name]);
		    single['name'] = name;
		    if(range){
		        single['range'] = range.replace(_bracketsFilter, '').split(',');
		    }
		    
		    for(var i in rule){
		    	if(i === 'name'){
		    		continue;
		    	}
		    	single[i] = rule[i];
		    }
		    
		    return single;
		},
		// 存储待校验的元素（用于执行全局校验）
		globalCaches: [],
		// 统计全局校验元素
		spliceGlobalCache: function(selector, single, cache){
		    if(cache.selector && cache.selector == selector){
		        cache.rules.push(single);
		    }else{
		        cache.selector = selector;
		        cache.rules = [single];
		    }
		},
		// Init elem verify
		initElemsVerify: function(selector, rules){
		    // Resolve rules
		    var _this = this, localCache = [], globalCache = {};
		    
		    // String
		    if(_mode.isString(rules)){
		        rules = rules.split(' ');
		        for(var i = 0, len = rules.length; i < len; i++){
		            var single = _this.resolveStringRules(rules[i]);
		            // Cache lacal verify
		            localCache.push(single);
		            // Cache global verify
		            _this.spliceGlobalCache(selector, single, globalCache);
		        }
		    }
		    // Object
		    else if(_mode.isPlainObject(rules)){
		        var single = _this.resolveObjectRules(rules);
		        // Save lacal verify
		        localCache.push(single);
	            // Save global verify
	            _this.spliceGlobalCache(selector, single, globalCache);
		    }
		    // Array
		    else if(_mode.isArray(rules)){
		        for(var i = 0, len = rules.length; i < len; i++){
		            var single;
		            //  string
		            if(_mode.isString(rules[i])){
		                single = _this.resolveStringRules(rules[i]);
		            }
		            // object
		            else if(_mode.isPlainObject(rules[i])){
		                single = _this.resolveObjectRules(rules[i]);
		            }
		            // Cache lacal verify
		            localCache.push(single);
		            // Cache global verify
		            _this.spliceGlobalCache(selector, single, globalCache);
		        }
		    }
		    
		    _this.globalCaches.push(globalCache);
		    
		    // Init verify event
		    var elem = $(selector);
		    
		    // Text & password & textarea
		    if(elem.is(':text') || elem.is(':password') || elem.is('textarea')){
		    	elem.on('blur.verify', function(){
		    		for(var i = 0, len = localCache.length; i < len; i++){
		                var flag = _this.verifyText(this, localCache[i]);
		                if(!flag){
		                    break;
		                }
		            }
		    	});
		    }
		    // Radio & checkbox
		    else if(elem.is(':radio') || elem.is(':checkbox')){
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
		// Perform the global verify
		verifyAllElems: function(selector){
		    var _this = this, form = $(selector || 'body'), flag = true;
		    
		    for(var index = 0, total = _this.globalCaches.length; index < total; index++){
		        var json = this.globalCaches[index], elem = $(json.selector, form);
		        if(elem.length > 0){
		        	// Text & password & textarea
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
		            // Radio & checkbox
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
		// Verify value
		verifyText: function(elem, json){
		    var flag = true, errorStyle = this.errorStyle.text;
		    
		    elem = $(elem);
		    
		    // Return if elem has verify-disabled
		    if(elem.attr('verify-disabled')){
		        elem.parent().removeAttr('title').removeClass(errorStyle);
		        return flag;
		    }
		    
		    // Verify by regex
		    if(_mode.isRegex(json.rule)){
		    	var val = $.trim(elem.val());
		        // Value is empty
		        if(val == ''){
		            if(json.name === 'required'){
		                flag = json.rule.test(val);
		            }
		        }
		        // Value is not empty
		        else{
		            flag = json.rule.test(val);
		        }
		    }
		    // Verify by function
		    else if(_mode.isFunction(json.rule)){
		        flag = json.rule(elem);
		    }
		    
			if(flag){
				// Remove title & class
		        elem.parent().removeAttr('title').removeClass(errorStyle);
		    }else{
		        // Add title & class
		        elem.parent().attr('title', json.tips).addClass(errorStyle);
		    }
		    
		    return flag;
		},
		// Verify check
		verifyCheck: function(elem, json){
		    var flag = true, errorStyle = this.errorStyle.box;
		    
		    // Return if elem has verify-disabled
		    if(elem.attr('verify-disabled')){
		        elem.removeAttr('title').removeClass(errorStyle);
		        return flag;
		    }
		    
		    // Verify by regex
		    if(_mode.isRegex(json.rule)){
				
		    }
		    // Verify bu function
		    else if(_mode.isFunction(json.rule)){
		        flag = json.rule(elem);
		    }
		    
		    if(flag){
				// Remove title & class
		        elem.removeAttr('title').removeClass(errorStyle);
		    }else{
		        // Add title & class
		        elem.attr('title', json.tips).addClass(errorStyle);
		    }
		    
		    return flag;
		},
		// Init or perform verify
		verify: function(){
			var selector = arguments[0], rules = arguments[1];
			if(rules){
				// Init elem verify
	            this.initElemsVerify(selector, rules);
			}else{
				// Perform the global verify
		        return this.verifyAllElems(selector);
			}
		},
		// Disable verify
		verifyDisable: function(selector){
		    if(!selector){
		        return false;
		    }
		    
		    $(selector).attr('verify-disabled', true);
		    
		    this.deleteVerifyStyle(selector);
		},
		// Enable verify
		verifyEnable: function(selector){
		    if(!selector){
		        return false;
		    }
		    
		    $(selector).removeAttr('verify-disabled');
		},
		// Remove title & class
		deleteVerifyStyle: function(selector){
			var _this = this;
			
		    if(!selector){
		        return false;
		    }
		    
		    $(selector).each(function(){
		        var elem = $(this);
		        
		        // Text & password & textarea
		        if(elem.is(':text') || elem.is(':password') || elem.is('textarea')){
		            elem.parent().removeAttr('title').removeClass(_this.errorStyle.text);
		        }
		        // Radio & checkbox
		        else if(elem.is(':radio') || elem.is('checkbox')){
		            elem.removeAttr('title').removeClass(_this.errorStyle.box);
		        }
		    });
		}
	};
	
	// Add rules to the default rules base
	_vQuery.addRules(_rules);
	
	// Extend jQuery
	$.extend(_vQuery);
	
	// $.fn.verify
	$.fn.verify = function(rules){
		var selector = this.selector;
		
		if(rules){
			_vQuery.verify(selector, rules);
		}else{
			return _vQuery.verify(selector);
		}
	};
	
	// $.fn.verifyDisable
	$.fn.verifyDisable = function(flag){
		var selector = this.selector;
		
		if(flag){
			_vQuery.verifyDisable(selector);
		}else{
			_vQuery.verifyEnable(selector);
		}
	};
	
	// $.fn.verifyEnable
	$.fn.verifyEnable = function(flag){
		var selector = this.selector;
		
		if(flag){
			_vQuery.verifyEnable(selector);
		}else{
			_vQuery.verifyDisable(selector);
		}
	};
	
})(jQuery);