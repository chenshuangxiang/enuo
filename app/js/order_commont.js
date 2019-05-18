
function init() {
    $('.name').text(getQueryString('payName'));
    $('.orderzongPrice').text(getQueryString('payAmount'));
    $(".xiaoguo span").click(function(){
        var _idx = $(this).index();
        $(".xiaoguo span:lt("+_idx+1+")").addClass("current");
        $(".xiaoguo span:gt("+_idx+")").removeClass("current");
    });
    $(".huanjin span").click(function(){
        var _idx = $(this).index();
        $(".huanjin span:lt("+_idx+1+")").addClass("current");
        $(".huanjin span:gt("+_idx+")").removeClass("current");
    });
    $(".fuwu span").click(function(){
        var _idx = $(this).index();
        $(".fuwu span:lt("+_idx+1+")").addClass("current");
        $(".fuwu span:gt("+_idx+")").removeClass("current");
    });
    $('#file').on('change', function() {
        var files = this.files;
        sub(files[0])
    })
}
function sub(file) {
    var formData = new FormData();
    formData.append("file", file);
    console.log(file)
    if(file == undefined){
        return
    }
    $.ajax({
        url: SERVER_ADDR + "/common/file/upload",
        type: "POST",
        data: formData,
        dataType : 'json',
        cache: false,
        processData: false,
        contentType: false,
        success: function(data) {
            console.log(data)
            if (data.success == true) {
                $('.addPhontBtn').before('<p class="postImgP"><img class="closePhoto" onclick="To.closephoto(this)" src="/app/img/closePhoto.png"><img class="postImg" src="'+data.data+'"></p>')
                $('input[type="file"]').val('');
            } else {
                alert(data.data)
            }
        }
    });
}
var To = {
    /*getImg:function (obj) {
        var files = this.files;
        var formData = new FormData();
        formData.append("file", files[0]);
        var url = SERVER_ADDR + '/common/file/upload';

        ajaxGetRetInfo(url,formData,this.getImgSuccess,'请求失败', 'POST', undefined, undefined);
    },
    getImgSuccess:function (retInfo) {
        console.log(retInfo)
        retInfo.data.forEach(function (value) {
            console.log(value)
            $('.inputImg').append('<img src="'+value.src+'">')
        })
    },*/
    closephoto:function (obj) {
        $(obj).parent().remove();
    },
    commont:function () {
        if ($('textarea').val() == '') {
            alert('请输入评价文字');
            return
        }
        if ($('.xiaoguo .current').length == 0) {
            alert('请输入治疗效果');
            return
        }
        if ($('.huanjin .current').length == 0) {
            alert('请输入就医环境');
            return
        }
        if ($('.fuwu .current').length == 0) {
            alert('请输入服务态度');
            return
        }
            var url = SERVER_ADDR + '/app/user/order/evaluation';
            var Data = {};
            Data.orderId = getQueryString('itemId');
            Data.content = $('textarea').val();
            Data.waitingTime = $('input[name="sex"]:checked').val();
            Data.effectScore = $('.xiaoguo .current').length;
            Data.environmentScore = $('.huanjin .current').length;
            Data.serviceScore =$('.fuwu .current').length;
            $('.postImg').each(function (index,value) {
                var src = value.src;
                console.log(src)
                Data['images[' + index + ']'] = src
            })
            ajaxGetRetInfo(url, Data, this.commontSuccess, '请求失败', 'POST', true, undefined);
    },
    commontSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            alert('评价成功')
            window.location.href = 'order.html';
        }else{
            alert(retInfo.data)
        }
    }
}