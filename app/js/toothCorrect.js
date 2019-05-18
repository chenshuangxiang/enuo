
var countdown = 60;
$(function(){
    Go.strProductList();
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
    }, 1000);
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
    });
     $('.sub').click(function () {
         // 调用之前先通过前端表单校验
          if (check(/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test($(".phone").val().trim()) === true, "请输入正确的手机号！")) {
             if($(".username").val() == "" || $(".username").val().length < 2) {
                 alert("请输入正确的姓名");
                 return false;
             }
              if($(".attendProject").val() == "请选择") {
                  alert("请选择报名项目");
                  return false;
              }
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
    strProductList:function(){
        var url = SERVER_ADDR + '/common/strProductList';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.strProductListSuccess, '请求失败', 'GET', true, undefined);
    },
    strProductListSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            retInfo.data.forEach(function (value) {
                $('.attendProject').append('<option>'+value.name+'</option>')
            })
            // $('.attendProject').prepend('<option>请选择</option>');
        }else{
            alert(retInfo.data);
        }
    },
    getcode:function(captchaObj,result){
            var url = SERVER_ADDR + '/common/signUp';
            var Data = {};
         /*   Data.name = $(".username").val();//15058370623;//
            Data.telephone = $(".phone").val();
            Data.attendProject = $('.attendProject').val();*/
        Data.userFullname = $(".username").val();
        Data.userMobile = $(".phone").val();
        Data.knowSource = 'str_product';
        Data.signUpActivityId = '8';
        Data.selectName = $('.attendProject').val();
            Data.geetest_challenge = result.geetest_challenge;
            Data.geetest_validate = result.geetest_validate;
            Data.geetest_seccode = result.geetest_seccode;
            ajaxGetRetInfo(url, Data, this.getcodeSuccess, '请求失败', 'POST', true, undefined);
    },
    getcodeSuccess:function (retInfo) {
        console.log(retInfo)
        /*retInfo = JSON.parse(retInfo);*/
        if(retInfo.success == true){
            alert('尊敬中信银行'+ $(".username").val()+'贵宾，您已经成功报名了'+$('.attendProject').val()+'项目，近期会有专职健康助理联系您，注意接听，有任何咨询和投诉可以联系e诺第三方医疗平台 电话40006 96120');
        }else{
            alert(retInfo.data);
            //captchaObj.reset();
        }
    }
}
