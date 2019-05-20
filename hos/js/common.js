
var SERVER_ADDR = 'https://www.enuo120.com';//'http://www.enuo120.com:7070';//'http://www.enuo120.com';// /////;//'///;'//;////;//
function getHos(form) {
    /*var url = SERVER_ADDR + "/admin/hospital/getCertList.json";
    var Data = '';
    ajaxGetRetInfo(url,Data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            $('.newsHos').append('<option value="">根据医院筛选</option>');
            retInfo.data.forEach(function (value) {
                $('.newsHos').append('<option value="'+value.id+'" title="'+value.type+'">'+value.name+'</option>');
            });
            form.render('select', 'newsHos');//更新
        }
    },'请求失败', 'GET', undefined, undefined);*/
}
function getSaleman(form) {
  /*  var url = SERVER_ADDR + "/admin/salesman/getEnabledList.json";
    var Data = '';
    ajaxGetRetInfo(url,Data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            $('.kefuSelect').append('<option value="">根据客服筛选</option>');
            retInfo.data.forEach(function (value) {
                $('.kefuSelect').append('<option value="'+value.id+'">'+value.name+'</option>');
            });
            form.render('select', 'kefuSelect');//更新
        }

    },'请求失败', 'GET', undefined, undefined);*/
}
function getFrom(form) {
   /* var url = SERVER_ADDR + "/admin/allot/getStores.json";
    var Data = '';
    ajaxGetRetInfo(url,Data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            $('.from').append('<option value="">根据来源筛选</option>');
            retInfo.data.forEach(function (value) {
                $('.from').append('<option value="'+value.id+'">'+value.name+'</option>');
            });
            form.render('select', 'from');//更新
        }
    },'请求失败', 'GET', undefined, undefined);*/
}
function getFk(form,type) {
   /* var url = SERVER_ADDR + "/admin/allot/getDiseases.json";
    var Data = {};
    Data.type = type;
    ajaxGetRetInfo(url,Data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            $('.newsDisease').append('<option value="">根据病种筛选</option>');
            retInfo.data.forEach(function (value) {
                $('.newsDisease').append('<option value="'+value.id+'">'+value.name+'</option>');
            });
            form.render('select', 'newsDisease');//更新
        }
    },'请求失败', 'GET', undefined, undefined);*/
}
    //get请求
 function get_ajax(back_url,data,fun){
        $.ajax({
            url:back_url,
            type:"get",
            async:true,
            data:data,
            dataType:"json",
            statusCode:{
                403:function (data) {
                    //parent.location.href = "login.html";
                }
            },
            success:function(res){
                if(fun){
                    fun(res);
                }
            },
            error:function(res){
                console.log(res);
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
               // parent.location.href = "login.html";
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
                     // parent.window.location.href = '/hos/login.html';
                }
            },
            success: function (dataStr,status,readyState) {

                if(readyState.status === 200){
                    onSuccess(dataStr);
                }
            },
            error:function () {
                console.log(44)
                parent.layui.layer.closeAll();
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
function getNaturalWidth(img) {
    var image = new Image();
    image.src = img[0].src;
    var widheig = [];
    var naturalWidth = image.width;
    var naturalHeight = image.height;
    widheig.naturalWidth = naturalWidth;
    widheig.naturalHeight = naturalHeight;
    return widheig
}
var validate = {
    verify: function (val, str) {
        if (val == "") {
            alert(str + "不能为空");
            return false;
        } else {
            return true;
        }
    },
    //非数字验证
    verifyNum: function (val, str) {
        console.log(val + "," + validate.regNum(val));
        if (!validate.regNum(val)) {
            layer.alert(str + "必须是数字");
            return false;
        } else {
            return true;
        }
    },
    //正则判断是否为数字
    regNum: function (num) {
        var rgx = /^[0-9]*$/;///[0-9]+/;
        return rgx.test(num);
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