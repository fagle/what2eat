define( function( require, exports, module) {
    var EventBase = require( 'eventbase' );
    //打开关闭形为基础类
    var OpenAndCloseBase = function() {
        EventBase.call( this );
        
        var jdom;
        
        this.setJDom = function( jquery ) {
            jdom = jquery;
        }
        
        this.getJDom = function() {
            return jdom;
        }
        
        this.open = function() {
            throw new Error( '未实现' );
        }
        
        this.close = function() {
            throw new Error( '未实现' );
        }
    }
    module.exports = OpenAndCloseBase;
});