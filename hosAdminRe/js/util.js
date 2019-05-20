//1，设置公共的URL部分
function getUrl(){
return "http://127.0.0.1"//反向代理,不带端口
//	return "http://www.enuo120.com:7070";//测试环境
//		return "https://www.enuo120.com:443";//正式环境
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

/**
 * 工具函数
 */
//打开弹框
function open_box(){
	$('.shade').css("display","block");
	$('.popup_box').css("display","block");
}

//关闭弹框
function close_box(){
   	$('.shade').css("display","none");
	$('.popup_box,.people_box').css("display","none");
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
                    parent.location.href = "/hosAdminRe/login.html";
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
		var rgx = /^[1][3,4,5,7,8,9][0-9]{9}$/;
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
    //二维数组id去重
    twoRepetition:function(m){
        for(var i=0;i<m.length;i++){
            for(var j=i+1;j<m.length;j++){
                if(m[i]['id']==m[j]['id']){
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
		        	//parent.location.href = "/hosAdminRe/login.html";
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
		        	//parent.location.href = "/hosAdminRe/login.html";
		        }
	    	}
		});
	},
	//初始化select
    initSelect:function(url,temElm,elm,param){
        console.log(arguments)
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
                    $(elm).html("<option selected='selected' value='0'>请选择</option>");
                    var html = template(temElm,res);
                    $(elm).append(html);
                }else{
                    console.log(res.data);
                }
            });
        }

    },
    //初始化模板select
    initmubanSelect:function(url,temElm,elm,param){
            //有请求参数
            $.get_ajax(url,param,function(res){
                console.log(res);
                if(res.success){
                    if(res.data.length == 0){
                        $('.template_list').hide();
                        $('.hoverwen,.nosearchHover').show();
                    }else{
                        $('.template_list').show();
                        $('.hoverwen,.nosearchHover').hide();
                        $(elm).html("<option selected='selected' value='0'>请选择</option>");
                        var html = template(temElm,res);
                        $(elm).append(html);
					}
                }else{
                    console.log(res.data);
                }
            });


    },
	//初始化第二级select
	initChildSelect:function(url,param,temElm,elm,indexHint){
		console.log(param);
		$.get_ajax(url,param,function(res){
			console.log(res);
			if(res.success){
				$(elm).html("<option selected='selected' value='0'>"+indexHint+"</option>");
				var html = template(temElm,res);
				$(elm).append(html);
			}else{
				console.log(res.data);
			}
		});
	},
	
});
//获取地址栏url的参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return null;
}
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