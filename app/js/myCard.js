$(function(){
    Get.cardCoupon();
    Get.huliCard();
});

//获取是否有卡片
var Get = {
    huliCard: function () {  //护理卡详情
        var url = SERVER_ADDR + '/app/NursingCardUser/myNursingCard.json';
        var Data = '';
        // Data.id = getQueryString('id');
        ajaxGetRetInfo(url, Data, this.huliCardSuccess, '请求失败', 'GET', true, undefined);
    },
    huliCardSuccess: function (retInfo) {
        if (retInfo.success == true) {
            if (retInfo.data && retInfo.data.cardInfo) {
                $('.havaCard').append('<img onclick="window.location.href = '+"'/app/myHuliCard.html'"+'"  src="img/card/hulikou.png">');
            }
        }
    },
    cardCoupon: function () {  //用户下所有卡
        var url = SERVER_ADDR + '/app/user/cardCoupon/page';
        var Data = '';
        // Data.id = getQueryString('id');
        ajaxGetRetInfo(url, Data, this.cardCouponSuccess, '请求失败', 'GET', true, undefined);
    },
    cardCouponSuccess: function (retInfo) {
        if (retInfo.success == true) {
            retInfo.data.forEach(function (value) {
                if(value.cardCouponName == '美丽全家卡'){
                    $('.havaCard').append('<img onclick="window.location.href = '+"'/app/familyBeautyProduct.html?userCardCouponId="+value.id+"'"+'"  src="img/card/familyBeauty.png">');
                }else if(value.cardCouponName == '3.8女神券'){
                    $('.havaCard').append('<img onclick="window.location.href = '+"'/app/sanbaGuaProduct.html?userCardCouponId="+value.id+"'"+'"  src="img/card/sanba.png">');
                }else{
                    $('.havaCard').append('<img style="margin-bottom: 1rem;" src="">');
                }

            })

        }
    }
}
