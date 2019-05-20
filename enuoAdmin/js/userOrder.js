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
    $('#newsTimeEnd').val(new Date().Format('yyyy-MM-dd'));
    var firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    $('#newsTime').val(firstDay.Format('yyyy-MM-dd'));
    //getFentoNameSelect(form,'doctorHelpmate');
    //getFentoNameSelect(form,'doctor');

    form.render();
    /*form.on('select(fenTo)', function(data){  //根据分类获取类型
        getFentoNameSelect(form,data.elem[data.elem.selectedIndex].title);
    });*/
    searchBtn(localStorage.getItem('allDoctorOrder') || 1);
    localStorage.removeItem('allDoctorOrder');
    $('.allDoctorOrder').addClass('layui-this').parent().parent().addClass('layui-nav-itemed');
	//加载页面数据
	$(".search_btn").click(function(){
        searchBtn(1);
	})

})
function searchBtn(pageNumber) {
    //var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
    var url = getUrl() + "/admin/order/getList.json";
    var data = {};
    data.keyword =getQueryString('id');
    data.pageNumber = pageNumber;
    data.pageSize = 10;
    ajaxGetRetInfo(url,data,function (retInfo) {
        console.log(retInfo)
        //layer.close(index);
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
    var nums = 10; //每页出现的数据量
    laypage.render({
        elem : "page",
        skip:true,
        layout: ['count', 'prev', 'page', 'next', 'skip'],
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
            if(data[i].orderStatus == 'waitPaid'){
                data[i].orderStatus = '待支付';
            }else if(data[i].orderStatus == 'completed' || data[i].orderStatus == 'handle'){
                data[i].orderStatus = '已完成';
            }else if(data[i].orderStatus == 'waitConfirm'){
                if(data[i].isReservation == true){
                    data[i].orderStatus = '已预约';
                }else if(data[i].isReservation == false){
                    data[i].orderStatus = '未预约';
                }else{
                    data[i].orderStatus = '待确认';
                }
            }else if(data[i].orderStatus == 'cancelled'){
                data[i].orderStatus = '取消购买';
            }else if(data[i].orderStatus == 'complete'){
                data[i].orderStatus = '完成';
            }
            dataHtml += '<tr>'
                /* +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                /*  +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                /*  +'<td><input type="checkbox" valueid="'+data[i].id+'" name="checked" lay-skin="primary" lay-filter="choose"><div class="layui-unselect layui-form-checkbox" lay-skin="primary"><i class="layui-icon"></i></div></td>'*/
                +'<td>'+data[i].sn+'</td>'
              /*  +'<td>'+Number(i+1)+'</td>'*/
              /*  +'<td>'+data[i].reservationDate+'</td>'*/
              /*  +'<td style="color: #2299ee;cursor: pointer" valuemobile="'+data[i].mobile+'" valueid="'+data[i].hospitalUserId+'" onclick="visitUserInfo(this)">'+data[i].fullName+'</td>'
                +'<td>'+data[i].mobile+'</td>';*/
            if(data[i].type == "coupon"){
                dataHtml += '<td>体验券</td>'
            }else if(data[i].type == "product"){
                dataHtml += '<td>平台项目</td>'
            }else if(data[i].type == "doctor"){
                dataHtml += '<td>医生</td>'
            }else if(data[i].type == "censor"){
                dataHtml += '<td>检查项目</td>'
            }else{
                dataHtml += '<td>线下项目</td>'
            }
            dataHtml += '<td>'+noData(data[i].hospitalName)+'</td>'
                if(data[i].type == 'offline'){
                    dataHtml += '<td data_id="'+data[i].visitRecord+'" style="color: #00AFA1;cursor: pointer;" onclick="orderOpen(this)">'+noData(data[i].name)+'</td>'
                }else{
                    dataHtml += '<td>'+noData(data[i].name)+'</td>'
                }
            dataHtml += '<td>'+noData(data[i].paidAmount)+'/'+noData(data[i].amount)+'</td>'
                +'<td>'+noData(data[i].createDate)+'</td>'
                +'<td>'+noData(data[i].orderStatus)+'</td>'
                +'</tr>';
        }
    }else{
        dataHtml = '<tr><td colspan="7">暂无数据</td></tr>';
    }
    return dataHtml;
}
//约定医疗订单详情
function orderOpen(m){
    var id = $(m).attr('data_id');
        var index = layer.open({
            title : "约定医疗项目清单",
            type : 2,
            area: ['85%','85%'],
            content : 'sureOrderPrint.html?id=' + id + '&v=777',
            success : function(layero, index){

            },
            cancel: function(index, layero){
                layer.close(index)
                return false;
            }
        })

    /*$(".shade,.orderOpen").show();
    var dataid = $(m).attr("data_id");*/

}
function allOrderDetail(obj) {
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var id = $(obj).attr('valueid');
    var disease = $(obj).attr('valuedisease');
    var subsist = $(obj).attr('valuesubsist');
    var valueuserOfflineProject = $(obj).attr('valueuserOfflineProject');
    var index = layui.layer.open({
        title : "项目清单",
        type : 2,
        area: ['850px','450px'],
        content : 'orderDetail.html?id=' + id + '&disease=' + disease  + '&subsist=' + subsist + '&valueuserOfflineProject='+valueuserOfflineProject,
        success : function(layero, index){

        },
        cancel: function(index, layero){
            layer.close(index)
            return false;
        }
    })
}
function addVisitProject(obj) {
    var elThis = $(obj).attr('valueuserOfflineProject');
    console.log(4555)
    var index = layui.layer.open({
        title : "治疗",
        type : 2,
        area:['950px','92%'],
        content : "addAgainTemplateProject.html?valueid=" + elThis + '&v=1112',
        success : function(layero, index){
            localStorage.setItem('allDoctorOrder',$('.layui-laypage-curr em').eq(1).text());

        }
    })
}
function getPhotos(obj) {
    var id = $(obj).attr('valueid');

    var index = layui.layer.open({
        title : "查看图片",
        type : 2,
        area: ['95%','95%'],
        content : "getPhotos.html?valueid=" + id,
        success : function(layero, index){
            localStorage.setItem('allDoctorOrder',$('.layui-laypage-curr em').eq(1).text());
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
  /*  var elThis = $(obj).attr('valuemobile');
    console.log(4555)
    var index = layui.layer.open({
        title : "个人/就诊信息",
        type : 2,
        area:['800px','75%'],
        content : "historyVisit.html?mobile=" + elThis,
        success : function(layero, index){
            //localStorage.setItem('visit',$('.layui-laypage-curr em').eq(1).text());

        }
    })*/
    var mobile = $(obj).attr('valuemobile');
    var id = $(obj).attr('valueid');
    if(id == 'undefined'){
        layer.alert('此用户还不是本院客户，请先添加！',{icon:7});
        return;
    }
    var index = layui.layer.open({
        title : "回访",
        type : 2,
        area:['85%','85%'],
        content : "historyRecord.html?id=" + id + '&mobile=' + mobile,
        success : function(layero, index){
            /*setTimeout(function () {
                layui.layer.tips('点击此处返回咨询列表', '.layui-layer-setwin .layui-layer-close', {
                    tips: 3
                });
            },500)*/

        }
    })
}