var staticFunc = {
    rtProductCategoryType: function (type) {
        var rtProductCategoryType;
        switch (type) {
            case 'beauty':
                rtProductCategoryType = '美容类';
                break;
            case 'cure':
                rtProductCategoryType = '医疗类';
                break;
            case 'check':
                rtProductCategoryType = '检查类';
                break;
            case undefined:
                rtProductCategoryType = '无';
                break;
        }
        return rtProductCategoryType;
    }
}
/*医院平台回访状态开始*/
function recordStatusOnlyOne(hospitalStatus,platformStatus) {
    var recordStatusVal;
    if(hospitalStatus != undefined){
        recordStatusVal = recordStatusHospital(hospitalStatus)
    }else{
        recordStatusVal = recordStatusPlatform(platformStatus)
    }
    return recordStatusVal;
}
function recordStatusHospital(status) {
    var recordStatusVal;
    switch (status){
        case 'unConnect':
            recordStatusVal = '未接通';
            break;
        case 'refuse':
            recordStatusVal = '拒接';
            break;
        case 'unAccess':
            recordStatusVal = '未回访';
            break;
        case 'INTENTIONALMISSVISIT':
            recordStatusVal = '有意向未到诊';
            break;
        case 'INTENTIONALMISSVISIT_BOOKED':
            recordStatusVal = '有意向未到诊(已预约)';
            break;
        case 'reservation':
            recordStatusVal = '有意向未到诊(已预约)';
            break;
        case 'INTENTIONALMISSVISIT_NOBOOKED':
            recordStatusVal = '有意向未到诊(未预约)';
            break;
        case 'INTENTIONALVISITED':
            recordStatusVal = '有意向已到诊';
            break;
        case 'visit':
            recordStatusVal = '有意向已到诊';
            break;
        case 'VISITPAID_BE_UNDER_TREATMENT':
            recordStatusVal = '到诊已成交(治疗中)';
            break;
        case 'VISITPAID_ALREADY_TREATED':
            recordStatusVal = '到诊已成交(已治疗)';
            break;
        case 'repeat':
            recordStatusVal = '重单';
            break;
        case 'faild':
            recordStatusVal = '到诊未成交';
            break;
        case 'recontact':
            recordStatusVal = '需再次联系';
            break;
        case 'emptyNum':
            recordStatusVal = '空号/停机';
            break;
        case 'infoError':
            recordStatusVal = '信息不符';
            break;
        case 'platformUnAccess':
            recordStatusVal = '平台未回访';
            break;
        case 'hasAccess':
            recordStatusVal = '跟踪复访';
            break;
        case 'pauseAccess':
            recordStatusVal = '暂停回访';
            break;
        case 'success':
            recordStatusVal = '已成交';
            break;
        case 'unContact':
            recordStatusVal = '无法联系';
            break;
        case undefined:
            recordStatusVal = '';
            break;
    }
    return recordStatusVal;
}
function recordStatusPlatform(status) {
    var recordStatusVal;
    switch (status){
        case 'unConnect':
            recordStatusVal = '未接通';
            break;
        case 'refuse':
            recordStatusVal = '拒接';
            break;
        case 'INTENTIONALMISSVISIT':
            recordStatusVal = '有意向未到诊';
            break;
        case 'INTENTIONALMISSVISIT_BOOKED':
            recordStatusVal = '有意向未到诊(已预约)';
            break;
        case 'INTENTIONALMISSVISIT_NOBOOKED':
            recordStatusVal = '有意向未到诊(未预约)';
            break;
        case 'INTENTIONALVISITED':
            recordStatusVal = '有意向已到诊';
            break;
        case 'VISITPAID_BE_UNDER_TREATMENT':
            recordStatusVal = '到诊已成交(治疗中)';
            break;
        case 'VISITPAID_ALREADY_TREATED':
            recordStatusVal = '到诊已成交(已治疗)';
            break;
        case 'repeat':
            recordStatusVal = '重单';
            break;
        case 'faild':
            recordStatusVal = '到诊未成交';
            break;
        case 'recontact':
            recordStatusVal = '需再次联系';
            break;
        case 'emptyNum':
            recordStatusVal = '空号/停机';
            break;
        case 'infoError':
            recordStatusVal = '信息不符';
            break;
        case 'hospitalUnAccess':
            recordStatusVal = '院方未回访';
            break;
        case 'hasAccess':
            recordStatusVal = '跟踪复访';
            break;
        case 'pauseAccess':
            recordStatusVal = '暂停回访';
            break;
        case 'success':
            recordStatusVal = '已成交';
            break;
        case 'unContact':
            recordStatusVal = '无法联系';
            break;
        case undefined:
            recordStatusVal = '';
            break;
    }
    return recordStatusVal;
}
/*医院平台回访状态结束*/

