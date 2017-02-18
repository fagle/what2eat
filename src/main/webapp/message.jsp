<%--
  Created by IntelliJ IDEA.
  User: fagle
  Date: 2016/3/23
  Time: 15:13
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
  String path = request.getContextPath();
  String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
  String cdnbase = "http://abc.com/image/";
%>
<%@taglib prefix="s" uri="/struts-tags" %>
{
  "retcode" : <s:property value="#session.retcode"/>,
  <s:set var="url" value="#session.url"/>
  <s:if test="#url == \"\"">"url" : ""</s:if>
  <s:else>"url" : "<%= cdnbase %><s:property value="#session.url"/>"</s:else>
<%-- "url-local"="<%= basePath + "image/" %><s:property value="#session.url"/>" --%>
}
