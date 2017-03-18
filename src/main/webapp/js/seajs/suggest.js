define(function(require, exports, module) {
	var EventBase = require('eventbase');
	var Common = require('common');
	// 会话打开状态
	var OPEN = 0;
	// 会话关闭状态
	var CLOSE = 1;
	// 会话类，用与选择@对象
	var Dialog = function(placeholderid) {
		EventBase.call(this);

		var placeholder = $(document.getElementById(placeholderid));

		var format;
		var maxIndex;
		var currentIndex;
		var self = this;
		var eventState = false;

		// 按下回车键后触发的事件
		this.entered = new Function('data', '');

		this.getDom = function() {
			return placeholder.get( 0 );
		}
		
		this.load = function(d) {
			format = d;
			maxIndex = format.getLength() - 1;
			currentIndex = -1;
			this.setDialogText(format.getHtml());
			refreshDialog();

			// 设置滚动条
			placeholder.show();
			var elItems = getItemsEl();
			var itemHeight = elItems[0] && elItems[0].offsetHeight;
			if (elItems.length > 10) {
				placeholder.height(itemHeight * 10);
				placeholder.css('overflow-y', 'scroll')
			} else {
				placeholder.height('auto');
				placeholder.css('overflow-y', 'auto');
			}
			bindMouseEvent();
		}
		this.show = function(left, top) {
			placeholder.css({
				'position' : 'absolute',
				'left' : left,
				'top' : top,
				'display' : 'block'// ,
			// 'z-index': '1001'
			});
			if (!eventState)
				bindKeyEvent();

			this.fireEvent('opened');
		}

		this.getStatus = function() {
			return placeholder.css('display') == 'none' ? CLOSE : OPEN;
		}

		this.hide = function() {
			placeholder.hide();
			unbindKeyEvent();
		}

		this.setDialogText = function(text) {
			placeholder.html(text);
		}

		this.clear = function() {
			data = [];
			placeholder.html('');
			placeholder.height('auto');
			placeholder.css('overflow-y', 'auto');
		}

		var getItemsEl = function() {
			return placeholder.find('ul li');
		}

		var refreshDialog = function() {
			if (currentIndex == -1) {
				return;
			}
			var elItems = getItemsEl();
			elItems.removeClass('selected');

			var currItemEl = $(elItems[currentIndex]);
			currItemEl.addClass('selected');

			// 控制滚动条位置
			placeholder.scrollTop((currentIndex + 1) * currItemEl.height()
					- placeholder.height())
		}

		var moveNext = function() {
			// currentIndex = currentIndex == -1 ? 0 : currentIndex;
			if (currentIndex == maxIndex) {
				currentIndex = 0;
			} else {
				currentIndex++;
			}

			refreshDialog();
		}

		var movePrev = function() {
			currentIndex = currentIndex == -1 ? 0 : currentIndex;
			if (currentIndex == 0) {
				currentIndex = maxIndex
			} else {
				currentIndex--;
			}

			refreshDialog();
		}

		var enter = function() {
			// self.hide();
			var selectedItem = currentIndex == -1 ? null : format
					.getSelectedItem(currentIndex);
			self.entered(selectedItem);
		}

		var keydownEvent = function(e) {
			var keycode = e.keyCode;
			switch (keycode) {
			// 向上
			case 38:
				movePrev();
				break;
			// 向下
			case 40:
				moveNext();
				break;
			// 回车
			case 13:
				enter();
				break;
			}
		}

		// ie无法捕获enter键keypdown事件， 改用keypress;
		var keypressEvent = function(e) {
			var ieVersion = Common.getMSIEVersion();
			if (ieVersion && ieVersion == 6) {
				var keycode = e.keyCode;
				if (keycode == 13) {
					enter();
				}
			}
		}

		var bindKeyEvent = function() {
			$(document).bind('keydown', keydownEvent);
			$(document).bind('keypress', keypressEvent);
			eventState = true;
		}

		var unbindKeyEvent = function() {
			$(document).unbind('keydown', keydownEvent);
			$(document).unbind('keypress', keypressEvent);
			eventState = false;
		}

		var bindMouseEvent = function() {
			var itemsEl = getItemsEl();
			itemsEl.bind('mouseover', function() {
				var self = $(this);
				itemsEl.removeClass('selected');
				self.addClass('selected');
				var index = itemsEl.index(self);
				currentIndex = index;
			});

			itemsEl.bind('click', function() {
				enter();
			});
		}
	}
	Dialog.OPEN = OPEN;
	Dialog.CLOSE = CLOSE;


	var MapDataFormat = function() {
		var data;
		this.setData = function(d) {
			if (d instanceof Array) {
				data = d;
			} else {
				data = [];
			}
		}
		this.getLength = function() {
			return data.length;
		}
		this.getSelectedItem = function(index) {
			if (data.length - 1 >= index) {
				return data[index];
			} else {
				return null;
			}
		}
		this.getHtml = function() {
			var html = '';

			for ( var i = 0; i < data.length; i++) {
				html += '<li>' + data[i].name + '</li>';
			}

			return '<ul>' + html + '</ul>';
		}
	}
	
	var TownItemFormat = function() {
		var data;
		this.setData = function(d) {
			if (d instanceof Array) {
				data = d;
			} else {
				data = [];
			}
		}
		this.getLength = function() {
			return data.length;
		}
		this.getSelectedItem = function(index) {
			if (data.length - 1 >= index) {
				return data[index];
			} else {
				return null;
			}
		}
		this.getHtml = function() {
			var html = '';
			for ( var i = 0; i < data.length; i++) {
				html += '<li>' + data[i].name + '</li>';
			}

			return '<ul>' + html + '</ul>';
		}
	}	
		
	var LegionCardFormat = function() {
		var data;
		this.setData = function(d) {
			if (d instanceof Array) {
				data = d;
			} else {
				data = [];
			}
		}
		this.getLength = function() {
			return data.length;
		}
		this.getSelectedItem = function(index) {
			if (data.length - 1 >= index) {
				return data[index];
			} else {
				return null;
			}
		}
		this.getHtml = function() {
			var html = '';
			for ( var i = 0; i < data.length; i++) {
				html += '<li '+ ( data[ i ].default_open == 1 ? 'style="color:#999;"' : '' ) +'>' + data[i].card_name + '</li>';
			}

			return '<ul>' + html + '</ul>';
		}
	}		
	
	var M3dldItemFormat = function() {
		var data;
		this.setData = function(d) {
			if (d instanceof Array) {
				data = d;
			} else {
				data = [];
			}
		}
		this.getLength = function() {
			return data.length;
		}
		this.getSelectedItem = function(index) {
			if (data.length - 1 >= index) {
				return data[index];
			} else {
				return null;
			}
		}
		this.getHtml = function() {
			var html = '';
			for ( var i = 0; i < data.length; i++) {
				html += '<li>' + data[i].itemName + '</li>';
			}

			return '<ul>' + html + '</ul>';
		}
	}	
	
	var HeroItemFormat = function() {
		var data;
		this.setData = function(d) {
			if (d instanceof Array) {
				data = d;
			} else {
				data = [];
			}
		}
		this.getLength = function() {
			return data.length;
		}
		this.getSelectedItem = function(index) {
			if (data.length - 1 >= index) {
				return data[index];
			} else {
				return null;
			}
		}
		this.getHtml = function() {
			var html = '';
			for ( var i = 0; i < data.length; i++) {
				html += '<li>' + data[i].heroName + '</li>';
			}

			return '<ul>' + html + '</ul>';
		}
	}	
	
	var on = function( suggestPlaceholder, trigger, onEnter, type ) {
 	   var isNull = false;
	   var dialog = new Dialog( suggestPlaceholder );
	   dialog.entered = function( item ) {
		   if( typeof( onEnter ) == 'function' ) {
			   onEnter( item );
		   }
	   }
	   var d = new CateDataFormat();
	   
		var triggerEl = $( document.getElementById( trigger ) );
		triggerEl.bind( 'keyup', function( e ) {
			   if( e.keyCode <=40 && e.keyCode >= 37 || e.keyCode == 13) {
				   return;
			   }
       		   var ajaxOption = new Object;
    		   ajaxOption.url = "index.php?app=category&act=get_cates&d=admin&type=" + (type || '');
    		   ajaxOption.data =  {
    			   keyword: $.trim( triggerEl.val() )
    		   }
    		   ajaxOption.dataType = 'JSON';
    		   ajaxOption.type = 'POST';
    		   ajaxOption.success = function( response ) {
    			   isNull = false;
    			   if( response.length == 0 ) {
    				   isNull = true;
    				   dialog.setDialogText( '<div class="nothing">没有类别信息</div>' )
    				   $(dialog.getDom()).height( 'auto' )
    				   dialog.show();
    				   return;
    			   }
            	   d.setData( response );
        		   dialog.load( d );
        		   dialog.show();
    		   }
    		   $.ajax( ajaxOption );                		   	
		} );
		return dialog;
	}
	
	module.exports.on = on;
	module.exports.Suggest = Dialog;
	module.exports.MapDataFormat = MapDataFormat;
	module.exports.TownItemFormat = TownItemFormat;
	module.exports.M3dldItemFormat = M3dldItemFormat;
	module.exports.LegionCardFormat = LegionCardFormat;
	module.exports.HeroItemFormat = HeroItemFormat;
});
