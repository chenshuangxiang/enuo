//修改版本号
//var VERSION = 123;
$(document).ready(function(){
/*	$("script").each(function(){
//		console.log($(this).attr('src'));
		if($(this).attr('src')){
            if($(this).attr('src').indexOf('?num') == -1){
                var NUM = $(this).attr('src')+"?num="+VERSION;
//			console.log(NUM);
                $(this).attr('src',NUM);
            }
		}
	});
	$("link").each(function(){
//		console.log($(this).attr('href'));
		if($(this).attr('href')){
			var NUM = $(this).attr('href')+"?num="+VERSION;
//			console.log(NUM);
			$(this).attr('href',NUM);
		}
	});*/
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


//初始化医院名字
$(function(){
	var hosName = $.get_storage("hos_name");
    var userName = $.get_storage("username");
	console.log(hosName);
	$(".hos_name").text(hosName);
    $(".user_name").text(userName);
});
//退出登录
$(".exit").click(function(){
	$.get_ajax("/hospital/logout","",function(res){
			window.location.href="/hosAdminRe/login.html";
	},"json");
        //window.location.href = url+"/hospital/logout";
});


//修改密码
function edit_pwd(){
	$(".shade,.edit_pwd_box").show();
}
/*商务对接*/
function duijie() {
    $(".shade,.people_box").show();
    getPeople();
}

//密码验证
$(".confrim_pwd").blur(function(){
	if($(".new_pwd").val()){
		if($(".new_pwd").val()!=$(".confrim_pwd").val()){
			alert("前后密码不一致");
		}
	}
});

//修改
$(".edit_pwd_confirm").click(function(){
	var old_pwd = $(".old_pwd").val();
	var new_pwd = $(".new_pwd").val();

	if(!$.verify(old_pwd,"原密码")){return false;}
	if(!$.verify(new_pwd,"新密码")){return false;}
	
	var data = {
		"password":old_pwd,
		"newPassword":new_pwd
	}
	$.post_ajax("/hospital/updatePassword",data,function(res){
		if(res.success==true){
			alert(res.data);
			window.location.href = "index.html";
		}else{
			alert(res.data);
		}
	});
});

