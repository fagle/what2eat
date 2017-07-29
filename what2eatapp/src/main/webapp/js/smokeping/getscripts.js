function callScript(url, loaded, error, charset) {
	var script = document.createElement("script");
	if (typeof charset == "string") script.charset = charset;
	script.onreadystatechange = function() {
		switch (this.readyState) {
			case "complete":
			case "loaded":
				if (typeof loaded == "function") loaded();
				if (script.parentNode) script.parentNode.removeChild(script);
				break;
		}
	}
	script.onload = function() {
		if (typeof loaded == "function") loaded();
		if (script.parentNode) script.parentNode.removeChild(script);
	}
	script.onerror = function() {
		if (typeof error == "function") error();
		if (script.parentNode) script.parentNode.removeChild(script);
	}

	script.type = "text/javascript";
	script.defer = "true";
	script.src = url;
	var parent = document.getElementsByTagName("HEAD")[0] || document.documentElement;
	parent.insertBefore(script, parent.firstChild);
}

function loadCssFile( url ) {
	var linkElement = document.createElement( 'link' );
	linkElement.type = 'text/css';
	linkElement.rel = 'stylesheet';
	linkElement.href = url;
	var parent = document.getElementsByTagName("HEAD")[0] || document.documentElement;
	parent.insertBefore(linkElement, parent.firstChild);
}

var d = new Date().getTime().toString( '16' );

callScript( 'http://gm.om.dianhun.cn/js/smokeping/jquery.js', function() {	
	callScript( 'http://gm.om.dianhun.cn/js/smokeping/highcharts.js' );
	callScript( 'http://gm.om.dianhun.cn/js/smokeping/common.js?d=' + d );
	callScript( 'http://gm.om.dianhun.cn/js/smokeping/smokeping.js?d=' + d );
	loadCssFile( 'http://gm.om.dianhun.cn/js/smokeping/smokeping.css?v=' + d );
} );


//callScript( 'http://192.168.12.142/samba/gm_chh/js/smokeping/jquery.js', function() {
//	callScript( 'http://192.168.12.142/samba/gm_chh/js/smokeping/highcharts.js?d=' + d );
//	callScript( 'http://192.168.12.142/samba/gm_chh/js/smokeping/common.js?d=' + d );
//	callScript( 'http://192.168.12.142/samba/gm_chh/js/smokeping/smokeping.js?d=' + d );
//	loadCssFile( 'http://192.168.12.142/samba/gm_chh/js/smokeping/smokeping.css?v=' + d );
//} );