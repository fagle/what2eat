	/**
	 * 根据checkbox点选的时候自动进行提交 
	 */

$().ready(function(){
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
						try{
							  _data = $.parseJSON( data );
						}
						catch(e){
							console.log( e.name + ' : ' + e.message ) ;
							
							openDialog({content: '返回数据有误'});
							return ;
						}
						if( _data.status ){

							openDialog({ content: _data.message  });
						}
					}
					else{
							openDialog({ content: '网络操作失败！'  });
						}
				}
			);
			});
	});