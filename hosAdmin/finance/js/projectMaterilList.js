var form;
var visitRecordId;
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
    var date = new Date();
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
    var url = SERVER_ADDR + "/hospital/finance/findProjectMaterial.json";
    var data = {};
    data.keyword = $(".newsName").val();
    data.start = $("#newsTime").val();
    data.end = $("#newsTimeEnd").val();
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
    },'请求失败', 'POST', undefined, undefined);
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
                +'<td style="color: #2299ee;cursor: pointer" valueid="'+data[i].hospitalUserId+'" valuemobile="'+data[i].mobile+'" onclick="visitUserJiuzhenInfo(this)">'+data[i].userName+'</td>'
                +'<td>'+data[i].mobile+'</td>';
            dataHtml += '<td>'+noData(data[i].doctorName)+'</td>'+
                        '<td>'+noData(data[i].nurseName)+'</td>'
            if(!data[i].diseases){
                dataHtml += '<td>无</td>'
            }else{
                dataHtml += '<td valueid="'+data[i].userOfflineProject+'" onclick="readOrderOpen(this)" style="color: #2299ee;cursor: pointer;">'+data[i].diseases+'</td>'
            }
            dataHtml +='<td>'+noData(data[i].modelNo)+'</td>'
            dataHtml +='<td>'+noData(data[i].quantity)+'</td>'
                +'<td>'+noData(data[i].totalPrice)+'</td>'
            dataHtml += '</tr>';
        }
    }else{
        dataHtml = '<tr><td colspan="14">暂无数据</td></tr>';
    }
    return dataHtml;
}
function openRemark(obj) {
    visitRecordId = $(obj).attr('valueVisitId');
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
    var url = SERVER_ADDR + "/hospital/reception/visitRecord/addRemarks";
    var data = {};
    data.visitRecordId = visitRecordId;
    data.remarks = value;
    ajaxGetRetInfo(url,data,function (retInfo) {
        if(retInfo.success){
            localStorage.setItem('allDoctorOrder',$('.layui-laypage-curr em').eq(1).text());
            layer.msg('添加成功');
            setTimeout(function () {
                layer.close(index);
                window.location.reload();
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
    var url = SERVER_ADDR + "/hospital/finance/exportProjectMaterialExcel";
    var data = {};
    data.keyword = $(".newsName").val();
    //data.status = $('.status').val();
    data.start = $('#newsTime').val();
    data.end= $('#newsTimeEnd').val();
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