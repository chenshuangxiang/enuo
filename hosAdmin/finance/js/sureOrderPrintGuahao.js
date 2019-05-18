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

    form.render();
    //品名信息
    function getModelNoInfo() {
        var url = SERVER_ADDR + "/hospital/finance/registrationFeeDetail.json";
        var Data = {};
        Data.registrationFeeForVisitRecordId = getQueryString('id');
        ajaxGetRetInfo(url,Data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                $('.userName').text(retInfo.data.user.userName);
                $('.mobile').text(retInfo.data.user.mobile);
                $('.number').text(retInfo.data.user.number);
                $('.diseases').text(retInfo.data.user.diseases);
                $('.projectName').text(noData(retInfo.data.user.projectName));
                $('.doctor').text(retInfo.data.creator);
                //$('.cashier').text(retInfo.data.cashier);
                $('.news_content').append(renderTableDate(retInfo.data.paymentItems,retInfo.data.user.number));
                $('.price_content').append(renderPriceDate(retInfo.data.receiptDetail || ''));

                $('.totalUserPrice').text(retInfo.data.receiptRecord.totalPrice);
                $('.factPrice').text(retInfo.data.receiptRecord.paidAmount);
                $('.shouldUserPrice').text(retInfo.data.receiptRecord.totalPrice - retInfo.data.receiptRecord.paidAmount);

            }
        },'请求失败', 'GET', undefined, undefined);
    }
});

function renderTableDate(data,number){
    var dataHtml = '';
    console.log(data)
        if(data.length != 0){
           // var totalUserPrice = 0;
            for(var i=0;i<data.length;i++){
                dataHtml += '<tr>'
                    +'<td>'+  number.split('-')[0] +'</td>'
                    +'<td>'+noData(data[i].subjectName)+'</td>'
                dataHtml += '<td>'+noData(data[i].fee)+'</td>'
                if(data[i].payMethod == 'selfPayment' || !data[i].payMethod){
                    dataHtml += '<td>自费</td>'
                }else if(data[i].payMethod == 'medicalInsurancePayment'){
                    dataHtml += '<td>医保</td>'
                }
                dataHtml +='<td class="totlePrice">'+data[i].totalFee+'</td>'
                    +'</tr>'
                //totalUserPrice = totalUserPrice + Number(Number(data[i].price) * Number(data[i].quantity));
            }
            //$('.totalUserPrice').text(totalUserPrice.toFixed(2));
        }else{
            dataHtml = '<tr><td colspan="9">暂无数据</td></tr>';
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
                dataHtml += '<td>' + data[i].medicalInsuranceNo + '</td>'
            } else {
                dataHtml += '<td></td>';
            }
            dataHtml += '<td>' + data[i].cashier + '</td></tr>'
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
