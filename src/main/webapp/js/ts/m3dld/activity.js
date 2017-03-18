///<reference path="ajax_result_render.ts" />
var InitItemControl = (function () {
    function InitItemControl($, templateID, itemList, onAdd) {
        this.itemCount = 0;
        this.limitCount = Number.MAX_VALUE;
        var self = this;
        this.$ = $;
        this.templateID = templateID;
        this.itemList = itemList;
        this.onAdd = onAdd;
        this.addButton = $('<input type="button" value="增加" class="btn btn-link"/>');
        this.addButton.bind('click', function () {
            if (self.itemCount >= self.limitCount) {
                return;
            }
            self.addItem();
        });
    }
    InitItemControl.prototype.setLimitCount = function (value) {
        this.limitCount = value;
    };
    InitItemControl.prototype.getItemListElement = function () {
        return this.itemList;
    };
    InitItemControl.prototype.getItemCount = function () {
        return this.itemCount;
    };
    InitItemControl.prototype.addItem = function (obj) {
        var $ = this.$;
        var self = this;
        this.itemCount++;
        var html = '';
        if (document.getElementById(this.templateID)) {
            html = $('#' + this.templateID).html();
        }
        else {
            html = this.templateID;
        }
        var itemEl = $(html);
        this.itemList.append(itemEl);
        itemEl.find('.add_btn_placeholder').append(self.addButton);
        itemEl.find('input[name=remove]').bind('click', function () {
            if (itemEl.siblings().length == 0) {
                return;
            }
            if (itemEl.get(0).contains(self.addButton.get(0))) {
                self.addButton.appendTo(itemEl.prev().find('.add_btn_placeholder').eq(0));
            }
            itemEl.remove();
        });
        if (typeof (self.onAdd) == 'function') {
            self.onAdd(itemEl, obj);
        }
    };
    return InitItemControl;
})();
var Activity = (function () {
    function Activity($, url, pageMode, itemQuerySuggest) {
        this.$ = $;
        this.itemQuerySuggest = itemQuerySuggest;
        var level1Count = 0;
        var level1 = new InitItemControl($, 'activity_info_item_tpl', $('#activity_info_item_placeholder'), function (itemEl) {
            level1Count++;
            var level2Count = 0;
            var level2 = new InitItemControl($, 'prop_item_tpl', itemEl.find('.attachMent_item'), function (jElement) {
                level2Count++;
                var placeholderEl = jElement.find('.suggest_placeholder').get(0);
                var inputEl = jElement.find('[name=prop_id]').get(0);
                var key = level1Count.toString() + level2Count.toString();
                placeholderEl.id = 'suggest_placeholder_' + key;
                inputEl.id = 'item_input_' + key;
                itemQuerySuggest.m3dldItemSuggest(inputEl.id, placeholderEl.id, function (dataItem) {
                    inputEl.value = dataItem.itemID;
                });
            });
            level2.addItem();
            itemEl.find('[data-plugin="datepicker"]').datepicker({ dateFmt: 'yyyy-MM-dd HH:mm:ss' });
        });
        if (pageMode === Activity.PAGE_MODE_ADD) {
            level1.addItem();
        }
        this.initSubmit(url);
    }
    Activity.prototype.getErrorInfo = function (element, message) {
        return {
            error: 1,
            element: element,
            message: message
        };
    };
    Activity.prototype.getFormData = function () {
        var itemIdExists = this.itemQuerySuggest.itemIdExists;
        var $ = this.$;
        var getErrorInfo = this.getErrorInfo;
        var areaEl = $('#area');
        var typeEl = $('#type');
        var contentEl = $('#content');
        var area = $.trim(areaEl.val());
        var type = $.trim(typeEl.val());
        var content = $.trim(contentEl.val());
        if (area === '') {
            return getErrorInfo(areaEl, '请选择大区');
        }
        if (type === '') {
            return getErrorInfo(typeEl, '请输入活动名称');
        }
        if (content === '') {
            return getErrorInfo(contentEl, '请输入活动内容');
        }
        var activityInfoItemList = [];
        var aElementList = $('.activity_info_item');
        for (var i = 0; i < aElementList.length; i++) {
            var self = $(aElementList.get(i));
            var beginTimeEl = self.find('[name="begin_time"]');
            var endTimeEl = self.find('[name="end_time"]');
            //var needPayEl = self.find( '[name="need_pay"]' );
            var requireTypeEl = self.find('[name="require_type"]');
            var requireValueEl = self.find('[name="require_value"]');
            var beginTime = $.trim(beginTimeEl.val());
            var endTime = $.trim(endTimeEl.val());
            //var needPay = $.trim( needPayEl.val() );
            var requireType = requireTypeEl.val();
            var requireValue = requireValueEl.val();
            if (beginTime === '') {
                return getErrorInfo(null, '请选择开始时间');
            }
            if (endTime === '') {
                return getErrorInfo(null, '请选择结束时间');
            }
            var tipText = '';
            if (requireType !== '' && parseInt(requireType) !== 0 && requireValue === '') {
                switch (parseInt(requireType)) {
                    case Activity.REQUIRE_TYPE_LEVEL:
                        tipText = '请输入等级条件';
                        break;
                    case Activity.REQUIRE_TYPE_ONE_CHARGE:
                        tipText = '请输入单次充值条件';
                        break;
                    case Activity.REQUIRE_TYPE_TOTAL_CHARGE:
                        tipText = '请输入累计充值条件';
                        break;
                    case Activity.REQUIRE_TYPE_YB_CONSUME:
                        tipText = '请输入累计元宝消费条件';
                        break;
                    default:
                        throw '条件类型不存在';
                        break;
                }
                return getErrorInfo(requireValueEl, tipText);
            }
            else if (requireType === '') {
                return getErrorInfo(requireTypeEl, '请选择条件类型');
            }
            //if( type == Activity.ACTIVITY_TYPE_LEVELING ) {
            //    needPaySuffixText = '战队等级';
            //} else if( type == Activity.ACTIVITY_TYPE_RECHARGE ) {
            //    needPaySuffixText = '最低元宝充值数量';
            //}
            //if( needPay === '' ) {
            //    return getErrorInfo( needPayEl, '请输入' + needPaySuffixText );
            //}
            //
            //if( isNaN( needPay ) ) {
            //    return getErrorInfo( needPayEl, '请正确输入' + needPaySuffixText );
            //}
            var attachmentList = new Array;
            var pElementList = self.find('.prop_item');
            for (var j = 0; j < pElementList.length; j++) {
                var self = $(pElementList.get(j));
                var propIdEl = self.find('[name="prop_id"]');
                var countEl = self.find('[name="count"]');
                var propId = $.trim(propIdEl.val());
                var count = $.trim(countEl.val());
                if (propId === '') {
                    return getErrorInfo(propIdEl, '请输入物品ID');
                }
                if (!itemIdExists(propId)) {
                    return getErrorInfo(propIdEl, '不存在此道具ID');
                }
                if (count === '') {
                    return getErrorInfo(countEl, '请输入物品数量');
                }
                if (isNaN(count)) {
                    return getErrorInfo(countEl, '请正确输入物品数量');
                }
                var dataItem = {};
                dataItem.itemID = propId;
                dataItem.count = count;
                attachmentList.push(dataItem);
            }
            var dataItem = {};
            dataItem.beginTime = beginTime;
            dataItem.endTime = endTime;
            dataItem.requireType = requireType;
            dataItem.requireValue = requireValue;
            dataItem.giftDetail = attachmentList;
            activityInfoItemList.push(dataItem);
        }
        var data = {};
        data.area = area.split(',');
        data.eventId = type;
        data.desc = content;
        data.giftList = activityInfoItemList;
        var result = {};
        result.data = data;
        result.error = 0;
        return result;
    };
    Activity.prototype.initSubmit = function (url) {
        var $ = this.$;
        var self = this;
        var submitButton = $('#submit_button');
        submitButton.bind('click', function () {
            var result = self.getFormData();
            if (result.error) {
                alert(result.message);
                result.element && result.element.focus();
                return;
            }
            var ajaxOption = new Object;
            ajaxOption.dataType = 'JSON';
            ajaxOption.type = 'POST';
            ajaxOption.url = url;
            ajaxOption.data = { data: JSON.stringify(result.data) };
            ajaxOption.beforeSend = function () {
                submitButton.attr('disabled', 'disabled').val('提交中...')
                    .removeClass('btn-success').addClass('btn-default');
            };
            ajaxOption.success = function (response) {
                var ajaxResultRender = new AjaxResultRender($);
                ajaxResultRender.activity('the_form', 'result_view', response);
            };
            ajaxOption.error = function () {
                alert(JSON.stringify(arguments));
            };
            ajaxOption.complete = function () {
                submitButton.removeAttr('disabled', 'disabled').val('提交')
                    .addClass('btn-success').removeClass('btn-default');
            };
            //console.log( result.data );
            $.ajax(ajaxOption);
        });
    };
    Activity.prototype.fillForm = function (activityInfo) {
        var self = this;
        var $ = this.$;
        $('#area').val(activityInfo.area.join(','));
        $('#type').val(activityInfo.eventId);
        $('#content').val(activityInfo.desc);
        var fillData = true;
        var level1Count = 0;
        var level1 = new InitItemControl($, 'activity_info_item_tpl', $('#activity_info_item_placeholder'), function (itemEl, data) {
            level1Count++;
            if (fillData) {
                itemEl.find('[name="begin_time"]').val(data.beginTime);
                itemEl.find('[name="end_time"]').val(data.endTime);
                itemEl.find('[name="require_type"]').val(data.requireType);
                itemEl.find('[name="require_value"]').val(data.requireValue);
            }
            var level2Count = 0;
            var level2 = new InitItemControl($, 'prop_item_tpl', itemEl.find('.attachMent_item'), function (el, dt) {
                level2Count++;
                level2Count++;
                var placeholderEl = el.find('.suggest_placeholder').get(0);
                var inputEl = el.find('[name=prop_id]').get(0);
                var key = level1Count.toString() + level2Count.toString();
                placeholderEl.id = 'suggest_placeholder_' + key;
                inputEl.id = 'item_input_' + key;
                self.itemQuerySuggest.m3dldItemSuggest(inputEl.id, placeholderEl.id, function (dataItem) {
                    inputEl.value = dataItem.itemID;
                });
                if (fillData) {
                    el.find('[name="prop_id"]').val(dt.itemID);
                    el.find('[name="count"]').val(dt.count);
                }
            });
            if (fillData) {
                for (var i = 0; i < data.giftDetail.length; i++) {
                    level2.addItem(data.giftDetail[i]);
                }
            }
            else {
                level2.addItem();
            }
            itemEl.find('[data-plugin="datepicker"]').datepicker({ dateFmt: 'yyyy-MM-dd HH:mm:ss' });
        });
        for (var i = 0; i < activityInfo.giftList.length; i++) {
            var activityInfoItem = activityInfo.giftList[i];
            level1.addItem(activityInfoItem);
        }
        fillData = false;
    };
    Activity.PAGE_MODE_ADD = 'add';
    Activity.PAGE_MODE_EDIT = 'edit';
    Activity.ACTIVITY_TYPE_LEVELING = 1;
    Activity.ACTIVITY_TYPE_RECHARGE = 2;
    //无条件
    Activity.REQUIRE_TYPE_NONE = 0;
    //等级条件
    Activity.REQUIRE_TYPE_LEVEL = 1;
    //单次充值条件
    Activity.REQUIRE_TYPE_ONE_CHARGE = 2;
    //累计充值条件
    Activity.REQUIRE_TYPE_TOTAL_CHARGE = 3;
    //累计元宝消费条件
    Activity.REQUIRE_TYPE_YB_CONSUME = 4;
    return Activity;
})();
//# sourceMappingURL=activity.js.map