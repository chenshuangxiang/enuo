
var title = '新年扫眉大行动，99元水雾眉任性做';
var link = window.location.href;
var imgUrl = 'https://www.enuo120.com/upload/image/201812/17/C8YzXfnLpEoqJE6hAjD.jpg';  //分享的信息
var desc = 'e诺医疗监管平台携手杭州天鑫整形医院举办新年扫眉大行动，超低价格、免费补色，等你来扫！';
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