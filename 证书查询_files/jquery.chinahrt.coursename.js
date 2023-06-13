/**
 * @author yuanancheng 2017-12-12
 * 课程名称控件
 * 
 * 调用实例:
 $('#courseNamectl').html('');
	      $('#courseName').courseNamectl({
 		     trainplanId:trainplanId,	 
 			 enable:platformEnable=='1'?true:false,			 
 			 width:'200px',				 
 			 domain:domain
 *	});
 * var id=$('#courseName').courseNamectl("getSelectId");
 * var courseName=$('#courseName').courseNamectl("getSelectText");
 */

;(function($)
{
	$.fn.courseNamectl = function(options, param){
		if (typeof options == 'string'){
			return $.fn.courseNamectl.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'courseNamectl');
			if (state) {
				$.extend(state.options, options);
			} else {
				$.data(this, 'courseNamectl', {
					options : $.extend({}, $.fn.courseNamectl.defaults, options)
				});
			}
			createControl(this);
		});
	};
	
	/**
	 * 默认设置
	 */
	$.fn.courseNamectl.defaults = {
			enable:true,	//控件是否可用
			domain:'http://localhost',		//域名
			trainplanId:'',	//计划id
			width:'150px',	//宽度
		};
	
	/**
	 * 公共方法
	 */
	$.fn.courseNamectl.methods = {
		options: function(jq){
			return $.data(jq[0], 'courseNamectl').options;
		},
		getSelectId:function(jq) {
			 return getSelectIdFun(jq[0]);
		},
		getSelectText:function(jq) {
			 return getSelectTextFun(jq[0]);
		}
	};
	
	/**
	 * 获取选择的课程id
	 */
	function getSelectIdFun(target) {
		var res=$(target).find("#txtCourseId").val();
		return res;
	}
	
	/**
	 * 获取选择的课程名称
	 */
	function getSelectTextFun(target) {
		var res=$(target).find("#txtCourseName").val();
		return res;
	}
	
	/**
	 * 构建控件的html
	 */
	function createControl(target){
		var options = $.data(target, 'courseNamectl').options;
		 
		var html="<div>"+
					"<input type=\"text\" id=\"txtCourseName\" readonly=\"readonly\" style=\"width: "+options.textWidth+"\";/>";
		html=html+"	<input type=\"button\" value=\"清空\" id=\"btnClear\" style=\"margin-left:-5px;font-size:12px\"/>";
		html=html+"	<input type=\"hidden\" id=\"txtCourseId\"/>"+
				 "</div>";
		
		$(target).append(html);
		 
		var $txtCourseName=$(target).find("#txtCourseName");
		var $txtCourseId=$(target).find("#txtCourseId");
		var $btnClear=$(target).find("#btnClear");
	 
		//清空按钮点击
		$btnClear.click(function(){
			$txtCourseName.val("");
			$txtCourseId.val("");
		});
		
		//培训计划点击
		$txtCourseName.click(function(){
			if(options.trainplanId==""){
				alert("请选择培训计划!");
				return;
			}
			html ="<div id='divtree' style='display:none;'>"+
					"<span class=\"ml10\">课程名称</span>"+
					"<input type=\"text\" id=\"courseName\" class=\"baseipt\" style=\"width: 180px;margin: 5px;\"/>"+
					"<input type=\"button\" value=\"搜索\" id=\"btnSearchOrg\" class=\"basebtn\" />"+ 
					" <div id=\"divgrid\" style=\"width:780px;height:380px;\" >" +
					"     <table id=\"grid\"> </table> " +
					"</div>"+
					"<div style=\"margin-top:10px;text-align:center;\"><input type=\"button\" value=\"确定\" id=\"btnOK\" class=\"basebtn\" style=\"width: 80px;\"/></div>"+
				  "</div>";
			$(target).append(html);
			
			var $courseName=$(target).find("#courseName");
			var $grid =$(target).find("#grid");
			var $btnOK=$(target).find("#btnOK");
			var $btnSearchOrg=$(target).find("#btnSearchOrg");
			
			var yunurl=options.domain+'/yunapi/js_control_data/getCourseData?trainplanId='+options.trainplanId;
			
			$btnSearchOrg.click(function(){
				var name=$courseName.val();
				var data= {name:name};
		    	myDataGrid.datagrid('options').url=yunurl;
				myDataGrid.datagrid("load",data);
			});
			
			var myDataGrid=$grid.datagrid({
				title:'',
				url:yunurl,
	   			pagination:true,
	   			pageSize:10,
	   			fitColumns:false,
	   			nowarp:false,
	   			border:true,
	   			singleSelect:true,
	   			loader:function(param,success,error){
	   				var turl=yunurl;
	   				$.each(param, function(key, val) {
	   					turl=turl+"&"+key+"="+val;
   					});   
	   	            $.ajax({
	   	                async:false,
	   	                url:turl,
	   	                type:"get",
	   	                dataType: 'jsonp',
	   	                jsonp: 'callback',    
	   	                success: function (res) {
	   	                    success(res);
	   	                },
	   	                error: function (xhr) {
	   	                    error(xhr.responseText);
	   	                }
	   	            });
	   	        }, 
				columns:[[
						  {title:'id',field:'courseId',sortable:true,hidden:true} ,
						  {title:'课程名称',field:'coursewareName',width:350,align:'left'},
						  {title:'学时',field:'classScores',width:100,align:'left'},
						  {title:'课程类型',field:'classType',width:100,align:'left'}
						]]
			});
			
			$(target).find("#divtree").show();
			var treeDialog=$(target).find("#divtree").dialog({
                title: '课程名称选择',
                iconCls: "icon-edit",
                collapsible: false,
                minimizable: false,
                maximizable: false,
                resizable: true,
                width: 800,
                height: 500,
                modal: true
            });
			
			//确定选中按钮
			$btnOK.click(function(){
				var selectData=myDataGrid.datagrid('getSelected');
				if(selectData==null){
					alert("请选择课程")
					return;
				}
				$txtCourseId.val(selectData.courseId)
				$txtCourseName.val(selectData.coursewareName);
				treeDialog.dialog("close");
			});
		}); 
	}
 
})(jQuery);

