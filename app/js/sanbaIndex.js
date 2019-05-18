
var title = '38元皮秒祛斑还不够，还想送你100万！';
var link = 'https://www.enuo120.com/app/sanbaIndex.html';
var imgUrl = 'https://www.enuo120.com/app/img/sanbaShare.jpg';  //分享的信息
var desc = '在属于你的节日，除了让你更美 ，我不知道该怎么宠你~~~';
function  init() {
    getSign();
    Get.toHaveGetPhoto();
    if(is_weixn()){
        if(getQueryString('code') == null || localStorage.getItem('codeFamilyBeauty') == getQueryString('code')){
            if(getQueryString('shareclick') == 1){
                window.location.href = wechat_redirect('https://www.enuo120.com/app/sanbaIndex.html?shareclick=1');
            }else{
                window.location.href = wechat_redirect('https://www.enuo120.com/app/sanbaIndex.html');
            }
        }
        localStorage.setItem('codeFamilyBeauty',getQueryString('code'));
    }else{
        //$('.activityFu').attr('src','img/shareXiumeiImgNowecat.png');
    }
}
var Get = {
    //获取用户是否对于产品的状态
    toHaveGetPhoto:function () {
        var url = SERVER_ADDR + '/app/user/cardCoupon/specialProduct/useState';
        var Data = {};
        Data.specialProductId = sanbaProduct;
        ajaxGetRetInfo(url, Data, this.toHaveGetPhotoSuccess, '请求失败', 'GET', true, undefined);
    },
    toHaveGetPhotoSuccess: function (res) {
        if (res.success == true) {
            // window.location.reload();
            if(res.data.purchased == false){
                //没买过 不做操作
            }else{
                if(res.data.activityInfo[0].hasBeenLuckyDraw == false){
                    $('.toPostPhoto').hide();
                    $('.tobooked').hide();
                    $('.readPhoto').show();
                }else{
                    if(res.data.booked == false){
                        $('.toPostPhoto').hide();
                        $('.readPhoto').hide();
                        $('.tobooked').show();
                    }
                }

            }
        } else {
            alert(res.data);
        }
    },
    share: function () {
        //alert('分享成功goShare开始');
        var code;
        //localStorage.removeItem('shareMoney');
        if(getQueryString('code') != null){
            code = getQueryString('code');
        }else{
            window.location.href = wechat_redirect('https://www.enuo120.com/app/sanbaIndex.html');
        }
        var url = SERVER_ADDR + '/app/activity/sendRedpack'; //获取分享成功后调取
        var Data = {};
        Data.code = code;
        //alert('code传过去-------' + code);
        ajaxGetRetInfo(url, Data, this.shareSuccess, '请求失败', 'POST', true, undefined);
    },
    shareSuccess: function (retInfo) {
        console.log(retInfo)
        //alert(111);
        //alert(JSON.stringify(retInfo));
        if(retInfo.success){
            alert(retInfo.data);
        }else{
            if(retInfo.data == '今天的红包抢完了，明天再来吧'){
                alert(retInfo.data);
            }else{
                $('.shareOpen').show();
            }
        }
    }
}
function specialhref() {
    window.location.href = 'special_cp.html?itemId=' + sanbaProduct;
}
function callback() {
    //alert('分享成功goShare');
    $('.shareOpenBefore').hide()
    Get.share();
}
