function getLodop(oOBJECT,oEMBED){
/**************************
  本函数根据浏览器类型决定采用哪个对象作为控件实例：
  IE系列、IE内核系列的浏览器采用oOBJECT，
  其它浏览器(Firefox系列、Chrome系列、Opera系列、Safari系列等)采用oEMBED,
  对于64位浏览器指向64位的安装程序install_lodop64.exe。
**************************/
        var LODOP=oEMBED;		
	try{		     
		if (navigator.appVersion.indexOf("MSIE")>=0) 
			LODOP=oOBJECT;
	     return LODOP; 
	}catch(err){
	     return LODOP; 
	}
}
