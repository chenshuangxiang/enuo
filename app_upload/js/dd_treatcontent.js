function init() {
    $('.head_title').text(getQueryString('name'));
    Get.zhenduanDetial();
}
var Get = {
    zhenduanDetial: function () {
        var url = SERVER_ADDR + '/app/danDanRelease/getDiagnosisTreatmentDetail.json';
        var Data = {};
        Data.id = getQueryString('id');
        ajaxGetRetInfo(url, Data, this.zhenduanDetialSuccess, '请求失败', 'GET', true, undefined);
    },
    zhenduanDetialSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
           $('.treatmentMethod').append('<p>'+retInfo.data.judge+'</p>');
            retInfo.data.inspect.forEach(function (value) {
                $('.inspect').append('<p><img class="leftimg" src="img/ddgou.png">'+value+'</p>');
            });
            retInfo.data.doubt.forEach(function (value) {
                $('.treatmentTime').append('<p><img class="leftimg" src="img/ddclose.png">'+value+'</p>');
            });
        } else {
            alert(retInfo.data);
        }
    }
}