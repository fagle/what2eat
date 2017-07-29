/**
 * jQuery Cookie Plugin v1.4.0
 * https://github.com/carhartl/jquery-cookie
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
**/
(function(factory){
	if(typeof define === 'function' && define.amd){
		// AMD. Register as anonymous module.
		define(['jquery'], factory);
	}else{
		// Browser globals.
		factory(jQuery);
	}
}(function($){
	var pluses = /\+/g;
	
	function encode(s){
		return config.raw ? s : encodeURIComponent(s);
	}
	
	function decode(s){
		return config.raw ? s : decodeURIComponent(s);
	}
	
	function stringifyCookieValue(value){
		return encode(config.json ? JSON.stringify(value) : String(value));
	}
	
	function parseCookieValue(s){
		if (s.indexOf('"') === 0){
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}
		
		try{
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
		}catch(e){
			return;
		}
		
		try{
			// If we can't parse the cookie, ignore it, it's unusable.
			return config.json ? JSON.parse(s) : s;
		}catch(e){}
	}
	
	function read(s, converter){
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}
	
	var config = $.cookie = function(key, value, options){
		// Write
		if(value !== undefined && !$.isFunction(value)){
			options = $.extend({}, config.defaults, options);

			if(typeof options.expires === 'number'){
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}
			
			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}
		
		// Read
		var result = key ? undefined : {};
		
		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for(var i = 0, l = cookies.length; i < l; i++){
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if(key && key === name){
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}
			
			// Prevent storing a cookie that we couldn't decode.
			if(!key && (cookie = read(cookie)) !== undefined){
				result[name] = cookie;
			}
		}
		
		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options){
		if($.cookie(key) !== undefined){
			// Must not alter options, thus extending a fresh object...
			$.cookie(key, '', $.extend({}, options, { expires: -1 }));
			return true;
		}
		return false;
	};
}));

