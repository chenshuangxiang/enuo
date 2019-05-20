
function init() {
    Go.baseInfo();
}
var healthName;
var Go = {
    healthmanchat: function () {
        var url = SERVER_ADDR + '/app/user/health_supervisor/consultation/window';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.healthmanchatSuccess, '请求失败', 'GET', true, undefined);
    },
    healthmanchatSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            window.location.href = "chatHealth.html?id="+retInfo.data.id+"&version="+retInfo.data.version+"&name="+healthName;
        } else {
            alert(retInfo.data)
        }
    },
    baseInfo:function () {  //获取基本信息
        var url = SERVER_ADDR + '/app/user/health/document/baseInfo';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.baseInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    baseInfoSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            if(retInfo.data.healthSupervisor){
                $('.myHealthman').text(retInfo.data.healthSupervisor.name);
                $('.myHealthmanA').attr('href','tel:'+retInfo.data.healthSupervisor.mobile);
                healthName = retInfo.data.healthSupervisor.name;
                $('.goBtn').attr('onclick','Go.toyuyueHealthman('+retInfo.data.healthSupervisor.id+')');
            }
        }else{
            alert(retInfo.data)
        }
    },
    toyuyueHealthman:function (id) {
        window.location.href = "pay/dos_yuyue.html?docId="+id+"&type=health_supervisor";
    }
}

