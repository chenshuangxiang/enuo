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
        var url = SERVER_ADDR + "/hospital/finance/registrationFeeDetail.json";
        var Data = {};
        Data.registrationFeeForVisitRecordId = getQueryString('id');
        ajaxGetRetInfo(url,Data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                $('.news_content').append(renderTableDate(retInfo.data.paymentItems,retInfo.data.user.diseases));
                $('.totalUserPrice').text(retInfo.data.receiptRecord.totalPrice);
                $('.factPrice').text(retInfo.data.receiptRecord.paidAmount);
                $('.shouldUserPrice').text(retInfo.data.receiptRecord.totalPrice - retInfo.data.receiptRecord.paidAmount);
                $('.payNo').val($('.shouldUserPrice').text())
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
                    +'<td>挂号费</td>'
                    +'<td>'+noData(data[i].subjectName)+'</td>'
                dataHtml += '<td>'+noData(data[i].fee)+'</td>'
                    +'<td>'+noData(data[i].size)+'</td>';
                if(data[i].payMethod == 'selfPayment' || !data[i].payMethod){
                    dataHtml += '<td>自费</td>'
                }else if(data[i].payMethod == 'medicalInsurancePayment'){
                    dataHtml += '<td>医保</td>'
                    $('.onlinePayZi').hide();
                    $('input[value="medicalInsurance"]').prop('checked',true);
                    $('.yibaoDiv').show();
                    form.render();
                }
                dataHtml +='<td class="totlePrice">'+data[i].totalFee+'</td>'
                    +'</tr>'
                //totalUserPrice = totalUserPrice + Number(Number(data[i].price) * Number(data[i].quantity));
            }
            //$('.totalUserPrice').text(totalUserPrice.toFixed(2));
        }else{
            dataHtml = '<tr><td colspan="5">暂无数据</td></tr>';
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
    if($('.payNo').val() == ''){
        layer.msg('请输入支付金额');
        return;
    }
    if($('input[type="radio"][name="sex"]:checked').val() == 'medicalInsurance'){
        if($('.yibaoNo').val() == ''){
            layer.msg('请输入医保号');
            return;
        }
    }
    var url = SERVER_ADDR + "/hospital/finance/registrationFee/gathering";
    var Data = {};
    Data.registrationFeeForVisitRecordId = getQueryString('id');
    Data.payMethod = $('input[type="radio"][name="sex"]:checked').val();
    Data.medicalInsuranceNo = $('.yibaoNo').val();
    Data.amount = $('.payNo').val();
    Data.remark = $('.remark').val();
    ajaxGetRetInfo(url,Data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            var index = parent.layui.layer.open({
                title : "打印",
                type : 2,
                area: ['830px','80%'],
                content : 'sureOrderPrintGuahao.html?id=' + getQueryString('id')  + '&v=1134',
                success : function(layero, index){

                },
                cancel: function(index, layero){
                    layer.close(index)
                    return false;
                }
            })
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
        area: ['830px','80%'],
        content : 'sureOrderPrint.html?id=' + id  + '&v=1134',
        success : function(layero, index){

        },
        cancel: function(index, layero){
            parent.layui.layer.close(index)
            return false;
        }
    })
}