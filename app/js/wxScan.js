var Wx = {
    scanQRCodeChoose:function() {
        if(is_weixn()){
            Wx.scanQRCode();
        }else {
            //$('#bcid,footer').show();

            window.location.href = 'appScan.html'
        }
    },
    scanQRCode:function () {
        var url = SERVER_ADDR + '/wx/getSign.json';
        var Data = {};
        Data.url = window.location.href;
        /*if(SERVER_ADDR == 'http://www.enuo120.com'){*/
            ajaxGetRetInfo(url, Data, this.scanQRCodeSuccess, '请求失败', 'GET', true, undefined);
        /*}*/
    },
    scanQRCodeSuccess:function (jsonData) {
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
            //alert('开始检测的JS接口');
            wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    var url = res.resultStr;
                    Wx.toUrl(url);
                }
            })
        });
    },
    toUrl:function (url) {
        var url = url;
        var Data = '';
        ajaxGetRetInfo(url, Data, this.toUrlSuccess, '请求失败', 'GET', true, undefined);
    },
    toUrlSuccess:function (res) {
        if(res.success == true){

            window.location.href = res.data;
            //$('#bcid,footer').hide();
        }else {
            alert(res.data);
        }
    }
}