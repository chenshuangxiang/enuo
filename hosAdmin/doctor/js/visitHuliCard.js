var form
layui.use(['form','layer','jquery','laypage','laydate'],function(){
	 form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
        laydate = layui.laydate,
		$ = layui.jquery;
    laydate.render({
        elem: '#newsTime'
    });
    laydate.render({
        elem: '#newsTimeEnd'
    });
    $('#newsTime,#newsTimeEnd').val(new Date().Format('yyyy-MM-dd'));
    //getFentoNameSelect(form,'doctorHelpmate');
    getFentoNameSelect(form,'doctor');

    form.render();

    searchBtn(localStorage.getItem('visit') || 1);
    localStorage.removeItem('visit');
    $('.visitHuliCard').addClass('layui-this').parent().parent().addClass('layui-nav-itemed');


	$(".search_btn").click(function(){
        $('.thatTimeChoose').css('background-color','white').css('color','#222')
        searchBtn(1);
	})

	//添加回访
	$(".consultAdd").click(function(){
        //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
		var index = layui.layer.open({
			title : "患者回访信息添加",
			type : 2,
			content : "recordAdd.html",
			success : function(layero, index){
				setTimeout(function () {
                    layui.layer.tips('点击此处返回回访列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                },500)

			}
		})
		//改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
		$(window).resize(function(){
			layui.layer.full(index);

		})
		layui.layer.full(index);
        //layer.close(indexOpen);

	});
    $('.sureFenTo').click(function () {
        var elThisid = $('.sureFenTo').attr('valueid');
        if($('.fenTo').val() == ''){
            layer.msg('请选择分诊医生');
            return;
        }
        var data = {};
        var url = SERVER_ADDR + "/hospital/doctor/index/allotNursingCard";
        data.nursingCardVisitRecordId =elThisid;
        data.doctorId = $('.fenTo').val();

        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                /* var elthis = $(".consultFen[valueid="+elThisid+"]");
                 elthis.parent().prev().text('已分诊').attr('style','color:black');
                 elthis.remove();
                 layui.layer.closeAll();*/
                localStorage.setItem('visit',$('.layui-laypage-curr em').eq(1).text());
                //layer.msg('添加入诊成功');
                layer.msg('分诊成功');
                setTimeout(function () {
                    location.reload();
                },1000)

            }else{
                layer.alert(retInfo.data,{icon:5})
            }
        },'请求失败', 'POST', undefined, undefined);

        return false
    });

})
function searchBtn(pageNumber) {
    var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
    var url = SERVER_ADDR + "/hospital/doctor/index/getNursingCardVisitRecordList.json";
    var data = {};
    data.keyword = $(".newsName").val();
    data.beginDate = $("#newsTime").val();
    data.endDate = $("#newsTimeEnd").val();
    data.pageNumber = pageNumber;
    data.pageSize = 10;
    //项目名称
    if($(".newsName").val() != ""){
        data.keyword = $(".newsName").val();
        console.log(data);
    }
    ajaxGetRetInfo(url,data,function (retInfo) {
        console.log(retInfo)
        layer.close(index);
        if(retInfo.success){
            newsList(retInfo.data,retInfo.totalCount,pageNumber);
        }else{
            layer.alert(retInfo.data,{icon:5});
        }
    },'请求失败', 'GET', undefined, undefined);
}
function newsList(retInfo,totalCount,current){
    //渲染数据
    $(".news_content").html(renderDate(retInfo));
    //form.render('checkbox','choose')
    //分页
    var nums = 10; //每页出现的数据量
    laypage.render({
        elem : "page",
        skip:true,
        count:totalCount,
        limit :nums,
        curr: current || 1,
        jump : function(obj,firstLoaded){
            console.log(firstLoaded)
            console.log(obj)
            if (!firstLoaded) {
                searchBtn(obj.curr);
            }
        }
    })
}
function renderDate(data){
    var dataHtml = '';
    if(data.length != 0){
        for(var i=0;i<data.length;i++){
            if(data[i].status == 'wait'){
                data[i].status = '候诊';
            }else if(data[i].status == 'loading'){
                data[i].status = '治疗中';
            }else if(data[i].status == 'complete'){
                data[i].status = '完成';
            }else if(data[i].status == 'uncheck'){
                data[i].status = '审核中';
            } else if(data[i].status == 'leave'){
                data[i].status = '弃诊';
            }
            var number;
            if (data[i].number) {
                if (data[i].number.split('-')[2] == undefined) {
                    var split2 = '';
                } else {
                    var split2 = data[i].number.split('-')[2];
                }
                number = data[i].number.split('-')[0] + '<span style="color: #009688;font-weight:600">' + data[i].number.split('-')[1] + '</span>' + split2;
            } else {
                number = ''
            }
            dataHtml += '<tr>'
                /* +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                /*  +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                /*  +'<td><input type="checkbox" valueid="'+data[i].id+'" name="checked" lay-skin="primary" lay-filter="choose"><div class="layui-unselect layui-form-checkbox" lay-skin="primary"><i class="layui-icon"></i></div></td>'*/
                /*+'<td>'+data[i].sn+'</td>'*/
                +'<td>'+Number(i+1)+'</td>'
              /*  +'<td>'+data[i].reservationDate+'</td>'*/
                +'<td style="color: #2299ee;cursor: pointer" valuemobile="'+data[i].mobile+'" valueid="'+data[i].hospitalUserId+'" onclick="visitUserInfo(this)">'+data[i].fullName+'</td>'
                +'<td>'+data[i].mobile+'</td>';
            if(data[i].type == "coupon"){
                dataHtml += '<td>体验券</td>'
            }else if(data[i].type == "product"){
                dataHtml += '<td>特价项目</td>'
            }else if(data[i].type == "doctor"){
                dataHtml += '<td>医生</td>'
            }else if(data[i].type == "nursingCard"){
                dataHtml += '<td>护理卡</td>'
            }else{
                dataHtml += '<td>无</td>'
            }
            dataHtml += '<td>'+noData(data[i].specialProduct)+'</td>'
                +'<td>'+noData('e诺平台')+'</td>'
                +'<td>'+noData(data[i].doctor)+'</td>'
                +'<td>'+noData(data[i].doctorHelpmate)+'</td>'
                +'<td>'+noData(data[i].nurse)+'</td>'
                +'<td>'+noData(data[i].guestService)+'</td>'
            if(data[i].repeat == true){
                dataHtml += '<td>复诊</td>'
            }else if(data[i].repeat == false){
                dataHtml += '<td>初诊</td>'
            }else{
                dataHtml += '<td>不明</td>'
            }
            dataHtml +='<td>'+number+'</td>'
                +'<td>'+noData(data[i].status)+'</td>'
            /*if(data[i].status == "success"){
                dataHtml += '<td>已预约</td>'
            }else if(data[i].status == "complete"){
                dataHtml += '<td>已完成</td>'
            }else if(data[i].status == "cancel"){
                dataHtml += '<td>已取消</td>'
            }*/
            dataHtml +=  '<td>';
                if(data[i].status == "候诊"){
                    if(!data[i].doctor){
                        dataHtml += '<a class="layui-btn layui-btn-normal layui-btn-mini firm" onclick="fenVisitTo(this)" valueid="'+data[i].id+'" >分诊</a>' ;
                    }
                    //dataHtml += '<a class="layui-btn layui-btn-mini firm" onclick="addVisitProject(this)" valueid="'+data[i].id+'" >治疗</a>';
                    if(data[i].type == "product" || data[i].type == "coupon" || data[i].type == "nursingCard"){
                        dataHtml +=  '<a class="layui-btn layui-btn-normal layui-btn-mini" onclick="visit_firm(this)" valueid="'+data[i].id+'">完成</a>';
                    }
                    dataHtml +=  '<a class="layui-btn layui-btn-danger layui-btn-mini" onclick="visit_close(this)" valueid="'+data[i].id+'">弃诊</a>';
                    dataHtml += '<a class="layui-btn layui-btn-danger layui-btn-mini"  onclick="delVisitTo(this)" valueid="'+data[i].id+'"><i class="layui-icon" style="margin-right: 0;font-size: 19px !important;">&#xe640;</i></a>' ;
                }else if(data[i].status == "治疗中"){
                //dataHtml +=  '<a class="layui-btn layui-btn-normal layui-btn-mini firm" onclick="reset_fen_appiontmentList_open(this)" valueid="'+data[i].id+'" visitrecordid="'+data[i].visitRecordId+'" doctorid="'+data[i].doctorId+'" doctorhelpmateid="'+data[i].doctorHelpmateId+'">添加项目</a>'
                    if(data[i].type == "product" || data[i].type == "coupon"  || data[i].type == "nursingCard"){
                        dataHtml +=  '<a class="layui-btn layui-btn-normal layui-btn-mini" onclick="visit_firm(this)" valueid="'+data[i].id+'">完成</a>';
                    }
                    dataHtml +=  '<a class="layui-btn layui-btn-danger layui-btn-mini" onclick="visit_close(this)" valueid="'+data[i].id+'">弃诊</a>'
                }else if(data[i].status == "审核中"){
                    dataHtml += '<a class="layui-btn layui-btn-danger layui-btn-mini"  onclick="delVisitTo(this)" valueid="'+data[i].id+'"><i class="layui-icon" style="margin-right: 0;font-size: 19px !important;">&#xe640;</i></a>' ;
                }

            dataHtml += '</td>'
                +'</tr>';
        }
    }else{
        dataHtml = '<tr><td colspan="14">暂无数据</td></tr>';
    }
    return dataHtml;
}
function fenVisitTo(obj) {
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var id = $(obj).attr('valueid');
    $('.sureFenTo').attr('valueid',id);
    var index = layui.layer.open({
        title : "分诊",
        type : 1,
        area: ['345px','420px'],
        content : $('.writeFenOpen'),
        success : function(layero, index){
            $('.fenTo').val('');
            form.render();
            localStorage.setItem('visit',$('.layui-laypage-curr em').eq(1).text());
            $('.layui-layer-shade').remove();
        },
        cancel: function(index, layero){
            layer.close(index)
            return false;
        }
    })
}
//添加项目
function visitUserInfo(obj){
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
  /*  var elThis = $(obj).attr('valuemobile');
    console.log(4555)
    var index = layui.layer.open({
        title : "个人/就诊信息",
        type : 2,
        area:['800px','75%'],
        content : "historyVisit.html?mobile=" + elThis,
        success : function(layero, index){
            localStorage.setItem('visit',$('.layui-laypage-curr em').eq(1).text());

        }
    })*/
    var mobile = $(obj).attr('valuemobile');
    var id = $(obj).attr('valueid');
    if(id == 'undefined'){
        layer.alert('此用户还不是本院客户，请先添加！',{icon:7});
        return;
    }
    var index = layui.layer.open({
        title : "回访",
        type : 2,
        area:['85%','85%'],
        content : "historyRecord.html?id=" + id + '&mobile=' + mobile,
        success : function(layero, index){
            /*setTimeout(function () {
                layui.layer.tips('点击此处返回咨询列表', '.layui-layer-setwin .layui-layer-close', {
                    tips: 3
                });
            },500)*/

        }
    })
}
function addVisitProject(obj) {
    var elThis = $(obj).attr('valueid');
    console.log(4555)
    var index = layui.layer.open({
        title : "治疗",
        type : 2,
        area:['890px','92%'],
        content : "addTemplateProject.html?valueid=" + elThis + '&v=1134',
        success : function(layero, index){
            localStorage.setItem('visit',$('.layui-laypage-curr em').eq(1).text());

        }
    })
}
function visit_firm(obj) {
    var elthis = $(obj);
    var appoint_id = elthis.attr("valueid");
    //window.localStorage.setItem("appoint_id",appoint_id);
    layer.confirm('确认该项目已完成？', {
        btn: ['完成','取消'], //按钮
        icon:3
    }, function(){
        var data = {
            "nursingCardVisitRecordId":appoint_id
        }
        postget_ajax("/hospital/doctor/index/completeNursingCard",data,'POST',function(res){
            if(res.success){
//				window.location.href = "appointment_list.html";
                elthis.parent().prev().text("完成");
                elthis.parent().text("");
                //elthis.remove();
                layer.closeAll();
            }else{
                layer.alert(res.data);
            }
        });
    }, function(){

    });
}
function visit_close(obj) {
    var elthis = $(obj);
    var appoint_id = elthis.attr("valueid");
    //window.localStorage.setItem("appoint_id",appoint_id);
    layer.confirm('确认弃诊？', {
        btn: ['确认','暂不弃诊'], //按钮
        icon:3
    }, function(){
        var data = {
            "nursingCardVisitRecordId":appoint_id
        }
        postget_ajax("/hospital/reception/visitRecord/leaveNursingCard",data,'POST',function(res){
            if(res.success){
//				window.location.href = "appointment_list.html";
                elthis.parent().prev().text("弃诊");
                elthis.parent().text("");

                //elthis.remove();
                layer.closeAll();
            }else{
                layer.alert(res.data);
            }
        });
    }, function(){

    });
}
function delVisitTo(obj) {
    var elthis = $(obj);
    var appoint_id = elthis.attr("valueid");
    //window.localStorage.setItem("appoint_id",appoint_id);
    layer.confirm('确认删除？', {
        btn: ['确认','暂不删除'], //按钮
        icon:3
    }, function(){
        var data = {
            "nursingCardVisitRecordId":appoint_id
        }
        postget_ajax("/hospital/reception/visitRecord/deleteNursingCard",data,'POST',function(res){
            if(res.success){
//				window.location.href = "appointment_list.html";
                elthis.parent().parent().remove();

                //elthis.remove();
                layer.closeAll();
            }else{
                layer.alert(res.data);
            }
        });
    }, function(){

    });
}

