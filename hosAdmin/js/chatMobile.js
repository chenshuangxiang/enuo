var intime;
var index = 0;
var hosId;
$(document).ready(function () {
    $('.head_title,title').text('和'+getQueryString('name')+'的聊天');
    $('body').height($('body')[0].clientHeight);
    Get.sublaterNews();
    $(window).scroll(function(){
        //$('#editArea').blur();
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if(scrollTop < 100 ){
            console.log("you are in the top");
            /* if(total > $('.hos_doc_child').length){
                 Get.commont();
             }*/
        }
    });
    document.getElementById('messageList').addEventListener("touchstart",function(){
        $('#editArea').blur();
    })
    $('#editArea').focus(function () {

        window.scrollTo(0,$('#messageList').height()) ;
        //alert('he'+ $('#messageList').height());
    })
      /*  $('#messageList').scroll(function(){
       /!* if(firstTop > $('#messageList').scrollTop()){*!/
            console.log('shangqu')

       /!* }*!/
    });*/
    /*$('#messageList').click(function () {
        $('#editArea').blur();
    })*/
    //Get.first();
});
var To = {
    send: function () {
        var url = SERVER_ADDR + '/hospital/message/sendMessage';
        var Data = {};
        Data.userId = getQueryString('employeeId');
        Data.hospitalEmployeeId = getQueryString('hosId');
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
    },
    hos:function () {
        //window.location.href = '/app/hos_index.html?hosId=' + hosId;
    }
}
//获取信息列表 0.5秒
var Get = {
    sublaterNews:function (pageNumber, keyword, type) {  //第一次进来请求
        var url = SERVER_ADDR + '/hospital/message/getDetail.json';
        var Data = {};
        Data.pageNumber = 1;
        Data.pageSize = 50;
        Data.userId = getQueryString('employeeId');
        Data.hospitalEmployeeId = getQueryString('hosId');
        ajaxGetRetInfo(url,Data,this.sublaterNewsSuccess,'请求失败', 'GET', undefined, undefined);
    },
    sublaterNewsSuccess:function (retInfo) {
        if(retInfo.success == true){
            console.log(retInfo)
            $('title,.head_title').text(retInfo.data.name);
            hosId = retInfo.data.id;
            Get.addDetailList(retInfo.data.message);
            Get.subNews();
            setTimeout(function () {
                if(index == 0){
                    window.scrollTo(0,$('#messageList').height()) ;
                    index = 1;
                }
            },100);
        }else{
            alert(retInfo.data)
        }
    },
    subNews:function (pageNumber, keyword, type) {
        var url = SERVER_ADDR + '/hospital/message/getNewMessage.json';
        var Data = {};
        Data.userId = getQueryString('employeeId');
        Data.lastReplyId = $('.message:last-child').attr('msgid') || 0;
        Data.hospitalEmployeeId = getQueryString('hosId');
        ajaxGetRetInfo(url,Data,this.subNewsSuccess,'请求失败', 'GET', undefined, undefined);
    },
    subNewsSuccess:function (retInfo) {
        if(retInfo.success == true){
           /* console.log(retInfo)*/
            Get.addList(retInfo.data);
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
    addDetailList:function (retInfo) {
        if(retInfo){
            retInfo.forEach(function (value) {
                /*  console.log(value);*/
                var html = '';
                if(value.isMe == false){  //医院
                    html += '<div class="message" msgId="'+value.msgId+'">' +
                        '<img class="avatar" src="img/myLogo.png" onclick="To.hos()"/>' +
                        '<p class="getTime">'+value.sendDate+'</p>'+
                        '<div class="chatcontent">' +
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
                    html += '<div class="message me" msgId="'+value.msgId+'"> ' +
                        '<img class="avatar" src="img/hosLogo.png" /> ' +
                        '<p class="sendTime">'+value.sendDate+'</p>'+
                        '<div class="chatcontent"> ' +
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
                $('#messageList').prepend(html)
            });
            var totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
            var documentheight = parseFloat($(document).height());
            if (documentheight - totalheight <= 100) {
                if(retInfo.length > 0){
                    window.scrollTo(0,$('#messageList').height());
                }
                //$(window).scrollTop($('#messageList').height())
                //$('#messageList').scrollTop( $('#messageList')[0].scrollHeight );
            }
        }



    },addList:function (retInfo) {
        retInfo.forEach(function (value) {
            /*  console.log(value);*/
            var html = '';
            if(value.isMe == false){  //医院
                html += '<div class="message" msgId="'+value.msgId+'">' +
                    '<img class="avatar" src="img/myLogo.png" onclick="To.hos()"/>' +
                    '<p class="getTime">'+value.sendDate+'</p>'+
                    '<div class="chatcontent">' +
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
                html += '<div class="message me" msgId="'+value.msgId+'"> ' +
                    '<img class="avatar" src="img/hosLogo.png" /> ' +
                    '<p class="sendTime">'+value.sendDate+'</p>'+
                    '<div class="chatcontent"> ' +
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
        var totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
        var documentheight = parseFloat($(document).height());
        if (documentheight - totalheight <= 100) {
            if(retInfo.length > 0){
                window.scrollTo(0,$('#messageList').height());
            }
            //$(window).scrollTop($('#messageList').height())
            //$('#messageList').scrollTop( $('#messageList')[0].scrollHeight );
        }

    }
}
