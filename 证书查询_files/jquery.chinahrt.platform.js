/**
 * @author maguangming
 * 平台选择控件
 * 需要引入：jquery、 easyui、layer.js
 * 实例：
 * $('#magazineGrid').platform({
 *			defaultId:'4',		//可选项,默认平台id
 *			defaultName:'TTTTT',//可选项,默认平台名称
 *			enable:true,		//可选项,是否可用/可选择平台
 *			userId:'0b9f72c9-af45-4ffd-92a2-e8aa4da2a18b',	//可选项,如果输入userId则只显示此用户管辖的平台
 *			width:'200px',		//可选项,控件的宽度
 *			domain:'http://localhost'	//必填项,数据访问的域名[含http]
 *		});
 *
 *	var id=$('#magazineGrid').platform("getId"); 	//获取选择平台id
 *	var id=$('#magazineGrid').platform("getText");	//获取选择平台名称
 *	$('#magazineGrid').platform("setText","dddd");	//设置平台名称
 *	$('#magazineGrid').platform("setId","1");		//设置平台id
 */

;(function($)
{
	$.fn.platform = function(options, param){
		if (typeof options == 'string'){
			return $.fn.platform.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'platform');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'platform', {options: $.extend({}, $.fn.platform.defaults, options)});
			}
			createContol(this);
		});
	};
	
	$.fn.platform.defaults = {
		enable:true,	//控件是否可用
		domain:'http://localhost',		//域名
		defaultId:'',	//默认平台id
		defaultName:'',	//默认平台name
		userId:'',		//如果输入userId则只显示此用户管辖的平台
		showRoot:'',    //是否显示根平台  0标识显示；
		width:'150px',	//宽度
		onChange:function(platId,platName){} //节点点击后触发的事件 ,选填项
	};
	
	$.fn.platform.methods = {
		options: function(jq){
			return $.data(jq[0], 'platform').options;
		},
		getId:function(jq) {
			return getSelectedFun(jq[0],"id");
		},
		getText:function(jq) {
			return getSelectedFun(jq[0],"text");
		},
		setId:function(jq,param) {
			return setSelectIDFun(jq[0],param);
		},
		setText:function(jq,param) {
			return setSelectTextFun(jq[0],param);
		}
		 
	};
 
	/**
	 * 获取选中的平台id和name
	 */
	function getSelectedFun(target,field) {
		var res="";
		if(field=="id") res=$(target).find("#txtplatId").val();
		if(field=="text") res=$(target).find("#txtplat").val();
		return res;
	}
	
	/**
	 * 设置平台id
	 */
	function setSelectIDFun(target,param) {
		res=$(target).find("#txtplatId").val(param);
		return res;
	}
	
	/**
	 * 设置平台名称
	 */
	function setSelectTextFun(target,param) {
		res=$(target).find("#txtplat").val(param);
		return res;
	}
 
	/**
	 * 创建html
	 */
	function createContol(target) {
		var options = $.data(target, 'platform').options;
		//"<input type=\"button\" value=\"清空\" id=\"btnClear\" style=\"margin-left:-5px;\"/>"+
		html = "<div>"+
					"<input type=\"text\" id=\"txtplat\" value=\""+options.defaultName+"\" readonly=\"readonly\" style=\"width: "+options.width+";\"/>"+
					"<input type=\"hidden\" id=\"txtplatId\" value=\""+options.defaultId+"\" />"+ 
	    		"</div>";
		$(target).append(html);

		//搜索按钮
		var $txtplat=$(target).find("#txtplat");
		
		$txtplat.click(function(){
			if(options.enable==false) return;
			 
    		html="<div id='divPlatDlg' style='display:none;'>"+
    			"<span>平台名称:</span>"+
    			"<input type=\"text\" id=\"findtxt\" style=\"width: 180px;margin: 5px;\" class=\"baseipt\"/>"+
    			"<input type=\"button\" value=\"搜索\" id=\"searchbutton\" style=\"width: 50px;\" class=\"basebtn\" /></br>"+
    			"<div style=\"width: 750px;height:280px;\"><div id='divGrid' ></div></div></br>"+
    			"<input type=\"button\" id=\"selectedbtn\" value=\"确认\" style=\"width: 50px;margin-left:300px;\" class=\"basebtn\" />"+
    		"</div>";
    		
    		$(target).append(html);
    		var $searchbutton=$(target).find("#searchbutton");
    		var $okbutton=$(target).find("#selectedbtn");
    		var $findtxt=$(target).find("#findtxt");
    		
			var yunurl=options.domain+'/yunapi/js_control_data/get_platform_list?userId='+options.userId+'&showRoot='+options.showRoot;
			var myDataGrid=$(target).find("#divGrid").datagrid({
				title:'',
				jsonp:true,
	   			iconCs:'icon-save',
	   			pagination:true,
	   			pageSize:10,
	   			fit:true,
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
					{title:'平台名称',field:'platformName',width:300},
					{title:'平台描述',field:'description',width:150},
					{title:'平台域名',align:'left',width:150,field:'domain'},
					{title:'编号',field:'id',width:80}
				]],
				onLoadSuccess: function (data) {  
				    if (data.rows.length == 0) {  
				        var body = $(this).data().datagrid.dc.body2;  
				        body.find('table tbody').append('<tr><td width="' + body.width() + '" style="height: 25px; text-align: center;" colspan="6">没有数据</td></tr>');  
				    } else {  
				    	$(this).datagrid("selectRow", 0);  
				    }  
				}
			});
			
			$(target).find("#divPlatDlg").show();
			var gridlayer=$(target).find("#divPlatDlg").dialog({
                title: '选择平台',
                iconCls: "icon-edit",
                collapsible: false,
                minimizable: false,
                maximizable: false,
                resizable: true,
                width: 800,
                height: 400,
                modal: true
            });
			
			//根据输入给出选项
			
			$searchbutton.click(function(){
				var searchName=$findtxt.val();
				var data={'name':searchName}; 
				myDataGrid.datagrid("load",data);
			});
			
			//选择平台后，点击确认按钮
			$okbutton.click(function(){
				var selected = myDataGrid.datagrid('getSelected');
				if(selected==null) {
					alert("请选择平台");
					return;
				}
				if(selected!=null) {
					$(target).find("#txtplat").val(selected.platformName);
					$(target).find("#txtplatId").val(selected.id);
					options.onChange.call(target,selected.id,selected.platformName);
				}
				gridlayer.dialog("close");
			});
		});
		
		//清除按钮
		var $btnClear=$(target).find("#btnClear");
		$btnClear.click(function(){
			 $(target).find("#txtplat").val('');
			 $(target).find("#txtplatId").val('');
		});
		
	}
		
})(jQuery);

