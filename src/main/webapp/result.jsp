<%
response.setContentType("application/json");
out.print(session.getAttribute("result").toString());
%>