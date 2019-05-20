layui.config({
	base : "js/"
}).use(['form','layer','jquery'],function(){
	var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		$ = layui.jquery;
	//video背景
	$(window).resize(function(){
		if($(".video-player").width() > $(window).width()){
			$(".video-player").css({"height":$(window).height(),"width":"auto","left":-($(".video-player").width()-$(window).width())/2});
		}else{
			$(".video-player").css({"width":$(window).width(),"height":"auto","left":-($(".video-player").width()-$(window).width())/2});
		}
	}).resize();
	
	//登录按钮事件

    var time = 0;
    var handler = function (captchaObj) {
        setInterval(function () {
            time++;
            if(time == 1800){
                window.location.reload();
            }
        },1000);
        captchaObj.onReady(function () {
            $("#wait").hide();
        }).onSuccess(function () {
            var result = captchaObj.getValidate();
            if (!result) {
                return alert('请完成验证');
            }
            $.ajax({
                url: SERVER_ADDR+'/hospital/login/submit',
                type: 'POST',
                dataType: 'json',
                data: {
                    username: $('.username').val(),
                    password: $('.password').val(),
                    geetest_challenge: result.geetest_challenge,
                    geetest_validate: result.geetest_validate,
                    geetest_seccode: result.geetest_seccode
                },
                success: function (data) {
                    //console.log(data);
                    if (data.success == true) {
//                      alert('登录成功');
                        /*setTimeout(function () {*/
                        //console.log(data.data);
                        //缓存名字
                       /* $.get_ajax("/admin/success","",function(data){
                            //console.log(data.data);

                        });*/
                       /* ajaxGetRetInfo(SERVER_ADDR+"/admin/success",'',function (retInfo) {
                            console.log(retInfo)
                            if(retInfo.success){
                                window.localStorage.setItem("hos_name",retInfo.data);
                                window.location.href = "index.html";
                            }else{
                                layer.alert(retInfo.data,{icon:5})
                            }
                        },'请求失败', 'GET', undefined, undefined);*/
                        getStatus();

                        /*}, 500);*/
                    } else if (data.success == false) {
                        /* setTimeout(function () {*/
                        alert(data.data);
                        captchaObj.reset();
                        /*}, 500);*/
                    }
                }
            });
        });
        form.on("submit(login)",function(data){
            captchaObj.verify();
            return false;
        })
       /* $('#btn').click(function () {
            // 调用之前先通过前端表单校验
            captchaObj.verify();

        });*/
        // 更多接口说明请参见：http://docs.geetest.com/install/client/web-front/
    };
    function getStatus(){
        get_ajax("/hospital/getCertificate.json","",function(data){
            //医院审核状态
            console.log(data.data.name);
            //缓存医院名字
            window.localStorage.setItem("hos_name",data.data.hospitalName);
            //缓存用户名字
            window.localStorage.setItem("username",data.data.username);
            //把医院类型存入缓存中
            window.localStorage.setItem("hos_type",data.data.type);
            if(data.data.isPerfect == false){
                //把是否完善信息存入缓存中  ，去完善开户行
                window.localStorage.setItem("isPerfect",data.data.isPerfect);
            }
            //跳转
            check_statu="pass";
            if(data.data.type=="topThree"){
                //				alert("转入三甲");
                window.location.href='index.html';
            }else{
                //				alert("转入医美");
                window.location.href='hosBeauty/index.html';
            }
        })
        /*if(data.data.status=="unapplied"){
            console.log("未申请认证");
            //$(".status").text("未申请认证");
            //$(".shade,.check_box,.check_confirm").show();
            window.location.href = 'hos_msg_complete.html'
        }
        if(data.data.status=="unchecked"){
            console.log("待审核");
            //			$(".status").text("data.data.reason");
            //$(".status").text("提交成功，正在审核中...");
            //$(".shade,.check_box,.check_confirm").show();
            window.location.href = 'hos_msg_complete.html'
        }
        if(data.data.status=="pass"){
            console.log("审核已通过");
            check_statu="pass";
            //			$(".status").text("data.data.");
            //			$(".status").text("审核已通过");
            //			$(".shade,.check_box,.check_confirm").show();
            if(data.data.type=="topThree"){
                //三甲
//				alert("转入三甲");
                window.location.href='index.html';
            }else{
                //医美
//				alert("转入医美");
                window.location.href='hosBeauty/index.html';
            }

        }
        if(data.data.status=="notpass"){
            check_statu="notpass";
            console.log("审核不通过");
            window.location.href = 'hos_msg_complete.html'
            //$(".status").text("审核不通过，"+data.data.reason);
            //			$(".status").text("审核不通过");
            //$(".shade,.check_box,.check_confirm").show();
        }*/
    }
    $(function(){
        $.ajax({
            url: SERVER_ADDR+"/common/geetestPreProcess?t=" + (new Date()).getTime(), // 加随机数防止缓存
            type: "get",
            dataType: "json",
            success: function (data) {
                console.log(data);
                // 调用 initGeetest 进行初始化
                // 参数1：配置参数
                // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它调用相应的接口
                initGeetest({
                    // 以下 4 个配置参数为必须，不能缺少
                    gt: data.gt,
                    challenge: data.challenge,
                    offline: !data.success, // 表示用户后台检测极验服务器是否宕机
                    new_captcha: data.new_captcha, // 用于宕机时表示是新验证码的宕机

                    product: "bind", // 产品形式，包括：float，popup
                    width: "300px"
                    // 更多配置参数说明请参见：http://docs.geetest.com/install/client/web-front/
                }, handler);
            }
        });
    });
})
