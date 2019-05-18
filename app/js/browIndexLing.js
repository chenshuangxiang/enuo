var speId;
var title = '【福音来了】绣眉领红包！一大波现金红包向你袭来！';
var link = 'https://www.enuo120.com/app/browIndexLing.html';
var imgUrl = 'https://www.enuo120.com/app/img/activityImgBanner.jpg';  //分享的信息
var desc = '分享领现金红包，最高可领88元哦';
function init() {

    getSign();

    //alert('getQueryString()' + getQueryString('code'))
    //alert('getItem(code)' + localStorage.getItem('code'))
    //window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx93fbc4fe8202b82b&redirect_uri=https://www.enuo120.com/app/activity_more.html&response_type=code&scope=snsapi_userinfo&state=1&connect_redirect=1#wechat_redirect"
    alert(getQueryString('code') + '----' + (getQueryString('code') == null));
    alert(window.location.href);
    if(getQueryString('code') == null){
         //window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx93fbc4fe8202b82b&redirect_uri=https://www.enuo120.com/app/activity_more.html&response_type=code&scope=snsapi_userinfo&state=1&connect_redirect=1#wechat_redirect";
        //window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx93fbc4fe8202b82b&redirect_uri=https://www.enuo120.com/app/activity_more.html&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1&uin=MjYxNjMxNDU2MA%3D%3D&key=74fca2553f5ed736a00c944c552b800c707c9c640a9348148aacaf7301467396d17259d6e525fcb2e0abd827a2108a4b&pass_ticket=UCwA6EK2Al3wYxZhQjnTgwXQElFdufL02OFATYE05JOoAvBuIOUZ5qBLjN8F2Sx1L3FGtUF7oMuhiFNQxuZLyg==";
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx93fbc4fe8202b82b&redirect_uri=https://www.enuo120.com/app/browIndexLing.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
    }

    /*if(localStorage.getItem('shareMoney') == 1){
        Get.share();
    }*/
    //Get.subject();
    //Get.tuiMore();
    //Get.tuiMoreHot(31);
    //Get.tuiMoreHot(257);
    //Get.tuiMoreHot(258);
    //Get.tuiMoreHot(246);
    //Get.tuiMoreHot(huliCardId);
    //Get.tuiMoreHot(245);


    $('.mubu,.closeopen').click(function () {
        $('.modelOpen').hide();
    });
  /*  $(window).scroll(function(){
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if(scrollTop + windowHeight - scrollHeight == 0 ){
            console.log("you are in the bottom");
            if(total > $('.hos_doc_child').length){
                Get.tuiMore();
            }
        }
    });*/
}
//获取一级科室
var Get = {
    tuiMore:function () {  //加入活动接口
        var url = SERVER_ADDR + '/app/activity/getProductList.json';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.tuiMoreSuccess, '请求失败', 'GET', true, undefined);
    },
    tuiMoreSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            if(retInfo.data && retInfo.data.length > 0){
                Get.addTui(retInfo.data);
            }
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
    },
    share: function () {
        //alert('分享成功goShare开始');
        var code;
        //localStorage.removeItem('shareMoney');
        if(getQueryString('code') != null){
            code = getQueryString('code');
        }else{
            //localStorage.setItem('shareMoney',1);
            //window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx93fbc4fe8202b82b&redirect_uri=https://www.enuo120.com/app/activity_more.html&response_type=code&scope=snsapi_userinfo&state=1&connect_redirect=1#wechat_redirect";
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx93fbc4fe8202b82b&redirect_uri=https://www.enuo120.com/app/browIndexLing.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
        }
        var url = SERVER_ADDR + '/app/activity/sendRedpack'; //获取分享成功后调取
        var Data = {};
        Data.code = code;
        //alert('code传过去-------' + code);
        ajaxGetRetInfo(url, Data, this.shareSuccess, '请求失败', 'POST', true, undefined);
    },
    shareSuccess: function (retInfo) {
        console.log(retInfo)
        //alert('11')
        alert(retInfo.data);
        //alert('code传过去的返回信息-------'+retInfo.data);
        /*if (retInfo.success == true) {
            //window.location.href = 'pay/order_pay.html?payId='+retInfo.data;
        }*/
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
function callback() {
    //alert('分享成功goShare');
    Get.share();
}