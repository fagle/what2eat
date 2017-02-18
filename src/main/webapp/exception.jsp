<%@ page contentType="text/html; charset=UTF-8" isErrorPage="true" %>
<%@ page import="java.io.*" %>
<html>
<header>
    <title>foo exception page</title></header>
    <body>
    <hr/>
<pre>
<%
    //response.getWriter().println("Exception: " + exception);

    if(exception != null)
    {
        response.getWriter().println("<pre>");
        //exception.printStackTrace(response.getWriter());
        response.getWriter().println("还没写完，不要催不要催");
        response.getWriter().println("</pre>");
    }

    response.getWriter().println("<hr/>");

%></pre>
    </body>
</html>