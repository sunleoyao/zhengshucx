/**
 * @author maguangming 2017-11-1
 * 日期控件
 * 
 * 调用实例:
 *  
 */

;(function($)
{
	$.fn.datectl = function(options, param){
		if (typeof options == 'string'){
			return $.fn.datectl.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'datectl');
			if (state)
			{
				$.extend(state.options, options);
			} 
			else 
			{
				$.data(this, 'datectl', {options: $.extend({}, $.fn.datectl.defaults, options)});
			}
			createControl(this);
		});
	};
	
	/**
	 * 默认设置
	 */
	$.fn.datectl.defaults = {
		id:"",				//id，必填
		startWidth:"100",	//开始时间的宽，选填
		endWidth:"100",		//结束时间的宽，选填
		height:"26",	//开始时间的宽，选填
		startDate:null,		//默认开始时间，选填
		endDate:null		//默认结束时间，选填
	};
	
	/**
	 * 公共方法
	 */
	$.fn.datectl.methods = {
		options: function(jq){
			return $.data(jq[0], 'datectl').options;
		},
		getStartDate:function(jq) {
			 return getStartDateFun(jq[0]);
		},
		getEndDate:function(jq) {
			 return getEndDateFun(jq[0]);
		}
	};
	
	/**
	 * 获取选择的开始时间
	 */
	function getStartDateFun(target) {
		var options = $.data(target, 'datectl').options;
		var $start=$(target).find("#startTime"+options.id);
		var res=$start.datebox('getValue');	
		
		if(res!="" && res!=null) {
			res=formatDateStr(res);
			res=res+" 00:00:00";
		}
		return res;
	}
	
	/**
	 * 获取选择的结束时间
	 */
	function getEndDateFun(target) {
		var options = $.data(target, 'datectl').options;
		var $end=$(target).find("#endTime"+options.id);
		var res=$end.datebox('getValue');
		
		if(res!="" && res!=null) {
			res=formatDateStr(res);
			res=res+" 23:59:59"
		}
		return res;
	}
	
	function formatDateStr(dateStr){
		 var dateStrs=dateStr.split("-"); 
		 var year=dateStrs[0];
		 var month=dateStrs[1];
		 if(month.length==1) month="0"+month;
		 var day=dateStrs[2];
		 if(day.length==1) day="0"+day;
		 return year+"-"+month+"-"+day;
	}
	/**
	 * 构建控件的html
	 */
	function createControl(target){
		var options = $.data(target, 'datectl').options;
		
		var defaultStart=options.startDate;
		var defaultEnd=options.endDate;
		if(defaultStart == null && defaultEnd == null){
			defaultStart = '';
			defaultEnd = '';
			var myDate = new Date();
			var year=myDate.getFullYear();    //获取完整的年份(4位,1970-????)
			var month=myDate.getMonth()+1;    //获取当前月份(0-11,0代表1月)
			var day=myDate.getDate();         //获取当前日(1-31)
			//defaultEnd=year+"-"+month+"-"+day;
			//defaultStart=year+"-"+month+"-01";
		}
		 
		var html="<div>"+
					"<input type=\"text\" name=\"startTime"+options.id+"\" value=\""+defaultStart+"\"  id=\"startTime"+options.id+"\" style=\"width:"+options.startWidth+"px;height:"+options.height+"px;\" />&nbsp;&nbsp;至&nbsp;&nbsp;";
		html=html+"	<input type=\"text\" name=\"endTime"+options.id+"\" value=\""+defaultEnd+"\"  id=\"endTime"+options.id+"\" style=\"width:"+options.endWidth+"px;height:"+options.height+"px;\"  />";
		html=html+"</div>";
				 
		$(target).append(html);
		var $start=$(target).find("#startTime"+options.id);
		var $end=$(target).find("#endTime"+options.id);
		$start.datebox({
			editable:false,
			onSelect: function(date){
				var endStr = $end.datebox('getValue');	
				if(endStr!=null && endStr!=""){
					var end= new Date(Date.parse(endStr.replace(/-/g,   "/"))); 
					if(date>end){
						alert("开始时间不能大于结束时间");
						$start.datebox('setValue',endStr);
					}
				}
			}
	    });
		
		$end.datebox({
			editable:false,
			onSelect: function(date){
				var startStr = $start.datebox('getValue');	
				if(startStr!=null && startStr!=""){
					var start= new Date(Date.parse(startStr.replace(/-/g,   "/"))); 
					if(start>date){
						alert("开始时间不能大于结束时间");
						$end.datebox('setValue',startStr);
					}
				}
			}
	    });
	}
 
})(jQuery);

