///<reference path="common_interface.ts" />
///<reference path="ajax_result_render.ts" />
///<reference path="common_fns.ts" />
//用户信息相关

class AccountInfo{
    private jQuery;
    constructor( jQuery ) {
        this.jQuery = jQuery;
    }

    private renderBackPackItems( placeholder: string, data: Array<any>) {
        var html: string = '    <table class="table table-bordered table-hover dh-datagrid">'+
                    '        <thead>'+
                    '        <tr>'+
                    '            <th>物品ID</th>'+
                    '            <th>物品名称</th>'+
                    '            <th>数量</th>'+
                    '        </tr>'+
                    '        </thead>'+
                    '        <tbody>';
        data.forEach(function( dataItem){
            html += "<tr>";
            html += "<td>" + dataItem.itemID + '</td>';
            html += "<td>" + dataItem.itemName + '</td>';
            html += "<td>" + dataItem.count + '</td>';
            html += "</tr>";
        });
        html +=    '        </tbody>'+
                    '    </table>';
        this.jQuery('#' + placeholder ).html( html ).show();
    }

    private renderCardList( placeholder: string, data: Array<any>) {
        var self = this;
        var html: string = '    <table class="table table-bordered table-hover dh-datagrid">'+
            '        <thead>'+
            '        <tr>'+
            '            <th>武将ID</th>'+
            '            <th>武将名称</th>'+
            '            <th>星级</th>'  +
            '            <th>品阶</th>'  +
            '        </tr>'+
            '        </thead>'+
            '        <tbody>';
        data.forEach(function( dataItem){
            html += "<tr name='list_item' style='cursor:pointer;'>";
            html += "<td>" + dataItem.id + '</td>';
            html += "<td>" + dataItem.name + '</td>';
            html += "<td>" + dataItem.property.star + '</td>';
            html += "<td>" + dataItem.property.quality + '</td>';
            html += "</tr>";

            html += "<tr>";
            html += "<td colspan='4' style='display: none; '>" +
            "<p><span style='font-weight: bold;'>技能：</span>"+ self.getSkillStr( dataItem.property.skill ) +"</p>" +
            "<P><span style='font-weight: bold;'>装备：</span>"+ self.getEquipStr( dataItem.property.equip ) +"</P>" +
            "</td>";
            html += "</tr>";
        });
        html += '</tbody>'+
        '    </table>';

        var $ = this.jQuery;
        $('#' + placeholder ).html( html ).show()
        .find('tr[name=list_item] td').bind( 'click', function() {
            $( this ).parents('tr').next().find('td').toggle();
        } );
    }

    private getSkillStr( data: Array<any> ) {
        var html: Array<string> = [];
        data && data.forEach(function(dataItem: any) {
            html.push( dataItem.skillName  + dataItem.level + '级' );
        });
        return html.join('，');
    }

    private getMagicInfo( magicValue: number ) {
        if( magicValue >= 0 && magicValue <= 20 ) {
            return '普通附魔';
        } else if( magicValue >= 21 && magicValue <= 80 ) {
            return '高级附魔';
        } else if( magicValue >= 81 && magicValue <= 160 ) {
            return '专家附魔';
        } else {
            return '附魔信息不正确';
        }
    }

    private getEquipStr( data: Array<any> ) {
        var self = this;
        var html: Array<string> = [];
        data && data.forEach(function(dataItem: any) {
            html.push( dataItem.itemName + '(' + self.getMagicInfo( dataItem.magic ) + ')' );
        });
        return html.join('，');
    }

    public backPackItemsView( areaID: number, roleID : number, backpackListID : string ) {
        var self = this;
        var ajaxOption : any = {};
        ajaxOption.url = "index.php?/account/accountInfo?query_type=backpack&area="+ areaID +"&role_id=" + roleID;
        ajaxOption.dataType = 'json';
        ajaxOption.type = 'get';
        ajaxOption.success = function( response ) {
            if( response.error ) {
                alert( response.message );
                return;
            }
            self.renderBackPackItems(backpackListID, response.data);
        }
        this.jQuery.ajax( ajaxOption );
    }

