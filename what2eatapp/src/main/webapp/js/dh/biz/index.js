
var menu = {
	box: null,
	init: function(o){
		this.box = $('#' + o.id);
		this.addHtml(o.nodes);
		this.addEvents();
	},
	addHtml: function(nodes){
		this.box.append(this.getHtmlByNodes(nodes));
	},
	getHtmlByNodes: function(nodes, grade, high){
		var html = [], level = grade || 0;
		
		html.push('<ul class="grade' + level + '">');
		for(var i = 0, len = nodes.length; i < len; i++){
			var node = nodes[i];
			if(node){
				high = level == 0 ? '' : high;
				high = high || node.display;
				
				html.push('<li' + (level == 0 ? ' class="c' + (i % 8) + '"' : '') + '>');
				var
				attrId = node.id ? (' id="' + node.id + '"') : '',
				attrDataHref = node.href ? (' data-href="' + node.href + '"') : '',
				attrDataTarget = node.target ? (' data-target="' + node.target + '"') : '',
				attrDataTabId = node.id && node.target && node.target == '_tab' ? (' data-tab-id="_tab' + node.id + '"') : '',
				attrDataHigh = high ? (' data-high="' + high + '"') : '';
				html.push('<a' + attrId + attrDataHref + attrDataTarget + attrDataTabId + attrDataHigh + '><em>' + node.display + '</em>' + (node.child ? '<i></i>' : '') + '</a>');
				if(node.child){
					html.push(this.getHtmlByNodes(node.child, level + 1, high));
				}
				html.push('</li>');
			}
		}
		html.push('</ul>');
		
		return html.join('');
	},
	addEvents: function(){
		var _this = this;
		_this.box.on('click.a', 'a', function(){
			var a = $(this), href = a.attr('data-href'), target = a.attr('data-target'), tabId = a.attr('data-tab-id'), text = a.text();
			if(href){
				switch(target){
					case '_tab':
						tabs.add({ id: tabId, pid: '', url: href, display: text });
						break;
					case '_blank':
						window.open(href, text);
						break;
				}
			}else{
				var p = a.parents('ul').eq(0), n = a.next();
				if(n.is(':visible')){
					a.removeClass('on');
		            		n.css('display', 'none');
		        		}else{
		        			p.children('li').children('a').removeClass('on');
		        			p.children('li').children('ul').css('display', 'none');
		            		a.addClass('on');
		            		n.css('display', 'block');
		        		}
			}
			_this.box.find('a').removeClass('cf60');
			a.addClass('cf60');
		});
	}
};

$(function(){
	// 初始化应用菜单
	menu.init({ id: 'menu', nodes: nodes });
	
	// 应用菜单收起与展开
	var
	oSide = $('#side'),
	oMain = $('#main'),
	btnCollapseSide = $('#btnCollapseSide'),
	btnExpandSide = $('#btnExpandSide');
	btnCollapseSide.click(function(){
		oSide.css('left', -180);
		oMain.css('margin-left', 41);
		$('#btnExpandSide').css('display',  'block');
	});
	btnExpandSide.click(function(){
		oSide.css('left', 0);
		oMain.css('margin-left', 221);
		$(this).css('display',  'none');
	});
	
	// 搜索你的应用
	var
	delayHideSuggest = null,
	fnHideSuggest = function(){
		$('#suggest').hide().find('ul').html('');
	};
	$('#txtSuggest').on('mouseover', function(){
		clearTimeout(delayHideSuggest);
	}).on('mouseout', function(){
		delayHideSuggest = setTimeout(fnHideSuggest, 1000);
	}).on('keyup', function(){
		var json = {}, val = $.trim($(this).val()), arr = $('#menu a[data-href]:contains("' + val + '")');
		for(var i = 0, len = arr.length; i < len; i++){
			var a = arr.eq(i), high = a.attr('data-high');
			if(json[high]){
				json[high].push(a);
			}else{
				json[high] = [a];
			}
		}
		var lis = [];
		for(var key in json){
			lis.push('<li class="dropdown-header"><span>' + key + '</span></li>');
			var as = json[key];
			for(var i = 0, len = as.length; i < len; i++){
				var
				a = as[i],
				attrDataHref = ' data-href="' + a.attr('data-href') + '"',
				attrDataTarget = ' data-target="' + a.attr('data-target') + '"',
				attrDataTabId = ' data-tab-id="' + a.attr('data-tab-id') + '"';
				lis.push('<li class="presentation"><a href="javascript:void(0);"' + attrDataHref + attrDataTarget + attrDataTabId + '>' + a.text() + '</a></li>');
			}
			lis.push('<li class="divider"></li>');
		}
		if(lis.length == 0){
			lis.push('<li class="dropdown-header"><span>没有搜索到匹配的项</li>');
		}
		$('#suggest').show().find('ul').html(lis.join(''));
	});
	$('#suggest').on('mouseover', function(){
		clearTimeout(delayHideSuggest);
	}).on('mouseout', function(){
		delayHideSuggest = setTimeout(fnHideSuggest, 1000);
	}).on('click', 'a', function(){
		var a = $(this), href = a.attr('data-href'), target = a.attr('data-target'), tabId = a.attr('data-tab-id'), text = a.text();
		if(href){
			switch(target){
				case '_tab':
					tabs.add({ id: tabId, pid: '', url: href, display: text });
					break;
				case '_blank':
					window.open(href, text);
					break;
			}
		}
	});

	// 加载工作台页卡
	window.tabs = new Tabs();
	tabs.add({ id: 'desk', pid: '', url: core.siteBaseUrl + 'index.php?/index/desk', lock: true, display: '工作台' });

	// 初始化“应用菜单”滚动条
	$('#menu').mCustomScrollbar({
		theme: 'minimal-dark',
		scrollInertia: 100
	});

	// 初始化“搜索你的应用”列表滚动条
	$('#suggest').mCustomScrollbar({
		theme: 'minimal-dark',
		scrollInertia: 100
	});
	
	// 初始化“查看已打开的页签”列表滚动条
	$('#tabs-list').mCustomScrollbar({
		theme: 'minimal-dark',
		scrollInertia: 100
	});
});

































