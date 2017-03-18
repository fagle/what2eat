define( function( require, exports, module ) {
    var NewOpenAndClose = require( 'gm_openandclose' );
    var HtmlFramework = require( 'htmlframework' );
    var PopupLayer = require( 'popuplayer' );
    var Mask = require( 'mask' );
    var common = require( 'common' );

    var DialogHtml = function( opt ) {
        HtmlFramework.call( this );

        this.getContent = function( content ) {
            var html = '    <div class="aui_state_focus chat_monitor_dialog" id="##">'+
                '        <div class="aui_outer">'+
                '            <table class="aui_border">'+
                '                <tbody>'+
                '                    <tr>'+
                '                        <td class="aui_nw"></td>'+
                '                        <td class="aui_n"></td>'+
                '                        <td class="aui_ne"></td>'+
                '                    </tr>'+
                '                    <tr>'+
                '                        <td class="aui_w"></td>'+
                '                        <td class="aui_c"><div class="aui_inner">'+
                '                                <table class="aui_dialog">'+
                '                                    <tbody>'+
                '                                        <tr>'+
                '                                            <td colspan="2" class="aui_header"><div'+
                '                                                    class="aui_titleBar">'+
                '                                                    <div class="aui_title"'+
                '                                                        style="display: block;">'+ opt.title +'</div>'+
                '                                                    <a class="aui_close" id="##_close_btn" href="javascript:/*artDialog*/;"'+
                '                                                        style="display: block;">×</a>'+
                '                                                </div></td>'+
                '                                        </tr>'+
                '                                        <tr>'+
                '                                            <td class="aui_icon" style="display: none;"><div'+
                '                                                    class="aui_iconBg" style="background: none;"></div></td>'+
                '                                            <td class="aui_main" style="width: auto; height: auto;">'+
                '                                                <div class="aui_content content">'+
                content +
                '                                                </div>'+
                '                                            </td>'+
                '                                        </tr>'+
                '                                        <tr>'+
                '                                            <td colspan="2" class="aui_footer"><div'+
                '                                                    class="aui_buttons">'+
                '                                                    <button class=" aui_state_highlight" type="button" id="##_submit_dialog_btn">确定</button>'+
                '                                                    <button type="button" id="##_cancel_dialog_btn">取消</button>'+
                '                                                </div></td>'+
                '                                        </tr>'+
                '                                    </tbody>'+
                '                                </table>'+
                '                            </div></td>'+
                '                        <td class="aui_e"></td>'+
                '                    </tr>'+
                '                    <tr>'+
                '                        <td class="aui_sw"></td>'+
                '                        <td class="aui_s"></td>'+
                '                        <td class="aui_se" style="cursor: se-resize;"></td>'+
                '                    </tr>'+
                '                </tbody>'+
                '            </table>'+
                '        </div>'+
                '    </div>';
            return html;
        }
    }

    function throwException( element, msg ) {
        throw { element: element, message: msg };
    }

    function getDefaultActionDialog( opt ) {
        var title = opt.title;
        var htmlDialog = opt.htmlDialog;

        var mask = Mask.create();
        var oc = new NewOpenAndClose();
        var html = new DialogHtml( { title: title } );
        var dialog = dialogAlias = new PopupLayer( oc, html, htmlDialog );
        dialog.addListener( 'opened', function() {
            mask.show();
        } );
        dialog.addListener( 'closed', function() {
            mask.hide();
            dialog.dispose();
        } );
        dialog.addListener( 'renderComplete', function() {
            dialog.getJDom('_cancel_dialog_btn').bind('click', function() {
               dialog.close();
            });
            dialog.getJDom('_close_btn').bind('click', function(){
                dialog.close();
            });
        });
        return dialog;
    }

    function showLockAccountDialog( html, area, account, AccountLock ) {
        var dialog = getDefaultActionDialog( { htmlDialog: html, title: '封号' } );
        dialog.addListener( 'renderComplete', function() {
            dialog.getJDom('_account').html( account );
            $('#player_id').val( account );
            $('#area').val( area );
            $('#end_time').datepicker({dateFmt:'yyyy-MM-dd HH:mm:ss'});
        } );
        dialog.addListener( 'renderComplete', function() {
            var accountLock = new AccountLock(parent.$, null);
            dialog.getJDom('_submit_dialog_btn').bind('click', function(){
                accountLock.accountLock(function( response ) {
                   alert( response.message );
                    if( response.error === 0 ) {
                        dialog.close();
                    }
                });
            });
        } );
        dialog.initialize();
        dialog.open();
    }

    function showForbiddenTalkDialog( html, area, account, AccoutForbiddenChat ) {
        var dialog = getDefaultActionDialog( { htmlDialog: html, title: '禁言' } );
        dialog.addListener( 'renderComplete', function() {
            dialog.getJDom('_account').html( account );
            $('#player_id').val( account );
            $('#area').val( area );
            $('#end_time').datepicker({dateFmt:'yyyy-MM-dd HH:mm:ss'});
        } );
        dialog.addListener( 'renderComplete', function() {
            var forbiddenChat = new AccoutForbiddenChat(parent.$, null);
            dialog.getJDom('_submit_dialog_btn').bind('click', function(){
                forbiddenChat.forbiddenChat(function( response ) {
                    alert( response.message );
                    if( response.error === 0 ) {
                        dialog.close();
                    }
                });
            });
        } );
        dialog.initialize();
        dialog.open();
    }

    exports.showLockAccountDialog = showLockAccountDialog;
    exports.showForbiddenTalkDialog = showForbiddenTalkDialog;
} );