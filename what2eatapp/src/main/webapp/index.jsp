<%@ taglib prefix="s" uri="/struts-tags" %>
<%--
  Created by IntelliJ IDEA.
  User: fagle
  Date: 2017/2/21
  Time: 17:41
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <%@include file="head.jsp"%>
    <script type="text/javascript" src="<%= base_url%>style/js/core.js"></script>
    <script type="text/javascript" src="<%= base_url%>style/js/plugins/jQuery.datepicker.js"></script>
</head>
<body>
<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">
            <span class="panel-icon">
                <i class="icon icon-file"></i>
            </span>
            <em>服务器时间修改</em>
        </h3>
    </div>
    <div class="panel-body">
        <table class="form" width="100%">

            <tr class="form-row">
                <td class="form-field" width="5%">
                    服务器当前时间：
                </td>
                <td class="form-component right" width="15%">
                    <input type="text" class="form-control" id="server_time"  name="server_time" />
                </td>

                <td class="form-field" width="5%">
                    <label>更改时间：</label>
                </td>
                <td class="form-component" width="15%">
                    <div class="input-group" data-plugin="datepicker">
                        <input type="text" class="form-control" id="input_time" name="input_time">
                        <div class="input-group-btn">
                            <button type="button" class="btn btn-default">
                                <i class="icon icon-date"></i>
                            </button>
                        </div>
                    </div>
                </td>
                <td class="form-component" width="30%">
                    <button class="btn btn-success" id="search_btn">查询 </button>
                    &nbsp;
                    <button type="button" class="btn btn-default" id="edit">设置</button>
                </td>
            </tr>
        </table>
    </div>
</div>

<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">
                    <span class="panel-icon">
                        <i class="icon icon-file"></i>
                    </span>
            <em>常用操作</em>
        </h3>
    </div>

    <div class="panel-body">
        <table class="form">
            <tr>
                <td>
                    <button type="button" class="btn btn-default" id="update_srv_config">更新配表</button>
                    <button type="button" class="btn btn-default" id="restart_srv">重启测试服</button>
                    &nbsp;
                    <button type="button" class="btn btn-default" id="stop_tick">日志停止刷新</button>
                </td>
            </tr>

        </table>
    </div>
</div>

<div class="panel panel-default">

    <table class="table table-bordered table-hover dh-datagrid">
        <thead>
        <tr>
            <th>序号</th>
            <th>提交时间</th>
            <th>执行结果</th>
        </tr>
        </thead>
        <tr>
            <td>1</td>
            <td><s:property value="now"/> </td>
            <td>
                <div class="log_container" id="log_top">
                    <pre  id="log"><s:property value="result"/></pre>
                </div>
            </td>
        </tr>
    </table>

    <div class="panel-footer">
        <div class="datagrid-page clearfix" id="page1" >

        </div>
    </div>
</div>

<script type="text/javascript">
    function filterPlusSymbol( str ) {
        return decodeURIComponent(str).replace(/\+/g,' ');
    }

    seajs.use( 'common.js?v=<%=RESOURCE_VERSION%>', function( common ) {
        $( '#search_btn' ).bind( 'click', function() {
            window.location.href = "date_query";
        } );

        $( '#edit' ).bind( 'click', function() {
            var queryString = common.queryString();
            var input_time = $('#input_time').val();
            if (!input_time)
                alert("输入时间不能为空！");
            queryString[ 'serverDate' ] = input_time;

            window.location.href = "date_edit?" + $.param(queryString);
        } );

        $('#update_srv_config').bind('click', function () {
            window.location.href = "update_srv_cfg";
        });

        $('#stop_tick').bind('click', function () {
            intervalId = clearInterval(intervalId);
        });

        var server_time = '<s:property value="serverDate"/>';
        if (server_time) {
            $('#server_time').val(filterPlusSymbol(server_time));
            $('#input_time').val(server_time);
        }
    } );

    seajs.use( 'page.js?v=<%=RESOURCE_VERSION%>', function( page ) {
        page.renderPage( 'page1', -1, "", 1, 'v2' );
    } );

    //初始化日期选择控件
    if($('[data-plugin="datepicker"]').length > 0 && $.fn.datepicker){
        $('[data-plugin="datepicker"]').datepicker({dateFmt:'yyyy-MM-dd HH:mm:ss'});
    }

    var intervalId =
        setInterval(function () {
            $.ajax({
                type: "GET",
                url: "get_log",
                data: {offset:$("#log").text().length},
                //dataType: "string",
                success: function(data){
                    //$('#log').empty();   //清空resText里面的所有内容
                    /* var html = '';
                     $.each(data, function(commentIndex, comment){
                     html += '<div class="comment"><h6>' + comment['username']
                     + ':</h6><p class="para"' + comment['content']
                     + '</p></div>';
                     });*/
                    //document.getElementById('log').innerText=data
                    if (data) {
                        $('#log').append(data);
                        $('#log_top').scrollTop($('#log').height());
                    }
                }
            });
        }, 1000);

</script>
</body>
</html>