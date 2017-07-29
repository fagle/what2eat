//事件基础类
var EventBase = function(){};

EventBase.prototype = {

    addListener : function ( type, listener ) {
        getListener( this, type, true ).push( listener );
    },

    removeListener : function ( type, listener ) {
        var listeners = getListener( this, type );
        listeners && utils.removeItem( listeners, listener );
    },

    fireEvent : function ( type ) {
        var listeners = getListener( this, type ),
            r, t, k;
        if ( listeners ) {
            k = listeners.length;
            while ( k -- ) {
                t = listeners[k].apply( this, arguments );
                if ( t !== undefined ) {
                    r = t;
                }
            }
        }
        if ( t = this['on' + type.toLowerCase()] ) {
            r = t.apply( this, arguments );
        }
        return r;
    }
};

function getListener( obj, type, force ) {
    var allListeners;
    type = type.toLowerCase();
    return ( ( allListeners = ( obj.__allListeners || force && ( obj.__allListeners = {} ) ) )
    && ( allListeners[type] || force && ( allListeners[type] = [] ) ) );
}

//文档基础类
var UIBase = function()
{
    var self = this;
    this._id = '$UI' + (++ UIBase.index);
    this._globalKey = "";
    this.getHTML = function()
    {
        return "";
    }

    var setGlobalKey = function()
    {
        var magic = '$UI_Items';
        self._globalKey = 'window.'+magic+'.'+self._id;
        window[magic] = window[magic] || {};
        window[magic][self._id] = self;
    }

    var formatHTML = function(html)
    {
        html = html.replace(/\$\$/g, self._globalKey);
        html = html.replace(/&&/g,self._id);
        return html;
    }

    var initUIBase = function()
    {
        setGlobalKey();
    }

    this.renderHTML = function()
    {
        return formatHTML(this.getHTML());
    }

    this.getJQuery = function()
    {
        var dom = document.getElementById(this._id)
        return $(dom)
    }

    initUIBase();
}

UIBase.index = 0;

/*可扩展UBBEditor*/

function absolutePoint(element) {
    var result = { x: element.offsetLeft, y: element.offsetTop };
    element = element.offsetParent;
    while (element) {
        result.x += element.offsetLeft;
        result.y += element.offsetTop;
        element = element.offsetParent;
    }
    return result;
}

//编辑器主类
var Editor = function(editorid)
{
    var self = this;

    this.getEditor = function()
    {
        return document.getElementById(editorid);
    }

    this.getEditorText = function() {
        var editor = this.getEditor();
        if (editor) return editor.value;
    }

    this.setEditorText = function(value) {
        var editor = this.getEditor();
        if (editor) return editor.value = value;
    }

    this.getSelectText = function() {
        var editor = this.getEditor();
        if (!editor) return;
        editor.focus();
        if (this.range)
            return this.range.text;
        else if (editor.document && editor.document.selection)
            return editor.document.selection.createRange().text;
        else if (typeof editor.selectionStart != "undefined")
            return editor.value.substring(editor.selectionStart, editor.selectionEnd);
    }

    this.setSelectText = function(value) {
        var editor = this.getEditor();
        if (!editor) return;
        editor.focus();
        if (this.range) {
            this.range.text = value;
            this.range.select();
            this.range = null;
        } else if (editor.document && editor.document.selection)
            editor.document.selection.createRange().text = value;
        else if (typeof editor.selectionStart != "undefined") {
            var str = editor.value;
            var start = editor.selectionStart;
            var top = editor.scrollTop;
            editor.value = str.substr(0, start) + value +
            str.substring(editor.selectionEnd, str.length);
            editor.selectionStart = start + value.length;
            editor.selectionEnd = start + value.length;
            editor.scrollTop = top;
        }
    }

    this.focus = function(pos)
    {
        var editor = this.getEditor();
        if(editor.createTextRange)
        {
            var range = editor.createTextRange();
            range.move("character", pos);
            range.select();
        }
        else if(typeof editor.selectionStart != "undefined")
        {
            editor.focus();
            editor.setSelectionRange(pos, pos);
        }
    }

    this.initialize = function()
    {
        var editor = self.getEditor();
        $(editor).bind('keyup', eventProxy);
        $(editor).bind('blur', eventProxy);
    }

    var eventProxy = function(evt)
    {
        self.fireEvent( 'keyup' );
        //self.fireEvent(evt.type.replace(/^on/i,''));
    }
}

Editor.prototype = new EventBase();

