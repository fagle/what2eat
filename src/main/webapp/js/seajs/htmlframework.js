define( function( require, exports, module ) {
	//html框架
	var HtmlFramework = function() {
	   var self = this;
	    
	   this.accep = function( pop ) {
	       //如需对popup对象进行操作， 可在此处进行
	   }    
	  
	   this.getContent = function( content ) {
	        throw '未实现';
	   }   
	}
	module.exports = HtmlFramework;
});