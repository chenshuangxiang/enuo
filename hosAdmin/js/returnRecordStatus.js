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