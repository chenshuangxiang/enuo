$(function () {
    // 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        //公众号支付
        document.getElementById("pay").onclick = function () {
            //1.前端验证
            var money = $('#num').val();
            if (money == "") {
                alert('请将信息输入完整');
                return;
            }
            mui('#pay').button('loading');
            //2.进行下单
            $.ajax({
                type: 'POST',
                url: '/WeiXinGz/GetAPI',
                data: { "money": money },
                cache: false,
                dataType: 'json',
                success: function (jsonData) {
                    if (jsonData.status == "1") {
                        //公众号支付
                        WeixinJSBridge.invoke('getBrandWCPayRequest', jsonData.payData, function (res) {
                            // 使用以下方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                            //【因此微信团队建议：】当收到ok返回时，向商户后台询问是否收到交易成功的通知，
                            //若收到通知，前端展示交易成功的界面；
                            //若此时未收到通知，商户后台主动调用查询订单接口，查询订单的当前状态，并反馈给前端展示相应的界面。
                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                                //JS API的返回结果get_brand_wcpay_request：ok仅在用户成功完成支付时返回
                                $.ajax({
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
                                            mui('#pay').button('reset');
                                        } else {
                                            alert("支付失败,请稍后重试！如果收到支付通知，切勿重复支付1！");
                                            mui('#pay').button('reset');
                                        }
                                    },
                                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                                        alert("支付失败,请稍后重试！如果收到支付通知，切勿重复支付2！");
                                        mui('#pay').button('reset');
                                    }
                                });
                            } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                                //由于前端交互复杂，get_brand_wcpay_request：cancel或者get_brand_wcpay_request：fail可以统一处理为用户遇到错误或者主动放弃，不必细化区分。
                                alert("您放弃了支付");
                                mui('#pay').button('reset');
                            } else {
                                //由于前端交互复杂，get_brand_wcpay_request：cancel或者get_brand_wcpay_request：fail可以统一处理为用户遇到错误或者主动放弃，不必细化区分。
                                alert("支付失败,请稍后重试！如果收到支付通知，切勿重复支付3！");
                                mui('#pay').button('reset');
                            }
                        });
                    } else {
                        alert(jsonData.promptInfor);
                        mui('#pay').button('reset');
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("微信订单提交失败,请稍后重试4！");
                    mui('#pay').button('reset');
                }
            });

        }
    }, false);
});