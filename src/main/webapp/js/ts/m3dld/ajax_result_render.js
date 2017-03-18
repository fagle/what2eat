var AjaxResultRender = (function () {
    function AjaxResultRender(jQuery) {
        this.$ = jQuery;
    }
    AjaxResultRender.prototype.accountLock = function (currViewId, resultViewId, executedResult) {
        var result = [];
        for (var i = 0; i < executedResult.length; i++) {
            var item = executedResult[i];
            var str = '<th>id：</th>' + '<td>' + item.playerID + '</td>';
            str += "<th>状态：</th>" + '<td>' + (item.error === 0 ? '成功' : '失败') + '</td>';
            str += "<th>结果：</th>" + '<td>' + item.message + '</td>';
            str = '<tr>' + str + '</tr>';
            result.push(str);
        }
        var html = "<table cellpadding='1' cellspacing='1'>" + result.join('') + "</table>";
        html = "<div><h1>操作结果</h1>" + html + "</div>";
        html += '<input type="button" value="点击返回" onclick="$(\'#' + resultViewId + '\').hide();$(\'#' + currViewId + '\').show();">';
        this.$('#' + currViewId).hide();
        this.$('#' + resultViewId).show().html(html);
    };
    AjaxResultRender.prototype.activity = function (currViewId, resultViewId, executedResult) {
        var result = [];
        for (var i = 0; i < executedResult.length; i++) {
            var item = executedResult[i];
            var str = '<th>大区：</th>' + '<td>' + item.areaName + '</td>';
            str += "<th>状态：</th>" + '<td>' + (item.error === 0 ? '成功' : '失败') + '</td>';
            str += "<th>结果：</th>" + '<td>' + item.message + '</td>';
            str = '<tr>' + str + '</tr>';
            result.push(str);
        }
        var html = "<table cellpadding='1' cellspacing='1'>" + result.join('') + "</table>";
        html = "<div><h1>操作结果</h1>" + html + "</div>";
        html += '<input type="button" value="点击返回" onclick="$(\'#' + resultViewId + '\').hide();$(\'#' + currViewId + '\').show();">';
        this.$('#' + currViewId).hide();
        this.$('#' + resultViewId).show().html(html);
    };
    return AjaxResultRender;
})();
//# sourceMappingURL=ajax_result_render.js.map