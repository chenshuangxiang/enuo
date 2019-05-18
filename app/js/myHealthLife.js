function init() {
    $('.smoke').click(function () { //抽烟选项
        $('.smoke').removeClass('smokeActive');
        $(this).addClass('smokeActive');
    });
    $('.yinjiu').click(function () { //饮酒选项
        $('.yinjiu').removeClass('yinjiuActive');
        $(this).addClass('yinjiuActive');
    });
    $('.shuimian').click(function () { //睡眠选项
        $('.shuimian').removeClass('shuimianActive');
        $(this).addClass('shuimianActive');
    });
    $('.duanlian').click(function () { //锻炼选项
        $('.duanlian').removeClass('duanlianActive');
        $(this).addClass('duanlianActive');
    });
    $('.have').click(function () {  //有无选项
          $('.have').removeClass('haveActive');
          $(this).addClass('haveActive');
    });
    $('.haveYali').click(function () { //压力选项
        if($(this).hasClass('haveYaliActive') == true){
            $(this).removeClass('haveYaliActive');
            if($(this).text() == '其他'){
                $('.qitaYali').hide();
            }
        }else{
            $(this).addClass('haveYaliActive');
            if($(this).text() == '其他'){
                $('.qitaYali').show();
            }
        }
    })
    $('.yinshi').click(function () { //饮食选项
        if($(this).hasClass('yinshiActive') == true){
            $(this).removeClass('yinshiActive');
        }else{
            $(this).addClass('yinshiActive');
        }
    })
    Go.userPersonalLife();
}
var Go = {
    userPersonalLife:function () {
        var url = SERVER_ADDR + '/app/user/userPersonalLife';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.userPersonalLifeSuccess, '请求失败', 'GET', true, undefined);
    },
    userPersonalLifeSuccess: function (res) {
        if (res.success == true) {
            //$('#sel_city').val(res.data.provinceName + ' ' + res.data.cityName + ' ' + res.data.areaName);
            //$('.userName').val(res.data.fullname)
            //$('#bornDate').val(new Date(res.data.birthday).Format('yyyy-MM-dd'))
        } else {
            if(res.data != '无法获取此用户个人基本信息'){
                alert(res.data);
            }
        }
    },
    addUserPersonalLife:function () {
        var url = SERVER_ADDR + '/app/user/edit/userPersonalInformation';
        var Data = {};
        Data.smoking = $('.smokeActive').text();
        if($('.smokeActive').text() == '吸烟'){
            Data.daySmokingAvgCount = $('.daySmokingAvgCount').val();
            Data.startSmokingAge = $('.startSmokingAge').val();
        }else if($('.smokeActive').text() == '已戒烟'){
            Data.daySmokingAvgCount = $('.daySmokingAvgCount').val();
            Data.startSmokingAge = $('.startSmokingAge').val();
            Data.stopSmokingAge = $('.stopSmokingAge').val();
        }
        Data.drinking = $('.yinjiuActive').val();
        Data.exerciseSituation = $('.duanlianActive').val();
        Data.lifestyle = $('.lifestyle').val();
        if($('.haveActive').text() == '有'){
            var stressSituationList = [];
            $('.haveYaliActive').each(function (index,value) {
                stressSituationList.push(value.innerText);
            });
            if($('.qitaYali').val() != ''){
                stressSituationList.push($('.qitaYali').val())
            }
            Data.stressSituation = stressSituationList.join("|");
        }else{
            Data.stressSituation = '';
        }
        var eatingHabitsList = [];
        $('.yinshiActive').each(function (index,value) {
            eatingHabitsList.push(value.innerText);
        });
        Data.eatingHabits = eatingHabitsList.join("|");
        Data.sleepSituation = $('.shuimianActive').val();
        ajaxGetRetInfo(url, Data, this.addUserPersonalLifeSuccess, '请求失败', 'POST', true, undefined);
    },
    addUserPersonalLifeSuccess: function (res) {
        if (res.success == true) {
            alert('提交成功');
            window.location.reload();
        } else {
            alert(res.data);
        }
    }
}
