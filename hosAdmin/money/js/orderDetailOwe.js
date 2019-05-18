var form;
var tableMateLocal = [];//JSON.parse(localStorage.getItem('localInfo')) || [];
    //tableMateLocal = tableMateLocal[0];
    console.log(tableMateLocal)
var tabledata = [];
var tablePostdata = [];
var mobile;
var indexOpen;
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
        if(data.value == 'platform'){
            $('.rechargeDiv').show();
            $('.payNumDiv').hide();
        } else {
            $('.rechargeDiv').hide();
            $('.payNumDiv').show();
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
                mobile = retInfo.data.user.mobile;
                if(retInfo.data.receiptRecord.paidAmount > 0){
                   $('.tuiBtn').show();
                }
                $('.news_content').append(renderTableDate(retInfo.data.projectMaterial,retInfo.data.user.diseases));
                $('.totalUserPrice').text(retInfo.data.receiptRecord.totalPrice);
                $('.factPrice').text(retInfo.data.receiptRecord.paidAmount);
                $('.shouldUserPrice').text((retInfo.data.receiptRecord.totalPrice - retInfo.data.receiptRecord.paidAmount).toFixed(2));
               /* if(retInfo.data.user.subsist != 0){
                    $('.layer_notice').append('<p><span>预缴：￥</span>'+retInfo.data.user.subsist+'元</p>');
                }
                if(retInfo.data.receiptRecord.cash){
                    $('.layer_notice').append('<p><span>现金支付：￥</span>'+retInfo.data.receiptRecord.cash+'元</p>');
                }
                if(retInfo.data.receiptRecord.card){
                    $('.layer_notice').append('<p><span>医院收款：￥</span>'+retInfo.data.receiptRecord.card+'元</p>');
                }
                if(retInfo.data.receiptRecord.medicalInsurance){
                    $('.layer_notice').append('<p><span>医保支付：￥</span>'+retInfo.data.receiptRecord.medicalInsurance+'元</p>');
                }
                if(retInfo.data.receiptRecord.platform){
                    $('.layer_notice').append('<p><span>平台支付：￥</span>'+retInfo.data.receiptRecord.platform+'元</p>');
                }*/

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
   /* if($('.factPrice').text() != 0){
        layui.layer.tips($('.layer_notice').html(), '#factPrice',{
            tips: [1, '#3595CC'],
        });
    }*/
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
            dataHtml = '<tr><td colspan="9">暂无数据</td></tr>';
        }
        return dataHtml;
}
function surePayChoose() {

    //layui.layer.closeAll("iframe");
    //parent.layui.layer.closeAll();
    if($('input[type="radio"][name="sex"]:checked').val() == undefined){
            layer.msg('请选择支付方式');
            return;
    }
    if($('input[type="radio"][name="sex"]:checked').val() == 'medicalInsurance'){
        if($('.yibaoNo').val() == ''){
            layer.msg('请输入医保号');
            return;
        }
    }
    if($('input[type="radio"][name="sex"]:checked').val() == 'platform'){
        if($('.rechargeNo').val() == ''){
            layer.msg('请输入充值卡号');
            return;
        }
        if($('.rechargePsd').val() == ''){
            layer.msg('请输入充值卡密码');
            return;
        }
        openPayPsd('充值卡');  //弹出收银密码
    }else{
        if($('.payNo').val() == ''){
            layer.msg('请输入支付金额');
            return;
        }
        var index = layer.confirm('确认患者已经缴费？', {
            btn: ['确认','取消'], //按钮
            icon:3
        }, function(){
            layer.close(index);
            openPayPsd('收银');  //弹出收银密码
        }, function(){

        });
    }
}
function openPayPsd(type) {
    var typeVal = type;
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
            if(typeVal == '收银'){
                payFunc($('.payNo').val(),psdNum);//支付方法
            }else if(typeVal == '充值卡'){
                Get.rechargeCard();
            }else if(typeVal == '退款'){
                tuiFunc($('.tuiNo').val(),psdNum);//退款方法
            }
        }
    });
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
    openPayPsd('退款');

}
function tuiFunc(amount,psdNum) {
    var url = SERVER_ADDR + "/hospital/finance/refund";
    var Data = {};
    Data.userOfflineProjectId = getQueryString('id');
    Data.payMethod = $('input[type="radio"][name="sexTui"]:checked').val();
    Data.amount = amount;
    Data.remark = $('.remarkTui').val();
    Data.paymentPassword = psdNum;
    ajaxGetRetInfo(url,Data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            layer.close(indexOpen);
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
            layer.alert(retInfo.data,{icon:5})
        }
    },'请求失败', 'POST', undefined, undefined);
}
function payFunc(amount,psdNum) {
    var url = SERVER_ADDR + "/hospital/finance/receipt";
    var Data = {};
    Data.userOfflineProjectId = getQueryString('id');
    Data.payMethod = $('input[type="radio"][name="sex"]:checked').val();
    Data.medicalInsuranceNo = $('.yibaoNo').val();
    Data.amount = amount;
    Data.remark = $('.remark').val();
    Data.paymentPassword = psdNum;
    ajaxGetRetInfo(url,Data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            layer.close(indexOpen);
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
            layer.alert(retInfo.data,{icon:5})
        }
    },'请求失败', 'POST', undefined, undefined);
}
function printOrderOpen(obj) {
    /* layui.layer.open({
         type: 1,
         shade: false,
         title: false, //不显示标题
         content: $('.payChooseOpen'), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
         success : function(layero, index){

         },
     });*/
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var id = getQueryString('id');
    /*  var payMethods = $(obj).attr('payMethod');
      if(payMethods == "undefined"){
          //直接弹出sureOrderPrint
          var index = layui.layer.open({
              title : "打印",
              type : 2,
              area: ['750px','80%'],
              content : 'orderDetail.html?id=' + id,
              success : function(layero, index){

              },
              cancel: function(index, layero){
                  layer.close(index)
                  return false;
              }
          })
      }else{
          var index = layui.layer.open({
              title : "打印",
              type : 2,
              area: ['750px','80%'],
              content : 'sureOrderPrint.html?id=' + id,
              success : function(layero, index){

              },
              cancel: function(index, layero){
                  layer.close(index)
                  return false;
              }
          })
      }*/
    var index = parent.layui.layer.open({
        title : "打印",
        type : 2,
        area: ['75%','90%'],
        content : 'sureOrderPrint.html?id=' + id  + '&v=1134',
        success : function(layero, index){

        },
        cancel: function(index, layero){
            parent.layui.layer.close(index)
            return false;
        }
    })
}
function toTuiOpen() {
    $('.tuiBtn').attr('onclick','toJiaoOpen()').val('返回');
    $('.printOrder').attr('onclick','sureTuiChoose()');
    $('.fromJiaofei').hide();
    $('.fromTuikuan').show();
}
function toJiaoOpen() {
    $('.tuiBtn').attr('onclick','toTuiOpen()').val('退款');
    $('.printOrder').attr('onclick','surePayChoose()');
    $('.fromJiaofei').show();
    $('.fromTuikuan').hide();
}
var Get = {
    rechargeCard:function () {
        var url = SERVER_ADDR + '/hospital/finance/checkRecharge';
        var Data = {};
        Data.mobile = mobile;
        Data.number = $('.rechargeNo').val();
        Data.password = $('.rechargePsd').val();
        ajaxGetRetInfo(url, Data, this.rechargeCardSuccess, '请求失败', 'POST', true, undefined);
    },
    rechargeCardSuccess: function (res) {
        if (res.success == true) {
            if(res.data.indexOf('充值') != -1){
                var amount = res.data.split('充值')[1].split('成功')[0];
                payFunc(amount);//支付方法
            }else{
                alert(res.data);
            }

            /*if($('.shouldUserPrice').text() >= 1000){
                amount = 1000;
            }else{
                amount = $('.shouldUserPrice').text();
            }*/

        } else {
            alert(res.data);
        }
    },
}