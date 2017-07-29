define(function(require, exports, module) {
	var EventBase = require('eventbase');
	var Common = require( 'common' );

	var Page = function(pageCanvas) {
		this.recordCount;
		this.pageSize;
		this.numericButtonCount;
		this.pageCanvas = pageCanvas;
		this.pageIndex = 1;
	}

	Page.prototype = new EventBase();

	Page.prototype.getPageHtml = function() {
		this.pageCount = Math.ceil(this.recordCount / this.pageSize);
		var prev = this.pageIndex == 1 ? " <span>上一页</span>"
				: "<a href='javascript:;' pageindex='" + (this.pageIndex - 1)
						+ "'>上一页</a>";
		var next = this.pageCount <= this.pageIndex ? " <span>下一页</span>"
				: "<a href='javascript:;' pageIndex='" + (this.pageIndex + 1)
						+ "'>下一页</a>";
		var first = this.pageIndex == 1 ? "<span>1</span>"
				: "<a href='javascript:;' pageindex='1'>1</a>";
		var last = this.pageCount <= this.pageIndex ? "<span>" + this.pageCount
				+ "</span>" : "<a href='javascript:;' pageindex='"
				+ (this.pageCount) + "'>" + this.pageCount + "</a>";
		var pageStr = ""

		var pageMathIndex = Math.floor(this.numericButtonCount / 2);
		var pageStartIndex;
		var pageEndIndex;

		if (this.pageCount < this.numericButtonCount) {
			pageStartIndex = 1
			pageEndIndex = this.pageCount;
		} else {
			if (this.pageCount - pageMathIndex < this.pageIndex) {
				pageStartIndex = this.pageCount - this.numericButtonCount + 1;
				pageEndIndex = this.pageCount;
			} else {
				if (this.pageIndex - pageMathIndex < 1) {
					pageStartIndex = 1;
					pageEndIndex = this.numericButtonCount;
				} else {
					pageStartIndex = this.pageIndex - pageMathIndex;
					pageEndIndex = this.pageIndex + pageMathIndex;
				}
			}

		}

		for ( var i = pageStartIndex; i <= pageEndIndex; i++) {
			if (this.pageIndex == i)
				pageStr += " <span class='current'>" + i + "</span>"
			else
				pageStr += "<a href='javascript:;' pageindex='" + i + "'>" + i
						+ "</a>";
		}

		if (pageStartIndex == 1)
			first = '';
		if (pageEndIndex == this.pageCount)
			last = '';
		//pageStr = first + prev + pageStr + next + last;
		//pageStr = prev + first + pageStr + last + next;
		pageStr = this.getPageButtonHtml( prev, first, pageStr, last, next );
		return pageStr;
	}

	
	
	Page.prototype.onPageChanged = function(pageIndex) {
		this.pageIndex = pageIndex;
		this.fireEvent('pageChanged');
	}

	Page.prototype.pageEvent = function(page) {
		this.onclick = function(e) {
			e = e || window.event;
			t = e.target || e.srcElement;
			if (t.tagName == "A")
				page.onPageChanged(parseInt(t.getAttribute("pageindex")));
		}
	}

	Page.prototype.render = function() {
		var pageCanvas = document.getElementById(this.pageCanvas);
		pageCanvas.innerHTML = this.getRecordCountHtml( this.recordCount ) +  this.getPageHtml();
		this.pageEvent.call(pageCanvas, this);
	}
	
	Page.prototype.initialize = function() {
		this.onPageChanged(this.pageIndex);
	}
	
	Page.prototype.getRecordCountHtml = function( recordCount ) {
		throw '未实现此方法';
	}
	
	Page.prototype.getPageButtonHtml = function( first, prev, pageStr, next, last ) {
		throw '未实现此方法';
	}
	//---普通样式的分页效果------------------------------------------------------------------------------------------------------
	var PageV1 = function( pageCanvas ) {
		this.pageCanvas = pageCanvas;
	}
	
	PageV1.prototype = new Page;
	
	PageV1.prototype.getRecordCountHtml = function( recordCount ) {
		var html = '共<font>'+ recordCount +'</font>条记录';
		return html;
	}
	
	PageV1.prototype.getPageButtonHtml =  function( prev, first, pageStr, last, next ) {
		return prev + first + pageStr + last + next;
	}
	
	
	//---新版本GM UI样式的分页效果-------------------------------------------------------------------------------------
	var PageV2 = function( pageCanvas ) {
		this.pageCanvas = pageCanvas;
	}
	
	PageV2.prototype = new Page();
	
	PageV2.prototype.getRecordCountHtml = function( recordCount ) {
		var html = '<span style="float:left;" class="statistics">共<label>'+ recordCount +'</label>条记录</span>';
		return html;
	}
	
	PageV2.prototype.getPageButtonHtml = function( prev, first, pageStr, last, next ) {
		prev = prev.indexOf( 'span' ) == -1 ? "<li>" + prev + "</li>" : "<li class='disabled'>" + prev + "</li>";
		prev = prev.replace( '上一页', '«' );
		next = next.indexOf( 'span' ) == -1 ? "<li>" + next + "</li>" : "<li class='disabled'>" + next + "</li>";
		next = next.replace( '下一页', '»' );
		first = "<li>" + first + "</li>";
		last = "<li>" + last + "</li>";
		var regex = /<[^>]+?>[^<]+<[^>]+?>/g;
		var newPageStr = ""
		pageStr.replace( regex, function( match ) {
			newPageStr += match.indexOf( 'span' ) != -1 ? '<li class="active">' + match + '</li>' : '<li>' + match + '</li>';
		} );
		pageStr = newPageStr;
		var html = "<ul class='pagination'>";
		html +=  prev + first + pageStr + last + next;
		html += "</ul>";
		return html;
	}
	
	
	function renderPage(placeholder, dataCount, base, pageSize, ver ) {
		var Page;
		if( !pageSize || isNaN( pageSize ) ) {
			pageSize = 20;
		}
		
		if( !ver ) {
			Page = PageV1;
		} else if( ver == 'v2' ) {
			Page = PageV2
		} else {
			Page = PageV1
		}
				
		if( dataCount <= 0 ) {
			return;
		}
		
		var page = new Page(placeholder);
		page.pageSize = pageSize;
		page.numericButtonCount = 5;
		page.recordCount = dataCount;
		page.pageIndex = parseInt(Common.getQueryString('page')) || 1;
		page.addListener('pageChanged', function() {
			var query = Common.queryString();
			for( var key in query ) {
				if(query[key] === '') {
					delete query[ key ];
				}
                if(query[key]) {
                    query[key] = query[key].replace(/\+/g, ' ');
                }
			}
			query['page'] = this.pageIndex;
			window.location.href = base +'?'+ $.param(query);
		});
		page.render();
	}
	exports.renderPage = renderPage;
});
