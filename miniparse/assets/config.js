// https://developer.mozilla.org/ja/docs/Web/API/Document/cookie
var docCookies = {
    getItem: function (sKey) {
        if (!sKey || !this.hasItem(sKey)) { return null; }
        return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return; }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Tue, 19 Jan 2038 03:14:07 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toGMTString();
                    break;
            }
        }
        document.cookie = escape(sKey) + "=" + escape(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    },
    removeItem: function (sKey, sPath) {
        if (!sKey || !this.hasItem(sKey)) { return; }
        document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sPath ? "; path=" + sPath : "");
    },
    hasItem: function (sKey) {
        return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = unescape(aKeys[nIdx]); }
        return aKeys;
    }
};
var cookieMaxAge = 60 * 60 * 24 * 365;  // 365 days

var app = new Vue({
    el: '#app',
    data: {
        timeout_enabled: '1',
        timeout_change_timeout_sec: false,
        timeout_timeout_sec: '15',
        combine_mode: '0',
        urlCopyResult: 'クリップボードにコピーしました',
    },
    computed: {
        url: function () {
            var base = String(location.origin + location.pathname).replace(/\/[^/]*$/, '/miniparse.html');

            var params = [];
            // リセット時間
            if (this.timeout_enabled == '0') {
                params.push('timeout=-1');
            } else {
                if (this.timeout_change_timeout_sec) {
                    params.push('timeout=' + this.timeout_timeout_sec);
                }
            }
            // ペット合算
            if (this.combine_mode != '0') {
                params.push('pet=' + this.combine_mode);
            }

            var url = encodeURI(base + (params.length > 0 ? '?' + params.join('&') : ''));
            return url;
        },
    },
    watch: {
        timeout_enabled: function (val) { docCookies.setItem('timeout_enabled', val, cookieMaxAge); },
        timeout_change_timeout_sec: function (val) { docCookies.setItem('timeout_change_timeout_sec', val, cookieMaxAge); },
        timeout_timeout_sec: function (val) { docCookies.setItem('timeout_timeout_sec', val, cookieMaxAge); },
        combine_mode: function (val) { docCookies.setItem('combine_mode', val, cookieMaxAge); },
    },
    methods: {
        copyURL: function () {
            var temp = document.createElement('div');
            temp.appendChild(document.createElement('pre')).textContent = this.url;
            var style = temp.style;
            style.position = 'fixed';
            style.left = '-100%';
            document.body.appendChild(temp);
            document.getSelection().selectAllChildren(temp);
            var result = document.execCommand('copy');
            document.body.removeChild(temp);
            if (result) {
                this.urlCopyResult = 'クリップボードにコピーしました';
            } else {
                this.urlCopyResult = 'クリップボードへのコピーに失敗しました';
            }
            $('#copy-btn').popover({ trigger: 'focus' });
        },
    },
    mounted: function () {
        if (docCookies.hasItem('timeout_enabled')) {
            this.timeout_enabled = docCookies.getItem('timeout_enabled');
        } else {
            docCookies.setItem('timeout_enabled', this.timeout_enabled, cookieMaxAge);
        }
        if (docCookies.hasItem('timeout_change_timeout_sec')) {
            this.timeout_change_timeout_sec = docCookies.getItem('timeout_change_timeout_sec') == 'true';
        } else {
            docCookies.setItem('timeout_change_timeout_sec', this.timeout_change_timeout_sec, cookieMaxAge);
        }
        if (docCookies.hasItem('timeout_timeout_sec')) {
            this.timeout_timeout_sec = docCookies.getItem('timeout_timeout_sec');
        } else {
            docCookies.setItem('timeout_timeout_sec', this.timeout_timeout_sec, cookieMaxAge);
        }
        if (docCookies.hasItem('combine_mode')) {
            this.combine_mode = docCookies.getItem('combine_mode');
        } else {
            docCookies.setItem('combine_mode', this.combine_mode, cookieMaxAge);
        }
    },
});
