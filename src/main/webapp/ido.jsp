<%--
  Created by IntelliJ IDEA.
  User: fagle
  Date: 2017/2/23
  Time: 16:29
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<base href="<%=basePath%>">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>电魂管理系统-IDO</title>
    <link rel="stylesheet" type="text/css" href="css/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="css/base.css?v=2.0">
    <script type="text/javascript">
        function SetWinHeight(obj)
        {
            var win = obj;
            if (document.getElementById)
            {
                if (win && !window.opera)
                {
                    if (win.contentDocument && win.contentDocument.body.offsetHeight)
                        win.height = win.contentDocument.body.offsetHeight + 20;
                    else if (win.Document && win.Document.body.scrollHeight)
                        win.height = win.Document.body.scrollHeight + 20;
                }
            }
        }
    </script>
    <style type="text/css">
        body{
            padding:0px;
        }
    </style>
</head>
<body>
<div class="breadcrumb" >
    <h4 class="w_220 pull-left" >电魂管理系统-IDO</h4>
    <span class="pull-left padding_left_7" > 欢迎【fagledeng】登陆</span>
    <div class="w_120 pull-right" >
        <a href="http://ams.om.dianhun.cn/manage?id=1009" class="title_tools_bottom" title="修改密码"><i class=" icon-tags"></i></a>
        <a href="http://ido.om.dianhun.cn:80/index.php?/login/login_out" class="title_tools_bottom"  title="退出登陆" ><i class="icon-off"></i></a>
    </div>
    <div class="clear_float" ></div>
</div>
<ul class="nav nav-tabs  padding_left_4"  >
    <li class="active" > <a href="http://ido.om.dianhun.cn:80/index.php?/index/system" target="content"  >系统首页</a></li>
    <li class="dropdown general">
        <a href="#" target ="content" class="dropdown-toggle" data-toggle="dropdown"   >执行态
            <b class="caret"></b></a>
        <ul class="dropdown-menu" >			<li class="general"> <a href="http://ido.om.dianhun.cn:80/index.php?/job_exec/job_exec_list"  target ="content"    >执行列表</a></li>					</ul>
    </li>				<li class="dropdown general">
    <a href="#" target ="content" class="dropdown-toggle" data-toggle="dropdown"   >执行历史
        <b class="caret"></b></a>
    <ul class="dropdown-menu" >			<li class="general"> <a href="http://ido.om.dianhun.cn:80/index.php?/exec_history/exec_history_list_all"  target ="content"    > 作业执行历史</a></li>					</ul>
</li>		</ul>
<div style="position:absolute; top:110px; bottom:50px; left:0; right:0; overflow:hidden;">
    <iframe name="content" src="http://ido.om.dianhun.cn:80/index.php?/index/system"></iframe>
</div>
<div class="t_center breadcrumb footer" id="copyright">
    Copyright © 2008 - 2013 Esoul Operation Management Department. All Rights Reserved
</div>
</body>
<script type="text/javascript" src="http://ido.om.dianhun.cn:80/js/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="http://ido.om.dianhun.cn:80/js/bootstrap.js"></script>
<script type="text/javascript" src="http://ido.om.dianhun.cn:80/js/common.js"></script>
<script async="true" src="http://ui.om.dianhun.cn/js/copyright.js" type="text/javascript"></script>
<script  type="text/javascript">
    $().ready(function () {
        $('.nav > li').click(function () {
            $(this).parent().children('li[class*=active]').removeClass('active');
            $(this).addClass('active');
        });
    });
</script>
</html>