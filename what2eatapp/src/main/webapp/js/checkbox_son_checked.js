$(function(){
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
				
				$('#checked_all').click(function(){
					$(':checkbox').each(function() {
						this.checked = true;
						$(this).closest('.checker > span').addClass('checked');
					})
				});
				$('#un_checked_all').click(function(){
					$(':checkbox').each(function() {
						this.checked = false;
						$(this).closest('.checker > span').removeClass('checked');
					})
				});
				
				$('.button_done').click(function(){

					if( $(':checkbox:checked').length > 0 ){
						var _id = $('#' + $(this).attr('form_id')).serialize() ;

						$.post( $(this).attr('redirect') + '/' + Math.random() , _id , function(data,status){
							if( status == 'success'){
								try{
									  _data = $.parseJSON( data );
								}
								catch(e){
									console.log( e.name + ' : ' + e.message ) ;
									
									dialog({content: '返回数据有误'});
									return ;
								}
								if( _data.status == 1){
									dialog({ content: _data.message ,confirm : function(){  location.replace(location); } });
								}
							}
							else{
									dialog({ content: '网络操作失败！'  });
								}
						});
					}
					else{
						dialog({content: '请选择后，再进行操作！'});
					}
				});
				
				
 })