<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
  String path = request.getContextPath();
  String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<%@ taglib uri="/struts-tags"  prefix="s" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
  <base href="<%=basePath%>">

  <title>My JSP 'index.jsp' starting page</title>
  <meta http-equiv="pragma" content="no-cache">
  <meta http-equiv="cache-control" content="no-cache">
  <meta http-equiv="expires" content="0">
  <meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
  <meta http-equiv="description" content="This is my page">
  <!--
  <link rel="stylesheet" type="text/css" href="styles.css">
  -->
</head>

<body>

<s:form action="execute2" namespace="/upload" theme="simple" enctype="multipart/form-data">
  <table align="center" width="50%" border="1">
    <tr>
      <td>username</td>
      <td><s:textfield name="username"></s:textfield></td>
    </tr>
    <tr>
      <td>password</td>
      <td><s:password name="password"></s:password></td>
    </tr>
    <tr>
      <td>file</td>
      <td id="more">
        <s:file name="file"></s:file>
        <input type="button" value="Add More.." onclick="addMore()">
      </td>
    </tr>
    <tr>
      <td><s:submit value=" submit "></s:submit></td>
      <td><s:reset value=" reset "></s:reset></td>
    </tr>
  </table>
</s:form>
</body>
<script type="text/javascript">
  function addMore()
  {
    var td = document.getElementById("more");

    var br = document.createElement("br");
    var input = document.createElement("input");
    var button = document.createElement("input");

    input.type = "file";
    input.name = "file";

    button.type = "button";
    button.value = "Remove";

    button.onclick = function()
    {
      td.removeChild(br);
      td.removeChild(input);
      td.removeChild(button);
    }
    td.appendChild(br);
    td.appendChild(input);
    td.appendChild(button);
  }
</script>
</html>