define( function( require, exports, module ) {
	var EventBase = require( 'eventbase' );

    var AJAX_URL = "index.php?/log/getCommonSelect";
    
	function AreaControl() {
		EventBase.call( this );
		
        var self = this;
		var placeholder;
		var data;
		var mode = AreaControl.SELECT_MODE;
		var valueElement;
		var selectAreaIdList = [];

		var getDataItem = function( channelID ) {
			for( var i = 0; i < data.length; i++ ) {
				if( data[ i ].channelID == channelID ) {
					return data[ i ];
				}
			}
		}
		
		var initChannel = function(placeholderID, areafunc) {
			var html = '';
			html += "<select class='form-control area-control-channel-select' name='channel_id' id='channel_id'>";
			for( var i = 0; i < data.length; i++ ) {
				var item = data[ i ];
				html += "<option value="+ item.channelID +">" +  item.channelName  + "</option>";
			}
			html += "</select>";
			html += "<div class='area-control-area-placeholder'></div>";
			placeholder.html( html );
			
			var channelSelect = getChannelSelect();
			channelSelect.bind( 'change', function() {
				valueElement.val( '' );
				initArea( this.value );
				//add by qianweifeng 大区选择变化
				if(typeof(areafunc) == 'function'){
					areafunc();
					self.changeArea(placeholderID, areafunc);
				}
				//add end
				
			} );  
			initControlState();
		}
		
		var getChannelSelect = function() {
			return placeholder.children( 'select' );
		}
		
		var getAreaPlaceholder = function() {
			return placeholder.children( 'div' );
		}
		
		var initControlState = function() {
			var channelSelect = getChannelSelect();
			var areaIdString = $.trim( valueElement.val() );
			if( areaIdString.length == 0  ) {
                selectAreaIdList = [];
                initArea( channelSelect.val() );
				return;
			}
			selectAreaIdList = areaIdString.split( ',' );
			var channelId = getChannelIdByAreaID( selectAreaIdList[ 0 ] );
			channelSelect.val( channelId );
			initArea( channelId );
		}

        var setValue = function( value ) {
            valueElement.val( value );
            self.fireEvent('change', value );
        }

		var generateSelectHtml = function( areaList ) {
			var html = '<select class="form-control area-control-area-select" name="area" id="area">';
			html += "";
			for( var i = 0; i < areaList.length; i++ ) {
				var areaItem = areaList[ i ];
				if(areaItem.areaID !=0){
					html += '<option value="'+ areaItem.areaID +'">' + areaItem.areaName + "</option>";
				}
				
			}
			html += "</select>";
			getAreaPlaceholder().html( html )
			.find( 'select' ).bind( 'change', function() {
				//valueElement.val( this.value );
                    setValue(this.value);
			} );
			if( selectAreaIdList.length > 0 ) {
				getAreaPlaceholder().find( 'select' ).val( selectAreaIdList[ 0 ] );			
			}  
		}
		
		var generateCheckboxHtml = function( areaList ) {
			var html = '';
			for( var i = 0; i < areaList.length; i++ ) {
				var areaItem = areaList[ i ];
				html += '<label class="checkbox checkbox-inline">';
				html += '<input type="checkbox"  value="'+ areaItem.areaID +'" />' + areaItem.areaName;
				html += '</label>';
			}
			getAreaPlaceholder().html( html )
			.find( 'input' ).bind( 'change', function() {
				var checkboxes = placeholder.find('input[type="checkbox"]');
				var idList = [];
				checkboxes.each( function() {
					this.checked && idList.push( this.value );
				} );
                    setValue( idList.join( ',' ) );
				//valueElement.val( idList.join( ',' ) );
			} );
			
			getAreaPlaceholder().find( 'input[type="checkbox"]' ).each( function() {
				for( var i = 0; i < selectAreaIdList.length; i++ ) {
					var areaId = selectAreaIdList[ i ];
					if( this.value == areaId ) {
						this.checked = true;
					}
				}
			} );
		}
		
		var initArea = function( channel ) {
			var dataItem = getDataItem( channel );
			var areaList = dataItem.areaList;
			switch( mode ) {
				case AreaControl.SELECT_MODE:
					generateSelectHtml( areaList );
				break;
				case AreaControl.CHECKBOX_MODE:
					generateCheckboxHtml( areaList );
				break;
			}
		}
		
		var getChannelIdByAreaID = function( areaID ) {
			for( var i = 0; i < data.length; i++ ) {
				var areaList = data[ i ][ 'areaList' ];
				for( var j = 0; j < areaList.length; j++ ) {
					if( areaList[ j ].areaID == areaID ) {
						return data[ i ][ 'channelID' ];
					}
				}
			}
		}
				
		this.setMode = function( value ) {
			mode = value;
		}
		
		this.setValueElement = function( id ) {
			valueElement = $( document.getElementById( id ) );
		}
		
		this.render = function( placeholderID, areafunc) {
			var url = AJAX_URL;
			var ajaxOption = new Object;
			ajaxOption.dataType = 'JSON';
			ajaxOption.type = 'GET';
			ajaxOption.url = url;
			ajaxOption.async = false;
			ajaxOption.success = function( response ) {
				data = response;
				placeholder = $( document.getElementById( placeholderID ) );
                if( mode === AreaControl.CHECKBOX_ALL_MODE ) {
                    checkboxAllModeInit();
                } else {
                    initChannel(placeholderID, areafunc);
                }

				if(typeof(areafunc) == 'function'){
					self.changeArea( placeholderID, areafunc);
				}	
			}			
			$.ajax( ajaxOption );
		}

        var reRender = function() {
            //selectAreaIdList = [];
            var placeholderId = placeholder.attr('id');
            self.render( placeholderId );
        }

		//add by qianweifeng 大区联动变化
		this.changeArea = function(placeholderID, func){
			var placeholder = $( document.getElementById( placeholderID ) );
			var area = placeholder.find("div").find('select');
			area.bind("change", function(){
				var value = $(this).val();
				func(value);
			})
		}
		//add end


        function checkboxAllModeInit() {
            var html = "";
            for( var i = 0; i < data.length; i++ ) {
                var areaList = data[ i ].areaList;
                for( var j = 0; j < areaList.length; j++) {
                    var area = areaList[ j ];
                    var areaId = area.areaID;
                    var areaName = area.areaName;
                    var elementId = 'area_' + areaId;
                    html += '<label class="checkbox checkbox-inline" type="normal">';
                    html += '<input type="checkbox"  value="'+ areaId +'" />' + areaName;
                    html += '</label>';
                }
            }

            //html = html + html;
            //html = html + html;
            //html = html + html;

            var beforeHtml = ''
            beforeHtml += '<label class="checkbox checkbox-inline" type="check_all">';
            beforeHtml += '<input type="checkbox"  />全选';
            beforeHtml += '</label>';

            html = beforeHtml + html;
            placeholder.html( html )

            var checkall = placeholder.find( 'label[type=check_all] input' )
            var checkboxes = placeholder.find( 'label[type=normal] input' );
            checkboxes.bind( 'change', function() {
                var idList = [];
                checkboxes.each( function() {
                    this.checked && idList.push( this.value );
                } );
                setValue( idList.join( ',' ) );

                checkall.attr('checked', isCheckAll() );
            });
            checkall.bind('change', function(){
                checkboxes.attr('checked', this.checked );
                checkboxes.trigger('change');
            });

            function isCheckAll() {
                var isCheckAll = true;
                checkboxes.each( function(){
                    if( !this.checked ) {
                        isCheckAll = false;
                    }
                });
                return isCheckAll;
            }
        }

        this.endable = function() {
            reRender();
            placeholder.find('input[type=checkbox]').removeAttr('disabled');
            placeholder.find('select').removeAttr('disabled');
        }

        this.disable = function() {
            reRender();
            placeholder.find('input[type=checkbox]').attr('disabled', 'disabled');
            placeholder.find('select').attr('disabled', 'disabled');
        }
	}
	
	AreaControl.SELECT_MODE = 1;
	AreaControl.CHECKBOX_MODE = 2;
    AreaControl.CHECKBOX_ALL_MODE = 3;

    AreaControl.AreaInfo = function() {
        var data = [];
        var constructor = function() {
            var url = AJAX_URL;
            var ajaxOption = new Object;
            ajaxOption.dataType = 'JSON';
            ajaxOption.type = 'GET';
            ajaxOption.url = url;
            ajaxOption.success = function( response ) {
                data = response;
            }
            $.ajax( ajaxOption );
        }

        this.getAreaNameById = function( areaId ) {
            for( var i = 0; i < data.length; i++) {
                var areaList = data[i].areaList;
                for( var j = 0; j < areaList.length; j++ ) {
                    var areaItem = areaList[j];
                    if(areaItem.areaID == areaId) {
                        return areaItem.areaName;
                    }
                }
            }
        }

        constructor();
    }

	module.exports = AreaControl;
} );