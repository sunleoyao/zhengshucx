;(function ( window, $ ) {
	// 页面加载完成时调用
	$(document).ready(function () {
		bindXueyuan();
	});
	function bindXueyuan () {
		//$('.shrinkul .easyui-tree a').bind( 'click', function () {
		//	$('.shrinkul .shrink').click();
		//});
		$('.easyui-tree a').bind( 'click', function () {
			var $this = $(this),
				titleName = $this.text(),
				url = $this.attr('url'),
				$tabs = $('#tabs'),
				isExist = $tabs.tabs( 'exists', titleName ),
				frameContent;
			
			// console.log( url );
			
			 //判断是否存在；
            if (isExist) { $tabs.tabs('select', titleName) }
            else {
                frameContent = createIframe(url);
                $tabs.tabs('add', {
                    title:titleName,
                    content: frameContent,
                    closable: true,
                    bodyCls: 'bodyClsname',
					tools:
					   [{     	   
				        iconCls: 'icon-mini-refresh',
						handler:function(){
						var currentTab=$tabs.tabs('getSelected');
						    url = $(currentTab.panel('options').content).attr('src');   
							/*if(url!=undefined){
								$tabs.tabs('update', {
									tab: currentTab,
									options: {
										content: createIframe( url )
									}
								});
							}*/
						    //刷新tab
							var $iframe = $('iframe');
							$iframe.each(function () {
								 var $this=$(this)				   
							    if ($(this).attr('src') == url) {
									$this.attr("src",url);
									return false
							    }
							});
							}  
						   
					}] 
                })
            }
        })
    };
  ;(function ( window, $ ) {
	$(document).ready( function () {
		bindNewClassBtn();
		hideDialog();
	});
	
	function bindNewClassBtn () {
		$('#newClassBtn').on( 'click', function () {
			$('#newClassDiv').dialog( 'open' );
		});
	};
	
	// 在页面加载完成后，隐藏dialog
	function hideDialog () {
		$('#newClassDiv').dialog( 'close' );
	};
})( window, jQuery );
	// 根据给定的url，返回一个iframe，iframe的内容来自于url
	function createIframe ( url ) {
		var iframe = '<iframe id="iframestyle" scrolling="auto" frameborder="0"  src="' + url + '" style="width:100%;height:100%;"></iframe>';
		//console.log( iframe );
		return iframe;
	};	
})( window, jQuery );

$(function(){
/*菜单*/  
    $(".tabs-header").bind('contextmenu',function(e){
        e.preventDefault();
        $('#rcmenu').menu('show', {
            left: e.pageX,
            top: e.pageY
        });
    });
    //关闭当前标签页
    $("#closecur").bind("click",function(){
        var tab = $('#tabs').tabs('getSelected');
        var index = $('#tabs').tabs('getTabIndex',tab);
        $('#tabs').tabs('close',index);
    });
    //关闭所有标签页
    $("#closeall").bind("click",function(){
        var tablist = $('#tabs').tabs('tabs');
        for(var i=tablist.length-1;i>=1;i--){
            $('#tabs').tabs('close',i);
        }
    });
    //关闭非当前标签页（先关闭右侧，再关闭左侧）
    $("#closeother").bind("click",function(){
        var tablist = $('#tabs').tabs('tabs');
        var tab = $('#tabs').tabs('getSelected');
        var index = $('#tabs').tabs('getTabIndex',tab);
        for(var i=tablist.length-1;i>index;i--){
            $('#tabs').tabs('close',i);
        }
        var num = index-1;
        for(var i=num;i>=1;i--){
            $('#tabs').tabs('close',1);
        }
    });
    //关闭当前标签页右侧标签页
    $("#closeright").bind("click",function(){
        var tablist = $('#tabs').tabs('tabs');
        var tab = $('#tabs').tabs('getSelected');
        var index = $('#tabs').tabs('getTabIndex',tab);
        for(var i=tablist.length-1;i>index;i--){
            $('#tabs').tabs('close',i);
        }
    });
    //关闭当前标签页左侧标签页
    $("#closeleft").bind("click",function(){
        var tab = $('#tabs').tabs('getSelected');
        var index = $('#tabs').tabs('getTabIndex',tab);
        var num = index-1;
        for(var i=0;i<=num;i++){
            $('#tabs').tabs('close',1);
        }
    });  
    //遍历 li
    $('.easyr-from ul li').each(function(){
		$(this).find('span').eq(0).css({'text-align':'right','width':'72px','display' :'inline-block'});
	});
    //遍历 li
    $('.m-form form p').each(function(){
		$(this).find('span').eq(0).css({'display':'inline-block',' font-size':'12px','margin-right':' 8px','text-align':'right','width':'100px'});
	});
    $('.m-form p').each(function(){
		$(this).find('span').eq(0).css({'display':'inline-block',' font-size':'12px','margin-right':' 8px','text-align':'right','width':'100px'});
	});
});
