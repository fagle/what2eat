define( function( require, exports, module ) {
    var UIBase = require( 'uibase' );
    var Common = require( 'common' );
    
    var Mask = function() {
        UIBase.call( this );
        
        this.getHtmlTpl = function() {
            var html = '<div id="##"></div>'
            return html;
        }
        
        var getPageSize = function() {
            var jdoc = $( document );
            return new Common.Size( parseInt( jdoc.width() ), parseInt( jdoc.height() ) ); 
        }
        
        this.show = function() {
            var size = getPageSize();
            this.getJDom().css( size ).show();  
        }
        
        this.hide = function() {
            this.getJDom().hide();  
        }
        
        this.getState = function() {
            if( this.getJDom().is( ':visible' ) ) {
                return Mask.MASK_STATE_SHOW;
            } else {
                return Mask.MASK_STATE_HIDE;
            }
        }
        
        var oldRender = this.render;
        this.render = function() {
            oldRender.apply( this );
            //var size = getPageSize();
            this.getJDom().css( { 
                opacity: 0.5, 
                //width: size.width, 
                //height: size.height, 
                position: 'absolute',
                left: 0,
                top: 0,
                width:'100%',
            	height:'100%',
                backgroundColor: '#000',
                zIndex: 998,
                display: 'none' 
            } );    
        }
    }

    var mask;
    Mask.create = function() {
        if( mask ) {
           // mask == null;
           // mask.dispose();
        	return mask;
        }
        mask = new Mask();
        mask.render();
        return mask;        
    }

    Mask.MASK_STATE_SHOW = 1;
    Mask.MASK_STATE_HIDE = 0;    

    module.exports = Mask;
});
