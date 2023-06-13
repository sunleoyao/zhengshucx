 /**
  * 导出excel用到的jquery插件[马光明]
  */
;(function($)
{
	$.fn.exportexcel = function(options, param){
		if (typeof(options) == 'string'){
			var method = $.fn.exportexcel.methods[options];
			if (method){
				return method(this, param);
			} else {
				return  $.fn.exportexcel(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'exportexcel');
			if (state)
			{
				$.extend(state.options, options);
			} 
			else 
			{
				$.data(this, 'exportexcel', {options: $.extend({}, $.fn.exportexcel.defaults, options)});
			}
			
			createContol(this);
		});
	};
	
	$.fn.exportexcel.defaults = {
		url:null,
		isImport:false
	};
	
	$.fn.exportexcel.methods = {
		options: function(jq){
			return $.data(jq[0], 'exportexcel').options;
		},
		loading: function(jq){
			return  loadingFun(jq[0]);
		},
		checkExportIsFinish:function(jq){
			return checkExportIsFinishFun(jq[0]);
		},
		ajaxLoading:function(jq){
			return ajaxLoadingFun(jq[0]);
		},
		loadingClose:function(jq){
			return loadingCloseFun(jq[0]);
		}
	};
 
	function createContol(target) 
	{
		var options = $.data(target, 'exportexcel').options;
		parent.$(target).empty();
		html='<img src="/images/loading.gif" style="width: 30px;height: 30px; "><span style="margin-left:5px">等待....</span>';
		parent.$(target).append(html);
		parent.$(target).hide();
	}
	
	function ajaxLoadingFun(target){
		//parent.$(target).show();
		$(target).show();
		var options = $.data(target, 'exportexcel').options;
		$(target).window({
			collapsible:false,
			minimizable:false,
			maximizable:false,
			closable:false,
		    width:250,  
		    height:90,  
		    modal:true 
		}); 
	}
	
	function loadingCloseFun(target){
		$(target).window('close', true);
	}
	
	//进入等待
	function loadingFun(target){
		//parent.$(target).show();
		$(target).show();
		var options = $.data(target, 'exportexcel').options;
		$(target).window({
			collapsible:false,
			minimizable:false,
			maximizable:false,
			closable:false,
		    width:250,  
		    height:90,  
		    modal:true 
		}); 
		timer(target,options.url);
	}
	
	var interval;
	function timer(target,url){
		interval = setInterval(function(){searchProcess(target,url);}, "1500");  
	}
	
	//查看导出信息
	function searchProcess(target,url){
		var options = $.data(target, 'exportexcel').options;
		parent.$.ajax({
			   type: "POST",
			   url: url,
			   data: null,
			   async : false,
			   dataType: "json", 
			   success: function(result){
			 		if(result==-1){
			 			$(target).window('close', true);
			 			clearInterval(interval);
			 			if(options.isImport){
			 				$.messager.alert('提示信息','操作成功','warning');
			 				if(importAfterSuccess&&typeof(importAfterSuccess)=="function"){
			 					importAfterSuccess();
			 		        }
			 			}
			 		}
			 		if(result!=-1 && result!=0){
			 			$(target).window('close', true);
						clearInterval(interval);  
						if(options.isImport){
							$.messager.alert('提示信息',result,'warning');
						}
						else{
							location.href=result;
						}
			 		}
		 		}
		});
	}
	
	//检测有没有未完成的导出任务
	function checkExportIsFinishFun(target){
		var options = $.data(target, 'exportexcel').options;
		var res=true;
		parent.$.ajax({
			   type: "POST",
			   url: options.url,
			   data: null,
			   async : false,
			   dataType: "json", 
			   success: function(result){
			 		if(result==0){
			 			parent.$(target).append("<span style='margin-left:5px'>[上次未完成]</span>");
			 			loadingFun(target);
			 			res= false;
			 		}
		 		}
		});
		return res;
	}
	
})(jQuery);