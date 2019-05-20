var intime;
var index = 0;
var hosId;
$(document).ready(function () {
    $('title,.head_title').text(getQueryString('name'));
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
        var url = SERVER_ADDR + '/app/user/cur_chat_msg/patient/commit';
        var Data = {};
        Data.chatMainBodyId = $('div[id=messageDiv]:last').attr('bodyid') || getQueryString('id');
        Data.version = $('div[id=messageDiv]:last').attr('version') || getQueryString('version');
        Data.msg = $('#editArea').val();
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
        var url = SERVER_ADDR + '/chat/main/body/chatHistory';
        var Data = {};
        Data.pageNumber = 1;
        Data.pageSize = 50;
        Data.chatMainBodyId = getQueryString('id');
        ajaxGetRetInfo(url,Data,this.sublaterNewsSuccess,'请求失败', 'GET', undefined, undefined);
    },
    sublaterNewsSuccess:function (retInfo) {
        if(retInfo.success == true){
            console.log(retInfo)
            hosId = retInfo.data.id;
            Get.addDetailList(retInfo.data);
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
        var url = SERVER_ADDR + '/app/user/chat/main/body/chatHistory/pullNew';
        var Data = {};
        Data.orderSn = $('div[id=messageDiv]:last').attr('orderSn') || 0;
        Data.chatMainBodyId = $('div[id=messageDiv]:last').attr('bodyid') || getQueryString('id');
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
                '<pre>您好，我是您的健康助理，请问有什么可以帮您！</pre>' +
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
        var html = '';
        if(value.roleName == '健管师'){  //医院
                html += '<div id="messageDiv" class="message" bodyid="'+value.chatMainBodyId+'" version="'+value.chatMainBodyVersion+'" orderSn="'+value.orderSn+'">' +
                    '<img class="avatar" src="img/hosLogo.png" onclick="To.hos()"/>' +
                    '<p class="getTime">'+new Date(value.sendDatetime).Format('yyyy-MM-dd hh:mm:ss')+'</p>'+
                    '<div class="chatcontent">' +
                    /*'<div class="nickname">医院<span class="time">10:12:20</span></div>' +*/
                    '<div class="bubble bubble_default left">' +
                    '<div class="bubble_cont">' +
                    '<div class="plain">' +
                    '<pre>'+value.msg+'</pre>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
        }else{ //用户
                html += '<div id="messageDiv" class="message me" bodyid="'+value.chatMainBodyId+'" version="'+value.chatMainBodyVersion+'" orderSn="'+value.orderSn+'"> ' +
                    '<img class="avatar" src="img/myLogo.png" /> ' +
                    '<p class="sendTime">'+new Date(value.sendDatetime).Format('yyyy-MM-dd hh:mm:ss')+'</p>'+
                    '<div class="chatcontent"> ' +
                    /* '<div class="nickname"><span class="time">10:10:08</span></div> ' +*/
                    '<div class="bubble bubble_primary right"> ' +
                    '<div class="bubble_cont"> ' +
                    '<div class="plain"> ' +
                    '<pre>'+value.msg+'</pre> ' +
                    '</div> ' +
                    '</div> ' +
                    '</div> ' +
                    '</div> ' +
                    '</div>'

        }
        return html;
    }
   /* sendBtn:function (pageNumber, keyword, type) {  //发送宝贝
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
    }*/
}
