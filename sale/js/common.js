var SERVER_ADDR = 'http://127.0.0.1';//'https://www.enuo120.com';//'http://www.enuo120.com:7070'//   //   ///;//'///;'//;////;//
/**
 * 返回结果为 RetInfo 结构，
 */
$(document).ready(function () {

});
function is_weixn(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
        return true;
    } else {
        return false;
    }
}
window.alert = function(name){
    var iframe = document.createElement("IFRAME");
    iframe.style.display="none";
    iframe.setAttribute("src", 'data:text/plain,');
    document.documentElement.appendChild(iframe);
    window.frames[0].window.alert(name);
    iframe.parentNode.removeChild(iframe);
};
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
            /*$('body').prepend('<div id="loading"><img src="../img/loading.gif"></div>')*/
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
              403:function () {
                  window.location.href = 'login.html';
                }
            },
            success: function (dataStr,status,readyState) {
                if(readyState.status === 200){
                    onSuccess(dataStr);
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
        name = '';
    }
    return name
}
/**
 * 字段验证
 */
jQuery.extend({
    //非空验证
    verify:function(val,str){
        if(val == ""){
            alert(str+"不能为空");
            return false;
        }else{
            return true;
        }
    },
    //非数字验证
    verifyNum:function(val,str){
        console.log(val+","+$.regNum(val));
        if(!$.regNum(val)){
            alert(str+"必须是数字");
            return false;
        }else{
            return true;
        }
    },
    //非数字请选择验证
    verifychooseNum:function(val,str){
        console.log(val+","+$.regNum(val));
        if(!$.regNum(val)){
            alert("请选择"+str);
            return false;
        }else{
            return true;
        }
    },
    //非空或非手机号验证
    verifyPhone:function(val,str){
        if(val == "" || !$.testPhone(val)){
            alert(str+"不正确");
            return false;
        }else{
            return true;
        }
    },
    //邮箱验证
    verifyEmail:function(val,str){
        if(val == "" || !$.regEmail(val)){
            alert(str+"不正确");
            return false;
        }else{
            return true;
        }
    },
    //正则判断是否为数字
    regNum:function(num){
        var rgx = /^[0-9]*$/;///[0-9]+/;
        return rgx.test(num);
    },
    //正则判断小数(float)
    regfloatNum:function(num){
        var rgx = /^([0-9])?([/\./])?([0-9])+$/;
//		console.log(rgx.test(num)+"---------");
        return rgx.test(num);
    },
    //正则判断非汉字
    regChinese:function(num){
        var rgx = /[\u4e00-\u9fa5]+/;
        return rgx.test(num);
    },
    //正则判断11-12手机号
    testPhone:function(num){
        var rgx = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        return rgx.test(num);
    },
    //正则邮箱
    regEmail:function(num){
        var rgx = /^([0-9A-z]+)(@{1})([0-9A-z]+[/\./]{1})([a-z]+)$/;
        return rgx.test(num);
    },
    //数组转二维数组
    twoArr:function(m){
        //m：传入的数组
        var n = Math.ceil(m.length/2);
//		console.log(n);
        var arr_parent=[];
        var j=0;
        for(var i=0;i<n;i++){
            var arr_child = [];
            for(var k=0;k<2;k++){
                arr_child.push(m[j]);
                j++;
            }
            arr_parent.push(arr_child);
        }
        return arr_parent;
    },
    //数组去重
    repetition:function(m){
        for(var i=0;i<m.length;i++){
            for(var j=i+1;j<m.length;j++){
                if(m[i]==m[j]){
                    m.splice(j,1);
                }
            }
        }
        return m;
    },
    //二维数组去重
    twoRepetition:function(m){
        for(var i=0;i<m.length;i++){
            for(var j=i+1;j<m.length;j++){
                if(m[i][0]==m[j][0]){
                    m.splice(j,1);
                }
            }
        }
        return m;
    },
    //数组对象转二维数组
    arrObjToTwoArr:function(m){
//		console.log(m);
        var i=0;
        var arr_parent=[];
        for(var i=0;i<m.length;i++){
            var arr_child = [];
            $.each(m[i],function(key,val){
                arr_child.push(val);
            });
            arr_parent.push(arr_child.reverse());
        }
//		console.log(arr_parent);
        return arr_parent;
    }
});
function getNextMonth(date) {
    var arr = date.split('-');
    var year = arr[0]; //获取当前日期的年份
    var month = arr[1]; //获取当前日期的月份
    var day = arr[2]; //获取当前日期的日
    var days = new Date(year, month, 0);
    days = days.getDate(); //获取当前日期中的月的天数
    var year2 = year;
    var month2 = parseInt(month) + 1;
    if (month2 == 13) {
        year2 = parseInt(year2) + 1;
        month2 = 1;
    }
    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
        day2 = days2;
    }
    /*if (month2 < 10) {
        month2 = '0' + month2;
    }*/

    var t2 = year2 + '-' + month2 + '-' + day2;
    return t2;
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
function slideToggle(obj) {
    $(obj).next('.submenu').slideToggle().siblings('.submenu').slideUp();
}