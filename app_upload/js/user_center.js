var healthmanId;
var doctorId;
var nurseId;
function init() {
    User.info();
    User.haveOrder();//9.9元大转盘活动要先请求是否买过，显示是否点亮图标
    User.baseInfo();
    follow.getNewsCount();
    setInterval(function () {
        follow.getNewsCount();//获取未读消息条数
    },10000);
    if(getQueryString('warn') != null){
        $('.msgText').text(getQueryString('warn'));
        $('.msg').fadeIn();
        localStorage.removeItem('scrathCode');
        setTimeout(function () {$('.msg').fadeOut();},2500);
    }
    $('.loginStatus').click(function () {
       if($('.loginStatus').text() == '未登录'){
           window.location.href = 'bind_tel.html';
       }
    });
    $('.mubu,.closeopen').click(function () {
        $('.modelOpen').hide();
    });
    $('.hosDivOpen').click(function () {
        $('.hosDivOpen').find('.sex').prop('checked',false);
        $(this).find('.sex').prop('checked',true);
    });
}
var User = {
    info: function () { //个人中心信息
        if(getQueryString('id') != null){
            localStorage.setItem('saleId',getQueryString('id'));
            follow.wecat();
            this.toInfo();
        }else if(getQueryString('bussCode') != null) {
            if(window.location.href == 'https://www.enuo120.com/app/user_center.html?bussCode=A1001'){
                window.location.href = 'follow.html';
                return
            }
            localStorage.setItem('bussCode',getQueryString('bussCode'));
            window.location.href = 'xywz.html';
        }else{
           this.toInfo();
        }
    },
    toInfo:function () {
        var url = SERVER_ADDR + '/app/user/myInfo';
        var Data = {};
        Data.id = getQueryString('itemId');
        ajaxGetRetInfo(url, Data, this.infoSuccess, '请求失败', 'GET', true, undefined);
    },
    infoSuccess: function (res) {
        if (res.success == true) {
            $('.userHeadimg').attr('src',res.data.headImgUrl);
            if(res.data.actualNameCertification == false){ //实名认证
                $('.realStatus').attr('src','img/user_center/noRealName.png');
            }else if(res.data.actualNameCertification == true){
                $('.realStatus').attr('src','img/user_center/alreadyRealName.png');
            }
            if(res.data.communityNurseState != '未认证'){//护士认证
                $('.realStatus').attr('src','img/user_center/nurseRealName.png');
                if(res.data.communityNurseState == '审批中'){
                    $('.shenpi').css('display','inline-block').text('审批中');
                }else if(res.data.communityNurseState == '未通过'){
                    $('.shenpi').css('display','inline-block').text('未通过');
                }
            }
            if(res.data.communityDoctorState != '未认证'){//医生认证
                $('.realStatus').attr('src','img/user_center/doctorRealName.png');
                if(res.data.communityDoctorState == '审批中'){
                    $('.shenpi').css('display','inline-block').text('审批中');
                }else if(res.data.communityDoctorState == '未通过'){
                    $('.shenpi').css('display','inline-block').text('未通过');
                }
            }

            if(res.data.activityAmount && res.data.activityAmount != '0.00'){
               $('.activityInfoDiv').show();
               $('.activityAmount').text('我的专项余额（' + res.data.activityAmount +'元）');
            }else{
                $('.activityInfoDiv').hide();
            }
            if(res.data.salesmanMobile != undefined){
                $('.mainTop a').attr('href','tel:'+ res.data.salesmanMobile);
                $('.mainTop a span').text(res.data.salesmanMobile);
            }
            $('.shouscore').text(res.data.couponQuantity);
            $('.pingscore').text(res.data.companionCardQuantity);
            $('.yue').text(res.data.rechargeAmount);
            //$('.huliCard').attr('onclick',"window.location.href = 'myHuliCard.html?id="+res.data.id+"'");
            if(res.data.fullname){
                $('.loginStatus').text(res.data.fullname);
            }
            if (getQueryString('id') != null) {
                User.salesmanBind();
            }
            //$('.docImg').attr('src',res.data.headImgUrl);
        } else {
            alert(res.data);
        }
    },
    baseInfo:function () {  //获取基本信息
        var url = SERVER_ADDR + '/app/user/health/document/baseInfo';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.baseInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    baseInfoSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            if(!retInfo.data.doctors || retInfo.data.doctors.length == 0){
                $('.toDoctorInfo').attr("onclick","alert('暂无签约医生')");
            }
            if(!retInfo.data.nurses || retInfo.data.nurses.length == 0){
                $('.toNurseInfo').attr("onclick","alert('暂无签约护士')");
            }
            if(retInfo.data.healthSupervisor){
                $('.myHealthman').text(retInfo.data.healthSupervisor.name);
                $('.myHealthmanA').attr('href','tel:'+retInfo.data.healthSupervisor.mobile);
                healthmanId = retInfo.data.healthSupervisor.id;
            }else{
                $('.toHealthmanInfo').attr("onclick","alert('暂无健康助理')");
            }
            if(retInfo.data.doctors.length > 0){
                $('.myDoctor').text(retInfo.data.doctors[0].name);
                doctorId = retInfo.data.doctors[0].id;
                $('.myDoctorA').attr('href','tel:'+retInfo.data.doctors[0].mobile);
            }
            if(retInfo.data.nurses.length > 0){
                $('.myNurse').text(retInfo.data.nurses[0].name);
                $('.myNurseA').attr('href','tel:'+retInfo.data.nurses[0].mobile);
                nurseId = retInfo.data.nurses[0].id;
            }
            //$('.fullHeadImgUrl').attr('src',retInfo.data.fullHeadImgUrl);
        }else{
            alert(retInfo.data)
        }
    },
    rechargeCard:function () {
        var url = SERVER_ADDR + '/app/user/cardRecharge';
        var Data = {};
        Data.number = $('.cardnum').val();
        Data.password = $('.cardpsd').val();
        ajaxGetRetInfo(url, Data, this.rechargeCardSuccess, '请求失败', 'POST', true, undefined);
    },
    rechargeCardSuccess: function (res) {
        if (res.success == true) {
            alert(res.data);
            window.location.reload();
        } else {
            alert(res.data);
        }
    },
    salesmanBind: function () { //二次扫码绑定业务员
            //localStorage.setItem('saleId', getQueryString('id'));
            var url = SERVER_ADDR + '/app/user/bind/salesman';
            var Data = {};
            Data.salesmanId = getQueryString('id');
            ajaxGetRetInfo(url, Data, this.salesmanBindSuccess, '请求失败', 'POST', true, undefined);
    },
    salesmanBindSuccess: function (res) {
        if (res.success == true) {

        } else {
            alert(res.data);
        }
    },
    haveOrder:function () {
        var url = SERVER_ADDR + '/app/user/cardCoupon/specialProduct/useState';
        var Data = {};
        Data.specialProductId = sanbaProduct;
        ajaxGetRetInfo(url, Data, this.haveOrderSuccess, '请求失败', 'GET', true, undefined);
    },
    haveOrderSuccess: function (res) {
        if (res.success == true) {
            if(res.data.purchased == true){
                $('.newyearImg').attr('src','img/user_center/newYearHong.png');
                //$('.newyearImgDiv').attr('onclick','window.location.href = "rotorNine.html"');
            }else if(res.data.purchased == false){
                $('.newyearImg').attr('src','img/user_center/newYearHui.png');
                //$('.newyearImgDiv').attr('onclick','window.location.href = "rotorBuy.html"');
            }
        } else {
            //alert(res.data);
        }
    }
}
var Go = {
    topanimate: function () {
        $(".share").removeClass("first-active").addClass("am-modal-active");//向上弹出取消
        if ($(".sharebg").length > 0) {
            $(".sharebg").addClass("sharebg-active");//背景颜色变化并增加透明度
        } else {
            $("body").append('<div class="sharebg"></div>');
            $(".sharebg").addClass("sharebg-active");
        }
    },
    closetopanimate:function () {
        $(".share").removeClass("am-modal-active").addClass("first-active");//向上弹出取消
        setTimeout(function () {
            $(".sharebg-active").removeClass("sharebg-active");//背景颜色恢复
            $(".sharebg").remove();

        }, 200);
    },
    toHrefYuyueHtml:function () {
        if($("input[type='radio']:checked").val() == 'myYuyue'){
            window.location.href = 'my_yuyue.html';
        }else{
            window.location.href = 'my_huliCardyuyue.html';
        }
    },
    toHealthmanInfo:function () {
        window.location.href = 'healthmanInfo.html?id='+healthmanId;
    },
    toDoctorInfo:function(){
        window.location.href = 'doctorInfo.html?id='+doctorId;
    },
    toNurseInfo:function () {
        window.location.href = 'nurseInfo.html?id='+nurseId;
    }
}