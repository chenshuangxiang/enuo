function init() {
    //Get.subject();
    Get.tuiMore();
    Get.tuiMoreHot(257);
    Get.tuiMoreHot(258);
    Get.tuiMoreHot(31);
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
        ajaxGetRetInfo(url, Data, this.tuiMoreHotSuccess, '请求失败', 'GET', true, undefined);
    },
    tuiMoreHotSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            if(retInfo.data && retInfo.data.length > 0){
                Get.addTui(retInfo.data);
            }
        }else{
            alert(retInfo.data)
        }
    },
    addTui:function (retInfo) {  //加入推荐
        $('.hos_doc_child:last-child').css('border-bottom','1px solid #dcdcdc');
        retInfo.forEach(function (value) {
            var html = '';
            if(value.id == 0){
                html += '<div class="hos_doc_child clearfix" specialId=0 onclick="href(this)">' +
                    '<div class="doc_child_left">' +
                    '<img style="max-height: 4.5rem;" src="/app/img/activityImg.jpg">' +
                    '</div>' +
                    '<div class="doc_child_right" style="margin: 0 0 0 0;">' +
                    '<div class="id">' +
                    '<p class="name"><span class="goodsName">无门槛50元充值</span></p>' +
                    '<p class="address">e诺第三方医疗监管平台改版特惠项目</p>' +
                    '<p><span style="color: #f81f7b;font-size: .7rem;">￥</span><span class="price">1.00</span>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                //$('.hos_list').append(html);
                $('.hos_doc_list').append(html);
            }else {
                console.log(value)

                html += '<div class="hos_doc_child clearfix" specialId="' + value.id + '" hospitalName="' + value.hospitalName + '" address="' + value.address + '" otherspecialId="' + value.otherId + '" otherhospitalName="' + value.otherHospitalName + '" otheraddress="' + value.otherAddress + '" onclick="href(this)">' +
                    '<div class="doc_child_left">' +
                    '<img style="max-height: 4.5rem;" src="' + value.headImgUrl + '">' +
                    '</div>' +
                    '<div class="doc_child_right" style="margin: 0 0 0 0;">' +
                    '<div class="id">' +
                    '<p class="name"><span class="goodsName">' + value.name + '</span></p>' +
                    '<p class="address">' + 'e诺第三方医疗监管平台改版特惠项目' + '</p>' +
                    '<p><span style="color: #f81f7b;font-size: .7rem;">￥</span><span class="price">' + value.price + '</span>' +
                    '<span style="margin-top: .3rem;color: #707070;font-size: .8rem;float: right">剩余' + value.quantity + '个</span></p>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                //$('.hos_list').append(html);
                $('.hos_doc_list').append(html);
            }
        })

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
    }else{
        window.location.href = 'special_cp.html?itemId='+ $(obj).attr('specialId');
    }
}

function otherHref() {
    window.location.href = 'special_cp.html?itemId='+ $('input:radio[name="sex"]:checked').parent().attr('specialId');
}