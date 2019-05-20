

//兑换售卖卡
var Go = {
    bind:function(){
        if($(".telNum").val().trim() == ''){
            alert('请输入卡号');
            return
        }
        if($(".telCode").val().trim() == ''){
            alert('请输入验证码');
            return
        }
        var url = SERVER_ADDR + '/app/user/special_product_sale_card/bind';
        var Data = {};
        Data.cardNum = $(".telNum").val().trim();
        Data.cardPsd = $(".telCode").val().trim();
        ajaxGetRetInfo(url, Data, this.bindSuccess, '请求失败', 'POST', true, undefined);
    },
    bindSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            alert('兑换成功！请在我的订单中进行预约');
            window.location.href = 'order.html';
        }else{
            alert(retInfo.data)
        }
    }
}
