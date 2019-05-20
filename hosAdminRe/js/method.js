//修改版本号
//var VERSION = 123;
$(document).ready(function(){
	/*$("script").each(function(){
//		console.log($(this).attr('src'));
		if($(this).attr('src')){
			if($(this).attr('src').indexOf('?num') == -1){
                var NUM = $(this).attr('src')+"?num="+VERSION;
//			console.log(NUM);
                $(this).attr('src',NUM);
			}
		}
	});
	$("link").each(function(){
//		console.log($(this).attr('href'));
		if($(this).attr('href')){
                var NUM = $(this).attr('href')+"?num="+VERSION;
//			console.log(NUM);
                $(this).attr('href',NUM);
		}
	});*/
});

//表单启用与禁用
var flag=true;
$(".enabled,.disable").click(function(){
	flag = $(this).addClass("bg_green").attr("data_val");
	$(this).siblings().removeClass("bg_green");
	console.log(flag);
});
//是否引流
var flagyinliu=true;
$(".enabledyinliu,.disableyinliu").click(function(){
    flagyinliu = $(this).addClass("bg_green").attr("data_val");
    $(this).siblings().removeClass("bg_green");
    console.log(flagyinliu);
});
//勾选
$(function(){
	//勾选一个
	$(".content .check").click(function(){
//		console.log($(this).attr("data_flag"));
		if($(this).attr("data_flag")=="0"){
			$(this).find("img").attr("src","img/activity_manage/select.png");
			$(this).attr("data_flag","1");
		}else{
			$(this).find("img").attr("src","img/activity_manage/no_select.png");
			$(this).attr("data_flag","0");
		}
	});
	
	//全选
	$(".content .all_check").click(function(){
//		console.log($(this).attr("data_flag"));
		if($(this).attr("data_flag")=="0"){
			console.log($(".content .check"));
			$(".content .check").find("img").attr("src","img/activity_manage/select.png");
			$(".content .check").attr("data_flag","1");
			$(this).attr("data_flag","1");
		}else{
			$(".content .check").find("img").attr("src","img/activity_manage/no_select.png");
			$(".content .check").attr("data_flag","0");
			$(this).attr("data_flag","0");
		}
	});

});
/**
 * 列表头部的操作
 */
$(function(){
	//列表全选
	$(".all_select").click(function(){
//		console.log("我是全选");
		var status = $(this).attr("data_status");
		if(status == 0){
			//改变状态值
			$(this).attr("data_status","1");
			$(".child_select").attr("data_status","1");
			//改变img图片
			$(this).attr("src","img/select.png");
			$("tbody>tr>td>img.child_select").attr("src","img/select.png");
		}else{
			$(this).attr("data_status","0");
			$(".child_select").attr("data_status","0");
			$(this).attr("src","img/no_select.png");
			$("tbody>tr>td>img.child_select").attr("src","img/no_select.png");
		}
		
	});

	//删除列表项 
	$(".list_del").click(function(){
		var ids=[];
		//遍历所有的列表子选项
		$(".child_select").each(function(){
			var status = $(this).attr("data_status");
			//根据状态值删除tr
			if(status == 1){
//				$(this).parents("tr").remove();
				//发送请求删除数据库里的列表....
//				console.log($(this).attr("data_patient_id"));
				ids.push($(this).attr("data_patient_id"));
			}
		});
		var data = {
			"ids":String(ids)
		}
		console.log(data);
		$.post(url+"/deleteConsult",data,function(res){
			if(res.code==0){
				alert(res.msg);
				location.reload();
			}
		});
	});
	
	//全部咨询导出列表项
	$("#allConsult .list_export").click(function(){
//		console.log(url);
		$.post(url+"/selectallconsult",function(res){
			if(res.code==0){
				alert(res.msg);
			}else{
				alert(res.msg);
			}
			
		});
	});
	
});


//选择列表子选项
function child_select(m){
	var status = $(m).attr("data_status");
//	alert(status);
	if(status == 0){
		$(m).attr("data_status","1");
		$(m).attr("src","img/select.png");
	}else{
		$(m).attr("data_status","0");
		$(m).attr("src","img/no_select.png");
	}
}


//初始化子科室列表
function init_subSubject(m){
	//根据父科室id找子科室
	console.log(m);
	$.get_ajax("/hospital/getSubjects.json","",function(res){
		console.log(res);
		var data; 
		for(var i=0;i<res.data.length;i++){
			if(res.data[i].id==m){
				data = res.data[i];
			}
		}
		console.log(data);
		$(".child_ks").html("<option selected='selected' value='0'>请选择</option>");
		var html = template('test_child_ks_list',data);
		$(".child_ks").append(html);
	});
}

/**
 * 排期表
 */
//坐诊表居中
$(".heal_time_container div p").addClass("flex_all_center");
//获取坐诊表格
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
		if(!$.regNum(work_obj.reservationQuantity)){
			alert("坐诊表数据必须为数字");
			return false;
		}
		arr_job.push(work_obj);
	});
	console.log(arr_job);
	return arr_job;
}

//编辑医生初始化坐诊表格
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


