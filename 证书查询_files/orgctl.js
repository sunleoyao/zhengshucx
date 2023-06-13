/**
 * @author liuwenbo
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
			createContol(this);
		});
	};
	
	$.fn.orgctl.defaults = {
			platformId:"",
			isCustom:"",
			rootId:""
	};
	
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
		 setSelectId:function(jq,param) {
			return setSelectIDFun(jq[0],param);
		},
		setSelectText:function(jq,param) {
			return setSelectTextFun(jq[0],param);
		},
		setRootId:function(jq,param){
			var options = $.data(jq[0], 'orgctl').options;
			options.rootId=param;
		},
		getRootId:function(jq,param){
			var options = $.data(jq[0], 'orgctl').options;
			return options.rootId;
		}
	};
	
	// {"orgid":$orgid.val()}; $orgid.val()
	function getSelectIdFun(target) {
		var $orgid = $(target).find("input").eq(2);
		return {"orgid":$orgid.val()};
	}
	
	function getSelectTextFun(target) {
		var $orgname = $(target).find("input").eq(0);
		return {"orgnames":$orgname.val()};
	}
	
	function setSelectIDFun(target,id) {
		var $orgid = $(target).find("input").eq(2);
		$orgid.val(id);
	}
	
	function setSelectTextFun(target,name) {
		var $orgname = $(target).find("input").eq(0);
		$orgname.val(name);
	} 
	
	function createContol(target) {
		var options = $.data(target, 'orgctl').options;
		html = "<input type='text' name='orgnames' id='orgnames' readonly='readonly'/>" + "&nbsp;"  
				+"<input type='button' id='btn' name='btn' value='选择机构' class='basebtn'/>" + "<input type='hidden' name='orgid' id='orgid'/>";
		$(target).append(html);
		
		var $button=$(target).find("input").eq(1);
		$button.click(function(){
				selectOrg(options.platformId,options.isCustom,options.rootId);
			});
		
	}
	
	
	function selectOrg(platformId,isCustom,rootId){
		var dialog = parent.sys.modalDialog({
			title : '选择机构',
			width : 400,
			height : 600,
			url : '/org/orgTree?platformId='+platformId+'&ifCustom='+isCustom+'&rootId='+rootId+'',
			callback:function(data){
				if(data!=null&&data!="")
				{
					//alert(data);
					 $("#orgnames").val(data[0]);
					$("#orgid").val(data[1]);
					
				}
			}
		});
		}
		
})(jQuery);

