
var SERVER_ADDR = 'http://www.enuo120.com:7070';;////'http://www.enuo120.com:7070';//'http://127.0.0.1:7070';// /////;//'///;'//;////;//
var chatTime;
function getDocLevel(form) {
    var url = SERVER_ADDR + "/common/getDoctorType.json";
    var Data = '';
    ajaxGetRetInfo(url,Data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            retInfo.data.forEach(function (value) {
                $('.docLevel').append('<option value="'+value.id+'">'+value.name+'</option>');
            });
            form.render('select', 'docLevel');//更新
        }
    },'请求失败', 'GET', undefined, undefined);
}
function getKs(form) {
    var url = SERVER_ADDR + "/hospital/getSubjects.json";
    var Data = '';
    ajaxGetRetInfo(url,Data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            retInfo.data.forEach(function (value) {
                $('.ks').append('<option value="'+value.id+'" title="'+value.id+'">'+value.name+'</option>');
            });
            form.render('select', 'ks');//更新
        }
    },'请求失败', 'GET', undefined, undefined);
}
function getKsChild(form,m) {
    var url = SERVER_ADDR + "/hospital/getSubjects.json";
    var Data = '';
    ajaxGetRetInfo(url,Data,function (retInfo) {
        console.log(retInfo)
        var data;
        if(retInfo.success){
            for(var i=0;i<retInfo.data.length;i++){
                console.log(m)
                if(retInfo.data[i].id==m){
                    data = retInfo.data[i];
                }
            }
            console.log(data);
            $('.ksChild').empty().append('<option value="">请选择子科室</option>');
            data.item.forEach(function (value) {
                $('.ksChild').append('<option value="'+value.id+'">'+value.name+'</option>');
            });
            form.render();//更新
        }
    },'请求失败', 'GET', undefined, undefined);
}
function getProductCategory(form,m) { //项目分类
    var url = SERVER_ADDR + "/common/getProductCategorys.json";
    var Data = {};
    Data.type = m;
    ajaxGetRetInfo(url,Data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            $('.productCategory').empty().append('<option value="">请选择项目分类</option>');
            retInfo.data.forEach(function (value) {
                $('.productCategory').append('<option value="'+value.id+'">'+value.name+'</option>');
            });
            form.render();//更新
        }
    },'请求失败', 'GET', undefined, undefined);
}
function getTyq(form,m) { //体验券
    var url = SERVER_ADDR + "/hospital/experienceCoupon/getTypeList.json";
    var Data = {};
    Data.type = m;
    ajaxGetRetInfo(url,Data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            retInfo.data.forEach(function (value) {
                $('.tyqList').append('<option value="'+value.id+'">'+value.experienceCouponName+'</option>');
            });
            form.render();//更新
        }
    },'请求失败', 'GET', undefined, undefined);
}
function getDoc(form) {
    var url = SERVER_ADDR + "/hospital/doctor/getListBySelect.json";
    var Data = '';
    ajaxGetRetInfo(url,Data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            retInfo.data.forEach(function (value) {
                $('.hosDoc').append('<option value="'+value.id+'" title="'+value.id+'">'+value.name+'</option>');
            });
            form.render();//更新
        }
    },'请求失败', 'GET', undefined, undefined);
}
function getRole(form) { //权限角色列表
    var url = SERVER_ADDR + "/hospital/getRoleList.json";
    var Data = '';
    ajaxGetRetInfo(url,Data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            retInfo.data.forEach(function (value) {
                $('.role').append('<input type="checkbox" lay-filter="role" name="role" title="'+value.name+'" value="'+value.id+'">');
            });
            form.render();//更新
        }

    },'请求失败', 'GET', undefined, undefined);
}
function getSection(form) {
    var url = SERVER_ADDR + "/hospital/department/getListBySelect.json";
    var Data = '';
    ajaxGetRetInfo(url,Data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            $('.section').append('<option>直属员工</option>');
            retInfo.data.forEach(function (value) {
                $('.section').append('<option value="'+value.id+'">'+value.name+'</option>');
            });

            form.render();//更新
        }
    },'请求失败', 'GET', undefined, undefined);
}
function getFentoNameSelect(form,type) {
    var url = SERVER_ADDR + "/hospital/employee/getListByRole.json";
    var Data = {};
    Data.type = type;
    ajaxGetRetInfo(url,Data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            //$('.fenTo').empty().append('<option value="">请选择分诊人员</option>');
            retInfo.data.forEach(function (value) {
                console.log(type)
                if(type == 'doctor'){
                    $('.fenTo').append('<option  title="'+value.id+'" titletype="'+type+'">'+value.name+'(医生)</option>');
                }else if(type == 'doctorHelpmate'){
                    $('.fenTo').append('<option  title="'+value.id+'" titletype="'+type+'">'+value.name+'(现场咨询)</option>');
                }else if(type == 'guestService'){
                    $('.kefu').append('<option value="'+value.id+'" title="'+type+'">'+value.name+'(客服)</option>');
                }else if(type == 'market'){
                    $('.kefu').append('<option value="'+value.id+'" title="'+type+'">'+value.name+'(市场)</option>');
                }
            });
            form.render();//更新
        }
    },'请求失败', 'GET', undefined, undefined);
}
function getDoctorNameFrontSelect() {
    var url = SERVER_ADDR + "/hospital/employee/getListByRole.json";
    var Data = {};
    Data.type = 'doctor';
    ajaxGetRetInfo(url,Data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            $('.fenToDoctor').empty().append('<option value="">请选择医生</option>');
            retInfo.data.forEach(function (value) {
                $('.fenToDoctor').append('<option value="'+value.id+'">'+value.name+'</option>');
            });
           /* for(var i = 0; i < $('.fenToName').length;i++){
                $('.fenToName').eq(i).val(tabledata[i].receiverId);
            }*/
        }
    },'请求失败', 'GET', undefined, undefined);
}
function getZixunNameFrontSelect() {
    var url = SERVER_ADDR + "/hospital/employee/getListByRole.json";
    var Data = {};
    Data.type = 'doctorHelpmate';
    ajaxGetRetInfo(url,Data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            $('.fenToZixun').empty().append('<option value="">请选择现场咨询</option>');
            retInfo.data.forEach(function (value) {
                $('.fenToZixun').append('<option value="'+value.id+'">'+value.name+'</option>');
            });
            /* for(var i = 0; i < $('.fenToName').length;i++){
                 $('.fenToName').eq(i).val(tabledata[i].receiverId);
             }*/
        }
    },'请求失败', 'GET', undefined, undefined);
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
function getTemplateProject(form) {
    var url = SERVER_ADDR + "/hospital/visit/hospitalProjectTemplate/search.json";
    var data = '';
    ajaxGetRetInfo(url,data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            retInfo.data.forEach(function (value) {
                $('.projectName').append('<option value="'+value.id+'">'+value.name+'</option>');
            });
            form.render();//更新
        }
    },'请求失败', 'GET', undefined, undefined);
}
function noData(name) { //undefind数据 返回name
    if(!name || name == '' || name == 'undefined'){
        name = '无';
    }
    return name
}
//编辑医生初始化坐诊表格
function get_work_tb(){
    var arr_job=[];
    //得到坐诊数据
    $(".week input").each(function(){
        var work_obj={};//当前子表格对象
        work_obj.week=$(this).attr("data_week");
        work_obj.isMorning=$(this).attr("data_morning");
        work_obj.reservationQuantity=$(this).val();
        //处理空
        if($(this).val() == ""){
            work_obj.reservationQuantity=0;
            console.log(work_obj.reservationQuantity);
        }
        console.log(work_obj);
        //处理非数字
        if(!validate.regNum(work_obj.reservationQuantity)){
            alert("坐诊表数据必须为数字");
            return false;
        }
        arr_job.push(work_obj);
    });
    console.log(arr_job);
    return arr_job;
}
function init_work_tb(m){
    var arr_job = m;
    console.log(arr_job);
    var i=0;
    $(".week input").each(function(){
        for(var i=0;i<arr_job.length;i++){
            //判断是否同一天
            if($(this).attr("data_week")==arr_job[i].week){
//				console.log(arr_job[i].week+","+$(this).attr("data_morning")+";;;;;"+arr_job[i].isMorning+","+i);
                //判断是同一个上午否
                if($(this).attr("data_morning")==""+arr_job[i].isMorning){
                    $(this).val(arr_job[i].reservationQuantity);
                }
            }
        }
    });
}
/*上传加载图片*/
//初始化图片
function init_img(file){
//	console.log(file);
    var html="";
    for(var i=0;i<file.length;i++){

        html =html+'<div class="initImg" style="border: 1px solid #dddddd" data_id="0" data_val="0">' +
            '<img style="height: inherit" onclick="delphoto(this);stopEvt(event)" class="closePhoto" src="img/closePhoto.png">' +
            '<img src="'+file[i]+'"></div>'
    }
    $(".imgList").html(html);
}
function delphoto(obj) {
    /*  $(".preview div").each(function(){*/
    if($(obj).parent().attr("data_id")==0){
        var index = $(obj).parent().attr("data_val");
        console.log(index);
        arr_pic.splice(index,1);//删除对应的元素
        console.log(arr_pic);
    }
    init_img(arr_pic);//初始化图片
    /*});*/
}
function stopEvt(e) {
    e.stopPropagation();//阻止点击事件向上冒泡
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
                    window.location.href = '/hosAdmin/login.html';
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
function postget_ajax(back_url,data,type,fun){
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
                window.location.href = '/hosAdmin/login.html';
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
                      window.location.href = '/hosAdmin/login.html';
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
//获取列表的值
function getResult(m){
    var arrResult = [];
    $(m).each(function(){
//		console.log($(this).val());
        arrResult.push($(this).val()+"");
    });
    return arrResult;
}
//获取列表的值
function getMubanResult(m){
    var arrResult = [];
    $(m).each(function(){
//		console.log($(this).val());
        arrResult.push($(this).val()+"");
    });
    arrResult = arrResult.join('|');
    return arrResult;
}
//数组转哈希数组
function toHash(m){
//	var arr_hash2 =[];
//	for(var i=0;i<$(m).length;i++){
//		arr_hash2["k"+i]=$(m)[i];
//	}
//	console.log(arr_hash2);

    var arr_hash ={};
    for(var i=0;i<$(m).length;i++){
        arr_hash[""+i]=$(m)[i];
    }
//	console.log(arr_hash);
    return arr_hash;
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
function ischinese(s){
    var ret=true;
    for(var i=0;i<s.length;i++)
        ret=ret && (s.charCodeAt(i)>=10000);
    return ret;
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