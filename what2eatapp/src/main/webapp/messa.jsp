<%--
  Created by IntelliJ IDEA.
  User: fagle
  Date: 2016/3/28
  Time: 16:31
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
  String path = request.getContextPath();
  String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
  String cdnbase = "http://abc.com/image/";
  String url1 = "";
%>
<%@ taglib prefix="json" uri="http://www.atg.com/taglibs/json" %>
<%@taglib prefix="s" uri="/struts-tags" %>
<s:set var="url" value="#session.url"/>
<s:if test="#url != \"\"">
  <%  url1 = cdnbase + session.getAttribute("url"); %>
</s:if>
<s:else>
  <% url1 = "";%>
</s:else>
<% session.setAttribute("url1", url1); %>
<json:object>
  <json:property name="retcode" value="${session.retcode}"/>
  <json:property name="url" value="${url1}"/>
</json:object>