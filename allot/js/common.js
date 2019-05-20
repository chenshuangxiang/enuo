
var SERVER_ADDR = 'http://127.0.0.1';//'https://www.enuo120.com';//'http://www.enuo120.com:7070';//  /////;//'///;'//;////;//
function chooseType() {
    var totlePrice = 0;
    console.log($('.typeSelect').val())
    if ($('.typeSelect').val() == '类型' && $('.medicareSelect').val() == '医保') {
        $('.news_content tr').show();
        $('.typeTd').each(function () {
            totlePrice += Number($(this).parent().find('.totlePrice').text());
        })
        return totlePrice;
    } else if($('.typeSelect').val() != '类型' && $('.medicareSelect').val() == '医保'){
        $('.typeTd').each(function () {
            console.log($(this).text())
            if ($('.typeSelect').val() == $(this).text()) {
                $(this).parent().show();
                totlePrice += Number($(this).parent().find('.totlePrice').text());
            } else {
                $(this).parent().hide();
            }
        })
        return totlePrice;
    } else if($('.typeSelect').val() == '类型' && $('.medicareSelect').val() != '医保') {
        $('.medicareTd').each(function () {
            console.log($(this).text())
            if ($('.medicareSelect').val() == $(this).text()) {
                $(this).parent().show();
                totlePrice += Number($(this).parent().find('.totlePrice').text());
            } else {
                $(this).parent().hide();
            }
        })
        return totlePrice;
    } else if($('.typeSelect').val() != '类型' && $('.medicareSelect').val() != '医保') {
        $('.typeTd').each(function () {
            console.log($(this).text())
            if ($('.typeSelect').val() == $(this).text() && $('.medicareSelect').val() == $(this).parent().find('.medicareTd').text()) {
                $(this).parent().show();
                totlePrice += Number($(this).parent().find('.totlePrice').text());
            } else {
                $(this).parent().hide();
            }
        })
        return totlePrice;
    }

}
function getHos(form) {
    var url = SERVER_ADDR + "/customerService/getCertList.json";
    var Data = '';
    ajaxGetRetInfo(url,Data,function (retInfo) {
        if(retInfo.success){
            $('.newsHos').append('<option value="">请选择</option><option value="0">意向不明</option>');
            retInfo.data.forEach(function (value) {
                $('.newsHos').append('<option value="'+value.id+'" title="'+value.type+'">'+value.name+'</option>');
            });
            form.render('select', 'newsHos');//更新
        }
    },'请求失败', 'GET', undefined, undefined);
}
function getNoResultHos(form) {
    var url = SERVER_ADDR + "/customerService/getCertList.json";
    var Data = '';
    ajaxGetRetInfo(url,Data,function (retInfo) {
        if(retInfo.success){
            retInfo.data.forEach(function (value) {
                $('.newsNoResultHos').append('<option value="'+value.id+'" title="'+value.name+'">'+value.name+'</option>');
            });
            form.render('select', 'newsNoResultHos');//更新
        }
    },'请求失败', 'GET', undefined, undefined);
}
function getSaleman(form) {
    var url = SERVER_ADDR + "/customerService/getEnabledList.json";
    var Data = '';
    ajaxGetRetInfo(url,Data,function (retInfo) {
        if(retInfo.success){
            $('.kefuSelect').append('<option value="">请选择</option>');
            retInfo.data.forEach(function (value) {
                $('.kefuSelect').append('<option value="'+value.id+'">'+value.name+'</option>');
            });
            form.render('select', 'kefuSelect');//更新
        }

    },'请求失败', 'GET', undefined, undefined);
}
function getFrom(form) {
    var url = SERVER_ADDR + "/common/getStores.json";
    var Data = '';
    ajaxGetRetInfo(url,Data,function (retInfo) {
        if(retInfo.success){
            $('.from').append('<option value="">请选择</option>');
            retInfo.data.forEach(function (value) {
                $('.from').append('<option value="'+value.id+'">'+value.name+'</option>');
            });
            form.render('select', 'from');//更新
        }
    },'请求失败', 'GET', undefined, undefined);
}
/*function getFk(form,type) {
    var url = SERVER_ADDR + "/admin/allot/getDiseases.json";
    var Data = {};
    Data.type = type;
    ajaxGetRetInfo(url,Data,function (retInfo) {
        if(retInfo.success){
            $('.newsDisease').append('<option value="">请选择</option>');
            retInfo.data.forEach(function (value) {
                $('.newsDisease').append('<option value="'+value.id+'">'+value.name+'</option>');
            });
            form.render('select', 'newsDisease');//更新
        }
    },'请求失败', 'GET', undefined, undefined);
}*/
function getService(form,type) { //客服
    var url = SERVER_ADDR + "/customerService/getMember.json";
    var Data = {};
    Data.type = type;
    ajaxGetRetInfo(url,Data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            $('.hoskefuSelect').append('<option value="">请选择分配客服</option>');
            retInfo.data.forEach(function (value) {
                $('.hoskefuSelect').append('<option value="'+value.id+'">'+value.name+'</option>');
            });
            form.render();//更新
        }
    },'请求失败', 'GET', undefined, undefined);
}
    //get请求
 function get_listajax(back_url,data,fun,errorCallback){
        $.ajax({
            url:back_url,
            type:"get",
            async:true,
            data:data,
            dataType:"json",
            statusCode:{
                403:function (data) {
                    if(data.getResponseHeader('isAuthorization') == 'true'){
                        var str = data.getResponseHeader('userAuthUrl');
                        str = str.replace(/REDIRECT_URI/, encodeURI(window.location.href));
                        sessionStorage.setItem("codeValue", 'true');
                        window.location.href = str;
                    }else{
                        window.location.href = '/app/bind_tel.html';
                    }
                }
            },
            success:function(res){
                if(fun){
                    fun(res);
                }
            },
            error:function(){
                errorCallback
            }
        });
    }
