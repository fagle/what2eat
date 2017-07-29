//事件基础类
define( function( require, exports, module ) {
	var EventBase = function() {
		this.addListener = function ( type, listener ) {
			getListener( this, type, true ).push( listener );
		}	

		this.removeListener = function ( type, listener ) {
			var listeners = getListener( this, type );
			for( var i = 0; i < listeners.length; i++ ) {
				if( listeners[ i ] == listener ) {
					 listeners.splice( i, 1 );
					 return;
				}
			}
		}	
		
		this.fireEvent = function ( type ) {
			var listeners = getListener( this, type ),
				r, t, k;
			if ( listeners ) {
				k = listeners.length;
				while ( k -- ) {
					t = listeners[k].apply( this, arguments );
					if ( t !== undefined ) {
						r = t;
					}
				}    
			}
			if ( t = this['on' + type.toLowerCase()] ) {
				r = t.apply( this, arguments );
			}
			return r;
		}		
	}
			
	/**
	 * 获得对象所拥有监听类型的所有监听器
	 * @public
	 * @function
	 * @param {Object} obj  查询监听器的对象
	 * @param {String} type 事件类型
	 * @param {Boolean} force  为true且当前所有type类型的侦听器不存在时，创建一个空监听器数组
	 * @returns {Array} 监听器数组
	 */
	function getListener( obj, type, force ) {
		var allListeners;
		type = type.toLowerCase();
		return ( ( allListeners = ( obj.__allListeners || force && ( obj.__allListeners = {} ) ) )
			&& ( allListeners[type] || force && ( allListeners[type] = [] ) ) );
	}

	module.exports = EventBase;
} );
