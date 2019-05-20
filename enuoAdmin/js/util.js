//1，设置公共的URL部分
function getUrl(){
	return "http://127.0.0.1"//反向代理,不带端口
//	return "http://www.enuo120.com:7070";//测试环境
//	return "https://www.enuo120.com";//正式环境
    //return 'http://qb97ns.natappfree.cc';//香富环境
    //     return 'http://127.0.0.1:80/zgh-enuo-service'
}
var url = getUrl();

//2,设置token
//setToken();
//function setToken(){
////	console.log(token);
//	//给所有请求头添加token
//	$.ajaxSetup({
//		headers:{
//			"cache-control": "no-cache",
//			'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
//		}
//	});
////	console.log("已设置token");
//}

function getUncheckHosCount() {
    //var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
    var url = getUrl() + "/admin/hospital/count";
    var data = {};
    data.status = 'unchecked';
    ajaxGetRetInfo(url,data,function (retInfo) {
        console.log(retInfo)
        //layer.close(index);
        if(retInfo.success){
            $('.uncheckHosCount').text(retInfo.data + '家');
            $('.uncheckCountWarn').text(retInfo.data);
            if(retInfo.data > 0){
                $('.uncheckHosCountP,.uncheckCountWarn').css('display','inline-block');
            }else{
                $('.uncheckHosCountP,.uncheckCountWarn').hide();
            }

        }else{
            alert(retInfo.data);
        }
    },'请求失败', 'GET', undefined, undefined);
}
/**
 * 工具函数
 */
function noData(name) { //undefind数据 返回name
    if(!name || name == '' || name == 'undefined'){
        name = '无';
    }
    return name
}
//打开弹框
function open_box(){
	$('.shade').css("display","block");
	$('.popup_box').css("display","block");
}
//关闭弹框
function close_box(){
   	$('.shade').css("display","none");
	$('.popup_box').css("display","none");
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
//获取地址栏url的参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return null;
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
                    parent.location.href = "/enuoAdmin/login.html";
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
    onSuccess(retInfo);
}
/**
 * 存储
 */
jQuery.extend({
	//清除cookie
	clearCookie:function(){ 
		var keys=document.cookie.match(/[^ =;]+(?=\=)/g); 
		if (keys) { 
			for (var i = keys.length; i--;){
				document.cookie=keys[i]+'=0;expires=' + new Date( 0).toUTCString() 
			}
		} 
	},
	//获取指定cookie中的指定的val
	getCookie:function(ky){
		var val;
		//console.log(document.cookie);
		var arr_cookie = document.cookie.split(";");
		//console.log(arr_cookie);
		for(var i=0;i<arr_cookie.length;i++){
			var temp = arr_cookie[i].split("=");
		//	console.log(temp);
			for(var k=0;k<temp.length;k++){
	//			console.log(temp[k]);
				if(temp[k] == ky){
	//				console.log(k);
					var k2 = k+1;
					val = temp[k2];//获取cookie中的值
	//				console.log(val);
					return val;
				}
				
			}
		}
	},
	//获取localstorage中指定的值
	get_storage:function(m){
		var value = window.localStorage.getItem(m);
	//	console.log(value);
		return value;
	}
});

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
			alert(str+"不合法");
			return false;
		}else{
			return true;
		}
	},
	//正则判断是否为数字
	regNum:function(num){
		var rgx = /[0-9]+/;
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
			})
			arr_parent.push(arr_child.reverse());
		}
//		console.log(arr_parent);
		return arr_parent;
	}
	
});

/**
 * 封装ajax
 */
