function init() {
   // Pay.click();
        var ua = navigator.userAgent.toLowerCase();
        var tip = document.querySelector(".weixin-tip");
        var tipImg = document.querySelector(".J-weixin-tip-img");
        if (ua.indexOf('micromessenger') != -1) {
            tip.style.display = 'block';
            tipImg.style.display = 'block';
            if (ua.indexOf('iphone') != -1 || ua.indexOf('ipad') != -1 || ua.indexOf('ipod') != -1) {
                tipImg.className = 'J-weixin-tip-img weixin-tip-img iphone'
            } else {
                tipImg.className = 'J-weixin-tip-img weixin-tip-img android'
            }
        } else {
            Pay.click();
           /* var getQueryString = function (url, name) {
                var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
                if (reg.test(url)) return RegExp.$2.replace(/\+/g, " ");
            };
            var param = getQueryString(location.href, 'goto') || '';
            location.href = param != '' ? _AP.decode(param) : 'payOpen.html#error';*/
        }

}
/*支付*/
var Pay = {
    click:function () {
        //进行支付宝下单
        this.ajaxPay('/app/ali/user/payment/form');
    },
    ajaxPay:function (ajaxUrl) {
        var url = SERVER_ADDR + ajaxUrl;
        var Data = {};
        Data.paymentSn = getQueryString('paymentSn');
        ajaxGetRetInfo(url, Data, this.ajaxPaySuccess, '请求失败', 'POST', true, undefined);
    },
    ajaxPaySuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){

            /*if ($("input[type='radio']:checked").val() == 'lianlian') {
                //去连连支付
                $("input[name='req_data']").val(JSON.stringify(retInfo.data.param))
                $('#lianlianPay').click();
            }else if($("input[type='radio']:checked").val() == 'wecat'){
                if(is_weixn()) {
                    //去微信公众号支付
                    Pay.payResult(retInfo);
                }else{
                    //去微信H5支付
                    var str = window.location.href + '&isApp=true';
                    window.location.href = retInfo.data.param.url + '&redirect_url=' + encodeURIComponent(str);
                }
            }else{
                //去支付宝支付
                zfbClick()
                //$('.J-btn-submit').click();
                //$("input[name='req_data']").val(JSON.stringify(retInfo.data.param))
                //$('#lianlianPay').click();
            }*/
            console.log(retInfo.data.param)
            //var newTab = window.open();
            //var div = document.createElement('div');
            $('body').append(retInfo.data.form);
            /*$('body').append('<form name="punchout_form" method="post" action="https://openapi.alipaydev.com/gateway.do?\n' +
                'charset=utf-8&method=alipay.trade.…=2018-09-06+16%3A16%3A33&alipay_sdk=alipay-sdk-java-\n' +
                '3.3.49.ALL&format=json">\n' +
                '<input type="hidden" name="biz_content" \n' +
                'value="{&quot;enable_pay_channels&quot;:&quot;balance,moneyFund,creditCard&quot;,&quot;out_t\n' +
                'rade_no&quot;:&quot;2018090616477&quot;,&quot;product_code&quot;:&quot;QUICK_WAP_WAY&quot;,&\n' +
                'quot;subject&quot;:&quot;婵€鍏夌鐥�&quot;,&quot;total_amount&quot;:&quot;10.0&quot;}">\n' +
                '<input type="submit" value="绔嬪嵆鏀粯" style="display:none" >\n' +
                '</form>\n' +
                '<script>document.forms[0].submit();</script>')*/
            document.forms[0].submit();
            //$('from[name="punchout_form"]').submit();
            //div.innerHTML =  retInfo.data.param;
            //newTab.document.body.appendChild(div);
            //newTab.document.forms.punchout_form.submit();
        }else{
            alert(retInfo.data)
        }
    },
    payResult:function (jsonData) {
        var jsonDataPost = jsonData.data.param;
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
                /*$.ajax({
                    type: 'POST',
                    url: '/WeiXinGz/QueryOrder',
                    data: {
                        orderId: jsonData.orderId
                    },
                    cache: false,
                    dataType: 'text',
                    success: function (jsonData) {
                        if (jsonData == "ok") {
                            alert("支付成功", "提示", function () {
                                alert("页面跳转等业务处理");
                            });
                        } else {
                            alert("支付失败,请稍后重试！如果收到支付通知，切勿重复支付1！");
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("支付失败,请稍后重试！如果收到支付通知，切勿重复支付2！");
                    }
                });*/
                //alert('支付成功')
                paySuccessDo()
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
/*var Pay = {
    click:function () {
        //进行支付宝下单
        this.ajaxPay('/app/user/payment/ali/submit');
    },
    ajaxPay:function (ajaxUrl) {
            if(getQueryString('specailId') == huliCardId){  //如果购买的是护理卡的，请求护理卡支付接口
                ajaxUrl = '/app/NursingCard/ali/nursingCardSubmit';
            }
            var url = SERVER_ADDR + ajaxUrl;
            var Data = {};
            Data.orderId = getQueryString('orderId');
            if(getQueryString('amount') != 'undefined'){
                Data.amount = getQueryString('amount');
            }
            Data.isRecharge = getQueryString('isRecharge');
            ajaxGetRetInfo(url, Data, this.ajaxPaySuccess, '请求失败', 'POST', true, undefined);
        },
    ajaxPaySuccess:function (retInfo) {
        console.log(retInfo)
        debugger
        if(retInfo.success == true){

                /!*if ($("input[type='radio']:checked").val() == 'lianlian') {
                    //去连连支付
                    $("input[name='req_data']").val(JSON.stringify(retInfo.data.param))
                    $('#lianlianPay').click();
                }else if($("input[type='radio']:checked").val() == 'wecat'){
                    if(is_weixn()) {
                        //去微信公众号支付
                        Pay.payResult(retInfo);
                    }else{
                        //去微信H5支付
                        var str = window.location.href + '&isApp=true';
                        window.location.href = retInfo.data.param.url + '&redirect_url=' + encodeURIComponent(str);
                    }
                }else{
                    //去支付宝支付
                    zfbClick()
                    //$('.J-btn-submit').click();
                    //$("input[name='req_data']").val(JSON.stringify(retInfo.data.param))
                    //$('#lianlianPay').click();
                }*!/
                console.log(retInfo.data.param)
            var newTab = window.open();
            var div = document.createElement('div');
            div.innerHTML =  retInfo.data.param;
            newTab.document.body.appendChild(div);
            newTab.document.forms.punchout_form.submit();
        }else{
            alert(retInfo.data)
        }
    },
    payResult:function (jsonData) {
        var jsonDataPost = jsonData.data.param;
        /!*{
            "appId":"wx2421b1c4370ec43b",     //公众号名称，由商户传入
            "timeStamp":"1395712654",         //时间戳，自1970年以来的秒数
            "nonceStr":"e61463f8efa94090b1f366cccfbbb444", //随机串
            "package":"prepay_id=u802345jgfjsdfgsdg888",
            "signType":"MD5",         //微信签名方式：
            "paySign":"70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名
        }*!/
        WeixinJSBridge.invoke('getBrandWCPayRequest', jsonDataPost, function (res) {
            // 使用以下方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            //【因此微信团队建议：】当收到ok返回时，向商户后台询问是否收到交易成功的通知，
            //若收到通知，前端展示交易成功的界面；
            //若此时未收到通知，商户后台主动调用查询订单接口，查询订单的当前状态，并反馈给前端展示相应的界面。
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                //JS API的返回结果get_brand_wcpay_request：ok仅在用户成功完成支付时返回
                /!*$.ajax({
                    type: 'POST',
                    url: '/WeiXinGz/QueryOrder',
                    data: {
                        orderId: jsonData.orderId
                    },
                    cache: false,
                    dataType: 'text',
                    success: function (jsonData) {
                        if (jsonData == "ok") {
                            alert("支付成功", "提示", function () {
                                alert("页面跳转等业务处理");
                            });
                        } else {
                            alert("支付失败,请稍后重试！如果收到支付通知，切勿重复支付1！");
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("支付失败,请稍后重试！如果收到支付通知，切勿重复支付2！");
                    }
                });*!/
                //alert('支付成功')
                paySuccessDo()
            } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                //由于前端交互复杂，get_brand_wcpay_request：cancel或者get_brand_wcpay_request：fail可以统一处理为用户遇到错误或者主动放弃，不必细化区分。
                alert("您放弃了支付");
            } else {
                //由于前端交互复杂，get_brand_wcpay_request：cancel或者get_brand_wcpay_request：fail可以统一处理为用户遇到错误或者主动放弃，不必细化区分。
                alert("支付失败,请稍后重试！如果收到支付通知，切勿重复支付！");
            }
        });
    }
}*/
function zfbClick() {
        console.log(444)
        var bizMap = {
            "body":"对一笔交易的具体描述信息",
            "out_trade_no":"70501111111S001111119",
            "product_code":"QUICK_WAP_PAY",
            "seller_id":"2088102147948060",
            "subject":"商品名",
            "total_amount":9.00
        };
        var bizStr = JSON.stringify(bizMap);

        var queryParam = '';
        queryParam += 'bizcontent=' + encodeURIComponent(bizStr);
        Array.prototype.slice.call(document.querySelectorAll("input[type=hidden]")).forEach(function (ele) {
            queryParam += '&' + ele.name + "=" + encodeURIComponent(ele.value);
        });
        var gotoUrl = document.querySelector("#pay_form").getAttribute('action') + '?' + queryParam;
        console.log(gotoUrl);
        _AP.pay(gotoUrl);
}

function paySuccessDo() {
    if(specail == 'product'){ //如果是特价 要去请求是否全部支付完成
        Get.specilaPayYuyue();
       /* $(".main_close").click();
        $('.modelOpen').show();
        $('.pub_hearder_left').attr('onclick','window.location.href = "order.html"');*/
    }else{
        window.location.href = 'order.html'
    }
}