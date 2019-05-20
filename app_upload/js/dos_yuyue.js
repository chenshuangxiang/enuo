//医生作息规则:日，一，二，三，四，五，六..顺序
//var arr_work_mg = [["休息","休息"],["坐诊","休息"],["坐诊","坐诊"],["休息","坐诊"],["休息","坐诊"],["坐诊","坐诊"],["休息","休息"]];//
var arr_work_mg = [];
var arr_work;
var date_List = [];
var week_List = [];
var tolatitude;
var tolongitude;
var toname;
var toaddress;
var specail;
//地址
var nameEl = document.getElementById('sel_city');
var first = []; /* 省，直辖市 */
var second = []; /* 市 */
var third = []; /* 镇 */
var firstName = ''; /* 省，直辖市 */
var secondName = ''; /* 市 */
var thirdName = ''; /* 镇 */
var chooseList = [];
var selectedIndex = [0,0,0]; /* 默认选中的地区 */
var checked = [0, 0, 0]; /* 已选选项 */
nameEl = document.getElementById('sel_city');
first = []; /* 省，直辖市 */
second = []; /* 市 */
third = []; /* 镇 */
firstName = ''; /* 省，直辖市 */
secondName = ''; /* 市 */
thirdName = ''; /* 镇 */
chooseList = [];
selectedIndex = [0,0,0]; /* 默认选中的地区 */
checked = [0, 0, 0]; /* 已选选项 */
function creatList(obj, list){
    obj.forEach(function(item, index, arr){
        var temp = new Object();
        temp.text = item.name;
        temp.value = index;
        list.push(temp);
    })
}
creatList(city, first);
if (city[selectedIndex[0]].hasOwnProperty('sub')) {
    creatList(city[selectedIndex[0]].sub, second);
} else {
    second = [{text: '', value: 0}];
}
if (city[selectedIndex[0]].sub[selectedIndex[1]].hasOwnProperty('sub')) {
    creatList(city[selectedIndex[0]].sub[selectedIndex[1]].sub, third);
} else {
    third = [{text: '', value: 0}];
}
var picker = new Picker({
    data: [first, second, third],
    selectedIndex: selectedIndex,
    title: ''//地址选择
});
picker.on('picker.select', function (selectedVal, selectedIndex) {
    var text1 = first[selectedIndex[0]].text;
    var text2 = second[selectedIndex[1]].text;
    var text3 = third[selectedIndex[2]] ? third[selectedIndex[2]].text : '';
    nameEl.value = text1 + ' ' + text2 + ' ' + text3;
    firstName = text1; /* 省，直辖市 */
    secondName = text2; /* 市 */
    thirdName = text3; /* 镇 */
});

picker.on('picker.change', function (index, selectedIndex) {
    if (index === 0){
        firstChange();
    } else if (index === 1) {
        secondChange();
    }

    function firstChange() {
        second = [];
        third = [];
        checked[0] = selectedIndex;
        var firstCity = city[selectedIndex];
        if (firstCity.hasOwnProperty('sub')) {
            creatList(firstCity.sub, second);

            var secondCity = city[selectedIndex].sub[0]
            if (secondCity.hasOwnProperty('sub')) {
                creatList(secondCity.sub, third);
            } else {
                third = [{text: '', value: 0}];
                checked[2] = 0;
            }
        } else {
            second = [{text: '', value: 0}];
            third = [{text: '', value: 0}];
            checked[1] = 0;
            checked[2] = 0;
        }

        picker.refillColumn(1, second);
        picker.refillColumn(2, third);
        picker.scrollColumn(1, 0)
        picker.scrollColumn(2, 0)
    }

    function secondChange() {
        third = [];
        checked[1] = selectedIndex;
        var first_index = checked[0];
        if (city[first_index].sub[selectedIndex].hasOwnProperty('sub')) {
            var secondCity = city[first_index].sub[selectedIndex];
            creatList(secondCity.sub, third);
            picker.refillColumn(2, third);
            picker.scrollColumn(2, 0)
        } else {
            third = [{text: '', value: 0}];
            checked[2] = 0;
            picker.refillColumn(2, third);
            picker.scrollColumn(2, 0)
        }
    }

});
picker.on('picker.valuechange', function (selectedVal, selectedIndex) {
    console.log(selectedVal); //数组值
    console.log(selectedIndex);
    chooseList = selectedVal;
});

