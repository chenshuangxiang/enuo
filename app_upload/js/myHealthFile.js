$(document).ready(function () {
    /*init();*/
    /*初始化菜单*/
    $(".nav p").click(function(){
        var i=Number($(this).attr("i"));
        if(curNavIndex!=i) {
            //更改列表条件
            $(".nav .active").removeClass("active");
            $(this).addClass("active");
            //隐藏当前列表
            $("#mescroll"+curNavIndex).hide();
            //显示对应的列表
            curNavIndex=i;
            $("#mescroll"+curNavIndex).show();
            if (curNavIndex == 0) {
                if ($('.nav [i=' + curNavIndex + ']').attr('ajax') != 'true') {
                    Go.baseInfo();
                }
            } else if (curNavIndex == 1) {
                if ($('.nav [i=' + curNavIndex + ']').attr('ajax') != 'true') {
                    Go.caseList();
                }
            } else if (curNavIndex == 2) {
                if ($('.nav [i=' + curNavIndex + ']').attr('ajax') != 'true') {
                    Go.caseMedicalList();
                }
            } else if (curNavIndex == 3) {
                if ($('.nav [i=' + curNavIndex + ']').attr('ajax') != 'true') {
                    Go.tuiMoreXueya();
                    Go.tuiMoreXuetang();
                    Go.tuiMoreXuezhi();
                }
            }
            $('.nav [i='+curNavIndex+']').attr('ajax','true');

        }
            //取出菜单所对应的mescroll对象,如果未初始化则初始化
            //if(mescrollArr[i]==null) mescrollArr[i]=initMescroll("mescroll"+i, "dataList"+i);
    })
    setTimeout(function () {
        $('.nav p[i="'+getQueryString('tab')+'"]').click();
    },100)
    if(getQueryString('tab') == null || getQueryString('tab') == 0){
        Go.baseInfo();
    }else if(getQueryString('tab') == 1){
        Go.caseList();
    }else if(getQueryString('tab') == 2){
        Go.caseMedicalList();
    }else if(getQueryString('tab') == 3){
        Go.tuiMoreXueya();
        Go.tuiMoreXuetang();
        Go.tuiMoreXuezhi();
    }
    $(window).scroll(function(){
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if(scrollTop + windowHeight - scrollHeight == 0 ){
            console.log("you are in the bottom");
            if(total > $('.caseDiv').length && curNavIndex == 1){
                Go.caseList();
            }
            if(totalMedical > $('.caseMedicalDiv').length && curNavIndex == 2){
                Go.caseMedicalList();
            }
        }
    });
})
var pageNumber = 1;
var pageNumberMedical = 1;
var total = 5;
var totalMedical = 5;
var curNavIndex=0;//首页0; 奶粉1; 面膜2; 图书3;