function post_ajax(back_url,data,type,fun){
    $.ajax({
        url:back_url,
        type:type,
        async:true,
        data:data,
        dataType:"json",
        success:function(res){
            if(fun){
                fun(res);
            }
        },
        error:function(res){
            console.log(res);
        },
        statusCode: {
            403:function(){
                parent.location.href = "login.html";
            }
        }
    });
    //	//返回状态码
    //	var statusCode = $.post(url+""+back_url,data,function(res){
    //		console.log(statusCode.status);//打印状态码
    //		console.log(res);
    //		if(res.success==true){
    //			return res.data;
    //		}
    //	},"json");
}
function ajaxGetRetInfo(url, data, onSuccess, onFailure, type, showLoad, params) {
    'use strict';
    var ajaxOnSuccess = function (retInfo) {
        onSucessCpmRetInfo(retInfo, onSuccess);
    };
    ajaxGetJson(url, data, ajaxOnSuccess, onFailure, type, showLoad, params);
}
function ajaxGetJson(url, data, onSuccess, onFailure, type, showLoad, params) {
    'use strict';
    var onComplete;
    if (showLoad) {
        onComplete = function () {
            //请求中的操作
            // 正在请求中
           /* $('body').prepend('<div id="loading"><img src="../img/loading.gif"></div>')*/
        };
    }
    var ajaxParam =
        {
            url: url,
            async: false,
            type: type || 'post',
            data: data,
            // 设置返回类型为 json，jquey 自动解析中文乱码，
            // 和服务器配置有关
            dataType : 'json',
            timeout: 15000,
            statusCode:{
              403:function (data) {
                      parent.window.location.href = '/allot/login.html';
                }
            },
            success: function (dataStr,status,readyState) {

                if(readyState.status === 200){
                    onSuccess(dataStr);
                }
            },
            error:function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest.status)
                if(XMLHttpRequest.status != 403){
                    parent.layui.layer.closeAll();
                    parent.layui.layer.alert('系统繁忙，请稍候再试。('+XMLHttpRequest.status +')',{icon:5});
                }
            },
            complete: onComplete
        };

    for (var prop in params) {
        ajaxParam[prop] = params[prop];
    }

    $.ajax(ajaxParam);
}
function onSucessCpmRetInfo(retInfo, onSuccess) {
    'use strict';
   /* var succZhi = 0;
    var retCode = retInfo.success;
    if (retCode === true) {
        onSuccess(retInfo);
    }else {
        var comList = ['demo','getWecat'];  //如果是这些页面，则回调success
        comList.forEach(function (t) {
            if(window.location.href.indexOf(t) != -1){
                onSuccess(retInfo);
                succZhi = 1;
            }
        })
        if(succZhi  !== 1){
            alert('请求结果出错')
        }
    }*/
    onSuccess(retInfo);
}
var follow = {
    wecat:function () {  //请求是否关注公众号  本地不能调
        if(is_weixn()){
            var url = SERVER_ADDR + '/app/common/isSubscribe';
            var Data = '';
            ajaxGetRetInfo(url,Data,this.checkwecatSuccess,'请求失败', 'GET', undefined, undefined);
        }
    },
    checkwecatSuccess:function (retInfo) {
        if(retInfo.success == false){
            window.location.href = '/app/follow.html';
            //sessionStorage.setItem("follw", 'false');
            //sessionStorage.setItem("follw", 'true');
        }
    }
}
function check( phoneNum, errorMsg) {
    'use strict';
    if (!phoneNum) {
        alert(errorMsg);
    }
    return phoneNum;
}
//获取地址栏url的参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return null;
}
//获取自己写的url的参数
function getQueryStringGeturl(url,name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = url.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return null;
}
function noData(name) { //undefind数据 返回name
    if(!name || name == '' || name == 'undefined'){
        name = '无';
    }
    return name
}
function recordStatusOnlyOne(hospitalStatus,platformStatus) {
    var recordStatusVal;
    if(hospitalStatus != undefined){
        recordStatusVal = recordStatusHospital(hospitalStatus)
    }else{
        recordStatusVal = recordStatusPlatform(platformStatus)
    }
    return recordStatusVal;
}
function recordStatusHospital(status) {
    var recordStatusVal;
    switch (status){
        case 'unConnect':
            recordStatusVal = '未接通';
            break;
        case 'refuse':
            recordStatusVal = '拒接';
            break;
        case 'unAccess':
            recordStatusVal = '未回访';
            break;
        case 'INTENTIONALMISSVISIT':
            recordStatusVal = '有意向未到诊';
            break;
        case 'INTENTIONALMISSVISIT_BOOKED':
            recordStatusVal = '有意向未到诊(已预约)';
            break;
        case 'reservation':
            recordStatusVal = '有意向未到诊(已预约)';
            break;
        case 'INTENTIONALMISSVISIT_NOBOOKED':
            recordStatusVal = '有意向未到诊(未预约)';
            break;
        case 'INTENTIONALVISITED':
            recordStatusVal = '有意向已到诊';
            break;
        case 'visit':
            recordStatusVal = '有意向已到诊';
            break;
        case 'VISITPAID_BE_UNDER_TREATMENT':
            recordStatusVal = '到诊已成交(治疗中)';
            break;
        case 'VISITPAID_ALREADY_TREATED':
            recordStatusVal = '到诊已成交(已治疗)';
            break;
        case 'repeat':
            recordStatusVal = '重单';
            break;
        case 'faild':
            recordStatusVal = '到诊未成交';
            break;
        case 'recontact':
            recordStatusVal = '需再次联系';
            break;
        case 'emptyNum':
            recordStatusVal = '空号/停机';
            break;
        case 'infoError':
            recordStatusVal = '信息不符';
            break;
        case 'platformUnAccess':
            recordStatusVal = '平台未回访';
            break;
        case 'hasAccess':
            recordStatusVal = '跟踪复仿';
            break;
        case 'pauseAccess':
            recordStatusVal = '暂停回访';
            break;
        case 'success':
            recordStatusVal = '已成交';
            break;
        case 'unContact':
            recordStatusVal = '无法联系';
            break;
        case undefined:
            recordStatusVal = '';
            break;
    }
    return recordStatusVal;
}
function recordStatusPlatform(status) {
    var recordStatusVal;
        switch (status){
            case 'unConnect':
                recordStatusVal = '未接通';
                break;
            case 'refuse':
                recordStatusVal = '拒接';
                break;
            case 'INTENTIONALMISSVISIT':
                recordStatusVal = '有意向未到诊';
                break;
            case 'INTENTIONALMISSVISIT_BOOKED':
                recordStatusVal = '有意向未到诊(已预约)';
                break;
            case 'INTENTIONALMISSVISIT_NOBOOKED':
                recordStatusVal = '有意向未到诊(未预约)';
                break;
            case 'INTENTIONALVISITED':
                recordStatusVal = '有意向已到诊';
                break;
            case 'VISITPAID_BE_UNDER_TREATMENT':
                recordStatusVal = '到诊已成交(治疗中)';
                break;
            case 'VISITPAID_ALREADY_TREATED':
                recordStatusVal = '到诊已成交(已治疗)';
                break;
            case 'repeat':
                recordStatusVal = '重单';
                break;
            case 'faild':
                recordStatusVal = '到诊未成交';
                break;
            case 'recontact':
                recordStatusVal = '需再次联系';
                break;
            case 'emptyNum':
                recordStatusVal = '空号/停机';
                break;
            case 'infoError':
                recordStatusVal = '信息不符';
                break;
            case 'hospitalUnAccess':
                recordStatusVal = '院方未回访';
                break;
            case 'hasAccess':
                recordStatusVal = '跟踪复仿';
                break;
            case 'pauseAccess':
                recordStatusVal = '暂停回访';
                break;
            case 'success':
                recordStatusVal = '已成交';
                break;
            case 'unContact':
                recordStatusVal = '无法联系';
                break;
            case undefined:
                recordStatusVal = '';
                break;
        }
    return recordStatusVal;
}
function returnProjectType(type) {
    var recordStatusVal;
    switch (type){
        case 'doctor':
            recordStatusVal = '医生';
            break;
        case 'product':
            recordStatusVal = '特价项目';
            break;
        case 'coupon':
            recordStatusVal = '线下体验券';
            break;
        case 'offline':
            recordStatusVal = '线下订单';
            break;
        case 'registration_fee':
            recordStatusVal = '挂号费';
            break;
        case 'embroidery_eyebrow_festival_20181011':
            recordStatusVal = '绣眉体验券';
            break;
        case 'PERSONAL_EMBROIDERY_EYEBROW_FESTIVAL_20181011':
            recordStatusVal = '绣眉体验券';
            break;
        case 'PRIZE':
            recordStatusVal = '中奖项目';
            break;
        case 'FIVE_LINE_BROWS':
            recordStatusVal = '绣眉体验券';
            break;
        case 'LINE_BROWS_CITIC':
            recordStatusVal = '绣眉体验券';
            break;
        case 'CITIC_BANK_ACTIVATION_CODE':
            recordStatusVal = '中信兑换码项目';
            break;
        case undefined:
            recordStatusVal = '';
            break;
    }
    return recordStatusVal;
}
function returnProjectNumber(number) {
    var numbers;
    if(number){
        if(number.split('-')[2] == undefined){
            var split2 = '';
        }else{
            var split2 = number.split('-')[2];
        }
        return numbers =  number.split('-')[0] + '<span style="color: #009688;font-weight:600">'+ number.split('-')[1]+'</span>' +  split2;
    }else{
        return numbers = '无'
    }
}
function returnProjectOrderStatus(status) {
    var recordStatusVal;
    switch (status){
        case 'waitPaid':
            recordStatusVal = '待支付';
            break;
        case 'waitConfirm':
            recordStatusVal = '待确认(已支付)';
            break;
        case 'completed':
            recordStatusVal = '已完成';
            break;
        case 'cancelled':
            recordStatusVal = '已取消';
            break;
        case 'handle':
            recordStatusVal = '已结算';
            break;
        case 'REFUND':
            recordStatusVal = '退款';
            break;
        case 'USED':
            recordStatusVal = '已使用';
            break;
        case undefined:
            recordStatusVal = '';
            break;
    }
    return recordStatusVal;
}
function returnProjectVisitRecordStatus(status) {
    var recordStatusVal;
    switch (status){
        case 'uncheck':
            recordStatusVal = '待审核';
            break;
        case 'wait':
            recordStatusVal = '候诊';
            break;
        case 'loading':
            recordStatusVal = '治疗中';
            break;
        case 'complete':
            recordStatusVal = '完成';
            break;
        case 'leave':
            recordStatusVal = '离诊';
            break;
        case 'disagress':
            recordStatusVal = '不同意(驳回审批)';
            break;
        case 'registration':
            recordStatusVal = '挂号中';
            break;
        case undefined:
            recordStatusVal = '';
            break;
    }
    return recordStatusVal;
}
function returnSubstring(val){
    if(val.length > 10){
        return val.substring(0, 10)+'..';
    }else{
        return val;
    }
}

