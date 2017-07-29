define( function( require, exports, module ) {
	var Common = {
		Point: function( left, top ) {
			 this.left = parseFloat( left );
			 this.top = parseFloat( top );
			 
			 this.clone = function() {
				return new Point( this.left, this.top ); 
			 }
		},

		Size: function( width, height ) {
		     this.width = width;
			 this.height = height;
		},

		Rect: function( left, right , width, height )
		{
		     this.getPoint = function()
			 {
				 var point = new Point( left, right );
				 return point;
			 }

			 this.getSize = function()
			 {
				 var size = new Size( width, height )
				 return size;
			 }
		},
		
		getDialogID: function() {
			var frameid = window.frameElement.id;
			return frameid.replace( '-framedialog', '' );
		},

		getMSIEVersion: function() {
			var regex = /MSIE([^;]+)/i;
			var userAgent = navigator.userAgent;
			var result = regex.exec( userAgent );
			if( result ) return parseInt( result[ 1 ] );
		},

	    queryString: function() {
			var map = {};
			var params = getUrlParams();
			if( !params ) return map;
			var list = params.split( '&' );
			for( var i = 0; i < list.length; i++ ) {
				var item = list[ i ].split( '=' );
				if(item.length < 2) {
					continue;
				} 
				map[ item[ 0 ] ] = unescape( decodeURI( item[ 1 ] ) );
			}
			return map;
		},
		
		getQueryString: function(key) {
		    var regex_str = "^.+\\?.*?\\b"+ key +"=(.*?)(?:(?=&)|$|#)"
		    var regex = new RegExp(regex_str,"i");
		    var url = window.location.toString();
		    if(regex.test(url)) return RegExp.$1;
		    return null;
		},
		
		getCookie: function(key) {
		    var cookie = document.cookie;
		    if(cookie == undefined || cookie == "") return undefined
		    var regex = new RegExp("(?:"+ key +"=)([^&;]+)","gi");
		    if(regex.test(cookie)) return (RegExp.$1)
		    return undefined;
		},
		
		islogin: function() {
			var islogin = this.getCookie( 'islogin' );
			return parseInt( islogin );
		},
		
		gotoMailbox: function( email ) {
			if( !new RegExp( '\\w+([-+.\']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*' ).test( email ) ) {
				alert('邮箱格式不合法');
				return;
			} 
			var emailHash={ 
					'qq.com': 'http://mail.qq.com', 
					'gmail.com': 'http://mail.google.com', 
					'sina.com': 'http://mail.sina.com.cn', 
					'163.com': 'http://mail.163.com', 
					'126.com': 'http://mail.126.com', 
					'yeah.net': 'http://www.yeah.net/', 
					'sohu.com': 'http://mail.sohu.com/', 
					'tom.com': 'http://mail.tom.com/', 
					'sogou.com': 'http://mail.sogou.com/', 
					'139.com': 'http://mail.10086.cn/', 
					'hotmail.com': 'http://www.hotmail.com', 
					'live.com': 'http://login.live.com/', 
					'live.cn': 'http://login.live.cn/', 
					'live.com.cn': 'http://login.live.com.cn', 
					'189.com': 'http://webmail16.189.cn/webmail/', 
					'yahoo.com.cn': 'http://mail.cn.yahoo.com/', 
					'yahoo.cn': 'http://mail.cn.yahoo.com/', 
					'eyou.com': 'http://www.eyou.com/', 
					'21cn.com': 'http://mail.21cn.com/', 
					'188.com': 'http://www.188.com/', 
					'foxmail.com': 'http://www.foxmail.com' 
					}; 
			var host = /[^@]+$/.exec( email )[ 0 ].toLowerCase();
			var url = emailHash[ host ];
			if(!url) {
				alert( '我们不知道您使用的邮箱，请自行登陆' );
				return;
			}
			window.open( url );
			
		},
		
		getLength: function( str ) {
			var len = 0;
			var arr = str.split( '' );
			for( var i = 0; i < arr.length; i++ ) {
				var item = arr[ i ];
				if( /[\u4e00-\u9fa5]/.test( item ) ) {
					len += 2;
				} else {
					len += 1;
				}
			}
			return len;
		},
		copyToClipboard: function( txt, successHandler, failCallback ) {
		    if(window.clipboardData) 
		    { 
		        window.clipboardData.clearData();   
		        window.clipboardData.setData("Text",txt);    
		        //alert("网址复制成功!快用Ctrl+V粘贴到QQ，MSN中发送给好友吧！")    
		    	if( typeof successHandler == 'function' ) successHandler();
			} 
		    else if(navigator.userAgent.indexOf("Opera") != -1) 
		    {    
		        window.location = txt;  
		        //alert("网址复制成功!快用Ctrl+V粘贴到QQ，MSN中发送给好友吧！")    
		    	if( typeof successHandler == 'function' ) successHandler();
			} 
		    else if (window.netscape) 
		    {    
				if( typeof failCallback == 'function' ) failCallback();		
			} else {
				if( typeof failCallback == 'function' ) failCallback();
			}	
		},
		
		addFavorite: function(sURL, sTitle) {
		    try {
		        window.external.addFavorite(sURL, sTitle);
		    } catch(e) {
		        try {
		            window.sidebar.addPanel(sTitle, sURL, "");
		        } catch(e) {
		            alert("加入收藏失败，请使用Ctrl+D进行添加");
		        }
		    }
		    return false;
		},
		
		regexLib: {
			email: new RegExp( '\\w+([-+.\']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*' ),
			tel: /^(133|142|144|146|148|149|153|180|181|189|130|131|132|141|143|145|155|156|185|186|134|135|136|137|138|139|140|147|150|151|152|157|158|159|182|183|187|188)\d{8}$/,
			httpUrl: new RegExp( "http(s)?://([\\w-]+\\.)+[\\w-]+(/[\\w- ./?%&=]*)?" )
		},
		
		outFrameTop: function() {
			window.parent && (window.parent.document.body.scrollTop = 0);
		}
	}
	
	function getUrlParams() {
		var regex = /\?([^#]*)/;
		regex = /\?(?!.*?\?)([^#]*)/;
		var params = regex.exec( window.location.href );
		if( params ) return params[ 1 ];
	}	

	module.exports = Common;
});

