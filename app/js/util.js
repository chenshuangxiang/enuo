//1，设置公共的URL部分
function getUrl(){
//	return "http://192.168.30.118:9090";
	return "http://192.168.30.120:9090";
}
var url = getUrl();
//2,设置token
//setToken();

function setToken(){
	var token = getToken();
	console.log(token);
	//给所有请求头添加token
	$.ajaxSetup({
		headers:{
			'token':token,
			'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
		}
	});
//	console.log("已设置token");
}
//获取指定cookie中的token
function getToken(){
	var token;
	var num=0;
	//console.log(document.cookie);
	var arr_cookie = document.cookie.split(";");
	//console.log(arr_cookie);
	for(var i=0;i<arr_cookie.length;i++){
		var temp = arr_cookie[i].split("=");
	//	console.log(temp);
		for(var k=0;k<temp.length;k++){
	//		console.log(temp[k]);//token
			if(temp[k] == "token"){
//				console.log("存在token");
				var k2 = k+1;
				token = temp[k2];//获取cookie中的token
				num=1;
				return token;
				break;
			}
			
		}
		//没token就跳转到登录页
		if(num !=1){
			window.location.href = "login.html";
		}
	}
}

//获取指定cookie中的userId
function getUserId(){
	var role;
	//console.log(document.cookie);
	var arr_cookie = document.cookie.split(";");
	//console.log(arr_cookie);
	for(var i=0;i<arr_cookie.length;i++){
		var temp = arr_cookie[i].split("=");
	//	console.log(temp);
		for(var k=0;k<temp.length;k++){
//			console.log(temp[k]);//role
			if(temp[k] == " userId"){
//				console.log(k);
				var k2 = k+1;
				userId = temp[k2];
//				console.log(userId);
				return userId;
			}
			
		}
	}
}




