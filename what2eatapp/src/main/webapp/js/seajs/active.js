define( function( require, exports, module ) {
	var NewOpenAndClose = require( 'gm_openandclose' );
	var HtmlFramework = require( 'htmlframework' );
	var PopupLayer = require( 'popuplayer' );
	var Mask = require( 'mask' );


	var DialogHtml = function() {
		HtmlFramework.call( this );
		
		this.getContent = function( content ) {
			return '<div class="active_detail_dialog" id="##">' + content + '</div>';
		}
	}

	//活动列表， 显示活动的详细信息
	function showActive( htmlDialog ) {
		var mask = Mask.create();
		var oc = new NewOpenAndClose();
		var html = new DialogHtml();
		var dialog = dialogAlias = new PopupLayer( oc, html, htmlDialog );
		dialog.addListener( 'opened', function() {
			mask.show();
			this.getJDom( '_ss' ).focus();
		} );
		dialog.addListener( 'closed', function() {
			mask.hide();
			dialog.dispose();
		} );
		dialog.addListener( 'renderComplete', function() {
			
		} );
		dialog.initialize();
		dialog.open();
	}
	
	//填写活动信息时， 通过填写道具的id就显示道具的名称
	var lib = require( 'lib' );
	function initShowPropDetail( url ) {
		lib.initShowItemDetail( url );
	}
	
	//buffer相关
	var bufferIDs = new Array;
	
	function initBuffer() {
		$( '#reward' ).val( bufferIDs.join( '|' ) );
		$( '#show_buff' ).empty();
		for( var i = 0; i < bufferIDs.length; i++ ) {
			addBufferListItem( bufferIDs[ i ] );
		}
	}
	
	function setBufferIDs( values ) {
		bufferIDs = values;
	}
	
	function removeBuffer( buffID ) {
		for( var i = 0; i < bufferIDs.length; i++ ) {
			if( bufferIDs[ i ] == buffID ) {
				bufferIDs.splice( i, 1 );
				break;
			}
		}
	}
	
	function addBufferListItem( buffID ) {
		var html = '<div>Buffer值：'+ buffID +' <i buff_id="'+ buffID +'" class="icon-remove pointer"></i></div>';
		var item = $( html );
		item.find( 'i' ).bind( 'click', function() {
			removeBuffer( $( this ).attr( 'buff_id' ) );
			$( this ).parent().remove();
			$( '#reward' ).val( bufferIDs.join( '|' ) );
		} );
		$( '#show_buff' ).append( item );
	}
	
	function initAddBuffer() {		
		$( '#add_buffer' ).bind( 'click', function() {
			var buffID = $.trim( $( '#buffer_id_ipt' ).val() );
			if( buffID == '' ) {
				alert( '请输入BUFFER的ID' );
				return false;
			}
				
			bufferIDs.push( buffID );
			$( '#reward' ).val( bufferIDs.join( '|' ) );
			$( '#buffer_id_ipt' ).val( '' );
					
			addBufferListItem( buffID );
		} );		
	}
	
	function initSwitchRewardType() {
        $('#reward_type').change( function(){
            if( $(this).val() == 1 ) {
                   $( '#reward' ).hide();
                   $( '#buffer_div' ).hide();
                   $('#item_div').show() ;  
                } else if( $(this).val() == 3 ){
                    $('#reward').hide() ;
                    $('#item_div').hide() ;
                    $( '#buffer_div' ).show();
                    active.initBuffer();
                } else {
                   $('#reward').show() ;
                   $( '#buffer_div' ).hide();
                   $('#item_div').hide();  
                }
            });
	}
	
	exports.showActive = showActive;
	exports.initShowPropDetail = initShowPropDetail;
	exports.initAddBuffer = initAddBuffer;
	exports.initBuffer = initBuffer;
	exports.initSwitchRewardType = initSwitchRewardType;
	exports.setBufferIDs = setBufferIDs;
});