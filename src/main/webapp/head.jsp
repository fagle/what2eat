<%--
  Created by IntelliJ IDEA.
  User: fagle
  Date: 2017/2/22
  Time: 10:35
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String path = request.getContextPath();
    String base_url = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
    final String RESOURCE_VERSION = "20150919";
%>

<script type="text/javascript" src="<%=base_url%>/style/third/jQuery/jQuery-1.8.3.min.js"></script>
<link rel="stylesheet" type="text/css" href="<%=base_url%>/style/third/bootstrap/bootstrap.min.css" />
<script type="text/javascript" src="<%=base_url%>/style/third/bootstrap/bootstrap.min.js"></script>
<link rel="stylesheet" type="text/css" href="<%=base_url%>/style/css/global.css" />
<link rel="stylesheet" type="text/css" href="<%=base_url%>/style/css/theme/default.css" />
<script type="text/javascript" src="js/base64.js"></script>
<script type="text/javascript" src="js/ts/m3dld/common_fns.js?v=<%=RESOURCE_VERSION%>"></script>
<script type="text/javascript" src="js/ts/m3dld/ajax_result_render.js?v=<%=RESOURCE_VERSION%>"></script>

<link rel="stylesheet" type="text/css" href="css/gm_style.css?v=<%=RESOURCE_VERSION%>" />
<script type="text/javascript" src="js/seajs/sea.js?v=<%=RESOURCE_VERSION%>"></script>
<script type="text/javascript" src="js/seajs/seajsconfig.js?v=<%=RESOURCE_VERSION%>"></script>

<script type="text/javascript">
    function openNewTab( txt, link ) {
        var id = new Date().getTime().toString( 16 );
        try{
            top.tabs.add({ id: id, pid: top.tabs.getSelfId(), url: link, display: txt } );
        } catch( ex ) {
            window.location.href = link;
        }
    }
</script>