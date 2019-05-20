//医生作息规则:日，一，二，三，四，五，六..顺序
//var arr_work_mg = [["休息","休息"],["坐诊","休息"],["坐诊","坐诊"],["休息","坐诊"],["休息","坐诊"],["坐诊","坐诊"],["休息","休息"]];//
var arr_work_mg = [];
var arr_work;
var date_List = [];
var week_List = [];
var specail;
//根据医生坐诊规则和当前日期得到本周的坐诊数据
function get_arr_work(arrParam,dt){
    var arr_num = getAllWeekNum(dt);//得到本周每个周天代表的数字
    console.log(arr_num)
    var str1=[];
    for(var i=0;i<arrParam.length;i++){
        var k=arr_num[i];
        var wk = arrParam[k];//根据当前数字得到当天作息
        str1.push(wk);
    }
//		console.log(str1);////[["休息","坐诊"]，，，，，]从周日开始
    return str1;
}

//初始化坐诊表格
function init_work_tb(m,d){
//		console.log(d);
    //得到坐诊数据
    console.log(get_arr_work(m,d))
    arr_work = get_arr_work(m,d);

}


//获取当前月日
function getMonthDate(date){
    var monthDate = (date.getMonth()+1)+"."+date.getDate();
//		console.log(monthDate);
    return monthDate;
}
//获取当前周天
function getWeek(date){
    var arr_day = ["周天","周一","周二","周三","周四","周五","周六"];
    var week = arr_day[date.getDay()];
//		console.log(week);
    return week;
}
function getWeekEnglish(date) {
    var arr_day = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    var week = arr_day[date.getDay()];
//		console.log(week);
    return week;
}
//得到当前本周的所有的周天的数字
function getAllWeekNum(date){
    var arr_week = [];//本周数组
    for(var i=0;i<14;i++){
        var nextDate  = new Date(date.getTime() + 24*60*60*1000*i);

//			var week= getWeek(nextDate);//获取当前周天
        arr_week.push(nextDate.getDay());
    }
//		console.log(arr_week);
    return arr_week;
}

//得到当前本周的所有的周天文字
function getAllWeek(date){
    var arr_week = [];//本周数组
    week_List.length = 0;
    for(var i=0;i<7;i++){
        var nextDate  = new Date(date.getTime() + 24*60*60*1000*i);
//			console.log(nextDate);

        var week= getWeek(nextDate);//获取当前周天
        arr_week.push(week);
        var weekEnglish= getWeekEnglish(nextDate);//获取当前周天
        week_List.push(weekEnglish)
    }
    return arr_week;
}


//得到当前本周的所有的月日
function getAllday(date){
    var arr_MonthDate=[];//月日
    date_List.length = 0;
    for(var i=0;i<7;i++){
        var nextDate  = new Date(date.getTime() + 24*60*60*1000*i);
			///console.log(nextDate.Format('yyyy-MM-dd'));
        date_List.push(nextDate.Format('yyyy-MM-dd'))

        var monthDate = getMonthDate(nextDate);//获取当前月日
        arr_MonthDate.push(monthDate);
    }
    return arr_MonthDate;
}

//	初始化日历到div页面
function initCalendar(arr_MonthDate){
    var z=0;
    var arr_MonthDateSplit = [];
    arr_MonthDate.forEach(function (value) {
        arr_MonthDateSplit.push(value.split('-')[1] + '.' + value.split('-')[2]);
    })
//		console.log($(".week .day"));
    $(".week .day").each(function(){
        $(this).children("span").each(function(){
            if($(this).index()==2){
                $(this).attr('class','daytime')
                $(this).text(arr_MonthDateSplit[z]).addClass('date'+arr_MonthDateSplit[z]);
            }
        });
        z++;
    });
}

//周日历
/*function currentCalendar(curDate){
    var arr_week = getAllWeek(curDate);//得到本周全部周天
    var arr_monthDate = getAllday(curDate);//得到本周全部月日
    //var arr_monthDate = getAllday(curDate);//得到本周全部月日
    console.log(arr_week);
    console.log(arr_monthDate);
    //初始化本周日历
    initCalendar(arr_week,arr_monthDate);
}*/