/*患者订单状态*/
function returnProjectOrderStatus(status,isReservation) {
    var recordStatusVal;
    switch (status){
        case 'waitPaid':
            recordStatusVal = '待支付';
            break;
        case 'waitConfirm':
            if(isReservation == true){
                recordStatusVal = '已预约(已支付)';
                break;
            }else if(isReservation == false){
                recordStatusVal = '未预约(已支付)';
                break;
            }else{
                recordStatusVal = '待确认(已支付)';
                break;
            }
        case 'completed':
            recordStatusVal = '待结算';
            break;
        case 'cancelled':
            recordStatusVal = '已取消';
            break;
        case 'handle':
            recordStatusVal = '已结算';
            break;
        case 'REFUND':
            recordStatusVal = '退款';
            break;
        case 'USED':
            recordStatusVal = '已使用';
            break;
        case undefined:
            recordStatusVal = '';
            break;
    }
    return recordStatusVal;
}

/*患者就诊状态*/
function returnProjectVisitRecordStatus(status) {
    var recordStatusVal;
    switch (status){
        case 'uncheck':
            recordStatusVal = '<span style="color: #FFB800">待审核</span>';
            break;
        case 'wait':
            recordStatusVal = '候诊';
            break;
        case 'loading':
            recordStatusVal = '治疗中';
            break;
        case 'complete':
            recordStatusVal = '完成';
            break;
        case 'leave':
            recordStatusVal = '离诊';
            break;
        case 'disagress':
            recordStatusVal = '不同意(驳回审批)';
            break;
        case 'registration':
            recordStatusVal = '<span style="color: #d25d12">挂号中</span>';
            break;
        case 'No_DEAL_WAS_CONCLUDED_AT_THE_CLINIC':
            recordStatusVal = '到诊<br>未成交';
            break;
        case undefined:
            recordStatusVal = '';
            break;
    }
    return recordStatusVal;
}
/*患者账单状态*/
function returnProjectReconciliationStatus(status) {
    var recordStatusVal;
    switch (status){
        case 'NO_RECONCILIATION':
            recordStatusVal = '未对账';
            break;
        case 'RECONCILIATIONING':
            recordStatusVal = '对账中';
            break;
        case 'HAS_RECONCILIATION':
            recordStatusVal = '已对账(待结算)';
            break;
        case 'SETTLEMENTING':
            recordStatusVal = '结算中';
            break;
        case 'HAS_SETTLEMENT':
            recordStatusVal = '已结算';
            break;
        case 'NO_SETTLEMENT':
            recordStatusVal = '不需要结算';
            break;
        case undefined:
            recordStatusVal = '';
            break;
    }
    return recordStatusVal;
}
/*患者项目分类*/
function returnProjectType(type) {
    var recordTypeVal;
    switch (type){
        case 'coupon':
            recordTypeVal = '体验券';
            break;
        case 'product':
            recordTypeVal = '特价项目';
            break;
        case 'doctor':
            recordTypeVal = '医生';
            break;
        case 'nursingCard':
            recordTypeVal = '护理卡';
            break;
        case undefined:
            recordTypeVal = '线下开单';
            break;
    }
    return recordTypeVal;
}
/*患者订单类别*/
function returnOrderType(type) {
    var recordTypeVal;
    switch (type){
        case 'doctor':
            recordTypeVal = '医生';
            break;
        case 'product':
            recordTypeVal = '特价项目';
            break;
        case 'offline':
            recordTypeVal = '线下订单';
            break;
        case 'registration_fee':
            recordTypeVal = '挂号费';
            break;
        case 'embroidery_eyebrow_festival_20181011':
            recordTypeVal = '绣眉拼团';
            break;
        case 'PERSONAL_EMBROIDERY_EYEBROW_FESTIVAL_20181011':
            recordTypeVal = '绣眉单人';
            break;
        case 'FIVE_LINE_BROWS':
            recordTypeVal = '五人纹眉';
            break;
        case 'LINE_BROWS_CITIC':
            recordTypeVal = '中信纹眉';
            break;
        case 'CITIC_BANK_ACTIVATION_CODE':
            recordTypeVal = '中信激活码获得';
            break;
        case 'PRIZE':
            recordTypeVal = '中奖项目';
            break;
        case undefined:
            recordTypeVal = '';
            break;
    }
    return recordTypeVal;
}
/*分诊状态*/
function returnAllotStatus(status) {
    var recordAllotStatusVal;
    switch (status){
        case 'unallot':
            recordAllotStatusVal = '未分诊';
            break;
        case 'allot':
            recordAllotStatusVal = '已分诊';
            break;
        case 'unchecked':
            recordAllotStatusVal = '未审核';
            break;
        case 'notPass':
            recordAllotStatusVal = '被打回';
            break;
        case 'coupon':
            recordAllotStatusVal = '体验券';
            break;
        case undefined:
            recordAllotStatusVal = '';
            break;
    }
    return recordAllotStatusVal;
}
/*预约医生状态*/
function returnReservationStatus(status) {
    var recordReservationStatusVal;
    switch (status){
        case 'success':
            recordReservationStatusVal = '已预约';
            break;
        case 'complete':
            recordReservationStatusVal = '已完成';
            break;
        case 'cancel':
            recordReservationStatusVal = '已取消';
            break;
        case undefined:
            recordReservationStatusVal = '';
            break;
    }
    return recordReservationStatusVal;
}
/*开单品名类型*/
function returnProjectMaterialType(type) {
    var Val;
    switch (type){
        case 'cure':
            Val = '医疗类';
            break;
        case 'materialScience':
            Val = '材料类';
            break;
        case 'drugs':
            Val = '药品类';
            break;
        case 'check':
            Val = '检查类';
            break;
        case 'health':
            Val = '保健类';
            break;
        case undefined:
            Val = '医疗类';
            break;
    }
    return Val;
}
/*支付方式*/
function returnPayMethod(type) {
    var Val;
    switch (type){
        case 'card':
            Val = '医院收款';
            break;
        case 'cash':
            Val = '医院收款';
            break;
        case 'medicalInsurance':
            Val = '医保支付';
            break;
        case 'platform':
            Val = '平台支付';
            break;
        case undefined:
            Val = '';
            break;
    }
    return Val;
}
/*就诊号重写*/
function returnVisitRecordNumber(val) {
    var number;
    if (val) {
        if (val.split('-')[2] == undefined) {
            var split2 = '';
        } else {
            var split2 = val.split('-')[2];
        }
        number = val.split('-')[0] + '<span style="color: #009688;font-weight:600">' + val.split('-')[1] + '</span>' + split2;
    } else {
        number = '无'
    }
    return number;
}
/*初复诊*/
function returnVisitRecordRepeat(val) {
    var Val;
    switch (val){
        case true:
            Val = '复诊';
            break;
        case false:
            Val = '初诊';
            break;
        case undefined:
            Val = '不明';
            break;
    }
    return Val;
}
function returnSubstring(val){

    if(val && val.length > 10){
        return val.substring(0, 10)+'..';
    }else{
        return val;
    }
}

/*打开预约项目详情*/
function specialProductOpen(obj) {
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var id = $(obj).attr('valueid');
    var valueindex =  $(obj).attr('valueIndex');
    var valuename =  $(obj).attr('valuename');
    var valuetype =  $(obj).attr('valuetype');
    if(valueindex == 0){
        var content = '../specialProductOpen.html?id=' + id + '&name=' + valuename+ '&type=' + valuetype;
    }else{
        var content = 'specialProductOpen.html?id=' + id + '&name=' + valuename+ '&type=' + valuetype;
    }
    var index = layui.layer.open({
        title : "订单信息",
        type : 2,
        area: ['90%','350px'],
        content: content,
        success : function(layero, index){

        },
        cancel: function(index, layero){
            layui.layer.close(index)
            return false;
        }
    })
}