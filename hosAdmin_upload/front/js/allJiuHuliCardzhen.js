var form
layui.use(['form','layer','jquery','laypage','laydate','element'],function(){
	 form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
        laydate = layui.laydate,
		$ = layui.jquery;
   /* laydate.render({
        elem: '#newsTime'
    });
    laydate.render({
        elem: '#newsTimeEnd'
    });
    $('#newsTime,#newsTimeEnd').val(new Date().Format('yyyy-MM-dd'));*/
    $('.allJiuHuliCardzhen').addClass('layui-this').parent().parent().addClass('layui-nav-itemed');
    getFentoNameSelect(form,'doctorHelpmate');
    getFentoNameSelect(form,'doctor');
    form.render();
	//加载页面数据
    $('.thatTimeChoose').click(function(){
        $('.thatTimeChoose').css('background-color','white').css('color','#222').removeClass('sureTime');
        $(this).css('background-color','#009688').css('color','white').addClass('sureTime');
    });
    $(".search_btn").click(function(){
        $('.thatTimeChoose').css('background-color','white').css('color','#222')
        searchBtn(1);
    })
    $('.sureFenTo').click(function () {
        var elThisid = $('.sureFenTo').attr('valueid');
        /*if($('.fenToDoctor').val() == '' && $('.fenToZixun').val() == ''){
            layer.msg('请选择预约医生或咨询');
            return;
        }*/
        var data = {};
        if($('.sureFenTo').attr('action') == 'reset'){ //修改分诊
            var url = SERVER_ADDR + "/hospital/reception/visitRecord/update";
            data.id =elThisid;
        }else{
            var url = SERVER_ADDR + "/hospital/reception/visitRecord/allotOnline";
            data.reservationId =elThisid;
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
                localStorage.setItem('allJiuzhen',$('.layui-laypage-curr em').eq(1).text());
                //layer.msg('添加录诊成功');
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
    $('.thatTimeChoose').css('background-color','white').css('color','#222')
    searchBtn(1);


})
function searchBtn(pageNumber,dateType) {
    var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
    var url = SERVER_ADDR + "/hospital/reception/visitRecord/getListOfNursingCard.json";
    var data = {};
    data.keyword = $(".newsName").val();
    data.dateType = dateType;
    //data.beginDate = $("#newsTime").val();
    //data.endDate = $("#newsTimeEnd").val();
    data.pageNumber = pageNumber;
    data.pageSize = 15;
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
                searchBtn(obj.curr,$('.sureTime').attr('day'));
            }
        }
    })
}
function renderDate(data){
    var dataHtml = '';
    if(data.length != 0){
        for(var i=0;i<data.length;i++){
            if(data[i].status == 'wait'){
                data[i].nursingCardVisitRecord = '候诊';
            }else if(data[i].status == 'loading'){
                data[i].nursingCardVisitRecord = '治疗中';
            }else if(data[i].status == 'leave'){
                data[i].nursingCardVisitRecord = '弃诊';
            }else if(data[i].status == 'complete'){
                data[i].nursingCardVisitRecord = '完成';
            }
            var number;
            if (data[i].number) {
                if (data[i].number.split('-')[2] == undefined) {
                    var split2 = '';
                } else {
                    var split2 = data[i].number.split('-')[2];
                }
                number = data[i].number.split('-')[0] + '<span style="color: #009688;font-weight:600">' + data[i].number.split('-')[1] + '</span>' + split2;
            }else{
                number = '';
            }
            dataHtml += '<tr>'
                +'<td>'+Number(i+1)+'</td>'
                +'<td style="color: #2299ee;cursor: pointer" valuemobile="'+data[i].mobile+'" onclick="Get.userInfo(this)">'+noData(data[i].fullName)+'</td>'
                +'<td>'+noData(data[i].mobile)+'</td>'
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
            dataHtml+='<td>'+noData(data[i].name)+'</td>'
                +'<td>'+noData(data[i].source)+'</td>'
              /*  +'<td>'+noData(data[i].source)+'</td>'*/
               /* +'<td>'+new Date(data[i].createDate).Format('yyyy-MM-dd hh:mm:ss')+'</td>'*/
                +'<td>'+noData(data[i].doctor)+'</td>'
                +'<td>'+noData(data[i].doctorHelpmate)+'</td>'
                +'<td>'+noData(data[i].guestService)+'</td>'
            if(data[i].repeat == true){
                dataHtml += '<td>复诊</td>'
            }else if(data[i].repeat == false){
                dataHtml += '<td>初诊</td>'
            }else{
                dataHtml += '<td>不明</td>'
            }
            dataHtml+='<td>'+number+'</td>'
                +'<td>'+noData(data[i].status)+'</td>'
            if(data[i].status == '候诊'){
                dataHtml += '<td><a class="layui-btn layui-btn-normal layui-btn-mini" onclick="reset_fen_open(this)" valueid="'+data[i].nursingCardVisitRecordId+'"  doctorid="'+data[i].doctorId+'" doctorhelpmateid="'+data[i].doctorHelpmateId+'"><i class="iconfont icon-edit"></i>修改分诊</a>';
                dataHtml +=  '<a class="layui-btn layui-btn-danger layui-btn-mini" onclick="visit_close(this)" valueid="'+data[i].id+'">弃诊</a></td>'
            }else if(data[i].status == '治疗中'){
                dataHtml +=  '<td><a class="layui-btn layui-btn-danger layui-btn-mini" onclick="visit_close(this)" valueid="'+data[i].id+'">弃诊</a></td>'
            }else{
                dataHtml += '<td></td>';
            }
            dataHtml+='</tr>'
        }
    }else{
        dataHtml = '<tr><td colspan="13">暂无数据</td></tr>';
    }
    return dataHtml;
}
function reset_fen_open(obj) {
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var id = $(obj).attr('valueid');
    var doctorid = $(obj).attr('doctorid');
    //var doctorhelpmateid = $(obj).attr('doctorHelpmateId');
    $('.sureFenTo').attr('valueid',id).attr('action','reset');
    var index = layui.layer.open({
        title : "修改分诊",
        type : 1,
        area: ['345px','420px'],
        content : $('.writeFenOpen'),
        success : function(layero, index){
            //$('.fenTo').val(doctorid);
            form.render();
            localStorage.setItem('allJiuzhen',$('.layui-laypage-curr em').eq(1).text());
            $('.layui-layer-shade').remove();
        },
        cancel: function(index, layero){
            $('.writeFenOpen').hide();
            layer.close(index)
            return false;
        }
    })
}
function reset_addwrite(obj) {
    var id = $(obj).attr('valueid');

    var index = layui.layer.open({
        title : "修改信息",
        type : 2,
        area: ['745px','620px'],
        content : "resetWrite.html?action=reset&valueid=" + id,
        success : function(layero, index){
            localStorage.setItem('allJiuzhen',$('.layui-laypage-curr em').eq(1).text());
        },
        cancel: function(index, layero){
            layer.close(index)
            return false;
        }
    })
}
function visit_close(obj) {
    var elthis = $(obj);
    var appoint_id = elthis.attr("valueid");
    //window.localStorage.setItem("appoint_id",appoint_id);
    layer.confirm('确认取消？', {
        btn: ['确认','暂不取消'], //按钮
        icon:3
    }, function(){
        var data = {
            "visitRecordId":appoint_id
        }
        postget_ajax("/hospital/reception/visitRecord/leave",data,'POST',function(res){
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
                ,content: '<strong>姓名:</strong>'+retInfo.data.fullname + '' + ' &nbsp;&nbsp;&nbsp;&nbsp;<strong>手机号:</strong>' + Get.mobile  + ' &nbsp;&nbsp;&nbsp;&nbsp;<strong>性别:</strong>' + retInfo.data.sex + '<br><strong>出生日期:</strong>' + birthday+ '<br><strong>身份证号:</strong>' + noData(retInfo.data.idCard)
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