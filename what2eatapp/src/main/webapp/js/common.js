//针对td数据提取各页面表单提交的日期输入检测功能
( function() {	
	function isDate( s ){
		if( !s ) {
			return false;
		}
		
		var s    = s.replace( /\-|\/|\./g,"/" );
		var p    = s.split( "/" );
		var y    = p[0];
		var m    = p[1];
		var d    = p[2];
		
		var reg = /^\d+$/; 
		if( !reg.test( y ) || !reg.test( m ) || !reg.test( d ) ) {
			return false;
		}
		
		y = parseInt( y );
		m = parseInt( m ) - 1;
		d = parseInt( d );
		var a    = new Date( y, m, d );
		if( a.getFullYear() != y || a.getMonth() != m || a.getDate() != d ){
			return false;
		} else {
			return true;
		}
	}
	
	var dateFields = [];
	var errorMsg;
	
	var dateValidator = {		
		addDateField: function( id, errorMsg ) {
			dateFields.push(  { element: document.getElementById( id ), errorMsg: errorMsg } );
		},
		
		validate: function() {
			errorMsg = '';
			isValid = true;
			for( var i = 0; i < dateFields.length; i++ ) {
				var dateItem = dateFields[ i ];
				if( !dateItem[ 'element' ] ) {
					continue;
				}
				var date = $.trim( dateItem[ 'element' ].value )
				if( !date ) {
					continue;
				}
				if( !isDate( date ) ) {
					isValid = false;
					errorMsg = dateItem[ 'errorMsg' ];
					break;
				}
			}
			return isValid;
		},
		
		getErrorMessage: function() {
			return errorMsg;
		}
	}
	
	window[ 'dateValidator' ] = dateValidator;
} )();

