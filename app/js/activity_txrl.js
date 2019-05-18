
var title = '进口超声刀岁末拼团价2980元';
var link = window.location.href;
var imgUrl = 'https://www.enuo120.com/upload/image/201811/19/F1OyDRs3Z0x32a3OhVq.jpg';  //分享的信息
var desc = '新年增岁不添老！天鑫整形岁末年轻豪礼！进口超声刀，惊喜团购价，进来看看吧~';
var tolatitude = 30.26713;
var tolongitude = 120.12805;
var toname = '杭州天鑫瑞丽整形医院';
var toaddress = '杭州市西湖区玉古路166-1号(第十五中学对面)';
function init() {
    getSign();

}
function toLocalAddress() {
    if(is_weixn()){
        getSignHos();
    }else{
        window.location.href = 'http://api.map.baidu.com/geocoder?location='+tolatitude+','+tolongitude+'&output=html'
    }
}
function getSignHos() {
    var url = SERVER_ADDR + '/wx/getSign.json';
    var Data = {};
    Data.url = window.location.href;
    /*if(SERVER_ADDR == 'http://www.enuo120.com'){*/
    ajaxGetRetInfo(url, Data, getSignHosSuccess, '请求失败', 'GET', true, undefined);
    /*}*/
}
function getSignHosSuccess(retInfo) {
    console.log(retInfo)
    payResultHos(retInfo);
}
function payResultHos(jsonData) {
    wx.config({
        debug: true,
        appId: jsonData.data.appId,
        timestamp: jsonData.data.timestamp,
        nonceStr: jsonData.data.nonceStr,
        signature: jsonData.data.signature,
        jsApiList: ['openLocation']
    });
    wx.ready(function () {
        wx.openLocation({
            latitude: tolatitude,
            longitude: tolongitude,
            name: toname,
            address: toaddress,
            scale: 14
        });
    })
}