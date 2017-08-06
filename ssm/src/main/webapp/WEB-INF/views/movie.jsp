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
    <%--<h3>看电影咯，123好哟啊好哟</h3>--%>

    <div class="row">
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
                            type="video/mp4">
                    <%--<source src="https://d11.baidupcs.com/file/f08538f7c469f30cd14a48b62874e9a4?bkt=p3-1400f08538f7c469f30cd14a48b62874e9a4d35ee1cc00000eb3e3ec&xcode=8af52928f2d60f371c6947544466e31843b254133bcfbc7e0b2977702d3e6764&fid=792180402-250528-1093251531845566&time=1501516624&sign=FDTAXGERLBHS-DCb740ccc5511e5e8fedcff06b081203-r8GD%2BWT3wWrxw9GZB77QS%2FUoxCI%3D&to=d11&size=246670316&sta_dx=246670316&sta_cs=53487&sta_ft=rmvb&sta_ct=7&sta_mt=6&fm2=MH,Yangquan,Netizen-anywhere,,zhejiang,ct&newver=1&newfm=1&secfm=1&flow_ver=3&pkey=1400f08538f7c469f30cd14a48b62874e9a4d35ee1cc00000eb3e3ec&sl=76480590&expires=8h&rt=pr&r=409359838&mlogid=4916831522517283345&vuk=792180402&vbdid=2927981292&fin=9.rmvb&fn=9.rmvb&rtype=1&iv=0&dp-logid=4916831522517283345&dp-callid=0.1.1&hps=1&csl=80&csign=zB1q4lGlYCRWtFJ2xVHDBOyz40Y%3D&so=0&ut=6&uter=4&serv=1&by=themis"
                            type="video/mp4">--%>
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
    </div>
    <div class="row">
        client-width:
        <script>document.write(document.documentElement.clientWidth.toString())</script>
        <br/>
        device-width:
        <script>document.write(window.innerWidth.toString())</script>
        <br/>
        DevicePixelRadio:
        <script>document.write(window.devicePixelRatio.toString())</script>
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
