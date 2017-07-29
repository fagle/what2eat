///<reference path="common_interface.ts" />
///<reference path="ajax_result_render.ts" />
///<reference path="common_fns.ts" />
//用户信息相关
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AccountInfo = (function () {
    function AccountInfo(jQuery) {
        this.jQuery = jQuery;
    }
    AccountInfo.prototype.renderBackPackItems = function (placeholder, data) {
        var html = '    <table class="table table-bordered table-hover dh-datagrid">' +
            '        <thead>' +
            '        <tr>' +
            '            <th>物品ID</th>' +
            '            <th>物品名称</th>' +
            '            <th>数量</th>' +
            '        </tr>' +
            '        </thead>' +
            '        <tbody>';
        data.forEach(function (dataItem) {
            html += "<tr>";
            html += "<td>" + dataItem.itemID + '</td>';
            html += "<td>" + dataItem.itemName + '</td>';
            html += "<td>" + dataItem.count + '</td>';
            html += "</tr>";
        });
        html += '        </tbody>' +
            '    </table>';
        this.jQuery('#' + placeholder).html(html).show();
    };
    AccountInfo.prototype.renderCardList = function (placeholder, data) {
        var self = this;
        var html = '    <table class="table table-bordered table-hover dh-datagrid">' +
            '        <thead>' +
            '        <tr>' +
            '            <th>武将ID</th>' +
            '            <th>武将名称</th>' +
            '            <th>星级</th>' +
            '            <th>品阶</th>' +
            '        </tr>' +
            '        </thead>' +
            '        <tbody>';
        data.forEach(function (dataItem) {
            html += "<tr name='list_item' style='cursor:pointer;'>";
            html += "<td>" + dataItem.id + '</td>';
            html += "<td>" + dataItem.name + '</td>';
            html += "<td>" + dataItem.property.star + '</td>';
            html += "<td>" + dataItem.property.quality + '</td>';
            html += "</tr>";
            html += "<tr>";
            html += "<td colspan='4' style='display: none; '>" +
                "<p><span style='font-weight: bold;'>技能：</span>" + self.getSkillStr(dataItem.property.skill) + "</p>" +
                "<P><span style='font-weight: bold;'>装备：</span>" + self.getEquipStr(dataItem.property.equip) + "</P>" +
                "</td>";
            html += "</tr>";
        });
        html += '</tbody>' +
            '    </table>';
        var $ = this.jQuery;
        $('#' + placeholder).html(html).show()
            .find('tr[name=list_item] td').bind('click', function () {
            $(this).parents('tr').next().find('td').toggle();
        });
    };
    AccountInfo.prototype.getSkillStr = function (data) {
        var html = [];
        data && data.forEach(function (dataItem) {
            html.push(dataItem.skillName + dataItem.level + '级');
        });
        return html.join('，');
    };
    AccountInfo.prototype.getMagicInfo = function (magicValue) {
        if (magicValue >= 0 && magicValue <= 20) {
            return '普通附魔';
        }
        else if (magicValue >= 21 && magicValue <= 80) {
            return '高级附魔';
        }
        else if (magicValue >= 81 && magicValue <= 160) {
            return '专家附魔';
        }
        else {
            return '附魔信息不正确';
        }
    };
    AccountInfo.prototype.getEquipStr = function (data) {
        var self = this;
        var html = [];
        data && data.forEach(function (dataItem) {
            html.push(dataItem.itemName + '(' + self.getMagicInfo(dataItem.magic) + ')');
        });
        return html.join('，');
    };
    AccountInfo.prototype.backPackItemsView = function (areaID, roleID, backpackListID) {
        var self = this;
        var ajaxOption = {};
        ajaxOption.url = "index.php?/account/accountInfo?query_type=backpack&area=" + areaID + "&role_id=" + roleID;
        ajaxOption.dataType = 'json';
        ajaxOption.type = 'get';
        ajaxOption.success = function (response) {
            if (response.error) {
                alert(response.message);
                return;
            }
            self.renderBackPackItems(backpackListID, response.data);
        };
        this.jQuery.ajax(ajaxOption);
    };
    AccountInfo.prototype.cardView = function (areaID, roleID, cardListID) {
        var self = this;
        var ajaxOption = {};
        ajaxOption.url = "index.php?/account/accountInfo?query_type=card&area=" + areaID + "&role_id=" + roleID;
        ajaxOption.dataType = 'json';
        ajaxOption.type = 'get';
        ajaxOption.success = function (response) {
            if (response.error) {
                alert(response.message);
                return;
            }
            self.renderCardList(cardListID, response.data);
        };
        this.jQuery.ajax(ajaxOption);
    };
    return AccountInfo;
})();
var AccountOperateBaseClass = (function () {
    function AccountOperateBaseClass(jQuery) {
        this.$ = jQuery;
        this.initAccountLock();
    }
    AccountOperateBaseClass.prototype.initAccountLock = function () {
        var self = this;
        this.$('#time_range').bind('change', function () {
            if (this.value !== self.customTimeRangeType.toString()) {
                self.$('#end_time').val('');
                self.$('#end_time').attr('disabled', 'disabled');
            }
            else {
                self.$('#end_time').removeAttr('disabled');
            }
        });
        this.$('#reason').bind('change', function () {
            if (this.value !== self.customReason) {
                self.$('#custom_reason').val('');
                self.$('#custom_reason').attr('disabled', 'disabled');
            }
            else {
                self.$('#custom_reason').removeAttr('disabled');
            }
        });
    };
    AccountOperateBaseClass.prototype.formateDate = function (date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    };
    AccountOperateBaseClass.prototype.getEndDate = function (day) {
        var begin = new Date();
        var end = new Date(begin.getTime() + 1000 * 3600 * 24 * day);
        return this.formateDate(end);
    };
    return AccountOperateBaseClass;
})();
//封号解封
var AccountLock = (function (_super) {
    __extends(AccountLock, _super);
    function AccountLock(jQuery, BASE64) {
        _super.call(this, jQuery);
        this.BASE64 = BASE64;
        this.customTimeRangeType = AccountLock.TIME_RANGE_CUSTOM;
        this.customReason = AccountLock.REASON_CUSTOM;
        this.initFillId();
    }
    AccountLock.prototype.initFillId = function () {
        Common.initSwitchInputAndFile(this.$, this.BASE64, 'player_id');
    };
    AccountLock.prototype.unLock = function (id) {
        if (!confirm('确定要恢复吗？')) {
            return;
        }
        var ajaxOption = {};
        ajaxOption.dataType = 'JSON';
        ajaxOption.type = 'POST';
        ajaxOption.url = "index.php?/account/accountLock?type=unlock";
        ajaxOption.data = {
            id: id
        };
        ajaxOption.success = function (response) {
            alert(response.message);
            if (response.error === 0) {
                window.location.reload();
            }
        };
        ajaxOption.error = function () {
            alert(JSON.stringify(arguments));
        };
        this.$.ajax(ajaxOption);
    };
    AccountLock.prototype.accountLock = function (successCallback) {
        var $ = this.$;
        var area = $('#area').val();
        var playerID = $.trim($('#player_id').val());
        var timeRange = $('#time_range').val();
        var endTime = $.trim($('#end_time').val());
        var reason = $.trim($('#reason').val());
        var customReason = $.trim($('#custom_reason').val());
        if (area.length == 0) {
            alert('请选择大区');
            return;
        }
        if (playerID.length == 0) {
            alert('请输入玩家ID');
            return;
        }
        if (timeRange.length == 0) {
            alert('请选择封号时间范围');
            return;
        }
        switch (parseInt(timeRange)) {
            case AccountLock.TIME_RANGE_ONE:
                endTime = this.getEndDate(1);
                break;
            case AccountLock.TIME_RANGE_THREE:
                endTime = this.getEndDate(3);
                break;
            case AccountLock.TIME_RANGE_SEVEN:
                endTime = this.getEndDate(7);
                break;
            case AccountLock.TIME_RANGE_ALWAYS:
                endTime = this.getEndDate(7);
                break;
            case AccountLock.TIME_RANGE_CUSTOM:
                if (!endTime) {
                    alert('请选择结束时间');
                    return;
                }
                break;
        }
        if (reason.length == 0) {
            alert('请选择封号原因');
            return;
        }
        if (reason == AccountLock.REASON_CUSTOM) {
            if (customReason.length == 0) {
                alert('请输入自定义封号原因');
                return;
            }
            reason = customReason;
        }
        var data = new Object;
        data.area = area;
        data.playerID = playerID;
        data.endTime = endTime;
        data.desc = reason;
        var ajaxOption = new Object;
        ajaxOption.url = "index.php?/account/accountLock?type=handle";
        ajaxOption.dataType = 'JSON';
        ajaxOption.type = 'POST';
        ajaxOption.data = data;
        ajaxOption.success = function (response) {
            if (typeof successCallback === 'function') {
                successCallback(response);
                return;
            }
            var fillIdType = parseInt($('#fill_id_type').val());
            if (fillIdType === Common.FILL_ID_FILE) {
                var ajaxResultRender = new AjaxResultRender($);
                ajaxResultRender.accountLock('the_form', 'result_view', response);
            }
            else {
                alert(response.message);
                if (response.error == 0) {
                    window.location.reload();
                }
            }
        };
        ajaxOption.error = function () {
            alert(JSON.stringify(arguments));
        };
        this.$.ajax(ajaxOption);
    };
    AccountLock.TIME_RANGE_ONE = 0;
    AccountLock.TIME_RANGE_THREE = 1;
    AccountLock.TIME_RANGE_SEVEN = 2;
    AccountLock.TIME_RANGE_ALWAYS = 3;
    AccountLock.TIME_RANGE_CUSTOM = 4;
    AccountLock.REASON_CUSTOM = 'custom';
    return AccountLock;
})(AccountOperateBaseClass);
//禁言和解除禁言
var AccoutForbiddenChat = (function (_super) {
    __extends(AccoutForbiddenChat, _super);
    function AccoutForbiddenChat(jQuery) {
        _super.call(this, jQuery);
        this.customTimeRangeType = AccountLock.TIME_RANGE_CUSTOM;
        this.customReason = AccountLock.REASON_CUSTOM;
    }
    AccoutForbiddenChat.prototype.forbiddenChat = function (successCallback) {
        var area = this.$('#area').val();
        var playerID = this.$.trim(this.$('#player_id').val());
        var timeRange = this.$('#time_range').val();
        var endTime = this.$.trim(this.$('#end_time').val());
        var reason = this.$.trim(this.$('#reason').val());
        var customReason = this.$.trim(this.$('#custom_reason').val());
        if (area.length == 0) {
            alert('请选择大区');
            return;
        }
        if (playerID.length == 0) {
            alert('请输入玩家ID');
            return;
        }
        if (timeRange.length == 0) {
            alert('请选择禁言时间范围');
            return;
        }
        switch (parseInt(timeRange)) {
            case AccoutForbiddenChat.TIME_RANGE_ONE:
                endTime = this.getEndDate(1);
                break;
            case AccoutForbiddenChat.TIME_RANGE_THREE:
                endTime = this.getEndDate(3);
                break;
            case AccoutForbiddenChat.TIME_RANGE_SEVEN:
                endTime = this.getEndDate(7);
                break;
            case AccoutForbiddenChat.TIME_RANGE_ALWAYS:
                endTime = this.getEndDate(36500);
                break;
            case AccoutForbiddenChat.TIME_RANGE_CUSTOM:
                if (!endTime) {
                    alert('请选择结束时间');
                    return;
                }
                break;
        }
        if (reason.length == 0) {
            alert('请选择禁言原因');
            return;
        }
        if (reason == AccoutForbiddenChat.REASON_CUSTOM) {
            if (customReason.length == 0) {
                alert('请输入自定义禁言原因');
                return;
            }
            reason = customReason;
        }
        var data = new Object;
        data.area = area;
        data.playerID = playerID;
        data.endTime = endTime;
        data.desc = reason;
        var ajaxOption = new Object;
        ajaxOption.url = "index.php?/account/forbiddenChat?type=handle";
        ajaxOption.dataType = 'JSON';
        ajaxOption.type = 'POST';
        ajaxOption.data = data;
        ajaxOption.success = function (response) {
            if (typeof successCallback === 'function') {
                successCallback(response);
                return;
            }
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
    AccoutForbiddenChat.prototype.cancelForbiddenChat = function (id) {
        if (!confirm('确定要恢复吗？')) {
            return;
        }
        var ajaxOption = {};
        ajaxOption.dataType = 'JSON';
        ajaxOption.type = 'POST';
        ajaxOption.url = "index.php?/account/forbiddenChat?type=cancelForbiddenChat";
        ajaxOption.data = {
            id: id
        };
        ajaxOption.success = function (response) {
            alert(response.message);
            if (response.error === 0) {
                window.location.reload();
            }
        };
        ajaxOption.error = function () {
            alert(JSON.stringify(arguments));
        };
        this.$.ajax(ajaxOption);
    };
    AccoutForbiddenChat.TIME_RANGE_ONE = 0;
    AccoutForbiddenChat.TIME_RANGE_THREE = 1;
    AccoutForbiddenChat.TIME_RANGE_SEVEN = 2;
    AccoutForbiddenChat.TIME_RANGE_ALWAYS = 3;
    AccoutForbiddenChat.TIME_RANGE_CUSTOM = 4;
    AccoutForbiddenChat.REASON_CUSTOM = 'custom';
    return AccoutForbiddenChat;
})(AccountOperateBaseClass);
//# sourceMappingURL=account.js.map