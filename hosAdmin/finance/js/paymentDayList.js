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
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
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
    $('.patientList').addClass('layui-this').parent().parent().addClass('layui-nav-itemed');
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
    var url = SERVER_ADDR + getQueryString('payUrl');
    var data = {};
    data.paymentDate = getQueryString('date');
    data.keyword = $(".newsName").val();
    data.payMethod = getQueryString('payMethods');
   /* data.beginDate = $("#newsTime").val();*/
    /*data.endDate = $("#newsTimeEnd").val();*/
    /*data.status = $('.status').val();*/
    //data.source = $('.fromYuyue').val();
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
            if(retInfo.data){
                newsList(retInfo.data.list,retInfo.totalCount,pageNumber);
            }else {
                newsList([],retInfo.totalCount,pageNumber);
            }
            //$('.totalPrice').text(retInfo.data.totalAmount);
        }else{
            layer.alert(retInfo.data,{icon:5});
        }
    },'请求失败', 'GET', undefined, undefined);
}
function newsList(list,totalCount,current){
    //渲染数据
    $(".news_content").html(renderDate(list));

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
                searchBtn(obj.curr,getQueryString('payMethods'));
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
            }else if(data[i].status == 'leave'){
                data[i].status = '弃诊';
            }else if(data[i].status == 'complete'){
                data[i].status = '完成';
            }
            if (data[i].payMethod == 'cash') {
                data[i].payMethod = '<td>现金支付</td>'
            } else if (data[i].payMethod == 'card') {
                data[i].payMethod = '<td>医院收款</td>'
            } else if (data[i].payMethod == 'medicalInsurance') {
                data[i].payMethod = '<td>医保支付</td>'
            } else if (data[i].payMethod == 'platform') {
                data[i].payMethod = '<td>平台支付</td>'
            }else if(!data[i].payMethod){
                if (data[i].method == 'wxpay') {
                    data[i].payMethod = '<td>微信支付</td>'
                } else if (data[i].method == 'alipay') {
                    data[i].payMethod = '<td>支付宝支付</td>'
                } else if (data[i].method == 'lianpay') {
                    data[i].payMethod = '<td>连连支付</td>'
                } else if (data[i].method == 'platform') {
                    data[i].payMethod = '<td>余额支付</td>'
                }
            }
            if(data[i].createDate){
                var date = new Date(data[i].createDate).Format('yyyy-MM-dd hh:mm:ss');
            }else{
                var date = '无'
            }
            var number;
            if(data[i].number){
                if(data[i].number.split('-')[2] == undefined){
                    var split2 = '';
                }else{
                    var split2 = data[i].number.split('-')[2];
                }
                number =  data[i].number.split('-')[0] + '<span style="color: #009688;font-weight:600">'+ data[i].number.split('-')[1]+'</span>' +  split2;
            }else{
                number = '无'
            }

            dataHtml += '<tr>'
                +'<td>'+Number(i+1)+'</td>'
                +'<td>'+data[i].payDate+'</td>'
                +'<td style="color: #2299ee;cursor: pointer" valuemobile="'+data[i].mobile+'" onclick="visitUserJiuzhenInfo(this)">'+data[i].fullname+'</td>'
                +'<td>'+data[i].mobile+'</td>'
                +'<td>'+number+'</td>';
            if(data[i].type == "coupon"){
                data[i].source = 'e诺平台';
                dataHtml += '<td>体验券</td>'
            }else if(data[i].type == "product"){
                data[i].source = 'e诺平台';
                dataHtml += '<td>特价项目</td>'
            }else if(data[i].type == "doctor"){
                data[i].source = 'e诺平台';
                dataHtml += '<td>医生</td>'
            }else{
                dataHtml += '<td>线下开单</td>'
            }
            dataHtml += '<td>'+noData(data[i].projectName)+'</td>' +
                '<td>'+noData(data[i].source)+'</td>'
                +'<td>'+noData(data[i].doctorHelpmate)+'</td>'
                +'<td>'+noData(data[i].doctor)+'</td>'
                +'<td>'+noData(data[i].nurse)+'</td>'
                +'<td>'+noData(data[i].guestService)+'</td>'
                +data[i].payMethod
                if(!data[i].userOfflineProjectId){
                    dataHtml += '<td>'+data[i].amount +'</td>';
                }else{
                    dataHtml += '<td style="color: #2299ee;cursor: pointer" valueid="'+data[i].userOfflineProjectId+'" onclick="readOrderOpen(this)">'+data[i].amount +'</td>';
                }



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
        dataHtml = '<tr><td colspan="13">暂无数据</td></tr>';
    }
    console.log(dataHtml)
    return dataHtml;
}
function allOrderDetail(obj) {
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
}