/**
 * Author: dingwei 2014-06-27
 * Description: jQuery.datagrid.js
 * Modified by: 
 * Modified contents: 
**/
(function(w, $){
	/**
	 * jQuery 1.9 support. browser object has been removed in 1.9 
	**/
	var browser = $.browser;
	
	if(!browser){
		function uaMatch(ua){
			ua = ua.toLowerCase();
			
			var match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
			
			return {
				browser: match[1] || '',
				version: match[2] || '0'
			};
		};

		var matched = uaMatch(navigator.userAgent);
		
		browser = {};
		
		if(matched.browser){
			browser[matched.browser] = true;
			browser.version = matched.version;
		}
		
		// Chrome is Webkit, but Webkit is also Safari.
		if(browser.chrome){
			browser.webkit = true;
		}else if(browser.webkit){
			browser.safari = true;
		}
	}
	
	var
	// 
	wp = w.location.pathname,
	// 
	globalSpace = wp.slice(0, wp.indexOf('.')) + '/',
	// Save a reference to some core methods
	_toString = Object.prototype.toString, _hasOwnProperty = Object.prototype.hasOwnProperty,
	// 
	_mode = {
		isIe6: !-[1,] && !window.XMLHttpRequest,
		getType: function(obj){
			return obj && _toString.call(obj);
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
		isBoolean: function(flag){
			return this.getType(flag) === '[object Boolean]';
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
		    for(key in obj){
		    	
		    }
		    return key === undefined || _hasOwnProperty.call(obj, key);
		},
		isEmptyObject: function(obj){
			for(var key in obj){
		        return false;
		    }
		    return true;
		},
		clone: function(obj){
			var n = this.isArray(obj) ? [] : {};
		    for(var key in obj){
		        if(obj.hasOwnProperty(key)){
		            n[key] = this.isPlainObject(obj[key]) ? this.clone(obj[key]) : obj[key];
		        }
		    }
		    return n;
		}
	};
	
	$.drawgrid = function(t, o){
		if(t.datagrid){
			return false;
		}
		
		var tid = t.id;
		
		if(!tid){
			return t;
		}
		
		// 
		o = $.extend({
			width: 'auto',
			height: 200,
			resizable: false,
			widthResizable: true,
			heightResizable: true,
			colMinWidth: 30,
            colResizable: true,
            colMovable: true,
			striped: true,
			nowrap: true,
			addTitleToCell: true,
			multiSelect: false,
			columns: null,
			action: null,
			url: false,
			type: 'POST',
			params: null,
			dataType: 'json',
			loadingTips: '正在加载',
			noDataTips: '未查询到匹配数据',
			sortField: null,
			sortType: 'asc',
			rowIdProperty: '',
			usePage: false,
			showDataTotal: true,
			useMean: true,
			meanOptions: [25, 50, 75, 100],
			mean: 25,
			preProcessData: null,
            extendCell: {
            	all: function(val, row){
            		
            	}
            },
            factory: {
                extendColumn: function(val, row, field, o){
                    var fn = o.extendCell[field];
                    return _mode.isFunction(fn) ? fn(val, row) : val;
                }
            },
			onRowClick: null,
			onRowDblclick: null,
			onError: null,
			onComplete: null,
            extendGridClass: function(g){
                return g;
            }
		}, o);
		
		// 
		var g = {
			scroll: function(){
				this.head.get(0).scrollLeft = this.bodyInner.get(0).scrollLeft;
				this.setDragerPosition();
			},
			dgwidth: 5,
			dgheight: 0,
			fixHeight: function(){
				var h = { box: this.box.outerHeight(), head: this.head.outerHeight(), body: this.body.outerHeight() };
				
				this.load.css({ 'top': h.head, 'height': o.height, 'line-height': o.height + 'px' });
				
				g.dgheight = h.head + h.body;
				this.drag.find('div').each(function(){
					$(this).css({ 'width': g.dgwidth, 'height': g.dgheight });
				});
				
				/*
				// 
				if(o.height != 'auto' && o.resizable && o.widthResizable){
					$(this.widthResizer).css({ 'height': hBox });
				}
				*/
			},
			cellPadding: 0,
			setDragerPosition: function(){
				var top = this.head.position().top, ths = this.head.find('th:visible'), scrollLeft = this.head.scrollLeft(), offsetLeft = -scrollLeft, cellPadding = this.cellPadding;
				offsetLeft -= Math.ceil(g.dgwidth / 2);
				g.drag.css('top', top).find('div').css('display', 'none');
				ths.each(function(i){
					var cellWidth = $(this).find('div').width();
					cellWidth = cellWidth + cellPadding + offsetLeft;
					if(isNaN(cellWidth)){
						cellWidth = 0;
					}
					g.drag.find('div').eq(i).css({ 'left': cellWidth, 'display': 'block' });
					offsetLeft = cellWidth;
				});
			},
			addCellProp: function(){
				var ths = this.head.find('th'), trs = this.body.find('tr');
				for(var i = 0, trsLen = trs.length; i < trsLen; i++){
					var tr = trs.eq(i), tds = tr.find('td');
					if(o.striped && (i % 2)){
						tr.addClass('odd');
					}
					for(var j = 0, tdsLen = tds.length; j < tdsLen; j++){
						var th = ths.eq(j), td = tds.eq(j), div = $('<div></div>');
						if(th.length > 0){
							if(o.sortField && th.attr('sort') == o.sortField){
								td.addClass('sort');
							}
							if(th.attr('hidden')){
								td.css('display', 'none');
							}
							div.addClass('ui-datagrid-cell').css({ 'width': th.find('div:first').width(), 'textAlign': th.attr('align') });
						}
						if(o.nowrap == false){
							div.css('white-space', 'normal');
						}
						div.html(td.html());
						td.html(div);
						if(o.addTitleToCell){
							this.addTitleToCell(th.attr('column'), div);
						}
					}
				}
			},
			addTitleToCell: function(type, div){
				if(type == 'field'){
					div.attr('title', div.text());
				}
			},
			rowSelector: 'tr',
			selectBtnSelector: ':checkbox[button="select"]',
			actionBtnSelector: 'label[button="action"]',
			addGridProp: function(){
				if(o.multiSelect){
					g.head.find('table').off('click.select').on('click.select', g.selectBtnSelector, function(e){
						var flag = $(this).attr('checked') ? true : false, checkboxs = g.body.find(g.selectBtnSelector).filter(':enabled');
						for(var i = 0, len = checkboxs.length; i < len; i++){
							checkboxs.eq(i).attr('checked', flag).parents('tr:first')[flag ? 'addClass' : 'removeClass']('selected');
						}
						if(_mode.isFunction(o.onAllSelect)){
							var rows = [], checkeds = checkboxs.filter(':checked');
							for(var i = 0, len = checkeds.length; i < len; i++){
								var row = null;
								if(g.data && g.data.rows){
									var checked = checkeds.eq(i), idx = checked.attr('data-index');
									row = g.data.rows[idx];
								}
								rows.push({ elem: checkeds.get(i), row: row });
							}
							o.onAllSelect(flag, rows);
						}
						e.stopPropagation();
					});
				}
				
				g.body.find('table').off('click.row').on('click.row', g.rowSelector, function(e){
					if(o.multiSelect == false){
						$(this).addClass('selected').siblings().removeClass('selected');
					}
					if(_mode.isFunction(o.onRowClick)){
						var idx = $(this).attr('data-index'), row = null;
						if(g.data && g.data.rows){
							row = g.data.rows[idx];
						}
						o.onRowClick({ elem: this, row: row });
					}
					e.stopPropagation();
				})
				.off('dblclick.row').on('dblclick.row', g.rowSelector, function(e){
					if(_mode.isFunction(o.onRowDblclick)){
						var idx = $(this).attr('data-index'), row = null;
						if(g.data && g.data.rows){
							row = g.data.rows[idx];
						}
						o.onRowDblclick({ elem: this, row: row });
					}
					e.stopPropagation();
				})
				.off('click.select').on('click.select', g.selectBtnSelector, function(e){
					var flag = $(this).attr('checked') ? true : false;
					$(this).parents('tr:first')[flag ? 'addClass' : 'removeClass']('selected');
					
					var checkboxs = g.body.find(g.selectBtnSelector).filter(':enabled'), checkeds = checkboxs.filter(':checked');
					g.head.find(g.selectBtnSelector).attr('checked', checkboxs.length == checkeds.length);
					
					if(_mode.isFunction(o.onRowSelect)){
						var row = null;
						if(g.data && g.data.rows){
							var idx = $(this).attr('data-index');
							row = g.data.rows[idx];
						}
						o.onRowSelect(flag, { elem: this, row: row });
					}
					e.stopPropagation();
				})
				.off('click.action').on('click.action', g.actionBtnSelector, function(e){
					if(o.action && o.action.buttons){
						var i = $(this).attr('button-index'), fn = o.action.buttons[i].onClick;
						if(_mode.isFunction(fn) && !$(this).attr('disabled')){
							var elem = $(this).parents('tr:first').get(0), row = null;
							if(g.data && g.data.rows){
								var j = $(this).attr('data-index');
								row = g.data.rows[j];
							}
							fn({ elem: elem, row: row });
						}
					}
					e.stopPropagation();
				});
			},
			data: null,
			total: 0,
			page: 1,
			pages: 1,
			newPage: null,
			doSearch: function(params){
				o.params = $.extend(o.params, params);
				this.newPage = 1;
				this.populate();
			},
			changeSort: function(th){
				if(this.isLoading){
					return false;
				}
				th = $(th);
				if(th.attr('sort') == o.sortField){
					o.sortType = (o.sortType == 'asc') ? 'desc' : 'asc';
				}
				o.sortField = th.attr('sort');
				th.addClass('sort').siblings().removeClass('sort');
				this.head.find('div').removeClass('asc desc');
				th.find('div').addClass(o.sortType);
				this.populate();
			},
			changePage: function(type){
				if(this.isLoading){
					return false;
				}
				switch(type){
					case 'first':
						this.newPage = 1;
						break;
					case 'prev':
						if(this.page > 1){
							this.newPage = parseInt(this.page, 10) - 1;
						}
						break;
					case 'next':
						if(this.page < this.pages){
							this.newPage = parseInt(this.page, 10) + 1;
						}
						break;
					case 'last':
						this.newPage = this.pages;
						break;
					case 'jump':
						var num = parseInt($('.page', this.page).val(), 10);
						if(isNaN(num)){
							num = 1;
						}
						if(num < 1){
							num = 1;
						}else if(num > this.pages){
							num = this.pages;
						}
						$('.page', this.foot).val(num);
						this.newPage = num;
						break;
				}
				this.populate();
			},
			populate: function(){
				if(this.isLoading){
					return false;
				}
				this.isLoading = true;
				if(o.multiSelect){
					this.cleanMultiSelectBtn();
				}
				this.body.after(this.load.html('<span class="loading">' + o.loadingTips + ' </span>'));
				if(!this.newPage){
					this.newPage = 1;
				}
				var url = _mode.isFunction(o.url) ? o.url() : o.url;
				var params = $.extend({ 'newPage': this.newPage, 'mean': o.mean, 'sortField': o.sortField, 'sortType': o.sortType }, _mode.isFunction(o.url) ? o.params() : o.params);
				$.ajax({
					type: o.type,
					url: url,
					data: params,
					dataType: o.dataType,
					success: function(data){
						g.addData(data);
					},
					error: function(XMLHttpRequest, textStatus, errorThrown){
						try{
							if(_mode.isFunction(o.onError)){
								o.onError(XMLHttpRequest, textStatus, errorThrown);
							}
						}catch(e){  }
					}
				});
			},
			cleanMultiSelectBtn: function(){
				$(':checkbox[button="select"]', this.head).attr('checked', false);
			},
			addData: function(data){
				if(!data){
                    if(_mode.isFunction(o.onComplete)){
                    	o.onComplete(data);
                    }
					return false;
				}
				
				if(_mode.isFunction(o.preProcessData)){
					data = o.preProcessData(data);
				}
				
				data = $.extend({ total: 0, page: 1, rows: [] }, data);
				
				this.data = data;
				this.total = data.total;
				this.page = data.page;
				this.pages = Math.ceil(this.total / o.mean);
				
				if(this.total == 0){
					$(t).empty();
					this.load.html('<span class="nothing">' + o.noDataTips + '</span>');
					this.page = 1;
					this.pages = 1;
					this.setPager();
                    if(_mode.isFunction(o.onComplete)){
                    	o.onComplete(this.data);
                    }
					this.isLoading = false;
					return false;
				}
				
				this.setPager();
				
				if(this.data.rows){
					var rows = this.data.rows, ths = this.head.find('th'), tbody = [];
					tbody.push('<tbody>');
					for(var i = 0, rowsLen = rows.length; i < rowsLen; i++){
						var row = rows[i], rowId = row[o.rowIdProperty], rowStyle = row.style;
						tbody.push('<tr id="' + (rowId == undefined ? '' : rowId) + '" class="' + (rowStyle == undefined ? '' : row.style) + '" data-index="' + i + '">');
						for(var j = 0, thsLen = ths.length; j < thsLen; j++){
							var th = ths.eq(j);
							tbody.push('<td align="' + th.attr('align') + '">');
							var colType = th.attr('column');
							// 插入复选列
							if(colType == 'select'){
								var checked = row.checked == true ? ' checked="checked"' : '', disabled = row.disabled == true ? ' disabled="disabled"' : '';
								tbody.push('<input type="checkbox" class="ui-datagrid-checkbox"' + checked + disabled + ' button="select" data-index="' + i + '" />');
							}
							// 插入字段列
							else if(colType == 'field'){
								var idx = th.attr('axis'), field = o.columns[idx].field, val = '', cols = row.cols;
								if(_mode.isArray(cols)){
                                    val = cols[idx];
                                }
                                else if(_mode.isPlainObject(cols)){
                                    val = cols[field];
                                }
                                val = o.factory.extendColumn(val, row, field, o);
                                tbody.push(val);
							}
							// 插入操作列
							else if(colType == 'action'){
								var buttons = o.action.buttons;
								for(var k = 0, btnsLen = buttons.length; k < btnsLen; k++){
									var button = buttons[k];
									if(button){
										var cls = 'ui-datagrid-link mr5', disabled = '', flag = false, fn = button.isDisabled;
										if(_mode.isFunction(fn)){
											flag = fn(row);
										}
										else if(_mode.isBoolean(fn)){
											flag = fn;
										}
										if(flag){
											cls += ' ui-datagrid-link-disabled';
											disabled = ' disabled="disabled"';
										}
										tbody.push('<label class="' + cls + '"' + disabled + ' title="' + button.display + '" button="action" data-index="' + i + '" button-index="' + k + '">' + button.display + '</label>');
									}
								}
							}
							tbody.push('</td>');
						}
						tbody.push('</tr>');
					}
					tbody.push('</tbody>');
					$(t).html(tbody.join(''));
				}
				
				this.addCellProp();
				this.addGridProp();
				
				this.scroll();
				
				g.load.remove();
				
				if(_mode.isFunction(o.onComplete)){
					o.onComplete(this.data);
				}
				
				this.isLoading = false;
			},
			// 
			setPager: function(){
				if(o.showDataTotal){
					this.foot.find('.ui-datagrid-foot-total span').text(this.total);
				}
				this.foot.find('.page').val(this.page);
				this.foot.find('.pages').text(this.pages);
			},
			// 拖动开始
			dragStart: function(e, obj, type){
                if(type == 'colResize' && o.colResizable == true){
					var index = $('div', this.drag).index(obj), width = $('th:visible div:eq(' + index + ')', this.head).width();
					// 设置线条样式
					$(obj).addClass('drag').siblings().css('display', 'none');
					$(obj).prev().addClass('drag').css('display', 'block');
					// 记录坐标等相关数据
					this.colResizeData = {
						startX: e.pageX,
						index: index,
						left: parseInt(obj.style.left, 10),
						width: width
					};
					// 设置body区鼠标样式
					$('body').css('cursor', 'col-resize');
				}
				// 禁止浏览器默认的文本选中功能
				$('body').noSelect();
			},
			// 拖动时
			dragMove: function(e){
				if(this.colResizeData){
					var index = this.colResizeData.index;
					var diff = e.pageX - this.colResizeData.startX;
					var nLeft = this.colResizeData.left + diff;
					var nw = this.colResizeData.width + diff;
					if(nw > o.colMinWidth){
						$('div:eq(' + index + ')', this.drag).css('left', nLeft);
						this.colResizeData.nw = nw;
					}
				}
			},
			// 拖动结束
			dragEnd: function(){
				if(this.colResizeData){
					var index = this.colResizeData.index, nw = this.colResizeData.nw;
					$('th:visible div:eq(' + index + ')', this.head).width(nw);
					$('tr', this.body).each(function(){
						$('td:visible div:eq(' + index + ')', this).width(nw);
					});
					$('.drag', this.drag).removeClass('drag');
					$('div:eq(' + index + ')', this.drag).siblings().css('display', 'block');
					
					this.scroll();
					this.fixHeight();
					
					this.colResizeData = false;
					
					// 缓存列宽
					if($.cookie){
						var th = $('th:visible:eq(' + index + ')', this.head), colName = th.attr('name');
						if(colName){
							$.cookie(globalSpace + tid + '/colwidths/' + colName, nw);
						}
					}
				}
				// 恢复body区鼠标样式
				$('body').css('cursor', 'default');
				// 恢复浏览器默认的文本选中功能
				$('body').noSelect(false);
			}
		};
		
		// 填充表头
		if(o.columns){
			var thead = [];
			thead.push('<thead>');
			thead.push('<tr>');
			// 复选列列头
			if(o.multiSelect){
				var wSelectCol = 20;
				if($.cookie){
					var src = globalSpace + tid + '/colwidths/select';
					if($.cookie(src) != undefined){
						wSelectCol = $.cookie(src);
					}
				}
				thead.push('<th width="' + wSelectCol + '" align="center" name="select" column="select"><input type="checkbox" class="ui-datagrid-checkbox" button="select" /></th>');
			}
			// 字段列列头
			var columns = o.columns;
			for(var i = 0, len = columns.length; i < len; i++){
				var column = columns[i];
				if(column){
					if($.cookie){
						var src = globalSpace + tid + '/colwidths/' + column.field;
						if($.cookie(src) != undefined){
							column.width = $.cookie(src);
						}
					}
					var hidden = '';
					if(column.hidden){
						hidden = ' hidden="true"';
					}
					var sort = '';
					if(column.field && column.sortable){
						sort = ' sort="' + column.field + '"';
					}
					thead.push('<th width="' + (column.width || 100) + '" align="' + (column.align || 'left') + '"' + hidden + sort + ' name="' + column.field + '" column="field" axis="' + i + '">' + column.display + '</th>');
				}
			}
			// 操作列列头
			if(o.action){
				var column = o.action;
				if($.cookie){
					var src = globalSpace + tid + '/colwidths/action';
					if($.cookie(src) != undefined){
						column.width = $.cookie(src);
					}
				}
				thead.push('<th width="' + (column.width || 100) + '" align="' + (column.align || 'left') + '" name="action" column="action">' + column.display + '</th>');
			}
			thead.push('</tr>');
			thead.push('</thead>');
			$(t).prepend(thead.join(''));
		}
		
		g = o.extendGridClass(g);
		
		g.box = $('<div></div>');
		g.head = $('<div></div>');
		g.body = $('<div></div>');
		g.foot = $('<div></div>');
		g.drag = $('<div></div>');
		g.load = $('<div></div>');
		
		// 创建全局容器
		g.box.addClass('ui-datagrid').css('width', o.width);
		$(t).before(g.box);
		g.box.append(t);
		
		// 创建表头
		g.head.addClass('ui-datagrid-head clearfix').html('<div class="ui-datagrid-head-inner"><table></table></div>');
		$(t).before(g.head);
		var thead = $('thead', t);
		if(thead.length > 0){
			g.head.find('table').append(thead);
		}
		var ths = g.head.find('th');
		for(var i = 0, len = ths.length; i < len; i++){
			var th = ths.eq(i), sort = th.attr('sort'), div = $('<div></div>');
			if(sort){
				if(sort == o.sortField){
					th.addClass('sort');
					div.addClass(o.sortType);
				}
				th.click(function(){
					g.changeSort(this);
				});
			}
			th.attr('width', th.attr('width') || 100);
			th.attr('align', th.attr('align') || 'left');
			if(th.attr('hidden')){
				th.css('display', 'none');
			}
			if(!o.columns){
				th.attr('axis', i);
			}
			div.addClass('ui-datagrid-cell').css({ 'width': th.attr('width'), 'textAlign': th.attr('align') }).html(th.html());
			th.empty().removeAttr('width').append(div).mousedown(function(e){
				/*
				g.dragStart('colMovable', e, this);
				*/
			}).hover(function(e){
				var sortField = $(this).attr('sort');
				if(sortField && sortField != o.sortField){
					$(this).find('div').addClass(o.sortType);
				}else if(sortField && sortField == o.sortField){
					var type = (o.sortType == 'asc') ? 'desc' : 'asc';
					$(this).find('div').removeClass(o.sortType).addClass(type);
				}
			}, function(e){
				var sortField = $(this).attr('sort');
				if(sortField != o.sortField){
					$(this).find('div').removeClass(o.sortType);
				}else if(sortField && sortField == o.sortField){
					var cls = o.sortType == 'asc' ? 'desc' : 'asc';
					$(this).find('div').addClass(o.sortType).removeClass(cls);
				}
			});
		}
		
		// 
		g.bodyInner = $('<div></div>');
		g.bodyInner.addClass('ui-datagrid-body-inner').css('height', o.height).append(t).scroll(function(){
			g.scroll();
		});
		g.body.addClass('ui-datagrid-body').append(g.bodyInner);
		g.box.append(g.body);
		
		// 
        if(o.colResizable){
        	var ths = g.head.find('th');
        	if(ths.length > 0){
        		var th = ths.eq(0);
        		g.cellPadding = 0;
        		g.cellPadding += (isNaN(parseInt(th.find('div').css('borderLeftWidth'), 10)) ? 0 : parseInt(th.find('div').css('borderLeftWidth'), 10));
        		g.cellPadding += (isNaN(parseInt(th.find('div').css('borderRightWidth'), 10)) ? 0 : parseInt(th.find('div').css('borderRightWidth'), 10));
                g.cellPadding += (isNaN(parseInt(th.find('div').css('paddingLeft'), 10)) ? 0 : parseInt(th.find('div').css('paddingLeft'), 10));
                g.cellPadding += (isNaN(parseInt(th.find('div').css('paddingRight'), 10)) ? 0 : parseInt(th.find('div').css('paddingRight'), 10));
                g.cellPadding += (isNaN(parseInt(th.css('borderLeftWidth'), 10)) ? 0 : parseInt(th.css('borderLeftWidth'), 10));
                g.cellPadding += (isNaN(parseInt(th.css('borderRightWidth'), 10)) ? 0 : parseInt(th.css('borderRightWidth'), 10));
                g.cellPadding += (isNaN(parseInt(th.css('paddingLeft'), 10)) ? 0 : parseInt(th.css('paddingLeft'), 10));
                g.cellPadding += (isNaN(parseInt(th.css('paddingRight'), 10)) ? 0 : parseInt(th.css('paddingRight'), 10));
                ths.each(function(){
                    var dg = $('<div></div>');
                    dg.mousedown(function(e){
                        g.dragStart(e, this, 'colResize');
                    }).dblclick(function(e){
                    	/*
                        g.autoResizeColumn(this);
                        */
                    });
                    /*
                    if(_mode.isIe6){
                        dg.hover(function(){
                            $(this).addClass('hover');
                        }, function(){
                            $(this).removeClass('hover');
                        });
                    }
                    */
                    g.drag.append(dg);
                });
                g.drag.addClass('ui-datagrid-drag');
                g.box.append(g.drag);
        	}
        }
		
		// 创建遮罩层
		g.load.addClass('ui-datagrid-load').html('<span class="loading">' + o.loadingTips + ' </span>');
		
		// 创建分页栏
		if(o.usePage){
			var foot = [];
			if(o.showDataTotal){
				foot.push('<div class="ui-datagrid-foot-total">共<span>0</span>条</div>');
			}
			foot.push('<div class="ui-datagrid-foot-buttons">');
			foot.push('<div class="group"><div class="ui-datagrid-foot-button first" title="首页"></div><div class="ui-datagrid-foot-button prev" title="上一页"></div></div>');
			foot.push('<div class="group"><div class="current"><label class="label">第</label><input type="text" class="page" value="1" /><label class="label">页</label></div><div class="total"><label class="label">共</label><label class="pages">1</label><label class="label">页</label></div></div>');
			foot.push('<div class="group"><div class="ui-datagrid-foot-button next" title="下一页"></div><div class="ui-datagrid-foot-button last" title="尾页"></div></div>');
			foot.push('<div class="group"><div class="ui-datagrid-foot-button refresh" title="刷新"></div></div>');
			if(o.useMean){
				var options = [], selected = '';
				for(var i = 0, len = o.meanOptions.length; i < len; i++){
					var option = o.meanOptions[i];
					selected = (option == o.mean) ? ' selected="selected"' : '';
					options.push('<option value="'  + option + '"' + selected + '>' + option + '</option>');
				}
				foot.push('<div class="group"><select name="mean" class="mean">' + options.join('') + '</select></div>');
			}
			foot.push('</div>');
			g.foot.addClass('ui-datagrid-foot').html(foot.join(''));
			$('.first', g.foot).click(function(){
				g.changePage('first');
			});
			$('.prev', g.foot).click(function(){
				g.changePage('prev');
			});
			$('.page', g.foot).keydown(function(e){
				if(e.keyCode == 13){
                    g.changePage('jump');
				}
			});
			$('.next', g.foot).click(function(){
				g.changePage('next');
			});
			$('.last', g.foot).click(function(){
				g.changePage('last');
			});
			$('.refresh', g.foot).click(function(){
				g.populate();
			});
			$('select', g.foot).change(function(){
				o.newPage = 1;
				o.mean = $(this).val();
				g.populate();
			});
			g.box.append(g.foot);
		}
		
		g.fixHeight();
		g.setDragerPosition();
		
		// Add document events
		$(document).mousemove(function(e){
			g.dragMove(e);
		}).mouseup(function(e){
			g.dragEnd();
		}).hover(function(){
			
		}, function(){
			g.dragEnd();
		});
		
		t.o = o;
		t.g = g;
		t.datagrid = 1;
		
		if(o.url){
			g.populate();
		}
		
		return t;
	};
	
	var docReady = false;
	
	$(function(){
		docReady = true;
	});
	
	$.fn.datagrid = function(o){
		return this.each(function(){
			var _this = this;
			if(!docReady){
				$(function(){
					$.drawgrid(_this, o);
				});
			}else{
				$.drawgrid(_this, o);
			}
		});
	};
	
	$.fn.gridSearch = function(params){
		return this.each(function(){
			if(this.o && this.g){
				this.g.doSearch(params);
			}
		});
	};
	
	$.fn.gridRefresh = function(){
		return this.each(function(){
			if(this.o && this.g){
				this.g.populate();
			}
		});
	};
	
	$.fn.hideColumn = function(field, bool){
		return this.each(function(){
			if(this.g){
				this.g.hideColumn(field, bool);
			}
		});
	};
	
	$.fn.addData = function(data){
		return this.each(function(){
			if(this.g){
				this.g.addData(data);
			}
		});
	};

    $.fn.getSelectedRows = function(){
    	var rows = [];
    	if(this.length == 0){
    		return rows;
    	}
    	var g = this.get(0).g;
		this.eq(0).find('tr.selected').each(function(){
			var row = null;
			if(g){
				var idx = $(this).attr('data-index');
				row = g.data.rows[idx];
			}
			rows.push({ elem: this, row: row });
		});
		return rows;
    };
    
    // 禁止文本选中
    $.fn.noSelect = function(flag){
		flag = (flag === undefined) ? true : flag;
		
		if(flag){
			return this.each(function(){
				if(browser.msie || browser.safari){
					$(this).bind('selectstart', function(){
						return false;
					});
				}
				else if(browser.mozilla){
					$(this).css('MozUserSelect', 'none');
					$('body').trigger('focus');
				}
				else if(browser.opera){
					$(this).bind('mousedown', function(){
						return false;
					});
				}
				else{
					$(this).attr('unselectable', 'on');
				}
			});
		}else{
			return this.each(function(){
				if(browser.msie || browser.safari){
					$(this).unbind('selectstart');
				}
				else if(browser.mozilla){
					$(this).css('MozUserSelect', 'inherit');
				}
				else if(browser.opera){
					$(this).unbind('mousedown');
				}
				else{
					$(this).removeAttr('unselectable', 'on');
				}
			});
		}
	};
	
})(window, jQuery);