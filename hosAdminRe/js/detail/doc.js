/**
 * 医生列表
 */
//点击修改医生
function edit_doc(m){
	var docId = $(m).parent().attr("data_id")
	window.localStorage.setItem("docId",docId);
	window.location.href = "edit_doc.html";
}
function add_doc_case(m) {
    var docId = $(m).parent().attr("data_id")
    window.localStorage.setItem("docId",docId);
    window.localStorage.setItem("case_type",'doc');
    window.location.href = "add_doc_case.html";
}
//删除医生
function dle_doc(m){
	var docId = $(m).parent().attr("data_id");
	var data = {
		"id":docId
	}
	$.get_ajax("/hospital/topthree/doctor/delete",data,function(data){
		if(data.success==true){
			window.location.href = "doc_list.html";
		}else{
			alert(data.data);
		}
	});
}

//初始化病种下拉选
function init_ill_select(m){
	//根据子科室id获取病种列表
	console.log(m);
	var data = {
		"subSubjectId":m
	}
	console.log(data);
	$.get_ajax("/hospital/disease/getListBySubSubject.json",data,function(res){
		console.log(res);
		if(res.success){
			var html = template('test_appoint_ill',res);
            $(".appoint_ill").empty().append('<option>请选择</option>').append(html);
			//$(".appoint_ill").append(html);
		}
	});
}






