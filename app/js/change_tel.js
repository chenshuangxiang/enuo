
var countdown = 60;
$(function(){
    $.ajax({
        url: SERVER_ADDR + "/common/geetestPreProcess?t=" + (new Date()).getTime(), // 加随机数防止缓存
        type: "get",
        dataType: "json",
        success: function (data) {
            console.log(data);
            // 调用 initGeetest 进行初始化
            // 参数1：配置参数d
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
function settime(obj) {
    if (countdown == 0) {
        document.getElementById('bindTel').removeAttribute("disabled");
        document.getElementById('bindTel').innerText = "获取验证码";
        countdown = 60;
        $(obj).css('background-color', '#00afa1')
        return;
    } else {
        document.getElementById('bindTel').setAttribute("disabled", true);
        document.getElementById('bindTel').innerText = "重新发送(" + countdown + ")";
        $(obj).css('background-color', '#cccccc')
        countdown--;
    }
    setTimeout(function () {
        settime(obj)
    }, 1000)
}
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
        Go.getcode(captchaObj,result);
        /*$.ajax({
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
                    /!*setTimeout(function () {*!/
                    //console.log(data.data);
                    //缓存名字
                    /!* $.get_ajax("/admin/success","",function(data){
                         //console.log(data.data);

                     });*!/
                    /!* ajaxGetRetInfo(SERVER_ADDR+"/admin/success",'',function (retInfo) {
                         console.log(retInfo)
                         if(retInfo.success){
                             window.localStorage.setItem("hos_name",retInfo.data);
                             window.location.href = "index.html";
                         }else{
                             layer.alert(retInfo.data,{icon:5})
                         }
                     },'请求失败', 'GET', undefined, undefined);*!/
                    getStatus();

                    /!*}, 500);*!/
                } else if (data.success == false) {
//                    /!* setTimeout(function () {*!/
                    alert(data.data);
                    captchaObj.reset();
                    /!*}, 500);*!/
                }
            }
        });*/
    });
    $('#bindTel').click(function () {
        // 调用之前先通过前端表单校验
        if (check(/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test($(".telNum").val().trim()) === true, "请输入正确的手机号！")) {
            captchaObj.verify();
        }
    });
    // 更多接口说明请参见：http://docs.geetest.com/install/client/web-front/
};
function check( phoneNum, errorMsg) {
    'use strict';
    if (!phoneNum) {
        alert(errorMsg);
    }
    return phoneNum;
}
//绑定手机号ajax
var Go = {
    getcode:function(captchaObj,result){
            var url = SERVER_ADDR + '/common/sendSmsCode';
            var Data = {};
            Data.mobile = $(".telNum").val().trim();
            Data.type = 'updateMobile';
            Data.geetest_challenge = result.geetest_challenge;
            Data.geetest_validate = result.geetest_validate;
            Data.geetest_seccode = result.geetest_seccode;
            ajaxGetRetInfo(url, Data, this.getcodeSuccess, '请求失败', 'POST', true, undefined);
    },
    getcodeSuccess:function (retInfo) {
        console.log(retInfo)
        /*retInfo = JSON.parse(retInfo);*/
        if(retInfo.success == true){
            settime('#bindTel');

        }else{
            alert(retInfo.data)
        }
    },
    bind:function(){
        var url = SERVER_ADDR + '/app/user/changeMobile';
        var Data = {};
        Data.mobile = $(".telNum").val().trim();
        Data.code = $(".telCode").val().trim();
        ajaxGetRetInfo(url, Data, this.bindSuccess, '请求失败', 'POST', true, undefined);
    },
    bindSuccess:function (retInfo) {
        if(retInfo.success == true){
            console.log(retInfo)
            /*alert(retInfo.data)*/
            //绑定成功跳转
            window.location.href = 'xywz.html';
        }else{
            alert(retInfo.data)
        }
    }
}
