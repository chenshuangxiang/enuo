//修改版本号
var VERSION = 115;
$(document).ready(function(){
	$("script").each(function(){
//		console.log($(this).attr('src'));
		if($(this).attr('src')){
			var NUM = $(this).attr('src')+"?num="+VERSION;
//			console.log(NUM);
			$(this).attr('src',NUM);
		}
	});
	$("link").each(function(){
//		console.log($(this).attr('href'));
		if($(this).attr('href')){
			var NUM = $(this).attr('href')+"?num="+VERSION;
//			console.log(NUM);
			$(this).attr('href',NUM);
		}
	});
});

/**
 * 导航栏
 */
$(".content_left dt").click(function(){
	console.log($(this).parent().attr("data_flag"));
	//当前元素是关闭
	if($(this).parent().attr("data_flag")=="close"){
		//关闭兄弟元素
		$(this).parent().siblings("dl").removeClass("dl_open").addClass("dl_close").attr("data_flag","close");
		//打开自己
		$(this).parent().attr("data_flag","open").removeClass("dl_close").addClass("dl_open");
	}else{
	//当前元素是打开
		//关闭兄弟元素
		$(this).parent().siblings("dl").addClass("dl_close").attr("data_flag","close");
		//关闭自己
		$(this).parent().attr("data_flag","close").removeClass("dl_open").addClass("dl_close");
	}
	
});
//退出登录
$(".exit").click(function(){
	//alert("哈哈哈");
	$.get(url+"/admin/logout",function(res){
		if(res.success){
            window.location.href="login.html";
		}
	},"json");

});

//初始化医院名字
$(function(){
	var hosName = $.get_storage("enuo_name");
	console.log(hosName);
	$(".hos_name").text(hosName);
});


