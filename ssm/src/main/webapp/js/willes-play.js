$(function() {
	var playVideo = $('video');
	var playPause = $('.playPause'); //播放和暂停
	var currentTime = $('.timebar .currentTime'); //当前时间
	var duration = $('.timebar .duration'); //总时间
	var progress = $('.timebar .progress-bar'); //进度条
	var volumebar = $('.volumeBar .volumewrap').find('.progress-bar');
	playVideo[0].volume = 1.0; //初始化音量
	playPause.on('click', function() {
		playControl();
	});
	$('.playContent').on('click', function() {
		playControl();
	}).hover(function() {
		$('.turnoff').stop().animate({
			'right': 0
		}, 500);
	}, function() {
		$('.turnoff').stop().animate({
			'right': -40
		}, 500);
	});
	$(document).click(function() {
		$('.volumeBar').hide();
	});
	playVideo.on('loadedmetadata', function() {
		duration.text(formatSeconds(playVideo[0].duration));
	});

	playVideo.on('timeupdate', function() {
		currentTime.text(formatSeconds(playVideo[0].currentTime));
		progress.css('width', 100 * playVideo[0].currentTime / playVideo[0].duration + '%');
	});
	playVideo.on('ended', function() {
		$('.playTip').removeClass('glyphicon-pause').addClass('glyphicon-play').fadeIn();
		playPause.toggleClass('playIcon');
	});
	
	$(window).keyup(function(event){
		event = event || window.event;
			if(event.keyCode == 32)playControl();
			if(event.keyCode == 27){
			$('.fullScreen').removeClass('cancleScreen');
			$('#willesPlay .playControll').css({
				'bottom': -48
			}).removeClass('fullControll');
			};
		event.preventDefault();
	});
	
	
	//全屏
	$('.fullScreen').on('click', function() {
		if ($(this).hasClass('cancleScreen')) {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozExitFullScreen) {
				document.mozExitFullScreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			}
			$(this).removeClass('cancleScreen');
			$('#willesPlay .playControll').css({
				'bottom': -48
			}).removeClass('fullControll');
		} else {
			if (playVideo[0].requestFullscreen) {
				playVideo[0].requestFullscreen();
			} else if (playVideo[0].mozRequestFullScreen) {
				playVideo[0].mozRequestFullScreen();
			} else if (playVideo[0].webkitRequestFullscreen) {
				playVideo[0].webkitRequestFullscreen();
			} else if (playVideo[0].msRequestFullscreen) {
				playVideo[0].msRequestFullscreen();
			}
			$(this).addClass('cancleScreen');
			$('#willesPlay .playControll').css({
				'left': 0,
				'bottom': 0
			}).addClass('fullControll');
		}
		return false;
	});
	//音量
	$('.volume').on('click', function(e) {
		e = e || window.event;
		$('.volumeBar').toggle();
		e.stopPropagation();
	});
	$('.volumeBar').on('click mousewheel DOMMouseScroll', function(e) {
		e = e || window.event;
		volumeControl(e);
		e.stopPropagation();
		return false;
	});
	$('.timebar .progress').mousedown(function(e) {
		e = e || window.event;
		updatebar(e.pageX);
	});
	//$('.playContent').on('mousewheel DOMMouseScroll',function(e){
	//	volumeControl(e);
	//});
	var updatebar = function(x) {
		var maxduration = playVideo[0].duration; //Video 
		var positions = x - progress.offset().left; //Click pos
		var percentage = 100 * positions / $('.timebar .progress').width();
		//Check within range
		if (percentage > 100) {
			percentage = 100;
		}
		if (percentage < 0) {
			percentage = 0;
		}

		//Update progress bar and video currenttime
		progress.css('width', percentage + '%');
		playVideo[0].currentTime = maxduration * percentage / 100;
	};
	//音量控制
	function volumeControl(e) {
		e = e || window.event;
		var eventype = e.type;
		var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));
		var positions = 0;
		var percentage = 0;
		if (eventype == "click") {
			positions = volumebar.offset().top - e.pageY;
			percentage = 100 * (positions + volumebar.height()) / $('.volumeBar .volumewrap').height();
		} else if (eventype == "mousewheel" || eventype == "DOMMouseScroll") {
			percentage = 100 * (volumebar.height() + delta) / $('.volumeBar .volumewrap').height();
		}
		if (percentage < 0) {
			percentage = 0;
			$('.otherControl .volume').attr('class', 'volume glyphicon glyphicon-volume-off');
		}
		if (percentage > 50) {
			$('.otherControl .volume').attr('class', 'volume glyphicon glyphicon-volume-up');
		}
		if (percentage > 0 && percentage <= 50) {
			$('.otherControl .volume').attr('class', 'volume glyphicon glyphicon-volume-down');
		}
		if (percentage >= 100) {
			percentage = 100;
		}
		$('.volumewrap .progress-bar').css('height', percentage + '%');
		playVideo[0].volume = percentage / 100;
		e.stopPropagation();
		e.preventDefault();
	}

	function playControl() {
			playPause.toggleClass('playIcon');
			if (playVideo[0].paused) {
				playVideo[0].play();
				$('.playTip').removeClass('glyphicon-play').addClass('glyphicon-pause').fadeOut();
			} else {
				playVideo[0].pause();
				$('.playTip').removeClass('glyphicon-pause').addClass('glyphicon-play').fadeIn();
			}
		}
		//关灯
	$('.btnLight').click(function(e) {
		e = e || window.event;
		if ($(this).hasClass('on')) {
			$(this).removeClass('on');
			$('body').append('<div class="overlay"></div>');
			$('.overlay').css({
				'position': 'absolute',
				'width': 100 + '%',
				'height': $(document).height(),
				'background': '#000',
				'opacity': 1,
				'top': 0,
				'left': 0,
				'z-index': 999
			});
			$('.playContent').css({
				'z-index': 1000
			});
			$('.playControll').css({
				'bottom': -48,
				'z-index': 1000
			});

			$('.playContent').hover(function() {
				$('.playControll').stop().animate({
					'height': 48,
				},500);
			}, function() {
				setTimeout(function() {
					$('.playControll').stop().animate({
						'height': 0,
					}, 500);
				}, 2000)
			});
		} else {
			$(this).addClass('on');
			$('.overlay').remove();
			$('.playControll').css({
				'bottom': 0,
			});
		}
		e.stopPropagation();
		e.preventDefault();
	});
});

