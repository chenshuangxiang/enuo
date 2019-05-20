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
        jsApiList: ['getLocation']
    });
    wx.ready(function () {
        wx.getLocation({
            success: function (res) {
                var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                localStorage.setItem("latitude", latitude);
                localStorage.setItem("longitude", longitude);
                var data = {
                    latitude: latitude,
                    longitude: longitude
                };
                //window.location.reload();
                callback();
                /*if (typeof callback == "function") {
                    callback(data);
                }*/
            },
            cancel: function () {
                //这个地方是用户拒绝获取地理位置
                alert('您取消了地理定位');
            }
        });
    })
}
function baiduLocation() {
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){
            localStorage.setItem("latitude", r.point.lat);
            localStorage.setItem("longitude", r.point.lng);
            callback();
        }
        else {
            alert('错误'+this.getStatus());
        }
    },{enableHighAccuracy: true})
}