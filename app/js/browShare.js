/*
 * 绣眉活动
 * 2018-10-16
 * https://www.enuo120.com/app/browIndex.hyml
 * author: csx
 */
var title = '280就能绣眉你信吗？';
var link = 'https://www.enuo120.com/app/browShare.html';
var imgUrl = 'https://www.enuo120.com/app/img/browActive/browOrder.jpg';  //分享的信息
var desc = 'e诺举办首届纹绣艺术节啦！20多款半永久眉形，多家纹绣机构任意挑选，还不快来看看？';
function init() {
    getSign();
    $('body').height(window.innerHeight);
    if(window.innerHeight > document.body.scrollHeight){   //window.innerHeight一屏高度
        $('.browDetailBack').height(window.innerHeight);
    }else{
        $('.browDetailBack').height(document.body.scrollHeight);
    }
    setInterval(function () {
        $('.tiao').fadeOut();
        $('.tiao').fadeIn();
    },1700);
    if(getQueryString('shareclick') == 1){
        if(localStorage.getItem('shareclick') != 1){
            //请求统计人数接口
            Get.shareClick();
            localStorage.setItem('shareclick','1');
        }
    }
    if(is_weixn()){
        if(getQueryString('code') == null || localStorage.getItem('setBrowCode') == getQueryString('code')){
            if(getQueryString('shareclick') == 1){
                window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx93fbc4fe8202b82b&redirect_uri=https://www.enuo120.com/app/browShare.html?shareclick=1&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
            }else{
                window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx93fbc4fe8202b82b&redirect_uri=https://www.enuo120.com/app/browShare.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
            }
        }
        localStorage.setItem('setBrowCode',getQueryString('code'));
    }else{
        $('.activityFu').attr('src','img/shareXiumeiImgNowecat.png');
    }
    var mobileFirstArray = [137,139,158,150,135,187,159,188,130,156];
    var mobileEndArray = [2203,2478,5310,2563,2452,1410,1478,3541,2415,8874];

    //var productGetArray = ['水氧美人体验券','超声洁牙免费体验券','激光祛痣体验券','青春解码体验券','无针水光针体验券'];
    for(var i = 0;i <= 50; i++){
        var mathRadomMobile = Math.ceil(Math.random()*9);
        var mathRadomMobileEnd = Math.ceil(Math.random()*9);
        var mathRadomFive = Math.ceil(Math.random()*4);

        var math88 = Math.floor(Math.random()*9+1);
        var mathPrice;
        if(math88 <= 1){
            mathPrice = '<span style="font-size: 1.1rem">88</span>';
        }else if(math88 >= 2 &&  math88 <= 3){
            mathPrice = '<span style="font-size: 1.1rem">66</span>';
        }else{
            mathPrice = (Math.random()*9+2).toFixed(2);
        }
        console.log(math88 + '----------'+mathPrice)
        var html = '';
        html += '<li>恭喜'+mobileFirstArray[mathRadomMobile]+'****'+mobileEndArray[mathRadomMobileEnd]+'分享获得'+mathPrice+'元微信现金红包</li>'
        $(".line").append(html);
    }
    $(".line").slideUpGun();
    $(".payclose,.toYuyueno").click(function(){
        $('.modelOpen,.shareOpen').hide();
    });
}
var Get = {
    share: function () {
        //alert('分享成功goShare开始');
        var code;
        //localStorage.removeItem('shareMoney');
        if(getQueryString('code') != null){
            code = getQueryString('code');
        }else{
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx93fbc4fe8202b82b&redirect_uri=https://www.enuo120.com/app/browShare.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
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
    },
    shareClick: function () {
        var url = SERVER_ADDR + '/common/longAndSaveIp'; //点击次数
        var Data = '';
        ajaxGetRetInfo(url, Data, this.shareClickSuccess, '请求失败', 'POST', true, undefined);
    },
    shareClickSuccess: function (retInfo) {
        //次数返回都是true
    }
}
function callback() {
    //alert('分享成功goShare');
    $('.shareOpenBefore').hide()
    Get.share();
}

