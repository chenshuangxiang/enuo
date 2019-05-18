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
    $('.typeSelect,.medicareSelect').change(function () {
        chooseType();
        $('.totalUserPrice').text(chooseType());
    });
    form.render();
    //品名信息
    function getModelNoInfo() {
        var url = SERVER_ADDR + "/hospital/finance/getReconciliationList.json";
        var Data = {};
        Data.userOfflineProjectId = getQueryString('id');
        ajaxGetRetInfo(url,Data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                $('.price_content').append(renderPriceDate(retInfo.data || ''));
            }
        },'请求失败', 'GET', undefined, undefined);
    }
});

function renderPriceDate(data){
    var dataHtml = '';
    console.log(data)
    if(data.length != 0){
        // var totalUserPrice = 0;
        for (var i = data.length-1; i >= 0; i--) {
            dataHtml += '<tr>'
             + '<td>'
            if(data[i].reconciliation == 'NO_RECONCILIATION'){
                dataHtml +='<input style="float: right" type="checkbox" name="allot" valueid="'+data[i].id+'" lay-skin="primary" lay-filter="Choose">'
            }

            dataHtml +='</td>'
                + '<td>' + new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss") + '</td>'
            if (data[i].payMethod == 'cash') {
                dataHtml += '<td>现金支付</td>'
            } else if (data[i].payMethod == 'card') {
                dataHtml += '<td>医院收款</td>'
            } else if (data[i].payMethod == 'medicalInsurance') {
                dataHtml += '<td>医保支付</td>'
            } else if (data[i].payMethod == 'platform') {
                dataHtml += '<td>平台支付</td>'
            }
            dataHtml += '<td>' + noData(data[i].amount) + '</td>'
            if (data[i].remark) {
                dataHtml += '<td>' + data[i].remark + '</td>'
            } else {
                dataHtml += '<td></td>';
            }
            if (data[i].payMethod == 'medicalInsurance') {
                dataHtml += '<td>' + data[i].medicalInsurance + '</td>'
            } else {
                dataHtml += '<td></td>';
            }
            if (data[i].creator) {
                dataHtml += '<td>' + data[i].creator + '</td>'
            } else {
                dataHtml += '<td></td>';
            }
            dataHtml +='<td>'+returnProjectReconciliationStatus(data[i].reconciliation) +'</td>'
            if(data[i].reconciliation == 'NO_RECONCILIATION'){
                dataHtml += '<td><a class="layui-btn layui-btn-normal layui-btn-mini" onclick="sureDuizhangOpen(this)" valueid="'+data[i].id+'" >对账</a></td>' ;
            }else{
                dataHtml += '<td></td>'
            }

            dataHtml += '</tr>'

            //totalUserPrice = totalUserPrice + Number(Number(data[i].price) * Number(data[i].quantity));
        }
        //$('.totalUserPrice').text(totalUserPrice.toFixed(2));
    }else{
        dataHtml = '<tr><td colspan="7">暂未支付</td></tr>';
    }
    return dataHtml;
}
function sureDuizhangOpen(obj) {
    var id = $(obj).attr('valueid');
    var index = layer.confirm('确认对账？', {
        btn: ['确认','取消'], //按钮
        icon:3
    }, function(){
        layer.close(index);
        sureDuizhang(id);
    }, function(){
    });
}
function sureDuizhang(ids,type) {
    var url = SERVER_ADDR + "/hospital/finance/settlement";
    var Data = {};
    if(type == 'all'){
        Data.ids = ids;
    }else{
        Data.hospitalReceiptRecordId = ids;
    }

    ajaxGetRetInfo(url,Data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
           layer.msg('对账成功');
           setTimeout(function () {
               window.location.reload();
           },1000);
        }else{
            layer.alert(retInfo.data,{icon:5})
        }
    },'请求失败', 'GET', undefined, undefined);
}

//批量对账
function allDuizhangopen() {
    var checkdAllot = $("input:checkbox[name='allot']:checked");
    if(checkdAllot.length == 0){
        layer.msg('请勾选需要对账的数据');
        return;
    }
    sureAllDuizhangOpen();
}
function sureAllDuizhangOpen(obj) {
    var allotList = [];
    var checkdAllot = $("input:checkbox[name='allot']:checked");
    checkdAllot.each(function() { // 遍历name=test的多选框
        // 每一个被选中项的值
        allotList.push($(this).attr('valueid'))
    });
    allotList = allotList.join(',');
    console.log(allotList)
    var index = layer.confirm('确认批量对账？', {
        btn: ['确认','取消'], //按钮
        icon:3
    }, function(){
        layer.close(index);
        sureDuizhang(allotList,'all');
    }, function(){
    });
}