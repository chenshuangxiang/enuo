var chika;
var huliCardId;
var myId;
var orderId;
var peopleCount;

var title = '新年大礼包 美丽带回家';
var link = 'https://www.enuo120.com/app/rotorNine.html';
var imgUrl = 'https://www.enuo120.com/app/img/rotor/rotorNineShare.png';  //分享的信息
var desc = '国内往返机票、硅胶假体隆鼻、额头自体脂肪填充、眼综合、瘦脸针……只要9.9元，超值大奖，等你来开！';

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
        var url = SERVER_ADDR + '/app/user/activity/pickOut/details';
        var Data = {};
        Data.activityId = 5;
        ajaxGetRetInfo(url, Data, this.jiangDetailSuccess, '请求失败', 'GET', true, undefined);
    },
    jiangDetailSuccess:function (retInfo) {
        if(retInfo.success == true){
            if(retInfo.data.pickOutActivityPrizes.length > 0){
                var html = '';
                retInfo.data.pickOutActivityPrizes.forEach(function (value) {
                    if(retInfo.data.hasBeenGiveIds.length != 0){
                        if(value.state == '未领取'){
                            html += '<div class="hos_doc_child clearfix" style="position: relative;background-color: #f2f2f2;">' ;
                            html += '<button class="huiImg xiyaBtn" style="background-color: #ccc">领取</button>' ;
                        }else if(value.state == '已领取'){
                            html += '<div class="hos_doc_child clearfix" style="position: relative;" onclick="hrefOrder(this)">' ;
                           /* html += '<button class="huiImg xiyaBtn" style="background-color: #ccc">已领取</button>'+*/
                            html +='<img style="position: absolute;right: .6rem;width: 4.8rem;top: .7rem;" src="img/rotor/jianglingIcon.png">' ;
                        }
                    }else{
                        html += '<div class="hos_doc_child clearfix" style="position: relative">' ;
                        if(value.remainSize > 0){
                            html += '<button class="huiImg xiyaBtn" valueid="'+value.id+'" onclick="Get.lingOpen(this)">领取</button>';
                        }else{
                            html += '<button class="huiImg xiyaBtn" style="background-color: #ccc">已领完</button>';
                        }
                    }
                    html +='<div class="doc_child_left">' +
                        '<img style="max-height: 4rem;;border-radius: 5px;overflow: hidden;" src="img/rotor/jiangImg.png">' +
                        '</div>' +
                        '<div class="doc_child_right" style="margin: 0 0 0 0;">' +
                        '<div class="id" style="margin-left: 5%;">' ;
                    if(value.hasBeenGiveUseEffectiveDate){
                        html += '<p class="name" style="font-size: .9rem;color: #333333;margin-top: .3rem">'+value.prizeName+'' ;
                    }else{
                        html += '<p class="name" style="font-size: .9rem;color: #333333;margin-top: .9rem">'+value.prizeName+'' ;
                    }
                    if(value.remainSize <= 5){
                        if(value.hasBeenGiveUseEffectiveDate){
                            html += '<p style="color: #fb952c;margin-top: .3rem;font-size: .7rem;">免费体验一次</p>' ;
                        }else{
                            html += '<p style="color: #fb952c;margin-top: .5rem;font-size: .7rem;">免费体验一次</p>' ;
                        }
                    }
                    if(value.hasBeenGiveUseEffectiveDate){
                        html += "<p style='color: #666;margin-top: .5rem;font-size: .7rem;'>失效时间："+value.hasBeenGiveUseEffectiveDate+"</p>" ;
                    }
                    html +='</p>' +
                       /* '<p class="name" style="font-size: .7rem;color: #777;">限2018.11.9-2018.11.12领取有效</p>' +*/
                        '<p></p>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                });
                $('.hos_doc_list').append(html);
            }else{
                $('.hos_doc_list').append('<div class="mescroll-empty"><img class="empty-icon" src="option/mescroll-empty.png"><p class="empty-tip">亲,暂无奖品~</p></div>');
            }
        }else{
            alert(retInfo.data);
        }
    },
    getJiang:function (id) {  //领奖
        var url = SERVER_ADDR + '/app/user/activity/receive/prize';
        var Data = {};
        Data.activityStatisticsId = id;
        ajaxGetRetInfo(url, Data, this.getJiangSuccess, '请求失败', 'POST', true, undefined);
    },
    getJiangSuccess:function (retInfo) {
        if(retInfo.success == true){
            alert(retInfo.data);
            window.location.reload();
        }else{
            alert(retInfo.data);
        }
    },
    getJiangClick:function (obj) {
        if(localStorage.getItem('shareRotorNineBeforeOpen') != 1){
            $('.shareRotorNineBeforeOpen').show()
        }else {
            //领取接口
            Get.getJiang($(obj).attr('valueid'));
        }
    },
    lingOpen:function(obj){
        $('.modelOpen').show();
        $('.lingJiangBtn').attr('valueid',$(obj).attr('valueid'));
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