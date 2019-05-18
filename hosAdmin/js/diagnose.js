var form;
var tableMateLocal = [];//JSON.parse(localStorage.getItem('localInfo')) || [];
    //tableMateLocal = tableMateLocal[0];
    console.log(tableMateLocal)
var tabledata = [];
var tablePostdata = [];
layui.use(['form','layer','jquery','layedit','table','element'],function(){
	 form = layui.form,
         table = layui.table,
         element = layui.element;
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		layedit = layui.layedit,
		$ = layui.jquery;

    getModelNoInfo();
    /*if(getQueryString('subsist') == 'undefined'){
        $('.subsistPrice').text(0);
    }else {
        $('.subsistPrice').text(getQueryString('subsist'));
    }*/

    form.render();
    $('.typeSelect,.medicareSelect').change(function () {
       chooseType();
       $('.totalUserPrice').text(chooseType());
    });
    //品名信息
    function getModelNoInfo() {
        var url = SERVER_ADDR + "/hospital/doctor/index/getOrderItem.json";
        var Data = {};
        Data.visitRecordId = getQueryString('id');
        ajaxGetRetInfo(url,Data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                if(retInfo.data.diagnoseList){
                    $('.maintell').val(retInfo.data.diagnoseList[0].chiefComplaint);
                    $('.nowIll').val(retInfo.data.diagnoseList[0].presentMedicalHistory);
                    //$('.tutorshipCheck').val(retInfo.data.diagnoseList[0].supplementaryExamination);
                    $('.firstDiagnosis').val(retInfo.data.diagnoseList[0].preliminaryDiagnosis);
                    $('.treatmentAdvice').val(retInfo.data.diagnoseList[0].treatmentAdvice);
                    if(retInfo.data.diagnoseList[0].supplementaryExaminations){
                        init_img_read(retInfo.data.diagnoseList[0].supplementaryExaminations);
                        $('#gallery img').fsgallery();
                    }
                }else{
                    $('.layui-collapse').hide();
                }
                if(retInfo.data.reservationList){
                    $('.layui-table-yuyue').show();
                    if(retInfo.data.reservationList.type == "coupon"){
                        retInfo.data.reservationList.type= '体验券'
                    }else if(retInfo.data.reservationList.type == "product"){
                        retInfo.data.reservationList.type= '特价项目'
                    }else if(retInfo.data.reservationList.type == "doctor"){
                        retInfo.data.reservationList.type= '医生'
                    }
                    $('.news_content_yuyue').append('<tr><td>'+retInfo.data.reservationList.reservationDate+'</td><td>'+retInfo.data.reservationList.type+'</td><td>'+retInfo.data.reservationList.name+'</td></tr>');
                }
                $('.news_content').append(renderTableDate(retInfo.data.projectMaterialList));
                if(retInfo.data.delProjectMaterialList.length > 0){
                    $('.sysNoticeTwo').show();
                    $('.news_content_tui').append(renderTableTuiDate(retInfo.data.delProjectMaterialList));
                }
            }
        },'请求失败', 'GET', undefined, undefined);
    }
});
function addVisitProject(obj) {
    var elThis = getQueryString('valueuserOfflineProject');
    console.log(4555)
    var index = parent.layui.layer.open({
        title : "治疗",
        type : 2,
        area:['950px','92%'],
        content : "addAgainTemplateProject.html?valueid=" + elThis + '&v=1134',
        success : function(layero, index){
            localStorage.setItem('allDoctorOrder',$('.layui-laypage-curr em').eq(1).text());

        }
    })
}
function renderTableDate(data){
    var dataHtml = '';
    console.log(data)
        if(data.length != 0){
            var totalUserPrice = 0;
            var remarks;
            for(var i=0;i<data.length;i++){
                remarks = data[0].remarks;
                dataHtml += '<tr>'
                    +'<td>'+noData(getQueryString('disease'))+'</td>'
                    +'<td>'+noData(data[i].modelNo)+'</td>'
                if(data[i].type == 'cure' || !data[i].type){
                    dataHtml +='<td class="typeTd">医疗类</td>';
                }else if(data[i].type == 'materialScience'){
                    dataHtml +='<td class="typeTd">材料类</td>';
                }else if(data[i].type == 'drugs'){
                    dataHtml +='<td class="typeTd">药品类</td>';
                }else if(data[i].type == 'check'){
                    dataHtml +='<td class="typeTd">检查类</td>';
                }else if(data[i].type == 'health'){
                    dataHtml +='<td class="typeTd">保健类</td>';
                }
                dataHtml +='<td>'+noData(data[i].placeOfOrigin)+'</td>'
                    +'<td>'+noData(data[i].spec)+'</td>'
                    +'<td>'+noData(data[i].quantity)+'</td>'
                    +'<td>'+noData(data[i].originalPrice)+'</td>'
                    +'<td>'+noData(data[i].price)+'</td>'
                if(data[i].medicalInsurance == true){
                    dataHtml +='<td class="medicareTd">是</td>';
                }else if(data[i].medicalInsurance == false || !data[i].medicalInsurance){
                    dataHtml +='<td class="medicareTd">否</td>';
                }
                dataHtml +='<td class="totlePrice">'+noData(data[i].singleTotalPrice)+'</td>'
                    +'<td><a onclick="chargeback(this)" style=" height: 26px; line-height: 26px; padding: 0 8px;" userOfflineProjectId="'+data[i].userOfflineProject+'" projectMaterialId="'+data[i].id+'" orderId="'+data[i].orderId+'" class="layui-btn layui-btn-danger layui-btn-xs">退单</a></td>'
                    +'</tr>';
                totalUserPrice = totalUserPrice + Number(data[i].singleTotalPrice);
            }
            $('.totalUserPrice').text(totalUserPrice);
            $('.remarks').text(remarks);
        }else{
            dataHtml = '<tr><td colspan="11">暂无数据</td></tr>';
        }
        return dataHtml;
}
function renderTableTuiDate(data){
    var dataHtml = '';
    console.log(data)
    if(data.length != 0){
        for(var i=0;i<data.length;i++){
            dataHtml += '<tr>'
                +'<td>'+noData(getQueryString('disease'))+'</td>'
                +'<td>'+noData(data[i].modelNo)+'</td>'
            if(data[i].type == 'cure' || !data[i].type){
                dataHtml +='<td class="typeTd">医疗类</td>';
            }else if(data[i].type == 'materialScience'){
                dataHtml +='<td class="typeTd">材料类</td>';
            }else if(data[i].type == 'drugs'){
                dataHtml +='<td class="typeTd">药品类</td>';
            }else if(data[i].type == 'check'){
                dataHtml +='<td class="typeTd">检查类</td>';
            }else if(data[i].type == 'health'){
                dataHtml +='<td class="typeTd">保健类</td>';
            }
            dataHtml +='<td>'+noData(data[i].placeOfOrigin)+'</td>'
                +'<td>'+noData(data[i].spec)+'</td>'
                +'<td>'+noData(data[i].quantity)+'</td>'
                +'<td>'+noData(data[i].originalPrice)+'</td>'
                +'<td>'+noData(data[i].price)+'</td>'
            if(data[i].medicalInsurance == true){
                dataHtml +='<td class="medicareTd">是</td>';
            }else if(data[i].medicalInsurance == false || !data[i].medicalInsurance){
                dataHtml +='<td class="medicareTd">否</td>';
            }
            dataHtml +='<td class="totlePrice">'+noData(data[i].singleTotalPrice)+'</td>'
                +'<td><a onclick="chargebackBack(this)" style=" height: 26px; line-height: 26px; padding: 0 8px;" userOfflineProjectId="'+data[i].userOfflineProject+'" projectMaterialId="'+data[i].id+'" orderId="'+data[i].orderId+'" class="layui-btn layui-btn-normal layui-btn-xs">撤回</a></td>'
                +'</tr>';
        }
    }else{
        dataHtml = '<tr><td colspan="11">暂无数据</td></tr>';
    }
    return dataHtml;
}
function chargeback(obj) {
    var elThis = $(obj)
    var userOfflineProjectId = elThis.attr('userOfflineProjectId');
    var orderId = elThis.attr('orderId');
    var projectMaterialId = elThis.attr('projectMaterialId');
    var url = SERVER_ADDR + "/hospital/doctor/index/deleteProject";
    var Data = {};
    Data.userOfflineProjectId = userOfflineProjectId;
    Data.orderId = orderId;
    Data.projectMaterialId = projectMaterialId;
    layer.confirm('确定退单？',{icon:3}, function(index){
        ajaxGetRetInfo(url,Data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                layer.msg('退单成功');
                setTimeout(function () {
                    window.location.reload();
                },1000)
            }else{
                layer.msg(retInfo.data);
            }
        },'请求失败', 'GET', undefined, undefined);
    });
}
function chargebackBack(obj) {
    var elThis = $(obj)
    var userOfflineProjectId = elThis.attr('userOfflineProjectId');
    var orderId = elThis.attr('orderId');
    var projectMaterialId = elThis.attr('projectMaterialId');
    var url = SERVER_ADDR + "/hospital/doctor/index/retract/delete";
    var Data = {};
    Data.userOfflineProjectId = userOfflineProjectId;
    Data.orderId = orderId;
    Data.projectMaterialId = projectMaterialId;
    layer.confirm('确定撤回退回的订单？',{icon:3}, function(index){
        ajaxGetRetInfo(url,Data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                layer.msg('撤回成功');
                setTimeout(function () {
                    window.location.reload();
                },1000)
            }else{
                layer.msg(retInfo.data);
            }
        },'请求失败', 'POST', undefined, undefined);
    });
}