//编辑器界面类
var EditorUI = function(opt)
{
    UIBase.call(this);

    this.width = opt.width;
    this.height = opt.height;
    this.tools = opt.tools;

    var self = this;

    var editor = new Editor(this._id);

    var getToolbarHTML = function(placeHolder)
    {
        var toolbar = new Toolbar();

        if(!self.tools)
        {
            self.tools = [];
            for(var plugin in UBBPluginConfig) self.tools.push(plugin);
        }

        for(var i = 0 ; i < self.tools.length ; i ++)
        {
            var tool = UBBPluginConfig[self.tools[i]];
            if(tool) toolbar.add(tool(editor));
        }

        return toolbar.renderHTML();
    }

    var initEditor = function()
    {
        $(document.documentElement).bind('mousedown', function(e){
            var t = e.target || e.srcElement;
            PluginPopup.hideAllPops(t);
        })
    }

    this.getHTML = function()
    {
        var html = '<textarea id="'+ this._id +'"></textarea>';
        return html;
    }

    this.render = function(placeHolderid)
    {
        var placeHolder = $(document.getElementById(placeHolderid))
        var html = this.renderHTML() + getToolbarHTML();
        var wrapperid = this._id + '_wrapper';
        var el = document.getElementById(wrapperid);
        if(el) $(el).remove();
        html = '<div class="simple_ubb_editor" id="'+ wrapperid +'">'+ html +'</div>'
        placeHolder.append($(html));
        PluginPopup.hideAllPops();
    }

    initEditor();

    editor.render = function(placeHolderid)
    {
        self.render(placeHolderid);

        this.initialize();
    }

    return editor;
}

//工具条
var Toolbar = function()
{
    UIBase.call(this);

    var tools = [];

    this.add = function(tool)
    {
        tools.push(tool);
    }

    this.getHTML = function()
    {
        var html = '<div class="toolbar" id="'+ this._id +'">';
        for(var i = 0 ; i < tools.length ; i ++)
        {
            html += tools[i].renderHTML();
        }
        html += '</div>'
        return html;
    }
}

//工具条中的按扭
var Button = function(htmlcontent)
{
    UIBase.call(this);


    this.onClick = function(sender){};

    this.getPoint = function()
    {
        var dom = this.getJQuery().get(0);
        var point = absolutePoint(dom);
        point.y += 24;
        return point;
    }

    this.getHTML = function()
    {
        var html = '<div class="ubb_button" onclick="$$._onClick()" id="'+ this._id +'">'+ htmlcontent +'</div>'
        html = html.replace(/<[a-zA-Z]+/g,function(w){
            return w + ' unselectable="on"';
        })
        return html;
    }

    this._onClick = function()
    {
        if(typeof(this.onClick) == 'function') this.onClick(this);
    }
}

//上传图片按扭
var UploadButton = function()
{
    Button.call(this,'');

    this.uploaded = new Function();

    this.getHTML = function()
    {
        var html = '<iframe id="iframe_&&" name="iframe_&&" style="display:none;"></iframe>'
        html += '<form id="form_&&" name="form_&&" method="post" class="p_r" action="" target="iframe_&&" enctype="multipart/form-data" onsubmit="alert(1)">';
        html += '<s class="face-img2"></s>'
        html += '<span>图片</span>'
        html += '<input type="file" id="file_&&" class="btn-upload" name="file_&&" onchange="$$._uploadChange()"/>'
        html += '</form>';
        html = '<div class="upload-btn" id="&&">'+ html +'</div>';
        return html;
    }

    this._uploadChange = function()
    {
        var form = document.getElementById('form_'+this._id);
        form.setAttribute('action','/js/scripts/EditorPluginDialogs/uploadHandler.html');
        form.submit();
    }

    this._uploadCallback = function(url)
    {
        if(typeof(this.uploaded) == 'function') this.uploaded(url);
    }
}


//浮动层基类
var PluginPopupBase = function(plugin , cssClass)
{
    UIBase.call(this);

    this.getHTML = function()
    {
        plugin.setPopup(this);
        var html = '<div class="pluginPopup '+ cssClass +'" id="'+ this._id +'">';
        html += plugin.getContent();
        html += '</div>';
        return html ;
    }

    this.open = function(point)
    {
        var pop = this.getJQuery();
        var screenWidth = $(window).width();
        var left = point.x + pop.width() > screenWidth ? screenWidth - pop.width() : point.x;
        pop.css({left:left,top : point.y, position:'absolute', 'z-index':999});
        pop.show();
    }

    this.close = function()
    {
        var pop = this.getJQuery();
        pop.hide();
    }
}




//浮动层
var PluginPopup = function(plugin , cssClass)
{
    PluginPopupBase.call(this, plugin, cssClass);

    var self = this;

    this.contains = function(el)
    {
        if(!el) return;
        return this.getJQuery().get(0).contains(el);
    }

    var initPopup = function()
    {
        // $(function(){
        $(document.body).append($(self.renderHTML()))
        //})
        PluginPopup.popups.push(self);
    }

    initPopup();
}

