
var title = '【征集令】晒幸福美照 美丽全家卡领回家！';
var link = 'https://www.enuo120.com/app/familyBeautyIndex.html';
var imgUrl = 'https://www.enuo120.com/app/img/familyBeautyIndexShare.jpg';  //分享的信息
var desc = '上传和家人的合影即可领取美丽全家卡~~分享更有红包领哦~~';
function  init() {
    getSign();
    Get.toHaveGetPhoto();
    if(is_weixn()){
        if(getQueryString('code') == null || localStorage.getItem('codeFamilyBeauty') == getQueryString('code')){
            if(getQueryString('shareclick') == 1){
                window.location.href = wechat_redirect('https://www.enuo120.com/app/familyBeautyIndex.html?shareclick=1');
            }else{
                window.location.href = wechat_redirect('https://www.enuo120.com/app/familyBeautyIndex.html');
            }
        }
        localStorage.setItem('codeFamilyBeauty',getQueryString('code'));
    }else{
        $('.activityFu').attr('src','img/shareXiumeiImgNowecat.png');
    }
}
var Get = {
    toInfo:function () {
        var url = SERVER_ADDR + '/app/user/myInfo';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.infoSuccess, '请求失败', 'GET', true, undefined);
    },
    infoSuccess: function (res) {
        if (res.success == true) {
            localStorage.removeItem('scrathCode');
            window.location.href = 'user_center.html?warn=' + $('.toYuyue').attr('warnZi');
        } else {
            alert(res.data);
        }
    },
    //获取用户是否提交过请求
    toHaveGetPhoto:function () {
        var url = SERVER_ADDR + '/app/user/familyBeautyCouponRequest/exists';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.toHaveGetPhotoSuccess, '请求失败', 'GET', true, undefined);
    },
    toHaveGetPhotoSuccess: function (res) {
        if (res.success == true) {
            // window.location.reload();
            if(res.data == true){  //晒过了
                $('.toPostPhoto').hide();
                $('.readPhoto').show();
            }else{
                $('.readPhoto').hide();
                $('.toPostPhoto').show();
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
            window.location.href = wechat_redirect('https://www.enuo120.com/app/familyBeautyIndex.html');
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
function callback() {
    //alert('分享成功goShare');
    $('.shareOpenBefore').hide()
    Get.share();
}
