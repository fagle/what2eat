$().ready(function(){
		$('.redirect').live('click',function(){
			_url =  $(this).attr( 'url' );
			__target = $(this).attr( 'target' ); 
			_target =  function (){
					return __target;
			};
		
			
			$.get( _url , function( data ,status ){
					//console.log( data );
					$( '#' + _target() ).html( data );
				});
			
		});
		
		$('.title-title').tooltip('show');
	}
);