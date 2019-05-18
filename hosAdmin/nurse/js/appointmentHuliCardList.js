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
    getFentoNameSelect(form,'doctorHelpmate');
    getFentoNameSelect(form,'doctor');

    form.render();
    /*form.on('select(fenTo)', function(data){  //根据分类获取类型
        getFentoNameSelect(form,data.elem[data.elem.selectedIndex].title);
    });*/
    searchBtn(localStorage.getItem('appiontmentList') || 1);
    localStorage.removeItem('appiontmentList');
    $('.appointmentHuliCardList').addClass('layui-this').parent().parent().addClass('layui-nav-itemed');
    /*getHos(form); //获取医院
    getSaleman(form); //获取业务员
    getFrom(form); //获取点位来源
    form.on('select(newsHos)', function(data){  //根据医院获取病种
        getFk(form,data.elem[data.elem.selectedIndex].title);
    });*/
	//加载页面数据
	var newsData = '';
	/*$.get("../../json/newsList.json", function(data){
		var newArray = [];
		//单击首页“待审核文章”加载的信息
		if($(".top_tab li.layui-this cite",parent.document).text() == "待审核文章"){
			if(window.sessionStorage.getItem("addNews")){
				var addNews = window.sessionStorage.getItem("addNews");
				newsData = JSON.parse(addNews).concat(data);
			}else{
				newsData = data;
			}
			for(var i=0;i<newsData.length;i++){
        		if(newsData[i].newsStatus == "待审核"){
					newArray.push(newsData[i]);
        		}
        	}
        	newsData = newArray;
        	newsList(newsData);
		}else{    //正常加载信息
			newsData = data;
			if(window.sessionStorage.getItem("addNews")){
				var addNews = window.sessionStorage.getItem("addNews");
				newsData = JSON.parse(addNews).concat(newsData);
			}
			//执行加载数据的方法
			newsList();
		}
	})*/
	$('.help').mouseenter(function () {
        layui.layer.tips('已预约：用户已经预约该项目<br>已取消：用户已经取消预约该项目<br>已完成：用户已经完成该项目', '.help', {
            tips: 3
        });
    })

    //searchBtn(1);
	//查询
    $('.thatTimeChoose').click(function(){
        $('.thatTimeChoose').css('background-color','white').css('color','#222')
        $(this).css('background-color','#009688').css('color','white');
    });
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
    $('.sureFenToAppiontmentList').click(function () {
        var elThisid = $('.sureFenToAppiontmentList').attr('valueid');
        /*if($('.fenToDoctor').val() == '' && $('.fenToZixun').val() == ''){
            layer.msg('请选择预约医生或咨询');
            return;
        }*/
        var data = {};
        if($('.sureFenToAppiontmentList').attr('action') == 'reset'){ //修改分诊
            var url = SERVER_ADDR + "/hospital/reception/visitRecord/updateNursingCard";
            data.id =elThisid;
        }else{
            var url = SERVER_ADDR + "/hospital/reception/visitRecord/nursingCardReservationIdAllotOnline";
            data.nursingCardReservationId =elThisid;
        }
        //data.date = $('.newsTimeFen').val();
        data.fkId = $('.fenTo').find("option:selected").attr('title');
        data.type = $('.fenTo').find("option:selected").attr('titletype');
        //data.doctorHelpmateId = $('.fenToZixun').val();
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                /* var elthis = $(".consultFen[valueid="+elThisid+"]");
                 elthis.parent().prev().text('已分诊').attr('style','color:black');
                 elthis.remove();
                 layui.layer.closeAll();*/
                localStorage.setItem('appiontmentList',$('.layui-laypage-curr em').eq(1).text());
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

    //确定检查
    $(".sureExamine").click(function(){
        var amount = $(".amount").val();
        //非必填
        var medicareAmount = $(".medicareAmount").val();
        var mainStatement = $(".mainStatement").val();
        var currentDiseaseHistory = $(".currentDiseaseHistory").val();

        var data = {
            "reservationId": $('.sureExamine').attr('valueid'),
            "amount":amount,
            //非必填
            "medicareAmount":medicareAmount,
            "mainStatement":mainStatement,
            "currentDiseaseHistory":currentDiseaseHistory
//		"censorItems":toHash(special_addTag.getResult()),
        }
        $('.appoint_result_name').each(function (index,value) {
            var value = value.value;
            if(!validate.verify(value,"检查项目名称")){
                return false;
            }
            //console.log(src)
            //属性名是变量的时候，得用[]括号
            data['censorItems['+index+'].name'] = value;
        });
        $('.appoint_result_detail').each(function (index,value) {
            var value = value.value;
            //console.log(src)
            data['censorItems[' + index + '].description'] = value;
        });
        console.log(data);

//	验证
        if(!validate.verifyNum(amount,"预交总费用")){return false;}
        $.post_ajax("/hospital/topthree/censor/add",data,function(data){
            if(data.success){
//			alert("data.data");
                //$(".shade,.popup_box").hide();
                //window.location.href = "appointment_list.html";
            }else{
                alert(data.data);
            }
        });
    });



})

