//前端生成验证码
$(function(){
	get_msg();
});
var verifical_text="";//保存生成的验证码
function get_msg(){
	validateCode(4);
	$(".verifyPhoto").text(verifical_text).css({"color":"rgb("+r+","+g+","+b+")","font-size":"30px","letter-spacing":"5px","text-indent":"10px"});
}
function validateCode(n){
	//生成随机字符颜色
	r = Math.floor(Math.random()*256);
	g = Math.floor(Math.random()*256);
	b = Math.floor(Math.random()*256);
	
	//验证码中可能包含的字符
	var s="abcdefghijklmnopqrstuvwxyz0123456789";
	//利用循环，随机产生验证码中的每个字符
	verifical_text="";
	for(var i=0;i<n;i++){
		var index=Math.floor(Math.random()*36);//随机产生一个0-62之间的数字
		verifical_text+=s.charAt(index);//取出指定下标字符串
	}
	console.log(verifical_text);
}

