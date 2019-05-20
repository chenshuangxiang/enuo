var intime;
var index = 0;
var hosId;
$(document).ready(function () {
    $('body').height($('body')[0].clientHeight);
    if(getQueryString('type') == 'product'){
        $('.readySendBodyImg').attr('src',getQueryString('productImg')); //头像
        $('.readySgoodsName').text(getQueryString('productName')); //名字
        $('.readySprice').text(getQueryString('productPrice')); //价格
    }else if(getQueryString('type') == 'doctor'){
        $('.readySprice').prev('span').remove();
        $('.readySendBodyImg').attr('src',getQueryString('productImg')); //头像
        $('.readySgoodsName').text(getQueryString('hospitalName')); //名字
        $('.readySprice').text(getQueryString('productName')); //
        $('.readySgoodsName').css('margin-right','.2rem').after('<span class="subject">'+getQueryString('doctorSubject')+'</span>');
        $('.readySprice').css('margin-right','.5rem').after('<span class="level">'+getQueryString('docotrType')+'</span>');
    }
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
    },
    hos:function (obj) {
        window.location.href = 'hos_index.html?hosId=' + hosId;
    },
    hrefProductDetail:function (obj) {
        if($(obj).attr('ispreferential') == 'true'){
            window.location.href = 'special_cp.html?itemId=' + $(obj).attr('valueid');
        }else{
            window.location.href = 'cp.html?cpId=' + $(obj).attr('valueid');
        }

    },
    hrefDoctorDetail:function (obj) {
        window.location.href = 'dos_index.html?docId=' + $(obj).attr('valueid');
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
        var url = SERVER_ADDR + '/app/user/message/getNewMessage.json';
        var Data = {};
        Data.employeeId = getQueryString('hosId');
        Data.lastReplyId = $('div[id=messageDiv]:last').attr('msgid') || 0;
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
                $('#messageList').prepend(Get.setHtml(value))
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
        //加入发送宝贝提示框
        setTimeout(function () {
            if(getQueryString('type') != null){
                $('#messageList').append($('.sendBody').show());
            }
            $('#messageList').append('<div class="message">' +
                '<img class="avatar" src="img/hosLogo.png" onclick="To.hos()"/>' +
                '<p class="getTime"></p>' +
                '<div class="chatcontent" style="margin-top: 1.3rem;">' +
                '<div class="bubble bubble_default left">' +
                '<div class="bubble_cont">' +
                '<div class="plain">' +
                '<pre>您好，我是e诺-第三方医疗监管平台的小诺，为您专门负责医疗监管、医疗投诉、医疗咨询与活动咨询 ，请问有什么可以帮您！</pre>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>')
        },100);
    },
    addList:function (retInfo) {
        retInfo.forEach(function (value) {
            /*  console.log(value);*/
            $('#messageList').append(Get.setHtml(value))
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

    },
    setHtml:function (value) {
        /*var html = '';
        if(value.isMe == false){  //医院
            html += '<div class="message" msgId="'+value.msgId+'">' +
                '<img class="avatar" src="img/hosLogo.png" onclick="To.hos()"/>' +
                '<p class="getTime">'+value.sendDate+'</p>'+
                '<div class="chatcontent">' +
                /!*'<div class="nickname">医院<span class="time">10:12:20</span></div>' +*!/
                '<div class="bubble bubble_default left">' +
                '<div class="bubble_cont">' +
                '<div class="plain">' +
                '<pre>'+value.content+'</pre>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>'
        }else{ //用户
            html += '<div class="message me" msgId="'+value.msgId+'"> ' +
                '<img class="avatar" src="img/myLogo.png" /> ' +
                '<p class="sendTime">'+value.sendDate+'</p>'+
                '<div class="chatcontent"> ' +
                /!* '<div class="nickname"><span class="time">10:10:08</span></div> ' +*!/
                '<div class="bubble bubble_primary right"> ' +
                '<div class="bubble_cont"> ' +
                '<div class="plain"> ' +
                '<pre>'+value.content+'</pre> ' +
                '</div> ' +
                '</div> ' +
                '</div> ' +
                '</div> ' +
                '</div>'
        }*/
        var html = '';
        if(value.isMe == false){  //医院
            if(value.msgType == 'TEXT'){
                html += '<div id="messageDiv" class="message" msgId="'+value.msgId+'">' +
                    '<img class="avatar" src="img/hosLogo.png" onclick="To.hos()"/>' +
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
            }
        }else{ //用户
            if(value.msgType == 'TEXT'){
                html += '<div id="messageDiv" class="message me" msgId="'+value.msgId+'"> ' +
                    '<img class="avatar" src="img/myLogo.png" /> ' +
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
            }else if(value.msgType == 'IMG_TEXT'){
                if(value.orderType == 'product'){
                    html += '<div id="messageDiv" class="message me" msgId="'+value.msgId+'"> ' +
                        '<img class="avatar" src="img/myLogo.png" /> ' +
                        '<p class="sendTime">'+value.sendDate+'</p>'+
                        '<div class="chatcontent"> ' +
                        '<div class="bubble2 bubble_primary2 right2"> ' +
                        ' <div class="sendAlreadyBody"> ' +
                        '<div class="hos_doc_child clearfix" style="position: relative;margin: .1rem 0 .2rem .1rem;" valueid="'+value.advisoryObjId+'" ispreferential="'+value.preferential+'" onclick="To.hrefProductDetail(this)"> ' +
                        '<div class="doc_child_left" style="width: 26%;overflow: hidden;margin-right: 5%;"><img class="sendBodyImg alreadySendBodyImg"' +
                        'style="max-height: 3.5rem;;border-radius: 5px;overflow: hidden;" src="'+value.firstImg+'"> ' +
                        '</div> ' +
                        '<div class="doc_child_right" style="margin: 0 0 0 0;width: 65%"> ' +
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
                    html += '<div id="messageDiv" class="message me" msgId="'+value.msgId+'"> ' +
                        '<img class="avatar" src="img/myLogo.png" /> ' +
                        '<p class="sendTime">'+value.sendDate+'</p>'+
                        '<div class="chatcontent"> ' +
                        '<div class="bubble2 bubble_primary2 right2"> ' +
                        ' <div class="sendAlreadyBody"> ' +
                        '<div class="hos_doc_child clearfix" style="position: relative;margin: .1rem 0 .2rem .1rem;" valueid="'+value.advisoryObjId+'" onclick="To.hrefDoctorDetail(this)"> ' +
                        '<div class="doc_child_left" style="width: 26%;overflow: hidden;margin-right: 5%;"><img class="sendBodyImg alreadySendBodyImg"' +
                        'style="max-height: 3.5rem;;border-radius: 5px;overflow: hidden;" src="'+value.firstImg+'"> ' +
                        '</div> ' +
                        '<div class="doc_child_right" style="margin: 0 0 0 0;width: 65%"> ' +
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
        }
        return html;
    },
    sendBtn:function (pageNumber, keyword, type) {  //发送宝贝
        var url = SERVER_ADDR + '/app/user/message/sendAdvisoryObjMessage';
        var Data = {};
        Data.objId = getQueryString('productId');
        Data.type = getQueryString('type');
        Data.existsDetailPage = true;//图文是否需要跳转页面
        Data.employeeId = getQueryString('hosId');
        ajaxGetRetInfo(url,Data,this.sendBtnSuccess,'请求失败', 'POST', undefined, undefined);
    },
    sendBtnSuccess:function (retInfo) {
        if(retInfo.success == true){
            console.log(retInfo)
            $('#messageList .sendBody').remove();
            //$('title,.head_title').text(retInfo.data.name);
            //hosId = retInfo.data.id;
            //Get.addDetailList(retInfo.data.message);
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
    }
}
