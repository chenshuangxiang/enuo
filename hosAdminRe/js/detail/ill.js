/**
 *,2，编辑疾病页面
 */
//编辑疾病
function ill_edit(m){
	var cure_id = $(m).parents().attr("data_id");
	console.log(cure_id);
	window.localStorage.setItem("cure_id",cure_id);
	window.location.href="edit_ill.html";
}





