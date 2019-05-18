
var layer;
layui.use(['form','layer','jquery','element'],function(){
    var form = layui.form,
        element = layui.element;
    layer = parent.layer === undefined ? layui.layer : parent.layer,
        $ = layui.jquery;
    Get.orderInfo();
})

var Get = {

    orderInfo: function () {
        var url = SERVER_ADDR + "/hospital/user/orderInfo";
        var data = {};
        data.orderId = getQueryString('valueid');
        ajaxGetRetInfo(url, data, function (retInfo) {
            console.log(retInfo)
            if (retInfo.success) {
                $('.orderInfoData').html(Get.setOrderInfoReceiptDetailDate(retInfo.data.receiptDetail,retInfo.data.orderJson.createDate));
                $('.visitRecordInfoData').html(Get.setOrderInfoVisitRecordDate(retInfo.data,retInfo.data.user,retInfo.data.orderJson,retInfo.data.visitRecord,retInfo.data.receiptRecord));
                $('.moneyInfoData').html(Get.setOrderInfoProjectMaterial(retInfo.data.projectMaterial));
                $('.totalPrice').text(retInfo.data.receiptRecord.totalPrice);
                $('.alreadyPrice').text(retInfo.data.receiptRecord.paidAmount);
                $('.shouldPrice').text(Number(Number(retInfo.data.receiptRecord.totalPrice) - Number(retInfo.data.receiptRecord.paidAmount)).toFixed(2) );
                $('.orderStatus').text(returnProjectOrderStatus(retInfo.data.orderJson.orderStatus));
                $('.visitRecordStatus').text(returnProjectVisitRecordStatus(retInfo.data.visitRecord.status));
            } else {
                layer.alert(retInfo.data, {icon: 5});
            }
        }, '请求失败', 'POST', undefined, undefined);
    },
    setOrderInfoReceiptDetailDate: function (data,createDate) {
        console.log(data)
        var dataHtml = '';
        if (data && data.length != 0) {
            for (var i = 0; i < data.length; i++) {
                dataHtml += '<tr>'
                    + '<td>' + Number(i + 1) + '</td>'
                    + '<td>' +  createDate + '</td>'
                    + '<td>' + new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss")+ '</td>'
                    + '<td>' + noData(returnPayMethod(data[i].payMethod)) + '</td>'
                    + '<td>' + noData(data[i].paidAmount) + '</td>'
                    + '<td>' + noData(data[i].remark) + '</td>'
                    + '<td>线下开单</td>';
                dataHtml += '</tr>';
            }
        } else {
            dataHtml = '<tr><td colspan="17">暂无数据</td></tr>';
        }
        return dataHtml;
    },
    setOrderInfoVisitRecordDate: function (data,user,order,visitRecord,receiptRecord) {
        var dataHtml = '';
                dataHtml += '<tr>'
                    + '<td onclick="toUserInfo(this)" valueindex="1" valuemobile="'+user.mobile+'" style="color: #2299ee;cursor: pointer;">' + user.userName + '</td>'
                    + '<td>' +  user.diseases + '</td>'
                    + '<td  style="word-break: break-all;word-wrap: break-word">' +  returnVisitRecordNumber(user.number) + '</td>'
                    + '<td>' +  returnProjectVisitRecordStatus(visitRecord.status) + '</td>'
                    + '<td valueuserOfflineProject="'+visitRecord.userOffLineProjectId+'" onclick="allOrderDetail(this)" style="color: #2299ee;cursor: pointer;">查看清单</td>'
                    + '<td>' + receiptRecord.totalPrice + '</td>'
                    + '<td>' + noData(receiptRecord.remarks) + '</td>'
                    + '<td>' + visitRecord.source + '</td>'
                    + '<td>' + noData(data.reception) + '</td>'
                    + '<td>' + noData(data.doctorHelpmate) + '</td>'
                    + '<td>' + noData(data.doctor) + '</td>'
                    + '<td>' + noData(data.source) + '</td>'
                    + '<td>' + noData(data.guestService) + '</td>'
                dataHtml += '</tr>';
        return dataHtml;
    },
    setOrderInfoProjectMaterial: function (data) {
        console.log(data)
        var dataHtml = '';
        if (data && data.length != 0) {
            for (var i = 0; i < data.length; i++) {
                dataHtml += '<tr>'
                    + '<td>' + noData(data[i].modelNo)+ '</td>'
                    + '<td>' + noData(returnProjectMaterialType(data[i].type)) + '</td>'
                    + '<td>' + noData(data[i].placeOfOrigin) + '</td>'
                + '<td>' + noData(data[i].spec) + '</td>'
                + '<td>' + noData(data[i].originalPrice) + '</td>'
                + '<td>' + noData(data[i].price) + '</td>'
                + '<td>' + noData(data[i].quantity) + '</td>';
                if(data[i].medicalInsurance == false){
                    dataHtml += '<td>否</td>'
                }else   if(data[i].medicalInsurance == true){
                    dataHtml += '<td>是</td>';
                }
                dataHtml += '<td>' + (data[i].price * data[i].quantity).toFixed(2) + '</td>';
                dataHtml += '</tr>';
                /*  if(data[i].isReservation == true){
                      dataHtml += '<td>已预约(已支付)</td>';
                  }else if(data[i].isReservation == false){
                      dataHtml += '<td>未预约(已支付)</td>';
                  }else{
                      dataHtml += '<td>'+returnProjectOrderStatus(data[i].status)+'</td>';
                  }*/
            }
        } else {
            dataHtml = '<tr><td colspan="17">暂无数据</td></tr>';
        }
        return dataHtml;
    }
}
