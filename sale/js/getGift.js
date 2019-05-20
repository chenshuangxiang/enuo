$(document).ready(function () {
    if(localStorage.getItem('mouseGiftList') == 'enuo'){
        $('.back').show();
    }else{
        $('.back').hide();
    }
    Go.getGiftInfo();
    getSign();
});
var title = '【爱德口腔】我送给你一份中秋大礼，赶快领取吧';
var link = window.location.href;
var desc = '六大口腔项目任意组合，只有你想不到的超值，没有我给不了的优惠，手慢就被人抢啦';
var imgUrl = SERVER_ADDR + '/sale/img/shareGift.jpg';
var tolatitude = 30.306849;
var tolongitude = 120.175788;
var toname = '浙江爱德口腔科';
var toaddress = '杭州市下城区东新路509号浙江爱德医院3楼';
var share;
function callback() {
    if(localStorage.getItem('mouseGiftList') == 'enuo'){
        Go.setGiftStatus();
    }else{
        alert('该礼包成功分享');
    }
}
var Go = {
    get:function () { //点击领取弹出
        Go.checkConsultOpen();
    },
    checkConsultOpen:function () {
        $('body').css({'position': 'fixed', 'width': '100%'});
        $('.openBig,.layeropen').show();
    },
    checkConsultClose:function () {
        $('body').css({'position': 'relative'});
        $('.layeropen,.openBig').hide();
    },
    check: function (phoneNum, errorMsg) {
        'use strict';
        if (!phoneNum) {
            alert(errorMsg);
        }
        return phoneNum;
    },
    getGiftInfo: function () {  //礼包详情
        var url = SERVER_ADDR + '/shareCoupon/userReceivedList.json';
        var Data = {};
        Data.shareCouponId = getQueryString('id');
        ajaxGetRetInfo(url, Data, this.getGiftInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    getGiftInfoSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            if(retInfo.data.receivedMans.length == 0){
               $('.getMobileDiv').hide();
            }else{
                setTimeout(function () {
                    $('.getMobileDiv').show();
                    var html = '';
                    retInfo.data.receivedMans.forEach(function (value,index) {
                        console.log(index)
                        html += '<li class="hos_child set_box_shadow ulli" onclick="href(this)">' +
                            '<div class="hos_list_top clearfix">' +
                            '<div class="left">' ;
                        if(retInfo.data.receivedMans.length == 1 && index == 0){
                            html += '<img src="/sale/img/giftHeadImg1.png">';
                        }else if(retInfo.data.receivedMans.length == 2 && index == 0){
                            html += '<img src="/sale/img/giftHeadImg2.png">';
                        }else if(retInfo.data.receivedMans.length == 2 && index == 1){
                            html += '<img src="/sale/img/giftHeadImg1.png">';
                        }else{
                            html += '<img src="/sale/img/giftHeadImg1.png">';
                        }
                        html += '</div>' +
                            '<div class="right">' +
                            '<p>'+value.receiveManMobile+'';
                        if(value.shareCouponBelongState == '已失效'){
                            //html += '<span style="color: #00ad9f">（No.'+retInfo.data.showCode+'）</span>'
                        }else if(value.shareCouponBelongState == '已领取'){
                            html += '<span style="color: #00ad9f">（No.'+retInfo.data.showCode+'）</span>'
                        }
                        html +='</p>' +
                            '<p><span class="getTime">'+new Date(value.receiveDate).Format('yyyy-MM-dd hh:mm:ss')+'</span>' ;
                        if(value.shareCouponBelongState == '已失效'){
                            html += '<span class="getStatus">'+value.shareCouponBelongState+'</span>'
                        }else if(value.shareCouponBelongState == '已领取'){
                            html += '<span class="getStatus" style="color: #f49d16">'+value.shareCouponBelongState+'</span>'
                        }
                        html += '</p>' +
                            '</div>' +
                            '</div>' +
                            '</li>';
                    });
                    $('#dataList').append(html);
                },300);

                //领礼包的是自己
                if(localStorage.getItem('getGiftMobile') == null){
                    //自己没领过
                    if(retInfo.data.receivedMans.length == 1){ //自己没领过，但是被别人领完了
                        Go.giftGetOver();
                    }else{
                        Go.giftGetOver();
                    }
                }else{
                    //自己领过了，最后领取人是自己
                    if(retInfo.data.finalReceiveManMobile == localStorage.getItem('getGiftMobile')){
                        Go.giftGetAlreaddy();
                        $('.getImg').attr('onclick','Go.giftGetAlreaddy()');
                    }else{ //自己领过了，最后领取人不是自己
                        if(retInfo.data.receivedMans.length == 1){  //自己领过了 最后领取人不是自己，这个礼包只被领取过一次
                            Go.giftGetOver();
                        }else{ //自己领过了 最后领取人不是自己，这个礼包被领完了
                            Go.giftGetOver();
                        }
                    }
                }
            }
        }else {
            alert(retInfo.data);
        }
    },
    giftGetAlreaddy:function () {
        $('.msgText').text('您已领取了此礼包');
        $('.msg').fadeIn();
        setTimeout(function () {
            $('.msg').fadeOut();
        },2500);
    },
    giftGetOver:function () {
        $('.noGetImg').remove();
        $('.contain').prepend('<img style="margin-bottom: -40%;" class="containImg" src="/sale/img/alreadyGetGift.jpg">');//
        $('.msgText').text('该礼包已被他人领取');
        $('.msg').fadeIn();
        setTimeout(function () {
            $('.msg').fadeOut();
        },2500);
    },
    getGift: function () {  //输入手机号领取礼包
        if (Go.check(/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test($(".mobile").val().trim()) === true, "请输入正确的手机号！")) {
            $('.accurate_btn').attr('disabled',true);
            var url = SERVER_ADDR + '/shareCoupon/receive';
            var Data = {};
            Data.shareCouponId = getQueryString('id');
            Data.mobile = $('.mobile').val();
            ajaxGetRetInfo(url, Data, this.getGiftSuccess, '请求失败', 'POST', true, undefined);
        }
    },
    getGiftSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            localStorage.setItem('getGiftMobile',$('.mobile').val());
            alert(retInfo.data);
            window.location.reload();
        }else {
            alert(retInfo.data);
            window.location.reload();
        }
    },
    setGiftStatus: function () {  //礼包分享回调
        var url = SERVER_ADDR + '/shareCoupon/changeGrantState/to/hasBeenGrant';
        var Data = {};
        Data.shareCouponId = getQueryString('id');
        ajaxGetRetInfo(url, Data, this.setGiftStatusSuccess, '请求失败', 'POST', true, undefined);
    },
    setGiftStatusSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            alert('该礼包成功发放');
        }else {
            alert(retInfo.data);
        }
    }
}
