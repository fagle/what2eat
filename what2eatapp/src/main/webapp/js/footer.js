
document.ready = function(){
	
	var footer = {
		'id' : 'footer',
		'url' : 'http://om.dianhun.cn',
		'content' : 'Copyright © 2008 - 2014 Esoul Operation Management Department 魂淡平台. All Rights Reserved',
		'style' : {
			//'color' : '#fff',
			'TEXT-DECORATION' : 'none'
		}
	}
	var footer_dom = document.getElementById(footer.id);
	
	footer_dom.innerHTML = "<a style='TEXT-DECORATION:none;cursor:pointer' onclick=window.open('" + footer.url + "')>" + footer.content + "</a>";
}