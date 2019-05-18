
var title = 'e诺说让你了解最全的人生百科';
var link = window.location.href;
var imgUrl = 'https://www.enuo120.com/app/img/enuosayshare.jpg';  //分享的信息
var desc = 'e诺说，最专业、最客观、最权威的的医疗健康知识问答，让你了解最全的人生百科';
function callback() {
    //Go.share();
}
function init() {
    getSign();
    if(window.history.length == 1){
        $('.pub_hearder_left').attr("onclick","window.location.href = 'xywz.html'");
    }
    Get.detail();
}
var Get = {
    detail: function () {
        var url = SERVER_ADDR + '/app/article/getDetail.json';
        var Data = {};
        Data.id = getQueryString('id');
        ajaxGetRetInfo(url, Data, this.detailSuccess, '请求失败', 'GET', true, undefined);
    },
    detailSuccess: function (retInfo) {
        console.log(retInfo);
        if (retInfo.success == true) {
            title = retInfo.data.title;
            imgUrl = retInfo.data.largeImage;
            $('.articleTitle').text(retInfo.data.title);
            $('.articleTime').text(new Date(retInfo.data.createDate).Format('yyyy-MM-dd'));
            $('.headerimgTop').attr('src',retInfo.data.largeImage);
            $('.enuoinfo').html(retInfo.data.content);
        } else {
            alert(retInfo.data);
        }
    }
}