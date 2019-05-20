var intime;
var firstTop
//判断滑动
$(document).ready(function () {
    Get.sublaterNews();
  /*  $(window).scroll(function(){
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if(scrollTop < 100 ){
            console.log("you are in the top");
           /!* if(total > $('.hos_doc_child').length){
                Get.commont();
            }*!/
        }
    });*/
   /* $('#messageList').scroll(function(){
        if(firstTop > $('#messageList').scrollTop()){
            console.log('shangqu')
            $('#editArea').blur();
        }
    });*/
    $('#messageList').click(function () {
        $('#editArea').blur();
    })
    //Get.first();
});
var To = {
    send: function () {
        var url = SERVER_ADDR + '/app/user/message/sendMessage';
        var Data = {};
        Data.employeeId = getQueryString('hosId');
        Data.content = $('#editArea').val();
        ajaxGetRetInfo(url, Data, this.sendSuccess, '请求失败', 'POST', true, undefined);
    },
    sendSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            Get.subNews();
            $('#editArea').val('').focus();
        } else {
            alert(retInfo.data)
        }
    }
}
//获取信息列表 0.5秒
var Get = {
    sublaterNews:function (pageNumber, keyword, type) {  //第一次进来请求
        var url = SERVER_ADDR + '/app/user/message/getDetail.json';
        var Data = {};
        Data.pageNumber = 1;
        Data.pageSize = 50;
        Data.employeeId = getQueryString('hosId');
        ajaxGetRetInfo(url,Data,this.sublaterNewsSuccess,'请求失败', 'GET', undefined, undefined);
    },
    sublaterNewsSuccess:function (retInfo) {
        if(retInfo.success == true){
            console.log(retInfo)
            Get.addList(retInfo);
            //$(window).scrollTop($('#messageList').height())
            Get.subNews();
        }else{
            alert(retInfo.data)
        }
    },
    subNews:function (pageNumber, keyword, type) {
        var url = SERVER_ADDR + '/app/user/message/getNewMessage.json';
        var Data = {};
        Data.employeeId = getQueryString('hosId');
        Data.lastReplyId = $('.message:last-child').attr('msdid') || 0;
        ajaxGetRetInfo(url,Data,this.subNewsSuccess,'请求失败', 'GET', undefined, undefined);
    },
    subNewsSuccess:function (retInfo) {
        if(retInfo.success == true){
          /*  console.log(retInfo)*/
            Get.addList(retInfo);
            window.clearTimeout(intime);
            intime = setTimeout(function () {
                Get.subNews();
            },1500);
            /*totalCount = retInfo.totalCount;
            if($('.hos_child').length ==  totalCount){
                console.log('滚到顶部了,加载完了')
                $('.pullUpLabel').text('全部加载完毕').css('margin-left','37%')
            }else{
                $('.pullUpLabel').text('查看更多').css('text-align','left').css('margin-left','42%');
            }*/
        }else{
            alert(retInfo.data);
        }
    },
    addList:function (retInfo) {
        retInfo.data.forEach(function (value) {
            console.log(value);
            var html = '';
            if(value.isMe == false){  //医院
                html += '<div class="message" msdId="'+value.msgId+'">' +
                    '<img class="avatar" src="img/hosLogo.png" />' +
                    '<div class="content">' +
                    /*'<div class="nickname">医院<span class="time">10:12:20</span></div>' +*/
                    '<div class="bubble bubble_default left">' +
                    '<div class="bubble_cont">' +
                    '<div class="plain">' +
                    '<pre>'+value.content+'</pre>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
            }else{
                html += '<div class="message me" msdId="'+value.msgId+'"> ' +
                    '<img class="avatar" src="img/myLogo.png" /> ' +
                    '<div class="content"> ' +
                    /* '<div class="nickname"><span class="time">10:10:08</span></div> ' +*/
                    '<div class="bubble bubble_primary right"> ' +
                    '<div class="bubble_cont"> ' +
                    '<div class="plain"> ' +
                    '<pre>'+value.content+'</pre> ' +
                    '</div> ' +
                    '</div> ' +
                    '</div> ' +
                    '</div> ' +
                    '</div>'
            }
            $('#messageList').append(html)
        });
        firstTop = $('#messageList').scrollTop();
        var totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());//$('#messageList').scrollTop();
        var documentheight = parseFloat($(window).height());
        if (documentheight - totalheight <= 100) {
            window.scrollTo(0,$('#messageList').height());
            //$(window).scrollTop($('#messageList').height())
             //$('#messageList').animate({scrollTop:$('#messageList')[0].scrollHeight},1000);
        }

    }
}

