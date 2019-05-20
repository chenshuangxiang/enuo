var title = '丹丹发布';
var link = window.location.href;
var imgUrl = 'https://www.enuo120.com/app/img/ddtop.png';
var desc = '想知道医院有没有过度检查、过度治疗，e诺约定告诉您';
function init() {
    Get.zhenduan();
    $('.xywztejia').click(function () {
        $('.xywztejia').children('.avtivitySpan').removeClass('avtivityactive');
        $(this).children('.avtivitySpan').addClass('avtivityactive');
    });
    $('.xywztejiaLeft').click(function () {
        $('.head_title').text('诊断发布');
        $('.tejiaLeft .li').empty();
        $('.tejiaLeft').show();
        $('.tejiaRight').hide();
        $('.xywztejiaLeft').css('color','#00afa1');
        $('.xywztejiaRight').css('color','#707070');
        Get.zhenduan();
    });
    $('.xywztejiaRight').click(function () {
        $('.head_title').text('治疗发布');
        $('.tejiaRight .li').empty();
        $('.tejiaLeft').hide();
        $('.tejiaRight').show();
        $('.xywztejiaLeft').css('color','#707070');
        $('.xywztejiaRight').css('color','#00afa1');
        Get.zhiliao();
    });
}
var Get = {
    zhenduan: function () {
        var url = SERVER_ADDR + '/app/danDanRelease/getDiagnosisList.json';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.zhenduanSuccess, '请求失败', 'GET', true, undefined);
    },
    zhenduanSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            retInfo.data.forEach(function (value) {
                $('.tejiaLeft .li').append('<p illid="'+value.id+'" onclick="zhenduanhref(this)">'+value.illName+'</p>');
            })
        } else {
            alert(retInfo.data);
        }
    },
    zhiliao: function () {
        var url = SERVER_ADDR + '/app/danDanRelease/getIllList.json';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.zhiliaoSuccess, '请求失败', 'GET', true, undefined);
    },
    zhiliaoSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            retInfo.data.forEach(function (value) {
                $('.tejiaRight .li').append('<p illid="'+value.id+'" onclick="zhiliaohref(this)">'+value.illName+'</p>');
            })
        } else {
            alert(retInfo.data);
        }
    }
}
function zhenduanhref(obj) {
    window.location.href = 'dd_content.html?id=' + $(obj).attr('illid')+'&name='+ $(obj).text()+'&type=1';
}
function zhiliaohref(obj) {
    window.location.href = 'dd_content.html?id=' + $(obj).attr('illid')+'&name='+ $(obj).text()+'&type=2';
}