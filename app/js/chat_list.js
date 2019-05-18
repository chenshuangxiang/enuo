var healthName;
function init() {
    Get.baseInfo();
    Get.list();
    setInterval(function () {
        Get.list();
    },5000)
}
var Get = {
    baseInfo:function () {  //获取是否有健康助理
        var url = SERVER_ADDR + '/app/user/health/document/baseInfo';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.baseInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    baseInfoSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            if(retInfo.data.healthSupervisor){
                $('.myHealthName').text('我的健康助理:'+retInfo.data.healthSupervisor.name);
                healthName = '我的健康助理:'+retInfo.data.healthSupervisor.name;
                Get.healthNews();
                setInterval(function () {
                    Get.healthNews();
                },5000)
            }
        }else{
            alert(retInfo.data)
        }
    },
    healthNews: function () {
        var url = SERVER_ADDR + '/app/user/health_supervisor/consultation/window';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.healthNewsSuccess, '请求失败', 'GET', true, undefined);
    },
    healthNewsSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            $('.myHealthDiv').attr("onclick","window.location.href = 'chatHealth.html?id="+retInfo.data.id+"&version="+retInfo.data.version+"&name="+healthName+"'");
            //$('.find_doc').css('margin-top','0');
            if(retInfo.data.newMsg){
                $('.healthmanNewMsg').text(retInfo.data.newMsg);
            }
            if(retInfo.data.newSendDatetime){
                $('.healthmanlastTime').text(new Date(retInfo.data.newSendDatetime).Format('yyyy-MM-dd hh:mm:ss'));
            }
            if(retInfo.data.see == false){
                $('.healthmannew').show();
            }else{
                $('.healthmannew').hide();
            }

        } else {
            alert(retInfo.data)
        }
    },
    list: function () {
        var url = SERVER_ADDR + '/app/user/message/getList.json';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.listSuccess, '请求失败', 'GET', true, undefined);
    },
    listSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            var html = '';
            $('.find_doc').empty();
            retInfo.data.forEach(function (value) {
                html += '<div class="find_docDiv" style="border-top: 1px solid #eeeeee" valueid="'+value.employeeId+'" valuehasNewMsg="'+value.hasNewMsg+'" onclick="href(this)"> ' ;
                    if(value.hasNewMsg == true){
                        html += '<span class="new"></span>';
                    }
                html += '<img src="img/hosLogo.png"> ' +
                    '<div class="btm"> ' +
                    '<p><span class="black">'+value.hospitalName+'</span><span class="lastTime">'+value.sendDate+'</span></p> ' +
                    '<p class="contentNews">'+value.lastMessage+'</p> ' +
                    '</div> ' +
                    '</div>'
            })
            $('.find_doc').append(html)
        } else {
            alert(retInfo.data)
        }
    }
}
function href(obj) {
    if($(obj).attr('valuehasNewMsg') == 'true'){
        follow.getNewsCount();//获取未读消息条数
    }
    window.location.href = 'chat.html?hosId='+ $(obj).attr('valueid');
}