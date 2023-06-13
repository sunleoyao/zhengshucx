/**
 * 扩展jQuery EasyUI 1.3的表单验证
 * maoshouxin
 * 2015-07-31
 */
$.extend($.fn.validatebox.defaults.rules, {

	//多验证规则
	multiple: {
		validator: function (value, vtypes) {
			var returnFlag = true;
			var opts = $.fn.validatebox.defaults;
			for (var i = 0; i < vtypes.length; i++) {
				var methodinfo = /([a-zA-Z_]+)(.*)/.exec(vtypes[i]);
				var rule = opts.rules[methodinfo[1]];
				if (value && rule) {
					var parame = eval(methodinfo[2]);
					if (!rule["validator"](value, parame)) {
						returnFlag = false;
						this.message = rule.message;
						break;
					}
				}
			}
			return returnFlag;
		}
	},
	//最小字符数量
	minLength: {
	    validator: function(value, param){
			$.fn.validatebox.defaults.rules.minLength.message = '请不要少于'+param[0]+'位字符.';
	        return value.length >= param[0];
	    },
	    message: ''
	},
	//最大字符数量
	maxLength: {
        validator: function(value, param){
			$.fn.validatebox.defaults.rules.maxLength.message = '请不要超过'+param[0]+'位字符.';
            return param[0] >= value.length;
        },
        message: ''
    },
    remote:{
    	validator: function (value,url) {
        	$.post(
        		url[0],
        		{param:url[1]},
        		function(data){
        			return data;
        		}
        	);
    	},
    message: '已经被占用'
    },
    //验证汉字
    CHS: {
        validator: function (value) {
            return /^[\u0391-\uFFE5]+$/.test(value);
        },
        message: '只能输入汉字'
    },
    //移动手机号码验证
    mobile: {//value值为文本框中的值
        validator: function (value) {
            var reg = /^[1|8][3|4|5|6|8|7|9]\d{9}$/;
            return reg.test(value);
        },
        message: '输入手机号码格式不准确.'
    },
    specialcharacter: {//value值为文本框中的值
        validator: function (value) {
    		var reg   =/^[^~!@\/\'\\\"#$%&*()+=|{}:;,<>?！￥&*（）【】、；。？“”‘’，\^\*]+$/;
            return reg.test(value);
        },
        message: '包含有非法字符.'
    },
    //国内邮编验证
    zipcode: {
        validator: function (value) {
            var reg = /^[1-9]\d{5}$/;
            return reg.test(value);
        },
        message: '邮编必须是非0开始的6位数字.'
    },
    //用户账号验证(只能包括 _ 数字 字母)
    account: {//param的值为[]中值
        validator: function (value, param) {
            if (value.length < param[0] || value.length > param[1]) {
                $.fn.validatebox.defaults.rules.account.message = '用户名长度必须在' + param[0] + '至' + param[1] + '范围';
                return false;
            } else {
                if (!/^[\w]+$/.test(value)) {
                    $.fn.validatebox.defaults.rules.account.message = '用户名只能数字、字母、下划线组成.';
                    return false;
                } else {
                    return true;
                }
            }
        }, message: ''
    },
    //两个值是否相等
    equals: {
        validator: function(value,param){
            return value == $(param[0]).val();
        },
        message: '两者不相等.'
    },
    //长度，自带的是英文提示，方法名为length
    lengthinteval: {
        validator: function(value,param){
    		this.message = '请控制字符长度在{0}到{1}之间.';
    		var len = $.trim(value).length;
    		if (param) {
    			for (var i = 0; i < param.length; i++) {
    				this.message = this.message.replace(new RegExp("\\{" + i + "\\}", "g"), param[i]);
    			}
    		}
    		return len >= param[0] && len <= param[1];

        },
        message : '请控制字符长度在{0}到{1}之间.'
    },
    //网络名称，自带的提示英文信息，方法名url
    web : {
        validator: function(value){
            return /^(http[s]{0,1}|ftp):\/\//i.test($.trim(value));
        },
        message: '网址格式错误.'
    },
    //日期格式
    date : {
        validator: function(value){
            return /^[0-9]{4}[-][0-9]{2}[-][0-9]{2}$/i.test($.trim(value));
        },
        message: '曰期格式错误,如2012-09-11.'
    },
  //验证邮箱，自带的提示英文信息，方法名email
    emailCH : {
        validator: function(value){
            return /^[a-zA-Z0-9_+.-]+\@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,4}$/i.test($.trim(value));
        },
        message: '电子邮箱格式错误.'
    },
    //数字浮点数验证
    numberFloat : {
        validator: function(value){
            return /^[0-9]+(.[0-9]{1,3})?$/i.test($.trim(value));
        },
        message: '输入格式错误应如:200.000或200'
    },
    userNameValid : {
        validator: function(value){
        	var flag=$.ajax({
     		   type: "POST",
     		   async:false,
     		   url: "/userbase/validName?single=1",
     		   data: "name="+value
     		   
     		}).responseText; 
     		if(flag=="false"){
     		
     		 return false;
     		}
     		return true;
        },
        message: '用户名已存在'
    },
    userNameRegisterValid : {
        validator: function(value){
        	var flag=$.ajax({
     		   type: "POST",
     		   async:false,
     		   url: "/orgApply/validUserName?single=1",
     		   data: "name="+value
     		   
     		}).responseText; 
     		if(flag=="false"){
     		
     		 return false;
     		}
     		return true;
        },
        message: '用户名已存在'
    },
    orgNameRegisterValid : {
        validator: function(value){
        	var flag=$.ajax({
     		   type: "POST",
     		   async:false,
     		   url: "/orgApply/validOrgName",
     		   data: "name="+value
     		   
     		}).responseText; 
     		if(flag=="false"){
     		
     		 return false;
     		}
     		return true;
        },
        message: '机构名已存在'
    },
    userNameValidFormat : {
    	validator: function(value){
    		 return /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/.test($.trim(value));
    	},
    	message: '仅支持汉字、字母、数字、“-”“_”的组合'
    },
    checkCaptcha:{
    	 validator: function(value){
    		 if(value==""){
    			 return false;
    		 }
         	var flag=$.ajax({
      		   type: "POST",
      		   async:false,
      		   url: "/checkCaptcha",
      		   data: "Captcha="+value
      		   
      		}).responseText; 
      		if(flag=="false"){
      		
      		 return false;
      		}
      		return true;
         },
         message: '验证码不正确'
    },
    idCard:{
    	validator:function(idCard,param){
    		
    		var result=false;
    		var regIdCard= /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    		if(regIdCard.test(idCard)){
    			  if(idCard.length==18){
    			   var idCardWi=new Array( 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ); //将前17位加权因子保存在数组里
    			   var idCardY=new Array( 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
    			   var idCardWiSum=0; //用来保存前17位各自乖以加权因子后的总和
    			   for(var i=0;i<17;i++){
    			    idCardWiSum+=idCard.substring(i,i+1)*idCardWi[i];
    			   }
    			   var idCardMod=idCardWiSum%11;//计算出校验码所在数组的位置
    			   var idCardLast=idCard.substring(17);//得到最后一位身份证号码
    			   //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
    			   if(idCardMod==2){
    			    if(idCardLast=="X"||idCardLast=="x"){
    			    	result=true ; //alert("恭喜通过验证啦！");
    			    }else{
    			    	this.message ="身份证号不合法";
    			    	result=false ; //alert("身份证号码错误！");
    			    }
    			   }else{
    			    //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
    			    if(idCardLast==idCardY[idCardMod]){
    			    	result=true ; //alert("恭喜通过验证啦！");
    			    }else{
    			    	this.message ="身份证号不合法";
    			    	result=false ; //alert("身份证号码错误！");
    			    }
    			   }
    			  } 
    			  if(param){
    				  if(param[0]){
    				  }else{
    					  this.message ="没有platformId";
    					  return false;
    					  
    				  }
    				  if(param[1]&&(param[1]==idCard)){
    					  var birthday = "";  
    	    		        if(idCard != null && idCard != ""){  
    	    		            if(idCard.length == 15){  
    	    		                birthday = "19"+idCard.substr(6,6);  
    	    		            } else if(idCard.length == 18){  
    	    		                birthday = idCard.substr(6,8);  
    	    		            }  
    	    		          
    	    		            birthday = birthday.replace(/(.{4})(.{2})/,"$1-$2-");  
    	    		        }
    					  if($('#birthday')){
    	    		        	
    	    		        	$('#birthday').datebox('setValue', birthday);
    	    		        }
    					  return true;
    				  }
    			  }
    			  if(result){
    				  var flag=$.ajax({
    					  type: "POST",
    					  async:false,
    					  url: "/userbase/validIdcard",
    					  data: "idcard="+idCard+"&platformId="+param[0]
    					  
    				  }).responseText; 
    				  if(flag=="false"){
    					  this.message ="身份证号已存在";
    					  return false;
    				  }
    				  result= true;
    			  }
		 }else{
			 this.message ="身份证号不合法";
			 result=false ;//alert("身份证格式不正确!");
		 }
    		if(result){
    			 var birthday = "";  
    		        if(idCard != null && idCard != ""){  
    		            if(idCard.length == 15){  
    		                birthday = "19"+idCard.substr(6,6);  
    		            } else if(idCard.length == 18){  
    		                birthday = idCard.substr(6,8);  
    		            }  
    		          
    		            birthday = birthday.replace(/(.{4})(.{2})/,"$1-$2-");  
    		        }
    		        if($('#birthday')){
    		        	
    		        	$('#birthday').datebox('setValue', birthday);
    		        }
    			
    		}
    		return result;
    	},
    	message:'身份证号不合法或已存在'
    },
    passport:{
    	validator:function(idCard,param){
    		
    		var result=false;
    		var regIdCard= /(P\d{7})|((G|E)\d{8})/;
    		if(true){
    			//if(regIdCard.test(idCard)){
    			  
    			  if(param){
    				  if(param[0]){
    				  }else{
    					  this.message ="没有platformId";
    					  return false;
    					  
    				  }
    				  if(param[1]&&(param[1]==idCard)){
    					  return true;
    				  }
    			  }
    				  var flag=$.ajax({
    					  type: "POST",
    					  async:false,
    					  url: "/userbase/validIdcard",
    					  data: "idcard="+idCard+"&platformId="+param[0]
    					  
    				  }).responseText; 
    				  if(flag=="false"){
    					  this.message ="护照号已存在";
    					  return false;
    				  }
    				  result= true;
		 }else{
			 this.message ="护照号不合法";
			 result=false ;//alert("身份证格式不正确!");
		 }
    		return result;
    	},
    	message:'护照号不合法或已存在'
    },
    fomatnumberFloat:{
	    validator:function(value){
    	        return /^[-+]?(\d{1,2}(,\d\d\d)*(\.\d+)?|\d+(\.\d+)?)$/i.test($.trim(value));
//	        	return /^[-]?((\d){1,3}[.])?(\d)+$|^((\d){1,3})(([,](\d){3})+)[.](\d)+$/i.test($.trim(value));
	    },
	    message:'输入格式错误！'
    },
    customNo : {// 验证自定义码，可以是数字或英文 
        validator : function(value) { 
            return /^[0-9a-zA-Z]+$/i.test(value); 
        }, 
        message : '请输入数字或字母' 
	 	},
    zhengshu : {
        validator: function(value){
        	if(/^[1-9]\d*$/i.test($.trim(value))){
        		if($.trim(value)>0&&$.trim(value)<50001)
        			return true;
        		else
        			this.message ="必须是1-50000的整数";
        			return false;
        	}
            //return /^[1-9]\d*$/i.test($.trim(value));
            //return /(^[1-9]\d$)|(^\d$)|(^50000$)/
        },
        message: '必须是1-50000的整数'
    }
})