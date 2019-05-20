var form;
var tableMateLocal = [];//JSON.parse(localStorage.getItem('localInfo')) || [];
    //tableMateLocal = tableMateLocal[0];
    console.log(tableMateLocal)
var tabledata = [];
var tablePostdata = [];
layui.use(['form','layer','jquery','layedit','table'],function(){
	 form = layui.form,
         table = layui.table,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		layedit = layui.layedit,
		$ = layui.jquery;

    getModelNoInfo();
    if(getQueryString('subsist') == 'undefined'){
        $('.subsistPrice').text(0);
    }else {
        $('.subsistPrice').text(getQueryString('subsist'));
    }

    form.render();
    //品名信息
    function getModelNoInfo() {
        var url = SERVER_ADDR + "/hospital/doctor/index/getOrderItem.json";
        var Data = {};
        Data.visitRecordId = getQueryString('id');
        ajaxGetRetInfo(url,Data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                $('.news_content').append(renderTableDate(retInfo.data));
            }
        },'请求失败', 'GET', undefined, undefined);
    }
});

function renderTableDate(data){
    var dataHtml = '';
    console.log(data)
        if(data.length != 0){
            var totalUserPrice = 0;
            for(var i=0;i<data.length;i++){
                dataHtml += '<tr>'
                    +'<td>'+noData(getQueryString('disease'))+'</td>'
                    +'<td>'+noData(data[i].placeOfOrigin)+'</td>'
                    +'<td>'+noData(data[i].modelNo)+'</td>'
                    +'<td>'+noData(data[i].spec)+'</td>'
                    +'<td>'+noData(data[i].quantity)+'</td>'
                    +'<td>'+noData(data[i].originalPrice)+'</td>'
                    +'<td>'+noData(data[i].price)+'</td>'
                    +'<td class="totlePrice">'+noData(data[i].singleTotalPrice)+'</td>'
                    +'<td><a onclick="chargeback(this)" style=" height: 26px; line-height: 26px; padding: 0 8px;" userOfflineProjectId="'+data[i].userOfflineProject+'" projectMaterialId="'+data[i].id+'" orderId="'+data[i].orderId+'" class="layui-btn layui-btn-danger layui-btn-xs">退单</a></td>'
                    +'</tr>';
                totalUserPrice = totalUserPrice + Number(data[i].singleTotalPrice);
            }
            $('.totalUserPrice').text(totalUserPrice);
        }else{
            dataHtml = '<tr><td colspan="9">暂无数据</td></tr>';
        }
        return dataHtml;
}
function chargeback(obj) {
    var userOfflineProjectId = $(obj).attr('userOfflineProjectId');
    var orderId = $(obj).attr('orderId');
    var projectMaterialId = $(obj).attr('projectMaterialId');
    var url = SERVER_ADDR + "/hospital/doctor/index/deleteProject";
    var Data = {};
    Data.userOfflineProjectId = userOfflineProjectId;
    Data.orderId = orderId;
    Data.projectMaterialId = projectMaterialId;
    ajaxGetRetInfo(url,Data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            layer.msg('退单成功');
            window.location.reload();
        }else{
            layer.msg(retInfo.data);
        }
    },'请求失败', 'GET', undefined, undefined);
}