$().ready( function () {
		/*
		if( window.innerWidth < 1250 ){
			$('.table_auto').width(1250) ;
		}
	 
		window.onresize = function(){
			if( window.innerWidth < 1250 ){
				$('.table_auto').width(1250) ;
			}
			else{
				$('.table_auto').width( window.innerWidth -50 ) ;
			}
		}
		*/
		/**
		 * form_id 表单ID
		 * submit_url 提交地址
		 * redirect 跳转路径
		 */
		$('.submit').live('click' ,function(){ //提交表单
  			_action = $(this).attr('submit_url') + '/' + Math.random();
  			_form_id = $(this).attr('form_id');
  			_form_data = $('#' + _form_id ).serialize();
  			__redirect =  $(this).attr('redirect');
  			_type = $(this).attr('method') ;
  			_dataType = $(this).attr('dataType') ;
  			_type = _type == undefined ? 'post' : _type ;
  			_dataType = _dataType == undefined ? 'json' : _dataType ;
  			
  			var _redirect = function () { return __redirect };
  			$.ajax( {
  				url :_action,
  				data : _form_data,
  				type : _type,
  				dataType : _dataType,
  				cache : false,
  				success : function (data){
					if( Number(data.status) == 1 ){
						$('#modalTitle').empty();
						$('#modal_body').empty();
						
						$('#modalTitle').append( data.title );
						$('#modal_body').append( data.message );
						$('#modal').modal();
						$('#modal').on('hidden', function(){
							location.href = __redirect
						});
					}
					else{
						$('#modalTitle').empty();
						$('#modal_body').empty();
						
						$('#modalTitle').append( data.title );
						$('#modal_body').append( data.message );
						$('#modal').modal();
					}
  				} 
  				,
  				error: function ( req, status , track ){
  					console.log( 'request false' );
  					console.log( 'req' + req ) ;
  					console.log( 'status' + status ) ;
  					console.log( 'track' + track ) ;
  				}
  			} );
  			
  		});
		

		$(':checkbox[tag]').change( function(){
			_id = $(this).val();
				if( $(this).attr( 'checked' )  ) {
					 $(':checkbox[parent_id="'+ _id +'" ]').attr( 'checked','checked' ) ;
				}
				else{
					$(':checkbox[parent_id="'+ _id +'" ]').removeAttr( 'checked' );
				}
			});
		$(':checkbox[parent_id]').change( function(){
			_parent_id = $(this).attr('parent_id') ;
		
			if( $(this).attr( 'checked' )  ){
				if( $(':checkbox[parent_id="'+ _parent_id +'" ]').length == $(':checkbox[parent_id="'+ _parent_id +'" ]:checked').length ){
					$('#' + $(this).attr('parent_id') ).attr( 'checked' ,'checked' );
				}
			}
			else{
				$('#' + $(this).attr('parent_id')).removeAttr( 'checked' );
			}
		});
//全选
		$('#checked_all').click(function(){
			$(':checkbox').attr('checked','checked');
		});
//取消全选		
		$('#un_checked_all').click(function(){
			$(':checkbox').removeAttr('checked' );
		});

		/**
		 * form_id
		 * 提交选 定的checkbox
		 * submit_url
		 * 会刷新当前页
		 * 
		 */
		$('.button_done').click(function(){ //

			if( $(':checkbox:checked').length > 0 ){
				_id = $('#' + $(this).attr('form_id')).serialize() ;
				_type = $(this).attr('method') ;
	  			_dataType = $(this).attr('dataType') ;
	  			_type = _type == undefined ? 'post' : _type ;
	  			_dataType = _dataType == undefined ? 'json' : _dataType ;
	  			
	  			
	  			$.ajax( {
	  				url : $(this).attr('submit_url'),
	  				data : _id,
	  				type : _type,
	  				dataType : _dataType,
	  				cache : false,
	  				success : function (data){
	  				if( Number( data.status ) == 1){
						$('#modalTitle').empty();
						$('#modal_body').empty();
						
						$('#modalTitle').append( data.title );
						$('#modal_body').append( data.message );
						$('#modal').modal();
						$('#modal').on('hidden', function(){
							location.replace( location.href )
						});
					}
					else{
						alert( data.message );
					}
	  				} 
	  				,
	  				error: function ( req, status , track ){
	  					console.log( 'request false' );
	  					console.log( 'req' + req ) ;
	  					console.log( 'status' + status ) ;
	  					console.log( 'track' + track ) ;
	  					
	  				}
	  			} );
			}
			else{
//				openDialog({content: '请选择后，再进行操作！'});
			}
		});
		/**
		 * checkbox 自动触发
		 * submit_url
		 */
		$(':checkbox').change(function(){
			if( !$( this ).attr( 'submit_url') || $( this ).attr( 'submit_url') == '' ) {
				return ;
			}
			_submit_url = $( this ).attr( 'submit_url') ;
			
			if( $( this ).attr( 'checked' ) ){
					_param_val = 1;
				}
			else{
					_param_val = 2 ;
			}
			
			$.post( _submit_url , { id : $( this ).val() , param_val : _param_val } , function(data,status){
				if( status == 'success'){
					if( Nubmer (_data.status ) ==1) {
						$('#modalTitle').empty();
						$('#modal_body').empty();
						
						$('#modalTitle').append( data.title );
						$('#modal_body').append( data.message );
						$('#modal').modal();
						$('#modal').on('hidden', function(){
							location.replace( location.href )
						});
					}
				}
				else{
						$('#modalTitle').empty();
						$('#modal_body').empty();
						
						$('#modalTitle').append( data.title );
						$('#modal_body').append( data.message );
						$('#modal').modal();
					}
			},'json'
		);
		});
		$('.back').click( function (){
			history.back();
		});
	//初始化弹框
	$('body').append('<div id="modal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
				 			'<div class="modal-header">' +
				 				'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>' +
				 				'<h3 id="modalTitle">操作提示！</h3>' +
							'</div>' +
							'<div class="modal-body" id="modal_body"> </div>' +
							'<div class="modal-footer">' +
								'<button class="btn btn-primary" data-dismiss="modal" aria-hidden="true">关闭</button>' +
							'</div>' +
				'</div>');
	/**权限树**/
	$('.tree').change(function(){
		
		if( $(this).attr('checked') =='checked'){
			if( $(this).parent().find(':checkbox').length >1 ){
				$(this).parent().find(':checkbox').attr( 'checked' ,'checked');
			}
		}
		else{
			if( $(this).parent().find(':checkbox').length >1 ){
				$(this).parent().find(':checkbox').removeAttr( 'checked' );
			}
		}
//		console.log( $(this).parent().find(':checkbox').length);
		
	});
	$('.tree_root').children().children().children('div').hide().insertBefore('<i class="icon-resize-full" ></i>');
	$('.tree_root').children().children().children('span').toggle(function(){
			$(this).next( 'div' ).show();
		},
		function(){
			$(this).next( 'div' ).hide();
		}
		);
	/**权限树 END**/
	
	/**导航菜单 管理员菜单与普通菜单切换 **/
	$('.admin').hide();
	$('.icon-user').toggle( function(){
		$('.admin').show();
		$('.general').hide();
		
	},function(){
		$('.admin').hide();
		$('.general').show();
	});
	/**导航菜单 管理员菜单与普通菜单切换 END**/
	
	/** 工具提示**/
	$('.title_tools').tooltip( );	//默认方向向上
	$('.title_tools_bottom').tooltip({placement:'bottom'}); //强制指定为向下
	/** 工具提示 END**/
	
	/**
	 * 
	 */
	if( $('.date').length != 0 ) $('.date').datetimepicker({
		autoclose:true,
		todayBtn:true,
		todayHighlight:true,
		language:'zh-CN',
        forceParse:false ,
         pickerPosition: "bottom-left" ,
		});
	$('#go').click(function(){
		if( $('#iuin').val() == '' ){
			$('#modalTitle').empty();
			$('#modal_body').empty();
			
			$('#modalTitle').append( '操作提示' );
			$('#modal_body').append( '必须指定用户ID进行查询' );
			$('#modal').modal();
			
			return false;
		}
		if( $('#iUin').val() == '' ){
			$('#modalTitle').empty();
			$('#modal_body').empty();
			
			$('#modalTitle').append( '操作提示' );
			$('#modal_body').append( '必须指定用户ID进行查询' );
			$('#modal').modal();
			
			return false;
		}
		
		$('#search').submit();
	});
	$('#mygo').click(function(){
		if( $('#iuin').val() == '' && $('#way').val() == 0){
			$('#modalTitle').empty();
			$('#modal_body').empty();
			
			$('#modalTitle').append( '操作提示' );
			$('#modal_body').append( '必须指定用户ID进行查询' );
			$('#modal').modal();
			
			return false;
		}
		if( $('#iUin').val() == '' && $('#way').val() == 0){
			$('#modalTitle').empty();
			$('#modal_body').empty();
			
			$('#modalTitle').append( '操作提示' );
			$('#modal_body').append( '必须指定用户ID进行查询' );
			$('#modal').modal();
			
			return false;
		}
		
		$('#search').submit();
	});
	$('#login_go').click(function(){
		if( $('#way').val() == '0' && $('#iUin').val() == '' && $('#IP').val() == ''){
			$('#modalTitle').empty();
			$('#modal_body').empty();
			
			$('#modalTitle').append( '操作提示' );
			$('#modal_body').append( '必须指定用户ID或IP进行查询' );
			$('#modal').modal();
			
			return false;
		}
		if( $('#way').val() == '1' && $('#file').val() == '' && $('#IP').val() == ''){
			$('#modalTitle').empty();
			$('#modal_body').empty();
			
			$('#modalTitle').append( '操作提示' );
			$('#modal_body').append( '必须指定用户ID或IP进行查询' );
			$('#modal').modal();
			
			return false;
		}
		
		var date1 = new Date($('#dtLogTime_start').val());
		var date2 = new Date($('#dtLogTime_end').val());
		var days = Math.floor((date2.getTime()-date1.getTime())/(24*3600*1000));
		if( days<0 || days > 91){
			$('#modalTitle').empty();
			$('#modal_body').empty();
			
			$('#modalTitle').append( '操作提示' );
			$('#modal_body').append( '日期间隔不能超过3个月' );
			$('#modal').modal();
			
			return false;
		}
		
		$('#search').submit();
	});
	
	
	
    $('#td_go').click(function(){
        if( $('#way').val() == '0' && $('#char_id').val() == ''){
            $('#modalTitle').empty();
            $('#modal_body').empty();
            
            $('#modalTitle').append( '操作提示' );
            $('#modal_body').append( '必须指定用户ID进行查询' );
            $('#modal').modal();
            return;
        }
        if( $('#way').val() == '1' && $('#file').val() == '' ){
            $('#modalTitle').empty();
            $('#modal_body').empty();
            
            $('#modalTitle').append( '操作提示' );
            $('#modal_body').append( '请添加用户ID文件进行查询' );
            $('#modal').modal();
            return;
        }
        if( !dateValidator.validate() ) {
            $('#modalTitle').empty();
            $('#modal_body').empty();
            
            $('#modalTitle').append( '操作提示' );
            $('#modal_body').append( dateValidator.getErrorMessage() );
            $('#modal').modal();
        	return;
        }
        $('#search').submit();
    });
	//格式化导航CSS，解决程序生成导航时的背景色一致性问题
	$('.dropdown-menu a').removeClass('dropdown-toggle') ;
});

