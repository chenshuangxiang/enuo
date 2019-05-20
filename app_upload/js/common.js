var SERVER_ADDR = 'https://www.enuo120.com';//'http://127.0.0.1';//'http://www.enuo120.com:7070';////
document.write('<script src="/app/js/lib/layer.js?v=79b7829"><\/script>');
document.write('<link rel="stylesheet" href="/app/css/lib/layer.css?v=3be406e"/>');
var huliCardId = 261;//护理卡
var xiumeiIdAll = 284;//287//;//绣眉拼团
var xiumeiIdOne = 283;//286//绣眉个人
var xiumeiIdOneFive = 289;//绣眉三人
var xiumeiIdOneZhongxin = 291;//绣眉中信专享
var rotorBuy = 325;//300;//大转盘9.9商品
var sanbaProduct = 349;//300;//3.8女神节活动

//超声洁牙活动id
var toothPin = 354;//洁牙拼团活动
var toothPinActive = 10;
var toothActivityProductId = 12;
function wechat_redirect(link) { //授权地址
    return 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx93fbc4fe8202b82b&redirect_uri=' + link + '&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect';
}

//设置不切换城市的过期时间
if(window.location.href.indexOf('xywz.html') == -1){
    if(localStorage.getItem('removeTime') != null){
        setInterval(function () {
            var i = Number(localStorage.getItem('removeTime'));
            i++;
            localStorage.setItem('removeTime', i);
        },1000)
    }
}

/*document.addEventListener('plusready', function() {
    var webview = plus.webview.currentWebview();
    plus.key.addEventListener('backbutton', function() {
        webview.canBack(function(e) {
            if(e.canBack) {
                webview.back();
            } else {
                webview.close(); //hide,quit
                //plus.runtime.quit();
            }
        })
    });
});*/
function is_weixn(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
        return true;
    } else {
        return false;
    }
}
function nullWxHeadImgUrl(url) {
    if(url == null){
        return 'https://www.enuo120.com/upload/image/201712/21/hJiK53iGrvPoaZuhCHu.png';
    }else{
        return url;
    }
}
window.alert = function(name){
    var iframe = document.createElement("IFRAME");
    iframe.style.display="none";
    iframe.setAttribute("src", 'data:text/plain,');
    document.documentElement.appendChild(iframe);
    window.frames[0].window.alert(name);
    iframe.parentNode.removeChild(iframe);
}
/**
 * 返回结果为 RetInfo 结构，
 */
