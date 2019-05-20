
var layer;
    layui.config({
	base : "js/"
}).use(['form','layer','jquery'],function(){
	var form = layui.form;
		layer = parent.layer === undefined ? layui.layer : parent.layer;
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
    form.on("submit(login)",function(data){
        $.ajax({
            url: SERVER_ADDR+'/customerService/login',
            type: 'POST',
            dataType: 'json',
            data: {
                username: $('.username').val(),
                password: $('.password').val(),
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
                    window.location.href = "index.html";
                    /*ajaxGetRetInfo(SERVER_ADDR+"/admin/success",'',function (retInfo) {
                        console.log(retInfo)
                        debugger
                        if(retInfo.success){
                            window.localStorage.setItem("fenzhen_name",retInfo.data);
                            window.location.href = "index.html";
                        }else{
                            layer.alert(retInfo.data,{icon:5})
                        }
                    },'请求失败', 'GET', undefined, undefined);*/


                    /*}, 500);*/
                } else if (data.success == false) {
                    /* setTimeout(function () {*/
                    alert(data.data);
                    /*}, 500);*/
                }
            }
        });
        return false;
    })
 /*   var time = 0;
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
                url: SERVER_ADDR+'/admin/login/submit',
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
                        /!*setTimeout(function () {*!/
                        //console.log(data.data);
                        //缓存名字
                       /!* $.get_ajax("/admin/success","",function(data){
                            //console.log(data.data);

                        });*!/
                        ajaxGetRetInfo(SERVER_ADDR+"/admin/success",'',function (retInfo) {
                            console.log(retInfo)
                            if(retInfo.success){
                                window.localStorage.setItem("fenzhen_name",retInfo.data);
                                window.location.href = "index.html";
                            }else{
                                layer.alert(retInfo.data,{icon:5})
                            }
                        },'请求失败', 'GET', undefined, undefined);


                        /!*}, 500);*!/
                    } else if (data.success == false) {
                        /!* setTimeout(function () {*!/
                        alert(data.data);
                        captchaObj.reset();
                        /!*}, 500);*!/
                    }
                }
            });
        });
        form.on("submit(login)",function(data){
            captchaObj.verify();
            return false;
        })
       /!* $('#btn').click(function () {
            // 调用之前先通过前端表单校验
            captchaObj.verify();

        });*!/
        // 更多接口说明请参见：http://docs.geetest.com/install/client/web-front/
    };

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
    });*/
})