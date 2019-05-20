function toggleColor(m){
	$("dd,.hos_Info").removeClass("font_orange");
	$(m).addClass("font_orange");
}
/**
 * 导航栏页面切换
 */
//权限配置
function toLimit(m){
	$("#child_content").attr("src","limit_manage.html");
	toggleColor($(m));
}
//角色列表
function toRole(m){
	$("#child_content").attr("src","role_list.html");
	toggleColor($(m));
}
//账号列表
function toAccount(m){
	$("#child_content").attr("src","account_list.html");
	toggleColor($(m));
}
//用户列表
function toUser(m){
	$("#child_content").attr("src","user_list.html");
	toggleColor($(m));
}
//商户联系人管理
function toBusiness(m){
	$("#child_content").attr("src","business_contact.html");
	toggleColor($(m));
}
//检查报告录入
function toExamineReport(m){
	$("#child_content").attr("src","examine_report.html");
	toggleColor($(m));
}
//群发功能
function toMass(m){
	$("#child_content").attr("src","Mass.html");
	toggleColor($(m));
}
//医院分类管理
function toHosGroup(m){
	$("#child_content").attr("src","hos_group.html");
	toggleColor($(m));
}
//医院管理
function toHos(m){
	$("#child_content").attr("src","hos_list.html");
	toggleColor($(m));
}
//治疗订单管理
function toCureOrder(m){
	$("#child_content").attr("src","cure_order.html");
	toggleColor($(m));
}
//检查管理
function toExamine(m){
	$("#child_content").attr("src","examine.html");
	toggleColor($(m));
}
//公司员工管理
function toEmployee(m){
	$("#child_content").attr("src","employee.html");
	toggleColor($(m));
}
//修改密码
function toEditPwd(m){
	$("#child_content").attr("src","edit_pwd.html");
	toggleColor($(m));
}
//身体部位管理
function toBodyManage(m){
	$("#child_content").attr("src","body_manage.html");
	toggleColor($(m));
}
//自测疾病管理
function toJudgeIll(m){
	$("#child_content").attr("src","judge_ill.html");
	toggleColor($(m));
}
//VIP充值卡
function toVipCard(m){
	$("#child_content").attr("src","vipCard.html");
	toggleColor($(m));
}

//陪诊卡
function toPeizhenCard(m){
	$("#child_content").attr("src","peizhenCard.html");
	toggleColor($(m));
}
//订单回收站管理
function toOrderRecycle(m){
	$("#child_content").attr("src","order_recycle.html");
	toggleColor($(m));
}
//咨询列表
function toConsult(m){
	$("#child_content").attr("src","toDayConsult.html");
	toggleColor($(m));
}



//---------医院-----------------------------------------------------------------------------------

//体验券列表
function toTyq(m){
	$("#child_content").attr("src","tyq_list.html");
	toggleColor($(m));
}
function toAllot(m){
	if(window.location.href.indexOf('hosBeauty') != -1){
        $("#child_content").attr("src","../allotList.html?v=8888");
	}else{
        $("#child_content").attr("src","allotList.html?v=8888");
	}

    toggleColor($(m));
}
//体验券限定名额
function toTyqLimit(m){
    $("#child_content").attr("src","tyq_limiting.html");
    toggleColor($(m));
}
//医生管理
function toDoc(m){
	$("#child_content").attr("src","doc_list.html");
	toggleColor($(m));
}
//疾病管理
function toIll(m){
	$("#child_content").attr("src","ill_list.html");
	toggleColor($(m));
}
//预约管理
function toAppointment(m){
	$("#child_content").attr("src","appointment_list.html");
	toggleColor($(m));
}
/*医院信息*/
function hosInfo(m) {
    $("#child_content").attr("src","/hosAdmin/hos_detail.html");
    //toggleColor($(m));
    //window.location.href='hos_msg_complete.html';
}
//就诊管理
function toAppointmentjiuzhen(m){
    $("#child_content").attr("src","appointmentjiuzhen_list.html");
    toggleColor($(m));
}
//便捷约定
function toSpeedAppoint(m){
	$("#child_content").attr("src","speed_appoint.html");
	toggleColor($(m));
}
//会话列表
function toChatList(m){
    $("#child_content").attr("src","chat_list.html");
    toggleColor($(m));
}
//会话列表
function toChatListBeauty(m){
    $("#child_content").attr("src","/hosAdmin/chat_list.html");
    toggleColor($(m));
}
//后台订单管理
function toOrder(m){
	$("#child_content").attr("src","order_list.html");
	toggleColor($(m));
}
//评价管理
function toEvaluate(m){
	$("#child_content").attr("src","evaluate_list.html");
	toggleColor($(m));
}
//医院特价项目列表
function toHosSpecialProj(m){
	$("#child_content").attr("src","special_proj_list.html");
	toggleColor($(m));
}
//医院模板
function toHosTem(m){
	$("#child_content").attr("src","template_list.html");
	toggleColor($(m));
}
//部门管理
function toSection(m){
    $("#child_content").attr("src","section_list.html");
    toggleColor($(m));
}
//-----医美--------------------------------------------------------------------------------------


//特价项目列表
function toSpecialProj(m){
	$("#child_content").attr("src","special_proj_list.html");
	toggleColor($(m));
}
//预约项目列表
function toAppointProj(m){
	$("#child_content").attr("src","appoint_proj_list.html");
	toggleColor($(m));
}
////医美疾病管理
//function toBeautyIll(m){
//	$("#child_content").attr("src","beauty_ill_list.html");
//	toggleColor($(m));
//}
//医美预约管理
function toBeautyAppoint(m){
	$("#child_content").attr("src","beauty_appoint_list.html");
	toggleColor($(m));
}
//医美预约管理就诊
function toBeautyAppointjiuzhen(m){
    $("#child_content").attr("src","beauty_appointjiuzhen_list.html");
    toggleColor($(m));
}
//医美后台便捷约定
function tobeautySpeedAppoint(m){
	$("#child_content").attr("src","beauty_speed_appoint.html");
	toggleColor($(m));
}
//医美后台特价订单
function toSpecialOrder(m){
	$("#child_content").attr("src","beauty_special_order_list.html");
	toggleColor($(m));
}
//医美后台预约订单
function toAppointOrder(m){
	$("#child_content").attr("src","beauty_order_list.html");
	toggleColor($(m));
}
//医美评价管理
function toBeautyEvaluate(m){
	$("#child_content").attr("src","beauty_evaluate_list.html");
	toggleColor($(m));
}
//医美体验券
function toBeautyTyq(m){
	$("#child_content").attr("src","beauty_tyq_list.html");
	toggleColor($(m));
}
//医美体验券名额
function toBeautyTyqLimit(m){
    $("#child_content").attr("src","beauty_tyq_limiting.html");
    toggleColor($(m));
}
//医美模板
function toBeautyTem(m){
	$("#child_content").attr("src","beauty_template_list.html");
	toggleColor($(m));
}




