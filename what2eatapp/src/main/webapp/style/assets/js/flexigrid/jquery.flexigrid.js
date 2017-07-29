/**
 * Author: dingwei 2015-09-21
 * Description: jquery.flexigrid.js
**/
(function($, w){
	var gridId = 0;
	
	function Flexigrid(table, id, config){
		var grid = this;
		
		grid.table = table;
		grid.id = id;
        grid.config = config;
        grid.hideColumns = 0;
        grid.hasRowToggle = false;
        
        // 查找所有列
        grid.findAllThs = function(){
			return $(grid.table).find('thead th');
		};
        
        // 查找需要动态隐藏的列
        grid.findDynamicThs = function(){
			return $(grid.table).find('thead th[data-hide]');
		};
		
		// 查找隐藏的列
		 grid.findHiddenThs = function(){
			return $(grid.table).find('thead th:hidden');
		};
		
		// 显示或者隐藏列
		grid.toggleColumn = function(w){
			var ths = grid.findDynamicThs();
			for(var i = 0, len = ths.length; i < len; i++){
				var th = ths.eq(i), idx = th.index(), n = th.data('hide'), type = (w <= n) ? 'hide' : 'show';
				th[type]();
				$(grid.table).find('tbody td:nth-child(' + (idx + 1) + ')')[type]().data('th', th.text());
			}
			
			var hidThs = grid.findHiddenThs();
			grid[hidThs.length > 0 ? 'addRowToggle' : 'removeRowToggle']();
		};
		
		// 添加toggle按钮
		grid.addRowToggle = function(){
			if(grid.hasRowToggle == false){
				grid.hasRowToggle = true;
				$(grid.table).find('tbody td:nth-child(1)').prepend('<span class="toggle glyphicon glyphicon-plus" aria-hidden="true"></span>');
			}
		};
		
		// 删除toggle按钮
		grid.removeRowToggle = function(){
			if(grid.hasRowToggle == true){
				grid.hasRowToggle = false;
				$(grid.table).find('tbody td:nth-child(1)').find('.toggle').remove();
			}
		};
		
		// 显示行明细
		grid.showRowDetail = function(curTr){
			// 添加明细
			var allTds = curTr.find('td'), hidTds = allTds.filter(':hidden'), html = [];
			html.push('<tr class="detail">');
			html.push('<td colspan="' + (allTds.length - hidTds.length) + '">');
			html.push('<ul class="list">');
			for(var i = 0, len = hidTds.length; i < len; i++){
				var td = hidTds.eq(i);
				html.push('<li><b>' + td.data('th') + '</b>：' + td.text() + '</li>');
			}
			html.push('</ul>');
			html.push('</td>');
			html.push('</tr>');
			curTr.after(html.join(''));
			
			// 将加号变为减号
			curTr.find('.toggle').removeClass('glyphicon-plus').addClass('glyphicon-minus');
		};
		
		// 隐藏行明细
		grid.deleteRowDetail = function(curTr, detailTr){
			// 删除明细
			detailTr.remove();
			
			// 将加号变为减号
			curTr.find('.toggle').removeClass('glyphicon-minus').addClass('glyphicon-plus');
		};
		
		// 
		grid.triggerRowToggle = function(btn){
			btn.trigger('click');
		};
        
        // 初始化
         grid.init = function(){
            var $w = $(w), $table = $(grid.table);
            
            // 窗口大小改变事件处理
            $w.on('resize.responsive', function(){
            	grid.triggerRowToggle($table.find('tbody .toggle.glyphicon-minus'));
            	grid.toggleColumn($w.width());
			}).trigger('resize.responsive');
			
			// 
			$table.on('click.toggle', '.toggle', function(){
				var curTr = $(this).parents('tr:first'), detailTr = curTr.next('.detail');
				if(detailTr.length > 0){
					grid.deleteRowDetail(curTr, detailTr);
				}else{
					grid.showRowDetail(curTr);
				}
			});
        };
        
        grid.init();
        
        return grid;
	}
	
	$.fn.flexigrid = function(o){
		o = $.extend({}, {
			
		}, o);
		
		return this.each(function(){
			gridId++;
            var grid = new Flexigrid(this, gridId, o);
            $(this).data('flexigrid', grid);
		});
	};
	
})(jQuery, window);
