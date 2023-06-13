/**
 * @author maguangming
 * 组织机构控件
 * 
 * 调用实例：
 * $('#org').orgctl({
 *			platformId:"",	//平台id,【必填项】
 *			userId:"",		//用户id,【必填项】
 * 			domain:'http://localhost',	//数据访问的域名[含http],【必填项】
 *			rootId:"",		//根id,选填项
 *			onlyCheckLeaf:false,//是否只能选择叶子节点,选填项
 *			onlyCheckLeafPrompt:'请选择末级组织机构',	//只能选择叶子节点的提示语句,选填项
 *			showTest:true,	//是否显示测试组织机构,选填项
 *			selectWidth:"100px",	//根节点选择控件的宽度,选填项
 *			textWidth:"100px",		//组织机构显示控件的宽度,选填项
 *		}
 *	}); 
 *  var id=$('#org').orgctl("getSelectId");
 *	var text=$('#org').orgctl("getSelectText");
 *  var path=$('#org').orgctl("getSelectPath");
 */

;(function($)
{
	$.fn.orgctl = function(options, param){
		if (typeof options == 'string'){
			return $.fn.orgctl.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'orgctl');
			if (state)
			{
				$.extend(state.options, options);
			} 
			else 
			{
				$.data(this, 'orgctl', {options: $.extend({}, $.fn.orgctl.defaults, options)});
			}
			createControl(this);
		});
	};
	
	/**
	 * 属性设置 
	 */
	$.fn.orgctl.defaults = {
			platformId:"",	//平台id,必填项
			rootId:"",		//根id,选填项
			userId:"",		//用户id,必填项
			onlyCheckLeaf:false,//是否只能选择叶子节点,选填项
			onlyCheckLeafPrompt:'请选择末级组织机构',	//只能选择叶子节点的提示语句,选填项
			enableMulti:false,// 是否显示复选框 选填项
			showTest:true,	//是否显示测试组织机构,选填项
			domain:'http://localhost',	//数据访问的域名[含http],必填项
			selectWidth:"150px",	//根节点选择控件的宽度,选填项
			textWidth:"150px",		//组织机构显示控件的宽度,选填项
			nodeClick:function(id,text){} //节点点击后触发的事件 ,选填项
	};
	
	/**
	 * 公共方法
	 */
	$.fn.orgctl.methods = {
		options: function(jq){
			return $.data(jq[0], 'orgctl').options;
		},
		getSelectId:function(jq) {
			 return getSelectIdFun(jq[0]);
		},
		getSelectText:function(jq) {
			 return getSelectTextFun(jq[0]);
		},
		getSelectPath:function(jq) {
			 return getSelectPathFun(jq[0]);
		},
		setPlatformId:function(jq,platId) {
			$.data(jq[0], 'orgctl').options.platformId = platId;
			createControl(jq[0]);
		},
	};
	
	/**
	 * 获取选中组织机构id
	 */
	function getSelectIdFun(target) {
		var res=$(target).find("#txtOrgId").val();
		return res;
	}
	
	/**
	 * 获取选中组织机构名称
	 */
	function getSelectTextFun(target) {
		var res=$(target).find("#txtOrg").val();
		return res;
	}
	
	/**
	 * 获取选中组织机构path
	 */
	function getSelectPathFun(target) {
		var res=$(target).find("#txtOrgPath").val();
		return res;
	}
	
	/**
	 * 构建控件的html
	 */
	function createControl(target){
		var options = $.data(target, 'orgctl').options;
		$.ajax({
    		url:options.domain+"/yunapi/js_control_data/getMyOrgRoots",
    		data:{'platformId':options.platformId,'userId':options.userId},
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
	function buildHtml(target,options,rootData) {
		$(target).html('');
		var rootOrg="";
		var cboWidth=options.selectWidth;
		if(rootData.length==1) {
			cboWidth="0px";
		}
		rootOrg="<select id='cboRoot' style=\"width: "+cboWidth+";\">";
		for(var i=0;i<rootData.length;i++){
			rootOrg=rootOrg+"<option value='"+rootData[i].id+"' ifCustom='"+rootData[i].ifCustom+"' path='"+rootData[i].path+"' ";
			if(rootData[i].ifCustom=='0') rootOrg=rootOrg+" selected='selected'"
			rootOrg=rootOrg+">"+rootData[i].name+"</option>";
		}
		rootOrg=rootOrg+"</select>";
		 
		var txtMargin="";
		if(rootData.length==1) txtMargin="margin-left: -10px;";
		var html="<div>"+rootOrg+
					"<input type=\"text\" id=\"txtOrg\" readonly=\"readonly\" style=\"width: "+options.textWidth+";"+txtMargin+"\"";
		html=html+"/><input type=\"hidden\" id=\"txtOrgId\" ";  
		html=html+		"/><input type=\"hidden\" id=\"txtOrgPath\"/>"+
				 "</div>";
		
		$(target).append(html);
 
		var treelayer;
		var treeDialog;	
		var $txtOrg=$(target).find("#txtOrg");
		var $txtOrgId=$(target).find("#txtOrgId");
		var $txtOrgPath=$(target).find("#txtOrgPath");
		var $cboRoot=$(target).find("#cboRoot");
		
		$cboRoot.change(function(){
			$txtOrg.val($cboRoot.find("option:selected").text());
			$txtOrgId.val($cboRoot.val());
			$txtOrgPath.val($cboRoot.find("option:selected").attr("path"));
		});
		$cboRoot.change();
		
		$txtOrg.click(function(){
			html ="<div id='divtree' style='display:none;'>"+
					"<input type=\"text\" id=\"searchorg\" style=\"width: 180px;margin: 5px;\"/>"+
					"<input type=\"button\" value=\"搜索\" id=\"btnSearchOrg\" style=\"width: 50px;;margin: 5px;\"/>"+ 
					"<input id='sure' class='basebtn' type='button' value='确定'/>"+
					"<ul id=\"tree\" class=\"ztree\"></ul>"+
					"</div>";
			$(target).append(html);
			var checkBoxFlag = options.enableMulti;
			if(!checkBoxFlag){
				$("#sure").css("display","none");
			}
			var searchorg = $(target).find("#searchorg");
			var rootId=$(target).find("#cboRoot").val();
			if(options.rootId!="") rootId=options.rootId;
			var $btnSearchOrg=$(target).find("#btnSearchOrg");
			var $btnSure=$(target).find("#sure");
			var treeCtrl =$(target).find("#tree");
			
			var ifCustom='';
			if(options.rootId=="" && options.rootText=="") ifCustom=$cboRoot.find("option:selected").attr("ifCustom");
			 
			loadTree($(target).find("#tree"),setting,searchorg.val(),options.platformId,ifCustom,rootId,showTest_str,options.domain);
			
			$btnSearchOrg.click(function(){
				var searchorgText=searchorg.val();
				loadTree(treeCtrl,setting,searchorgText,options.platformId,ifCustom,rootId,showTest_str,options.domain);
			});
			//确定
			$btnSure.click(function(){
				var treeObj = $.fn.zTree.getZTreeObj("tree");
		    	var nodes = treeObj.getCheckedNodes();
		    	var nodeIds = [];
		    	var nodeNames = [];
		    	for(var i=0;i<nodes.length;i++){
		    		nodeIds.push(nodes[i].id);
		    		nodeNames.push(nodes[i].name);
		    	}
		    	if(nodeIds.length==0){
		    		alert('请选择要操作的组织机构');
		    		return;
		    	}
		    	$txtOrgId.val(nodeIds.toString());
		    	$txtOrg.val(nodeNames.toString());
		    	treeDialog.dialog("close");
		    	var options = $.data(target, 'orgctl').options;
				options.nodeClick.call(this, nodeIds, nodeNames);
			});
			
			
			$(target).find("#searchorg").autocomplete(
				options.domain+'/yunapi/js_control_data/findOrganizationsByName?showTest='+showTest_str+'&platformId='+options.platformId+'&rootId='+rootId+'&ifCustom='+ifCustom, {  
	    		minChars: 1,
	            multiple : false,
	            max:1000,
	    		matchSubset : false,
	    		dataType:"jsonp",
	            parse : function(data) {
	            	if(data=="[]" || data=="No Records." || data==null || typeof(data) == "undefined") {
	            		return {data :'',  value :'', result :''};
	            	}
	            	else{
	                	return $.map(eval(data), function(row) {  
	                            return {  
	                                data : row,  
	                                value : row.name,  
	                                result : row.name  
	                            }; 
	                        });  
	            	}
	            },  
	            formatItem : function(row, i, max) {  
	            	if(row==null||typeof(row) == "undefined") 
	            		return "";
	            	else
	            		return row.name ;  
	            } 
			}).result(function(e, item) {  
				
	       	}); 
			
			$(target).find("#divtree").show();
			treeDialog=$(target).find("#divtree").dialog({
                title: '选择组织机构',
                iconCls: "icon-edit",
                collapsible: false,
                minimizable: false,
                maximizable: false,
                resizable: true,
                width: 600,
                height: 400,
                modal: true
            });
		}); 
		
		var showTest_str=options.showTest==true?'1':'0';
		var checkBoxFlag = options.enableMulti;
		var setting={
	    		check:{enable:checkBoxFlag,chkboxType: {"Y":"", "N":""}},
	    		view:{expandSpeed:300,selectedMulti: true},
	    		data:{simpleData:{enable:true,idKey:"id",pIdKey:"_parentId",rootPId:0}},
	    		async:{  
	    	        autoParam:["id=pid"],  
	    	        contentType:"application/x-www-form-urlencoded",  
	    	        enable:true,  
	    	        type:"get",
	    	        dataType:"jsonp",
	    	        otherParam:{"platformId":options.platformId,"ifCustom":'',"clickPid":1,"showTest":showTest_str},
	    	        url:options.domain+"/yunapi/js_control_data/getDataForZtree"
	    	    },
			 	callback:{
			 		onClick:function(event, treeId, treeNode){
			 			if(treeNode.isParent && options.onlyCheckLeaf){
			 	    		alert(options.onlyCheckLeafPrompt);
			 	    		return;
			 	    	} 
			 			$txtOrg.val(treeNode.name);
			 			$txtOrgId.val(treeNode.id);
			 			$txtOrgPath.val(treeNode.path);
			 			if(!checkBoxFlag){
							treeDialog.dialog("close");
						}
			 			options.nodeClick.call(target, treeNode.id,treeNode.name);
			 		}
	 			}
   		 };
	}
	
	function loadTree(tree,setting,searchText,platformId,ifCustom,rootId,showTest,domain){
    	$.ajax({
    		url:domain+"/yunapi/js_control_data/getDataForZtree",
    		data:{'name':searchText,'platformId':platformId,'ifCustom':ifCustom,'rootId':rootId,"showTest":showTest},
    		type:"get",
    		dataType:"jsonp",
    		jsonp: 'callback',
    		ContentType:"application/json; charset=utf-8",
    		success:function(data) {
    			$.fn.zTree.init(tree, setting, eval(data));
    		},
    		error:function() {
    			 alert('提示信息','操作失败!','error');
    		}
    	}); 
	}
 
})(jQuery);

