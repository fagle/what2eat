//活动链接构造javascript特效
define( function( require, exports, module ) {
	var UIBase = require( 'uibase' );
	var DataSource = require( 'active_map_data' );
	var suggest = require( 'suggest' );
	
	var fill = {
		fillSelectContent: function( ui, result ) {
			var items = result.split( ';' );
			if( items.length != 3 ) {
				return;
			}
			ui.getJDom().find( 'select' ).val( items[ 1 ] + ';' + items[ 2 ] );
		},
		
		fillCustomContent: function( ui, result ) {
			var items = result.split( ';' );
			if( items.length != 3 ) {
				return;
			}
			ui.getJDom( '_data' ).val( items[ 1 ] );
			ui.getJDom( '_txt' ).val( items[ 2 ] );
		},
		
		fillMapContent: function( ui, result ) {
			var items = result.split( ';' );
			if( items.length != 3 ) {
				return;
			}
			ui.getJDom( '_data' ).val( items[ 1 ] );
			ui.getJDom( '_txt' ).val( items[ 2 ] );
		}
	}
	
	var DefaultContent = function() {
		UIBase.call( this );
		
		var self = this;
		
		this.getHtmlTpl = function() {
			return ''
		}
		
		this.getResult = function() {
			return ';';
		}
		
		this.fill = function( result ) {}
	}
	
	var SelectContent = function() {
		UIBase.call( this );
		
		var self = this;
		
		this.getData = function() {
			var data = [
					    { key: '王小虎', value: 'TN01;王小虎'},
					    { key:'刘备', value: 'TN02;刘备'},
					    { key:'曹超', value: 'TN03;曹超' },
					    { key:'袁绍', value: 'TN04;袁绍'},
					    { key:'梦梦(礼包)', value: 'TN05;梦梦(礼包)' },
					    { key:'鲍三娘', value: 'TN06;鲍三娘(杂货)' },
					    { key:'杜康', value: 'TN07;杜康' },
					    { key:'甄宓', value: 'TN08;甄宓' },
					    { key:'貂蝉', value: 'TN09;貂蝉' },
					    { key:'菜菜(活动)', value: 'TN11;菜菜(活动)'  },
					    { key:'夏候霸(铁匠)', value: 'TN88;夏候霸(铁匠)' },
					    { key:'左慈(爬塔)', value: 'TN89爬塔' },
					    { key:'大冲', value: 'TN90;大冲' },
					    { key:'阿彪', value: 'TN91;阿彪' },
					    { key:'黄埔嵩(帮会)', value: 'TN92;黄埔嵩(帮会)'}
					];
			return data;
		}
		
		this.getHtmlTpl = function() {
			var data = this.getData();
			var html = "";
			html += "<option value=';'>请选择</option>";
			for( var i = 0; i < data.length; i++ ) {
				var item = data[ i ];
				html += "<option value='"+ item[ 'value' ] + "'>" + item[ 'key' ] + "</option>";
			}
			html = "<select>" + html + "</select>";
			html = "<div id='##' style='display:none;'>"+ html +"</div>";
			return html;
		}
		
		this.getResult = function() {
			return this.getJDom().find( 'select' ).val();
		}
		
		this.fill = function( result ) {
			fill.fillSelectContent( this, result );
		}
		
		this.addListener( 'renderComplete', function() {
			var select = this.getJDom().find( 'select' );
			select.bind( 'change', function() {
				self.fireEvent( 'change' );
			} );
		} ); 
	}
	
	var CustomContent = function() {
		UIBase.call( this );
		
		var self = this;
		
		this.getHtmlTpl = function() {
			var html = "";
			html += '<input type="text" id="##_data" placeholder="目标"/>';
			html += '<input type="text" id="##_txt" placeholder="描述文本"/>';
			return '<div id="##" style="display:none;">'+ html +'</div>';
		}
		
		this.getResult = function() {
			return this.getJDom( '_data' ).val() + ';' + this.getJDom( '_txt' ).val();
		}
		
		this.fill = function( result ) {
			fill.fillCustomContent(this, result);
		}
		
		this.addListener( 'renderComplete', function() {
			this.getJDom( '_data' ).bind( 'keyup', function() {
				self.fireEvent( 'change' );
			} );
			
			this.getJDom( '_txt' ).bind( 'keyup', function() {
				self.fireEvent( 'change' );
			} );
		} ); 		
	}
	
	var LinkContent = function() {
		CustomContent.call( this );
		
		this.getHtmlTpl = function() {
			var html = "";
			html += '<input type="text" id="##_data" placeholder="网站地址"/>';
			html += '<input type="text" id="##_txt" placeholder="网站名称"/>';
			return '<div id="##" style="display:none;">'+ html +'</div>';
		}
	}
 	
	var JYContent = function() {
		CustomContent.call( this );
		
		this.getHtmlTpl = function() {
			var html = "";
			html += '<input type="text" id="##_data" value="9"/>';
			html += '<input type="text" id="##_txt" value="-1" />';
			return '<div id="##" style="display:none;">'+ html +'</div>';
		}
	}
	
	var WindowContent = function() {
		SelectContent.call( this );
		
		var data = [
		    { key: '玄武大阵', value: 'UIMapInfoWnd,H01A;玄武大阵'},
		    { key:'虎牢灭妖', value: 'UIMapInfoWnd,H02A;虎牢灭妖'},
		    { key:'秦陵迷宫', value: 'UIMapInfoWnd,H03A;秦陵迷宫' },
		    { key:'擂台', value: 'UIArenaWnd,-1;擂台'},
		    { key: '封炎地图', value: 'UIMapInfoWnd,P02A;封炎地图'},
            { key: '战就战', value: 'UIMapInfoWnd,P051;战就战'},
		];
		
		this.getData = function() {
			return data;
		}	
	}
	
	var MapContent = function() {
		UIBase.call( this );
		
		var self = this;
		var ds;
		var dialog;
		var format;
		
		this.getHtmlTpl = function() {
			var html = "";
			html += '<input type="text" id="##_data" placeholder="目标"/>';
			html += '<input type="text" id="##_txt" placeholder="描述文本"/>';
			html += '<div id="##_suggest" class="map_suggest"></div>';
			return '<div id="##" style="display:none;">'+ html +'</div>';
		}
		
		this.getResult = function() {
			return this.getJDom( '_data' ).val() + ';' + this.getJDom( '_txt' ).val();
		}
		
		this.fill = function( result ) {
			fill.fillMapContent(this, result);
		}
		
		this.addListener( 'renderComplete', function() {
			ds = new DataSource();
			dialog = new suggest.Suggest( this.getId() + '_suggest' );
			format = new suggest.MapDataFormat();
			
			dialog.entered = function( selected ) {
				dialog.hide();
				self.getJDom( '_data' ).val( selected.id );
				self.getJDom( '_txt' ).val( selected.name + selected.level );
				self.fireEvent( 'change' );
			}
			
			$( document ).bind( 'click', function( e ) {
				var t = e.target || e.srcElement;
				if( self.getJDom( '_suggest' ).get( 0 ).contains( t ) ||
						self.getJDom( '_data' ).get( 0 ).contains( t ) ) {
					return;
				}
				dialog.hide();
			} );
			
			this.getJDom( '_data' ).bind( 'keyup', function( e ) {
			   if( e.keyCode <=40 && e.keyCode >= 37 || e.keyCode == 13) {
				   return;
			   }
				ds.search( $.trim( this.value ), function( result ) {
					if( result.length > 0 ) {
						format.setData( result );
						dialog.load( format );
						dialog.show();
					} else {
						dialog.hide();
					}
				});
				self.fireEvent( 'change' );
			} );
			
			this.getJDom( '_txt' ).bind( 'keyup', function() {
				self.fireEvent( 'change' );
			} );
		} ); 		
	}	
		
	var LinkBase = function( mode ) {
		UIBase.call( this );
		var self = this;
		var result = '';
		
		var map, npc, link, jy, win, df;
		var currType = new DefaultContent();
		var objList = [];
		var issetContent = false;
		
		this.issetContent = function() {
			return issetContent;
		}
		
		this.getCurrType = function() {
			return currType;
		}
		
		this.getHtmlTpl = function() {
			var html = '<div class="link_creator" id="##">'+
						'    <div class="lc_preview" id="##_preview" contenteditable="true">'+
						'	</div>'+
						'    <select id="##_type">'+
						'       <option value="">选择类型</option>'+
						'       <option value="MAP">地图</option>'+
						'       <option value="WINDOW">界面(多人关卡)</option>'+
						'       <option value="NPC">NPC</option>'+
						'       <option value="UISTATE">家园</option>' +
						'       <option value="WEBSITE">网站</option>' +
						'    </select>'+
						'    <div id="##_content" class="lc_content"></div>' +
						'</div>';
			return html;
		}
		
		this.select = function( text ) {
			var value = this.getJDom().find( 'option:contains("'+ text +'")' ).attr('value');
			this.getJDom( '_type' ).val( value ).triggerHandler('change');
		}
		
		this.getResult = function() {
			return result;
		}
		
		this.setResult = function( link ) {
			result = link;
			self.getJDom( '_preview' ).html( link );
		}
		
		var change = function() {
			var link = self.getLink();
			self.getJDom( '_preview' ).html( link );
			result = link;
			self.fireEvent( 'change' );
		}
		
		var display = function() {
			for( var i = 0; i < objList.length; i++ ) {
				objList[ i ].getJDom().hide();
			}
			currType && currType.getJDom().show();
		}
		
		var fillControl = function( link ) {
		    var regex = /(MAP|WINDOW|NPC|UISTATE|WEBSITE)[^|]+/;
		    var matchValue = link.match( regex );
		    if( !matchValue ) {
		    	return;
		    }
		    currType.fill( matchValue[ 0 ] );
		}
		
		this.addListener( 'renderComplete', function() {
			var contentId = this.getJDom( '_content' ).get( 0 ).id;
			
			//地图
			map = new MapContent();
			map.addListener( 'change', function() {
				change();
			} );
			map.render( contentId )
			objList.push( map );
			
			//npc
			npc = new SelectContent();
			npc.addListener( 'change', function() {
				change();
			} );
			npc.render( contentId );
			objList.push( npc );
			
			//超级链接 
			link = new LinkContent();
			link.addListener( 'change', function() {
				change();
			} );
			link.render( contentId );
			objList.push( link );
			
			//家园
			jy = new JYContent();
			jy.addListener( 'change', function() {
				change();
			} );
			jy.render( contentId );
			objList.push( jy );
			
			//默认空
			df = new DefaultContent();
			df.render( contentId );
			objList.push( df );
			
			//界面
			win = new WindowContent();
			win.addListener( 'change', function() {
				change();
			} );
			win.render( contentId );
			objList.push( win );
			
			this.getJDom( '_type' ).bind( 'change', function() {
				switch( this.value ) {
				case 'MAP':
					currType = map;
					break;
				case 'WINDOW':
					currType = win;
					break;
				case 'NPC':
					currType = npc;
					break;
				case 'UISTATE':
					currType = jy;
					break;
				case 'WEBSITE':
					currType = link;
					break;
				default: 
					currType = df;
				}
				issetContent = true;
				if( this.value && result.indexOf( this.value ) != -1 ) {
					fillControl( result );
					display();
				} else {
					display();
					change();
				}
			} );
			
			self.getJDom( '_preview' ).bind( 'keyup', function() {
				result = this.innerHTML;
				self.fireEvent( 'change' );
			} );
			
			self.getJDom( '_preview' ).bind( 'paste', function() {
				var self = this;
				window.setTimeout( function() {
					var content = self.innerHTML;
					content = content.replace( /<[^>]+>/g, '' );
					self.innerHTML = content;
				}, 1 );
			} );
			
			this.fireEvent( 'baseComponentRenderComplete' );
		} );
		
		this.addListener( 'fireChange', function() {
			change();
		} );
	}
		
	function TargetDesc () {
		LinkBase.call( this );
		
		var self = this;
		var TIMTS_STRING = '&lt;time&gt;';
		var timeString = '';
		var timeCheckbox;
		
		var genNewLink = function( link ) {
			var oldLink = self.getJDom( '_preview' ).html();
			var regex = /\|cff2ec6ff[\s\S]*\|k\|t\|r/;
			if( regex.test( oldLink ) ) {
				return oldLink.replace( regex, link );				
			} else {
				return link;
			}
		}
		
		this.getLink = function() {
			var type = self.getJDom( '_type' ).val();
			var currType = this.getCurrType();
			if( this.issetContent() ) {
				var content = this.getCurrType().getResult();
				var head = '|cff2ec6ff|f(YAHEI,12,B,O)|l';
				var foot = '|k|t|r';
				var link = head  + type + ';' + content +  foot + timeString;
				link = genNewLink( link );
				return link;
			} else {
				//编辑情况下的第一次点击在线时间复选框
				return this.getResult().replace( TIMTS_STRING, '' ) + timeString;
			}
		}
		
		this.hideOnlineTimeCkbox = function() {
			timeCheckbox.hide();
		}
		
		this.showOnlineTimeCkbox = function() {
			timeCheckbox.show();
		}
		
		this.addListener( 'baseComponentRenderComplete', function() {
			var html = "<label class='online_time'><input type='checkbox' />在线时间</label>";
			var el = timeCheckbox = $( html );
			this.getJDom().append( el );
			
			el.children('input[type="checkbox"]').bind( 'change', function() {
				if( this.checked ) {
					timeString = TIMTS_STRING;
				} else {
					timeString = '';
				}
				self.fireEvent( 'fireChange' );
			} );
		} );
	}
	
	function Href() {
		LinkBase.call( this );
		
		var self = this;
		
		this.getLink = function() {
			var type = self.getJDom( '_type' ).val();
			var currType = this.getCurrType();
			var content = currType.getResult();
			var link = type + ';' + content;
			return link;
		}
	}
	
	//一个奇怪的简单工厂，由于功能扩展又不想改动外部实例化代码才这么写的
	var ActiveLink = function( mode ) {
		if( mode == ActiveLink.TARGET_DESC ) {
			TargetDesc.call( this );
		} else if ( mode = ActiveLink.HREF ) {
			Href.call( this );
		}
	}
	
	ActiveLink.TARGET_DESC = 1;
	ActiveLink.HREF = 2;
	//ActiveLink.TARGET_TYPE_ONLINE_TIME = 5;
	
	module.exports = ActiveLink;
} );