    public cardView( areaID: number, roleID: number, cardListID: string ) {
        var self = this;
        var ajaxOption : any = {};
        ajaxOption.url = "index.php?/account/accountInfo?query_type=card&area="+ areaID +"&role_id=" + roleID;
        ajaxOption.dataType = 'json';
        ajaxOption.type = 'get';
        ajaxOption.success = function( response ) {
            if( response.error ) {
                alert( response.message );
                return;
            }
            self.renderCardList(cardListID, response.data);
        }
        this.jQuery.ajax( ajaxOption );
    }
}


 class AccountOperateBaseClass {
    public $: any;
    public customTimeRangeType: number;
    public customReason: string;

    constructor( jQuery: any ) {
        this.$ = jQuery;
        this.initAccountLock();
    }

    private initAccountLock() : void {
        var self: AccountOperateBaseClass = this;
        this.$('#time_range').bind( 'change', function() {
            if(this.value !== self.customTimeRangeType.toString() ) {
                self.$('#end_time').val('');
                self.$('#end_time').attr('disabled','disabled');
            } else {
                self.$( '#end_time' ).removeAttr('disabled');
            }
        } );

        this.$('#reason').bind( 'change', function() {
            if(this.value !== self.customReason ) {
                self.$('#custom_reason').val('');
                self.$('#custom_reason').attr('disabled','disabled');
            } else {
                self.$( '#custom_reason' ).removeAttr('disabled');
            }
        } );
    }

     public formateDate( date: Date ) : string {
         var year: number = date.getFullYear();
         var month: number = date.getMonth() + 1;
         var day: number = date.getDate();
         var hour: number = date.getHours();
         var minute: number = date.getMinutes();
         var second : number = date.getSeconds();
         return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
     }

     public getEndDate( day: number ) : string{
         var begin = new Date();
         var end = new Date(begin.getTime() + 1000 * 3600 * 24 * day);
         return this.formateDate(end);
     }
}

//封号解封
class AccountLock extends AccountOperateBaseClass {
    static TIME_RANGE_ONE : number = 0;
    static TIME_RANGE_THREE : number = 1;
    static TIME_RANGE_SEVEN: number  = 2;
    static TIME_RANGE_ALWAYS: number  = 3;
    static TIME_RANGE_CUSTOM: number  = 4;
    static REASON_CUSTOM : string = 'custom';

    private BASE64;
    constructor( jQuery: any, BASE64: any) {
        super(jQuery);
        this.BASE64 = BASE64;
        this.customTimeRangeType = AccountLock.TIME_RANGE_CUSTOM;
        this.customReason = AccountLock.REASON_CUSTOM;

        this.initFillId();
    }

    private initFillId() {
       Common.initSwitchInputAndFile(this.$, this.BASE64, 'player_id');
    }

    public unLock( id : string ) {
        if( !confirm( '确定要恢复吗？' ) ) {
            return;
        }
        var ajaxOption : any = {};
        ajaxOption.dataType = 'JSON';
        ajaxOption.type = 'POST';
        ajaxOption.url = "index.php?/account/accountLock?type=unlock";
        ajaxOption.data = {
            id: id
        };
        ajaxOption.success = function( response : CommonInterface.ExecGMCmdResponse ) {
            alert( response.message );
            if( response.error === 0 ) {
                window.location.reload();
            }
        }
        ajaxOption.error = function() {
            alert( JSON.stringify( arguments ) );
        }
        this.$.ajax( ajaxOption );
    }

