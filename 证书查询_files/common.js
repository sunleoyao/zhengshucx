/**
 * 判断字符串是否已str开头
 * @param str
 * @returns {Boolean}
 */
String.prototype.startWith=function(str){
if(str==null||str==""||this.length==0||str.length>this.length)
  return false;
if(this.substr(0,str.length)==str)
  return true;
else
  return false;
return true;
}
/***
 * html标签解码  例如&lt;等解码成<等
 */
function HTMLDecode(text) { 
	 var temp = document.createElement("div"); 
	 temp.innerHTML = text; 
	 var output = temp.innerText || temp.textContent; 
	 temp = null; 
	 return output; 
} 

/**
 * 判断字符串是否str以结尾
 * @param str
 * @returns {Boolean}
 */
 String.prototype.endWith=function(str){  
     if(str==null||str==""||this.length==0||str.length>this.length)  
       return false;  
     if(this.substring(this.length-str.length)==str)  
       return true;  
     else  
       return false;  
     return true;  
 }  
/** 
 * 用于datagrid列之间的调整
 */
function fixWidth(percent)  
{  
	return document.body.clientWidth * percent ; //这里你可以自己做调整  
}

/**
 * 删除左右两端的空格
 */
function trim(str){ 
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
/***
 * 返回上一页面
 */
function backToLast(){
	window.history.back(-1); 
}

//防止缓存页面
function addPresentTime(URL){
	var dynamicTime = new Date();
	dynamicTime = dynamicTime.getTime();
	
	//对已经有次参数的地址，不继续追加！
	if(URL.indexOf("newtime=") != -1){
		URL = URL.replace(/(\?|\&)newtime=\d*/,'')
	}	
	var n = (URL.indexOf("?") == -1) ? "?" : "&";
	URL = URL + n + "newtime=" + dynamicTime;
	return URL;
}



/**
 * ajax提交表单并返回
 * 
 * @param formName
 * @param url
 * @return
 */

function ajaxForm(formName,url, fn ,beforeFn,errorfn){
	
	var url = addPresentTime(url);// 防止缓存
	$("#" + formName).attr('action',url);
	var options = {
		dataType: 'json',
		type: 'POST',
		// action: url,
		beforeSubmit: function(formArray, jqForm) {
			return beforeFn();
		},
		error: function(XMLHttpRequest, textStatus, thrownError){
			if (errorfn != undefined) {
				errorfn(XMLHttpRequest, textStatus, thrownError);
			}
		},
		success: function(data){
			
			if (fn != undefined) {
				fn(data);
			}
		}
	};

	$("#" + formName).ajaxSubmit(options);
}

/**
 * javascript Date的扩展 格式化时间的函数
 * 
 */
Date.prototype.Format = function (fmt) { 
	  var o = {
	      "M+": this.getMonth() + 1, //月份 
	      "d+": this.getDate(), //日 
	      "h+": this.getHours(), //小时 
	      "m+": this.getMinutes(), //分 
	      "s+": this.getSeconds(), //秒 
	      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
	      "S": this.getMilliseconds() //毫秒 
	  };
	  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	  for (var k in o)
	  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	  return fmt;
}
/***
 * 解决ie 7，8 对Array.indexOf()方法不支持的问题
 * 
 */
if(!Array.indexOf){

    Array.prototype.indexOf = function(obj){
        for(var i=0; i<this.length; i++){

            if(this[i]==obj){

                return i;

            }
        }

        return -1;

    }

}
