<%--
  Created by IntelliJ IDEA.
  User: Fagle
  Date: 2017/7/22 0022
  Time: 下午 7:25
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%--shiro 标签 --%>
<%@taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path;
%>
<html>
<head>
    <base href="<%=basePath%>"/>
    <title>movie list</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="shortcut icon" href="<%=basePath%>/favicon.ico"/>
    <link href="<%=basePath%>/js/common/bootstrap/3.3.5/css/bootstrap.min.css" rel="stylesheet"/>
    <link href="<%=basePath%>/css/common/base.css" rel="stylesheet"/>
    <script src="<%=basePath%>/js/common/jquery/jquery1.8.3.min.js"></script>
    <script src="<%=basePath%>/js/common/layer/layer.js"></script>
    <script src="<%=basePath%>/js/common/bootstrap/3.3.5/js/bootstrap.min.js"></script>
    <script src="<%=basePath%>/js/shiro.demo.js"></script>
</head>
<body>
<jsp:include page="common/config/top.jsp">
    <jsp:param name="index" value="4"/>
</jsp:include>


<div id="movie_container" class="container">
    <p>
    <div class="row" >
    <ul id="list">

    </ul>
    </div>
    </p>
</div>


</body>
<script>
    var baseUrl = $("script[baseUrl]").attr('baseUrl');
    $.getJSON(baseUrl + '/movies/list',{},function(result){
        for (var i in result) {
            var a = '<li><a href="/movies/play/'+ result[i] + '">' + result[i] + '</a> </li> <br>';
            console.log(a);
            console.log($('#list'));
            $("#list").append(a);
        }
    });
</script>
<link rel="stylesheet" type="text/css" href="<%=basePath%>css/media-player/reset.css"/>
<link rel="stylesheet" href="<%=basePath%>/js/common/bootstrap/3.3.5/css/bootstrap.min.css">
<%--<link rel="stylesheet" type="text/css" media="screen and (max-device-width: 400px)" href="tinyScreen.css" />--%>
<link rel="stylesheet" type="text/css" href="<%=basePath%>/css/media-player/willesPlay.css"/>
<script src="<%=basePath%>/js/common/jquery/jquery-1.11.3.min.js" type="text/javascript" charset="utf-8"></script>
</html>
