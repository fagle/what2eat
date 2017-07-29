	/**
	 * 根据input修改的时候自动进行提交 
	 */

$().ready(function(){
			$('.input_change').change(function(){
				if( !$( this ).attr( 'submit_url') || $( this ).attr( 'submit_url') == '' ) {
					return ;
				}
				_submit_url = $( this ).attr( 'submit_url') ;
				
				$.post( _submit_url , { sort_by : $( this ).val()  } , function(data,status){
					if( status == 'success'){
						try{
							  _data =  data;
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
				,'json'
			);
			});
	});