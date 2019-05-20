function init() {
    Go.toInfo();
}
//绑定手机号ajax
var Go = {
    toInfo:function () {
        var url = SERVER_ADDR + '/app/user/myInfo';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.infoSuccess, '请求失败', 'GET', true, undefined);
    },
    infoSuccess: function (res) {
        if (res.success == true) {
            $('.canTi').text(res.data.rechargeAmount);
        }
    },
    bind:function(){
        var url = SERVER_ADDR + '/app/user/cashWithDrawal';
        var Data = {};
        Data.cashWithDrawalAmount = $(".getMoney").val().trim();  //提现金额
        Data.name = $(".telCode").val().trim();
        Data.accountNumber = $(".telNum").val().trim();//账户
        Data.reason = $(".reason").val().trim();
        ajaxGetRetInfo(url, Data, this.bindSuccess, '请求失败', 'POST', true, undefined);
    },
    bindSuccess:function (retInfo) {
        if(retInfo.success == true){
            console.log(retInfo)
            /*alert(retInfo.data)*/
            //绑定成功跳转
            $('.msg').fadeIn();
            setTimeout(function () {$('.msg').fadeOut();},2500);
            window.location.href = 'user_center.html';
        }else{
            alert(retInfo.data)
        }
    }
}
