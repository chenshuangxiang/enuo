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
        var url = SERVER_ADDR + "/hospital/finance/getDetail.json";
        var Data = {};
        Data.userOfflineProjectId = getQueryString('id');
        ajaxGetRetInfo(url,Data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                $('.userName').text(retInfo.data.user.userName);
                $('.mobile').text(retInfo.data.user.mobile);
                $('.number').text(retInfo.data.user.number);
                $('.diseases').text(retInfo.data.user.diseases);
                $('.projectName').text(noData(retInfo.data.user.projectName));
               /* if(retInfo.data.user.payMethod == 'cash'){
                    $('.payMethod').text('现金支付');
                }else if(retInfo.data.user.payMethod == 'card'){
                    $('.payMethod').text('医院收款');
                }else if(retInfo.data.user.payMethod == 'medicalInsurance'){
                    $('.payMethod').text('医保支付');
                }else if(retInfo.data.user.payMethod == 'platform') {
                    $('.payMethod').text('平台支付');
                }*/
                /*if(retInfo.data.user.subsist != 0){
                    $('.shijiaoDiv,.shijiaoziDiv').show();
                    $('.yujiaoDiv .money').text(retInfo.data.user.subsist)
                    $('.yujiaoDiv').show();
                }
                if(retInfo.data.receiptRecord.cash){
                    $('.shijiaoDiv,.shijiaoziDiv').show();
                    $('.cashDiv .money').text(retInfo.data.receiptRecord.cash)
                    $('.cashDiv').show();
                }
                if(retInfo.data.receiptRecord.card){
                    $('.shijiaoDiv,.shijiaoziDiv').show();
                    $('.cardDiv .money').text(retInfo.data.receiptRecord.card)
                    $('.cardDiv').show();
                }
                if(retInfo.data.receiptRecord.medicalInsurance){
                    $('.shijiaoDiv,.shijiaoziDiv').show();
                    $('.medicalInsuranceDiv .money').text(retInfo.data.receiptRecord.medicalInsurance)
                    $('.medicalInsuranceDiv').show();
                }
                if(retInfo.data.receiptRecord.platform){
                    $('.shijiaoDiv,.shijiaoziDiv').show();
                    $('.platformDiv .money').text(retInfo.data.receiptRecord.platform)
                    $('.platformDiv').show();
                }*//*if(retInfo.data.user.subsist != 0){
                    $('.shijiaoDiv,.shijiaoziDiv').show();
                    $('.yujiaoDiv .money').text(retInfo.data.user.subsist)
                    $('.yujiaoDiv').show();
                }
                if(retInfo.data.receiptRecord.cash){
                    $('.shijiaoDiv,.shijiaoziDiv').show();
                    $('.cashDiv .money').text(retInfo.data.receiptRecord.cash)
                    $('.cashDiv').show();
                }
                if(retInfo.data.receiptRecord.card){
                    $('.shijiaoDiv,.shijiaoziDiv').show();
                    $('.cardDiv .money').text(retInfo.data.receiptRecord.card)
                    $('.cardDiv').show();
                }
                if(retInfo.data.receiptRecord.medicalInsurance){
                    $('.shijiaoDiv,.shijiaoziDiv').show();
                    $('.medicalInsuranceDiv .money').text(retInfo.data.receiptRecord.medicalInsurance)
                    $('.medicalInsuranceDiv').show();
                }
                if(retInfo.data.receiptRecord.platform){
                    $('.shijiaoDiv,.shijiaoziDiv').show();
                    $('.platformDiv .money').text(retInfo.data.receiptRecord.platform)
                    $('.platformDiv').show();
                }*/
                $('.doctor').text(retInfo.data.doctor);
                $('.doctorHelpmate').text(retInfo.data.doctorHelpmate);
                $('.cashier').text(retInfo.data.cashier);
                if(retInfo.data.reservation){
                    $('.layui-table-yuyue').show();
                    if(retInfo.data.reservation.type == "coupon"){
                        retInfo.data.reservation.type= '体验券'
                    }else if(retInfo.data.reservation.type == "product"){
                        retInfo.data.reservation.type= '特价项目'
                    }else if(retInfo.data.reservation.type == "doctor"){
                        retInfo.data.reservation.type= '医生'
                    }
                    $('.news_content_yuyue').append('<tr><td>'+retInfo.data.reservation.reservationDate+'</td><td>'+retInfo.data.reservation.type+'</td><td>'+retInfo.data.reservation.name+'</td></tr>');
                }
                $('.news_content').append(renderTableDate(retInfo.data.projectMaterial,retInfo.data.user.diseases));
                $('.price_content').append(renderPriceDate(retInfo.data.receiptDetail || ''));
                if(retInfo.data.RefundRecordJson && retInfo.data.RefundRecordJson.length > 0){
                    $('.tuiDiv').show();
                    $('.price_Tuicontent').append(renderTuiDate(retInfo.data.RefundRecordJson));
                }
                $('.totalUserPrice').text(retInfo.data.receiptRecord.totalPrice);
                $('.factPrice').text(retInfo.data.receiptRecord.paidAmount);
                $('.shouldUserPrice').text((retInfo.data.receiptRecord.totalPrice - retInfo.data.receiptRecord.paidAmount).toFixed(2));

            }
        },'请求失败', 'GET', undefined, undefined);
    }
});

