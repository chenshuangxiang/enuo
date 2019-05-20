var chika;
var huliCardId;
var myId;
var orderId;
var peopleCount;

var title = '38元皮秒祛斑还不够，还想送你100万！';
var link = 'https://www.enuo120.com/app/sanbaIndex.html';
var imgUrl = 'https://www.enuo120.com/app/img/sanbaShare.jpg';  //分享的信息
var desc = '在属于你的节日，除了让你更美 ，我不知道该怎么宠你~~~';

function init() {
    getSign();
    Get.jiangDetail();
   // Get.tuiMore();
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
    $('.levelClick').click(function () {
        $('.levelClick').removeClass('borderActive').addClass('border');
        $(this).addClass('borderActive');
        myId = $(this).attr('valueid');
    });
    /*$('.paybackclose').click(function () {
       $('.paybackOpen').hide();
    });*/
    $('.add').click(function () {
        if(peopleCount >= 5){
            alert('添加人数已满');
        }else{
            window.location.href = 'add_huliuser.html?addcount='+ (5 - peopleCount);
        }
    });
}
//获取医美整形功能
var Get = {
    jiangDetail:function () {  //活动奖品
        var url = SERVER_ADDR + '/app/user/cardCoupon/one';
        var Data = {};
        Data.id = getQueryString('userCardCouponId');
        ajaxGetRetInfo(url, Data, this.jiangDetailSuccess, '请求失败', 'GET', true, undefined);
    },
    jiangDetailSuccess:function (retInfo) {
        if(retInfo.success == true){
            if(retInfo.data.cardCouponJson.hospitals.length > 0){
                var html = '';
                retInfo.data.cardCouponJson.hospitals.forEach(function (value) {
                    value.products.forEach(function (valueProduct) {

                       /*if(retInfo.data.cardCouponProductJson){
                           if(retInfo.data.cardCouponProductJson.productName == valueProduct.productName){
                               html += '<div class="hos_doc_child clearfix" style="position: relative;padding: 1rem 2% 1rem 3.5%;">' ;
                              // html +='<img style="position: absolute;right: .6rem;width: 4.8rem;top: .7rem;" src="img/rotor/jianglingIcon.png">' ;
                               if(retInfo.data.activityInfo[0].hasBeenLuckyDraw == false){
                                   html += '<button class="huiImg xiyaBtn" onclick="window.location.href='+"'/app/sanbaGua.html'"+'" style="top: .4rem;">去抽奖</button>' ;
                               }
                               html += '<button class="huiImg xiyaBtn" style="background-color: #ccc">已预约</button>' ;
                           }else{
                               html += '<div class="hos_doc_child clearfix" style="position: relative;background-color: #f2f2f2;">' ;
                               html += '<button class="huiImg xiyaBtn" style="background-color: #ccc">已预约</button>' ;
                               html += '<button class="huiImg xiyaBtn" style="background-color: #ccc">已预约</button>' ;
                           }
                        }else{
                           html += '<div class="hos_doc_child clearfix" style="position: relative;">' ;
                           html += '<button class="huiImg xiyaBtn" style="background-color: #ccc">已预约</button>' ;
                           html += '<button class="huiImg xiyaBtn" valueid="'+retInfo.data.id+'" valueProductid="'+valueProduct.id+'" valueHospitalIds="'+valueProduct.hospitalIds[0]+'" onclick="Get.lingOpen(this)">领取</button>';
                       }*/
                        html += '<div class="hos_doc_child clearfix" style="position: relative;">' ;
                        // html +='<img style="position: absolute;right: .6rem;width: 4.8rem;top: .7rem;" src="img/rotor/jianglingIcon.png">' ;
                        if(retInfo.data.activityInfo[0].hasBeenLuckyDraw == false){
                            html += '<button class="huiImg xiyaBtn" onclick="window.location.href='+"'/app/sanbaGua.html'"+'" style="top: .4rem;">去抽奖</button>' ;
                        }
                        if(retInfo.data.cardCouponProductUseRecordJsons[0].orderRecordJsons[0].booked == false){
                            html += '<button class="huiImg xiyaBtn" onclick="Get.Yuyue(this)" orderid="'+retInfo.data.cardCouponProductUseRecordJsons[0].orderRecordJsons[0].enuoOrderJson.id+'">预约</button>' ;
                        }else{
                            html += '<button class="huiImg xiyaBtn" onclick="window.location.href = '+"'/app/my_yuyue.html'"+'" style="background-color: #ccc">已预约</button>' ;
                        }

                    //html += '<div class="hos_doc_child clearfix" style="position: relative">' ;
                    /*if(valueProduct.remainSize > 0){*/

                    /*}else{
                        html += '<button class="huiImg xiyaBtn" style="background-color: #ccc">已领完</button>';
                    }*/

                    html +='<div class="doc_child_left">' +
                        '<img style="max-height: 4rem;;border-radius: 5px;overflow: hidden;" src="'+valueProduct.productImg+'">' +
                        '</div>' +
                        '<div class="doc_child_right" style="margin: 0 0 0 0;">' +
                        '<div class="id" style="margin-left: 3%;">';
                        html += '<p class="name" style="font-size: 1.02rem;color: #333333;margin-top: .5rem">'+valueProduct.productName+'' ;


                        html += '<p style="color: #fb952c;margin-top: .5rem;font-size: .7rem;">'+valueProduct.hospitalNames[0]+'</p>' ;

                    /*if(value.hasBeenGiveUseEffectiveDate){
                        html += "<p style='color: #666;margin-top: .5rem;font-size: .7rem;'>失效时间："+valueProduct.hasBeenGiveUseEffectiveDate+"</p>" ;
                    }*/
                    html +='</p>' +
                        /* '<p class="name" style="font-size: .7rem;color: #777;">限2018.11.9-2018.11.12领取有效</p>' +*/
                        '</div>' +
                        '</div>' +
                        '</div>';
                });
                })

                $('.hos_doc_list').append(html);
            }else{
                $('.hos_doc_list').append('<div class="mescroll-empty"><img class="empty-icon" src="option/mescroll-empty.png"><p class="empty-tip">亲,暂无奖品~</p></div>');
            }
        }else{
            alert(retInfo.data);
        }
    },
    getJiang:function (id) {  //领奖
        var url = SERVER_ADDR + '/app/user/cardCoupon/useProduct';
        var Data = {};
        Data.id = $('.lingJiangBtn').attr('valueid');
        Data.productId = $('.lingJiangBtn').attr('valueProductid');
        Data.hospitalId = $('.lingJiangBtn').attr('valueHospitalIds');
        ajaxGetRetInfo(url, Data, this.getJiangSuccess, '请求失败', 'POST', true, undefined);
    },
    getJiangSuccess:function (retInfo) {
        if(retInfo.success == true){
            $('.msg').fadeIn();
            setTimeout(function () {$('.msg').fadeOut();window.location.href = '/my_experience.html'},1000);
        }else{
            alert(retInfo.data);
        }
    },
    getJiangClick:function (obj) {
            //领取接口
            Get.getJiang();

    },
    lingOpen:function(obj){
        $('.modelOpen').show();
        $('.lingJiangBtn').attr('valueid',$(obj).attr('valueid')).attr('valueProductid',$(obj).attr('valueProductid')).attr('valueHospitalIds',$(obj).attr('valueHospitalIds'));
    },
    Yuyue:function (obj) {
        if(compareDate()) {  //已经到时间了
            window.location.href = 'pay/dos_yuyue.html?docId=' + $(obj).attr('orderid')+ '&type=product';
        }else{
            alert('本券的使用时间为2019年3月9日-2019年3月31日');
        }
    }
}
function hrefOrder(obj) {
    window.location.href = 'order.html';
}
var Show = {
    func:function () {
        $('.ks_list').slideToggle();
        var statusZi = $('.shouqi .font_green');
        if(statusZi.text() == '收起'){
            statusZi.text('展开');
            $('.shouqi img').css('transform','rotate(0deg)');
        }else{
            statusZi.text('收起');
            $('.shouqi img').css('transform','rotate(180deg)');
        }
    },
    showOen:function () {
        $('.activityFuDetailZhi').fadeIn();
        $('.activityFuDetailZhi').fadeOut();
        $('.activityFuDetailZhi').fadeIn()
    }
}
function callback() {
    localStorage.setItem('shareRotorNineBeforeOpen','1');
    $('.shareRotorNineBeforeOpen').hide();
}