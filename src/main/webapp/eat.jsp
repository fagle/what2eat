<%@ taglib prefix="s" uri="/struts-tags" %>
<%@ page import="java.util.Date" %>
<%@ page import="java.util.TimeZone" %>
<%--
  Created by IntelliJ IDEA.
  User: Fagle
  Date: 2016/7/12 0012
  Time: 下午 10:01
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<%
    Date date = new Date();
    int hour = date.getHours();
    String titile="";
    if (hour<14)
        titile ="中午";
    else
        titile="晚上";

%>
<html>
  <head>
      <base href="<%=basePath %>"/>
      <title><%=titile%>吃什么</title>
  </head>
  <body style="text-align: center">
  <div style="margin: 0 auto; text-align: left; width: 800px;border: dashed black 0px;">
      本地时区:<%=TimeZone.getDefault().getDisplayName()%>
      现在时间<%=date.toLocaleString()%>
      <h1><%=titile%>吃什么呢</h1>
      <%--<s:property value="shops[0]"/>
      <br/>
      访问list:<s:property value="shops"/>
      <hr/>--%>
      <table>
      <s:iterator value="shops" status="status">
          <tr><td><s:property />&nbsp;</td><td> <a href="shop!delete?id=<s:property value='#status.index' />">删除</a></td></tr>
      </s:iterator>
      </table>
      <hr/>

      <form action="/shop!add" method="post">
          添加选项：<input name="shop" type="text" />
          <input type="submit"/>
      </form>
      <form action="shop!rand">
          你的名字：<input type="text" name="name" />
          <input type="submit" value="随机选择"/>
      </form>
      <hr/>
      计算过程：<s:property value="desc"/><br/>
      选择结果：<s:property value="resultShop" />
      <hr/>
      <form action="shop!refresh">
          <input type="submit" value="刷新选择结果"/>
      </form>
      谁选择了谁：<br/>
      <s:property value="ip2name"/>
      <table>
      <s:iterator value="chooseMap" var="x">
          <tr><td><s:property value="#x.key"/></td><td><s:property value="ip2name[#x.key]"/></td><td>
          <s:property value="#x.value"/></td>
          </tr>
      </s:iterator>
      </table>
  </div>
  </body>
</html>