function returnSubstringSize(val,size){
    if(val.length > size){
        return val.substring(0, size)+'..';
    }else{
        return val;
    }
}
//ref : http://blog.csdn.net/vbangle/article/details/5643091
//对Date的扩展，将 Date 转化为指定格式的String
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
//例子：
//(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
//(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz
    // jshint ignore:start
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
    // jshint ignore:end
};
/*去掉数组里的一个元素*/
Array.prototype.removeval = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
function getCountDays() {  //这个月的天数
    var curDate = new Date();
    /* 获取当前月份 */
    var curMonth = curDate.getMonth() + 1;
    /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
    curDate.setMonth(curMonth);
    /* 将日期设置为0 */
    curDate.setDate(0);
    /* 返回当月的天数 */
    return curDate.getDate();
}
function transferDate(date) {

    // 年
    var year = date.getFullYear();
    // 月
    var month = date.getMonth() + 1;
    // 日
    var day = date.getDate();

    if (month >= 1 && month <= 9) {

        month = "0" + month;
    }
    if (day >= 0 && day <= 9) {

        day = "0" + day;
    }
    var dateString;
     dateString = year + '-' + month + '-' + day;
    return dateString;
}
function getWeek(Fn) {

    //按周日为一周的最后一天计算
    var date = new Date();

    //今天是这周的第几天
    var today = date.getDay();

    //上周日距离今天的天数（负数表示）
    var stepSunDay = -today + 1;

    // 如果今天是周日
    if (today == 0) {

        stepSunDay = -7;
    }

    // 周一距离今天的天数（负数表示）
    var stepMonday = 7 - today;

    var time = date.getTime();

    var monday = new Date(time + stepSunDay * 24 * 3600 * 1000);
    var sunday = new Date(time + stepMonday * 24 * 3600 * 1000);

    //本周一的日期 （起始日期）
    var startDate = transferDate(monday); // 日期变换
    //本周日的日期 （结束日期）
    var endDate = transferDate(sunday); // 日期变换
    return startDate + '/' + endDate;
}
/*患者意向程度*/
function returnIntentStatus(status) {
    var recordStatusVal;
    switch (status){
        case 'STRONG_INTENEION':
            recordStatusVal = '意向强烈';
            break;
        case 'LITTLE_INTENEION':
            recordStatusVal = '意向较强';
            break;
        case 'GENERAL_INTENTION':
            recordStatusVal = '意向一般，需要跟进';
            break;
        case 'NO_INTENTION':
            recordStatusVal = '暂时无意向';
            break;
        case undefined:
            recordStatusVal = '';
            break;
    }
    return recordStatusVal;
}