function renderTableDate(data,diseases){
    var dataHtml = '';
    console.log(data)
        if(data.length != 0){
           // var totalUserPrice = 0;
            for(var i=0;i<data.length;i++){
                dataHtml += '<tr>'
                    +'<td>'+noData(diseases)+'</td>'
                    +'<td>'+noData(data[i].modelNo)+'</td>'
                if(data[i].type == 'cure' || !data[i].type){
                    dataHtml += '<td class="typeTd">医疗类</td>';
                }else if(data[i].type == 'materialScience'){
                    dataHtml += '<td class="typeTd">材料类</td>';
                }else if(data[i].type == 'drugs'){
                    dataHtml += '<td class="typeTd">药品类</td>';
                }else if(data[i].type == 'check'){
                    dataHtml += '<td class="typeTd">检查类</td>';
                }else if(data[i].type == 'health'){
                    dataHtml += '<td class="typeTd">保健类</td>';
                }
                dataHtml += '<td>'+noData(data[i].placeOfOrigin)+'</td>'
                    +'<td>'+noData(data[i].spec)+'</td>'

                    +'<td>'+noData(data[i].originalPrice)+'</td>'

                    +'<td>'+noData(data[i].price)+'</td>'
                    +'<td>'+noData(data[i].quantity)+'</td>'
                if(data[i].medicalInsurance == true){
                    dataHtml += '<td class="medicareTd">是</td>';
                }else if(data[i].medicalInsurance == false || !data[i].medicalInsurance){
                    dataHtml += '<td class="medicareTd">否</td>';
                }
                dataHtml +='<td class="totlePrice">'+(Number(data[i].price) * Number(data[i].quantity)).toFixed(2)+'</td>'
                    +'</tr>'
                //totalUserPrice = totalUserPrice + Number(Number(data[i].price) * Number(data[i].quantity));
            }
            //$('.totalUserPrice').text(totalUserPrice.toFixed(2));
        }else{
            dataHtml = '<tr><td colspan="9">暂无数据</td></tr>';
        }
        return dataHtml;
}
function renderTuiDate(data){
    var dataHtml = '';
    console.log(data)
    if(data.length != 0){
        // var totalUserPrice = 0;
        for (var i = data.length-1; i >= 0; i--) {
            dataHtml += '<tr>'
                + '<td>' + new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss") + '</td>'
            if (data[i].payMethod == 'CASH') {
                dataHtml += '<td>现金退款</td>'
            } else if (data[i].payMethod == 'BANK_CARD') {
                dataHtml += '<td>银行卡退款</td>'
            } else if (data[i].payMethod == 'WECHAT') {
                dataHtml += '<td>微信退款</td>'
            } else if (data[i].payMethod == 'ALIPAY') {
                dataHtml += '<td>支付宝退款</td>'
            }
            dataHtml += '<td>' + noData(data[i].amount) + '</td>'
            if (data[i].status == 'audit') {
                dataHtml += '<td>待审核</td>'
            } else if (data[i].status == 'success') {
                dataHtml += '<td>退款成功</td>'
            } else if (data[i].status == 'auditFail') {
                dataHtml += '<td>被驳回</td>'
            }
            if (data[i].remard) {
                dataHtml += '<td>' + data[i].remard + '</td>'
            } else {
                dataHtml += '<td></td>';
            }
            dataHtml += '</tr>'
            //totalUserPrice = totalUserPrice + Number(Number(data[i].price) * Number(data[i].quantity));
        }
        //$('.totalUserPrice').text(totalUserPrice.toFixed(2));
    }else{
        dataHtml = '<tr><td colspan="4">暂未退款</td></tr>';
    }
    return dataHtml;
}
function renderPriceDate(data){
    var dataHtml = '';
    console.log(data)
    if(data.length != 0){
        // var totalUserPrice = 0;
        for (var i = data.length-1; i >= 0; i--) {
            dataHtml += '<tr>'
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
            dataHtml += '<td>' + noData(data[i].paidAmount) + '</td>'
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
            dataHtml += '</tr>'
            //totalUserPrice = totalUserPrice + Number(Number(data[i].price) * Number(data[i].quantity));
        }
        //$('.totalUserPrice').text(totalUserPrice.toFixed(2));
    }else{
        dataHtml = '<tr><td colspan="6">暂未支付</td></tr>';
    }
    return dataHtml;
}
function printFunc() {
    doPrint();
}