//秒转时间
function formatSeconds(value) {
	value = parseInt(value);
	var time;
	if (value > -1) {
		hour = Math.floor(value / 3600);
		min = Math.floor(value / 60) % 60;
		sec = value % 60;
		day = parseInt(hour / 24);
		if (day > 0) {
			hour = hour - 24 * day;
			time = day + "day " + hour + ":";
		} else time = hour + ":";
		if (min < 10) {
			time += "0";
		}
		time += min + ":";
		if (sec < 10) {
			time += "0";
		}
		time += sec;
	}
	return time;
}

function getCookie(name) {
	var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
	var r = document.cookie.match(reg)
	return r ? unescape(r[2]) : null
}
window.hasBlackSide = Boolean(parseInt(getCookie('blackside_state')))

function setSize() {
	// // ssr
	// if (window.__INITIAL_STATE__) {
	// 	var version = window.__INITIAL_STATE__.pageVersion
	// 	if (version === 'v_new_home_4') {
	// 		part1SetSize(false)
	// 	} else {
	// 		// version: old
	// 		originSetSize()
	// 	}
	// 	return
	// }
	// // csr
	// originSetSize()
	part1SetSize(false)
}
function checkVersion() {
	let version

	if (window.__INITIAL_STATE__) {
		version = window.__INITIAL_STATE__.pageVersion
		if (version === 'v_new_home_4') {
			return 1
		} else {
			return 0
		}
	}

	return 0
}

function constructStyleString(selector, style) {
	var res = selector + ' {'
	var ks = Object.keys(style)
	for (var i = 0; i < ks.length; i++) {
		res += ks[i] + ': ' + style[ks[i]] + ';'
	}
	return res + '}\n'
}

