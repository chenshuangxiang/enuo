var form
layui.use(['form','layer','jquery','laypage','laydate','element'],function(){
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
    toAllFirstTopTab('.jiesuanLi','.toProjectBtn');
    //getFentoNameSelect(form,'doctorHelpmate');
    //getFentoNameSelect(form,'doctor');
    getSourseList();
    form.render();
    /*form.on('select(fenTo)', function(data){  //根据分类获取类型
        getFentoNameSelect(form,data.elem[data.elem.selectedIndex].title);
    });*/
    searchBtn(localStorage.getItem('allDoctorOrder') || 1);
    localStorage.removeItem('allDoctorOrder');
    searchTotalAmount();
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
    var url = SERVER_ADDR + "/hospital/finance/getSettlement.json";
    var data = {};
    data.keyword = $(".newsName").val();
    data.beginDate = $("#newsTime").val();
    data.endDate = $("#newsTimeEnd").val();
    data.source = $('.fromYuyue').val();
    data.status = $('.status').val();
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
            $('.totalPrice').text(retInfo.data.totalAmount);
        }else{
            layer.alert(retInfo.data,{icon:5});
        }
    },'请求失败', 'GET', undefined, undefined);
}
function searchTotalAmount(pageNumber,type) {
    var url = SERVER_ADDR + "/hospital/finance/getAmount.json";
    var data = '';
 /*   data.keyword = $(".newsName").val();
    data.beginDate = $("#newsTime").val();
    data.endDate = $("#newsTimeEnd").val();
    data.source = $('.fromYuyue').val();
    data.status = $('.status').val();
    data.pageNumber = pageNumber;
    data.pageSize = 15;*/
    ajaxGetRetInfo(url,data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            $('.allAmount').text(retInfo.data.allAmount);
            $('.noNeedAmount').text(retInfo.data.noNeedAmount);
            $('.needAmount').text(retInfo.data.needAmount);
        }else{
            layer.alert(retInfo.data,{icon:5});
        }
    },'请求失败', 'GET', undefined, undefined);
}
function newsList(retInfo,totalCount,current){
    //渲染数据
    $(".news_content").html(renderDate(retInfo));
    //form.render('checkbox','choose')
    form.render();
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
            dataHtml +='<td>'
            if(data[i].reconciliation == 'HAS_RECONCILIATION' || data[i].reconciliation == 'SETTLEMENTING') {
                if(data[i].settlementIs == true) {
                    dataHtml +='<input type="checkbox" name="allot" valueid="'+data[i].orderId+'" lay-skin="primary" lay-filter="allChoose">'
                }
            }
            dataHtml +='</td>'
                +'<td>'+Number(i+1)+'</td>'
              /*  +'<td>'+data[i].reservationDate+'</td>'*/
                +'<td style="color: #2299ee;cursor: pointer" valuemobile="'+data[i].mobile+'" onclick="visitUserJiuzhenInfo(this)">'+data[i].userName+'</td>'
                +'<td>'+data[i].mobile+'</td>';
            if(data[i].type == "coupon"){
                dataHtml += '<td>体验券</td>'
            }else if(data[i].type == "product"){
                dataHtml += '<td>特价项目</td>'
            }else if(data[i].type == "doctor"){
                dataHtml += '<td>医生</td>'
            }else{
                dataHtml += '<td>线下开单</td>'
            }
            dataHtml += '<td>'+noData(data[i].projectName)+'</td>'
                +'<td style="color: #2299ee;cursor: pointer" valueid="'+data[i].userOffLineProjectId+'" onclick="readOrderOpen(this)">'+noData(data[i].diseases)+'</td>'
            if (data[i].source) {
                dataHtml += '<td>' + noData(data[i].source) + '</td>';
            } else {
                dataHtml  +='<td>e诺平台</td>';
            }

               /* +'<td>'+noData(data[i].source)+'</td>'
                +'<td>'+noData(data[i].doctor)+'</td>'
                +'<td>'+noData(data[i].doctorHelpmate)+'</td>'
                +'<td>'+noData(data[i].huli)+'</td>'
                +'<td>'+noData(data[i].guestService)+'</td>'*/
            dataHtml  +='<td>'+returnVisitRecordNumber(data[i].number)+'</td>'
                +'<td>'+new Date(data[i].createDate).Format('yyyy-MM-dd hh:mm:ss')+'</td>'
                +'<td>'+returnProjectVisitRecordStatus(data[i].status)+'</td>'
                +'<td>'+data[i].paidAmount +'/'+ data[i].totalAmount+'</td>'
            if(data[i].settlementIs == false){
                dataHtml +='<td>不需要结算</td>'
            }else{
                dataHtml +='<td>'+returnProjectReconciliationStatus(data[i].reconciliation) +'</td>'
            }
            if(data[i].reconciliation == 'HAS_RECONCILIATION' || data[i].reconciliation == 'SETTLEMENTING'){
                if(data[i].settlementIs == true){
                    dataHtml += '<td><a class="layui-btn layui-btn-normal layui-btn-mini" onclick="jiesuanonesureOpen(this)" valueid="'+data[i].orderId+'" >结算</a></td>' ;
                }else{
                    dataHtml += '<td></td>' ;
                }

            }else{
                dataHtml += '<td></td>'
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
        dataHtml = '<tr><td colspan="14">暂无数据</td></tr>';
    }
    return dataHtml;
}
function jiesuansureOpen(allotList,type,jiesuanNum) {
    var id = allotList;
    var type = type;
    var jiesuanNum = jiesuanNum;
    var index = layer.confirm('确认结算？', {
        btn: ['确认','取消'], //按钮
        icon:3
    }, function(){
        layer.close(index);
        jiesuansure(id, type, jiesuanNum);
    }, function(){
    });
}
function jiesuansure(ids,type,percent) {
    var url = SERVER_ADDR + "/hospital/finance/settlement";
    var Data = {};
    if(type == 'all'){
        Data.ids = ids;
    }else{
        Data.orderId = ids;
    }
    Data.settlementRatio = percent / 100;
    ajaxGetRetInfo(url,Data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            layer.msg('结算成功');
           /* setTimeout(function () {
                window.location.reload();
            },1000);*/
        }else{
            layer.alert(retInfo.data,{icon:5})
        }
    },'请求失败', 'GET', undefined, undefined);
}
function openJisuanPecentOpen() {  //批量结算
    var checkdAllot = $("input:checkbox[name='allot']:checked");
    if(checkdAllot.length == 0){
        layer.msg('请勾选需要结算的数据');
        return;
    }
    var allotList = [];
    checkdAllot.each(function() { // 遍历name=test的多选框
        // 每一个被选中项的值
        allotList.push($(this).attr('valueid'))
    });
    allotList = allotList.join(',');
    console.log(allotList)
    openJisuanPecentSureOpen(allotList,'all')
}
function jiesuanonesureOpen(obj) {  //单个结算
    var allotList = $(obj).attr('valueid');
    openJisuanPecentSureOpen(allotList,'')
}
function openJisuanPecentSureOpen(allotList,type) {
    var allotList = allotList;
    var type = type;
    indexOpen = layer.open({
        type: 1 //Page层类型
        //,area: ['500px', '300px']
        ,btn:["确认"]
        ,title: '请输入结算百分比'
        ,skin: 'layui-layer-prompt'
        ,btnAlign: 'c' //按钮居中
        ,content: "<div class=''><span>结算百分比：</span><input type='number' style='display: inline-block;width: 45%;' class='layui-layer-input' value='15' placeholder='请输入结算百分比'>%</div>"
        ,yes: function(index, layero){
            var jiesuanNum = $(layero).find("input[type='number']").val();
            jiesuansureOpen(allotList,type,jiesuanNum);//结算百分比
        }
    });
}
