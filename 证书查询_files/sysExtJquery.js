var sys = sys || {};
sys.data = sys.data || {};// 用于存放临时的数据或者对象

/**
 * 屏蔽右键
 */
$(document).bind('contextmenu', function () {
    // return false;
});

/**
 * 禁止复制
 */
$(document).bind('selectstart', function () {
    // return false;
});


sys.ns = function () {
    var o = {}, d;
    for (var i = 0; i < arguments.length; i++) {
        d = arguments[i].split(".");
        o = window[d[0]] = window[d[0]] || {};
        for (var k = 0; k < d.slice(1).length; k++) {
            o = o[d[k + 1]] = o[d[k + 1]] || {};
        }
    }
    return o;
};

//将form表单中的元素值装换成json
sys.serializeForm = function (form, datagrid, collectionname) {
    var o = "";

    $.each(form.find("input[qz='true']"), function (index) {
        //easyui 数字控件
        if (typeof ($(this).attr("numberboxname")) != "undefined") {
            var temp = $(this).next("input");
            o = o + "'" + temp.attr("name") + "':'" + $(temp).val() + "',";
        } else if ($(this).attr('class') != undefined && $(this).attr('class').indexOf('easyui-datebox') >= 0)//easyui时间控件
        {
            var dat = $(this).next("span").find("input[type='hidden']");
            o = o + "'" + dat.attr("name") + "':'" + $(dat).val() + "',";
        } else {
            if (this['name'] != "")
                o = o + "'" + this['name'] + "':'" + this['value'] + "',";
        }
    });

    $.each(form.find("select[lx='MgmCombox'][qz='true']"), function (index) {

        if (typeof ($(this).attr("qztext")) != "undefined") {
            o = o + "'" + this['name'] + "':'" + $(this).MgmCombox('getSelectText') + "',";
        } else {
            o = o + "'" + this['name'] + "':'" + $(this).MgmCombox('getSelectValue') + "',";
        }
    });


    $.each(form.find("div[lx='MgmCorpCtl'][qz='true']"), function (index) {
        var s = $(this).MgmCorpCtl('getSelectID');
        o = o + "'" + $(this).attr("corpField") + "':'" + s.corpid + "',";
        o = o + "'" + $(this).attr("deptFiled") + "':'" + s.deptid + "',";
        o = o + "'" + $(this).attr("userFiled") + "':'" + s.userid + "',";
    });

    $.each(form.find("div[lx='MgmDateCtl'][qz='true']"), function (index) {
        var begin = $(this).MgmDateCtl('getBeginValue');
        var end = $(this).MgmDateCtl('getEndValue');
        o = o + "'" + $(this).attr("beginField") + "':'" + begin + "',";
        o = o + "'" + $(this).attr("endFiled") + "':'" + end + "',";
    });

    if (datagrid != null && datagrid != undefined) {
        var gt = "";
        var rows;

        rows = cgrid.datagrid("getRows");
        for (var i = 0; i < rows.length; i++) {
            cgrid.datagrid("endEdit", i);
        }

        rows = cgrid.datagrid("getRows");
        console.info(rows);
        for (var i = 0; i < rows.length; i++) {
            gt = gt + JSON.stringify(rows[i]) + ",";
        }
        gt = "'" + collectionname + "':[" + gt + "]";
        o = o + gt;
    }
    o = "{" + o + "}";
    return o;
}

//将json数据赋值给form表单
sys.setDataToForm = function (form, data) {
    $.each(form.find("input[fz='true']"), function (index) {
        //easyui 数字控件
        if (typeof ($(this).attr("numberboxname")) != "undefined") {
            $(this).numberbox('setValue', data[$(this).attr("numberboxname")]);
        } else if ($(this).attr('class') != undefined && $(this).attr('class').indexOf('easyui-datebox') >= 0)//easyui时间控件
        {
            $(this).datebox('setValue', data[$(this).attr("comboname")]);
            //var dat= $(this).next("span").find("input[type='hidden']");
            //o=o+"'"+ dat.attr("name")+"':'"+ $(dat).val()+"',";
        } else {
            if (this['name'] != undefined && this['name'].length > 0)
                $(this).val(data[this['name']]);
        }
    });

    $.each(form.find("select[lx='MgmCombox'][fz='true']"), function (index) {
        if (this['name'] != undefined && this['name'].length > 0) {
            if (typeof ($(this).attr("fztext")) != "undefined") {
                $(this).MgmCombox('setSelectText', data[this['name']]);
            } else {
                $(this).MgmCombox('setSelectValue', data[this['name']]);
            }
            //$(this).MgmCombox("onchange");
        }
    });

    $.each(form.find("div[lx='MgmCorpCtl'][fz='true']"), function (index) {

        var v = {
            "corpid": data[$(this).attr("corpField")],
            "deptid": data[$(this).attr("deptFiled")],
            "userid": data[$(this).attr("userFiled")]
        };
        //console.info(v);
        $(this).MgmCorpCtl('setSelectID', v);
    });
};


/**
 * 增加formatString功能
 * @example sy.formatString('字符串{0}字符串{1}字符串','第一个变量','第二个变量');
 *
 * @returns 格式化后的字符串
 */
sys.formatString = function (str) {
    for (var i = 0; i < arguments.length - 1; i++) {
        str = str.replace("{" + i + "}", arguments[i + 1]);
    }
    return str;
};

/**
 * 接收一个以逗号分割的字符串，返回List，list里每一项都是一个字符串
 *
 *
 * @returns list
 */
sys.stringToList = function (value) {
    if (value != undefined && value != '') {
        var values = [];
        var t = value.split(',');
        for (var i = 0; i < t.length; i++) {
            values.push('' + t[i]);/* 避免他将ID当成数字 */
        }
        return values;
    } else {
        return [];
    }
};

