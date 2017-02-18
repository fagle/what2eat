<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="java.io.*" %>
<%@ page import="java.util.*" %>
<html>
<header>
    <title>foo 404 page</title>
    </header>
    <body>
    <pre>
<%
    Enumeration<String> attributeNames = request.getAttributeNames();
    while (attributeNames.hasMoreElements())
    {
        String attributeName = attributeNames.nextElement();
        Object attribute = request.getAttribute(attributeName);
        //out.println("request.attribute['" + attributeName + "'] = " + attribute);
    }
%>
</pre>
    你在逗我么，你访问了一个不存在的网页</br>
    oh oh, my 404 error page
    </body>
</html>
