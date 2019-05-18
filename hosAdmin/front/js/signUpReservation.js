var form;
var visitRecordId;
var reset = false;
var yuyueId;
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
    laydate.render({
        elem: '#signUpTime'
        ,trigger: 'click'
        ,done: function(value, date){
            $('#signUpTimeEnd').val(value);
        }
    });
    laydate.render({
        elem: '#signUpTimeTime'
        ,trigger: 'click',
        type:'time'
        ,min: '08:30:00'
        ,max: '18:00:00'
        ,btns: ['clear', 'confirm']
    });
    laydate.render({
        elem: '#signUpTimeEnd'
        ,trigger: 'click'
    });
    laydate.render({
        elem: '#signUpTimeTimeEnd'
        ,trigger: 'click',
        type:'time'
        ,min: '08:30:00'
        ,max: '18:00:00'
        ,btns: ['clear', 'confirm']
    });
    var date = new Date();
    var firstDay = new Date();
    var lastDay = new Date(date.getFullYear(), date.getMonth()+1, 0)//new Date(date.getFullYear(), date.getMonth(), 1);
    $('#newsTime').val(firstDay.Format('yyyy-MM-dd'));
    $('#newsTimeEnd').val(lastDay.Format('yyyy-MM-dd'));
    //getFentoNameSelect(form,'doctorHelpmate');
    getFentoNameSelect(form,'doctor');
    //getSourseList();
    form.render();
    /*form.on('select(fenTo)', function(data){  //根据分类获取类型
        getFentoNameSelect(form,data.elem[data.elem.selectedIndex].title);
    });*/
    searchBtn();
    $('.signUpReservation').addClass('layui-this').parent().parent().addClass('layui-nav-itemed');
	//加载页面数据
    $('.thatTimeChoose').click(function(){
        $('.thatTimeChoose').css('background-color','white').css('color','#222')
        $(this).css('background-color','#009688').css('color','white');
    });
    $(".search_btn").click(function(){
        console.log(111)
        $('.thatTimeChoose').css('background-color','white').css('color','#222')
        searchBtn(1);
	})
    var addNews = {};
    form.on("submit(sureSignUp)",function(data){
        //addNews.intentProjectName = $(".intentProjectName").val();
        /*if($(".fenToDoctor").val() == '' &&  $(".fenToZixun").val() == ''){
            //layer.msg('请选择预约医生或咨询');
            //return
            //$('.fenToDoctor').attr('lay-verify','required')
        }*/
        //addSourse();
        addNews.medicalAppointmentUserName = $(".signUpName").val();
        addNews.medicalAppointmentUserTelphone = $('.signUpMobile').val();
        addNews.appointmentStartDatetime = $('#signUpTime').val() + ' ' + $('#signUpTimeTime').val();
        addNews.appointmentEndDatetime = $('#signUpTimeEnd').val() + ' ' + $('#signUpTimeTimeEnd').val();
        addNews.appointmentDoctorId = $(".fenToAdd").val();
        addNews.status = 'unfinished';
        //addNews.intentOperator = $(".intentOperator").val();
        //addNews.customerCare = $(".jiedai").val();
        addNews.appointmentContent = $(".signUpDetail").val();
        if(reset == true){
            addNews.id = yuyueId;
        }
        var url = SERVER_ADDR + "/medical_appointment_user_request/edit";
        var index = layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        ajaxGetRetInfo(url,addNews,function (retInfo) {
            console.log(retInfo)
            layer.close(index);
            layer.msg('添加成功');
            if(retInfo.success){
                window.location.reload();
            }else{
                if(retInfo.data == '请先登录'){
                    window.location.href = '/hosAdmin/login.html';
                }else{
                    layer.alert(retInfo.data,{icon:5})
                }
            }
            //form.render('select', 'from');//更新
        },'请求失败', 'POST', undefined, undefined);
        //return;
        //弹出loading
        return false;
    })

})
function searchBtn(pageNumber,type) {
    var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
    var url = SERVER_ADDR + "/medical_appointment_user_request/all";
    var data = {};
    data.searchKey = $(".newsName").val();
    data.status = $(".statusjSelect").val();
    data.startDate = $("#newsTime").val();
    data.endDate = $("#newsTimeEnd").val();
    data.doctorId = $('.fenTo').val();
    ajaxGetRetInfo(url,data,function (retInfo) {
        console.log(retInfo)
        layer.close(index);
        if(retInfo.success){
            $('.event_year,.event_list').empty();
            retInfo.data.forEach(function (value,index) {
                if(index == 0){
                    $('.event_year').append('<li class="current"><label for="'+value.date+'">'+value.date+'</label></li>');
                }else{
                    $('.event_year').append('<li><label for="'+value.date+'">'+value.date+'</label></li>');
                }
                $('.event_list').append('<div class="appendLiDiv'+value.date+'" ><h3 id="'+value.date+'">'+value.date+'</h3></div>');
                var html = '';
                value.collections.forEach(function (valueContent) {
                    html += '<li>' +
                        '<span>' +
                        '<span>' + valueContent.appointmentStartTime + '</span><span>至</span>'
                    if(valueContent.appointmentEndDatetime.split(' ')[0] == value.date){
                        html += '<span>' + valueContent.appointmentEndDatetime.split(' ')[1] + '</span>'
                    }else{
                        html += '<span style="width: 130px">' + valueContent.appointmentEndDatetime + '</span>'
                    }
                    html +='</span>'+
                        '<p>'
                    if(valueContent.status == 'success'){
                        html += '<span style="background-color: #ececec">'
                    }else{
                        html += '<span>'
                    }
                    html +='<cite class="appointmentDoctorName">预约医生：' + valueContent.appointmentDoctorName + '</cite>' +
                        '<cite class="medicalAppointmentUserName">姓名：' + valueContent.medicalAppointmentUserName + '</cite>' +
                        '<cite class="medicalAppointmentUserTelphone">联系方式：' + valueContent.medicalAppointmentUserTelphone + '</cite>'
                        if(valueContent.existsChange == false){
                            html += '<cite class="lastModifyHospitalEmployeeName">添加人：' + valueContent.addHospitalEmployeeName + '</cite><br>'
                        }else{
                            html += '<cite style="color: #2299ee;cursor: pointer" onclick="readResetSignUpList(this)" valueid="'+valueContent.id+'" class="lastModifyHospitalEmployeeName">修改人：' + valueContent.lastModifyHospitalEmployeeName + '</cite><br>'
                        }
                    html +='<cite class="appointmentContent">预约详情：' + valueContent.appointmentContent + '</cite><br>';
                    if(valueContent.status == 'success'){
                        html +='<cite class="caozuoContent" style="color: #555">已完成' +
                            '<a class="layui-btn layui-btn-danger layui-btn-mini" style="margin-left: 10px" onclick="delSignUpOne(this)" valueid="'+valueContent.id+'">删除</a>' +
                            '</cite>'
                    }else{
                        html +='<cite class="caozuoContent"><a class="layui-btn layui-btn-normal layui-btn-mini" onclick="resetSignUp(this)" valueid="'+valueContent.id+'"><i class="iconfont icon-edit"></i>修改</a>' +
                            '<a class="layui-btn layui-btn-mini" onclick="successSignUpOne(this)" valueid="'+valueContent.id+'">完成</a>' +
                            '<a class="layui-btn layui-btn-danger layui-btn-mini" onclick="delSignUpOne(this)" valueid="'+valueContent.id+'">删除</a>' +
                            '</cite>'
                    }


                    html +='</span></p></li>';
                })
                $(".appendLiDiv" + value.date).append(html);
            })
            $('label').click(function(){
                $('.event_year>li').removeClass('current');
                $(this).parent('li').addClass('current');
                var year = $(this).attr('for');
                $('#' + year).parent().prevAll('div').slideUp(800);
                $('#' + year).parent().slideDown(800).nextAll('div').slideDown(800);
            });
        }else{
            layer.alert(retInfo.data,{icon:5});
        }
    },'请求失败', 'GET', undefined, undefined);
}
function delSignUpOne(obj) {
    var id = $(obj).attr('valueid');
    var url = SERVER_ADDR + "/medical_appointment_user_request/one/" + id;
    var Data = '';
    /*Data.id = id;*/
    layer.confirm('确定删除？',{icon:3}, function(index){
        ajaxGetRetInfo(url,Data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                layer.msg('删除成功');
                setTimeout(function () {
                    window.location.reload();
                },1000)
            }else{
                layer.msg(retInfo.data);
            }
        },'请求失败', 'DELETE', undefined, undefined);
    });
}
function successSignUpOne(obj) {
    var id = $(obj).attr('valueid');
    var url = SERVER_ADDR + "/medical_appointment_user_request/updateStatus";
    var Data = {};
    Data.id = id;
    Data.status = 'success';
    layer.confirm('确定完成？',{icon:3}, function(index){
        ajaxGetRetInfo(url,Data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                layer.msg('已完成');
                setTimeout(function () {
                    window.location.reload();
                },1000)
            }else{
                layer.msg(retInfo.data);
            }
        },'请求失败', 'GET', undefined, undefined);
    });
}
function readResetSignUpList(obj) {
    var id = $(obj).attr('valueid');
    var index = layui.layer.open({
        title : "修改记录",
        type : 1,
        area: ['700px','500px'],
        content : $('.news_list'),
        success : function(layero, index){
            $('.layui-layer-shade').remove();
                var url = SERVER_ADDR + "/medical_appointment_user_request/all/modifyRecord";
                var Data = {};
                Data.id = id;
                ajaxGetRetInfo(url,Data,function (retInfo) {
                    console.log(retInfo)
                    if(retInfo.success){
                        $(".news_content").html(renderDate(retInfo.data));
                    }else{
                        layer.msg(retInfo.data);
                    }
                },'请求失败', 'GET', undefined, undefined);
        },
        cancel: function(index, layero){
            $('.writeFenOpendDoctorHelpmate').hide();
            layer.close(index)
            return false;
        }
    })
}
function renderDate(data){
    var dataHtml = '';
    if(data.length != 0){
        for(var i=0;i<data.length;i++){
            dataHtml += '<tr>'
                +'<td>'+Number(i+1)+'</td>'
                +'<td>'+data[i].modifyDatetime+'</td>'
                +'<td>'+data[i].modifyHospitalEmployeeName+'</td>'
                +'<td>'+data[i].modifyContent+'</td>';
            dataHtml += '</tr>';
        }
    }else{
        dataHtml = '<tr><td colspan="3">暂无数据</td></tr>';
    }
    return dataHtml;
}
function addSignUp() {
    var index = layui.layer.open({
        title : "添加预约",
        type : 1,
        area: ['700px','550px'],
        content : $('.writeFenOpen'),
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
function resetSignUp(obj) {
    var id = $(obj).attr('valueid');
    var index = layui.layer.open({
        title : "修改预约",
        type : 1,
        area: ['700px','550px'],
        content : $('.writeFenOpen'),
        success : function(layero, index){
            $('.layui-layer-shade').remove();
            initResetSignUp(id);
        },
        cancel: function(index, layero){
            $('.writeFenOpendDoctorHelpmate').hide();
            layer.close(index)
            return false;
        }
    })
}
function initResetSignUp(id) {
    var url = SERVER_ADDR + "/medical_appointment_user_request/one";
    var Data = {};
    Data.id = id;
    ajaxGetRetInfo(url,Data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            yuyueId = retInfo.data.id;
            reset = true;
            $(".signUpName").val(retInfo.data.medicalAppointmentUserName);
            $('.signUpMobile').val(retInfo.data.medicalAppointmentUserTelphone);
            $('#signUpTime').val(new Date(retInfo.data.appointmentStartDatetime).Format('yyyy-MM-dd hh:mm:ss').split(' ')[0]);
            $('#signUpTimeTime').val(new Date(retInfo.data.appointmentStartDatetime).Format('yyyy-MM-dd hh:mm:ss').split(' ')[1]);
            $('#signUpTimeEnd').val(new Date(retInfo.data.appointmentEndDatetime).Format('yyyy-MM-dd hh:mm:ss').split(' ')[0]);
            $('#signUpTimeTimeEnd').val(new Date(retInfo.data.appointmentEndDatetime).Format('yyyy-MM-dd hh:mm:ss').split(' ')[1]);
            $(".fenToAdd").val(retInfo.data.appointmentDoctorId);
            $(".signUpDetail").val(retInfo.data.appointmentContent);
            form.render();
        }else{
            layer.msg(retInfo.data);
        }
    },'请求失败', 'GET', undefined, undefined);
}