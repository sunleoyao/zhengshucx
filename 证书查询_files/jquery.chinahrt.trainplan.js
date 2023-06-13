/**
 * @author maguangming 2017-11-1
 * 培训计划控件
 * 
 * 调用实例:
 * $('#divtrainplan').trainplanctl({
 *   	 	platformId:"3",			//平台id,必填项
 *			userId:"",				//用户id
 *			statu:"runandfinish",		//状态("":全部,"run":运行中,"runandfinish":运行和完成的,"finish":完成)
 *			domain:'http://localhost',	//数据访问的域名[含http],必填项
 *			textWidth:"200px"			//组织机构显示控件的宽度,选填项
 *	});
 * var id=$('#divtrainplan').trainplanctl("getSelectId");
 * var text=$('#divtrainplan').trainplanctl("getSelectText");
 */

;(function($)
{
	$.fn.trainplanctl = function(options, param){
		if (typeof options == 'string'){
			return $.fn.trainplanctl.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'trainplanctl');
			if (state)
			{
				$.extend(state.options, options);
			} 
			else 
			{
				$.data(this, 'trainplanctl', {options: $.extend({}, $.fn.trainplanctl.defaults, options)});
			}
			createControl(this);
		});
	};
	
	/**
	 * 默认设置
	 */
	$.fn.trainplanctl.defaults = {
			url:"",					//查询出指定的培训计划（例如：激活卡关联的计划） 非必填项
			platformId:"",			//平台id,必填项
			userId:"",				//当前用户
			statu:"runandfinish",		//状态("":全部,"run":运行中,"runandfinish":运行和完成的,"finish":完成)
			domain:'http://localhost',	//数据访问的域名[含http],必填项
			textWidth:"200px",			//组织机构显示控件的宽度,选填项
			onChange:function(){}
	};
	
	/**
	 * 公共方法
	 */
	$.fn.trainplanctl.methods = {
		options: function(jq){
			return $.data(jq[0], 'trainplanctl').options;
		},
		getSelectId:function(jq) {
			 return getSelectIdFun(jq[0]);
		},
		getSelectText:function(jq) {
			 return getSelectTextFun(jq[0]);
		},
		setPlatformId:function(jq,platId) {
			$.data(jq[0], 'trainplanctl').options.platformId = platId;
		},
		
	};
	
	
	/**
	 * 获取选择的培训计划id
	 */
	function getSelectIdFun(target) {
		var res=$(target).find("#txtTrainplanId").val();
		return res;
	}
	
	/**
	 * 获取选择的培训计划名称
	 */
	function getSelectTextFun(target) {
		var res=$(target).find("#txtTrainplanName").val();
		return res;
	}
	
	/**
	 * 构建控件的html
	 */
	function createControl(target){
		var options = $.data(target, 'trainplanctl').options;
		 
		var html="<div>"+
					"<input type=\"text\" id=\"txtTrainplanName\" readonly=\"readonly\" style=\"width: "+options.textWidth+"\";/>";
		html=html+"	<input type=\"button\" value=\"清空\" id=\"btnClear\" style=\"margin-left:-5px;font-size:12px\"/>";
		html=html+"	<input type=\"hidden\" id=\"txtTrainplanId\"/>"+
				 "</div>";
		
		$(target).append(html);
		 
		var $txtTrainplanName=$(target).find("#txtTrainplanName");
		var $txtTrainplanId=$(target).find("#txtTrainplanId");
		var $btnClear=$(target).find("#btnClear");
	 
		//清空按钮点击
		$btnClear.click(function(){
			$txtTrainplanName.val("");
			$txtTrainplanId.val("");
		});
		
		//培训计划点击
		$txtTrainplanName.click(function(){
			if(options.platformId==""){
				alert("请选择平台!");
				return;
			}
			html ="<div id='divtree' style='display:none;'>"+
					"<span class=\"ml10\">计划编号</span>"+
					"<input type=\"text\" id=\"txtCode\" class=\"baseipt\" style=\"width: 180px;margin: 5px;\"/>"+
					"<span class=\"ml10\">计划名称</span>"+
					"<input type=\"text\" id=\"txtName\" class=\"baseipt\" style=\"width: 180px;margin: 5px;\"/>"+
					"<input type=\"button\" value=\"搜索\" id=\"btnSearchOrg\" class=\"basebtn\" />"+ 
					" <div id=\"divgrid\" style=\"width:780px;height:280px;\" >" +
					"     <table id=\"grid\"> </table> " +
					"</div>"+
					"<div style=\"margin-top:10px;text-align:center;\"><input type=\"button\" value=\"确定\" id=\"btnOK\" class=\"basebtn\" style=\"width: 80px;\"/></div>"+
				  "</div>";
			$(target).append(html);
			
			var $txtCode = $(target).find("#txtCode");
			var $txtName=$(target).find("#txtName");
			var $btnSearchOrg=$(target).find("#btnSearchOrg");
			var $grid =$(target).find("#grid");
			var $btnOK=$(target).find("#btnOK");
			
			var status="";
			if(options.statu=="run") status="'051005'";
			if(options.statu=="runandfinish") status="'051005','051006','051007'";
			if(options.statu=="finish") status="'051006'";
			var yunurl=options.domain+'/yunapi/js_control_data/findTrainplanForControlForPage?platformId='+options.platformId
						+"&userId="+options.userId+"&statuses="+status;
			var requestType = '';
			var redirectUrl = options.url;
			if(redirectUrl != null && redirectUrl.length != 0){
				yunurl = redirectUrl+'?t='+new Date().getTime()+'&platformId='+options.platformId;
				requestType = 'json';
			}else{
				requestType = 'jsonp'
			}
			
			
			$btnSearchOrg.click(function(){
				var code=$txtCode.val();
				var name=$txtName.val();
				
				//var turl=yunurl+"&name="+name+"&code="+code;
		    	//myDataGrid.datagrid('options').url=turl;
				//myDataGrid.datagrid("load",null);
				
				var data= {name:name,code:code};
		    	myDataGrid.datagrid('options').url=yunurl;
				myDataGrid.datagrid("load",data);
				
				 
			});
			
			var myDataGrid=$grid.datagrid({
				title:'',
				url:yunurl,
	            //queryParams:{name:$(target).find("#txtName").val(),code:$(target).find("#txtCode").val()},
	   			pagination:true,
	   			pageSize:10,
	   			fitColumns:false,
	   			nowarp:false,
	   			border:true,
	   			singleSelect:true,
	   			loader:function(param,success,error){
	   				var turl=yunurl;
	   				$.each(param, function(key,val){
	   					turl=turl+"&"+key+"="+val;
   					});
	   	            $.ajax({
	   	                async:false,
	   	                url:turl,
	   	                type:"get",
	   	                dataType: requestType,
	   	                jsonp: 'callback', 
	   	                success: function (res) {
	   	                    success(res);
	   	                },
	   	                error: function (xhr) {
	   	                    error(xhr.responseText);
	   	                }
	   	            })
	   	        }, 
				columns:[[
						  {title:'id',field:'id',sortable:true,hidden:true} ,
				          {title:'计划编号',field:'code',sortable:true,width:100,align:'left'},
				          {title:'计划名称',field:'name',width:180,align:'left'},
				          {title:'发布单位',field:'org_name',width:150,align:'left'},
				          {title:'计划状态',field:'status_name',width:80,align:'left'},
				          {title:'开始时间',field:'start_time',width:100,align:'left'},
				          {title:'结束时间',field:'end_time',width:100,align:'left'}
						]]
			});
			
			$(target).find("#divtree").show();
			var treeDialog=$(target).find("#divtree").dialog({
                title: '选择培训计划',
                iconCls: "icon-edit",
                collapsible: false,
                minimizable: false,
                maximizable: false,
                resizable: true,
                width: 800,
                height: 400,
                modal: true
            });
			
			//确定选中按钮
			$btnOK.click(function(){
				var selectData=myDataGrid.datagrid('getSelected');
				if(selectData==null){
					alert("请选择培训计划")
					return;
				}
				if(selectData!=null){
					$(target).find("#txtTrainplanId").val(selectData.id);
					$(target).find("#txtTrainplanName").val(selectData.name);
					options.onChange.call(target,selectData.id);
				}
				treeDialog.dialog("close");
			});
		}); 
		
	}
 
})(jQuery);

