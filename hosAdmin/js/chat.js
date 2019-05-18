var intime;
var index = 0;
$(document).ready(function () {
    $('.main').attr('employeeId',getQueryString('valueid'));
    Get.sublaterNews();
    document.onkeydown = keyDownSearch;
    function keyDownSearch(e) {
        // 兼容FF和IE和Opera 回车登录
        var theEvent = e || window.event;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if (code == 13) {
            To.send();
            return false;
        }
        return true;
    }

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
   /* document.getElementById('messageList').addEventListener("touchstart",function(){
        $('#editArea').blur();
    })*/
    /*$('#editArea').focus(function () {
        window.scrollTo(0,$('#messageList').height()) ;
    })*/
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
        Data.userId = $('.main').attr('employeeId');
        Data.content = $('#editArea').val();
        Data.hospitalEmployeeId = getQueryString('employeeid');
        ajaxGetRetInfo(url, Data, this.sendSuccess, '请求失败', 'POST', true, undefined);
    },
    sendSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            Get.subNews();
            $('#editArea').val('').focus();
            $('#messageList').scrollTop( $('#messageList')[0].scrollHeight );
        } else {
            alert(retInfo.data)
        }
    }
}
//获取信息列表 0.5秒
var Get = {
    sublaterNews:function (pageNumber, keyword, type) {  //第一次进来请求
        var url = SERVER_ADDR + '/hospital/message/getDetail.json';
        var Data = {};
        Data.pageNumber = 1;
        Data.pageSize = 50;
        Data.userId = $('.main').attr('employeeId');
        Data.hospitalEmployeeId = getQueryString('employeeid');
        ajaxGetRetInfo(url,Data,this.sublaterNewsSuccess,'请求失败', 'GET', undefined, undefined);
    },
    sublaterNewsSuccess:function (retInfo) {
        if(retInfo.success == true){
            $('#messageList').empty()
            console.log(retInfo)
            Get.addDetailList(retInfo);
            setTimeout(function () {
                if(index == 0){
                    //window.scrollTo(0,$('#messageList').height()) ;
                    $('#messageList').scrollTop( $('#messageList')[0].scrollHeight );
                    index = 1;
                }
            },100);
            Get.subNews();
        }else{
            alert(retInfo.data)
        }
    },
    subNews:function (pageNumber, keyword, type) {
        var url = SERVER_ADDR + '/hospital/message/getNewMessage.json';
        var Data = {};
        Data.userId = $('.main').attr('employeeId');
        Data.lastReplyId = $('div[id=messageDiv]:last').attr('msgid') || 0;
        Data.hospitalEmployeeId = getQueryString('employeeid');
        ajaxGetRetInfo(url,Data,this.subNewsSuccess,'请求失败', 'GET', undefined, undefined);
    },
    subNewsSuccess:function (retInfo) {
        if(retInfo.success == true){
           /* console.log(retInfo)*/
            Get.addList(retInfo);
            //$('#messageList').scrollTop( $('#messageList')[0].scrollHeight );
            window.clearTimeout(intime);
            intime = setTimeout(function () {
                Get.subNews();
            },2000);
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
        retInfo.data.forEach(function (value) {
          /*  console.log(value);*/
            $('#messageList').prepend(Get.setHtml(value))
        });

       /* var totalheight = $('#messageList').scrollTop();//parseFloat($(window).height()) + parseFloat($(window).scrollTop());
        var documentheight = parseFloat($('#messageList')[0].scrollHeight);
        if (documentheight - totalheight <= 650) { //有消息加进去，在底部
            $('#messageList').scrollTop( $('#messageList')[0].scrollHeight );
           /!* if(retInfo.data.length > 0){
                window.scrollTo(0,$('#messageList').height());
                //$('#messageList').animate({scrollTop:$('#messageList')[0].scrollHeight},1000)
            }*!/
            //$(window).scrollTop($('#messageList').height())
            //$('#messageList').scrollTop( $('#messageList')[0].scrollHeight );
        }*/
    },
    addList:function (retInfo) {
        retInfo.data.forEach(function (value) {
            /*  console.log(value);*/
            $('#messageList').append(Get.setHtml(value))
        });

        var totalheight = $('#messageList').scrollTop();//parseFloat($(window).height()) + parseFloat($(window).scrollTop());
        var documentheight = parseFloat($('#messageList')[0].scrollHeight);
        if (documentheight - totalheight <= 650) { //有消息加进去，在底部
            $('#messageList').scrollTop( $('#messageList')[0].scrollHeight );
            /* if(retInfo.data.length > 0){
                 window.scrollTo(0,$('#messageList').height());
                 //$('#messageList').animate({scrollTop:$('#messageList')[0].scrollHeight},1000)
             }*/
            //$(window).scrollTop($('#messageList').height())
            //$('#messageList').scrollTop( $('#messageList')[0].scrollHeight );
        }
    },
    setHtml:function (value) {
        var html = '';
        if(value.isMe == false){  //用户
            if(value.msgType == 'TEXT'){
                html += '<div id="messageDiv" class="message" msgId="'+value.msgId+'">' +
                    '<img class="avatar" onclick="toUserInfo(this)" valueindex="1" valuemobile="'+getQueryString('mobile')+'" src="img/myLogo.png" />' +
                    '<p class="getTime">'+value.sendDate+'</p>'+
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
            }else if(value.msgType == 'IMG_TEXT'){
                if(value.orderType == 'product'){
                    html += '<div id="messageDiv" class="message" msgId="'+value.msgId+'"> ' +
                        '<img class="avatar" onclick="toUserInfo(this)"  valueindex="1" valuemobile="'+getQueryString('mobile')+'" src="img/myLogo.png" /> ' +
                        '<p class="sendTime" style="margin-left: 52px;">'+value.sendDate+'</p>'+
                        '<div class="content"> ' +
                        '<div class="bubble2 bubble_primary2 left2"> ' +
                        ' <div class="sendAlreadyBody"> ' +
                        '<div class="hos_doc_child clearfix" style="position: relative;margin: .1rem 0 .2rem .1rem;" valueid="'+value.advisoryObjId+'" ispreferential="'+value.preferential+'" onclick="To.hrefProductDetail(this)"> ' +
                        '<div class="doc_child_left" style="width: 70px;overflow: hidden;"><img class="sendBodyImg alreadySendBodyImg"' +
                        'style="max-height: 55px;;border-radius: 5px;overflow: hidden;" src="'+value.firstImg+'"> ' +
                        '</div> ' +
                        '<div class="doc_child_right" style="margin: 0 0 0 0;width: 170px"> ' +
                        '<div class="id"><p class="name" style="font-size: .9rem;"><span class="goodsName alreadySendgoodsName">'+value.content.split('-comment-')[0]+'</span></p> ' +
                        '<p style="margin-top: .8rem;"><span style="color: #f81f7b;font-size: .9rem;">￥</span><span class="price alreadySendprice">'+value.content.split('-comment-')[1]+'</span></p> ' +
                        '</div> ' +
                        '</div>' +
                        '</div> ' +
                        '</div> ' +
                        '</div> ' +
                        '</div> ' +
                        '</div>'
                }else if(value.orderType == 'doctor'){
                    html += '<div id="messageDiv" class="message" msgId="'+value.msgId+'"> ' +
                        '<img class="avatar"  valuemobile="'+getQueryString('mobile')+'" onclick="toUserInfo(this)"  valueindex="1" src="img/myLogo.png" /> ' +
                        '<p class="sendTime" style="margin-left: 52px;">'+value.sendDate+'</p>'+
                        '<div class="content"> ' +
                        '<div class="bubble2 bubble_primary2 left2"> ' +
                        ' <div class="sendAlreadyBody"> ' +
                        '<div class="hos_doc_child clearfix" style="position: relative;margin: .1rem 0 .2rem .1rem;" valueid="'+value.advisoryObjId+'" onclick="To.hrefDoctorDetail(this)"> ' +
                        '<div class="doc_child_left" style="width: 70px;overflow: hidden;"><img class="sendBodyImg alreadySendBodyImg"' +
                        'style="max-height: 55px;;border-radius: 5px;overflow: hidden;" src="'+value.firstImg+'"> ' +
                        '</div> ' +
                        '<div class="doc_child_right" style="margin: 0 0 0 0;width: 170px"> ' +
                        '<div class="id">' +
                        '<p class="name" style="font-size: .9rem;"><span class="goodsName alreadySendgoodsName" style="margin-right: .2rem">'+value.content.split('-comment-')[0]+'</span><span class="subject">'+value.content.split('-comment-')[2]+'</span></p> ' +
                        '<p style="margin-top: .8rem;"><span class="price alreadySendprice">'+value.content.split('-comment-')[1]+'</span><span class="level">'+value.content.split('-comment-')[3]+'</span></p> ' +
                        '</div> ' +
                        '</div>' +
                        '</div> ' +
                        '</div> ' +
                        '</div> ' +
                        '</div> ' +
                        '</div>'
                }
            }
        }else{ //医院
            if(value.msgType == 'TEXT'){
                html += '<div id="messageDiv" class="message me" msgId="'+value.msgId+'"> ' +
                    '<img class="avatar" src="img/hosLogo.png" /> ' +
                    '<p class="sendTime">'+value.sendDate+'</p>'+
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
        }
        return html;
    }
}