nameEl.addEventListener('click', function () {
    picker.show();
});
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
function initCalendar(arr_week,arr_MonthDate){
    var z=0;
//		console.log($(".week .day"));
    $(".week .day").each(function(){
        $(this).children("span").each(function(){
//				console.log($(this).index());
            if($(this).index()==0){
//					console.log("我是周");
                $(this).attr('class','dayzhou')
                $(this).text(arr_week[z]).addClass('date'+week_List[z]);
            }
            if($(this).index()==2){
//					console.log("我是月日");
              /*  console.log(arr_MonthDate)*/
                $(this).attr('class','daytime')
                $(this).text(arr_MonthDate[z]).addClass('date'+date_List[z]);
            }
        });
        z++;
    });
}

//周日历
function currentCalendar(curDate){
    var arr_week = getAllWeek(curDate);//得到本周全部周天
    var arr_monthDate = getAllday(curDate);//得到本周全部月日
    //var arr_monthDate = getAllday(curDate);//得到本周全部月日
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
    //init_work_tb(arr_work_mg,nextDate);//初始化坐诊
    switch ($('span.activeDivspanActive').index()){
        case 1:
            Get.GetReservationYuyue(new Date(new Date().getTime() + 24*60*60*1000*7).Format('yyyy-MM-dd'))
            break;
        case 2:
            Get.GetReservationYuyue(new Date(new Date().getTime() + 24*60*60*1000*14).Format('yyyy-MM-dd'))
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
    //init_work_tb(arr_work_mg,nextDate);//初始化坐诊
    switch ($('span.activeDivspanActive').index()){
        case 0:
            Get.GetReservationYuyue(new Date().Format('yyyy-MM-dd'))
            break;
        case 1:
            Get.GetReservationYuyue(new Date(new Date().getTime() + 24*60*60*1000*7).Format('yyyy-MM-dd'))
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
            if($('span.activeDivspanActive').index() >= 0&& $('span.activeDivspanActive').index() < 2){
                next_week()
            }
            break;
        case 4:
            //alert("向右！")
            if($('span.activeDivspanActive').index() > 0 && $('span.activeDivspanActive').index() <= 2){
                up_week();
            }
            break;
        default:
    }
}, false);

function initer() {
    $('.nowday').text(new Date().Format('yyyy-MM-dd'));
    $('.mubu,.closeopen').click(function () {
        $('.modelOpen').hide();
    })
    //根据type判断哪些需要显示
    switch (getQueryString('type')){
        case 'doctor':
            $('.doctorDiv').show();
            $('.yuyuetitle').text('坐诊表');
            Get.GetReservationInfo();
            break;
        case 'project':
            $('.goodDiv').hide();
            $('.projectDiv').show();
            $('.lefttop').text('');
            $('.yuyuetitle').text('日期表')
            Get.GetProjectInfo();
            break;
        case 'product':
            $('.goodDiv').hide();
            $('.productDiv').show();
            $('.lefttop').text('');
            $('.yuyuetitle').text('日期表');
            //$('.pub_hearder_left').attr('onclick','window.location.href = "../order.html"');
            Get.GetProductInfo();
            break;
        case 'coupon':
            $('.goodDiv').hide();
            $('.couponDiv').show();
            $('.lefttop').text('');
            $('.yuyuetitle').text('日期表')
            Get.GetCouponInfo();
            break;
        case 'nursingCard':
            $('.goodDiv').hide();
            $('.productDiv').show();
            $('.lefttop').text('');
            $('.yuyuetitle').text('日期表');
            //$('.pub_hearder_left').attr('onclick','window.location.href = "../order.html"');
            Get.GetProductInfo();
            break;
        case 'health_supervisor':
            $('.goodDiv').hide();
            $('.healthDiv').show();
            $('.lefttop').text('');
            $('.yuyuetitle').text('日期表');
            //$('.pub_hearder_left').attr('onclick','window.location.href = "../order.html"');
            //Get.GetProductInfo();
            break;
    }
    $('.daymm').click(function () {
         if( !$(this).attr('disabled')){
            $('.daymm').removeClass('yuyueActive');
            $(this).addClass('yuyueActive');
        }
    });
    $('.hosDiv').click(function () {
        $(this).children('input').prop('checked',true)
    });
    flag = 0;
    curDate = new Date()//new Date();//今天
    currentCalendar(curDate);//初始化日历
    if(getQueryString('type') == 'nursingCard'){
        Get.GetReservationHuliCardYuyue(new Date().Format('yyyy-MM-dd'));
    }else{
        Get.GetReservationYuyue(new Date().Format('yyyy-MM-dd'));
    }
}

