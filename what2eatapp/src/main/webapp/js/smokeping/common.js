function getIpAddr() {
	var config = {
		'Company_Test': '192.168.12.21',
		'YunWei_Jumper': '122.224.197.39',
		'OSS_DB_3': '125.39.115.94',
		'M3TD_S2_DR': '119.90.35.138',
		'M3TD_S200_TS': '119.90.39.189',
		'OSS_DB_2': '223.203.210.196',
		'OSS_DB_7': '123.129.234.30',
		'YunWei_Hadoop_Master': '183.136.237.178',
		//'OSS_DB_8': '218.60.54.132',
		'OSS_DB_8': '218.60.58.58',
		'OSS_DB_6': '222.73.123.219',
		'M3TD_S1_DR': '114.80.150.108',
		'Zabbix_DB': '114.80.171.188',
		'YunWei_DB': '106.3.35.125'
	}
	
	var url = arguments[ 0 ] || window.location.href;
	var regex = /\d[_\d]+~\w+$/;
	var match = regex.exec( url );
	if( !match ) {
		return null;
	}
	var items = match[0].split( '~' );
	if( items.length != 2 ) {
		return null;
	}
	var dst = items[ 0 ];
	var src = items[ 1 ];
	dst = dst.replace( /\_/g, '.' );
	src = config[ src ];
	if( !src ) {
		console.log( 'The src ip does not exist, please update the config file' );
		return null;
	}
	var ip = {  'src': src ,'dst': dst };
	return ip;
}
