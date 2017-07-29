/**
 * Author: dingwei 2015-09-21
 * Description: editgrid.js
**/
var Editgrid = function(config){
	this.config = config;
	this.id = this.config.id;
	this.table = jQuery(this.id);
	this.thead = this.table.find('thead').eq(0);
	this.tbody = this.table.find('tbody').eq(0);
	this.addEvents();
};

// 获取所有行
Editgrid.prototype.getRows = function(){
	return this.tbody.find('tr');
};

// 获取行数
Editgrid.prototype.getRowsTotal = function(){
	return this.getRows().length;
};

// 设置行索引
Editgrid.prototype.setRowsIndex = function(){
	var grid = this, trs = grid.getRows();
	
	for(var i = 0, len = trs.length; i < len; i++){
		var tr = trs.eq(i), idx = i + 1;
		
		tr.find('td.no').text(idx);
		tr.find('[data-name]').each(function(){
			var elem = jQuery(this);
			elem.prop('name', elem.data('name') + idx);
		});
	}
};

// 添加行
Editgrid.prototype.addRow = function(n){
	n = n || 1;
	
	for(var i = 0; i < n; i++){
		var
		index = this.getRowsTotal() + 1,
		html = this.config.getRowHtml(index),
		tr = jQuery(html);
		
		this.tbody.append(tr);
		
		this.setRowsIndex();
		
		if(this.config && this.config.afterAddRow){
			var afterFn = this.config.afterAddRow;
			afterFn(tr, index);
		}
	}
};

// 删除行
Editgrid.prototype.deleteRow = function(tr){
	if(tr.length > 0){
		tr.remove();
		this.setRowsIndex();
	}
};

// 获取数据
Editgrid.prototype.getData = function(){
	var trs = this.getRows(), arr = [];
	
	for(var i = 0, len1 = trs.length; i < len1; i++){
		var tr = trs.eq(i), elems = tr.find('[name]'), json = {};
		
		for(var j = 0, len2 = elems.length; j < len2; j++){
			var elem = elems.eq(j);
			json[elem.prop('name')] = elem.val();
		}
		
		arr.push(json);
	}
	
	return arr;
};

// 初始化事件处理函数
Editgrid.prototype.addEvents = function(){
	var grid = this;
	
	grid.table
	// 添加行
	.on('click.add', 'thead a[data-role="add"]', function(){
		if(grid.config && grid.config.beforeAddRow){
			var beforeFn = grid.config.beforeAddRow, flag = beforeFn(grid.getRowsTotal());
			if(flag){
				grid.addRow();
			}
		}else{
			grid.addRow();
		}
	})
	// 删除行
	.on('click.delete', 'tbody a[data-role="delete"]', function(){
		var total = grid.getRowsTotal();
		if(total > 1){
			var btn = jQuery(this), tr = btn.parents('tr:first');
			grid.deleteRow(tr);
		}
	});
};
