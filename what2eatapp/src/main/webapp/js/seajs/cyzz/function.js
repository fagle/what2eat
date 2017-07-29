define( function( require, exports, module ){
	function operateResultView( currViewId, resultViewId, executedResult ) {
		var result = [];
		for( var i = 0; i < executedResult.length; i++ ) {
			var item = executedResult[ i ];
			var str = '<th>大区：</th>' + '<td>' + item.area_name + '</td>';
			str += "<th>状态：</th>" +  '<td>' + ( item.error === 0 ? '成功' : '失败' ) + '</td>' ;
			str += "<th>结果：</th>" + '<td>' + (item.msg || item.message) + '</td>';
			str = '<tr>'+ str +'</tr>';
			result.push( str );
		}
		var html = "<table cellpadding='1' cellspacing='1'>" + result.join('') + "</table>";
		html = "<div><h1>操作结果</h1>" + html + "</div>";
		html += '<input type="button" value="点击返回" onclick="$(\'#'+ resultViewId +'\').hide();$(\'#'+ currViewId +'\').show();">';

        $( '#' + currViewId ).hide();
        $( '#' + resultViewId ).show().html( html );
	}
	
	function operateResultView1(  currViewId, resultViewId, executedResult ) {
		var html =  '    <h1 style="margin-bottom:10px;">'+ executedResult.msg +'</h1>'+
					'    <input value="'+ executedResult.target_txt +'"'+
					'        onclick="openNewTab(\''+ executedResult.target_txt +'\', \''+ executedResult.target_url +'\')"'+
					'        type="button" />'+
					'        &nbsp;'+
					'    <input value="返 回"'+
					'        onclick="$(\'#' + currViewId  +'\').show();$(\'#' + resultViewId  +'\').hide()"'+
					'        type="button" />';

		$( '#' + resultViewId ).html( html ).show();
		$( '#' + currViewId ).hide();
	}

    function sgldEditActivityResultView( currViewId, resultViewId, executedResult, currWindow ) {
        var result = [];
        for( var i = 0; i < executedResult.length; i++ ) {
            var item = executedResult[ i ];
            var str = '<th>大区：</th>' + '<td>' + item.area_name + '</td>';
            str += "<th>状态：</th>" +  '<td>' + ( item.error === 0 ? '成功' : '失败' ) + '</td>' ;
            str += "<th>结果：</th>" + '<td>' + (item.msg || item.message) + '</td>';
            str = '<tr>'+ str +'</tr>';
            result.push( str );
        }
        var html = "<table cellpadding='1' cellspacing='1'>" + result.join('') + "</table>";
        html = "<div><h1>操作结果</h1>" + html + "</div>";
        html += '<input type="button" value="点击返回" onclick="window.location.reload();">';

        $( currWindow.document.getElementById( currViewId ) ).hide();
        $( currWindow.document.getElementById( resultViewId ) ).show().html( html );
    }


    function sgldAddSpacialPropResultView( currViewId, resultViewId, executedResult ) {
        var result = [];
        for( var i = 0; i < executedResult.length; i++ ) {
            var item = executedResult[ i ];
            var str = '<th>玩家ID：</th>' + '<td>' + item.player_id + '</td>';
            str += "<th>状态：</th>" +  '<td>' + ( item.error === 0 ? '成功' : '失败' ) + '</td>' ;
            str += "<th>结果：</th>" + '<td>' + (item.msg || item.message) + '</td>';
            str = '<tr>'+ str +'</tr>';
            result.push( str );
        }
        var html = "<table cellpadding='1' cellspacing='1'>" + result.join('') + "</table>";
        html = "<div><h1>操作结果</h1>" + html + "</div>";
        html += '<input type="button" value="点击返回" onclick="$(\'#'+ resultViewId +'\').hide();$(\'#'+ currViewId +'\').show();">';
        $( '#' + currViewId ).hide();
        $( '#' + resultViewId ).show().html( html );
    }
	
	function InitItemControl( templateID, itemList, onAdd ) {
		var self = this;
		var addButton = $( '<input type="button" value="增加" class="btn btn-link"/>' );
		var itemCount = 0;
		var limitCount = Number.MAX_VALUE;
		
		this.setLimitCount = function( value ) {
			limitCount = value;
		}
		
		this.getItemListElement = function() {
			return itemList;
		}
		
		this.getItemCount = function() {
			return itemCount;
		}
		
		this.addItem = function( obj ) {	
			itemCount++;
			var html = '';
			if( document.getElementById( templateID ) ) {
				html = $( '#' + templateID ).html();
			} else {
				html = templateID;
			}
			var itemEl = $( html );
			
			itemList.append( itemEl );
			itemEl.find( '.add_btn_placeholder' ).append( addButton ); 
		 	itemEl.find( 'input[name=remove]' ).bind( 'click', function() {
			 	if( itemEl.siblings().length == 0 ) {
				 	return;
			 	}
			 	if( itemEl.get( 0 ).contains( addButton.get( 0 ) ) ) {
					addButton.appendTo( itemEl.prev().find( '.add_btn_placeholder' ).eq(0) );
			 	}
				itemEl.remove();
                itemCount --;
		 	} );	  
			if( typeof( onAdd ) == 'function' ) {
				onAdd( itemEl, obj );
			}
		}

		addButton.bind( 'click', function() {
			if( itemCount >= limitCount ) {
				return;
			}
			self.addItem();
		} );
	}	
	
	exports.operateResultView = operateResultView;
	exports.operateResultView1 = operateResultView1;
    exports.sgldAddSpacialPropResultView = sgldAddSpacialPropResultView;
    exports.sgldEditActivityResultView = sgldEditActivityResultView;
	exports.InitItemControl = InitItemControl;
} );