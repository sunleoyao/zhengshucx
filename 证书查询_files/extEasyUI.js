/**
 * 使panel和datagrid在加载时提示
 * 
 * @requires jQuery,EasyUI
 * 
 */
$.fn.panel.defaults.loadingMessage = '加载中....';
$.fn.datagrid.defaults.loadMsg = '加载中....';
//$.fn.datagrid.defaults.striped =true;
$.fn.datagrid.defaults.nowrap=false;
$.fn.datagrid.defaults.rownumbers=true;

//$.fn.combobox.defaults.panelHeight='auto'; //注释原因：内容多时没有滚动条
 

$.extend($.fn.validatebox.defaults.rules, {
	compareDate: {
	validator: function (value, param) {
//		var d = $("input[name='"+param[0]+"']").val(); 
//		var inputs=document.getElementsByName(param[0]);
//		var d=inputs[0].value;
		//var d = $("#"+param[0]).val(); 
		//console.info("#"+param[0]);
		//var d = $("input[name='businessStartTime']").val(); 
		var d = $("#"+param[0]).datebox('getValue'); 
		//var d = $("#businessStartTime").datebox('getValue'); 
		//alert(d);
		var res= sys.dateCompare(d, value); //注意easyui 时间控制获取值的方式
		//alert(res);
		//return false;
		return res;
	},
	message: '开始日期不能大于结束日期.'
	}
});

$.extend($.fn.validatebox.defaults.rules, {
	isDate: {
		validator: function (value) {
			return sys.isDate(value); 
		},
		message: '输入的日期格式不正确'
	}
});

//判断日期是否合法
sys.isDate=function (dateStr) {
	var regex = new RegExp("^(?:(?:([0-9]{4}(-|\/)(?:(?:0?[1,3-9]|1[0-2])(-|\/)(?:29|30)|((?:0?[13578]|1[02])(-|\/)31)))|([0-9]{4}(-|\/)(?:0?[1-9]|1[0-2])(-|\/)(?:0?[1-9]|1\\d|2[0-8]))|(((?:(\\d\\d(?:0[48]|[2468][048]|[13579][26]))|(?:0[48]00|[2468][048]00|[13579][26]00))(-|\/)0?2(-|\/)29))))$");
	 
	if (!regex.test(dateStr)) {
		return false;
	}
	return true;
} 

sys.dateCompare=function (startdate, enddate) {
	//console.info(startdate+":"+enddate);
	//alert(startdate+":"+enddate);
	if (startdate.length > 0 && enddate.length > 0) {   
		var start= new Date(Date.parse(startdate.replace(/-/g,   "/"))); 
	    var end=new Date(Date.parse(enddate.replace(/-/g,   "/")));
	    if(end<start){  
	        return false;  
	    }  
	    return true;  
	}
	return true;
}

/**
 * panel关闭时回收内存，主要用于layout使用iframe嵌入网页时的内存泄漏问题
 */
$.fn.panel.defaults.onBeforeDestroy = function() {
	var frame = $('iframe', this);
	try {
		if (frame.length > 0) {
			for ( var i = 0; i < frame.length; i++) {
				frame[i].src = '';
				frame[i].contentWindow.document.write('');
				frame[i].contentWindow.close();
			}
			frame.remove();
			if (navigator.userAgent.indexOf("MSIE") > 0) {// IE特有回收内存方法
				try {
					CollectGarbage();
				} catch (e) {
				}
			}
		}
	} catch (e) {
	}
};

/**
 * 防止panel/window/dialog组件超出浏览器边界
 * @param left
 * @param top
 */
var easyuiPanelOnMove = function(left, top) {
	var l = left;
	var t = top;
	if (l < 1) {
		l = 1;
	}
	if (t < 1) {
		t = 1;
	}
	var width = parseInt($(this).parent().css('width')) + 14;
	var height = parseInt($(this).parent().css('height')) + 14;
	var right = l + width;
	var buttom = t + height;
	var browserWidth = $(window).width();
	var browserHeight = $(window).height();
	if (right > browserWidth) {
		l = browserWidth - width;
	}
	if (buttom > browserHeight) {
		t = browserHeight - height;
	}
	$(this).parent().css({/* 修正面板位置 */
		left : l,
		top : t
	});
};
$.fn.dialog.defaults.onMove = easyuiPanelOnMove;
//$.fn.window.defaults.onMove = easyuiPanelOnMove;
//$.fn.panel.defaults.onMove = easyuiPanelOnMove;

//网格控件增加工具栏按钮
$.extend($.fn.datagrid.methods, {
	    addToolbarItem : function (jq, items) {
	        return jq.each(function () {
	            var dpanel = $(this).datagrid('getPanel');
	            var toolbar = dpanel.children("div.datagrid-toolbar");
	            if (!toolbar.length) {
	                toolbar = $("<div class=\"datagrid-toolbar\"><table cellspacing=\"0\" cellpadding=\"0\"><tr></tr></table></div>").prependTo(dpanel);
	                $(this).datagrid('resize');
	            }
	            var tr = toolbar.find("tr");
	            for (var i = 0; i < items.length; i++) {
	                var btn = items[i];
	                if (btn == "-") {
	                    $("<td><div class=\"datagrid-btn-separator\"></div></td>").appendTo(tr);
	                } else {
	                    var td = $("<td></td>").appendTo(tr);
	                    var b = $("<a href=\"javascript:void(0)\"></a>").appendTo(td);
	                    b[0].onclick = eval(btn.handler || function () {});
	                    b.linkbutton($.extend({}, btn, {
	                            plain : true
	                        }));
	                }
	            }
	        });
	    },
	    removeToolbarItem : function (jq, param) {
	        return jq.each(function () {
	            var dpanel = $(this).datagrid('getPanel');
	            var toolbar = dpanel.children("div.datagrid-toolbar");
	            var cbtn = null;
	            if (typeof param == "number") {
	                cbtn = toolbar.find("td").eq(param).find('span.l-btn-text');
	            } else if (typeof param == "string") {
	                cbtn = toolbar.find("span.l-btn-text:contains('" + param + "')");
	            }
	            if (cbtn && cbtn.length > 0) {
	                cbtn.closest('td').remove();
	                cbtn = null;
	            }
	        });
	    }
});

/**
 * @requires jQuery,EasyUI
 * 
 * 通用错误提示
 * 
 * 用于datagrid/treegrid/tree/combogrid/combobox/form加载数据出错时的操作
 */
/*
var easyuiErrorFunction = function(XMLHttpRequest) {
	$.messager.progress('close');
	$.messager.alert('错误', XMLHttpRequest.responseText);
};
$.fn.datagrid.defaults.onLoadError = easyuiErrorFunction;
$.fn.treegrid.defaults.onLoadError = easyuiErrorFunction;
$.fn.tree.defaults.onLoadError = easyuiErrorFunction;
$.fn.combogrid.defaults.onLoadError = easyuiErrorFunction;
$.fn.combobox.defaults.onLoadError = easyuiErrorFunction;
$.fn.form.defaults.onLoadError = easyuiErrorFunction;
 */

 