


//绑定手机号ajax
var Go = {
    singRecharge:function(){
        $('.bindBtn').attr('onclick','').css('background-color','#cccccc');
        var url = SERVER_ADDR + '/app/user/concertTicketsRecharge';
        var Data = {};
        Data.key = $(".telNum").val().trim();
        Data.password = $(".telCode").val().trim();
        ajaxGetRetInfo(url, Data, this.singRechargeSuccess, '请求失败', 'POST', true, undefined);
    },
    singRechargeSuccess:function (retInfo) {
        console.log(retInfo)
        /*retInfo = JSON.parse(retInfo);*/
        if(retInfo.success == true){
            alert('充值成功');
            window.location.href = 'user_center.html';
        }else{
            alert(retInfo.data)
            $('.bindBtn').attr('onclick','Go.singRecharge()').css('background-color','#00afa1');
        }
    }
}