PluginPopup.popups = [];

PluginPopup.hideAllPops = function(t)
{
    for(var i = 0 ; i < PluginPopup.popups.length; i ++)
    {
        var pop = PluginPopup.popups[i];
        if(!pop.contains(t)) pop.close();
    }
}



//别一种浮动层
var PluginPopup1 = function(plugin , cssClass)
{
    PluginPopupBase.call(this, plugin , cssClass);

    var self = this;

    var initPopup = function()
    {
        // $(function(){
        $(document.body).append($(self.renderHTML()))
        self.getJQuery().hide();
        //})
        //PluginPopup.popups.push(self);
    }

    initPopup();
}



//表情插件
var FacePlugin = function(editor)
{
    UIBase.call(this);

    var _pop;

    var datasource = [
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'},
        {name:'微笑', src:'http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif' , ubbCode:'[a/]'}
    ];

    this.setPopup = function(popup)
    {
        _pop = popup;
    }

    this.getContent = function()
    {
        return this.renderHTML();
    }

    this.getHTML = function()
    {
        var html = '';
        for(var i = 0 ; i < datasource.length ; i ++)
        {
            var dataItem = datasource[i];
            html += '<img title="'+ dataItem.name +'" src="'+ dataItem.src +'" ubbcode="'+ dataItem.ubbCode +'" onclick="$$.imageClick(this)" />';
        }
        html = '<div>' + html + '</div>';
        return html;
    }

    this.imageClick = function(el)
    {
        var ubbCode = $(el).attr('ubbcode');
        editor.setSelectText(ubbCode);
        _pop.close();
    }
}


var FileUploadPlugin = function(editor)
{
    UIBase.call(this);

    var _pop ;

    this.setPopup = function(popup)
    {
        _pop = popup;
    }

    this.getHTML = function()
    {
        var html = '<s></s>';
        html += '<iframe frameborder="0" id="plugin_&&" width="100%"  src="/js/scripts/EditorPluginDialogs/upload.html" marginwidth="0" marginheight="0"></iframe>';
        return html;
    }

    this.getContent = function()
    {
        return this.renderHTML();
    }

}


var imageUploadedPlugin = function()
{
    UIBase.call(this);

    var _pop , url , self = this;

    var setImageURL = function()
    {
        var img = document.getElementById(self._id);
        img.src = self.url;
    }

    var setCookie = function()
    {
        var cookie = 'tempfile=fileuri='+ self.url+';path=/';
        document.cookie = cookie;
    }

    this.setPopup = function(popup)
    {
        _pop = popup;
    }

    this.getContent = function()
    {
        return this.renderHTML();
    }

    this.getHTML = function()
    {
        var html = '<img id="&&"/><a href="javascript:void(0)" onclick="$$._delete()">删除图片</a>';
        return html;
    }

    this.setImage = function(url)
    {
        this.url = url;
        setImageURL();
        //setCookie();
    }

    var ajaxDelete = function(callback)
    {
        //ajax删除
        /*
         $.ajax({
         url:      '',
         type:     'POST',
         dataType: 'json',
         success:  callback,
         data:     可以服务器端获得cookie中的值进行删除
         })
         */
        callback({success:true});
    }

    this._delete = function()
    {
        var callback = function(data)
        {
            if(data.success)
            {
                self.url = null;
                setImageURL();
                _pop.close();
                if(typeof(self.onDeleteImage)=='function') self.onDeleteImage();
                //document.cookie = '';
            }
        }
        ajaxDelete(callback)
    }
}

//字号插件
var FontSizePlugin = function(editor)
{
    UIBase.call(this);

    var _pop;

    this.setPopup = function(popup)
    {
        _pop = popup;
    }

    this.getContent = function()
    {
        return this.renderHTML();
    }

    this.getHTML = function()
    {
        var html = "";
        html += "<li onclick='$$._itemClick(10)'>10号</li>";
        html += "<li onclick='$$._itemClick(11)'>11号</li>";
        html += "<li onclick='$$._itemClick(12)'>12号</li>";
        html += "<li onclick='$$._itemClick(13)'>13号</li>";
        html += "<li onclick='$$._itemClick(14)'>14号</li>";
        html += "<li onclick='$$._itemClick(15)'>15号</li>";
        html += "<li onclick='$$._itemClick(16)'>16号</li>";
        html += "<li onclick='$$._itemClick(17)'>17号</li>";
        return '<div><ul>' + html + '</ul></div>';
    }

    this._itemClick = function( size )
    {
        var text = editor.getSelectText();
        text = "[size=" + size + "]" + text + "[/size]";
        editor.setSelectText(text);
        _pop.close();
    }
}

