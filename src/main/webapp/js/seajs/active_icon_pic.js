define( function( require, exports, module ) {
	var UIBase = require( 'uibase' );
	
	var resource = [
	     { 'name': '玄武大阵', 'icon': 'AA01', 'pic': 'AB01' },
	     { 'name': '炼狱塔', 'icon': 'AA02', 'pic': 'AB02' },
	     { 'name': '虎牢灭妖', 'icon': 'AA03', 'pic': 'AB03' },
	     { 'name': '秦陵迷宫', 'icon': 'AA04', 'pic': 'AB04' },
	     { 'name': '夺宝之战', 'icon': 'AA05', 'pic': 'AB05' },
	     { 'name': '封炎大战', 'icon': 'AA06', 'pic': 'AB06' },
	     { 'name': '征战之路', 'icon': 'AA07', 'pic': 'AB07' },
	     { 'name': '积累经验', 'icon': 'AA08', 'pic': 'AB08' },
	     { 'name': '挑战BOSS', 'icon': 'AA09', 'pic': 'AB09' },
	     { 'name': 'BUFF',     'icon': 'AA10', 'pic': 'AB10' },
	     { 'name': '集字活动', 'icon': 'AA11', 'pic': 'AB11' },
	     { 'name': '家园除杂', 'icon': 'AA12', 'pic': 'AB12' },
	     { 'name': '累计在线', 'icon': 'AA13', 'pic': 'AB13' }
	];
	
	function Selector() {
		UIBase.call( this );
		
		var self = this;
		
		this.getHtmlTpl = function() {
			var html = "<select id='##' style='width:100px;'>";
			html += "<option value=''>选择资源</option>";
			for( var i = 0; i < resource.length; i++ ) {
				html += "<option value='"+ i +"'>"+ resource[ i ].name  +"</option>";
			}
			html += "</select>";
			return html;
		}
		
		this.addListener( 'renderComplete', function() {
			this.getJDom().bind( 'change', function() {
				var out = null;
				if( this.value ) {
					out = resource[ this.value ];
				} else {
					out = { 'name': '', 'icon': '', 'pic': '' }
				}
				self.fireEvent( 'change', out );
			} );
		} );
	}
	
	exports.Selector = Selector;
} );