$(document).ready(function () {
    $('.chooseHref').click(function(){
        if($(this).attr("class").indexOf("on") == -1){
            $('#nav ul .on span').animate({bottom:-200},200);
            $('#nav ul .on').removeClass("on");
            $(this).addClass("on");
            $('#nav ul li span').eq(0).animate({bottom:50},200);
        }else{
            $('#nav ul li span').eq(0).animate({bottom:-200},200);
            $(this).removeClass("on");
        }
    });
    document.addEventListener("plusready", function() {
        // 注册返回按键事件
        if(window.location.href.indexOf('xywz.html') == -1){
            plus.key.addEventListener('backbutton', function() {
                // 事件处理
                //alert('物理返回');
                window.history.back();
            }, false);
        }
    });
    if(is_weixn()){
        if(sessionStorage.getItem("codeValue") == 'true'){
            sessionStorage.setItem("codeValue", 'false');
            commonGetCode.haveCodeGet();
        }else if(window.location.href.indexOf('vote.html') != -1 && localStorage.getItem('openid') == 'undefined'){
            commonGetCode.haveCodeGet();
        }else if(window.location.href.indexOf('vote.html') != -1 && localStorage.getItem('openid') == null){
            commonGetCode.haveCodeGet();
        }
    }
})
jQuery.extend({
    //非空验证
    verify:function(val,str){
        if(val == "" || val == undefined || val == "undefined"){
            alert(str);
            return false;
        }else{
            return true;
        }
    },
    //get请求
    get_listajax:function(back_url,data,fun,errorCallback){
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
                            window.location.href = 'bind_tel.html';
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
})
function wenxiuNum(num) {
    var returnNum = '000';
    if(num != null){
        if (num.length == 1) {
            return returnNum.substring(0, returnNum.length - 1) + num
        } else if (num.length == 2) {
            return returnNum.substring(0, returnNum.length - 2) + num
        } else if (num.length == 3) {
            return returnNum.substring(0, returnNum.length - 3) + num
        }
    }
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
           /* $('body').prepend('<div id="loading"><img src="../img/loading.gif?v=7c0ef29"></div>')*/

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
            cache:false,
            timeout: 15000,
            statusCode:{
              403:function (data) {
                  setTimeout(function () {
                      if(localStorage.getItem('followBiaoji') == 1){
                          window.location.href = 'follow.html';
                      }else{
                          if(data.getResponseHeader('isAuthorization') == 'true'){
                              //alert('isAuthorization')
                              var str = data.getResponseHeader('userAuthUrl');  //跳去微信授权
                              str = str.replace(/REDIRECT_URI/, encodeURI(window.location.href));  //回跳当前页面
                              sessionStorage.setItem("codeValue", 'true');
                              window.location.href = str;
                          }else{
                              if(window.location.href.indexOf('activity_recharge.html') != -1){
                                  window.location.href = 'bind_tel.html?type=activityrecharge';
                              }else if(window.location.href.indexOf('browDetail.html') != -1 || window.location.href.indexOf('browBuyOwn.html') != -1  ||
                                  window.location.href.indexOf('browBuyOneFive.html') != -1  || window.location.href.indexOf('browBuyZhongxin.html') != -1 ||
                                  window.location.href.indexOf('browList.html') != -1 ||
                                  window.location.href.indexOf('rotor.html') != -1 || window.location.href.indexOf('scratch.html') != -1 ||
                                  window.location.href.indexOf('cp.html') != -1 || window.location.href.indexOf('rotorNine.html') != -1 ||
                                  window.location.href.indexOf('rotorBuy.html') != -1 ||  window.location.href.indexOf('familyBeauty.html') != -1 ||
                                  window.location.href.indexOf('myHealthFile.html') != -1 || window.location.href.indexOf('familyAll.html') != -1 ||
                                  window.location.href.indexOf('realCertify.html') != -1 || window.location.href.indexOf('getOrder.html') != -1){
                                  window.location.href = 'bind_tel.html?returnUrl=' + window.location.href;
                              }else {
                                  if(window.location.href.indexOf('browIndex.html') != -1 || window.location.href.indexOf('familyBeautyIndex.html') != -1 ||
                                      window.location.href.indexOf('sanbaIndex.html') != -1) {   //绣眉首页不让跳登录
                                      $('.browIndexOneMe').hide();
                                  }else{
                                      window.location.href = 'bind_tel.html';
                                  }
                              }
                          }
                      }
                  },800);
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
var commonGetCode = {
    haveCodeGet:function () {  //有code请求
        //localStorage.setItem('code',getQueryString('code'));
        var url = SERVER_ADDR + '/app/common/authorization';
        var Data = {};
        Data.code = getQueryString('code');
        /*if(SERVER_ADDR == 'http://www.enuo120.com'){*/
            ajaxGetRetInfo(url,Data,this.checkCodeSuccess,'请求失败', 'GET', undefined, undefined);
        /*}*/
    },
    checkCodeSuccess:function (retInfo) {
        //follow.wecat();
        console.log(retInfo)
        if(retInfo.success == true){
            localStorage.setItem('openid',retInfo.data.openId);
        }else{
            //follow.wecat();
            //alert('5');
            localStorage.setItem('followBiaoji',1);
            //window.location.href = 'follow.html';

        }
    }
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
            //window.location.href = 'follow.html';
            //sessionStorage.setItem("follw", 'false');
            //sessionStorage.setItem("follw", 'true');
        }else if(window.location.href.indexOf('user_center') != -1){
            window.location.href = 'xywz.html';
        }
    },
    getNewsCount:function () {
        var url = SERVER_ADDR + "/app/user/message/getUserUnreadMessageCount.json";
        var data = '';
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            //layer.close(index);
            if(retInfo.success){
                if(retInfo.data.messageCount > 0){
                    $('.newsCount').show().text(retInfo.data.messageCount);
                    $('.newsBiaoUserCenter').show();
                }else{
                    $('.newsCount').hide().text(retInfo.data.messageCount);
                }
            }else{
                alert(retInfo.data);
            }
        },'请求失败', 'GET', undefined, undefined);
    },
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
//数组中删掉指定数值
Array.prototype.removeArrayOne = function (value) {
    var index = this.indexOf(value);
    console.log(index)
    this.splice(index, 1);
}
//微信放大图片
function funcReadImgInfo(imgObj){
    var imgs = [];
    for(var i=0; i<imgObj.length; i++){
        imgs.push(imgObj.eq(i).attr('src'));
        imgObj.eq(i).click(function(){
            var nowImgurl = $(this).attr('src');
            WeixinJSBridge.invoke("imagePreview",{
                "urls":imgs,
                "current":nowImgurl
            });
        });
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
/*倒计时秒数*/
function countDown(times) {
    var timer = null;
    times = times / 1000;
    countDowmSet(times);
    timer = setInterval(function () {
        countDowmSet(times);
        times--;
    }, 1000);
    if (times <= 0) {
        clearInterval(timer);
    }
}
function countDowmSet(times) {
    var hour=0,
        minute=0,
        second=0;//时间默认值
    if(times > 0){
        hour = Math.floor(times / (60 * 60));
        minute = Math.floor(times / 60) - (hour * 60);
        second = Math.floor(times) - (hour * 60 * 60) - (minute * 60);
    }
    if (hour <= 9) hour = '0' + hour;
    if (minute <= 9) minute = '0' + minute;
    if (second <= 9) second = '0' + second;
    //
    $('.timeDao').text(hour+":"+minute+":"+second);
}
/*耗时*/
function countHao(times) {
    var timer = null;
    times = times / 1000;
    countDowmSet(times);
    var hour=0,
        minute=0,
        second=0;//时间默认值
    if(times > 0){
        hour = Math.floor(times / (60 * 60));
        minute = Math.floor(times / 60) - (hour * 60);
        second = Math.floor(times) - (hour * 60 * 60) - (minute * 60);
    }
    if (hour <= 9) hour = '0' + hour;
    if (minute <= 9) minute = '0' + minute;
    return hour+"时"+minute+"分"
}

/*判断两个时间的大小*/
function compareDate(){
    //对获得的时间戳区间与既定的时间戳进行比对
    var baseDateNow = new Date().getTime();
    var baseDateActive = new Date('2019-03-09').getTime();
    //被比较的开始时间必须大于等于既定的开始时间
    if (baseDateNow >= baseDateActive) {
        return true;
    } else {
        return false;
    }
}
function checkMobile( phoneNum, errorMsg) {
    'use strict';
    if (!phoneNum) {
        alert(errorMsg);
    }
    return phoneNum;
}
//判断是否全是中文
function isChn(str){
    var reg=/^[\u4E00-\u9FA5]+$/;
    if(!reg.test(str)){
        //alert("不全是中文");
        return false;
    }
    //alert("全是中文");
    return true;
}
//获得年龄
function getAge(birthday)
{
    //出生时间 毫秒
    var birthDayTime = new Date(birthday).getTime();
    //当前时间 毫秒
    var nowTime = new Date().getTime();
    //一年毫秒数(365 * 86400000 = 31536000000)
    return Math.ceil((nowTime-birthDayTime)/31536000000);

}