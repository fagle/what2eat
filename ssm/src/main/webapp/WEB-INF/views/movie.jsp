<%@ page import="java.net.URLEncoder" %><%--
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
    String reqFileName = URLEncoder.encode((String)request.getAttribute("file"), "UTF-8");
%>
<html>
<head>
    <base href="<%=basePath%>"/>
    <title>${file}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <style id="setSizeStyle"></style>
    <link rel="shortcut icon" href="<%=basePath%>/favicon.ico"/>
    <link href="<%=basePath%>/js/common/bootstrap/3.3.5/css/bootstrap.min.css" rel="stylesheet"/>
    <link href="<%=basePath%>/css/common/base.css" rel="stylesheet"/>
    <link rel="stylesheet" type="text/css" href="<%=basePath%>css/media-player/reset.css"/>
    <link rel="stylesheet" type="text/css" href="<%=basePath%>/css/media-player/willes-play.css"/>
    <link rel="stylesheet" href="<%=basePath%>/js/common/bootstrap/3.3.5/css/bootstrap.min.css">
    <%--<link rel="stylesheet" type="text/css" media="screen and (max-device-width: 400px)" href="tinyScreen.css" />--%>
    <script src="<%=basePath%>/js/common/jquery/jquery1.8.3.min.js"></script>
    <script src="<%=basePath%>/js/common/layer/layer.js"></script>
    <script src="<%=basePath%>/js/common/bootstrap/3.3.5/js/bootstrap.min.js"></script>
    <script src="<%=basePath%>/js/shiro.demo.js"></script>
</head>
<body>
<jsp:include page="common/config/top.jsp">
    <jsp:param name="index" value="4"/>
</jsp:include>
<script>window.setSizeStyle=document.getElementById("setSizeStyle")</script>

<div id="movie_container" class="container">
    <%--<h3>看电影咯，123好哟啊好哟</h3>--%>

    <div class="row">
        <div id="willesPlay">
            <div class="playHeader">
                <div class="videoName">${file}</div>
            </div>
            <div class="playContent">
                <div class="turnoff">
                    <ul>
                        <li><a href="javascript:" title="喜欢" class="glyphicon glyphicon-heart-empty"></a></li>
                        <li><a href="javascript:" title="关灯"
                               class="btnLight on glyphicon glyphicon-sunglasses"></a></li>
                        <li><a href="javascript:" title="分享" class="glyphicon glyphicon-share"></a></li>
                    </ul>
                </div>
                <video width="100%" height="100%" id="playVideo">
                    <source src="<%=basePath%>/movies?name=<%=reqFileName%>"
                            type="video/mp4">
                    当前浏览器不支持 video直接播放，点击这里下载视频： <a href="/">下载视频</a>
                </video>
                <div class="playTip glyphicon glyphicon-play"></div>
            </div>
            <div class="playControll">
                <div class="playPause playIcon"></div>
                <div class="timebar">
                    <span class="currentTime">0:00:00</span>
                    <div class="progress">
                        <div class="progress-bar progress-bar-danger progress-bar-striped" role="progressbar"
                             aria-valuemin="0" aria-valuemax="100" style="width: 0%"></div>
                    </div>
                    <span class="duration">0:00:00</span>
                </div>
                <div class="otherControl">
                    <span class="volume glyphicon glyphicon-volume-up"></span>
                    <span class="fullScreen glyphicon glyphicon-fullscreen"></span>
                    <div class="volumeBar">
                        <div class="volumewrap">
                            <div class="progress">
                                <div class="progress-bar progress-bar-danger" role="progressbar" aria-valuemin="0"
                                     aria-valuemax="100" style="width: 8px;height: 100%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <%--client-width:--%>
        <%--<script>document.write(document.documentElement.clientWidth.toString())</script>--%>
        <%--<br/>--%>
        <%--device-width:--%>
        <%--<script>document.write(window.innerWidth.toString())</script>--%>
        <%--<br/>--%>
        <%--DevicePixelRadio:--%>
        <%--<script>document.write(window.devicePixelRatio.toString())</script>--%>
    </div>
</div>


</body>
<script src="<%=basePath%>/js/common/jquery/jquery-1.11.3.min.js" type="text/javascript" charset="utf-8"></script>
<script src="<%=basePath%>/js/willes-play.js" type="text/javascript" charset="utf-8"></script>
</html>
