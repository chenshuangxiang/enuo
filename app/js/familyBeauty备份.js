
var title = '【征集令】晒幸福美照 美丽全家卡领回家！';
var link = 'https://www.enuo120.com/app/familyBeautyIndex.html';
var imgUrl = 'https://www.enuo120.com/app/img/familyBeautyIndexShare.jpg';  //分享的信息
var desc = '上传和家人的合影即可领取美丽全家卡~~分享更有红包领哦~~';
var resetId;
function  init() {
    getSign();
    Get.toHaveGetPhoto();
    $('#file').on('change', function() {
        var files = this.files;
        sub(files[0])
    })
    $('#file3').on('change', function() {
        var files = this.files;
        sub3(files[0])
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
                //$('#file').remove();
                $('.appendBefore').remove()
                $('#gallery').empty().append('<img class="postImg" src="'+data.data+'"/>')
                if(is_weixn()){
                    funcReadImgInfo($('#gallery img'));
                }else{
                    $('#gallery img').fsgallery();
                }
                //$('.addPhontBtn').before('<p class="postImgP"><img class="closePhoto" onclick="To.closephoto(this)" src="/app/img/closePhoto.png"><img class="postImg" src="'+data.data+'"></p>')
                //$('input[type="file"]').val('');
            } else {
                alert(data.data)
            }
        }
    });
}
function sub3(file) { //重新上传
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
                //$('#file').remove();
                $('.appendBefore').remove()
                $('#gallery').empty().append('<img class="postImg" src="'+data.data+'"/>')
                if(is_weixn()){
                    funcReadImgInfo($('#gallery img'));
                }else{
                    $('#gallery img').fsgallery();
                }
                $('#file3').hide();
                $('.addPhontBtnReset').attr('onclick','Get.toPostPhoto("'+resetId+'")');
                $('.resetPostPhoto').text('点击上传');
                $('.statusImg').attr('src','').hide();
                //$('.addPhontBtn').before('<p class="postImgP"><img class="closePhoto" onclick="To.closephoto(this)" src="/app/img/closePhoto.png"><img class="postImg" src="'+data.data+'"></p>')
                //$('input[type="file"]').val('');
            } else {
                alert(data.data)
            }
        }
    });
}
function funcReadImgInfo(imgObj){
    var imgs = [];
    for(var i=0; i<imgObj.length; i++){
        imgs.push(imgObj.eq(i).attr('src'));
        imgObj.eq(i).click(function(){
            var nowImgurl = $(this).attr('src');
            WeixinJSBridge.invoke("imagePreview",{
                "urls":imgs,
                "current":nowImgurl
            });
        });
    }
}

var Get = {
    toInfo:function () {
        var url = SERVER_ADDR + '/app/user/myInfo';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.infoSuccess, '请求失败', 'GET', true, undefined);
    },
    infoSuccess: function (res) {
        if (res.success == true) {
            localStorage.removeItem('scrathCode');
            window.location.href = 'user_center.html?warn=' + $('.toYuyue').attr('warnZi');
        } else {
            alert(res.data);
        }
    },
    //上传照片
    toPostPhoto:function (id) {
        if($('#gallery img').length == 0){
           alert('请添加您要上传的图片');
           return
        }
        var url = SERVER_ADDR + '/app/user/familyBeautyCouponRequest/commit';
        var Data = {};
        Data.id = id;
        Data.familyImgUrl = $('#gallery img').attr('src');
        ajaxGetRetInfo(url, Data, this.toPostPhotoSuccess, '请求失败', 'POST', true, undefined);
    },
    toPostPhotoSuccess: function (res) {
        if (res.success == true) {
            $('.msg').fadeIn();
            setTimeout(function () {$('.msg').fadeOut();window.location.reload();},2500);
        } else {
            alert(res.data);
        }
    },
    //获取用户是否提交过请求
    toHaveGetPhoto:function () {
        var url = SERVER_ADDR + '/app/user/familyBeautyCouponRequest/exists';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.toHaveGetPhotoSuccess, '请求失败', 'GET', true, undefined);
    },
    toHaveGetPhotoSuccess: function (res) {
        if (res.success == true) {
            if(res.data == true){
                Get.toGetPhoto();
            }
            // window.location.reload();
        } else {
            alert(res.data);
        }
    },
    //获取用户提交过的照片
    toGetPhoto:function () {
        var url = SERVER_ADDR + '/app/user/familyBeautyCouponRequest/byLoginUser';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.toGetPhotoSuccess, '请求失败', 'GET', true, undefined);
    },
    toGetPhotoSuccess: function (res) {
        if (res.success == true) {
           // window.location.reload();
            $('.appendBefore').remove()
            $('#gallery').append('<img class="postImg" src="'+res.data.familyImgUrl+'"/>')
            if(is_weixn()){
                funcReadImgInfo($('#gallery img'));
            }else{
                $('#gallery img').fsgallery();
            }
            if(res.data.state == 'wait'){ //审核中
                $('.addPhontBtnReset').hide();
                $('.statusImg').attr('src','img/familyBeautyStatusWait.png').show();
            }else if(res.data.state == 'agree'){  //已通过
                $('.hrefFamilyBeautyCard').css('display','inline-block');
                $('.addPhontBtnReset').text('查看卡片').attr('onclick','window.location.href = "familyBeautyProduct.html?userCardCouponId='+res.data.userCardCouponId+'"');
                $('.statusImg').attr('src','img/familyBeautyStatusAgree.png').show();
                $('.cardwhiteZi').show();
            }else if(res.data.state == 'reject'){ //驳回
                $('#file3').show();
                $('.addPhontBtnReset').attr('onclick','');
                $('.resetPostPhoto').text('重新上传');
                $('.statusImg').attr('src','img/familyBeautyStatusReject.png').show();
                resetId = res.data.id;
            }
        } else {
            alert(res.data);
        }
    }
}
