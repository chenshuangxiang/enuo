function init() {
    $('.head_title').text(getQueryString('name'));
    if(getQueryString('type') == 2){
        $('.find_hos').show();
        $('.find_doc').hide();
        Get.zhiliaoDetial();
    }else{
        $('.find_hos').hide();
        $('.find_doc').show();
        Get.zhenduanList();
    }

}
var Get = {
    zhiliaoDetial: function () {
        var url = SERVER_ADDR + '/app/danDanRelease/getTreatmentReleaseInfo.json';
        var Data = {};
        Data.id = getQueryString('id');
        ajaxGetRetInfo(url, Data, this.zhiliaoDetialSuccess, '请求失败', 'GET', true, undefined);
    },
    zhiliaoDetialSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
           $('.treatmentTime').text(retInfo.data.treatmentTime);
            retInfo.data.drugChoice.forEach(function (value) {
                $('.drugChoice').append('<p>'+value+'</p>');
            });
            retInfo.data.inspect.forEach(function (value) {
                $('.inspect').append('<p>'+value+'</p>');
            });
            retInfo.data.treatmentMethod.forEach(function (value) {
                $('.treatmentMethod').append('<p>'+value+'</p>');
            });
        } else {
            alert(retInfo.data);
        }
    },
    zhenduanList: function () {
        var url = SERVER_ADDR + '/app/danDanRelease/getNeopathyList.json';
        var Data = {};
        Data.diagnosisReleaseId = getQueryString('id');
        ajaxGetRetInfo(url, Data, this.zhenduanListSuccess, '请求失败', 'GET', true, undefined);
    },
    zhenduanListSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
             retInfo.data.forEach(function (value) {
                 $('.treatment').append('<p illid="'+value.diagnosisTreatmentId+'" onclick="zhenduanListhref(this)"><span>'+value.neopathy+'</span><img class="nextblack" src="img/nextblack.png"></p>');
             })

        } else {
            alert(retInfo.data);
        }
    }
}
function zhenduanListhref(obj) {
    window.location.href = 'dd_treatcontent.html?id=' + $(obj).attr('illid')+'&name='+ $('.head_title').text();
}