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

    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport"/>
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
    <%--<h3>看电影咯，123好哟啊好哟</h3>--%>


            <div id="willesPlay">
                <div class="playHeader">
                    <div class="videoName">Tara - 懂的那份感觉</div>
                </div>
                <div class="playContent">
                    <div class="turnoff">
                        <ul>
                            <li><a href="javascript:;" title="喜欢" class="glyphicon glyphicon-heart-empty"></a></li>
                            <li><a href="javascript:;" title="关灯"
                                   class="btnLight on glyphicon glyphicon-sunglasses"></a></li>
                            <li><a href="javascript:;" title="分享" class="glyphicon glyphicon-share"></a></li>
                        </ul>
                    </div>
                    <video width="100%" height="100%" id="playVideo">
                        <source src="http://115.231.144.59/10/z/f/m/e/zfmeprwqhiydtbklvlaodpidksxlsz/hc.yinyuetai.com/8408014F06AA7ED9E43BC2E617F24B8E.flv?sc=80b3a67012591c91&br=780&vid=782863&aid=1559&area=KR&vst=0&ptp=mv&rd=yinyuetai.com"
                                type="video/mp4"></source>
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
                        <span class="volume glyphicon glyphicon-volume-down"></span>
                        <span class="fullScreen glyphicon glyphicon-fullscreen"></span>
                        <div class="volumeBar">
                            <div class="volumewrap">
                                <div class="progress">
                                    <div class="progress-bar progress-bar-danger" role="progressbar" aria-valuemin="0"
                                         aria-valuemax="100" style="width: 8px;height: 40%;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        <div class="col-md-12">
            <div class="row"></div>
        </div>
</div>


</body>
<link rel="stylesheet" type="text/css" href="<%=basePath%>css/media-player/reset.css"/>
<link rel="stylesheet" href="<%=basePath%>/js/common/bootstrap/3.3.5/css/bootstrap.min.css">
<%--<link rel="stylesheet" type="text/css" media="screen and (max-device-width: 400px)" href="tinyScreen.css" />--%>
<link rel="stylesheet" type="text/css" href="<%=basePath%>/css/media-player/willesPlay.css"/>
<script src="<%=basePath%>/js/common/jquery/jquery-1.11.3.min.js" type="text/javascript" charset="utf-8"></script>
<script src="<%=basePath%>/js/willesPlay.js" type="text/javascript" charset="utf-8"></script>
</html>
