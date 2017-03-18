//滚动
define(function( require, exports, module ){
    var LEFT = 0;
	var RIGHT = 1; 
	var _scrollEl;
	var _innerEl;
	var _distance;
	var leftbtn;
	var rightbtn;
	var isMove = false;
	
    var _tempDistance;
	
	var move = function( direction ) {
		if( isMove ) return ;
		isMove = true;
		var moveCount = 0;
		
		if( direction == RIGHT ) {
		    var scrollRight = _innerEl.width() - _scrollEl.width() - _scrollEl.scrollLeft();
		    if( scrollRight >= _distance) {
		        _tempDistance = _distance;
		    } else {
		        _tempDistance = scrollRight;
		    }
		} else {
		    var scrollLeft = _scrollEl.scrollLeft();
		    if( scrollLeft >= _distance ) {
		        _tempDistance = _distance;
		    } else {
		        _tempDistance = scrollLeft;
		    }
		}
		
		var timer = window.setInterval(function() {
			if( moveCount == _tempDistance ) {
			    window.clearInterval(timer);
				isMove = false;
				return;	
			}

			var speed =( _tempDistance - moveCount ) / 8;
			speed = speed > 0 ? Math.ceil( speed ) : Math.floor( speed );
			var left = _scrollEl.scrollLeft();
			left = direction == RIGHT ? left + speed : left - speed;
			_scrollEl.scrollLeft( left );
			moveCount += speed;
		}, 15 );		
	}
	

	var moveLeft = function() {
		move( LEFT );
	}
	
	var moveRight = function() {
		move( RIGHT );
	}
	
    var bindScroll = function( scrollElId, innerElId, leftid, rightid, distance ) {
		_distance = distance;			
	    _scrollEl = $( document.getElementById( scrollElId ) );
	    _innerEl = $( document.getElementById( innerElId ) );
		leftbtn = $( document.getElementById( leftid ) );
		rightbtn = $( document.getElementById( rightid ) );
		leftbtn.bind( 'click', moveLeft );
		rightbtn.bind( 'click', moveRight );
	}
	
    exports.bindScroll = bindScroll;
	//bindScroll( 'scroll_outer', 'scroll_inner', 'scroll_left_btn', 'scroll_right_btn', 300 );			
}); 