//下一周
function next_week(){
    flag++;
    $('.activeDiv').children('span').removeClass('activeDivspanActive');
    $('.daymm').removeClass('yuyueActive');
    if(flag==4){
        flag=3;
    }
    switch (flag){
        case 1:
            $('.activeDiv').children('span').eq(1).addClass('activeDivspanActive');
            break;
        case 2:
            $('.activeDiv').children('span').eq(2).addClass('activeDivspanActive');
            break;
        case 3:
            $('.activeDiv').children('span').eq(3).addClass('activeDivspanActive');
            break;
    }
    console.log(flag);
    var nextDate  = new Date(curDate.getTime() + 24*60*60*1000*7*flag); //当前日期的第七天后
    //currentCalendar(nextDate);//初始化日历
    //init_work_tb(arr_work_mg,nextDate);//初始化坐诊
    switch ($('span.activeDivspanActive').index()){
        case 1:
            Get.GetReservationYuyue(new Date(new Date().getTime() - 24*60*60*1000*14).Format('yyyy-MM-dd'))
            break;
        case 2:
            Get.GetReservationYuyue(new Date(new Date().getTime() - 24*60*60*1000*7).Format('yyyy-MM-dd'))
            break;
        case 3:
            Get.GetReservationYuyue(new Date(new Date().getTime()).Format('yyyy-MM-dd'))
            break;
    }
}
//上一周
function up_week(){
    flag--;
    $('.activeDiv').children('span').removeClass('activeDivspanActive');
    $('.daymm').removeClass('yuyueActive');
    if(flag<=0){
        flag=0;
    }
    switch (flag){
        case 2:
            $('.activeDiv').children('span').eq(2).addClass('activeDivspanActive');
            break;
        case 1:
            $('.activeDiv').children('span').eq(1).addClass('activeDivspanActive');
            break;
        case 0:
            $('.activeDiv').children('span').eq(0).addClass('activeDivspanActive');
            break;
    }
    console.log(flag);
    var nextDate  = new Date(curDate.getTime() + 24*60*60*1000*7*flag); //当前日期的第七天后
    //currentCalendar(nextDate);//初始化日历
    //init_work_tb(arr_work_mg,nextDate);//初始化坐诊
    switch ($('span.activeDivspanActive').index()){
        case 0:
            Get.GetReservationYuyue(new Date(new Date().getTime() - 24*60*60*1000*20).Format('yyyy-MM-dd'))
            break;
        case 1:
            Get.GetReservationYuyue(new Date(new Date().getTime() - 24*60*60*1000*14).Format('yyyy-MM-dd'))
            break;
        case 2:
            Get.GetReservationYuyue(new Date(new Date().getTime() - 24*60*60*1000*7).Format('yyyy-MM-dd'))
            break;
    }
}
var flag;
var curDate;//今天
/*currentCalendar(curDate);//初始化日历
init_work_tb(arr_work_mg,curDate);//初始化坐诊*/

//判断滑动
var startx, starty;
//获得角度
function getAngle(angx, angy) {
    return Math.atan2(angy, angx) * 180 / Math.PI;
}

//根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
function getDirection(startx, starty, endx, endy) {
    var angx = endx - startx;
    var angy = endy - starty;
    var result = 0;
    console.log(angx,angy)
    //如果滑动距离太短
    if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
        return result;
    }

    var angle = getAngle(angx, angy);
    /*if (angle >= -135 && angle <= -45) {
        result = 1;
    } else if (angle > 45 && angle < 135) {
        result = 2;
    } else */if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
        result = 3;
    } else if (angle >= -45 && angle <= 45) {
        result = 4;
    }

    return result;
}
//手指接触屏幕
document.getElementById("myYuyue").addEventListener("touchstart", function(e) {
    startx = e.touches[0].pageX;
    starty = e.touches[0].pageY;
}, false);
//手指离开屏幕
document.getElementById("myYuyue").addEventListener("touchend", function(e) {
    var endx, endy;
    endx = e.changedTouches[0].pageX;
    endy = e.changedTouches[0].pageY;
    var direction = getDirection(startx, starty, endx, endy);
    console.log(direction)
    switch (direction) {
       /* case 0:
            alert("未滑动！");
            break;
        case 1:
            alert("向上！")
            break;
        case 2:
            alert("向下！")
            break;*/
        case 3:
            //alert("向左！")
            if($('span.activeDivspanActive').index() >= 0&& $('span.activeDivspanActive').index() < 3){
                next_week()
            }
            break;
        case 4:
            //alert("向右！")
            if($('span.activeDivspanActive').index() > 0 && $('span.activeDivspanActive').index() <= 3){
                up_week();
            }
            break;
        default:
    }
}, false);

function initer() {
    $('.nowday').text(new Date().Format('yyyy-MM-dd'));
    flag = 3;
    curDate = new Date()//new Date();//今天
    Get.GetReservationYuyue(new Date().Format('yyyy-MM-dd'));

}