/*function firm(obj) {
    var elthis = $(obj);
    var appoint_id = elthis.attr("valueid");
    //window.localStorage.setItem("appoint_id",appoint_id);
    layer.confirm('确认该项目已完成？', {
        btn: ['完成','取消'], //按钮
        icon:3
    }, function(){
        var data = {
            "id":appoint_id
        }
        postget_ajax("/hospital/reservation/completed",data,'POST',function(res){
            if(res.success){
//				window.location.href = "appointment_list.html";
                elthis.parent().prev().text("已完成");
                elthis.remove();
                layer.closeAll();
            }else{
                layer.alert(res.data);
            }
        });
    }, function(){

    });
}*/
//分诊
/*function write_fen_appiontmentList_open(obj) {
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var id = $(obj).attr('valueid');
    $('.sureFenToAppiontmentList').attr('valueid',id).attr('action','fen');
    var index = layui.layer.open({
        title : "分诊",
        type : 1,
        area: ['345px','420px'],
        content : $('.writeFenOpen'),
        success : function(layero, index){
            $('.fenTo').val('');
            form.render();
            localStorage.setItem('visit',$('.layui-laypage-curr em').eq(1).text());
            $('.layui-layer-shade').remove();
        },
        cancel: function(index, layero){
            layer.close(index)
            return false;
        }
    })
}
//修改分诊
function reset_fen_appiontmentList_open(obj) {
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var id = $(obj).attr('visitrecordid');
    var doctorid = $(obj).attr('doctorid');
    //var doctorhelpmateid = $(obj).attr('doctorHelpmateId');
    $('.sureFenToAppiontmentList').attr('valueid',id).attr('action','reset');
    var index = layui.layer.open({
        title : "修改分诊",
        type : 1,
        area: ['345px','420px'],
        content : $('.writeFenOpen'),
        success : function(layero, index){
            $('.fenTo').val(doctorid);
            form.render();
            localStorage.setItem('appiontmentList',$('.layui-laypage-curr em').eq(1).text());
            $('.layui-layer-shade').remove();
        },
        cancel: function(index, layero){
            layer.close(index)
            return false;
        }
    })
}*/
var Get = {
    mobile:'',
    userInfo: function (obj) {
        var url = SERVER_ADDR + '/hospital/reception/visitRecord/getUserInfoByMobile.json';
        var Data = {};
        Data.mobile = $(obj).attr('valuemobile');
        Get.mobile = $(obj).attr('valuemobile');
        ajaxGetRetInfo(url, Data, this.userInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    userInfoSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            if(retInfo.data.sex == 'man'){
                retInfo.data.sex = '男';
            }else if(retInfo.data.sex == 'woman'){
                retInfo.data.sex = '女';
            }else if(retInfo.data.sex == 'unknown'){
                retInfo.data.sex = '不详';
            }
            if(!retInfo.data.birthday){
                var birthday = '无'
            }else{
                var birthday = new Date(retInfo.data.birthday).Format("yyyy-MM-dd")
            }

            layer.open({
                title: '个人信息'
                ,content: '姓名:'+retInfo.data.fullname + '' + ' &nbsp;&nbsp;&nbsp;&nbsp;手机号:' + Get.mobile  + ' &nbsp;&nbsp;&nbsp;&nbsp;性别:' + retInfo.data.sex + '<br>出生日期:' +birthday+ '<br>身份证号:' + noData(retInfo.data.idCard)
            });
        }
    },
    resetRecord: function (obj) {
        var elThis = $(obj);
        var url = SERVER_ADDR + '/admin/access/updateAccess';
        var Data = {};
        Data.id = elThis.attr('valueid');
        Data.brief = $('.briefInput').val();
        Data.platformStatus = $('.prevStatus').val();
        ajaxGetRetInfo(url, Data, this.resetRecordSuccess, '请求失败', 'POST', true, undefined);
    },
    resetRecordSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            location.reload();
        } else {
            alert(retInfo.data);
        }
    }
}
var special_addTag = {
    num:1,
    //增约定效果
    addResult:function(m){
        this.num++;
        var html = '<div class="layui-form-item" style="margin-bottom: 1px;">' +
            '<div class="layui-inline">' +
            '<label class="layui-form-label"></label>' +
            '<div class="layui-input-inline">' +
            '<input type="text" value="" placeholder="检查项目" class="layui-input search_input appoint_result appoint_result_name">' +
            '</div>' +
            '</div>' +
            '<div class="layui-inline">' +
            '<div class="layui-input-inline">' +
            '<input type="text" value="" placeholder="检查结果" class="layui-input search_input appoint_result appoint_result_detail">' +
            '</div>' +
            '</div>' +
            '<input type="button" class="layui-btn layui-btn-danger" onclick="special_addTag.delResult(this)" value="删除"/>' +
            '</div>';
        $('.addCensorItems').append(html);
    },
    //减约定效果
    delResult:function(m){
        this.num--;
        $(m).parent().remove();
    },
    //初始化约定效果
    init_appoint_result:function(m,tag){
        if(!m[0]){
            return false;
        }
//		console.log("沃日");
        var html = "";
        //	m=["aa","bb"];
        for(var i=0;i<m.length;i++){
            if(i==0){
                html=html+"<p>"
                    +"<input type='text' class='appoint_result appoint_result_name' placeholder='如' value='"+m[i]+"'/>"
                    +"<input type='text' class='appoint_result appoint_result_detail' placeholder='如'/>"
                    +"<span class='font_green' onclick='special_addTag.addResult(this)'> [+]</span>"
                    +"</p>";
            }
            if(i>0){
                html=html+"<p>"
                    +"<input type='text' class='appoint_result appoint_result_name' placeholder='如' value='"+m[i]+"'/>"
                    +"<input type='text' class='appoint_result appoint_result_detail' placeholder='如'/>"
                    +"<span class='font_green' onclick='special_addTag.delResult(this)'> [-]</span>"
                    +"</p>";
            }
        }
        $(tag).html(html);
    },
    //获取列表的值
    getResult:function(){
        var arrResult = [];
        $(".appoint_result").each(function (index,value) {
            console.log("进来了");
            var arrChild = {};
            if($(this).hasClass("appoint_result_name")){
                console.log("name进来了");
                arrChild.name = $(this).val();
            }
            if($(this).hasClass("appoint_result_detail")){
                arrChild.description = $(this).val();
            }
            arrResult.push(arrChild);
            console.log(arrResult);
        });

        return arrResult;
    }
}