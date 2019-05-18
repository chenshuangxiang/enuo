//医生作息规则:日，一，二，三，四，五，六..顺序
//var arr_work_mg = [["休息","休息"],["坐诊","休息"],["坐诊","坐诊"],["休息","坐诊"],["休息","坐诊"],["坐诊","坐诊"],["休息","休息"]];//
var arr_work_mg = [];

//根据医生坐诊规则和当前日期得到本周的坐诊数据
function get_arr_work(arrParam,dt){
    var arr_num = getAllWeekNum(dt);//得到本周每个周天代表的数字
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
    var arr_work = get_arr_work(m,d);
    var i=0;
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
    });
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

//得到当前本周的所有的周天的数字
function getAllWeekNum(date){
    var arr_week = [];//本周数组
    for(var i=0;i<7;i++){
        var nextDate  = new Date(date.getTime() + 24*60*60*1000*i);
//			console.log(nextDate);

//			var week= getWeek(nextDate);//获取当前周天
        arr_week.push(nextDate.getDay());
    }
//		console.log(arr_week);
    return arr_week;
}

//得到当前本周的所有的周天文字
function getAllWeek(date){
    var arr_week = [];//本周数组
    for(var i=0;i<7;i++){
        var nextDate  = new Date(date.getTime() + 24*60*60*1000*i);
//			console.log(nextDate);

        var week= getWeek(nextDate);//获取当前周天
        arr_week.push(week);
    }
    return arr_week;
}


//得到当前本周的所有的月日
function getAllday(date){
    var arr_MonthDate=[];//月日
    for(var i=0;i<7;i++){
        var nextDate  = new Date(date.getTime() + 24*60*60*1000*i);
//			console.log(nextDate);

        var monthDate = getMonthDate(nextDate);//获取当前月日
        arr_MonthDate.push(monthDate);
    }
    return arr_MonthDate;
}

//	初始化日历到div页面
function initCalendar(arr_week,arr_MonthDate){
    var z=0;
//		console.log($(".week .day"));
    $(".week .day").each(function(){
        $(this).children("span").each(function(){
//				console.log($(this).index());
            if($(this).index()==0){
//					console.log("我是周");
                $(this).text(arr_week[z]);
            }
            if($(this).index()==2){
//					console.log("我是月日");
                $(this).text(arr_MonthDate[z]);
            }
        });
        z++;
    });
}

//周日历
function currentCalendar(curDate){
    var arr_week = getAllWeek(curDate);//得到本周全部周天
    var arr_monthDate = getAllday(curDate);//得到本周全部月日
    console.log(arr_week);
    console.log(arr_monthDate);
    //初始化本周日历
    initCalendar(arr_week,arr_monthDate);
}

//下一周
function next_week(){
    flag++;
    $('.activeDiv').children('span').removeClass('activeDivspanActive');
    $('.daymm').removeClass('yuyueActive');
    if(flag==3){
        flag=2;
    }
    switch (flag){
        case 1:
            $('.activeDiv').children('span').eq(1).addClass('activeDivspanActive');
            break;
        case 2:
            $('.activeDiv').children('span').eq(2).addClass('activeDivspanActive');
            break;
    }
    console.log(flag);
    var nextDate  = new Date(curDate.getTime() + 24*60*60*1000*7*flag); //当前日期的第七天后
    currentCalendar(nextDate);//初始化日历
    init_work_tb(arr_work_mg,nextDate);//初始化坐诊

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
        case 1:
            $('.activeDiv').children('span').eq(1).addClass('activeDivspanActive');
            break;
        case 0:
            $('.activeDiv').children('span').eq(0).addClass('activeDivspanActive');
            break;
    }
    console.log(flag);
    var nextDate  = new Date(curDate.getTime() + 24*60*60*1000*7*flag); //当前日期的第七天后
    currentCalendar(nextDate);//初始化日历
    init_work_tb(arr_work_mg,nextDate);//初始化坐诊
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
            next_week()
            break;
        case 4:
            //alert("向右！")
            up_week();

            break;
        default:
    }
}, false);

function init() {
    Get.GetReservationInfo();
    $('.daymm').click(function () {
         if( !$(this).attr('disabled')){
            $('.daymm').removeClass('yuyueActive');
            $(this).addClass('yuyueActive');
        }
    })
}
var Get = {
    GetReservationInfo:function () {
            var url = SERVER_ADDR + '/app/topthree/doctor/getReservationInfo.json';
            var Data = {};
            Data.id = getQueryString('docId');
            ajaxGetRetInfo(url, Data, this.getReservationInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    getReservationInfoSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            $('.hosName').text(retInfo.data.hospitalName);
            $('.docName').text(retInfo.data.name);
            $('.docLevel').text(retInfo.data.doctorTypeName);
            $('.docSub').text(retInfo.data.subjectName);
            $('.docSubSub').text(retInfo.data.subSubjectName);
            $('.shanchang').text(retInfo.data.specialty);
            arr_work_mg.push(retInfo.data.workPlan);
            arr_work_mg = arr_work_mg[0]
            console.log(arr_work_mg)
            arr_work_mg = [["休息","休息"],["坐诊","休息"],["坐诊","坐诊"],["休息","坐诊"],["休息","坐诊"],["坐诊","坐诊"],["休息","休息"]];//
             flag = 0;
             curDate = new Date();//今天
            currentCalendar(curDate);//初始化日历
            init_work_tb(arr_work_mg,curDate);//初始化坐诊
        }else{
            alert(retInfo.data)
        }
    },
}
/*预约*/
var Btn = {
    yuyue:function () {
        if($('.yuyueActive').attr('class') == undefined){
           alert('请选择预约时间');
           return
        }
        var url = SERVER_ADDR + '/app/user/reservation';
        var Data = {};
        var year = '2017';
        if($('.yuyueActive').parent().find('.daytime').text().split('.')[0] < new Date().getMonth()+1){
             year = new Date().getFullYear() + 1
        }else{
             year = new Date().getFullYear();
        }
        var date = year + '-' +  $('.yuyueActive').parent().find('.daytime').text().split('.')[0] + '-' + $('.yuyueActive').parent().find('.daytime').text().split('.')[1];
        Data.fkId = getQueryString('docId');
        Data.reservationDate = date;
        Data.isMorning = $('.yuyueActive').attr('class').split(' ')[0] == 'am' ?  true : false;
        Data.type = 'topThree';
        ajaxGetRetInfo(url, Data, this.yuyueSuccess, '请求失败', 'POST', true, undefined);
    },
    yuyueSuccess:function (retInfo) {
        console.log(retInfo)
        /*retInfo = JSON.parse(retInfo);*/
        if(retInfo.success == true){
           //跳转
            console.log('跳转');
            window.location.href = 'my_yuyue.html';
        }else{
            alert(retInfo.data)
        }
    },
}