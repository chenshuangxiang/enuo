//初始化地级市列表
function initCity(m){
	var data = {
		"parentId":m
	}
	console.log(data);
	$.initChildSelect("/common/getAreaList.json",data,'test_city',".hos__address_city","地级市");
}

//初始化地级市的县级市，区列表
function initCounty(m){
	var data = {
		"parentId":m
	}
	console.log(data);
	$.initChildSelect("/common/getAreaList.json",data,'test_county',".hos__address_county","县市、区");
}

//初始化子科室列表
function init_child_ks(m){
	var data = {
		"subjectId":m
	}
	console.log(data);
	$.initChildSelect("/admin/subSubject/getChildren.json",data,'test_child_ks_list',".hos_child_ks","子科室");
}

//查看医院
function lookHos(m){
	var hos_id = $(m).parents().attr("data_id");
	console.log(hos_id);
	window.localStorage.setItem("hos_id",hos_id);
	window.location.href="hos_detail.html";
}
//编辑医院
function editHos(m){
	var hos_id = $(m).parents().attr("data_id");
	console.log(hos_id);
	window.localStorage.setItem("hos_id",hos_id);
	window.location.href="edit_hos.html";
}
//删除医院
function delHos(m){
	var hos_id = $(m).parents().attr("data_id");
	console.log(hos_id);
	var data = {
		"id":hos_id
	}
	get_ajax("/admin/hospital/delete",data,function(data){
		if(data.success==true){
			console.log("删除医院成功");
		}else{
			console.log(data.data);
		}
	});
}

//审核医院
function checkHos(m){
	var hos_id = $(m).parents().attr("data_id");
	console.log(hos_id);
	window.localStorage.setItem("hos_id",hos_id);
	$(".shade,.popup_box_shenhe").show();
}
function resetHosStatus(m) {
    var hos_id = $(m).parents().attr("data_id");
    console.log(hos_id);
    window.localStorage.setItem("hos_id",hos_id);
    $(".shade,.popup_box_status").show();
}
//设置审核状态
var flag=true;
$(".enabled,.disable").click(function(){
	flag = $(this).addClass("bg_green").attr("data_val");
	$(this).siblings().removeClass("bg_green");
	console.log(flag);
	if(flag=="false"){
		console.log("未通过");
		$(".cause_parent").show();	
	}else{
		$(".cause_parent").hide();
	}
});
//审核确定
$(".confirm").click(function(){
	$(".shade,.popup_box").hide();
	var data = {
		"id":$.get_storage("hos_id"),
		"passed":flag,
		"reason":$(".cause").val()
	}
	console.log(data);
	
	if(flag=="false"){
		if(!$.verify($(".cause").val(),"未通过原因")){return false;}
	}
	
	$.post_ajax("/admin/hospital/check",data,function(data){
		if(data.success==true){
			alert("审核完成");
			//window.location.href = "hos_list.html";
			parent.window.location.reload();
		}else{
			alert(data.data);
		}
	});
});
//状态确定
$(".confirmSureStatus").click(function(){
    $(".shade,.popup_box").hide();
    var data = {
        "id":$.get_storage("hos_id"),
        "businesStatus":$('.hosStatus').val()
    }
    console.log(data);
    $.post_ajax("/admin/hospital/updateStatus",data,function(data){
        if(data.success==true){
            alert("状态修改成功");
            window.location.href = "hos_list.html";
        }else{
            alert(data.data);
        }
    });
});

//判断是否是美容医院
function beautyOfHos(m){
	//如果是美容医院，科室默认选择，且不能点击
	if(m==6){
		$(".hos_ks>[value='11']").attr("selected","selected").parent().attr("disabled","disabled");
		//初始化子科室列表
		init_child_ks(11);
	}else{
//		console.log("解除");
		$(".hos_ks").removeAttr("disabled");
		$(".hos_ks>[value='11']").removeAttr("selected");
	}
}