var Get = {
    GetReservationInfo:function () { //医生信息
            var url = SERVER_ADDR + '/app/doctor/getReservationInfo.json';
            var Data = {};
            Data.id = getQueryString('docId');
            Data.type = getQueryString('type');
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
            $('.docAddress').text(retInfo.data.address);
            tolatitude = retInfo.data.latitude;
            tolongitude = retInfo.data.longitude;
            toname = retInfo.data.hospitalName;
            toaddress = retInfo.data.address;
            /*arr_work_mg.push(retInfo.data.workPlan);
            arr_work_mg = arr_work_mg[0]
            console.log(arr_work_mg)
            arr_work_mg = [{"week":"monday","isMorning":true,"reservationQuantity":5},{"week":"tuesday","isMorning":true,"reservationQuantity":5},{"week":"wednesda","isMorning":true,"reservationQuantity":5},{"week":"thursday","isMorning":true,"reservationQuantity":5},{"week":"friday","isMorning":true,"reservationQuantity":5},{"week":"saturday","isMorning":true,"reservationQuantity":5},{"week":"sunday","isMorning":true,"reservationQuantity":5}];
             flag = 0;
             curDate = new Date(1514736000000)//new Date();//今天
            currentCalendar(curDate);//初始化日历
            init_work_tb(arr_work_mg,curDate);//初始化坐诊*/
        }else{
            alert(retInfo.data)
        }
    },
    GetCouponInfo:function () {  //体验券信息
        var url = SERVER_ADDR + '/app/user/experienceCoupon/getDetail.json';
        var Data = {};
        Data.id = getQueryString('docId');
        ajaxGetRetInfo(url, Data, this.GetCouponInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    GetCouponInfoSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            $('.couponSn').text(retInfo.data.sn);
            $('.couponSub').text(retInfo.data.experienceCouponName);
            $('.couponHos').text(retInfo.data.hospitalName);
            $('.couponAddress').text(retInfo.data.address);
            tolatitude = retInfo.data.latitude;
            tolongitude = retInfo.data.longitude;
            toname = retInfo.data.hospitalName;
            toaddress = retInfo.data.address;
        }else{
            alert(retInfo.data);
        }
    },
    GetProjectInfo:function () {  //医美信息
        var url = SERVER_ADDR + '/app/medical/beautyProject/getReservationInfo.json';
        var Data = {};
        Data.id = getQueryString('docId');
        ajaxGetRetInfo(url, Data, this.GetProjectInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    GetProjectInfoSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            $('.projectHosName').text(retInfo.data.hospitalName);
            $('.project').text(retInfo.data.name);
            $('.projectAddress').text(retInfo.data.address);
            tolatitude = retInfo.data.latitude;
            tolongitude = retInfo.data.longitude;
            toname = retInfo.data.hospitalName;
            toaddress = retInfo.data.address;
        }else{
            alert(retInfo.data);
        }
    },
    GetProductInfo:function () {  //特价信息
        var url = SERVER_ADDR + '/app/user/order/getProductReservationInfo.json';
        var Data = {};
        Data.orderId = getQueryString('docId');
        ajaxGetRetInfo(url, Data, this.GetProductInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    GetProductInfoSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            $('.productHosName').text(retInfo.data.hospitalName);
            if(getQueryString('type') == 'nursingCard'){
                if(getQueryString('typeForTooth') == 'toothWashing'){
                    $('.product').text('超声洁牙');
                }else if(getQueryString('typeForTooth') == 'toothExtraction'){
                    $('.product').text('普通拔牙');
                }else if(getQueryString('typeForTooth') == 'toothFilling'){
                    $('.product').text('玻璃离子补牙');
                }
            }
            else{
                $('.product').text(retInfo.data.name);
            }
            $('.productAddress').text(retInfo.data.address);
            specailGetId = retInfo.data.id;
            tolatitude = retInfo.data.latitude;
            tolongitude = retInfo.data.longitude;
            toname = retInfo.data.hospitalName;
            toaddress = retInfo.data.address;
        }else{
            alert(retInfo.data);
        }
    },
    GetReservationYuyue:function (time) { //排班表
        var url = SERVER_ADDR + '/app/reservation/getSchedule.json';
        var Data = {};
        if(getQueryString('type') == 'product'){
            Data.id = getQueryString('docId');//specailGetId;
        }else{
            Data.id = getQueryString('docId');
        }
        Data.beginDate = time;
        Data.type = getQueryString('type');
        ajaxGetRetInfo(url, Data, this.getReservationYuyueSuccess, '请求失败', 'GET', true, undefined);
    },

    GetReservationHuliCardYuyue: function (time) { //护理卡排班表
        var url = SERVER_ADDR + '/app/NursingCard/getReservation.json';
        var Data = {};
        Data.id = getQueryString('huliCardId');
        Data.beginDate = time;
        Data.type = getQueryString('type');
        Data.typeForTooth = getQueryString('typeForTooth');
        ajaxGetRetInfo(url, Data, this.getReservationYuyueSuccess, '请求失败', 'GET', true, undefined);
    },
    getReservationYuyueSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            arr_work_mg.length = 0;
            arr_work_mg.push(retInfo.data.schedules);
            arr_work_mg = arr_work_mg[0]
            console.log(arr_work_mg)
            /*flag = 0;
            curDate = new Date()//new Date();//今天
            currentCalendar(curDate);//初始化日历*/
            //init_work_tb(arr_work_mg,curDate);//初始化坐诊
            arr_work_mg.forEach(function (value) {  //遍历座诊表
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
            })
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
         if(retInfo.data.reservationInfo && retInfo.data.reservationInfo.length > 0){
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
         }
            if(retInfo.data.schedules.length == 0){
                $('.daymm').attr('disabled',true).css('background-color','#eeeeee');
            }
        }else{
            alert(retInfo.data);
            $('.daymm').attr('disabled',true).css('background-color','#eeeeee');
        }
    },
}
var chong = 0;
function toLocalAddress() {
    if(is_weixn()){
        getSign();
    }else{
        window.location.href = 'http://api.map.baidu.com/geocoder?location='+tolatitude+','+tolongitude+'&output=html'
    }
}
function getSign() {
    var url = SERVER_ADDR + '/wx/getSign.json';
    var Data = {};
    Data.url = window.location.href;
    /*if(SERVER_ADDR == 'http://www.enuo120.com'){*/
    ajaxGetRetInfo(url, Data, getSignSuccess, '请求失败', 'GET', true, undefined);
    /*}*/
}
function getSignSuccess(retInfo) {
    console.log(retInfo)
    payResult(retInfo);
}
function payResult(jsonData) {
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
/*预约*/
var Btn = {
    comfirmyuyue:function () {
        switch (getQueryString('type')){
            case 'doctor':
                if($('.yuyueActive').attr('class') == undefined){
                    alert('请选择预约时间');
                    return
                }
                $('.modelOpen').show();
                break;
            case 'project':
                if($('.yuyueActive').attr('class') == undefined){
                    alert('请选择预约时间');
                    return
                }
                $('.modelOpen').show();
                break;
            case 'product':
                Btn.yuyue();
                break;
            case 'coupon':
                Btn.yuyue();
                break;
            case 'nursingCard':
                Btn.yuyue();
                break;
            case 'health_supervisor':
                Btn.yuyue();
                break;
        }
    },
    yuyue:function () {
        if($('.yuyueActive').attr('class') == undefined){
           alert('请选择预约时间');
           return
        }

        var Data = {};
        var year = '2017';
        if($('.yuyueActive').parent().find('.daytime').text().split('.')[0] < new Date().getMonth()+1){
             year = new Date().getFullYear() + 1
        }else{
             year = new Date().getFullYear();
        }
        var date = year + '-' +  $('.yuyueActive').parent().find('.daytime').text().split('.')[0] + '-' + $('.yuyueActive').parent().find('.daytime').text().split('.')[1];
        if(getQueryString('type') == 'nursingCard'){
            Data.fkId = getQueryString('huliCardId');
            Data.typeForTooth = getQueryString('typeForTooth');
            Data.nursingCardUserId = getQueryString('nursingCardUserId');
            var url = SERVER_ADDR + '/app/NursingCard/reservation';
        }else {
            var url = SERVER_ADDR + '/app/user/reservation';
            Data.fkId = getQueryString('docId');
        }
        if(getQueryString('type') == 'health_supervisor'){
            if($('#sel_city').val() == ''){
               alert('请选择省市区');
               return
            }
            if($('.addressDetail').val() == ''){
                alert('请输入详细地址');
                return
            }
            if($('.healthTextarea').val() == ''){
                alert('请输入上门事项、备注');
                return
            }
            Data.homeAddress = $('#sel_city').val() + $('.addressDetail').val();
            Data.matter = $('.healthTextarea').val();
        }
        Data.reservationDate = date;
        Data.isMorning = $('.yuyueActive').attr('class').split(' ')[0] == 'am' ?  true : false;
        Data.type = getQueryString('type');
        ajaxGetRetInfo(url, Data, Btn.yuyueSuccess, '请求失败', 'POST', true, undefined);
    },
    yuyueSuccess:function (retInfo) {
        console.log(retInfo)
        /*retInfo = JSON.parse(retInfo);*/
        if(retInfo.success == true){
           //跳转
            console.log('判断跳转');
            switch (getQueryString('type')){
                case 'doctor':
                    if(chong == 0){
                        window.location.href = '../my_yuyue.html';
                    }else if(chong == 1){
                        Pay.click();
                        $('.modelOpen').hide();
                    }
                    break;
                case 'project':
                    if(chong == 0){
                        window.location.href = '../my_yuyue.html';
                    }else if(chong == 1){
                        Pay.click();
                        $('.modelOpen').hide();
                    }
                    break;
                case 'product':
                    window.location.href = '../my_yuyue.html';
                    break;
                case 'coupon':
                    window.location.href = '../my_yuyue.html';
                    break;
                case 'nursingCard':
                    window.location.href = '../my_huliCardyuyue.html';
                    break;
                case 'health_supervisor':
                    window.location.href = '../my_yuyue.html';
                    break;
            }
        }else{
            alert(retInfo.data);
            if(retInfo.data == '请先完善个人信息'){
                window.location.href = '../bind_name.html';
            }
        }
    },
    gotoyuyue:function () {//暂不购买直接预约
        chong = 0;
        Btn.yuyue();
    },
    suretoyuyue:function () {//选了充值去预约
        chong = 1;
        Btn.yuyue();
    }
}
/*支付*/
var Pay = {
    click:function () {
        //进行下单
        if(is_weixn()){
            if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady',  this.ajaxPay('/app/user/rechargeActivity'), false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady',  this.ajaxPay('/app/user/rechargeActivity'));
                    document.attachEvent('onWeixinJSBridgeReady',  this.ajaxPay('/app/user/rechargeActivity'));
                }
            } else {
                this.ajaxPay('/app/user/rechargeActivity');
            }
        }else{//H5支付
            this.ajaxPay('/app/user/rechargeActivity');
        }

    },
    ajaxPay:function (ajaxUrl) {
        var url = SERVER_ADDR + ajaxUrl;
        var Data = {};

        //Data.orderId = getQueryString('itemId');
        /*   if($('.payRightChooseZi').text() == "分单支付"){
               var money = $('.fendanVal').val();
               if (money.trim() == "") {
                   alert('请输入分单支付金额');
                   return;
               }
               if($('.fendanVal').val() < 0.01){
                   alert('支付最少0.01元')
                   return;
               }
               Data.amount = money;
           }*/
        /*  if($('.yueRadio').is(':checked')){
              Data.isRecharge = true;
          }else{
              Data.isRecharge = false;
          }*/
        Data.type = $("input[type='radio']:checked").val();
        ajaxGetRetInfo(url, Data, this.ajaxPaySuccess, '请求失败', 'POST', true, undefined);
    },
    ajaxPaySuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            //去微信支付
            if(is_weixn()) {
                Pay.payResult(retInfo);
            }else{
                //H5支付
                var str = window.location.href + '&isApp=true';
                window.location.href = retInfo.data.url + '&redirect_url=' + encodeURIComponent(str);
            }
        }else{
            alert(retInfo.data)
        }
    },
    payResult:function (jsonData) {
        var jsonDataPost = jsonData.data;
        /*{
            "appId":"wx2421b1c4370ec43b",     //公众号名称，由商户传入
            "timeStamp":"1395712654",         //时间戳，自1970年以来的秒数
            "nonceStr":"e61463f8efa94090b1f366cccfbbb444", //随机串
            "package":"prepay_id=u802345jgfjsdfgsdg888",
            "signType":"MD5",         //微信签名方式：
            "paySign":"70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名
        }*/
        WeixinJSBridge.invoke('getBrandWCPayRequest', jsonDataPost, function (res) {
            window.location.href = '../my_yuyue.html';
            // 使用以下方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            //【因此微信团队建议：】当收到ok返回时，向商户后台询问是否收到交易成功的通知，
            //若收到通知，前端展示交易成功的界面；
            //若此时未收到通知，商户后台主动调用查询订单接口，查询订单的当前状态，并反馈给前端展示相应的界面。
            /*if (res.err_msg == "get_brand_wcpay_request:ok") {
                //JS API的返回结果get_brand_wcpay_request：ok仅在用户成功完成支付时返回
                //alert('支付成功')
                window.location.href = '../my_yuyue.html';
                //paySuccessDo()
            } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                //由于前端交互复杂，get_brand_wcpay_request：cancel或者get_brand_wcpay_request：fail可以统一处理为用户遇到错误或者主动放弃，不必细化区分。
                window.location.href = '../my_yuyue.html';
            } else {
                //由于前端交互复杂，get_brand_wcpay_request：cancel或者get_brand_wcpay_request：fail可以统一处理为用户遇到错误或者主动放弃，不必细化区分。
                alert("支付失败,请稍后重试！如果收到支付通知，切勿重复支付！");
                window.location.href = '../my_yuyue.html';
            }*/
        });
    }
}
/*
var User = {
    info: function () { //个人中心信息
        alert(55656)
        var url = SERVER_ADDR + '/app/user/myInfo';
        var Data = {};
        Data.id = getQueryString('itemId');
        ajaxGetRetInfo(url, Data, User.infoSuccess, '请求失败', 'GET', true, undefined);
    },
    infoSuccess: function (res) {
        if (res.success == true) {
            alert(44)
            $('.shouscore').text(res.data.couponQuantity);
            $('.pingscore').text(res.data.companionCardQuantity);
            $('.lunscore').text(res.data.rechargeAmount);
            if(res.data.fullname){
                $('.loginStatus').text(res.data.fullname);
            }
            $('.docImg').attr('src',res.data.headImgUrl);
        } else {
            alert(res.data);
        }
    },
}
function getTelCode() {
    var message = {};
    message.id = getQueryString('docId');
        $.ajax({
            url: SERVER_ADDR + '/app/user/myInfo',
            type: "GET",
            data: message,
            dataType : 'json',
            success: function (res) {
                if (res.success == true) {
                    alert(44)
                }
            },
            error:function (XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest.status);
                alert(XMLHttpRequest.readyState);
                alert(textStatus);
                alert('cuowu ')
            }
        });
}*/
