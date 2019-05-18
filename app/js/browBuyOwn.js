var pageNumber = 1;
var total = 5;
var nexttotal = 0;
var title = '';
var link = window.location.href;
var imgUrl = 'https://www.enuo120.com/app/img/browActive/browOrder.jpg';  //分享的信息
var desc = '';
var tolatitude = 30.306619;  //爱德地址经纬度
var tolongitude = 120.175088;
var toname = '浙江爱德医院口腔科';
var toaddress = '杭州市下城区东新路509号爱德医院';
function init() {
    getSign();
    $('.peopelcount').text(parseInt(((new Date().getTime() - 1555257600000)/1000)/60/5)); //2018.10.15开始5分钟一个人
    if(getQueryString('type') == 'qizhu'){
        $('.qizhu').show();
    }else if(getQueryString('type') == 'qiyuan'){
        $('.qiyuan').show();
    }
    Get.getDocInfo();
}
function toLocalAddress() {
    if(is_weixn()){
        getSignHos();
    }else{
        window.location.href = 'http://api.map.baidu.com/geocoder?location='+30.312619+','+120.181788+'&output=html'
    }
}
var Get = {
    getDocInfo:function () {
        var url = SERVER_ADDR + '/app/specialProduct/getDetail.json';
        var Data = {};
        Data.id = toothPin;
        ajaxGetRetInfo(url, Data, this.getDocInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    getDocInfoSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            $('.line_consult').attr('employee',retInfo.data.employeeId);
        }else{
            alert(retInfo.data)
        }
    },
}
var Go = {
    topanimate: function () {
        $(".shareCall").removeClass("call-active").addClass("am-modal-active");//向上弹出取消
        if ($(".sharebg").length > 0) {
            $(".sharebg").addClass("sharebg-active");//背景颜色变化并增加透明度
        } else {
            $("body").append('<div class="sharebg"></div>');
            $(".sharebg").addClass("sharebg-active");
        }
    },
    closetopanimate:function () {
        $(".shareCall").removeClass("am-modal-active").addClass("call-active");//向上弹出取消
        setTimeout(function () {
            $(".sharebg-active").removeClass("sharebg-active");//背景颜色恢复
            $(".sharebg").remove();

        }, 200);
    },
    chat:function () {
        window.location.href = 'chat.html?hosId=' + $('.line_consult').attr('employee');
    },
    pay: function () {
            var url = SERVER_ADDR + '/app/user/activityProductOrder/create/record';
            var Data = {};
            Data.activityProductId = toothActivityProductId;
            ajaxGetRetInfo(url, Data, this.paySuccess, '请求失败', 'POST', true, undefined);
    },
    paySuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            if(getQueryString('type') == 'qizhu'){
                window.location.href = 'pay/order_pay.html?payId='+retInfo.data + '&type=qizhu';
            }else{
                window.location.href = 'pay/order_pay.html?payId='+retInfo.data + '&teamid=' + getQueryString('teamid');
            }
        } else {
            if(retInfo.data == '订单金额尚未支付完' || retInfo.data == '您已购买过此项目'){
                $('.toOpen').show();
            }else{
                alert(retInfo.data);
            }
        }
    }
}
/*支付*/
var Pay = {
    click:function () {
        //进行下单
            if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady',  this.ajaxPay('/app/user/recharge'), false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady',  this.ajaxPay('/app/user/recharge'));
                    document.attachEvent('onWeixinJSBridgeReady',  this.ajaxPay('/app/user/recharge'));
                }
            } else {
                this.ajaxPay('/app/user/recharge');
            }
    },
    ajaxPay:function (ajaxUrl) {
        $('.make').attr('onclick','');
        var url = SERVER_ADDR + ajaxUrl;
        var Data = '';
        //Data.orderId = getQueryString('itemId');
     /*   if($('.payRightChooseZi').text() == "分单支付"){
            var money = $('.fendanVal').val();
            if (money.trim() == "") {
                alert('请输入分单支付金额');
                return;
            }
            if($('.fendanVal').val() < 0.01){
                alert('支付最少0.01元')
                return;
            }
            Data.amount = money;
        }*/
      /*  if($('.yueRadio').is(':checked')){
            Data.isRecharge = true;
        }else{
            Data.isRecharge = false;
        }*/
        ajaxGetRetInfo(url, Data, this.ajaxPaySuccess, '请求失败', 'POST', true, undefined);
    },
    ajaxPaySuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            //去微信支付
            Pay.payResult(retInfo);
        }else{
            alert(retInfo.data)
        }
    },
    payResult:function (jsonData) {
        var jsonDataPost = jsonData.data;
        /*{
            "appId":"wx2421b1c4370ec43b",     //公众号名称，由商户传入
            "timeStamp":"1395712654",         //时间戳，自1970年以来的秒数
            "nonceStr":"e61463f8efa94090b1f366cccfbbb444", //随机串
            "package":"prepay_id=u802345jgfjsdfgsdg888",
            "signType":"MD5",         //微信签名方式：
            "paySign":"70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名
        }*/
        WeixinJSBridge.invoke('getBrandWCPayRequest', jsonDataPost, function (res) {
            // 使用以下方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            //【因此微信团队建议：】当收到ok返回时，向商户后台询问是否收到交易成功的通知，
            //若收到通知，前端展示交易成功的界面；
            //若此时未收到通知，商户后台主动调用查询订单接口，查询订单的当前状态，并反馈给前端展示相应的界面。
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                //JS API的返回结果get_brand_wcpay_request：ok仅在用户成功完成支付时返回
                //alert('支付成功')
                window.location.href = 'user_center.html';
                //paySuccessDo()
            } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                //由于前端交互复杂，get_brand_wcpay_request：cancel或者get_brand_wcpay_request：fail可以统一处理为用户遇到错误或者主动放弃，不必细化区分。
                alert("您放弃了支付");
            } else {
                //由于前端交互复杂，get_brand_wcpay_request：cancel或者get_brand_wcpay_request：fail可以统一处理为用户遇到错误或者主动放弃，不必细化区分。
                alert("支付失败,请稍后重试！如果收到支付通知，切勿重复支付！");
            }
        });
    }
}
/*
function paySuccessDo() {
    if(specail == 'product'){ //如果是特价 要去请求是否全部支付完成
        /!*Get.specilaPayYuyue();*!/
        $(".main_close").click();
        $('.modelOpen').show();
        $('.pub_hearder_left').attr('onclick','window.location.href = "order.html"');
    }else{
        window.location.href = 'order.html'
    }
}*/
