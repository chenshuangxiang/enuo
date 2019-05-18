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
    getSourseList();
    form.render();
    /*form.on('select(fenTo)', function(data){  //根据分类获取类型
        getFentoNameSelect(form,data.elem[data.elem.selectedIndex].title);
    });*/
    searchBtn(localStorage.getItem('allDoctorOrder') || 1);
    localStorage.removeItem('allDoctorOrder');
    $('.doctornurseList').addClass('layui-this').parent().parent().addClass('layui-nav-itemed');
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
    var url = SERVER_ADDR + "/hospital/finance/getDoctorStatistics.json";
    var data = {};
    data.keyword = $(".newsName").val();
  /*  data.beginDate = $("#newsTime").val();
    data.endDate = $("#newsTimeEnd").val();
    data.source = $('.fromYuyue').val();*/
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
            if(retInfo.data){
                newsList(retInfo.data,retInfo.totalCount,pageNumber);
            }else {
                newsList([],retInfo.totalCount,pageNumber);
            }
            $('.totalPrice').text(retInfo.data.totalAmount);
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
            if(data[i].enabled == false && data[i].todayTurnovers == 0 && data[i].monthTurnovers == 0){

            }else{
                dataHtml += '<tr>'
                    +'<td>'+Number(i+1)+'</td>'
                    +'<td style="color: #2299ee;cursor: pointer" valuemobile="'+data[i].mobile+'" onclick="visitUserInfo(this)">'+data[i].name+'</td>'
                    +'<td>'+data[i].doctorPosition+'</td>';
                dataHtml += '<td>'+noData(data[i].hospitalName)+'</td>'
                    +'<td>'+noData(data[i].doctorSubjectName)+'</td>'
                    +'<td>'+noData(data[i].todayTurnovers)+'</td>'
                    +'<td>'+data[i].monthTurnovers+'</td>'
                dataHtml += '</tr>';
            }
        }
    }else{
        dataHtml = '<tr><td colspan="13">暂无数据</td></tr>';
    }
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

//添加项目
function visitUserInfo(obj){
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var elThis = $(obj).attr('valuemobile');
    var name = $(obj).text();
    console.log(4555)
    var index = layui.layer.open({
        title : name+"医生的患者",
        type : 2,
        area:['90%','80%'],
        content : "doctorPatientList.html?mobile=" + elThis,
        success : function(layero, index){
            //localStorage.setItem('visit',$('.layui-laypage-curr em').eq(1).text());

        }
    })
}