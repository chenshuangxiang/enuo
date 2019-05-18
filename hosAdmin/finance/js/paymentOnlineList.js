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
    form.on('radio(alltongji)', function(data){
        if(data.value == '挂号费统计'){
            window.location.href = SERVER_ADDR + '/hosAdmin/finance/index.html' + '#paymentOnlineGuahaoList.html';
        }
    });
    //getFentoNameSelect(form,'doctorHelpmate');
    //getFentoNameSelect(form,'doctor');
    getSourseList();
    form.render();
    /*form.on('select(fenTo)', function(data){  //根据分类获取类型
        getFentoNameSelect(form,data.elem[data.elem.selectedIndex].title);
    });*/
    searchBtn(localStorage.getItem('allDoctorOrder') || 1);
    localStorage.removeItem('allDoctorOrder');
    $('.paymentList').addClass('layui-this').parent().parent().addClass('layui-nav-itemed');
	//加载页面数据
    $('.thatTimeChoose').click(function(){
        $('.thatTimeChoose').css('background-color','white').css('color','#222')
        $(this).css('background-color','#009688').css('color','white');
    });
    $(".search_btn").click(function(){
        searchBtn(1);
	})

})
function searchBtn(pageNumber,type) {
    var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
    var url = SERVER_ADDR + "/hospital/finance/getPlatformPayCount.json";
    var data = {};
   /* data.keyword = $(".newsName").val();*/
    data.beginDate = $("#newsTime").val();
    data.endDate = $("#newsTimeEnd").val();
    /*data.source = $('.fromYuyue').val();*/
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
            if(retInfo.data.list){
                newsList(retInfo.data.list,retInfo.totalCount,pageNumber);
            }else {
                newsList([],retInfo.totalCount,pageNumber);
            }
            $('.totalPrice').text(0).text(retInfo.data.totalAmount);
            $('.totalCount').text(0).text(retInfo.data.payCount);
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
            if(data[i].status == 'wait'){
                data[i].status = '候诊';
            }else if(data[i].status == 'loading'){
                data[i].status = '治疗中';
            }else if(data[i].status == 'leave'){
                data[i].status = '弃诊';
            }else if(data[i].status == 'complete'){
                data[i].status = '完成';
            }
           /* var number;
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
              /*  +'<td>'+data[i].reservationDate+'</td>'*/
                +'<td style="color: #2299ee;cursor: pointer" valuetotlePrice="'+data[i].amount+'"  valuedate="'+data[i].paymentDateStr+'" onclick="visitUserInfo(this)">'+data[i].paymentDateStr+'</td>'
                +'<td>'+data[i].quantity+'</td>';
       /*     if(data[i].type == "coupon"){
                dataHtml += '<td>体验券</td>'
            }else if(data[i].type == "product"){
                dataHtml += '<td>特价项目</td>'
            }else if(data[i].type == "doctor"){
                dataHtml += '<td>医生</td>'
            }else{
                dataHtml += '<td>线下开单</td>'
            }*/
            dataHtml += '<td>'+noData(data[i].amount)+'<a style="position: absolute; right: 19px;top: 3px;" class="layui-btn layui-btn-normal layui-btn-mini news_reset_recordhis" onclick="readPayMtethods(this)" valuedate="'+data[i].paymentDateStr+'" valueid="'+data[i].id+'" valuetype="doctor">查看明细</a></td>'
               /* +'<td>'+noData(data[i].source)+'</td>'
                +'<td>'+noData(data[i].doctor)+'</td>'
                +'<td>'+noData(data[i].doctorHelpmate)+'</td>'
                +'<td>'+noData(data[i].huli)+'</td>'
                +'<td>'+noData(data[i].guestService)+'</td>'*/
               /* +'<td>'+number+'</td>'*/
             /*   +'<td>'+data[i].paidAmount +'/'+ data[i].totalAmount+'</td>'
                +'<td>'+(data[i].totalAmount - data[i].paidAmount) +'</td>'*/
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
    return dataHtml;
}
//单日分开支付金额
function readPayMtethods(obj){
    var date = $(obj).attr('valuedate');
    console.log(4555)
    var index = layui.layer.open({
        title : date + "平台支付治疗费支付明细",
        type : 2,
        area:['450px','250px'],
        content : "paymentPayMethodsList.html?date=" + date + '&payUrl=/hospital/finance/getPlatformPayDetails.json' + '&v=1134',
        success : function(layero, index){
            //localStorage.setItem('visit',$('.layui-laypage-curr em').eq(1).text());

        }
    })
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

//添加项目
function visitUserInfo(obj){
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var elThis = $(obj).attr('valuedate');
    var date = $(obj).text();
    var totlePrice = $(obj).attr('valuetotlePrice')
    console.log(4555)
    var index = layui.layer.open({
        title : "日期：" + date + '&nbsp;&nbsp;&nbsp;&nbsp;总额：' + totlePrice  + '元',
        type : 2,
        area:['90%','80%'],
        content : "paymentDayList.html?date=" + elThis + '&payUrl=/hospital/finance/getOneDayPlatformPaymentRecord.json&v=1134',
        success : function(layero, index){
            //localStorage.setItem('visit',$('.layui-laypage-curr em').eq(1).text());

        }
    })
}