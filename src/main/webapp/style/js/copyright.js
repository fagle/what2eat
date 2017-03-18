
document.ready = function(){
	var footer = {
		'id' : 'copyright',
		'class' : 'copyright',
		'url' : 'http://om.dianhun.cn/',
		'content' : 'Copyright © 2008 - 2015 Esoul Operation Management Department 魂淡平台. All Rights Reserved'
	}
	
	var dom = document.getElementById(footer.id);
	dom.innerHTML = '<span style="cursor:pointer; text-decoration:none;" onclick="window.open(\'' + footer.url + '\')">' + footer.content + '</span>';
}