  $(function(){
  		//button 提交表单
  		$('.submit').click(function(){

  			_action = $(this).attr('action') + '/' + Math.random();

  			_form_id = $(this).attr('form_id');
  			_form_data = $('#' + _form_id ).serialize();
  			__redirect =  $(this).attr('redirect');
  			var _redirect = function () { return __redirect };
  			
  			
  			
  			$.post( _action , _form_data, function(data,status){
  				var ___redirect = _redirect() ;
  				if(status != 'success'){
  					dialog( '错误' ,'表单操作出错！' );
  				}
  				else{
  					var _data = data;
  					if( Number(data.status) == 1 ){
  						dialog({ content: _data.message ,confirm:function(){ location.href = ___redirect } } );
  					}
  					else{
  						dialog({ content: _data.message  });
  					}
  				}
  			},'json');
  			
  		});
  		
  		
  });
 
