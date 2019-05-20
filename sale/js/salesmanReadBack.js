
function init() {
    // activeDate 月     activeDateDay 日
    $('.nowDay').text(new Date().Format('MM月dd日') + ' >');
    $('.nowDayDiv').addClass('activeDateDay');
    $('.nowDaySpan').text(new Date().Format('dd'));
    //计算三天的弹窗 关键在第二天
    var twoday;
    if(new Date().Format('dd') > 1){ //今天大于1号
        twoday = new Date().Format('dd') - 1;
    }else{ //今天是1号
        twoday = getCountDays(); //上个月的最后一号
    }
    if(twoday >= 10){ //第二天减了之后大于10号的
        $('.twoDaySpan').text(twoday);
    }else{
        $('.twoDaySpan').text('0' + twoday);
    }
    var oneday;
    if(twoday > 1){ //今天大于1号
        oneday = twoday - 1;
    }else{ //今天是1号
        oneday = getCountDays(); //上个月的最后一号
    }
    if(oneday >= 10){ //第一天减了之后大于10号的
        $('.oneDaySpan').text(oneday);
    }else{
        $('.oneDaySpan').text('0' + oneday);
    }

    $('.dateP').each(function (value) {
        if($(this).text() == new Date().Format('MM')){
            $(this).addClass('activeDate');
        }
    });
    Get.nowDayInfo(new Date().Format('yyyy-MM-dd'));
    Get.nowMonthInfo(new Date().Format('yyyy-MM-dd'));
    $('.dateP').click(function () {
        $('.dateP').removeClass('activeDate');
        $(this).addClass('activeDate');
    });
    $('.datePDay').click(function () {
        $('.datePDay').removeClass('activeDateDay');
        $(this).addClass('activeDateDay');
    })
}
var Get = {
    nowDayInfo: function (date) {
        var url = SERVER_ADDR + '/salesman/advisory/repulseRate';
        var Data = {};
        Data.date = date;
        Data.isMonth = false;
        ajaxGetRetInfo(url, Data, this.nowDayInfoSuccess, '请求失败', 'POST', true, undefined);
    },
    nowDayInfoSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            $('.nowDayadvisorys').text(retInfo.data[0].advisorys);
            $('.nowDayrepulse').text(retInfo.data[0].repulse);
            $('.nowDayrepulseRate').text(retInfo.data[0].repulseRate);
            if(retInfo.data[0].repulseRate.split('%')[0] > 50){
                $('.nowDayrepulseRate').css('color','red');
            }else{
                $('.nowDayrepulseRate').css('color','black');
            }
        } else {
            alert(retInfo.data);
        }
    },
    nowMonthInfo: function (date) {
        var url = SERVER_ADDR + '/salesman/advisory/repulseRate';
        var Data = {};
        Data.date = date;
        Data.isMonth = true;
        ajaxGetRetInfo(url, Data, this.nowMonthInfoSuccess, '请求失败', 'POST', true, undefined);
    },
    nowMonthInfoSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            $('.nowMonthadvisorys').text(retInfo.data[0].advisorys);
            $('.nowMonthrepulse').text(retInfo.data[0].repulse);
            $('.nowMonthrepulseRate').text(retInfo.data[0].repulseRate);
            if(retInfo.data[0].repulseRate.split('%')[0] > 50){
                $('.nowMonthrepulseRate').css('color','red');
            }else{
                $('.nowMonthrepulseRate').css('color','black');
            }
        } else {
            alert(retInfo.data);
        }
    },
    getChooseMonth:function () {
        $('.nowMonth').text($('.activeDate').text() + '月 >');
        $('.monthDiv').hide();
        Get.nowMonthInfo(new Date().getFullYear() + '-' + $('.activeDate').text() + '-01');
    },
    getChooseDay:function () {
       /* if($('.activeDateDay span').text() >= 10){*/
            if($('.activeDateDay span').text() > new Date().Format('dd')) { //选了上个月了
                $('.nowDay').text( new Date().getMonth() + '月' + $('.activeDateDay span').text() + '日' + ' >');
                Get.nowDayInfo(new Date().Format('yyyy') + '-' +  new Date().getMonth() + '-' + $('.activeDateDay span').text());
            }else{
                $('.nowDay').text(new Date().Format('MM月') + $('.activeDateDay span').text() + '日' + ' >');
                Get.nowDayInfo(new Date().Format('yyyy-MM')  + '-' + $('.activeDateDay span').text());
            }
        /*}else{
                $('.nowDay').text(new Date().Format('MM月') + '0' + $('.activeDateDay span').text() + '日');
                Get.nowDayInfo(new Date().Format('yyyy-MM')  + '-0' + $('.activeDateDay span').text());
        }*/
        $('.dayDiv').hide();

    }
}
function getCountDays() {  //上个月的天数
    var curDate = new Date();
    /* 获取当前月份 */
    var curMonth = curDate.getMonth();
    /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
    curDate.setMonth(curMonth);
    /* 将日期设置为0 */
    curDate.setDate(0);
    /* 返回当月的天数 */
    return curDate.getDate();
}