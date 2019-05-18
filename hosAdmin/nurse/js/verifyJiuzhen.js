var form
layui.use(['form','layer','jquery','laypage','laydate','element'],function(){
	 form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
        laydate = layui.laydate,
		$ = layui.jquery;

    $('.verifyJiuzhen').addClass('layui-this').parent().parent().addClass('layui-nav-itemed');
    getFentoNameSelect(form,'doctorHelpmate');
    getFentoNameSelect(form,'doctor');
    form.render();
	//加载页面数据
    $('.thatTimeChoose').click(function(){
        $('.thatTimeChoose').css('background-color','white').css('color','#222')
        $(this).css('background-color','#009688').css('color','white');
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
                localStorage.setItem('verifyJiuzhen',$('.layui-laypage-curr em').eq(1).text());
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
    searchBtn(1);


})
function searchBtn(pageNumber,dateType) {
    var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
    var url = SERVER_ADDR + "/hospital/reception/visitRecord/getVisitRecordList.json";
    var data = {};
    data.keyword = $(".newsName").val();
    //data.dateType = dateType;
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
                searchBtn(obj.curr);
            }
        }
    })
}
function renderDate(data){
    var dataHtml = '';
    if(data.length != 0){
        for(var i=0;i<data.length;i++){
            if(data[i].status == 'uncheck'){
                data[i].status = '待审核';
            }/*else if(data[i].status == 'loading'){
                data[i].status = '治疗中';
            }else if(data[i].status == 'leave'){
                data[i].status = '弃诊';
            }*/
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
            }else{
                dataHtml += '<td>无</td>'
            }
            dataHtml+='<td>'+noData(data[i].name)+'</td>'
                +'<td>'+noData(data[i].source)+'</td>'
               /* +'<td>'+new Date(data[i].createDate).Format('yyyy-MM-dd hh:mm:ss')+'</td>'*/
                +'<td>'+noData(data[i].doctor)+'</td>'
                +'<td>'+noData(data[i].doctorHelpmate)+'</td>'
                +'<td>'+noData(data[i].guestService)+'</td>'
            /*if(data[i].repeat == true){
                dataHtml += '<td>复诊</td>'
            }else if(data[i].repeat == false){
                dataHtml += '<td>初诊</td>'
            }else{
                dataHtml += '<td>不明</td>'
            }*/
            dataHtml+='<td>'+number+'</td>'
              /*  +'<td>'+noData(data[i].status)+'</td>'*/

                dataHtml += '<td><a class="layui-btn layui-btn-normal layui-btn-mini" onclick="yesJiuzhen(this)" valueid="'+data[i].id+'"><i class="iconfont"></i>同意</a>' +
                    '<a class="layui-btn layui-btn-danger layui-btn-mini" onclick="noJiuzhen(this)" valueid="'+data[i].id+'"><i class="iconfont"></i>删除</a></td>'

            dataHtml+='</tr>'
        }
    }else{
        dataHtml = '<tr><td colspan="11">暂无数据</td></tr>';
    }
    return dataHtml;
}
function yesJiuzhen(obj) {
    var elThis = $(obj);
    var id = elThis.attr('valueid');
    var index = layer.confirm('确认同意？', {
        btn: ['确认','取消'], //按钮
        icon:3
    }, function(){
        var url = SERVER_ADDR + "/hospital/reception/visitRecord/agree";
        var data = {};
        data.visitRecordId = id;
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                elThis.parent().text('已同意');
                layer.close(index);
            }else{
                layer.alert(retInfo.data,{icon:5});
            }
        },'请求失败', 'POST', undefined, undefined);
    }, function(){

    });
}
function noJiuzhen(obj) {
    var elThis = $(obj);
    var id = elThis.attr('valueid');
    var index  = layer.confirm('确认删除？', {
        btn: ['确认','取消'], //按钮
        icon:3
    }, function(){
        var url = SERVER_ADDR + "/hospital/reception/visitRecord/delete";
        var data = {};
        data.visitRecordId = id;
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                elThis.parent().parent().remove();
                layer.close(index);
            }else{
                layer.alert(retInfo.data,{icon:5});
            }
        },'请求失败', 'POST', undefined, undefined);
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
            layer.open({
                title: '个人信息'
                ,content: '<strong>姓名:</strong>'+retInfo.data.fullname + '' + ' &nbsp;&nbsp;&nbsp;&nbsp;<strong>手机号:</strong>' + Get.mobile  + ' &nbsp;&nbsp;&nbsp;&nbsp;<strong>性别:</strong>' + retInfo.data.sex + '<br><strong>出生日期:</strong>' + new Date(retInfo.data.birthday).Format("yyyy-MM-dd")+ '<br><strong>身份证号:</strong>' + retInfo.data.idCard
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