function in_array(stringToSearch, arrayToSearch) {
	for (s = 0; s < arrayToSearch.length; s++) {
		thisEntry = arrayToSearch[s].toString();
		if (thisEntry == stringToSearch) {
			return true;
		}
	}
	return false;
}

function dialog(option){
	var def = {title:'提示',content:'',confirm:function(){$("#alert").remove();return false;}};
	option = $.extend(def,option);
	
	var dialog = '<div class="modal hide" id="alert" style="display: none;" aria-hidden="true">' + 
				 '<div class="modal-header"><button type="button" class="close" data-dismiss="modal">×</button><h3>' + option.title + 
				 '</h3></div><div class="modal-body"><p>' + option.content + '</p>' + 
				 '</div><div class="modal-footer"> <a href="#" class="btn btn-primary" data-dismiss="modal">确定</a></div></div>';
	
	$('body').append(dialog);
	
	$("#alert").on('hidden',option.confirm);
	
	$("#alert").modal('show');
}

function parseIdoInfo(msg)
{
	if(msg.status == 1)
		dialog({content:msg.message + '请耐心等待'});
	else
		dialog({content:msg.message});
}

function checkID( _id ){
    var _s = $('#' + _id ).val();
    var _r = _s.search( "[A-Z]{1}[0-9]{3}" );
    return  _r == -1 ? false : true ; 
}


