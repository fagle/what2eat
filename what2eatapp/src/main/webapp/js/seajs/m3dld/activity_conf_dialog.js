define( function( require, exports, module ) {
    var NewOpenAndClose = require( 'gm_openandclose' );
    var HtmlFramework = require( 'htmlframework' );
    var PopupLayer = require( 'popuplayer' );
    var Mask = require( 'mask' );
    var common = require( 'common' );
    var AreaControl = require('m3dld/area');
    var suggest = require("m3dld/item_query_suggest");
    var fn = require( 'mgms/function.js?v=20150919' );



    var DialogHtml = function( opt ) {
        HtmlFramework.call( this );

        this.getContent = function( content ) {
            var html = '    <div class="aui_state_focus act_conf_dialog" id="##">'+
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

    function initAreaControl( owner, areaRef ) {
        var domId = owner.getId();
        var areaFieldId = "area_" + domId;
        var html = '            <tr>'+
            '                <th>'+
            '                    大区'+
            '                </th>'+
            '                <td  class="dialog_area_field">'+
            '                  <div id="'+ areaFieldId +'" ></div>' +
            '                </td>'+
            '            </tr>';
        owner.getJDom().find('table.form tr').first().before( html );
        var areaControl = new AreaControl();
        areaControl.setMode( AreaControl.CHECKBOX_ALL_MODE );
        areaControl.setValueElement( null );
        areaControl.addListener("change", function(){
            areaRef.areaId = arguments[ 1 ];
        });
        areaControl.render( areaFieldId );
        return areaControl;
    }

    function showEditConditionDialog( params, currWindow ) {
        var html = params.html;
        var dataItem = params.dataItem;
        var mode = params.mode;
        var areaId = params.areaId;
        var pageWindow = params.pageWindow;
        var areaRef = { 'areaId' : areaId };

        var dialog = getDefaultActionDialog( { htmlDialog: html, title: '编辑条件' } );
        dialog.addListener( 'renderComplete', function() {
            //描述编辑器初始化
            var editor_opt = {
                tools:[ 'color' ,'bold', 'italic', 'underline' ]
            };
            var editor = new EditorUI(editor_opt);
            editor.addListener('keyup', function(){
                $('#desc').val( editor.getEditorText() )
            });
            editor.render('editor');

            var jDialog = dialog.getJDom();
            if( mode == 'edit' || mode == 'copy' ) {
                jDialog.find('#id' ).val( dataItem.id );
                jDialog.find('#type' ).val( dataItem.type );
                jDialog.find('#param' ).val( dataItem.param );
                jDialog.find( '#progress').val( dataItem.progress );
                jDialog.find( '#yuanbao').val( dataItem.yuanbao );
                jDialog.find( '#silver').val( dataItem.silver );
                jDialog.find( '#desc').val( dataItem.desc );
                jDialog.find( '#item1').val( dataItem.item1 );
                jDialog.find( '#itemCount1').val( dataItem.itemCount1 );
                jDialog.find( '#item2').val( dataItem.item2 );
                jDialog.find( '#itemCount2').val( dataItem.itemCount2 );
                jDialog.find( '#item3').val( dataItem.item3 );
                jDialog.find( '#itemCount3').val( dataItem.itemCount3 );
                jDialog.find( '#item4').val( dataItem.item4 );
                jDialog.find( '#itemCount4').val( dataItem.itemCount4 );
                editor.setEditorText( dataItem.desc );
            }

            if( mode == 'edit' ) {
                jDialog.find('#id').attr( 'readonly', 'readonly' );
            }

            if( mode == 'copy' ) {
                initAreaControl( this, areaRef );
            }
        } );

        dialog.addListener("renderComplete", function(){
            suggest.m3dldItemSuggest( 'item1', 'item1_suggest', function( dataItem ) {
               $('#item1').val( dataItem.itemID );
            } );
            suggest.m3dldItemSuggest( 'item2', 'item2_suggest', function( dataItem ) {
                $('#item2').val( dataItem.itemID );
            } );
            suggest.m3dldItemSuggest( 'item3', 'item3_suggest', function( dataItem ) {
                $('#item3').val( dataItem.itemID );
            } );
            suggest.m3dldItemSuggest( 'item4', 'item4_suggest', function( dataItem ) {
                $('#item4').val( dataItem.itemID );
            } );
        });

        dialog.addListener( 'renderComplete', function() {
            $( '#dialog_form').validate({
                'rules': {
                    'id':  {
                        required: true
                    },
                    'type': {
                        required: true,
                        digits: true
                    },
                    'param': {
                        required: true,
                        digits: true
                    },
                    'progress': {
                        required: true,
                        digits: true
                    },
                    'yuanbao': {
                        required: true,
                        digits: true
                    },
                    'silver': {
                        required: true,
                        digits: true
                    },
                    'item1': {
                        //required: true
                    },
                    'itemCount1': {
                        //required: true,
                        digits: true
                    },
                    'item2': {
                        //required: true
                    },
                    'itemCount2': {
                        //required: true,
                        digits: true
                    },
                    'item3': {
                        //required: true
                    },
                    'itemCount3': {
                        //required: true,
                        digits: true
                    },
                    'item4': {
                        //required: true
                    },
                    'itemCount4': {
                        //required: true,
                        digits: true
                    },
                    'desc': {
                        required: true
                    }
                },
                'messages' : {
                    'id': {
                        required: '请输入ID'
                    },
                    'type': {
                        required: '请输入类型',
                        digits: '请输入数字'
                    },
                    'param': {
                        required: '请输入参数',
                        digits: '请输入数字'
                    },
                    'progress': {
                        required: '请输入任务进度',
                        digits: '请输入数字'
                    },
                    'yuanbao': {
                        required: '请输入元宝奖励',
                        digits: '请输入数字'
                    },
                    'silver': {
                        required: '请输入银两奖励',
                        digits: '请输入数字'
                    },
                    'item1': {
                        required: '请输入道具奖励1'
                    },
                    'itemCount1': {
                        required: '请输入道具奖励数量1',
                        digits: '请输入数字'
                    },
                    'item2': {
                        required: '请输入道具奖励2'
                    },
                    'itemCount2': {
                        required: '请输入道具奖励数量2',
                        digits: '请输入数字'
                    },
                    'item3': {
                        required: '请输入道具奖励3'
                    },
                    'itemCount3': {
                        required: '请输入道具奖励数量3',
                        digits: '请输入数字'
                    },
                    'item4': {
                        required: '请输入道具奖励4'
                    },
                    'itemCount4': {
                        required: '请输入道具奖励数量4',
                        digits: '请输入数字'
                    },
                    'desc': {
                        required: '请输入任务描述'
                    }
                },
                ignore: '',
                errorClass: 'activity_conf_field_error',
                'submitHandler': function() {
                    var data = $('#dialog_form').serialize();
                    if( !areaRef.areaId ) {
                        alert('请选择大区');
                        return;
                    }
                    var url = 'index.php?/activity_conf/activity_condition?mode=edit_handler';
                    url += "&area=" + areaRef.areaId;
                    url += "&" + data;

                    var ajaxOption = new Object;
                    ajaxOption.dataType = 'JSON';
                    ajaxOption.type = 'POST';
                    ajaxOption.url = url;
                    ajaxOption.success = function( response ) {
                        dialog.close();
                        fn.sgldEditActivityResultView( 'content', 'result_view', response, currWindow );
                        //alert( response.message );
                        //if( response.error === 0 ) {
                        //    dialog.close();
                        //    fn.operateResultView( 'content', 'result_view', response );
                        //    pageWindow.location.reload();
                        //}
                    }
                    ajaxOption.error = function( response ) {
                        alert( JSON.stringify( response ) );
                    }
                    $.ajax( ajaxOption );
                }   
            });

            dialog.getJDom( '_submit_dialog_btn').bind( 'click', function(){
                $( '#dialog_form').submit();
            });
        } );

        dialog.initialize();
        dialog.open();
    }

    function showEditActivityDialog( params, currWindow ) {
        var html = params.html;
        var dataItem = params.dataItem;
        var mode = params.mode;
        var areaId = params.areaId;
        var pageWindow = params.pageWindow;
        var areaRef = { areaId: areaId };

        var dialog = getDefaultActionDialog( { htmlDialog: html, title: '编辑活动' } );
        dialog.addListener( 'renderComplete', function() {
            //描述编辑器初始化
            var editor_opt = {
                tools:[ 'color' ,'bold', 'italic', 'underline' ]
            };
            var editor = new EditorUI(editor_opt);
            editor.addListener('keyup', function(){
                $('#desc').val( editor.getEditorText() )
            });
            editor.render('editor');

            var jDialog = dialog.getJDom();
            if( mode == 'edit' || mode == 'copy' ) {
                jDialog.find('#id' ).val( dataItem.id );
                jDialog.find('#name' ).val( dataItem.name );
                jDialog.find('#title' ).val( dataItem.title );
                jDialog.find('#type' ).val( dataItem.type );
                jDialog.find( '#icon').val( dataItem.icon );
                jDialog.find( '#picture').val( dataItem.picture );
                jDialog.find( '#showTime').val( dataItem.showTime );
                jDialog.find( '#beginTime').val( dataItem.beginTime );
                jDialog.find( '#endTime').val( dataItem.endTime );
                jDialog.find( '#gotoLink').val( dataItem.gotoLink );
                jDialog.find( '#requireId').val( dataItem.requireId );
                jDialog.find( '#desc').val( dataItem.desc );
                editor.setEditorText( dataItem.desc );
            }

            if( mode == 'edit' ) {
                jDialog.find('#id').attr( 'readonly', 'readonly' );
            }

            if( mode == 'copy' ) {
                initAreaControl( this, areaRef );
            }

            jDialog.find( '#beginTime').datepicker({dateFmt:'yyyy-MM-dd HH:mm:ss'});
            jDialog.find( '#endTime').datepicker({dateFmt:'yyyy-MM-dd HH:mm:ss'});
            jDialog.find( '#showTime').datepicker({dateFmt:'yyyy-MM-dd HH:mm:ss'});
        } );

        dialog.addListener( 'renderComplete', function() {
            $( '#dialog_form').validate({
                'rules': {
                    'id':  {
                        required: true
                    },
                    'name': {
                        required: true
                    },
                    'title': {
                        required: true
                    },
                    'type': {
                        required: true,
                        digits: true
                    },
                    'icon': {
                        required: true
                    },
                    'picture': {
                        required: true
                    },
                    'showTime': {
                        required: true
                    },
                    'beginTime': {
                        required: true
                    },
                    'endTime': {
                        required: true
                    },
                    'gotoLink': {
                        required: true
                    },
                    'requireId': {
                        required: true
                    },
                    'desc': {
                        required: true
                    }
                },
                'messages' : {
                    'id':  {
                        required: '请输入id'
                    },
                    'name': {
                        required: '请输入名称'
                    },
                    'title': {
                        required: '请输入标题'
                    },
                    'type': {
                        required: '请输入类型',
                        digits: '请正确输入类型'
                    },
                    'icon': {
                        required: '请输入活动图标'
                    },
                    'picture': {
                        required: '请输入活动二级图片'
                    },
                    'showTime': {
                        required: '请输入展示时间'
                    },
                    'beginTime': {
                        required: '请输入开始时间'
                    },
                    'endTime': {
                        required: '请输入结束时间'
                    },
                    'gotoLink': {
                        required: '请输入链接'
                    },
                    'requireId': {
                        required: '请输入活动条件ID'
                    },
                    'desc': {
                        required: '请输入活动描述'
                    }
                },
                ignore: '',
                errorClass: 'activity_conf_field_error',
                'submitHandler': function() {
                    var data = $('#dialog_form').serialize();
                    if( !areaRef.areaId ) {
                        alert('请选择大区');
                        return;
                    }
                    var url = 'index.php?/activity_conf/activity_list?mode=edit_handler';
                    url += "&area=" + areaRef.areaId;
                    url += "&" + data;
                    var ajaxOption = new Object;
                    ajaxOption.dataType = 'JSON';
                    ajaxOption.type = 'POST';
                    ajaxOption.url = url;
                    ajaxOption.success = function( response ) {
                        //alert( response.message );
                        //if( response.error === 0 ) {
                            dialog.close();
                            fn.sgldEditActivityResultView( 'content', 'result_view', response, currWindow );
                            //pageWindow.location.reload();
                       // }
                    }
                    ajaxOption.error = function( response ) {
                        alert( JSON.stringify( response ) );
                    }
                    $.ajax( ajaxOption );
                }
            });

            dialog.getJDom( '_submit_dialog_btn').bind( 'click', function(){
                $( '#dialog_form').submit();
            });
        } );

        dialog.initialize();
        dialog.open();
    }


    exports.showEditConditionDialog = showEditConditionDialog;
    exports.showEditActivityDialog = showEditActivityDialog;
} );