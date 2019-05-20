
function getSign() {
    var url = SERVER_ADDR + '/wx/getSign.json';
    var Data = {};
    Data.url = window.location.href;
    /*if(SERVER_ADDR == 'http://www.enuo120.com'){*/
        ajaxGetRetInfo(url, Data, getSignSuccess, '请求失败', 'GET', true, undefined);
    /*}*/
}
function getSignSuccess(retInfo) {
    console.log(retInfo)
    payResult(retInfo);
}
function payResult(jsonData) {
    wx.config({
        debug: true,
        appId: jsonData.data.appId,
        timestamp: jsonData.data.timestamp,
        nonceStr: jsonData.data.nonceStr,
        signature: jsonData.data.signature,
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
    });
    wx.ready(function () {
        wx.onMenuShareTimeline({  //例如分享到朋友圈的API
            title: title, // 分享标题
            link: link, // 分享链接
            desc: desc, // 分享描述
            imgUrl: imgUrl, // 分享图标
            /*trigger: function (res) {
                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                alert('用户点击分享到朋友圈');
            },*/
            success: function () {
                // 用户确认分享后执行的回调函数
                callback();
            },
            cancel: function () {
                //alert('您取消了分享');
                //alert('您取消了分享，将不能购买一元购产品哦');
            }
        })
        wx.onMenuShareAppMessage({  //例如分享到朋友圈的API
            title: title, // 分享标题
            link: link, // 分享链接
            desc: desc, // 分享描述
            imgUrl: imgUrl, // 分享图标
            /*trigger: function (res) {
                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                alert('用户点击分享到朋友圈');
            },*/
            success: function () {
                // 用户确认分享后执行的回调函数
                callback();
            },
            cancel: function () {
                //alert('您取消了分享');
                //alert('您取消了分享，将不能购买一元购产品哦');
            }
        });
        //分享QQ
        wx.onMenuShareQQ({
            title: title, // 分享标题
            link: link, // 分享链接
            desc: desc, // 分享描述
            imgUrl: imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                callback();
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });

        //分享腾讯微博
        wx.onMenuShareWeibo({
            title: title, // 分享标题
            link: link, // 分享链接
            desc: desc, // 分享描述
            imgUrl: imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                callback();
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });


        //分享QQ空间
        wx.onMenuShareQZone({
            title: title, // 分享标题
            link: link, // 分享链接
            desc: desc, // 分享描述
            imgUrl: imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                callback();
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
    })
}
/*
function payResult(jsonData) {
    console.log(jsonData);
    wx.config({
        debug: true,
        appId: jsonData.data.appId,
        timestamp: jsonData.data.timestamp,
        nonceStr: jsonData.data.nonceStr,
        signature: jsonData.data.signature,
        jsApiList: ['scanQRCode']
    });
    wx.ready(function () {
        // 在这里调用 API
        alert(1);
        wx.checkJsApi({
            jsApiList: ['chooseImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success: function(res) {
                alert(res.errMsg);
                // 以键值对的形式返回，可用的api值true，不可用为false
                // {"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
            }
        });
        wx.scanQRCode({
            needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {

                var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            }

        })
    });

}*/
