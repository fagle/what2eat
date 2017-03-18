$(function()
{
	$(".cc_submenu").show();
	$(".menu").menu();
	
	$(".menu").css("border","0px");
	$(".cc_submenu").hide();
	
	$(".cc_item").mouseover(
		function(){
			var $head = $(this).find('.cc_title');
			var $content = $head.next();
			$head.removeClass('nav_leave').addClass('nav_on').height(25);
			$content.show();
		}
	);
	
	$(".cc_item").mouseleave(
		function(){
			var $head = $(this).find('.cc_title');
			var $content = $head.next();
			$head.removeClass('nav_on').addClass('nav_leave').height(20);
			$content.hide();
		}
	);

});