var Get = {
    GetReservationYuyue:function (time) { //排班表
        if(getQueryString('type') == 'advisory'){
            var url = SERVER_ADDR + '/salesman/advisory/week/advisoryAmount';
        }else if(getQueryString('type') == 'coupon'){
            $('.toptitle').text('体验券销售量统计');
            var url = SERVER_ADDR + '/salesman/coupon/week/sellAmount';
        }
        var Data = {};
        Data.date = time;
        ajaxGetRetInfo(url, Data, this.getReservationYuyueSuccess, '请求失败', 'GET', true, undefined);
    },
    getReservationYuyueSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            initCalendar(retInfo.data.days);//初始化日历
            $('.salenameP,.daymm').remove();
            retInfo.data.salesmanNames.forEach(function (value,index) {
                var totle = 0;
                retInfo.data.amount[index].forEach(function (val) {
                    totle += val;
                })
                $('.weekname').append('<p class="salenameP" style="line-height: 1rem;">'+value+ '' +totle+'</p>');
                $('.week1').append('<p class="daymm day1"></p>');
                $('.week2').append('<p class="daymm day2"></p>');
                $('.week3').append('<p class="daymm day3"></p>');
                $('.week4').append('<p class="daymm day4"></p>');
                $('.week5').append('<p class="daymm day5"></p>');
                $('.week6').append('<p class="daymm day6"></p>');
                $('.week7').append('<p class="daymm day7"></p>');
            });
            arr_work_mg.length = 0;
            arr_work_mg.push(retInfo.data.amount);
            arr_work_mg = arr_work_mg[0]
            for(var i=0;i<7;i++){
                $('.day'+(i+1)).each(function (index,value) {
                    // console.log(index,value)
                    $(this).text(arr_work_mg[index][i]);
                });
            }
           /* $('.day1').each(function (index,value) {
               // console.log(index,value)
                $(this).text(arr_work_mg[index][0]);
            });
            $('.day2').each(function (index,value) {
                //console.log(index,value)
                $(this).text(arr_work_mg[index][1]);
            });
            $('.day3').each(function (index,value) {
                console.log(index,value)
                $(this).text(arr_work_mg[index][2]);
            });*/
            /*flag = 0;
            curDate = new Date()//new Date();//今天
            currentCalendar(curDate);//初始化日历*/
            //init_work_tb(arr_work_mg,curDate);//初始化坐诊
           /* arr_work_mg.forEach(function (value) {  //遍历座诊表
                if(value.isMorning == true){ //上午
                    var am = $('.date'+value.week).parent().next('.am');
                    if(value.reservationQuantity > 0){
                        am.text('预约');
                    }else{
                        am.attr('disabled',true);
                    }
                    am.attr('count',value.reservationQuantity);
                }else{//下午
                    var pm = $('.date'+value.week).parent().next().next('.pm');
                    if(value.reservationQuantity > 0){
                        pm.text('预约');
                    }else{
                        pm.attr('disabled',true);
                    }
                    pm.attr('count',value.reservationQuantity);
                }
            })*/
         /*   var i=0;
            $(".week").each(function(){
                var k=0;
                $(this).children("p").each(function(){
                    if($(this).index()>0){
                        //				console.log("i:"+i+",,,k:"+k);
                        if(arr_work[i][k] != '休息'){
                            $(this).text(arr_work[i][k]);
                        }else{
                            $(this).attr('disabled',true)
                        }
                        //$(this).text(arr_work[i][k]);

                        k++;
                    }
                });
                i++;
            });*/
        /* if(retInfo.data.reservationInfo && retInfo.data.reservationInfo.length > 0){
             retInfo.data.reservationInfo.forEach(function (value) {
                 console.log(value.date)
                 if(value.isMorning == true){ //上午
                     var am = $('.date'+value.date).parent().next('.am');
                     var resultQuantity = Number(am.attr('count')) - Number(value.quantity);
                     if(resultQuantity > 0){
                         am.text('预约');
                     }else{
                         am.text('约满').attr('disabled',true).css('background-color','#eeeeee');
                     }
                 }else{
                     var pm = $('.date'+value.date).parent().next().next('.pm');
                     var resultQuantity = Number(pm.attr('count')) - Number(value.quantity);
                     if(resultQuantity > 0){
                         pm.text('预约');
                     }else{
                         pm.text('约满').attr('disabled',true).css('background-color','#eeeeee');
                     }
                 }

             })
         }*/
        }else{
            alert(retInfo.data);
        }
    }
}