    public accountLock( successCallback ? : Function) : void {
        var $ = this.$;
        var area:string = $('#area').val();
        var playerID:string = $.trim($('#player_id').val());
        var timeRange:string = $('#time_range').val();
        var endTime:string = $.trim($('#end_time').val());
        var reason:string = $.trim($('#reason').val());
        var customReason:string = $.trim($('#custom_reason').val());

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

        var data:any = new Object;
        data.area = area;
        data.playerID = playerID;
        data.endTime = endTime;
        data.desc = reason;

        var ajaxOption:any = new Object;
        ajaxOption.url = "index.php?/account/accountLock?type=handle";
        ajaxOption.dataType = 'JSON';
        ajaxOption.type = 'POST';
        ajaxOption.data = data;
        ajaxOption.success = function (response: any) {
            if( typeof successCallback === 'function') {
                successCallback( response );
                return;
            }
            var fillIdType = parseInt( $('#fill_id_type').val() );
            if(fillIdType === Common.FILL_ID_FILE) {
                var ajaxResultRender = new AjaxResultRender($);
                ajaxResultRender.accountLock( 'the_form', 'result_view', response );
            } else {
                alert(response.message);
                if (response.error == 0) {
                    window.location.reload();
                }
            }
        }
        ajaxOption.error = function () {
            alert(JSON.stringify(arguments));
        }
        this.$.ajax(ajaxOption);
    }
}

//禁言和解除禁言
class AccoutForbiddenChat extends AccountOperateBaseClass{
    static TIME_RANGE_ONE : number = 0;
    static TIME_RANGE_THREE : number = 1;
    static TIME_RANGE_SEVEN: number  = 2;
    static TIME_RANGE_ALWAYS: number  = 3;
    static TIME_RANGE_CUSTOM: number  = 4;
    static REASON_CUSTOM : string = 'custom';

    constructor( jQuery: any) {
        super(jQuery);
        this.customTimeRangeType = AccountLock.TIME_RANGE_CUSTOM;
        this.customReason = AccountLock.REASON_CUSTOM;
    }

    public forbiddenChat( successCallback : Function ) {
        var area : string = this.$('#area').val();
        var playerID : string = this.$.trim(this.$('#player_id').val());
        var timeRange : string = this.$('#time_range').val();
        var endTime : string = this.$.trim(this.$('#end_time').val());
        var reason : string = this.$.trim(this.$('#reason').val());
        var customReason : string = this.$.trim(this.$('#custom_reason').val());

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
                endTime = this.getEndDate( 7 );
                break;
            case AccoutForbiddenChat.TIME_RANGE_ALWAYS:
                endTime = this.getEndDate(36500);
                break;
            case AccoutForbiddenChat.TIME_RANGE_CUSTOM:
                if( !endTime ) {
                    alert('请选择结束时间');
                    return;
                }
                break;
        }

        if(reason.length == 0) {
            alert('请选择禁言原因');
            return;
        }

        if(reason == AccoutForbiddenChat.REASON_CUSTOM  ) {
            if(customReason.length == 0 ) {
                alert('请输入自定义禁言原因');
                return;
            }
            reason = customReason;
        }

        var data : any = new Object;
        data.area = area;
        data.playerID = playerID;
        data.endTime = endTime;
        data.desc = reason;

        var ajaxOption : any = new Object;
        ajaxOption.url = "index.php?/account/forbiddenChat?type=handle";
        ajaxOption.dataType = 'JSON';
        ajaxOption.type = 'POST';
        ajaxOption.data = data;
        ajaxOption.success = function (response : CommonInterface.ExecGMCmdResponse ) {
            if( typeof successCallback === 'function') {
                successCallback( response );
                return;
            }
            alert(response.message);
            if( response.error == 0 ) {
                window.location.reload();
            }
        }
        ajaxOption.error = function () {
            alert(JSON.stringify(arguments));
        }
        this.$.ajax(ajaxOption);
    }

    public cancelForbiddenChat( id : string ) {
        if( !confirm( '确定要恢复吗？' ) ) {
            return;
        }
        var ajaxOption : any = {};
        ajaxOption.dataType = 'JSON';
        ajaxOption.type = 'POST';
        ajaxOption.url = "index.php?/account/forbiddenChat?type=cancelForbiddenChat";
        ajaxOption.data = {
            id: id
        };
        ajaxOption.success = function( response : CommonInterface.ExecGMCmdResponse ) {
            alert( response.message );
            if( response.error === 0 ) {
                window.location.reload();
            }
        }
        ajaxOption.error = function() {
            alert( JSON.stringify( arguments ) );
        }
        this.$.ajax( ajaxOption );
    }
}