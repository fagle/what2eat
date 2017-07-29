var Common = (function () {
    function Common() {
    }
    Common.base64ToString = function (BASE64, base64Str) {
        base64Str = base64Str.replace(/[\s\S]+,/, '');
        var unicode = BASE64.decoder(base64Str);
        var playerIdStr = '';
        for (var i = 0; i < unicode.length; i++) {
            playerIdStr += String.fromCharCode(unicode[i]);
        }
        playerIdStr = playerIdStr.replace(/\s+/g, ',');
        return playerIdStr;
    };
    Common.initSwitchInputAndFile = function ($, BASE64, resultFieldId) {
        $('#fill_id_type').bind('click', function () {
            var type = parseInt(this.value);
            $('#' + resultFieldId).val('');
            if (type === Common.FILL_ID_TEXT) {
                $('#player_id_text').show();
                $('#player_id_file').hide();
            }
            else if (type == Common.FILL_ID_FILE) {
                $('#player_id_text').hide();
                $('#player_id_file').show();
            }
            else {
                alert('输入类型出错');
            }
        });
        $('#player_id_file input[type="file"]').bind('change', function () {
            var fileName = $('#player_id_file_name');
            var file = this.files[0];
            if (!/\.(txt|text)$/.test(file.name)) {
                alert('必须使用文本文件');
                this.value = '';
                fileName.html('');
                return;
            }
            fileName.html(file.name).show();
            var fileReader = new FileReader;
            fileReader.readAsDataURL(this.files[0]);
            fileReader.onload = function (e) {
                var base64Str = fileReader.result;
                var playerIdStr = Common.base64ToString(BASE64, base64Str);
                $('#' + resultFieldId).val(playerIdStr);
            };
        });
        $('#player_id_text').bind('change', function () {
            $('#' + resultFieldId).val(this.value);
        });
    };
    Common.FILL_ID_TEXT = 1;
    Common.FILL_ID_FILE = 2;
    return Common;
})();
//# sourceMappingURL=common_fns.js.map