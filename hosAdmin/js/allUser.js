layui.use(['form','layer','jquery','laypage','laydate','element'],function(){
	var form = layui.form,
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
    toAllFirstTopTab('.userLi','.toPeopleBtn');
    $('#newsTime').val(new Date().Format('yyyy-MM-dd'));
    //todayReservation
    if(window.location.href.indexOf('recent') != -1){
        $('.todayRecord').addClass('layui-this').parent().parent().addClass('layui-nav-itemed');
        $('.nextTime').text('回访日期').css('font-weight','600');
        $('.newsNameDiv').remove()
    }else if(window.location.href.indexOf('reservation') != -1){
        $('.todayReservation').addClass('layui-this').parent().parent().addClass('layui-nav-itemed');
        $('.nextTime').text('预约日期').css('font-weight','600');
        $('.newsNameDiv').remove()
    }else {
        $('.timediv').remove();
        $('.allUser').addClass('layui-this').parent().parent().addClass('layui-nav-itemed');
    }
    getFentoNameDoctorSelect(form,'doctor');
    getService(form,'guestService'); //获取客服加入
    getDoctorHelpmate(form);
    getFentoNameNurseSelect(form,'nurse');
    //getHos(form); //获取医院
    //getSaleman(form); //获取业务员
    //getFrom(form); //获取点位来源
    //getNoResultHos(form);
    //getFentoNameSelect(form,'doctor');
    //getFentoNameSelect(form,'doctorHelpmate');

    form.render();
   /* form.on('select(newsHos)', function(data){  //根据医院获取病种
        getFk(form,data.elem[data.elem.selectedIndex].title);
    });*/
	//加载页面数据
	var newsData = '';
    searchBtn(localStorage.getItem('allUser') || 1);
    localStorage.removeItem('allUser');
	//查询
	$(".search_btn").click(function(){
        searchBtn(1);
	})
	function searchBtn(pageNumber) {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/hospital/user/getList.json";
        var data = {};
        data.beginDate = $("#newsTime").val();
        data.endDate = $("#newsTimeEnd").val();
        data.keyword = $(".newsName").val();
        data.pageNumber = pageNumber;
        data.pageSize = 15;
        if(window.location.href.indexOf('recent') != -1){
            var url = SERVER_ADDR + "/hospital/user/getVisitList.json";///
        }else if(window.location.href.indexOf('reservation') != -1){
            var url = SERVER_ADDR + "/hospital/user/getRecentReservationList.json";///
        }else {
            var url = SERVER_ADDR + "/hospital/user/getList.json";///hospital/user/getList.json
            data.keyword = $(".newsName").val();
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
	//添加咨询
	$(".consultAdd").click(function(){
        //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});

		var index = layui.layer.open({
			title : "添加咨询",
			type : 2,
            area:['80%','80%'],
			content : "consultAdd.html",
			success : function(layero, index){
			    localStorage.setItem('allUser',$('.layui-laypage-curr em').eq(1).text());
				setTimeout(function () {
                    layui.layer.tips('点击此处返回咨询列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                },500)

			}
		})
		//改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
		/*$(window).resize(function(){
			layui.layer.full(index);

		})
		layui.layer.full(index);*/
        //layer.close(indexOpen);

	});
	//分诊
    $("body").on("click",".consultFen",function(){  //收藏.
        console.log(666666)
		$('.sureFen').attr('valueid',$(this).attr('valueid'));
        var index = layui.layer.open({
            area: ['345px','420px'],
            title : "分诊",
            type : 1,
            content : $('.fenOpen'),
            success:function(){
                $('.layui-layer-shade').remove();
			}
        })
    });
    //操作
    $("body").on("click",".caozuoBtn",function(){
        if($(this).attr('disabled') == 'disabled'){
            return
        }
        $('.news_record_add,.consultFen,.news_reset').attr('valueid',$(this).attr('valueid'));
        var valuestatus = $(this).attr('valuestatus');
        if(valuestatus == 'unallot'){
            $('.consultFen,.news_reset').show();
        }else{
            $('.consultFen,.news_reset').hide();
        }
        var index = layui.layer.open({
            area: ['270px','300px'],
            closeBtn: 1,
            shadeClose: false,
            title : "操作",
            type : 1,
            content : $('.caozuoOpen'),
            success:function(){
               $('.layui-layer-shade').remove();
            }
        })
    });
    $('.sureFen').click(function () {
        var elThisid = $('.sureFen').attr('valueid');
        if($('.newsHosFen').val() == ''){
            layer.alert('请选择分诊医院',{icon:7});

        }
        var url = SERVER_ADDR + "/admin/allot/submit";
        var data = {};
        data.advisoryId = $('.sureFen').attr('valueid');
        //data.date = $('.newsTimeFen').val();
        data.hospitalId = $('.newsHosFen').val();
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
               /* var elthis = $(".consultFen[valueid="+elThisid+"]");
                elthis.parent().prev().text('已分诊').attr('style','color:black');
                elthis.remove();
                layui.layer.closeAll();*/
                localStorage.setItem('allUser',$('.layui-laypage-curr em').eq(1).text());
                layer.msg(retInfo.data);
                location.reload();
            }else{
                layer.alert(retInfo.data,{icon:5})
            }
        },'请求失败', 'POST', undefined, undefined);

        return false
    });
    //添加回访
    $("body").on("click",".news_record_add",function(){
        //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
        var index = layui.layer.open({
            title : "患者回访信息添加",
            type : 2,
            area:['80%','80%'],
            content : "../allRecord/recordAdd.html?id=" + $(this).attr('valueid'),
            success : function(layero, index){
                localStorage.setItem('allUser',$('.layui-laypage-curr em').eq(1).text());
                setTimeout(function () {
                    layui.layer.tips('点击此处返回咨询列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                },500)

            }
        })
        //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
        /*$(window).resize(function(){
            layui.layer.full(index);

        })
        layui.layer.full(index);*/
        //layer.close(indexOpen);

    });
	//编辑咨询
    $("body").on("click",".news_reset",function(){  //收藏.
		var valueid = $(this).attr('valueid');
        var index = layui.layer.open({
            title : "编辑咨询",
            type : 2,
            area:['80%','80%'],
            content : "consultAdd.html?action=reset&valueid=" + valueid,
            success : function(layero, index){
                /*setTimeout(function () {
                    layui.layer.tips('点击此处返回咨询列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                },500)*/
                localStorage.setItem('allUser',$('.layui-laypage-curr em').eq(1).text());
            }
        })
        //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
        /*$(window).resize(function(){
            layui.layer.full(index);
        })
        layui.layer.full(index);*/
    });


	//全选
	form.on('checkbox(allChoose)', function(data){
		var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"])');
		child.each(function(index, item){
			item.checked = data.elem.checked;
		});
		form.render('checkbox');
	});

	//通过判断文章是否全部选中来确定全选按钮是否选中
	form.on("checkbox(choose)",function(data){
		var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"])');
		var childChecked = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"]):checked')
		if(childChecked.length == child.length){
			$(data.elem).parents('table').find('thead input#allChoose').get(0).checked = true;
		}else{
			$(data.elem).parents('table').find('thead input#allChoose').get(0).checked = false;
		}
		form.render('checkbox');
	})

	//是否展示
	form.on('switch(isShow)', function(data){
		var index = layer.msg('修改中，请稍候',{icon: 16,time:false,shade:0.8});
        setTimeout(function(){
            layer.close(index);
			layer.msg("展示状态修改成功！");
        },2000);
	})
 
	//操作
	$("body").on("click",".news_edit",function(){  //编辑
		//layer.alert('您点击了文章编辑按钮，由于是纯静态页面，所以暂时不存在编辑内容，后期会添加，敬请谅解。。。',{icon:6, title:'文章编辑'});
		console.log($(this).attr('valueid'));
        var index = layui.layer.open({
            title : "添加文章",
            type : 2,
            content : "newsAdd.html",
            success : function(layero, index){
                layui.layer.tips('点击此处返回咨询列表', '.layui-layer-setwin .layui-layer-close', {
                    tips: 3
                });
            }
        })
        //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
        $(window).resize(function(){
            layui.layer.full(index);
        })
        layui.layer.full(index);
	})

	$("body").on("click",".news_collect",function(){  //收藏.
        var index = layui.layer.open({
            title : "添加文章",
            type : 2,
            content : "newsList.html",
            success : function(layero, index){
                layui.layer.tips('点击此处返回咨询列表', '.layui-layer-setwin .layui-layer-close', {
                    tips: 3
                });
            }
        })
        //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
        $(window).resize(function(){
            layui.layer.full(index);
        })
        layui.layer.full(index);
	})

	$("body").on("click",".news_del",function(){  //删除
		var _this = $(this);
		layer.confirm('确定删除此信息？',{icon:3, title:'提示信息'},function(index){
			//_this.parents("tr").remove();
			for(var i=0;i<newsData.length;i++){
				if(newsData[i].newsId == _this.attr("data-id")){
					newsData.splice(i,1);
					newsList(newsData);
				}
			}
			layer.close(index);
		});
	})
    $('.sureFenToHosDoctorHelpmate').click(function () {
        var elThisid = $('.hosDoctorHelpmateSelect').val();
        fenzhenAllot(elThisid,'doctorHelpmate');
        return false
    });
    $('.sureFenToHosDoctor').click(function () {
        var elThisid = $('.doctor').val();
        fenzhenAllot(elThisid,'doctor');
        return false
    });
    $('.sureFenToHosKefu').click(function () {
        var elThisid = $('.hoskefuSelect').val();
        fenzhenAllot(elThisid,'guestService');
        return false
    });
    $('.sureFenToHosNurse').click(function () {
        var elThisid = $('.nurse').val();
        fenzhenAllot(elThisid,'nurse');
        return false
    });
	function newsList(retInfo,totalCount,current){
		//渲染数据
        $(".news_content").html(renderDate(retInfo));
        form.render();
		//分页
		var nums = 15; //每页出现的数据量
        laypage.render({
            elem : "page",
            skip:true,
            count:totalCount,
            layout: ['count', 'prev', 'page', 'next', 'skip'],
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
            var numbersCount = 0;
            for(var i=0;i<data.length;i++){
                if(!data[i].birthday){
                    var birthday = '无'
                }else{
                    var birthday = new Date(data[i].birthday).Format("yyyy-MM-dd")
                }
                if(data[i].sex == 'man'){
                    data[i].sex = '男';
                }else if(data[i].sex == 'woman'){
                    data[i].sex = '女';
                }else if(data[i].sex == 'unknown'){
                    data[i].sex = '不详';
                }
                if(!data[i].lastVisitDate){
                    var lastVisitDate = '无'
                }else{
                    var lastVisitDate = new Date(data[i].lastVisitDate).Format("yyyy-MM-dd")
                }
                numbersCount += 1;
                dataHtml += '<tr>'
                dataHtml +='<td>'+Number(numbersCount)+'<input style="float: right" type="checkbox" name="allot" data_id="'+data[i].id+'" lay-skin="primary" lay-filter="Choose"></td>'
                   /* +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                 /*  +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                  /*  +'<td>'+new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss")+'</td>'*/
                    +'<td  style="color: #2299ee;cursor: pointer" onclick="toUserInfo(this)" valueindex="1"  valueid="'+data[i].id+'"  valuemobile="'+data[i].mobile+'">'+data[i].fullname+'</td>'
                    +'<td>'+data[i].sex+'</td>'
                    +'<td>'+data[i].mobile+'</td>'
                    +'<td>'+birthday+'</td>'
                if(window.location.href.indexOf('recent') != -1){
                    if(new Date().Format('yyyy-MM-dd') == new Date(data[i].nextAccessDate).Format("yyyy-MM-dd")){
                        dataHtml += '<td>今日</td>'
                    }else{
                        dataHtml += '<td>'+noData(new Date(data[i].nextAccessDate).Format("yyyy-MM-dd"))+'</td>'
                    }
                }else if(window.location.href.indexOf('reservation') != -1){
                    if(new Date().Format('yyyy-MM-dd') == new Date(data[i].reservationDate).Format("yyyy-MM-dd")){
                        dataHtml += '<td>今日</td>'
                    }else{
                        dataHtml += '<td>'+noData(new Date(data[i].reservationDate).Format("yyyy-MM-dd"))+'</td>'
                    }
                }else {
                    dataHtml += '<td>'+noData(data[i].idCard)+'</td>'
                }
                dataHtml += '<td>'+ noDataKong(data[i].doctorHelpmateName)+'</td>'+
                        '<td>'+ noDataKong(data[i].doctorName)+'</td>'+
                        '<td>'+ noDataKong(data[i].nurseName)+'</td>'+
                        '<td>'+ noDataKong(data[i].guestServiceName)+'</td>'+
                        '<td>'+ lastVisitDate+'</td>'+
                        '<td>'+noData(data[i].lastVisitProject)+'</td>'
                   /* +'<td>'+'项目分类'+'</td>'
                    +'<td>'+'项目分类'+'</td>'
                    +'<td>'+'上门或e诺'+'</td>'
                    +'<td>'+'预约医生'+'</td>'
                    +'<td>'+'咨询'+'</td>'
					+'<td>'+'客服'+'</td>'*/
                /*if(data[i].status == "unallot"){
                    dataHtml += '<td>初诊</td>';
                    //dataHtml += '<td><a class="layui-btn layui-btn-mini caozuoBtn" valueid="'+data[i].id+'" valuestatus="'+data[i].status+'"><i class="iconfont icon-edit"></i> 操作</a>';
                }else if(data[i].status == "allot"){
                    dataHtml += '<td>复诊</td>';
                    //dataHtml += '<td><a class="layui-btn layui-btn-mini layui-btn-disabled caozuoBtn" disabled="disabled" valueid="'+data[i].id+'" valuestatus="'+data[i].status+'"><i class="iconfont icon-edit"></i> 操作</a>';
                }else{
                    dataHtml += '<td>不明</td>';
                    //dataHtml += '<td><a class="layui-btn layui-btn-mini layui-btn-disabled caozuoBtn" disabled="disabled" valueid="'+data[i].id+'" valuestatus="'+data[i].status+'"><i class="iconfont icon-edit"></i> 操作</a>';
                }
                dataHtml+='<td>'+'就诊号'+'</td>'
                if(data[i].status == "unallot"){
                    dataHtml += '<td style="color:#f00">候诊</td>';
                    //dataHtml += '<td><a class="layui-btn layui-btn-mini caozuoBtn" valueid="'+data[i].id+'" valuestatus="'+data[i].status+'"><i class="iconfont icon-edit"></i> 操作</a>';
                }else if(data[i].status == "allot"){
                    dataHtml += '<td>治疗中</td>';
                    //dataHtml += '<td><a class="layui-btn layui-btn-mini layui-btn-disabled caozuoBtn" disabled="disabled" valueid="'+data[i].id+'" valuestatus="'+data[i].status+'"><i class="iconfont icon-edit"></i> 操作</a>';
                }else{
                    dataHtml += '<td>弃诊</td>';
                    //dataHtml += '<td><a class="layui-btn layui-btn-mini layui-btn-disabled caozuoBtn" disabled="disabled" valueid="'+data[i].id+'" valuestatus="'+data[i].status+'"><i class="iconfont icon-edit"></i> 操作</a>';
                }*/
                /*if(data[i].status == "unallot"){
                    dataHtml += '<a class="layui-btn layui-btn-mini consultFen" style="display: none" valueid="'+data[i].id+'"><i class="iconfont icon-edit"></i> 分诊</a>' +
                        '<a class="layui-btn layui-btn-normal layui-btn-mini news_reset" style="display: none" valueid="'+data[i].id+'"><i class="layui-icon">&#xe600;</i> 编辑</a>';
                }*/
                dataHtml +=  /*'<a class="layui-btn layui-btn-normal layui-btn-mini news_record_add" style="display: none" valueid="'+data[i].id+'"><i class="layui-icon">&#xe650;</i> 回访</a>' +*/
                    '</td>' +
                    '<td>' ;
                if(data[i].status == 'recontact'){
                    dataHtml += '<a class="layui-btn layui-btn-normal layui-btn-mini news_reset_recordhis" style="padding: 0 9px;background-color: red" onclick="news_reset_recordhis(this)" valueid="'+data[i].id+'" patientid="'+data[i].patientId+'" valuemobile="'+data[i].mobile+'" valueusername="'+data[i].name+'">再次回访</a></td>'
                }else{
                    dataHtml += '<a class="layui-btn layui-btn-normal layui-btn-mini news_reset_recordhis" style="padding: 0 9px;" onclick="news_reset_recordhis(this)" valueid="'+data[i].id+'" patientid="'+data[i].patientId+'" valuemobile="'+data[i].mobile+'" valueusername="'+data[i].name+'">回访</a></td>'
                }
                dataHtml +='</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="9">暂无数据</td></tr>';
        }
        return dataHtml;
    }
})
function fenzhenAllot(obj,type) {
    var elThisid = obj;
    var allotList = [];
    var checkdAllot = $("input:checkbox[name='allot']:checked");
    if(checkdAllot.length == 0){
        layer.msg('请选择需要分配的数据');
        return;
    }
    if(elThisid == ''){
        layer.msg('请选择分配人员');
        return;
    }
    checkdAllot.each(function() { // 遍历name=test的多选框
        // 每一个被选中项的值
        allotList.push($(this).attr('data_id'))
    });
    //allotList = allotList.join(',');
    console.log(allotList)
    var data = {};
    var url;
    if(type == 'doctor'){
        url = SERVER_ADDR + "/hospital/user/toDoctor";
        data.doctorId =elThisid;
    }else if(type == 'doctorHelpmate'){
        url = SERVER_ADDR + "/hospital/user/toDoctorHelpmate";
        data.doctorHelpmateId =elThisid;
    }else if(type == 'guestService'){
        url = SERVER_ADDR + "/hospital/user/toGuestService";
        data.guestServiceId =elThisid;
    }else if(type == 'nurse'){
        url = SERVER_ADDR + "/hospital/user/toNurse";
        data.nurseId =elThisid;
    }
    allotList.forEach(function (value,index) {
        data['hospitalUserIds[' + index + ']'] = value;
    })
    ajaxGetRetInfo(url,data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            localStorage.setItem('allUser',$('.layui-laypage-curr em').eq(1).text());
            layer.msg('分配成功');
            setTimeout(function () {
                location.reload();
            },1000)
        }else{
            layer.alert(retInfo.data,{icon:5})
        }
    },'请求失败', 'POST', undefined, undefined);
}
function news_reset_dohis(obj) {
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var username = $(obj).attr('valueusername');
    var mobile = $(obj).attr('valuemobile');
    var id = $(obj).attr('valueid');
    var index = layui.layer.open({
        title : "操作记录 》 " + username + ' - ' +  mobile,
        type : 2,
        area:['80%','80%'],
        content : "historyDo.html?id=" + id,
        success : function(layero, index){
            setTimeout(function () {
                layui.layer.tips('点击此处返回咨询列表', '.layui-layer-setwin .layui-layer-close', {
                    tips: 3
                });
            },500)

        }
    })
}
function news_reset_recordhis(obj) {
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});

    var mobile = $(obj).attr('valuemobile');
    var id = $(obj).attr('valueid');

    var index = layui.layer.open({
        title : "回访",
        type : 2,
        area:['85%','85%'],
        content : "historyRecordShuju.html?id=" + id + '&mobile=' + mobile + '&v=1134',
        success : function(layero, index){
            /*setTimeout(function () {
                layui.layer.tips('点击此处返回咨询列表', '.layui-layer-setwin .layui-layer-close', {
                    tips: 3
                });
            },500)*/

        }
    })
}
//分诊数据给客服
function write_fen_allot_guestservice_open() {
    var checkdAllot = $("input:checkbox[name='allot']:checked");
    if(checkdAllot.length == 0){
        layer.msg('请勾选需要分配的数据');
        return;
    }
    var index = layui.layer.open({
        title : "分配给客服",
        type : 1,
        area: ['345px','420px'],
        content : $('.writeFenOpen'),
        success : function(layero, index){
            $('.layui-layer-shade').remove();
        },
        cancel: function(index, layero){
            $('.writeFenOpen').hide();
            layer.close(index)
            return false;
        }
    })
}
//分诊数据给护士
function write_fen_allot_nurse_open() {
    var checkdAllot = $("input:checkbox[name='allot']:checked");
    if(checkdAllot.length == 0){
        layer.msg('请勾选需要分配的数据');
        return;
    }
    var index = layui.layer.open({
        title : "分配给护士",
        type : 1,
        area: ['345px','420px'],
        content : $('.writeFenOpendNurse'),
        success : function(layero, index){
            $('.layui-layer-shade').remove();
        },
        cancel: function(index, layero){
            $('.writeFenOpendNurse').hide();
            layer.close(index)
            return false;
        }
    })
}
//分诊数据给现场咨询
function write_fen_allot_doctorHelpmate_open() {
    var checkdAllot = $("input:checkbox[name='allot']:checked");
    if(checkdAllot.length == 0){
        layer.msg('请勾选需要分配的数据');
        return;
    }
    var index = layui.layer.open({
        title : "分配给现场咨询",
        type : 1,
        area: ['345px','420px'],
        content : $('.writeFenOpendDoctorHelpmate'),
        success : function(layero, index){
            $('.layui-layer-shade').remove();
        },
        cancel: function(index, layero){
            $('.writeFenOpendDoctorHelpmate').hide();
            layer.close(index)
            return false;
        }
    })
}
//分诊数据给医生
function write_fen_allot_doctor_open() {
    var checkdAllot = $("input:checkbox[name='allot']:checked");
    if(checkdAllot.length == 0){
        layer.msg('请勾选需要分配的数据');
        return;
    }
    var index = layui.layer.open({
        title : "分配给医生",
        type : 1,
        area: ['345px','420px'],
        content : $('.writeFenOpendDoctor'),
        success : function(layero, index){
            $('.layui-layer-shade').remove();
        },
        cancel: function(index, layero){
            $('.writeFenOpendDoctor').hide();
            layer.close(index)
            return false;
        }
    })
}
var Get = {
    userInfo: function (obj) {
        var elThis =  $(obj);
        var url = SERVER_ADDR + '/admin/advisory/getPatientInfo.json';
        var Data = {};
        Data.mobile = elThis.attr('valuemobile');
        ajaxGetRetInfo(url, Data, this.userInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    userInfoSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            //返回填充
            $('.span').text(retInfo.data.name);
            if (retInfo.data.sex == 'man') {
                retInfo.data.sex = '男';
            } else if (retInfo.data.sex == 'woman') {
                retInfo.data.sex = '女';
            } else if (retInfo.data.sex == 'unknown') {
                retInfo.data.sex = '不详';
            }
            if (!retInfo.data.job) {
                retInfo.data.job = '';
            }
            if (!retInfo.data.address) {
                retInfo.data.address = '';
            }
            layer.alert('姓名:' + retInfo.data.name + '' + ' &nbsp;&nbsp;&nbsp;&nbsp;年龄:' + retInfo.data.age + ' &nbsp;&nbsp;&nbsp;&nbsp;性别:' + retInfo.data.sex + ' &nbsp;&nbsp;&nbsp;&nbsp;职业:' + retInfo.data.job + ' &nbsp;&nbsp;&nbsp;&nbsp;地址:' + retInfo.data.address);
            /*$(".newsName").val(retInfo.data.name);
            $(".sex").val(retInfo.data.sex);
            $(".age").val(retInfo.data.age);
            $(".newsAddress").val(retInfo.data.address);
            $(".job").val(retInfo.data.job);*/
        } else {
            alert(retInfo.data);
        }
    }
}