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
        var url = SERVER_ADDR + "/hospital/finance/getDetail.json";
        var Data = {};
        Data.userOfflineProjectId = getQueryString('id');
        ajaxGetRetInfo(url,Data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                $('.news_content').append(renderTableDate(retInfo.data.projectMaterial,retInfo.data.user.diseases));
                $('.factPrice').text(retInfo.data.user.subsist);
                $('.shouldUserPrice').text($('.totalUserPrice').text() - retInfo.data.user.subsist || 0);
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
    });
}
function renderTableDate(data,diseases){
    var dataHtml = '';
    console.log(data)
        if(data.length != 0){
            var totalUserPrice = 0;
            for(var i=0;i<data.length;i++){
                dataHtml += '<tr>'
                    +'<td>'+noData(diseases)+'</td>'
                    +'<td>'+noData(data[i].placeOfOrigin)+'</td>'
                    +'<td>'+noData(data[i].modelNo)+'</td>'
                    +'<td>'+noData(data[i].spec)+'</td>'
                    +'<td>'+noData(data[i].originalPrice)+'</td>'

                    +'<td>'+noData(data[i].price)+'</td>'
                    +'<td>'+noData(data[i].quantity)+'</td>'
                    +'<td class="totlePrice">'+(Number(data[i].price) * Number(data[i].quantity)).toFixed(2)+'</td>'
                    +'</tr>'
                totalUserPrice = totalUserPrice + Number(Number(data[i].price) * Number(data[i].quantity));
            }
            $('.totalUserPrice').text(totalUserPrice.toFixed(2));
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
    var url = SERVER_ADDR + "/hospital/finance/printOrder";
    var Data = {};
    Data.visitRecordId = getQueryString('id');
    Data.payMethod = $('input[type="radio"][name="sex"]:checked').val();
    Data.medicalInsuranceNo = $('.yibaoNo').val();
    ajaxGetRetInfo(url,Data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            var index = parent.layui.layer.open({
                title : "打印",
                type : 2,
                area: ['750px','550px'],
                content : 'sureOrderPrint.html?id=' + getQueryString('id')  + '&v=333',
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
