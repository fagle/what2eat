/***********************************************************/
/*                    TinyTips Plugin                      */
/*                      Version: 1.2                       */
/*                      Mike Merritt                       */
/*                Updated: April 26th, 2011                */
/***********************************************************/

(function($) {
	$.fn.tinyTips = function(options) {
		var defaults = {
			content: 'title',
			style: 'light'
		};
		
		var options = $.extend({}, defaults, options);
		var markup = '<div id="tinytip" class="' + options.style + '"><div id="tipcontent"></div></div>';
		var target = $(this);
		var title;
		target.live({
			mouseenter: function() {
				removeTooltip();
				if (options.content === 'title') {
					title = $(this).attr('title');
					$(this).attr('title', '');
					
					createTooltip($(this), title);
				} else { 
					createTooltip($(this), options.content);
				}
			
			}, 
			mouseleave: function() {
				
				if (options.content === 'title') {
					$(this).attr('title', title);
				}
				
				removeTooltip();
			}
		});
		
		function createTooltip(element, tipContent) {
			
			
			$('html').append(markup);
			$('#tinytip #tipcontent').append(tipContent);
			
			// Data for positioning the tooltip
			var targetPos = element.position();
			var targetPosX = targetPos.left;
			var targetPosY = targetPos.top;
			var targetX = element.outerWidth();
			var targetY = element.outerHeight();
			
			var winX = $(window).width();
			var winY = $(window).height();
			var winOffsetY = $(window).scrollTop();
			
			var tipX = $('#tinytip').outerWidth();
			var tipY = $('#tinytip').outerHeight();
			var arrowX = $('#tinytip #tiparrow').outerWidth();
			
			var winCheckY = (targetPosY - tipY) - winOffsetY;
			
			if(options.type == 'across')
			{
				var arrowPosX = (tipX / 2) - (arrowX / 2);
				var arrowPosY = tipY;
				
				var finalPosX = (targetPosX + (targetX)) ;
				var finalPosY = targetPosY -7;
				
				//$('#tinytip #tiparrow').css({top: arrowPosY+'px', left: arrowPosX+'px'});
				$('#tinytip').hide().css({top: finalPosY+'px', left: finalPosX+'px'});
				$('#tinytip').fadeIn(400);				
			}
			else if(options.type == 'auto')
			{
//				alert(target.attr('id'));
				var finalPosY = element.offset().top - 10;
				var finalPosX = element.offset().left - 10;
				$('#tinytip').hide().css({top: finalPosY+'px', left: finalPosX+'px'});
				$('#tinytip').fadeIn(400);					
			}
			else
			{
				if (winCheckY >= 0) {
					
					// If the tooltip should be on top
					var arrowPosX = (tipX / 2) - (arrowX / 2);
					var arrowPosY = tipY;
				
					var finalPosX = (targetPosX + (targetX / 2)) - (tipX / 2);
					var finalPosY = targetPosY - (tipY + 3);
					
					$('#tinytip #tiparrow').css({top: arrowPosY+'px', left: arrowPosX+'px'});
					$('#tinytip').hide().css({top: finalPosY+'px', left: finalPosX+'px'});
					$('#tinytip').fadeIn(400);
					
				} else if (winCheckY <= 0) {
					
					// If the tooltip should be on bottom
					var arrowPosX = (tipX / 2) - (arrowX / 2);
					var arrowPosY = -14;
					
					var finalPosX = (targetPosX + (targetX / 2)) - (tipX / 2);
					var finalPosY = (targetPosY + targetY) + 3;
					
					$('#tinytip #tiparrow').css({
						top: arrowPosY+'px', 
						left: arrowPosX+'px',
						'border-color': 'transparent transparent #e2e2e2 transparent'
					});
					$('#tinytip').hide().css({top: finalPosY+'px', left: finalPosX+'px'});
					$('#tinytip').fadeIn(400);
					
				}				
			}	
			
			
		}
		
		function removeTooltip() {
			$('#tinytip').hide().remove();
		}
		
	}
	
})(jQuery);


function removeTooltip() {
	$('#tinytip').hide().remove();
}