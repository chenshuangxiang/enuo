/**
 *,1，添加疾病页面
 */
var num=1;
//添加疾病，增约定效果
function addResult(m){
	num++;
	var html = "<p>"
				+"<span>"+num+".</span>"
				+"<input type='text' class='appoint_result' placeholder='如' />"
				+"<span class='font_green' onclick='delResult(this)'> [-]</span>"
				+"</p>";
	$(m).parents(".appoint_result_list").append(html);
}

//添加疾病，减约定效果
function delResult(m){
	num--;
	$(m).parent("p").remove();
}

var num1=1;
//添加疾病，增谅解
function addForgive(m){
	num1++;
	var html = "<p>"
				+"<span>"+num1+".</span>"
				+"<input type='text' class='forgive' placeholder='如' />"
				+"<span class='font_green' onclick='delForgive(this)'> [-]</span>"
				+"</p>";
	$(m).parents(".forgive_list").append(html);
}

//添加疾病，减约定效果
function delForgive(m){
	num1--;
	$(m).parent("p").remove();
}

//获取约定效果列表
function getResult(m){
	var arrResult = [];
	$(m).each(function(){
//		console.log($(this).val());
		arrResult.push($(this).val()+"");
	});
	return arrResult;
}

/**
 *,2，编辑疾病页面
 */

//初始化约定效果
function init_appoint_result(m,tag){
	var html = "";
//	m=["aa","bb"];
	for(var i=0;i<m.length;i++){
		if(i==0){
			html=html+"<p>"
				+"<span>"+ (i+1) +".</span>"
				+"<input type='text' class='appoint_result' placeholder='如' value='"+m[i]+"'/>"
				+"<span class='font_green' onclick='addResult(this)'> [+]</span>"
				+"</p>";
		}
		if(i>0){
			html=html+"<p>"
				+"<span>"+(i+1)+".</span>"
				+"<input type='text' class='appoint_result' placeholder='如' value='"+m[i]+"'/>"
				+"<span class='font_green' onclick='delResult(this)'> [-]</span>"
				+"</p>";
		}
	}
	$(tag).html(html);
}

//初始谅解
function init_forgive(m,tag){
	var html = "";
//	m=["cc","dd"];
	for(var i=0;i<m.length;i++){
		if(i==0){
			html=html+"<p>"
				+"<span>"+ (i+1) +".</span>"
				+"<input type='text' class='forgive' placeholder='如' value='"+m[i]+"'/>"
				+"<span class='font_green' onclick='addForgive(this)'> [+]</span>"
				+"</p>";
		}
		if(i>0){
			html=html+"<p>"
				+"<span>"+ (i+1) +".</span>"
				+"<input type='text' class='forgive' placeholder='如' value='"+m[i]+"'/>"
				+"<span class='font_green' onclick='delForgive(this)'> [-]</span>"
				+"</p>";
		}
	}
	$(tag).html(html);
}



