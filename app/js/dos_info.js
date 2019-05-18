function init() {
    Get.dosinfo()
}
var Get = {
    dosinfo: function () {
        var url = SERVER_ADDR + '/app/topthree/doctor/getDoctorInfo.json';
        var Data = {};
        Data.id = getQueryString('dosId');
        ajaxGetRetInfo(url, Data, this.dosinfoSuccess, '请求失败', 'GET', true, undefined);
    },
    dosinfoSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            $('.hosName').text(retInfo.data.name);
            $('.docName').text(retInfo.data.doctorTypeName);
            $('.docLevel').text(retInfo.data.adeptProject);
            $('.shanchang').text(retInfo.data.brief);
        } else {
            alert(retInfo.data)
        }
    },
}