function checkItemID( _id ){
    var _s = $('#' + _id ).val();
    var _r = _s.search( "[A-Z]{1,2}[0-9]{3}" );
    return  _r == -1 ? false : true ; 
}

function getSepdate(date)
{
	var arr = date.split(' ');
	var result = {};
	
	if(arr[0])
	{
		var y = arr[0].split('-');
		result['year'] = y[0];
		result['month'] = y[1];
		result['day'] = y[2];		
	}	

	if(arr[1])
	{
		var t = arr[1].split(':');
		result['hour'] = parseInt(t[0],10);
		result['minute'] = parseInt(t[1],10);
	}else{
		result['hour'] = 0;
		result['minute'] = 0;
	}	
	
	
	return result;
}

//通过bootstrap 生成的对话框。
function dialog(option){
	var def = {title:'提示',content:'',confirm:function(){$("#alert").remove();return false;}};
	option = $.extend(def,option);
	
	var dialog = '<div class="modal hide" id="alert" style="display: none;" aria-hidden="true">' + 
				 '<div class="modal-header"><button type="button" class="close" data-dismiss="modal">×</button><h3>' + option.title + 
				 '</h3></div><div class="modal-body"><p>' + option.content + '</p>' + 
				 '</div><div class="modal-footer"> <a href="#" class="btn btn-primary" data-dismiss="modal">确定</a></div></div>';
	
	$('body').append(dialog);
	
//	$("#alert").on('hidden',option.confirm);
	
	$("#alert").modal('show');
}