function searchBtn(pageNumber,dateType) {
    var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
    var url = SERVER_ADDR + "/hospital/reception/visitRecord/getNursingCardVisitRecordList.json";
    var data = {};
    data.keyword = $(".newsName").val();
    data.beginDate = $("#newsTime").val();
    data.endDate = $("#newsTimeEnd").val();
    //data.dateType = dateType;
    data.pageNumber = pageNumber;
    data.pageSize = 15;
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
    var nums = 15; //每页出现的数据量
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
            dataHtml += '<tr>'
                /* +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                /*  +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                /*  +'<td><input type="checkbox" valueid="'+data[i].id+'" name="checked" lay-skin="primary" lay-filter="choose"><div class="layui-unselect layui-form-checkbox" lay-skin="primary"><i class="layui-icon"></i></div></td>'*/
                /*+'<td>'+data[i].sn+'</td>'*/
                +'<td>'+Number(i+1)+'</td>'
                +'<td>'+data[i].reservationDate+'</td>'
                +'<td style="color: #2299ee;cursor: pointer" valuemobile="'+data[i].mobile+'" onclick="Get.userInfo(this)">'+data[i].fullName+'</td>'
                +'<td>'+data[i].mobile+'</td>';
            if(data[i].type == "coupon"){
                dataHtml += '<td>体验券</td>'
            }else if(data[i].type == "product"){
                dataHtml += '<td>特价项目</td>'
            }else if(data[i].type == "doctor"){
                dataHtml += '<td>医生</td>'
            }else if(data[i].type == "nursingCard"){
                dataHtml += '<td>护理卡</td>'
            }
            dataHtml += '<td>'+data[i].name+'</td>'
                +'<td>'+'e诺'+'</td>'
                +'<td>'+noData(data[i].doctor)+'</td>'
                +'<td>'+noData(data[i].doctorHelpmate)+'</td>'
                +'<td>'+noData(data[i].guestService)+'</td>'
            /*if(data[i].status == "success"){
                dataHtml += '<td>已预约</td>'
            }else if(data[i].status == "complete"){
                dataHtml += '<td>已完成</td>'
            }else if(data[i].status == "cancel"){
                dataHtml += '<td>已取消</td>'
            }*/
            dataHtml +=  '<td>';
                if(data[i].status == "success"){
                    dataHtml += '<a class="layui-btn layui-btn-normal layui-btn-mini" onclick="write_fen_appiontmentList_open(this)" valueid="'+data[i].id+'">分诊</a>'
                }else if(data[i].status == "complete"){
                    if(!data[i].nursingCardVisitRecord){
                        dataHtml +=  '已完成'
                    }else{
                        if(data[i].nursingCardVisitRecord == 'wait'){
                            dataHtml +=  '<a class="layui-btn layui-btn-normal layui-btn-mini firm" onclick="reset_fen_appiontmentList_open(this)" valueid="'+data[i].nursingCardVisitRecordId+'" visitrecordid="'+data[i].visitRecordId+'" doctorid="'+data[i].doctorId+'" doctorhelpmateid="'+data[i].doctorHelpmateId+'">修改分诊</a>'
                        }else if(data[i].nursingCardVisitRecord == 'loading'){
                            dataHtml +=  '治疗中'
                        }else if(data[i].nursingCardVisitRecord == 'leave'){
                            dataHtml +=  '弃诊'
                        }else{
                            dataHtml +=  '';
                        }
                    }
                }else if(data[i].status == "cancel"){
                    dataHtml +=  '已取消'
                }
            dataHtml += '</td>'
                +'</tr>';
        }
    }else{
        dataHtml = '<tr><td colspan="11">暂无数据</td></tr>';
    }
    return dataHtml;
}
//添加咨询
function addWrite(obj){
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var elThis = $(obj).attr('valueid');
    console.log(4555)
    var index = layui.layer.open({
        title : "添加入诊",
        type : 2,
        area:['62%','68%'],
        content : "addWrite.html?action=reset&valueid=" + elThis ,
        success : function(layero, index){
            localStorage.setItem('appiontmentList',$('.layui-laypage-curr em').eq(1).text());

        }
    })
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
function write_fen_appiontmentList_open(obj) {
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
            localStorage.setItem('appiontmentList',$('.layui-laypage-curr em').eq(1).text());
            $('.layui-layer-shade').remove();
        },
        cancel: function(index, layero){
            $('.writeFenOpen').hide();
            layer.close(index)
            return false;
        }
    })
}
//修改分诊
function reset_fen_appiontmentList_open(obj) {
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var id = $(obj).attr('valueid');
    if(id == 'undefined'){
        layer.msg('该记录不能修改分诊');
        return;
    }
    //var doctorid = $(obj).attr('doctorid');
    //var doctorhelpmateid = $(obj).attr('doctorHelpmateId');
    $('.sureFenToAppiontmentList').attr('valueid',id).attr('action','reset');
    var index = layui.layer.open({
        title : "修改分诊",
        type : 1,
        area: ['345px','420px'],
        content : $('.writeFenOpen'),
        success : function(layero, index){
            //$('.fenTo').val(doctorid);
            form.render();
            localStorage.setItem('appiontmentList',$('.layui-laypage-curr em').eq(1).text());
            $('.layui-layer-shade').remove();
        },
        cancel: function(index, layero){
            $('.writeFenOpen').hide();
            layer.close(index)
            return false;
        }
    })
}
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
                ,content: '<strong>姓名:</strong>'+retInfo.data.fullname + '' + ' &nbsp;&nbsp;&nbsp;&nbsp;<strong>手机号:</strong>' + Get.mobile  + ' &nbsp;&nbsp;&nbsp;&nbsp;<strong>性别:</strong>' + retInfo.data.sex + '<br><strong>出生日期:</strong>' +birthday+ '<br><strong>身份证号:</strong>' + noData(retInfo.data.idCard)
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