jQuery.extend({
	//post请求
	post_ajax:function(back_url,data,fun){
		$.ajax({
			url:url+""+back_url,
			type:"post",
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
	},
    postHeader_ajax:function(back_url,data,fun){
        $.ajax({
            url:url+""+back_url,
            type:"post",
            async:true,
            headers: {'Content-type': 'application/json;charset=UTF-8'},
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
    },
	//get请求
	get_ajax:function(back_url,data,fun){
		$.ajax({
			url:url+""+back_url,
			type:"get",
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
	},
	//初始化select
	initSelect:function(url,temElm,elm,param,objType){
		if(arguments.length==3){
			$.get_ajax(url,"",function(res){
				console.log(res);
				if(res.success){
					var html = template(temElm,res);
					$(elm).append(html);
				}
			});
		}else if(arguments.length==4){
			//有请求参数
			$.get_ajax(url,param,function(res){
				console.log(res);
				if(res.success){
					$(elm).html("<option selected='selected'>请选择</option>");
					var html = template(temElm,res);
					$(elm).append(html);
				}else{
					console.log(res.data);
				}
			});
		}else if(arguments.length==5){
            //有请求参数
            $.get_ajax(url,param,function(res){
                console.log(res);
                if(res.success){
                    $(elm).html("<option selected='selected'>请选择</option>");
                    $(elm).append('<option value="'+res.data.id+'">'+res.data.name+'</option>');
                }else{
                    console.log(res.data);
                }
            });
        }
		
	},
    initHosSelect:function(url,temElm,elm,param){
        if(arguments.length==3){
            $.get_ajax(url,"",function(res){
                console.log(res);
                if(res.success){
                    var html = template(temElm,res);
                    $(elm).append(html);
                    $('.hosSelect').comboSelect();
                }
            });
        }else if(arguments.length==4){
            //有请求参数
            $.get_ajax(url,param,function(res){
                console.log(res);
                if(res.success){
                    $(elm).html("<option selected='selected'>请选择</option>");
                    var html = template(temElm,res);
                    $(elm).append(html);
                }else{
                    console.log(res.data);
                }
            });
        }

    },
	//初始化第二级select
	initChildSelect:function(url,param,temElm,elm,indexHint){
		console.log(param);

		$.get_ajax(url,param,function(res){
			console.log(res);
			if(res.success){
				$(elm).html("<option selected='selected'>"+indexHint+"</option>");
				var html = template(temElm,res);
				$(elm).append(html);
			}else{
				console.log(res.data);
			}
		});
	}
});
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
//用户历史信息
function userOpen(m){
    var username = $(m).attr('valueusername');
    var mobile = $(m).attr('valuemobile');
    layui.use(['form','layer','jquery','layedit','table'],function() {
        var form = layui.form,
            table = layui.table,
            layer = parent.layer === undefined ? layui.layer : parent.layer,
            laypage = layui.laypage,
            layedit = layui.layedit,
            $ = layui.jquery;
        var index = layer.open({
            title : "用户历史信息",
            type : 2,
            area: ['97%','97%'],
            content : 'historyRecord.html?mobile=' + mobile + '&username='+ username + '&v=777',
            success : function(layero, index){

            },
            cancel: function(index, layero){
                layer.close(index)
                return false;
            }
        })
    })
    /*$(".shade,.orderOpen").show();
    var dataid = $(m).attr("data_id");*/
}
//用户历史信息
function openPerson(m){
    var id = $(m).attr('valueid');
    layui.use(['form','layer','jquery','layedit','table'],function() {
        var form = layui.form,
            table = layui.table,
            layer = parent.layer === undefined ? layui.layer : parent.layer,
            laypage = layui.laypage,
            layedit = layui.layedit,
            $ = layui.jquery;
        var index = layer.open({
            title : "用户",
            type : 2,
            area: ['97%','97%'],
            content : 'openPerson.html?id=' + id + '&v=777',
            success : function(layero, index){

            },
            cancel: function(index, layero){
                layer.close(index)
                return false;
            }
        })
    })
    /*$(".shade,.orderOpen").show();
    var dataid = $(m).attr("data_id");*/
}
function rechargeAmountOpen(m){
    var id = $(m).attr('data_id');
    var username = $(m).attr('data_username');
    layui.use(['form','layer','jquery','layedit','table'],function() {
        var form = layui.form,
            table = layui.table,
            layer = parent.layer === undefined ? layui.layer : parent.layer,
            laypage = layui.laypage,
            layedit = layui.layedit,
            $ = layui.jquery;
        var index = layer.open({
            title : "用户余额变动明细 - " + username,
            type : 2,
            area: ['95%','95%'],
            content : 'rechargeAmountChange.html?id=' + id + '&v=777',
            success : function(layero, index){

            },
            cancel: function(index, layero){
                layer.close(index)
                return false;
            }
        })
    })
    /*$(".shade,.orderOpen").show();
    var dataid = $(m).attr("data_id");*/

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
function returnSubstringSize(val,size){
    if(val.length > size){
        return val.substring(0, size)+'..';
    }else{
        return val;
    }
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




