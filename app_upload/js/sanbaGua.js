var speId;
var title = '38元皮秒祛斑还不够，还想送你100万！';
var link = 'https://www.enuo120.com/app/sanbaIndex.html';
var imgUrl = 'https://www.enuo120.com/app/img/sanbaShare.jpg';  //分享的信息
var desc = '在属于你的节日，除了让你更美 ，我不知道该怎么宠你~~~';
function init() {
    getSign();
  //这个适用手机端，等图片加载完再显示，因为有可能会出现第一次加载图片没有加载完就不会出现canvas
    Get.toHaveGetPhoto();
  /*  var ids = [23,77,248,79,256,94,249,64];
    for(var i = 0; i < ids.length;i++){
        Get.tuiMoreHot(ids[i]);
    }*/
}
function showResetButton(){
    //触发请求擦完的接口
    Get.chouMore();
    //$('.show,.main_box,.mask').fadeIn(300);
    //$(".show,.main_box .mask").fadeIn(300)
}
//获取一级科室
var Get = {
    toHaveGetPhoto:function () {
        var url = SERVER_ADDR + '/app/user/cardCoupon/specialProduct/useState';
        var Data = {};
        Data.specialProductId = sanbaProduct;
        ajaxGetRetInfo(url, Data, this.toHaveGetPhotoSuccess, '请求失败', 'GET', true, undefined);
    },
    toHaveGetPhotoSuccess: function (res) {
        if (res.success == true) {
            // window.location.reload();
            if(res.purchased == false){ //没买过

            }else{ //买过
                if(res.data.activityInfo[0].hasBeenLuckyDraw == false){ //没抽过
                    $('#redux').eraser( {
                        size: 20,   //设置橡皮擦大小
                        completeRatio: .1, //设置擦除面积比例
                        completeFunction: showResetButton   //大于擦除面积比例触发函数
                    });
                    setTimeout(function () {
                        $('#mask_img_bg').show();
                    },300)
                }else{ //抽过了
                    $('#redux').remove();
                    $('#mask_img_bg').show();
                }

            }
        } else {
            alert(res.data);
        }
    },
    chouMore:function () {  //加入刮刮卡接口
        var url = SERVER_ADDR + '/app/user/activity/luckyWeel';
        var Data = {};
        Data.specialProductId = sanbaProduct;
        Data.activityId = 7;
        ajaxGetRetInfo(url, Data, this.chouMoreSuccess, '请求失败', 'POST', true, undefined);
    },
    chouMoreSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){

        }else{
            alert(retInfo.data)
        }
    },
    tuiMoreHot:function (id) {  //加入活动接口
        var url = SERVER_ADDR + '/app/specialProduct/getDetail.json';
        var Data = {};
        Data.id = id;
        speId = id;
        ajaxGetRetInfo(url, Data, this.tuiMoreHotSuccess, '请求失败', 'GET', true, undefined);
    },
    tuiMoreHotSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            //if(retInfo.data && retInfo.data.length > 0){
                Get.addTui(retInfo.data);
            //}
        }else{
            alert(retInfo.data)
        }
    },
    addTui:function (retInfo) {  //加入推荐
        $('.hos_doc_child:last-child').css('border-bottom','1px solid #dcdcdc');
            var html = '';
            var value = retInfo;
                console.log(value)
                html += '<div class="hos_doc_child clearfix" specialId="' + speId + '" hospitalName="' + value.hospitalName + '" address="' + value.address + '" otherspecialId="' + value.otherId + '" otherhospitalName="' + value.otherHospitalName + '" otheraddress="' + value.otherAddress + '" onclick="href(this)">' +
                    '<div class="doc_child_left">' +
                    '<img style="max-height: 4.5rem;" src="' + value.headImgUrl + '">' +
                    '</div>' +
                    '<div class="doc_child_right" style="margin: 0 0 0 0;">' +
                    '<div class="id">' +
                    '<p class="name"><span class="goodsName">' + value.name + '</span></p>' +
                    '<p class="address">' + 'e诺第三方医疗监管平台特惠项目' + '</p>' +
                    '<p><span style="color: #f81f7b;font-size: .7rem;">￥</span><span class="price">' + value.price + '</span>' +
                   /* '<span style="margin-top: .3rem;color: #707070;font-size: .8rem;float: right">剩余' + value.quantity + '个</span></p>' +*/
                    '</div>' +
                    '</div>' +
                    '</div>';
                //$('.hos_list').append(html);
                $('.hos_doc_list').append(html);


        $('.hos_doc_child:last-child').css('border-bottom','0');
    }
}
function href(obj) {
    console.log($(obj).attr('specialId'))
    if($(obj).attr('specialId') == 0){
        window.location.href = 'pay/activity_cp.html?itemId='+ $(obj).attr('specialId');
    }else if($(obj).attr('specialId') == 46){
       /* $('.modelOpen').show();
        $('.hosDiv,.sureTejia').remove();
        $('.modelOpenback').append('<div class="hosDiv" specialId="' + $(obj).attr('specialId') + '">' +
            '<input class="sex nan" type="radio" name="sex" checked="">' +
            '<span class="sexname">'+$(obj).attr('hospitalName')+'</span><br>' +
            '<span class="sexAddress">'+$(obj).attr('address')+'</span>' +
            '</div>' +
            '<div class="hosDiv" specialId="' + $(obj).attr('otherspecialId') + '">'+
            '<input class="sex nan" type="radio" name="sex">' +
            '<span class="sexname">'+$(obj).attr('otherhospitalName')+'</span><br>' +
            '<span class="sexAddress">'+$(obj).attr('otheraddress')+'</span>' +
            '</div><button class="sureTejia" onclick="otherHref()">确定</button>')
        $('.hosDiv').click(function () {
            $(this).children('input').prop('checked',true)
        });*/
        window.location.href = 'special_cp.html?itemId='+ $(obj).attr('otherspecialid');
    }else if($(obj).attr('specialId') == huliCardId){
        window.location.href = 'activityHuLiCard.html?itemId='+ $(obj).attr('specialId');
    }else{
        window.location.href = 'special_cp.html?itemId='+ $(obj).attr('specialId');
    }
}

function otherHref() {
    window.location.href = 'special_cp.html?itemId='+ $('input:radio[name="sex"]:checked').parent().attr('specialId');
}