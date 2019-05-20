var pageNumber = 1;
var total = 5;
var nexttotal = 0;





var Get = {
    getDocInfo:function () {
        var url = SERVER_ADDR + '/app/specialProduct/getDetail.json';
        var Data = {};
        Data.id = getQueryString('itemId');
        ajaxGetRetInfo(url, Data, this.getDocInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    getDocInfoSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            if(retInfo.data.deanPrice){
                $('.dean').show();
            }else{
                $('.dean').hide();
            }
            $('.headerimg').css('background','url("'+retInfo.data.headImgUrl+'") no-repeat').css('background-size','100%').css('background-position','0%');
            $('.cptitleName').text(retInfo.data.name);
            $('.price').text('￥'+ 1);

        }else{
            alert(retInfo.data)
        }
    },
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
