function init() {
    Go.strProductList();
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
        }else{
            alert(retInfo.data);
        }
    },
    getcode:function(captchaObj,result){
        if($(".username").val() == "" || $(".username").val().length < 2) {
            alert("请输入正确的姓名");
            return false;
        }
        if($(".phone").val().length != 11) {
            alert("请输入正确的手机号");
            return false;
        }
        if($(".attendProject").val() == "请选择") {
            alert("请选择报名项目");
            return false;
        }
            var url = SERVER_ADDR + '/common/signUp';
            var Data = {};
            Data.userFullname = $(".username").val();
            Data.userMobile = $(".phone").val();
            Data.knowSource = 'str_product';
            Data.signUpActivityId = '8';
            Data.selectName = $('.attendProject').val();
            ajaxGetRetInfo(url, Data, this.getcodeSuccess, '请求失败', 'POST', true, undefined);
    },
    getcodeSuccess:function (retInfo) {
        console.log(retInfo)
        /*retInfo = JSON.parse(retInfo);*/
        if(retInfo.success == true){
           alert('尊敬的'+ $(".username").val() + '贵宾，恭喜您报名成功')
        }else{
            alert(retInfo.data);
            //captchaObj.reset();
        }
    }
}