var Go = {
    baseInfo:function () {  //获取基本信息
        var url = SERVER_ADDR + '/app/user/health/document/baseInfo';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.baseInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    baseInfoSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            $('.myname').text(retInfo.data.fullname);
            if(retInfo.data.sex == 'woman'){
                $('.sexImgSrc').attr('src','img/health/healthWoman.png');
            }else{
                $('.sexImgSrc').attr('src','img/health/healthMan.png');
            }
            $('.fullHeadImgUrl').attr('src',retInfo.data.fullHeadImgUrl);
            if(retInfo.data.doctors.length > 0){
                $('.mydoctorname').text(retInfo.data.doctors[0].name);
            }
            if(retInfo.data.nurses.length > 0){
                $('.mynursename').text(retInfo.data.nurses[0].name);
            }
            if(retInfo.data.healthSupervisor){
                $('.myhealthname').text(retInfo.data.healthSupervisor.name);
            }
            if(retInfo.data.personalInformationPercent){
                $('.personalInformationPercent').text(retInfo.data.personalInformationPercent);
            }else{
                $('.personalInformationPercent').text(0);
            }
            if(retInfo.data.basicInfoPercent){
                $('.basicInfoPercent').text(retInfo.data.basicInfoPercent);
            }else{
                $('.basicInfoPercent').text(0);
            }
            if(retInfo.data.userLifePercent){
                $('.userLifePercent').text(retInfo.data.userLifePercent);
            }else{
                $('.userLifePercent').text(0);
            }


        }else{
            alert(retInfo.data)
        }
    },
    tuiMoreXueya:function () {  //加入血压接口
        var url = SERVER_ADDR + '/app/user/bloodPressure/findPage';
        var Data = {};
        Data.pageNumber = 1;
        Data.pageSize = 1;
        ajaxGetRetInfo(url, Data, this.tuiMoreXueyaSuccess, '请求失败', 'GET', true, undefined);
    },
    tuiMoreXueyaSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            if(retInfo.data && retInfo.data.content.length > 0){
                var html = '';
                retInfo.data.content.forEach(function (value) {
                    html += '<li class="hos_child addShuju set_box_shadow"> ' +
                        '<div class="hos_list_top clearfix"> ' +
                        '<div class="yuyueTop"> ' +
                        '<span class="famousName hosName">血压</span> ' +
                        '</div> ' +
                        '<div class="orderContent"> ' +
                        '<button class="ordercommont"  onclick="window.location.href = '+"'myHealthFileXueyaList.html'"+'">历史数据></button>'+
                        '<div class="left"><img src="img/health/xueya.png"></div> ' +
                        '<div class="right"> ' +
                        '<p class="detail"> ' +
                        '<span class="name">高压  '+value.maximumPressure+'mmHg</span> ' +
                        '</p> ' +
                        '<p class="detail"> ' +
                        '<span class="name">低压 '+value.minimumPressure+'mmHg</span> ' +
                        '</p> ' +
                        '<p class="detail" style="margin-bottom: .45rem;"> ' +
                        '<span class="name">心率 '+value.heartRate+'bpm</span> ' +
                        '</p> ' +
                        '<p class="orderdetailchoose" style="    margin-bottom: .5rem;"> ' +
                        '<span>测量时间：</span> ' +
                        '<span class="orderdetailchooseName">'+new Date(value.createDate).Format('yyyy-MM-dd hh:mm:ss')+'</span> ' +
                        '</p> ' +
                        '</div> ' +
                        '</div> ' +
                        '</div> ' +
                        '</li>';
                })
                $('#mescroll3').append(html);
            }else{
                var html = '';
                html += '<li class="hos_child addShuju set_box_shadow"> ' +
                    '<div class="hos_list_top clearfix"> ' +
                    '<div class="yuyueTop"> ' +
                    '<span class="famousName hosName">血压</span> ' +
                    '</div> ' +
                    '<div class="orderContent"> ' +
                    '<button class="ordercommont"  onclick="window.location.href = '+"'myHealthFileXueyaList.html'"+'">历史数据></button>'+
                    '<div class="left"><img src="img/health/xueya.png"></div> ' +
                    '<div class="right"> ' +
                    '<p class="detail"> ' +
                    '<span class="name">高压 mmHg</span> ' +
                    '</p> ' +
                    '<p class="detail"> ' +
                    '<span class="name">低压 mmHg</span> ' +
                    '</p> ' +
                    '<p class="detail" style="margin-bottom: .45rem;"> ' +
                    '<span class="name">心率 bpm</span> ' +
                    '</p> ' +
                    '<p class="orderdetailchoose" style="    margin-bottom: .5rem;"> ' +
                    '<span>测量时间：</span> ' +
                    '<span class="orderdetailchooseName"></span> ' +
                    '</p> ' +
                    '</div> ' +
                    '</div> ' +
                    '</div> ' +
                    '</li>';
                $('#mescroll3').append(html);
            }
        }else{
            alert(retInfo.data)
        }
    },
    tuiMoreXuetang:function () {  //加入血糖接口
        var url = SERVER_ADDR + '/app/user/bloodGlucose/findPage';
        var Data = {};
        Data.pageNumber = 1;
        Data.pageSize = 1;
        ajaxGetRetInfo(url, Data, this.tuiMoreXuetangSuccess, '请求失败', 'GET', true, undefined);
    },
    tuiMoreXuetangSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            var ceTime = '';
            if(retInfo.data && retInfo.data.content.length > 0){
                var html = '';
                retInfo.data.content.forEach(function (value) {
                    console.log(value)
                    html += '<li class="hos_child addShuju set_box_shadow"> ' +
                        '<div class="hos_list_top clearfix"> ' +
                        '<div class="yuyueTop"> ' +
                        '<span class="famousName hosName">血糖</span> ' +
                        '</div> ' +
                        '<div class="orderContent"> ' +
                        '<button class="ordercommont"  onclick="window.location.href = '+"'myHealthFileXuetangList.html'"+'">历史数据></button>'+
                        '<div class="left"><img src="img/health/xuetang.png"></div> ' +
                        '<div class="right"> ' ;
                    if(value.detailList && value.detailList.length > 0){
                        ceTime = value.detailList[0].monitoringDatetime.split(' ')[0];
                        value.detailList.forEach(function (valueCe) {
                            html += '<p class="detail"> ' +
                                '<span class="name">'+valueCe.timeBucket+' '+valueCe.bloodGlucose+'mmol/L</span> ' +
                                '</p> '
                        })
                    }
                    html += '<p class="orderdetailchoose" style="    margin-bottom: .5rem;"> ' +
                        '<span>测量时间：</span> ' +
                        '<span class="orderdetailchooseName">'+ceTime+'</span> ' +
                        '</p> ' +
                        '</div> ' +
                        '</div> ' +
                        '</div> ' +
                        '</li>';
                    //$('.hos_list').append(html);
                })
                $('#mescroll3').append(html);
            }else{
                var html = '';
                html += '<li class="hos_child addShuju set_box_shadow"> ' +
                    '<div class="hos_list_top clearfix"> ' +
                    '<div class="yuyueTop"> ' +
                    '<span class="famousName hosName">血糖</span> ' +
                    '</div> ' +
                    '<div class="orderContent"> ' +
                    '<button class="ordercommont"  onclick="window.location.href = '+"'myHealthFileXuetangList.html'"+'">历史数据></button>'+
                    '<div class="left"><img src="img/health/xuetang.png"></div> ' +
                    '<div class="right"> ' ;

                html += '<p class="detail"> ' +
                    '<span class="name">mmol/L</span> ' +
                    '</p> '

                html += '<p class="orderdetailchoose" style="    margin-bottom: .5rem;"> ' +
                    '<span>测量时间：</span> ' +
                    '<span class="orderdetailchooseName"></span> ' +
                    '</p> ' +
                    '</div> ' +
                    '</div> ' +
                    '</div> ' +
                    '</li>';
                //$('.hos_list').append(html);
                $('#mescroll3').append(html);
            }
        }else{
            alert(retInfo.data)
        }
    },
    tuiMoreXuezhi:function () {  //加入血脂接口
        var url = SERVER_ADDR + '/app/user/bloodFat/findPage';
        var Data = {};
        Data.pageNumber = 1;
        Data.pageSize = 1;
        ajaxGetRetInfo(url, Data, this.tuiMoreXuezhiSuccess, '请求失败', 'GET', true, undefined);
    },
    tuiMoreXuezhiSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            if(retInfo.data && retInfo.data.content.length > 0){
                var html = '';
                retInfo.data.content.forEach(function (value) {
                    console.log(value)
                    html += '<li class="hos_child addShuju set_box_shadow"> ' +
                        '<div class="hos_list_top clearfix"> ' +
                        '<div class="yuyueTop"> ' +
                        '<span class="famousName hosName">血脂</span> ' +
                        '</div> ' +
                        '<div class="orderContent"> ' +
                        '<button class="ordercommont"  onclick="window.location.href = '+"'myHealthFileXuezhiList.html'"+'">历史数据></button>'+
                        '<div class="left"><img src="img/health/xuezhi.png"></div> ' +
                        '<div class="right"> ' +
                        '<p class="detail"> ' +
                        '<span class="name">总胆固醇  '+value.totalCholesterol+'mmol/L</span> ' +
                        '</p> ' +
                        '<p class="detail"> ' +
                        '<span class="name">低密度脂蛋白 '+value.ldl+'mmol/L</span> ' +
                        '</p> ' +
                        '<p class="detail"> ' +
                        '<span class="name">高密度脂蛋白 '+value.hdl+'mmol/L</span> ' +
                        '</p> ' +
                        '<p class="detail"> ' +
                        '<span class="name">甘油三酯 '+value.triglyceride+'mmol/L</span> ' +
                        '</p> ' +
                        '<p class="orderdetailchoose" style="    margin-bottom: .5rem;"> ' +
                        '<span>测量时间：</span> ' +
                        '<span class="orderdetailchooseName">'+value.monitoringDatetime+'</span> ' +
                        '</p> ' +
                        '</div> ' +
                        '</div> ' +
                        '</div> ' +
                        '</li>';
                })
                $('#mescroll3').append(html);
            }else{
                var html = '';
                html += '<li class="hos_child addShuju set_box_shadow"> ' +
                    '<div class="hos_list_top clearfix"> ' +
                    '<div class="yuyueTop"> ' +
                    '<span class="famousName hosName">血脂</span> ' +
                    '</div> ' +
                    '<div class="orderContent"> ' +
                    '<button class="ordercommont"  onclick="window.location.href = '+"'myHealthFileXuezhiList.html'"+'">历史数据></button>'+
                    '<div class="left"><img src="img/health/xuezhi.png"></div> ' +
                    '<div class="right"> ' +
                    '<p class="detail"> ' +
                    '<span class="name">总胆固醇 mmol/L</span> ' +
                    '</p> ' +
                    '<p class="detail"> ' +
                    '<span class="name">低密度脂蛋白 mmol/L</span> ' +
                    '</p> ' +
                    '<p class="detail"> ' +
                    '<span class="name">高密度脂蛋白 mmol/L</span> ' +
                    '</p> ' +
                    '<p class="detail"> ' +
                    '<span class="name">甘油三酯 mmol/L</span> ' +
                    '</p> ' +
                    '<p class="orderdetailchoose" style="    margin-bottom: .5rem;"> ' +
                    '<span>测量时间：</span> ' +
                    '<span class="orderdetailchooseName"></span> ' +
                    '</p> ' +
                    '</div> ' +
                    '</div> ' +
                    '</div> ' +
                    '</li>';
                $('#mescroll3').append(html);
            }
        }else{
            alert(retInfo.data)
        }
    },
    caseList:function () {  //加入就诊病历
        var url = SERVER_ADDR + '/app/user/communityPatientReport/patientReports';
        var Data = {};
        Data.type = 'outpatient_cases'
        Data.pageNumber = pageNumber;
        Data.pageSize = 5;
        ajaxGetRetInfo(url, Data, this.caseListSuccess, '请求失败', 'GET', true, undefined);
    },
    caseListSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            if(retInfo.data && retInfo.data.length > 0){
                retInfo.data.forEach(function (value) {
                    console.log(value)
                    var html = '';
                    html += '<div class="hos_child caseDiv set_box_shadow" style="width: 94%;float: none"> ' +
                        '<div class="hos_list_top clearfix"> ' +
                        '<div class="orderContent" style="margin: .3rem 0 0 2%;"> ' +
                        '<div class="left" style="width: 24%;line-height: inherit"><img src="'+value.imgUrl+'"></div> ' +
                        '<div class="right" style="margin-top: .1rem;padding-left: 2%"> ' +
                        '<p class="detail"><span class="name" style="font-size: 1.05rem">'+value.medicalInstitution+'</span></p> ' +
                        '<p class="detail" style="line-height: 1rem;color: #999;    height: auto;"> ' +
                        '<span class="name overflow_num_ellipsis">'+value.content+'</span> ' +
                        '</p> ' +
                        '<p class="orderdetailchoose" style="    margin-bottom: .5rem;color: #999"> ' +
                        '<span>就诊时间：</span> ' +
                        '<span class="orderdetailchooseName">'+new Date(value.createDate).Format('yyyy-MM-dd')+'</span> ' +
                        '<button class="orderReadMore" valueid="'+value.id+'" onclick="Go.readPatientReports(this)">查看更多></button> ' +
                        '</p> ' +
                        '</div> ' +
                        '</div> ' +
                        '</div> ' +
                        '</div>';
                    //$('.hos_list').append(html);
                    $('.mescroll1DivList').append(html);
                })
                //$('.hos_doc_child:last-child').css('border-bottom','0');
                pageNumber++;
            }
            total = retInfo.totalCount;
        }else{
            alert(retInfo.data)
        }
    },
    caseMedicalList:function () {  //加入体检病历
        var url = SERVER_ADDR + '/app/user/communityPatientReport/patientReports';
        var Data = {};
        Data.type = 'medical_examination_report';
        Data.pageNumber = pageNumberMedical;
        Data.pageSize = 5;
        ajaxGetRetInfo(url, Data, this.caseMedicalListSuccess, '请求失败', 'GET', true, undefined);
    },
    caseMedicalListSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            if(retInfo.data && retInfo.data.length > 0){
                retInfo.data.forEach(function (value) {
                    console.log(value)
                    var html = '';
                    html += '<div class="hos_child caseMedicalDiv set_box_shadow" style="width: 94%;float: none"> ' +
                        '<div class="hos_list_top clearfix"> ' +
                        '<div class="orderContent" style="margin: .3rem 0 0 2%;"> ' +
                        '<div class="left" style="width: 24%;line-height: inherit"><img src="'+value.imgUrl+'"></div> ' +
                        '<div class="right" style="margin-top: .1rem;padding-left: 2%"> ' +
                        '<p class="detail"><span class="name" style="font-size: 1.05rem">'+value.medicalInstitution+'</span></p> ' +
                        '<p class="detail" style="line-height: 1rem;color: #999;    height: auto;"> ' +
                        '<span class="name overflow_num_ellipsis">'+value.content+'</span> ' +
                        '</p> ' +
                        '<p class="orderdetailchoose" style="    margin-bottom: .5rem;color: #999"> ' +
                        '<span>体检时间：</span> ' +
                        '<span class="orderdetailchooseName">'+new Date(value.createDate).Format('yyyy-MM-dd')+'</span> ' +
                        '<button class="orderReadMore" valueid="'+value.id+'" onclick="Go.readPatientReportsTijian(this)">查看更多></button> ' +
                        '</p> ' +
                        '</div> ' +
                        '</div> ' +
                        '</div> ' +
                        '</div>';
                    //$('.hos_list').append(html);
                    $('.mescroll2DivList').append(html);
                })
                //$('.hos_doc_child:last-child').css('border-bottom','0');
                pageNumberMedical++;
            }
            totalMedical = retInfo.totalCount;
        }else{
            alert(retInfo.data)
        }
    },
    readPatientReports:function (obj) {
        window.location.href = 'myHealthFileBingliAdd.html?id='+$(obj).attr('valueid');
    },
    readPatientReportsTijian:function (obj) {
        window.location.href = 'myHealthFileTijianAdd.html?id='+$(obj).attr('valueid');
    }
}