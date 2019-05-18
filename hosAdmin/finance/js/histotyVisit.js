layui.use(['form','layer','jquery','element'],function() {
    var form = layui.form,
        element = layui.element;
    layer = parent.layer === undefined ? layui.layer : parent.layer,
        $ = layui.jquery;
    /*element.on('collapse(fadeIn)', function(data){
        layer.msg('展开状态:'+ data.show);
    });*/
    //加载页面数据
    Get.firstConcult();

});
var Get = {
    firstConcult: function () {
            var url = SERVER_ADDR + '/hospital/finance/getUserVisitRecord.json';
            var Data = {};
            Data.mobile = getQueryString('mobile');
            ajaxGetRetInfo(url, Data, this.firstConcultSuccess, '请求失败', 'GET', true, undefined);
    },
    firstConcultSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            //返回填充
            $('.span').text(retInfo.data.userInfo.fullname);
            if(retInfo.data.userInfo.sex == 'man'){
                retInfo.data.userInfo.sex = '男';
            }else if(retInfo.data.userInfo.sex == 'woman'){
                retInfo.data.userInfo.sex = '女';
            }else if(retInfo.data.userInfo.sex == 'unknown'){
                retInfo.data.userInfo.sex = '不详';
            }
            if(!retInfo.data.userInfo.birthday){
                var birthday = '无'
            }else{
                var birthday = new Date(retInfo.data.userInfo.birthday).Format("yyyy-MM-dd")
            }
            $('.layui-colla-content p').html('<strong>姓名:</strong>'+retInfo.data.userInfo.fullname + '' + ' &nbsp;&nbsp;&nbsp;&nbsp;<strong>手机号:</strong>' + getQueryString('mobile') + ' &nbsp;&nbsp;&nbsp;&nbsp;<strong>出生日期:</strong>' +  birthday + ' &nbsp;&nbsp;&nbsp;&nbsp;<strong>性别:</strong>' + retInfo.data.userInfo.sex + '  &nbsp;&nbsp;&nbsp;&nbsp;<strong>身份证号:</strong>' + noData(retInfo.data.userInfo.idCard) + '<br>');
            if(retInfo.data.userInfo.members){
                retInfo.data.userInfo.members.forEach(function (value) {
                    console.log(value)
                    $('.layui-colla-content p').append('<strong>'+value.appellation+'</strong>' + '：' +  value.fullName + '--'  +  value.mobile + ' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
                })
            }
            if(retInfo.data.orderList){
                histotyVisitList(retInfo.data.orderList);
            }
        } else {
            alert(retInfo.data);
        }
    },
    editRemark: function (obj) {
        $(obj).before('<input class="remarkInput" type="text" value="'+$(obj).attr('valuezhi')+'">');
        $(obj).parent().children('.remark').text('');
        $(obj).attr('onclick','Get.addRemark(this)').text('确定');
    },
    addRemark: function (obj) {
        var url = SERVER_ADDR + '/hospital/finance/addRemark';
        var Data = {};
        Data.orderId = $(obj).attr('orderid');
        Data.remark = $(obj).prev().val();
        ajaxGetRetInfo(url, Data, this.addRemarkSuccess, '请求失败', 'POST', true, undefined);
    },
    addRemarkSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            window.location.reload();
        } else {
            alert(retInfo.data);
        }
    }


}
function histotyVisitList(retInfo){
    $(".news_content").html(renderHistotyVisitDate(retInfo));
}
function renderHistotyVisitDate(data){
    console.log(data)
    var dataHtml = '';

    if(data && data.length != 0){
        for(var i=0;i<data.length;i++){
            switch (data[i].orderStatus){
                case 'waitPaid':
                    data[i].orderStatus = '待支付';
                    break;
                case 'waitConfirm':
                        data[i].orderStatus = '已支付';
                        break;
                case 'completed':
                    data[i].orderStatus = '待结算';
                    break;
                case 'cancelled':
                    data[i].orderStatus = '已取消';
                    break;
                case 'handle':
                    data[i].orderStatus = '已结算';
                    break;
                case 'REFUND':
                    data[i].orderStatus = '退款';
                    break;
                case 'USED':
                    data[i].orderStatus = '已使用';
                    break;
                case undefined:
                    data[i].orderStatus = '';
                    break;
            }
          /*  if(data[i].status == 'wait'){
                data[i].status = '候诊';
            }else if(data[i].status == 'loading'){
                data[i].status = '治疗中';
            }else if(data[i].status == 'leave'){
                data[i].status = '弃诊';
            }else if(data[i].status == 'complete'){
                data[i].status = '完成';
            }*/
            if(!data[i].remark){
                data[i].remark = '';
            }
            dataHtml += '<tr>'
                +'<td>'+ new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss") +'</td>'
            if(data[i].type == "coupon"){
                dataHtml += '<td>体验券</td>'
            }else if(data[i].type == "product"){
                dataHtml += '<td>特价项目</td>'
            }else if(data[i].type == "doctor"){
                dataHtml += '<td>医生</td>'
            }else{
                dataHtml += '<td>线下开单</td>'
            }
            dataHtml+='<td>'+noData(data[i].name)+'</td>'
                +'<td>'+noData(data[i].source)+'</td>'
                +'<td>'+noData(data[i].doctorHelpmate)+'</td>'
                +'<td>'+noData(data[i].doctor)+'</td>'
                +'<td>'+noData(data[i].nurse)+'</td>'
                +'<td>'+data[i].paidAmount +'/'+ data[i].amount+'</td>'
                +'<td>'+noData(data[i].lastAmount)+'</td>';
            if(data[i].id){
                dataHtml += '<td style="color: #2299ee;cursor: pointer" valueid="'+data[i].id+'" onclick="readOrderOpen(this)">查看</td>'
            }else {
                dataHtml += '<td>暂未开单</td>';
            }
            dataHtml +='<td>'+noData(data[i].orderStatus)+'</td>'
                +'<td title="'+data[i].remark+'">' ;
            if(data[i].remark.length > 6){
                dataHtml+='<span class="remark" valuezhi="'+data[i].remark+'">'+(data[i].remark).substr(0,6)+'...'+'</span>' ;
            }else{
                dataHtml+='<span class="remark">'+data[i].remark+'</span>' ;
            }
            dataHtml+='<a style="margin-left: 3px;float: right" class="layui-btn layui-btn-normal layui-btn-mini" valuezhi="'+data[i].remark+'" orderid="'+data[i].orderId +'" onclick="Get.editRemark(this)">编辑</a></td>';
            dataHtml += '</tr>';
        }
    }else{
        dataHtml = '<tr><td colspan="12">暂无数据</td></tr>';
    }
    return dataHtml;
}
function addRemark() {

}

