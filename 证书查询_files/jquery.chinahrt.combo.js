/**
 * @author maguangming 2017-11-1
 * 下拉控件
 * 
 * 调用实例:
 *  $('#divCombo').comboctl({
 		 	parentId:'001',				//字典表的parentid 【必填项】
 		 	id:"combox",				//平台id 【必填项】
			width:"200px",				//组织机构显示控件的宽度 【必填项】
			domain:"http://localhost",	//数据源域名【必填项】
			containAll:true				//是否包含“全部”选项 [选填项]
	 });
 */

;(function($)
{
	$.fn.comboctl = function(options, param){
		if (typeof options == 'string'){
			return $.fn.comboctl.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'comboctl');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'comboctl', {options: $.extend({}, $.fn.comboctl.defaults, options)});
			}
			createControl(this);
		});
	};
	
	/**
	 * 默认设置
	 */
	$.fn.comboctl.defaults = {
		id:"combox",				//平台id,必填项
		width:"200px",	//组织机构显示控件的宽度,选填项
		domain:"http://localhost",
		parentId:"",
		containAll:true
	};
	
	/**
	 * 公共方法
	 */
	$.fn.comboctl.methods = {
		options: function(jq){
			return $.data(jq[0], 'comboctl').options;
		},
		getSelectId:function(jq) {
			 return getSelectIdFun(jq[0]);
		},
		getSelectText:function(jq) {
			 return getSelectTextFun(jq[0]);
		}
	};
	
	/**
	 * 获取选中的id
	 */
	function getSelectIdFun(target) {
		var options = $.data(target, 'comboctl').options;
		var $combo=$(target).find("#"+options.id);
		var res=$combo.val();
		return res;
	}
	
	/**
	 * 获取选中的text
	 */
	function getSelectTextFun(target) {
		var options = $.data(target, 'comboctl').options;
		var res=$(target).find("#"+options.id+" option:selected").text();
		return res;
	}
	
	
	function createControl(target){
		var options = $.data(target, 'comboctl').options;
		$.ajax({
    		url:options.domain+"/yunapi/system/get_dictionary",
    		data:{'parent_id':options.parentId},
    		type:"get",
    		dataType: 'jsonp',
            jsonp: 'callback', 
    		ContentType:"application/json; charset=utf-8",
    		success:function(data) {
    			buildHtml(target,options,data);
    		},
    		error:function() {
    			alert('提示信息','操作失败!','error');
    		}
    	}); 
	}
	 
	/**
	 * 构建控件的html
	 */
	function buildHtml(target,options,selectData) {
		var html="<div>"+
					"<select  id=\""+options.id+"\"  style=\"width:"+options.width+"px;\">";
		if(options.containAll == true)  html=html+"<option selected=\"selected\" value=\"\">全部</option>";
		for(var i=0;i<selectData.data.length;i++){
			html=html+"<option value='"+selectData.data[i].id+"' ";
			if(options.containAll == false && i==0) html=html+" selected=\"selected\" ";
			html=html+">"+selectData.data[i].name+"</option>"
		}		  
		html=html+"</select></div>";
		$(target).append(html);
	}
 
})(jQuery);

