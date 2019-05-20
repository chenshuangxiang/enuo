var title = '【福音来了】您全家的口腔护理，都给安排上了';
var link = 'https://www.enuo120.com/app/activityHuLiCard.html';
var imgUrl = 'https://www.enuo120.com/upload/image/201808/02/ZvYa8pXBe7WdkROptlj.jpg';  //分享的信息
function init() {
    getSign();
    if(window.history.length == 1){
        $('.pub_hearder_left').attr("onclick","window.location.href = 'xywz.html'");
    }
    $('.paybackclose').click(function () {
        $('.paybackOpen').hide();
    });
}
var Go = {
    pay: function () {
        window.location.href = 'special_cp.html?itemId=261';
        //$('.main_close').click();
        //$('.yixuan').text('已选：'+ $('.choose_shose').text() +' ×'+ $('.buycount').text())
        /* if ($('.yixuan').text() == '数量') {
             tochoose3()
             return;
         }*/
        //$('.make').attr('onclick','').css('background-color','#999');
        /*if (businesStatus == 'normal' || businesStatus == undefined) {
            var url = SERVER_ADDR + '/app/user/order/submit';
            var Data = {};
            Data.specialProductId = getQueryString('itemId');
            //Data.isDean = $('.sexnameActive').attr('isDean');//$('input[name="sex"]:checked').val() == 'expert' ? false : true;
            //Data.quantity = 1;
            ajaxGetRetInfo(url, Data, this.paySuccess, '请求失败', 'POST', true, undefined);
        } else if (businesStatus == 'violate') {
            alert('为了医疗安全，不可以预约');
        } else if (businesStatus == 'closed') {
            alert('暂未开放约定医疗，不可预约');
        }*/
        /*var url = SERVER_ADDR + '/app/user/order/submit';
        var Data = {};
        Data.specialProductId = getQueryString('itemId');
        //Data.isDean = $('.sexnameActive').attr('isDean');//$('input[name="sex"]:checked').val() == 'expert' ? false : true;
        //Data.quantity = 1;
        ajaxGetRetInfo(url, Data, this.paySuccess, '请求失败', 'POST', true, undefined);*/
    },
    paySuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            window.location.href = 'pay/order_pay.html?payId=' + retInfo.data;
        } else {
            if (retInfo.data == '请先完善个人信息') {
                alert(retInfo.data);
                window.location.href = 'bind_name.html';
            } else if (retInfo.data == '分享当前页面到朋友圈才能购买哦') {
                //window.location.href = 'bind_name.html';
                //alert(retInfo.data);
                if (is_weixn()) {
                    $('.modelOpen').show()
                }
                //去分享页面
                //getSign();
            } else {
                alert(retInfo.data);
            }
        }
    },
    getHuliCardForCode:function () {  //兑换护理卡护理卡
        if($('.huliCardCode').val().trim() == ''){
            alert('请输入兑换码');
            return;
        }
        var url = SERVER_ADDR + '/app/NursingCard/activationNursingCard';
        var Data = {};
        // Data.id = getQueryString('id');
        Data.activationCode = $('.huliCardCode').val();
        ajaxGetRetInfo(url, Data, this.getHuliCardForCodeSuccess, '请求失败', 'POST', true, undefined);
    },
    getHuliCardForCodeSuccess:function (retInfo) {
        if(retInfo.success == true){
            alert(retInfo.data);
            window.location.href = 'myHuliCard.html';
        }else{
            alert(retInfo.data)
        }
    },
}
function callback() {
    Go.share();
}