function part1SetSize(biggerMode) {
	var isWide = window.isWide
	var maxw = 1694
	var minw = 375
	// 右侧宽度
	var h = window.innerHeight;
	var w = Math.max(((document.body && document.body.clientWidth) || window.innerWidth), 1100)
	var rw = biggerMode ? (innerWidth > 1680 ? 360 : 320) : (innerWidth > 1680 ? 411 : 350)
	// 根据屏幕高度计算出来的左侧视频的宽度

	var w1 = parseInt((h - (innerWidth > 1690 ? 300 : 290)) * 16 / 9),

		// 根据屏幕宽度计算出来的左侧视频的宽度
		w2 = w - 56 * 2 - rw,
		min = w1 > w2 ? w2 : w1;

	if (min < minw) { min = minw }
	if (min > maxw) { min = maxw }

	var vw = min + rw, vh;

	if(window.isWide) {
		vw = vw - 125
		min = min - 100
	}
	let vd = vw - (isWide ? -30 : rw);
	if (innerWidth < 600) {
		vd = innerWidth;
	}
	if (window.hasBlackSide && !window.isWide) {
		// 测试通过 - 90
		vh = Math.round(((min - 14) + (isWide ? rw : 0)) * (9 / 16) + (innerWidth > 1680 ? 56 : 46)) + 96
	} else {
		// 宽屏
		vh = Math.round((min + (isWide ? rw : 0)) * (9 / 16)) + (innerWidth > 1680 ? 56 : 46)
	}

	const leftContainerW = vw - rw
	let leftObserveContentW
	if (leftContainerW <= 924) {
		leftObserveContentW = leftContainerW
	} else if (leftContainerW <= 1232) {
		leftObserveContentW = 924
	} else {
		leftObserveContentW = leftContainerW * 0.75
	}

	setSizeStyle.innerHTML = constructStyleString('.video-container-v1', {
			width: 'auto',
			// 写死padding，不然在ipad上会进行抖动
			padding: '0 10px'
		})
		+ constructStyleString('.left-container', {
			width: (vw - rw) + 'px'
		})
		+ constructStyleString('.left-container-under-player', {
			// width: leftObserveContentW + 'px'
			width: '100%'
		})
		+ constructStyleString('#bilibili-player', {
			width: vw - (isWide ? -30 : rw) + 'px',
			height: vh + 'px',
			position: isWide ? 'relative' : 'static',
		})
		+ constructStyleString('#danmukuBox', {
			'margin-top': isWide ? vh + 28 + 'px' : '0'
		})
		+ constructStyleString('#playerWrap', {
			height: vh + 'px'
		})
		+ constructStyleString('#willesPlay', {
			width: vd + 'px',
			height: vh + 'px',
			position: isWide ? 'relative' : 'static',
			margin: '2px auto',
			'box-shadow': '0px 0px 15px #333333'
		})
}

function originSetSize() {
	var isWide = window.isWide
	var maxw = 1630
	var minw = 638
	// 右侧宽度
	var rw = 350
	var h = window.innerHeight
	w = window.innerWidth
	// 根据屏幕高度计算出来的左侧视频的宽度
	w1 = parseInt((0.743 * h - 108.7) * 16 / 9),
		// 根据屏幕宽度计算出来的左侧视频的宽度
		w2 = w - 76 * 2 - rw,
		min = w1 > w2 ? w2 : w1;
	if (min < minw) { min = minw }
	if (min > maxw) { min = maxw }
	var vw = min + rw, vh;
	if (window.hasBlackSide && !window.isWide) {
		vh = Math.round(((min - 14) + (isWide ? rw : 0)) * (9 / 16) + 46) + 96
	} else {
		vh = Math.round((min + (isWide ? rw : 0)) * (9 / 16)) + 46
	}
	var styleString = constructStyleString('.v-wrap', {
			width: vw + 'px',
			// 写死padding，不然在ipad上会进行抖动
			padding: '0 68px'
		})
		+ constructStyleString('.l-con', {
			width: (vw - rw) + 'px'
		})
		+ constructStyleString('#bilibili-player', {
			width: vw - (isWide ? 0 : rw) + 'px',
			height: vh + 'px',
			position: isWide ? 'relative' : 'static'
		})
		+ constructStyleString('#danmukuBox', {
			'margin-top': isWide ? vh + 28 + 'px' : '0'
		})
		+ constructStyleString('#playerWrap', {
			height: isWide ? vh - 0 + 'px' : 'auto'
		})
	setSizeStyle.innerHTML = styleString
}

setSize()
window.addEventListener('resize', function () {
	setSize()
})

//记忆宽屏bugfix
window.PlayerAgent = {
	player_widewin: function() {
		if (checkVersion() === 1) {
			window.scrollTo(0, 60) // 方案二/方案三切换宽屏模式时，不需要滚动
		}
		window.isWide = true
		setSize()
	},
	// 窄屏
	player_fullwin: function (boo) {
		window.scrollTo(0, 0)
		window.isWide = false
		setSize()
	},
	toggleBlackSide: function (v) {
		window.hasBlackSide = v
		setSize()
	}
}