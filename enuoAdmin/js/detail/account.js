//编辑账号
function account_edit(m){
	var account_id = $(m).parents().attr("data_id");
	console.log(account_id);
	window.localStorage.setItem("account_id",account_id);
	window.location.href="edit_account.html";
}
//删除账号
function account_delete(m){
	var account_id = $(m).parents().attr("data_id");
	//...
}

