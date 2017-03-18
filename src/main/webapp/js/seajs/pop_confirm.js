function pop_confirm(title,notice,btntxt1,btntxt2){
	$('<div class="mask"></div>' +
	  '<div class="pop"> ' +
			'<h2 class="f-fwn">' + title + '<span class="close"></span></h2> ' +
			'<div class="con">' +
				'<p><span class="ask"></span>' + notice + '</p>' +
				'<input type="submit" id = "confirm" class="btn_b1" value="' +btntxt1 +'"/> &nbsp;' +
				'<input type="reset" id = "cancle" class="btn_g2" value="' +btntxt2 +'"/>' +
			'</div>' +
		'</div>').appendTo('body');

	pos();
	window.onresize = pos;
	window.onscroll = pos;
	
	$(".pop .close").bind("click",function(){
		$(".pop,.mask").remove();
	});
}

function pos()
{
	var l = $( window ).width()/2 - 150;
	var t = $( document ).scrollTop() + ($( window ).height() / 2) - 100;
	if(t<200) t = 200;
	$('.mask').width( $( window ).width() );
	$('.mask').height( $( 'body' ).height() );
	$(".pop").css({display:"block",left:l,top:t});	
}



$(function(){	
	$(".sendBack").click(function(){
		var id = this.id;	
		pop_confirm("放回库存","确认放回库存吗？","确认","取消");
		$("#confirm").click(function(){
			$(".pop,.mask").remove();
			//放回库存
			var url = "index.php?app=sales_data&act=bankStock&id=" + id + "&t=" + new Date().getTime();		
			$.get(url,function(data){
		    	 if(1 == data) 
		    	 {		    		
		 			pop_confirm("退款","是否需要退款？","需要","不需要");
					$("#confirm,#cancle").click(function(){
						$(".pop,.mask").remove();
						location.reload(true);   //强制刷新页面
					});
		    	 }		    		
		    });							
		});	
		$("#cancle").click(function(){
			$(".pop,.mask").remove();	
		});	
	});

});