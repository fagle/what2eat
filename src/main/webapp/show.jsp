<%--
  Created by IntelliJ IDEA.
  User: fagle
  Date: 2017/2/23
  Time: 16:27
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
    <title>电魂管理系统-执行任务历史-作业执行历史操作IP状态列表</title>
    <link rel="stylesheet" type="text/css"
          href="http://ido.om.dianhun.cn:80/css/bootstrap.css">
    <link rel="stylesheet" type="text/css"
          href="http://ido.om.dianhun.cn:80/css/base.css">
</head>
<body>
<div class="table_auto">
    <ul class="breadcrumb">
        <li><i class="icon-home"></i> <a href="#">执行任务历史</a> <span
                class="divider">/</span></li>
        <li><a href="#">作业执行历史操作IP状态列表</a></li>
    </ul>
</div>

<div class="center box table_auto">
    <h3 class="padding_left_1 well table_title"><i class="icon-user"></i> 作业执行历史操作IP状态列表			</h3>
    <div class="box_c">
        <table class="table table-bordered table-hover">
            <thead>
            <tr class="info">
                <th>Index</th>
                <th>ip</th>
                <th>结果代码</th>
                <th>结果信息</th>
                <th>开始时间</th>
                <th>结束时间</th>
            </tr>
            </thead>
            <form id="group_list">
                <tbody>
                <form id="group_list">
                    <tr >
                        <td>1</td>
                        <td>52.76.204.40</td>
                        <td>0</td>
                        <td>
                            <pre>[10:44:21] [INFO]  replace success
    INFO: restart iptables success\n
[10:44:23] [INFO]  restart iptables success
</pre>
                        </td>
                        <td>2017-02-23 10:44:22</td>
                        <td>2017-02-23 10:44:23</td>
                    </tr>
                </form>
                </tbody>
            </form>
        </table>
    </div>
</div>
<!-- Modal -->
</body>
<script type="text/javascript"
        src="http://ido.om.dianhun.cn:80/js/jquery-1.8.0.min.js"></script>
<script type="text/javascript" src="http://ido.om.dianhun.cn:80/js/bootstrap.js"></script>
<script type="text/javascript" src="http://ido.om.dianhun.cn:80/js/common.js"></script>
</html>
