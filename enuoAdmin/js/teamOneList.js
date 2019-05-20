var form;
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
        var url = getUrl() + "/groupShopping/getTeamDetails.json";
        var Data = {};
        Data.groupShoppingTeamId = getQueryString('id');
        ajaxGetRetInfo(url,Data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
               // $('.userName').text(retInfo.data.user.userName);
               // $('.mobile').text(retInfo.data.user.mobile);
               // $('.number').text(retInfo.data.user.number);
               // $('.diseases').text(retInfo.data.user.diseases);
               // $('.projectName').text(noData(retInfo.data.user.projectName));
               // $('.doctor').text(retInfo.data.doctor);
               // $('.doctorHelpmate').text(retInfo.data.doctorHelpmate);
               // $('.cashier').text(retInfo.data.cashier);
                if(retInfo.data.length > 0){
                    console.log(retInfo.data)
                    var status = retInfo.data[0].state;
                    if(getQueryString('isRobot') == 'true'){
                        retInfo.data.unshift({'mobile':'机器人','state':status});
                    }
                    $('.news_content').append(renderTableDate(retInfo.data))
                }else if(retInfo.data.length == 0){
                    if(getQueryString('isRobot') == 'true'){
                        retInfo.data.unshift({'mobile':'机器人','state':'wait'});
                    }
                    $('.news_content').append(renderTableDate(retInfo.data))
                }
                //a,retInfo.data.user.diseases));
                //$('.price_content').append(renderPriceDate(retInfo.data.receiptDetail || ''));
                //$('.totalUserPrice').text(retInfo.data.receiptRecord.totalPrice);
                //$('.factPrice').text(retInfo.data.receiptRecord.paidAmount);
                //$('.shouldUserPrice').text((retInfo.data.receiptRecord.totalPrice - retInfo.data.receiptRecord.paidAmount).toFixed(2));
            }
        },'请求失败', 'GET', undefined, undefined);
    }
});
function noData(name) { //undefind数据 返回name
    if(!name || name == '' || name == 'undefined'){
        name = '无';
    }
    return name
}
function renderTableDate(data,diseases){
    var dataHtml = '';
    console.log(data)
        if(data.length != 0){
           // var totalUserPrice = 0;
            for(var i=data.length-1;i>=0;i--){
                dataHtml += '<tr>'
                if(data[i].userId == data[i].captainId){
                    dataHtml += '<td style="color: #fb952c;">'+data[i].fullname+'（旗主）</td>' ;
                }else{
                    dataHtml += '<td>'+data[i].fullname+'（旗员）</td>' ;
                }
                dataHtml += '<td>'+noData(data[i].mobile)+'</td>';
                if(data[i].state == 'wait'){
                    dataHtml += '<td>可进入</td>' ;
                    $('.doctor').text('正在拼团中');
                }else if(data[i].state == 'full'){
                    dataHtml += '<td>已满员</td>' ;
                    $('.doctor').text('已拼成');
                }
                dataHtml +='</tr>'
                //totalUserPrice = totalUserPrice + Number(Number(data[i].price) * Number(data[i].quantity));
            }
            //$('.totalUserPrice').text(totalUserPrice.toFixed(2));
        }else{
            dataHtml = '<tr><td colspan="3">暂无数据</td></tr>';
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
                dataHtml += '<td>医院收款</td>'
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
            dataHtml += '</tr>'
            //totalUserPrice = totalUserPrice + Number(Number(data[i].price) * Number(data[i].quantity));
        }
        //$('.totalUserPrice').text(totalUserPrice.toFixed(2));
    }else{
        dataHtml = '<tr><td colspan="5">暂未支付</td></tr>';
    }
    return dataHtml;
}
/*function printFunc() {
    doPrint();
}*/
