var form;
var hospitalRecieptRecordId;
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
    toAllFirstTopTab('.orderLi','.toOrderBtn');
    var date = new Date();
    //var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date();//new Date(date.getFullYear(), date.getMonth(), 1);
    $('#newsTime').val(firstDay.Format('yyyy-MM-dd'));
    $('#newsTimeEnd').val(lastDay.Format('yyyy-MM-dd'));

    //getFentoNameSelect(form,'doctorHelpmate');
    //getFentoNameSelect(form,'doctor');
    //getSourseList();
    form.render();
    /*form.on('select(fenTo)', function(data){  //根据分类获取类型
        getFentoNameSelect(form,data.elem[data.elem.selectedIndex].title);
    });*/
    searchBtn(localStorage.getItem('allDoctorOrder') || 1);
    localStorage.removeItem('allDoctorOrder');
    $('.jiezhenList').addClass('layui-this').parent().parent().addClass('layui-nav-itemed');
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

})
function searchBtn(pageNumber,type) {
    var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
    var url = SERVER_ADDR + "/hospital/finance/getEveryHospitalReceipt.json";
    var data = {};
    data.keyword = $(".newsName").val();
    data.start = $("#newsTime").val();
    data.end = $("#newsTimeEnd").val();
    //data.status = $('.status').val();
    data.pageNumber = pageNumber;
    data.pageSize = 15;
    ajaxGetRetInfo(url,data,function (retInfo) {
        console.log(retInfo)
        layer.close(index);
        if(retInfo.success){
            if(retInfo.data.list){
                newsList(retInfo.data.list,retInfo.totalCount,pageNumber);
            }else {
                newsList([],retInfo.totalCount,pageNumber);
            }
            $('.totalPrice').text(0).text(retInfo.data.totalAmount);
            $('.totalHospitalPrice').text(0).text(retInfo.data.hospital);
            $('.totalPlatformPrice').text(0).text(retInfo.data.platform);
            $('.totalmedicalInsurancePrice').text(0).text(retInfo.data.medicalInsurance);

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
        for(var i=0;i<data.length;i++){
          /*  var number;
            if(data[i].number.split('-')[2] == undefined){
                var split2 = '';
            }else{
                var split2 = data[i].number.split('-')[2];
            }
            number =  data[i].number.split('-')[0] + '<span style="color: #009688;font-weight:600">'+ data[i].number.split('-')[1]+'</span>' +  split2;
*/
            dataHtml += '<tr>'
                /* +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                /*  +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                /*  +'<td><input type="checkbox" valueid="'+data[i].id+'" name="checked" lay-skin="primary" lay-filter="choose"><div class="layui-unselect layui-form-checkbox" lay-skin="primary"><i class="layui-icon"></i></div></td>'*/
                /*+'<td>'+data[i].sn+'</td>'*/
                +'<td>'+Number(i+1)+'</td>'
                +'<td>'+new Date(data[i].createDate).Format('yyyy-MM-dd hh:mm:ss')+'</td>'
                +'<td style="color: #2299ee;cursor: pointer" valueid="'+data[i].hospitalUserId+'" valueindex="1" valuemobile="'+data[i].mobile+'" onclick="toUserInfo(this)">'+data[i].fullname+'</td>'
                +'<td>'+data[i].mobile+'</td>';
          /*  if(!data[i].type){
                dataHtml += '<td>无</td>'
            }else{
                dataHtml += '<td>'+returnProjectType(data[i].type)+'</td>'
            }
            dataHtml += '<td>'+noData(data[i].name)+'</td>'*/
            if(!data[i].diseases){
                dataHtml += '<td>无</td>'
            }else{
                dataHtml += '<td valueuserOfflineProject="'+data[i].userOfflineProjectId+'" onclick="allOrderDetail(this)" style="color: #2299ee;cursor: pointer;">'+data[i].diseases+'</td>'
            }
            dataHtml +='<td style="word-break: break-all;word-wrap: break-word">'+returnVisitRecordNumber(data[i].number)+'</td>'
            dataHtml +='<td>'+noData(data[i].source)+'</td>'
        /*    if(data[i].repeat == true){
                dataHtml += '<td>复诊</td>'
            }else if(data[i].repeat == false){
                dataHtml += '<td>初诊</td>'
            }else{
                dataHtml += '<td>不明</td>'
            }*/
            dataHtml +='<td>'+noData(data[i].creator)+'</td>'
                +'<td>'+noData(data[i].doctorHelpmate)+'</td>'
                +'<td>'+noData(data[i].doctor)+'</td>'
                +'<td>'+noData(data[i].nurse)+'</td>'
               /* +'<td>'+number+'</td>'*/
            /*    +'<td>'+data[i].status+'</td>'*/
            if (data[i].payMethod == 'card' || data[i].payMethod == 'cash') {
                dataHtml += '<td>医院收款</td>'
            } else if (data[i].payMethod == 'medicalInsurance') {
                dataHtml += '<td>医保支付</td>'
            } else if (data[i].payMethod == 'platform') {
                dataHtml += '<td>平台支付</td>'
            }
            dataHtml +='<td>'+noData(data[i].amount) +'</td>'
            if(!data[i].remark){
                dataHtml += '<td style="color: #2299ee;cursor: pointer;" onclick="openRemark(this)" valueId="'+data[i].id+'" vauleText="">添加</td>'
            }else{
                dataHtml += '<td title="'+data[i].remark+'">'+returnSubstring(noData(data[i].remark)) +'<span style="color: #2299ee;cursor: pointer;margin-left: 6px" valueId="'+data[i].id+'" vauleText="'+data[i].remark+'" onclick="openRemark(this)">查看修改</span></td>'
            }
            //dataHtml +='<td>'+noData(data[i].remark) +'</td>'
             /*   if(!data[i].remarks){
                    dataHtml += '<td style="color: #2299ee;cursor: pointer;" onclick="openRemark(this)" valueVisitId="'+data[i].visitRecordId+'" vauleText="">添加</td>'
                }else{
                    dataHtml += '<td title="'+data[i].remarks+'">'+returnSubstring(noData(data[i].remarks)) +'<span style="color: #2299ee;cursor: pointer;margin-left: 6px" valueVisitId="'+data[i].visitRecordId+'" vauleText="'+data[i].remarks+'" onclick="openRemark(this)">查看修改</span></td>'
                }*/
            /*if(data[i].status == "success"){
                dataHtml += '<td>已预约</td>'
            }else if(data[i].status == "complete"){
                dataHtml += '<td>已完成</td>'
            }else if(data[i].status == "cancel"){
                dataHtml += '<td>已取消</td>'
            }*/
                /*if(data[i].status == "候诊"){
                    if(!data[i].doctor){
                        dataHtml += '<a class="layui-btn layui-btn-normal layui-btn-mini firm" onclick="fenVisitTo(this)" valueid="'+data[i].id+'" >分诊</a>' ;
                    }
                    dataHtml += '<a class="layui-btn layui-btn-normal layui-btn-mini firm" onclick="addVisitProject(this)" valueid="'+data[i].id+'" >治疗</a>';
                    dataHtml +=  '<a class="layui-btn layui-btn-normal layui-btn-mini" onclick="visit_firm(this)" valueid="'+data[i].id+'">完成</a>'
                }else if(data[i].status == "治疗中"){
                //dataHtml +=  '<a class="layui-btn layui-btn-normal layui-btn-mini firm" onclick="reset_fen_appiontmentList_open(this)" valueid="'+data[i].id+'" visitrecordid="'+data[i].visitRecordId+'" doctorid="'+data[i].doctorId+'" doctorhelpmateid="'+data[i].doctorHelpmateId+'">添加项目</a>'
                    dataHtml +=  '<a class="layui-btn layui-btn-normal layui-btn-mini" onclick="visit_firm(this)" valueid="'+data[i].id+'">完成</a>'
                }*/
            /*dataHtml +=  '<a class="layui-btn layui-btn-normal layui-btn-mini" onclick="allOrderDetail(this)" valuedisease="'+data[i].diseases+'" valueid="'+data[i].id+'">查看清单</a>'*/

            dataHtml += '</tr>';
        }
    }else{
        dataHtml = '<tr><td colspan="14">暂无数据</td></tr>';
    }
    return dataHtml;
}
function openRemark(obj) {
    hospitalRecieptRecordId = $(obj).attr('valueId');
    var value = $(obj).attr('vauleText');
    layer.prompt({
        formType: 2,
        value: value,
        title: '备注信息'
    }, function(value,index){
        sureRemark(value,index);
    });
}
function sureRemark(value,index) {
    var index = index;
    var url = SERVER_ADDR + "/hospital/finance/updateRemarks";
    var data = {};
    data.id = hospitalRecieptRecordId;
    data.remark = value;
    ajaxGetRetInfo(url,data,function (retInfo) {
        if(retInfo.success){
            localStorage.setItem('allDoctorOrder',$('.layui-laypage-curr em').eq(1).text());
            layer.msg('添加成功');
            setTimeout(function () {
                layer.close(index);
                setTimeout(function () {
                    window.location.reload();
                },1000);
            },1000);
        }else{
            layer.alert(retInfo.data,{icon:5});
        }
    },'请求失败', 'POST', undefined, undefined);
}
function searchBtnOutExcel() {
    if(DateDiff($('#newsTime').val(),$('#newsTimeEnd').val()) > 30){
        layer.alert('导出表格两个日期之间不能超过30天',{icon:0});
        return;
    }
    var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
    var url = SERVER_ADDR + "/hospital/finance/exportHospitalReceiptExcel";
    var data = {};
    data.keyword = $(".newsName").val();
    data.status = $('.status').val();
    data.beginDate = $('#newsTime').val();
    data.endDate = $('#newsTimeEnd').val();
    ajaxGetRetInfo(url,data,function (retInfo) {
        //console.log(retInfo)
        layer.close(index);
        if(retInfo.success){
            window.open(retInfo.data.excelURL);
            //newsList(retInfo.data);
        }else{
            layer.alert(retInfo.data,{icon:5});
        }
    },'请求失败', 'POST', undefined, undefined);
}
/*function allOrderDetail(obj) {
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var id = $(obj).attr('valueid');
    var disease = $(obj).attr('valuedisease');
    var index = layui.layer.open({
        title : "材料清单",
        type : 2,
        area: ['750px','450px'],
        content : 'orderDetail.html?id=' + id + '&disease=' + disease,
        success : function(layero, index){

        },
        cancel: function(index, layero){
            layer.close(index)
            return false;
        }
    })
}*/
//添加项目
/*
function visitUserInfo(obj){
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var elThis = $(obj).attr('valuemobile');
    console.log(4555)
    var index = layui.layer.open({
        title : "个人/就诊信息",
        type : 2,
        area:['800px','75%'],
        content : "historyVisit.html?mobile=" + elThis,
        success : function(layero, index){
            //localStorage.setItem('visit',$('.layui-laypage-curr em').eq(1).text());

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
                ,content: '<strong>姓名:</strong>'+retInfo.data.fullname + '' + ' &nbsp;&nbsp;&nbsp;&nbsp;<strong>手机号:</strong>' + Get.mobile  + ' &nbsp;&nbsp;&nbsp;&nbsp;<strong>性别:</strong>' + retInfo.data.sex + '<br><strong>出生日期:</strong>' + birthday+ '<br><strong>身份证号:</strong>' + noData(retInfo.data.idCard)
            });
        }
    }
}