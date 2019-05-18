var form;
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
    form.on('radio(yibao)', function(data){
        console.log(data.elem); //得到radio原始DOM对象
        console.log(data.value); //被点击的radio的value值
        if(data.value == 'medicalInsurance'){
            $('.yibaoDiv').show();
        } else {
            $('.yibaoDiv').hide();
        }
    });
    //品名信息
    function getModelNoInfo() {
        var url = SERVER_ADDR + "/hospital/finance/getDetail.json";
        var Data = {};
        Data.userOfflineProjectId = getQueryString('id');
        ajaxGetRetInfo(url,Data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
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
                if(retInfo.data.receiptRecord.paidAmount > 0){
                   $('.tuiBtn').show();
                }
                $('.news_content').append(renderTableDate(retInfo.data.projectMaterial,retInfo.data.user.diseases));
                $('.totalUserPrice').text(retInfo.data.receiptRecord.totalPrice);
                $('.factPrice').text(retInfo.data.receiptRecord.paidAmount);
                $('.shouldUserPrice').text((retInfo.data.receiptRecord.totalPrice - retInfo.data.receiptRecord.paidAmount).toFixed(2));
                if(retInfo.data.receiptDetail){
                    if(retInfo.data.receiptDetail.length != 0){
                        retInfo.data.receiptDetail.forEach(function (value) {
                            console.log(value)
                            if(value.payMethod == 'cash'){
                                $('.layer_notice').append('<p>'+new Date(value.createDate).Format('yyyy-MM-dd hh:mm:ss')+'<span> 现金支付：￥</span>'+value.paidAmount+'元</p>');
                            } else if(value.payMethod == 'card'){
                                $('.layer_notice').append('<p>'+new Date(value.createDate).Format('yyyy-MM-dd hh:mm:ss')+'<span> 医院收款：￥</span>'+value.paidAmount+'元</p>');
                            } else if(value.payMethod == 'medicalInsurance'){
                                $('.layer_notice').append('<p>'+new Date(value.createDate).Format('yyyy-MM-dd hh:mm:ss')+'<span> 医保支付：￥</span>'+value.paidAmount+'元</p>');
                            } else if(value.payMethod == 'platform'){
                                $('.layer_notice').append('<p>'+new Date(value.createDate).Format('yyyy-MM-dd hh:mm:ss')+'<span> 平台支付：￥</span>'+value.paidAmount+'元</p>');
                            }
                        });
                    }
                }

                if($('.factPrice').text() == 0){
                    $('.onlyPrint').hide();
                }
            }
        },'请求失败', 'GET', undefined, undefined);
    }
});
function factPrice() {
    layui.layer.tips($('.layer_notice').html(), '#factPrice',{
        tips: [1, '#3595CC'],
        closeBtn :1,
        time:6000
    });
}
function renderTableDate(data,diseases){
    var dataHtml = '';
    console.log(data)
        if(data.length != 0){
            //var totalUserPrice = 0;
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
                    +'<td>'+noData(data[i].quantity)+'</td>';
                if(data[i].medicalInsurance == true){
                    dataHtml += '<td class="medicareTd">是</td>';
                }else if(data[i].medicalInsurance == false  || !data[i].medicalInsurance){
                    dataHtml += '<td class="medicareTd">否</td>';
                }
                dataHtml +='<td class="totlePrice">'+(Number(data[i].price) * Number(data[i].quantity)).toFixed(2)+'</td>'
                    +'</tr>'
                //totalUserPrice = totalUserPrice + Number(Number(data[i].price) * Number(data[i].quantity));
            }
            //$('.totalUserPrice').text(totalUserPrice.toFixed(2));
        }else{
            dataHtml = '<tr><td colspan="10">暂无数据</td></tr>';
        }
        return dataHtml;
}
function sureTuiChoose() {
    if($('input[type="radio"][name="sexTui"]:checked').val() == undefined){
        layer.msg('请选择退款方式');
        return;
    }
    if($('.tuiNo').val() == ''){
        layer.msg('请输入退款金额');
        return;
    }
    if($('.remarkTui').val() == ''){
        layer.msg('请输入退款备注');
        return;
    }
    indexOpen = layer.open({
        type: 1 //Page层类型
        //,area: ['500px', '300px']
        ,btn:["确认"]
        ,title: '请输入收银密码，并确认'
        ,skin: 'layui-layer-prompt'
        ,btnAlign: 'c' //按钮居中
        ,content: "<div class=''><span>收银密码：</span><input type='password' style='display: inline-block;width: 66%;' class='layui-layer-input' value='' placeholder='请输入收银密码'></div>"
        ,yes: function(index, layero){
            var psdNum = $(layero).find("input[type='password']").val();
            tuiFunc($('.tuiNo').val(),psdNum);//退款方法
        }
    });
}
function tuiFunc(tuiNo,psdNum) {
    var url = SERVER_ADDR + "/hospital/finance/refund";
    var Data = {};
    Data.userOfflineProjectId = getQueryString('id');
    Data.payMethod = $('input[type="radio"][name="sexTui"]:checked').val();
    Data.amount = $('.tuiNo').val();
    Data.remark = $('.remarkTui').val();
    Data.paymentPassword = psdNum;
    ajaxGetRetInfo(url,Data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            var index = parent.layui.layer.open({
                title : "打印",
                type : 2,
                area: ['75%','90%'],
                content : 'sureOrderPrint.html?id=' + getQueryString('id')  + '&v=1134',
                success : function(layero, index){

                },
                cancel: function(index, layero){
                    layer.close(index)
                    return false;
                }
            })
        }else{
            alert(retInfo.data);
        }
    },'请求失败', 'POST', undefined, undefined);
}
function toTuiOpen() {
    $('.tuiBtn').attr('onclick','toJiaoOpen()').val('返回');
    $('.printOrder').attr('onclick','sureTuiChoose()');
    $('.fromJiaofei').hide();
    $('.fromTuikuan').show();
}