//颜色插件
var ColorPlugin = function(editor)
{
    UIBase.call(this);

    var _pop;

    this.setPopup = function(popup)
    {
        _pop = popup;
    }

    this.getContent = function()
    {
        return this.renderHTML();
    }

    this.getHTML = function()
    {
        var html = "";
        var COLORS = (
            'ffffff,000000,eeece1,1f497d,4f81bd,c0504d,9bbb59,8064a2,4bacc6,f79646,' +
            'f2f2f2,7f7f7f,ddd9c3,c6d9f0,dbe5f1,f2dcdb,ebf1dd,e5e0ec,dbeef3,fdeada,' +
            'd8d8d8,595959,c4bd97,8db3e2,b8cce4,e5b9b7,d7e3bc,ccc1d9,b7dde8,fbd5b5,' +
            'bfbfbf,3f3f3f,938953,548dd4,95b3d7,d99694,c3d69b,b2a2c7,92cddc,fac08f,' +
            'a5a5a5,262626,494429,17365d,366092,953734,76923c,5f497a,31859b,e36c09,' +
            '7f7f7f,0c0c0c,1d1b10,0f243e,244061,632423,4f6128,3f3151,205867,974806,' +
            'c00000,ff0000,ffc000,ffff00,92d050,00b050,00b0f0,0070c0,002060,7030a0,').split(',');
        for( var i = 0; i < COLORS.length; i++ ) {
            var color = COLORS[ i ];
            html += "<li style='background-color:#"+ color +"' onclick=\"$$._itemClick('"+ color +"')\"></li>";
        }
        return '<div><ul>' + html + '</ul></div>';
    }

    this._itemClick = function( color )
    {
        var text = editor.getSelectText();
        text = "[" + color + "]" + text + "[-]";
        editor.setSelectText(text);
        _pop.close();
    }
}


//UBB插件配置
var UBBPluginConfig = {};
UBBPluginConfig['face'] = function(editor)
{
    var facePlugin = new FacePlugin(editor);
    var face_pop = new PluginPopup(facePlugin , 'face');
    var face_button = new Button('<img src="http://forum.csdn.net/PointForum/ui/scripts/csdn/Plugin/001/face/2.gif"/>');
    face_button.onClick = function(sender)
    {
        face_pop.open(sender.getPoint());
    }
    return face_button;
}


UBBPluginConfig['imageUpload'] = function(editor)
{
    var button = new UploadButton();
    var imageUploaded = new imageUploadedPlugin(); //图片上传后操作
    var pop =  new PluginPopup1(imageUploaded , 'fileupload'); //弹出层

    button.uploaded = function(url)
    {
        pop.open(button.getPoint());
        imageUploaded.setImage(url);
    }

    imageUploaded.onDeleteImage = function()
    {
        window['uploadSuccess'] = undefined;
    }

    return button;
}

UBBPluginConfig['fontSize'] = function(editor)
{
    var fontSizePlugin = new FontSizePlugin(editor);
    var face_pop = new PluginPopup(fontSizePlugin , 'font_size');
    var face_button = new Button('<img src="http://bbs.csdn.net/assets/markitup/sets/bbcode/fonts.png"/>');
    face_button.onClick = function(sender)
    {
        face_pop.open(sender.getPoint());
    }
    return face_button;
}

UBBPluginConfig['color'] = function(editor)
{
    var colorPlugin = new ColorPlugin(editor);
    var face_pop = new PluginPopup(colorPlugin , 'color');
    var face_button = new Button('<img src="http://bbs.csdn.net/assets/markitup/sets/bbcode/color.gif"/>');
    face_button.onClick = function(sender)
    {
        face_pop.open(sender.getPoint());
    }
    return face_button;
}

UBBPluginConfig['bold'] = function(editor)
{
    var face_button = new Button('<img src="http://bbs.csdn.net/assets/markitup/sets/bbcode/bold.png"/>');
    face_button.onClick = function(sender) {
        var text = editor.getSelectText();
        text = "[b]" + text + "[/b]";
        editor.setSelectText(text);
    }
    return face_button;
}

UBBPluginConfig['italic'] = function(editor)
{
    var face_button = new Button('<img src="http://bbs.csdn.net/assets/markitup/sets/bbcode/italic.png"/>');
    face_button.onClick = function(sender) {
        var text = editor.getSelectText();
        text = "[i]" + text + "[/i]";
        editor.setSelectText(text);
    }
    return face_button;
}

UBBPluginConfig['underline'] = function(editor)
{
    var face_button = new Button('<img src="http://bbs.csdn.net/assets/markitup/sets/bbcode/underline.png"/>');
    face_button.onClick = function(sender) {
        var text = editor.getSelectText();
        text = "[u]" + text + "[/u]";
        editor.setSelectText(text);
    }
    return face_button;
}