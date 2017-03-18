///<reference path="common_interface.ts" />
///<reference path="ajax_result_render.ts" />
///<reference path="common_fns.ts" />
var IpWhiteList = (function () {
    function IpWhiteList(jQuery, BASE64) {
        this.$ = jQuery;
        this.BASE64 = BASE64;
        this.initFillIp();
    }
    IpWhiteList.prototype.initFillIp = function () {
        Common.initSwitchInputAndFile(this.$, this.BASE64, 'ip');
    };
    IpWhiteList.prototype.ipWhiteListConfig = function () {
        var $ = this.$;
        var area = $('#area').val();
        var ip = $('#ip').val();
        var isOpen2All = $('#isOpen2All').attr('checked') ? 1 : 0;
        if (area.length === 0) {
            alert('请选择大区');
            return;
        }
        if (ip.length === 0) {
            alert('请指定ip地址');
            return;
        }
        if (!this.checkIpAddress(ip)) {
            alert('指定的IP地址格式不正确');
            return;
        }
        var data = new Object;
        data.area = area;
        data.ip = ip;
        data.isOpen2All = isOpen2All;
        var ajaxOption = new Object;
        ajaxOption.url = "index.php?/game_data_manage/white_list_config?type=config_handle";
        ajaxOption.dataType = 'JSON';
        ajaxOption.type = 'POST';
        ajaxOption.data = data;
        ajaxOption.success = function (response) {
            alert(response.message);
            if (response.error == 0) {
                window.location.reload();
            }
        };
        ajaxOption.error = function () {
            alert(JSON.stringify(arguments));
        };
        this.$.ajax(ajaxOption);
    };
    IpWhiteList.prototype.checkIpAddress = function (ipListString) {
        var ipList = ipListString.split(",");
        var isValid = true;
        var regex = /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/;
        ipList.forEach(function (item) {
            if (!regex.test(item)) {
                isValid = false;
            }
        });
        return isValid;
    };
    return IpWhiteList;
})();
//# sourceMappingURL=sys_manage.js.map