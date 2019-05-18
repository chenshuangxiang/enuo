function init() {
    Get.list();
    setInterval(function () {
        Get.list();
    },50000)
}
var Get = {
    list: function () {
        var url = SERVER_ADDR + '/hospital/message/getList.json';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.listSuccess, '请求失败', 'GET', true, undefined);
    },
    listSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            var html = '';
            $('.find_doc').empty();
            retInfo.data.forEach(function (value) {
                html += '<div class="find_docDiv" style="border-top: 1px solid #eeeeee" nickname="'+value.nickname+'" valueid="'+value.employeeId+'" userId="'+value.userId+'" onclick="href(this)"> ' ;
                    if(value.hasNewMsg == true){
                        html += '<span class="new"></span>';
                    }
                html += '<img src="img/myLogo.png"> ' +
                    '<div class="btm"> ' +
                    '<p><span class="black">'+value.nickname+'</span><span class="lastTime">'+value.sendDate+'</span></p> ' +
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
    window.location.href = '/hosAdmin/chatMobile.html?employeeId='+ $(obj).attr('userId') + '&hosId=' + $(obj).attr('valueid')  + '&name=' + $(obj).attr('nickname');
}