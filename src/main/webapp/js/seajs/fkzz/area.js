define( function( require, exports, module ) {
	var EventBase = require( 'eventbase' );
	
	function AreaControl() {
		EventBase.call( this );
		
		var placeholder;
		var data;
		var mode = AreaControl.SELECT_MODE;
		var valueElement;
		var selectAreaIdList = [];
		
		var initialize = function() {
			var areaIdString = $.trim( valueElement.val() );
			if( areaIdString.length > 0 ) {				
				selectAreaIdList = areaIdString.split( ',' );
			}
			
			switch( mode ) {
				case AreaControl.SELECT_MODE:
					generateSelectHtml();
					break;
				case AreaControl.CHECKBOX_MODE:
					generateCheckboxHtml();
					break;
			}
		}

		var generateSelectHtml = function() {
			var html = '<select class="form-control area-control-area-select">';
			html += "<option value=''>请选择大区</option>";
			for( var key in data ) {
				var areaItem = data[ key ];
				html += '<option value="'+ areaItem.id +'">' + areaItem.name + "</option>";
			}
			html += "</select>";
			placeholder.html( html );	
			placeholder.find( 'select' ).bind( 'change', function() {
				valueElement.val( this.value );
			} );
		}
			
		var checkboxValueOutput = function() {
			var values = [];
			placeholder.find( 'input' ).each( function(){
				if( this.checked && !isNaN( this.value ) ) {
					values.push( this.value );
				}
			} );
			valueElement.val( values.join( ',' ) );
		}
		
		var generateCheckboxHtml = function() {
			var html = '';
			html += '<label class="checkbox checkbox-inline">';
			html += '<input type="checkbox"  value="all" />全选';
			html += '</label>';
			
			for( var key in data ) {
				var areaItem = data[ key ];
				html += '<label class="checkbox checkbox-inline">';
				html += '<input type="checkbox"  value="'+ areaItem.id +'" />' + areaItem.name;
				html += '</label>';
			}
			placeholder.html( html );	
			placeholder.find('input[type="checkbox"]').bind( 'change', function( e ) {
				if( this.value == 'all' ) {
					placeholder.find( 'input[type="checkbox"]' ).attr( 'checked', this.checked );
					checkboxValueOutput();
				} else {
					checkboxValueOutput();
					var checkAll = true;
					placeholder.find( 'input' ).each( function(){
						if( this.value != 'all' && this.checked == false ) {
							checkAll = false;
						}
					});
					placeholder.find( 'input[value="all"]' ).attr( 'checked', checkAll );
				}
			} );
			
			var checkAll = true;
			placeholder.find( 'input[type="checkbox"][value!="all"]' ).each( function() {
				for( var i = 0; i < selectAreaIdList.length; i++ ) {
					var areaId = selectAreaIdList[ i ];
					if( this.value == areaId ) {
						this.checked = true;
					}
				}
				if( !this.checked )  {
					checkAll = false;
				}
			} );
			if( checkAll ) {
				placeholder.find( 'input[value="all"]' ).attr( 'checked', true );
			}
		}
				
		this.setMode = function( value ) {
			mode = value;
		}
		
		this.setValueElement = function( id ) {
			valueElement = $( document.getElementById( id ) );			
		}
		
		this.render = function( placeholderID ) {
			var url = "index.php?/open/getAreaInfo";
			var ajaxOption = new Object;
			ajaxOption.dataType = 'JSON';
			ajaxOption.type = 'GET';
			ajaxOption.url = url;
			ajaxOption.success = function( response ) {
				data = response;
				placeholder = $( document.getElementById( placeholderID ) );
				initialize();
			}			
			$.ajax( ajaxOption );
		}
	}
	
	AreaControl.SELECT_MODE = 1;
	AreaControl.CHECKBOX_MODE = 2;
	
	module.exports = AreaControl;
} );