/**
 * JSON对象转换成String
 *
 * @param o
 * @returns
 */
sys.jsonToString = function (o) {
    var r = [];
    if (typeof o == "string")
        return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
    if (typeof o == "object") {
        if (!o.sort) {
            for (var i in o)
                r.push(i + ":" + sy.jsonToString(o[i]));
            if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                r.push("toString:" + o.toString.toString());
            }
            r = "{" + r.join() + "}";
        } else {
            for (var i = 0; i < o.length; i++)
                r.push(sy.jsonToString(o[i]));
            r = "[" + r.join() + "]";
        }
        return r;
    }
    return o.toString();
};

sys.cookie = function (key, value, options) {
    if (arguments.length > 1 && (value === null || typeof value !== "object")) {
        options = $.extend({}, options);
        if (value === null) {
            options.expires = -1;
        }
        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }
        return (document.cookie = [encodeURIComponent(key), '=', options.raw ? String(value) : encodeURIComponent(String(value)), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join(''));
    }
    options = value || {};
    var result, decode = options.raw ? function (s) {
        return s;
    } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};

/**
 * 改变jQuery的AJAX默认属性和方法
 *
 *
 * @requires jQuery
 *
 */

$.ajaxSetup({
    type: 'POST',
    async: false,
    data: typeof(this.data)=='undefined'?"":this.data.replace(/\\x0A/g,"").replace(/\\x09/g,"").replace(/\\x0D/g,"").replace(/\\n/g,"").replace(/\\r/g,"").replace(/\\t/g,"").replace(/\\cl/g,"").replace(/\\09/g,"").replace(/\s+/g,""),
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.status == 408) {
            //retry  1次
            $.ajax({
                type: this.type,
                url: this.url,
                data: this.data,
                success: this.success,
                error: function () {
                    if (this.url == '/examing/submitPaper') {
                        $.ajax({
                            url: "/exam/errorRecord",
                            type: "get",
                            async: false,
                            success: function (data) {

                            }, error: function () {

                            }
                        });
                        window.location.href = "/examination/list";
                    }
                }
            });
        } else {
            if (this.url == '/examing/submitPaper') {
                window.location.href = "/examination/list";
            }
            try {
                parent.$.messager.progress('close');
                parent.$.messager.alert('错误', 'system error!!!');
            } catch (e) {
                //alert(XMLHttpRequest.responseText);
                alert("error");
            }
        }
    },
    complete: function (XMLHttpRequest, textStatus) {
        var resText = XMLHttpRequest.responseText;
        //alert(resText);
        if (resText != null && resText != "") {
            if (resText == "NOSESSION") top.location.href = "/login.html";
            if (resText == "NOPRIVILEGE") top.location.href = "/login.html";
        }
    }
});

/**
 * 解决class="iconImg"的img标记，没有src的时候，会出现边框问题
 *
 * @requires jQuery
 */
$(function () {
    $('.iconImg').attr('src', sys.pixel_0);
});


sys.modalDialog = function (options) {
    var opts = $.extend({
        //minimizable: true,
        maximizable: true,

        resizable: true,
        title: '&nbsp;',
        //divTop:0,
        width: 640,
        height: 480,
        modal: true,
        backdata: null,
        callback: function () {
        },
        onClose: function () {
            if (options.callback) {
                options.callback($(this).dialog("options").backdata);
            }
            $(this).dialog('destroy');
        }
    }, options);
    opts.modal = true;// 强制此dialog为模式化，无视传递过来的modal参数
    //opts.shadow=true;
    if (options.url) {
        opts.content = '<iframe id="Q!W@" custom="true"  src="' + options.url + '"  allowTransparency="true" inline="true" scrolling="auto" width="100%" height="98%" frameBorder="0" name=""></iframe>';
    }
    /*var dTop="";
    if(options.divTop!=0){
        dTop='style="top: '+options.divTop+'px"';
    }*/
    return $('<div/>').dialog(opts);
    //return $('<div/>').window(opts);
    //return $('<div />').dialog(opts).data().window.shadow.append('<iframe width="100%" height="100%" frameborder="0" scrolling="no"></iframe>');
    //return $('<div/>').window(opts).data().window.shadow.append('<iframe width="100%" height="100%" frameborder="0" scrolling="no"></iframe>');
};

sys.loadingDialog = function () {
    return $('<div title="等待" style="padding:10px;"><img src="/images/loading.gif" style="width: 30px;height: 30px; "><span style="margin-left:5px"> 等待....</span></div>').window({
        collapsible: false,
        minimizable: false,
        maximizable: false,
        closable: false,
        width: 220,
        height: 100,
        modal: true
    });
}

sys.print = function (info) {
    console.info(info);

};
sys.getCurrDate = function () {
    var s = "";
    var theDate = new Date();
    s += theDate.getFullYear().toString() + "-";                         // 获取年份。
    s += (theDate.getMonth() + 1) + "-";            // 获取月份。
    s += theDate.getDate();
    s += " " + theDate.getHours() + ":" + theDate.getMinutes() + ":" + theDate.getSeconds();
    return s;

};

/**
 * 预览本地图片 sourceId：file文件控件id, targetId:图片(img)控件的id
 */
sys.preImg = function preImg(sourceId, targetId) {
    var url = document.getElementById(sourceId).value;
    if (navigator.userAgent.indexOf("MSIE") >= 1) { //IE
        url = document.getElementById(sourceId).value;
    } else if (navigator.userAgent.indexOf("Firefox") > 0) { //Firefox
        url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
    } else if (navigator.userAgent.indexOf("Chrome") > 0) { //Chrome
        url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
    }
    //alert(url);
    var imgPre = document.getElementById(targetId);
    imgPre.src = url;
} 
