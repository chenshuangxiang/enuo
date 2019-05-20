var getJiang;
var toBrowOpen;

var title = '280就能绣眉你信吗？';
var link = 'https://www.enuo120.com/app/browShare.html';
var imgUrl = 'https://www.enuo120.com/app/img/browActive/browOrder.jpg';  //分享的信息
var desc = 'e诺举办首届纹绣艺术节啦！20多款半永久眉形，多家纹绣机构任意挑选，还不快来看看？';
function init() {
    if(getQueryString('isApp') == 'true' || getQueryString('isZfb') == 'true'){
        $('.paybackOpen').show();
        //paySuccessDo();
    }
    /*if(getQueryString('payId') == '3382'){
        $('.wechatP').show();
    }*/
    getSign();
    Get.payInfo();
    $(".main_close").click(function () {//点取消时
        $(".share").removeClass("am-modal-active").addClass("first-active");//向上弹出取消
        setTimeout(function () {
            $(".sharebg-active").removeClass("sharebg-active");//背景颜色恢复
            $(".sharebg").remove();
        }, 200);
    });
    $('.choosePayDiv').click(function () {
        $('.choosegou').remove();
        $(this).append('<img class="payRightChoose choosegou" src="../img/goublue.png?v=9975c22">')
        $(".share").removeClass("first-active-left").addClass("am-modal-active");
        $(".share2").removeClass("am-modal-active").addClass("second-active");
    });
    $('.hos_data').click(function () {
        $(this).children('input').prop('checked',true)
    })
    $(".mubu,.payclose").click(function(){
        $('.modelOpen').hide();
    });
    $(".yueDiv").click(function(){
        $('.yueRadio').click();
    });
    $(".yueRadio").click(function(){
        $('.yueDiv').click();
    });
}
var specail;
var specailGetId;
var hospitalId;
var User = {
    info: function () { //个人中心信息
            var url = SERVER_ADDR + '/app/user/myInfo';
            var Data = {};
            Data.id = getQueryString('itemId');
            ajaxGetRetInfo(url, Data, this.infoSuccess, '请求失败', 'GET', true, undefined);
    },
    infoSuccess: function (res) {
        if (res.success == true) {
            if(res.data.activityAmount && res.data.activityAmount > 0){
                $('.zhuanYueDiv').show();
                if(hospitalId == 24 || hospitalId == 85){
                    if(Number(res.data.activityAmount) >= Number($('.orderlastPrice').text())){  //如果专项余额余额大于总额的值
                        $('.zhuanYueDi').text($('.orderlastPrice').text());
                    }else{
                        $('.zhuanYueDi').text(res.data.activityAmount);
                    }
                    $('.zhuanYueDiv').show();
                }else{
                    $('.zhuanYueDiv').hide();
                }
                $('.orderafterPrice').text((Number($('.orderafterPrice').text())  - Number($('.zhuanYueDi').text())).toFixed(2));
                var afterDiyong = $('.orderafterPrice').text();  //应付：后面的价格
                if(afterDiyong < 0){
                    var o = 0;
                    afterDiyong = o.toFixed(2);
                    $('.payMethod').hide();
                }else {
                    $('.payMethod').show();
                }
                if(Number($('.yueDi').text()) >= Number(afterDiyong)){  //如果余额大于应付的值
                    $('.yueDi').text(afterDiyong);
                    if(afterDiyong == 0){
                        $('.yueDiv').hide();
                    }
                }
                console.log($('.yueDi').text())
                $('.orderafterPrice').text(afterDiyong);
                $('.orderpriceQuan').text('￥'+afterDiyong);
            }else{
                $('.zhuanYueDiv').hide();
            }
            $('.orderpriceQuan').text('￥'+$('.orderafterPrice').text());
        } else {
            alert(res.data);
        }
    },
    isToday: function (str) {
        var d = new Date();
        var y = d.getFullYear(); // 2014
        var m = d.getMonth() + 1; // 7,月份从0开始的，注意
        var d = d.getDate(); // 9
        var date_str = y + '-' + m + '-' + d;
        return str == date_str;
    }

}
var Get = {
    payInfo:function () {
        var url = SERVER_ADDR + '/app/user/order/getDetail.json';
        var Data = {};
        Data.id = getQueryString('payId');
        ajaxGetRetInfo(url, Data, this.payInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    payInfoSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            if(retInfo.data.rechargeAmount == '0.00' || retInfo.data.specialProductId == sanbaProduct){ // 余额为0时，或者是活动商品的时候，不显示余额抵用栏目
                $('.yueDiv').hide();
            }
            if(Number(retInfo.data.rechargeAmount) - Number(retInfo.data.lastAmount) > 0){
                $('.yueDi').text(retInfo.data.lastAmount);
            }else{
                $('.yueDi').text(retInfo.data.rechargeAmount);
            }
            $('.goodsName').text(retInfo.data.name);
            $('.address').text(retInfo.data.hospitalName);
            hospitalId = retInfo.data.hospitalId;
            $('.price').text(retInfo.data.amount);
            $('.doc_child_left img').attr('src',retInfo.data.headImgUrl);
            $('.orderSn').text(retInfo.data.sn);
            $('.orderlastPrice,.orderafterPrice').text(retInfo.data.lastAmount);
            $('.orderpriceQuan').text('￥'+ retInfo.data.lastAmount);
            if(retInfo.data.type == 'registration_fee'){ //支付的是挂号费
                $('.fenDiv').attr("onclick","alert('挂号费不能分单支付')");
            }else if(retInfo.data.type == 'LINE_BROWS_CITIC' || retInfo.data.type == 'FIVE_LINE_BROWS' || retInfo.data.type == 'embroidery_eyebrow_festival_20181011' || retInfo.data.type == 'PERSONAL_EMBROIDERY_EYEBROW_FESTIVAL_20181011'){
                $('.fenDiv').attr("onclick","alert('纹绣活动不能分单支付')");
            }
            specailId = retInfo.data.specialProductId;
            specail = retInfo.data.type;
            if(specail == 'censor' || specailId == sanbaProduct){ //specail == 'product' ||
                $('.fenDiv,.redpay').hide();
            }
            if(hospitalId == 85){
                User.info();
            }



        }else{
            alert(retInfo.data)
        }
    },
   /* appPayBack:function () {  //app支付回调判断是否支付成功
        var url = SERVER_ADDR + '/app/user/order/getOrderStatus.json';
        var Data = {};
        Data.id = getQueryString('payId');
        ajaxGetRetInfo(url, Data, this.appPayBackSuccess, '请求失败', 'GET', true, undefined);
    },
    appPayBackSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){ // 如果付完  显示去预约  不然跳转到订单列表
            //$('.modelOpen').show();
            if(retInfo.data == 'waitConfirm'){
                $(".main_close").click();
                $('.modelOpen').show();
                $('.pub_hearder_left').attr('onclick','window.location.href = "order.html"');
            }else{
                window.location.href = 'order.html';
            }
        }else{
            alert(retInfo.data)
        }
    },*/
    specilaPayYuyue:function () {  //特价是否支付完成
        var url = SERVER_ADDR + '/app/user/order/getOrderStatus.json';
        var Data = {};
        Data.id = getQueryString('payId');
        ajaxGetRetInfo(url, Data, this.specilaPayYuyueSuccess, '请求失败', 'GET', true, undefined);
    },
    specilaPayYuyueSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){ // 如果付完  显示去预约  不然跳转到订单列表
            //$('.modelOpen').show();
            if(retInfo.data == 'waitConfirm'){
                if(specail == 'embroidery_eyebrow_festival_20181011' || specail == 'PERSONAL_EMBROIDERY_EYEBROW_FESTIVAL_20181011'){
                   //Get.waitQueue(); //推入纹绣待分配的队列
                    $(".main_close").click();
                    //Get.payBrowJiang();
                }else if(specail == 'FIVE_LINE_BROWS' || specail == 'LINE_BROWS_CITIC'){  //纹绣5人
                    $(".main_close").click();
                    $('.sharePayOpenBefore').show();
                }else if(specailId == toothPin){ //超声洁牙拼团
                    $(".main_close").click();
                    if(getQueryString('teamid') != null){
                        //抽不中，团员进来 直接进id团
                        Get.addTeam();
                    }else if(getQueryString('type') == 'qizhu'){
                        //抽不中，团长进来 直接创团
                        Get.doOwn();
                    }else{
                      $('.pinOpen').show();
                    }
                }else{
                    $(".main_close").click();
                    $('.paybackOpen').hide();
                    $('.modelOpen').show();
                    if(specailId == huliCardId){ //买的是护理卡
                        $('.toYuyueno').text('暂不添加');
                        $('.toYuyue').text('添加用户').attr('onclick',"window.location.href = 'add_huliuser.html?addcount=4'");
                    }else if(specailId == rotorBuy){ //买的是9.9美丽回家大礼包
                        $('.toYuyueno').text('暂不抽奖');
                        $('.toYuyue').text('立即抽奖').attr('onclick',"window.location.href = 'rotorNine.html'");
                    }else if(specailId == sanbaProduct){ //买的是3.8女神节皮秒 ，请求发卡接口
                        //Get.sendToUserCard();
                        $('.toYuyueno').text('返回').attr('onclick',"window.location.href = 'myCard.html'");
                        $('.toYuyue').text('立即抽奖').attr('onclick',"window.location.href = 'sanbaGua.html'");
                    }
                }
                $('.pub_hearder_left').attr('onclick','window.location.href = "order.html"');
            }else{
                window.location.href = 'order.html';
            }
        }else{
            alert(retInfo.data)
        }
    },
    sendToUserCard:function () {  //给用户发卡
        var url = SERVER_ADDR + '/app/user/cardCoupon/sendToUser';
        var Data = {};
        Data.cardCouponName = '3.8女神券';
        Data.specialProductId = sanbaProduct;
        ajaxGetRetInfo(url, Data, this.sendToUserCardSuccess, '请求失败', 'POST', true, undefined);
    },
    sendToUserCardSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){ //发卡成功

        }else{
            alert(retInfo.data)
        }
    },
    diYue:function () {
       if($('.yueRadio').is(':checked')){
           var afterDiyong = (Number($('.orderlastPrice').text()) - Number($('.zhuanYueDi').text()) - Number($('.yueDi').text())).toFixed(2);
           if(afterDiyong <= 0){
               var o = 0;
               afterDiyong = o.toFixed(2);
               $('.payMethod').hide();
           }else {
               $('.payMethod').show();
           }
            $('.orderafterPrice').text(afterDiyong);
           $('.orderpriceQuan').text('￥'+afterDiyong);
       }else{
           var afterDiyong = (Number($('.orderlastPrice').text()) - Number($('.zhuanYueDi').text())).toFixed(2);
           if(afterDiyong <= 0){
               var o = 0;
               afterDiyong = o.toFixed(2);
               $('.payMethod').hide();
           }else {
               $('.payMethod').show();
           }
           //$('.payMethod').show();
           $('.orderafterPrice').text(afterDiyong);
           $('.orderpriceQuan').text('￥'+afterDiyong)
       }
    },
    payBrowJiang:function () {
        var url = SERVER_ADDR + '/app/embroideryEyebrow/luckDraw';
        var Data = {};
        Data.collageIs = false;
        ajaxGetRetInfo(url, Data, this.payBrowJiangSuccess, '请求失败', 'GET', true, undefined);
    },
    payBrowJiangSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            //拼团成功获得奖品
            if(retInfo.data == '恭喜您中奖，抽中的是激光祛痣'){
                $('.jiangbackImg').attr('src','../img/browActive/browPayJiangQuzhi.png');
            }else if(retInfo.data == '恭喜您中奖，抽中的是超声洁牙'){
                $('.jiangbackImg').attr('src','../img/browActive/browPayJiangJieya.png');
            }else if(retInfo.data == '恭喜您中奖，抽中的是无针水光针'){
                $('.jiangbackImg').attr('src','../img/browActive/browPayJiangShuiguangzhen.png');
            }else if(retInfo.data == '恭喜您中奖，抽中的是水氧美人'){
                $('.jiangbackImg').attr('src','../img/browActive/browPayJiangShuiyang.png');
            }else if(retInfo.data == '恭喜您中奖，抽中的是青春解码（补水嫩肤）（一次）'){
                $('.jiangbackImg').attr('src','../img/browActive/browPayJiangJiema.png');
            }
            $('.successOpen,.sharePayOpenBefore').show();
            if(getQueryString('teamid') != null){
                //抽中，团员进来 直接进id团
                Get.addTeam();
            }else if(getQueryString('type') == 'qizhu'){
                //抽中，团长进来 直接创团
                Get.doOwn();
            }else{
                toBrowOpen = 1;
                //抽中 订单进  上处弹窗，点领取 再去中奖列表弹 再去中奖列表弹 再去中奖列表弹

            }
        }else{
            if(retInfo.data == "很遗憾，您尚未中奖"){
                alert(retInfo.data);
                $('.sharePayOpenBefore').show();
                //判断是不是旗员点加入团跳转购买，teamid有值的话直接加入
                if(getQueryString('teamid') != null){
                    //抽不中，团员进来 直接进id团
                    getJiang = 0;
                    Get.addTeam();
                }else if(getQueryString('type') == 'qizhu'){
                    //抽不中，团长进来 直接创团
                    getJiang = 0;
                    Get.doOwn();
                }else{
                    //抽不中 订单进
                    if(specail == 'embroidery_eyebrow_festival_20181011'){
                        $('.pinOpen').show();
                    }
                }
                //window.location.href = 'order.html';
            }else{
                alert(retInfo.data)
            }
        }
    },
    waitQueue: function () {
        var url = SERVER_ADDR + '/groupShopping/access/waitQueue';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.waitQueueSuccess, '请求失败', 'POST', true, undefined);
    },
    waitQueueSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            alert(retInfo.data);
            window.location.href = 'myBrow.html';
        } else {
            alert(retInfo.data)
        }
    },
    addTeam:function () {   //加入团队
        var url = SERVER_ADDR + '/app/user/groupShopping/ln/join/team';
        var Data = {};
        Data.teamNum = getQueryString('teamid');
        Data.activityId = toothPinActive;
        ajaxGetRetInfo(url, Data, this.addTeamSuccess, '请求失败', 'POST', true, undefined);
    },
    addTeamSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            //添加团队判断是否拼团成功，成功则去获得奖品
            /*if(retInfo.data == '拼团成功!'){
                Get.getPinPrize();
            }else{
                if(getJiang == 0){  //未中奖加入团队  先弹再跳
                    alert(retInfo.data);
                    window.location.href = 'myBrow.html';
                }else{
                    alert(retInfo.data);
                }
            }*/
            alert(retInfo.data);
            window.location.href = 'browList.html';
        }else{
            alert(retInfo.data)
        }
    },
    doOwn: function () {
        var url = SERVER_ADDR + '/app/user/groupShopping/ln/create/team';
        var Data = {};
        Data.activityId = toothPinActive;
        ajaxGetRetInfo(url, Data, this.doOwnSuccess, '请求失败', 'POST', true, undefined);
    },
    doOwnSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
          /*  if(getJiang == 0){
                alert('创建团队成功');
                window.location.href = 'browList.html';
            }else{
                alert('创建团队成功');
            }*/
            alert('创建团队成功');
            window.location.href = 'browList.html';
            //window.location.reload();
        } else {
            alert(retInfo.data);
        }
    },
    getPinPrize:function () {
        var url = SERVER_ADDR + '/app/embroideryEyebrow/luckDraw';
        var Data = {};
        Data.collageIs = true;
        ajaxGetRetInfo(url, Data, this.getPinPrizeSuccess, '请求失败', 'GET', true, undefined);
    },
    getPinPrizeSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            //拼团成功获得奖品
            if(retInfo.data == '恭喜您中奖，抽中的是激光祛痣'){
                $('.jiangbackImg').attr('src','img/browActive/browJiangQuzhi.png');
            }else if(retInfo.data == '恭喜您中奖，抽中的是超声洁牙'){
                $('.jiangbackImg').attr('src','img/browActive/browJiangJieya.png');
            }else if(retInfo.data == '恭喜您中奖，抽中的是无针水光针'){
                $('.jiangbackImg').attr('src','img/browActive/browJiangShuiguangzhen.png');
            }else if(retInfo.data == '恭喜您中奖，抽中的是水氧美人'){
                $('.jiangbackImg').attr('src','img/browActive/browJiangShuiyang.png');
            }else if(retInfo.data == '恭喜您中奖，抽中的是青春解码（补水嫩肤）（一次）'){
                $('.jiangbackImg').attr('src','img/browActive/browJiangJiema.png');
            }
            $('.successOpen,.sharePayOpenBefore').show();
        }else{
            alert(retInfo.data)
            window.location.href = 'myBrow.html';
        }
    }
}
var Go = {
    specilaYuyue:function () {
        window.location.href = 'dos_yuyue.html?docId='+ getQueryString('payId') + '&type=product';
    },
    topanimate:function () {
        /*if($("input[type='radio']:checked").val() == 'lianlian'){ //连连支付
            var url = SERVER_ADDR + '/app/user/payment/getLianPayParam.json';
            var Data = {};
            Data.orderId = getQueryString('payId');
            if($('.payRightChooseZi').text() == "分单支付"){
                var money = $('.fendanVal').val();
                if (money.trim() == "") {
                    alert('请输入分单支付金额');
                    return;
                }
                Data.amount = money;
            }
            ajaxGetRetInfo(url, Data, this.ajaxPaySuccess, '请求失败', 'POST', true, undefined);
            //

        }else{*/
                if($('.orderafterPrice').text() == '0.00'){
                    $('.fenDiv,.redpay').hide();
                }
            $(".share").removeClass("first-active").addClass("am-modal-active");//向上弹出取消
            if ($(".sharebg").length > 0) {
                $(".sharebg").addClass("sharebg-active");//背景颜色变化并增加透明度
            } else {
                $("body").append('<div class="sharebg"></div>');
                $(".sharebg").addClass("sharebg-active");
            }

    },
    topanimateRight:function () {
        $(".share").removeClass("am-modal-active").addClass("first-active-left");
        $(".share2").removeClass("second-active").addClass("am-modal-active");
    },
    topanimateBack:function () {
        $(".share").removeClass("first-active-left").addClass("am-modal-active");
        $(".share2").removeClass("am-modal-active").addClass("second-active");
    },
    fendanBack:function () {
        $('.payRightChooseZi').text('分单支付');
        $('.orderpriceQuan').hide();
        $('.orderpriceFen').show();
    },
    quaneBack:function () {
        $('.payRightChooseZi').text('全额支付');
        $('.orderpriceQuan').show();
        $('.orderpriceFen').hide();
    },
    historygo:function () {
        $('.payOpen').show();
    },
    history:function () {
        window.location.href = 'order.html';
    },
    liupay:function () {
        $('.payOpen').hide();
    }
}

/*支付*/
var Pay = {
    click:function () {
        //进行下单
        if ($("input[type='radio']:checked").val() == 'lianlian') {  // 连连支付
            this.ajaxPay('/app/user/payment/getLianPayParam.json');
        }else if($("input[type='radio']:checked").val() == 'zfb'){   // 支付宝支付
            this.ajaxPay('/app/user/payment/ali/submit');
        }else{
            /*if(getQueryString('payId') != '3382'){
                alert('微信支付维护升级中，请先使用支付宝支付或连连支付');
                return;
            }*/
            if(is_weixn()){ // 微信支付
                if (typeof WeixinJSBridge == "undefined") {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady',  this.ajaxPay('/app/user/payment/submit'), false);
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady',  this.ajaxPay('/app/user/payment/submit'));
                        document.attachEvent('onWeixinJSBridgeReady',  this.ajaxPay('/app/user/payment/submit'));
                    }
                } else {
                    this.ajaxPay('/app/user/payment/submit');
                }
            }else{ //H5支付
                this.ajaxPay('/app/user/payment/submit');
            }
        }
    },
    ajaxPay:function (ajaxUrl) {
        var orderId = getQueryString('payId');
        var amount;
        var isRecharge;
        if(specailId == huliCardId){  //如果购买的是护理卡的，请求护理卡支付接口
            if ($("input[type='radio']:checked").val() == 'lianlian') {
                ajaxUrl = '/app/NursingCard/getLianPayParam.json';
            } else if ($("input[type='radio']:checked").val() == 'zfb') {
                ajaxUrl = '/app/NursingCard/ali/nursingCardSubmit';
            } else {
                ajaxUrl = '/app/NursingCard/nursingCardSubmit';
            }
                //ajaxUrl = '/app/NursingCard/nursingCardSubmit';
            }
            var url = SERVER_ADDR + ajaxUrl;
            var Data = {};
            Data.orderId = orderId;
            if($('.payRightChooseZi').text() == "分单支付"){
                var money = $('.fendanVal').val();
                if (money.trim() == "") {
                    alert('请输入分单支付金额');
                    return;
                }
                if($('.fendanVal').val() < 0.01){
                    alert('支付最少0.01元')
                    return;
                }
                amount = money;
                Data.amount = amount;

            }
            if($('.yueRadio').is(':checked')){
                isRecharge = true;
                Data.isRecharge = isRecharge;
            }else{
                isRecharge = false;
                Data.isRecharge = isRecharge;
            }
            /*if($("input[type='radio']:checked").val() == 'zfb'){  //判断是支付宝支付则跳转页面打开浏览器
                window.location.href = 'payOpen.html?specailId=' + specailId + '&orderId=' + orderId + '&amount=' + amount + '&isRecharge=' + isRecharge;
                return;
            }*/
            ajaxGetRetInfo(url, Data, this.ajaxPaySuccess, '请求失败', 'POST', true, undefined);
        },
    ajaxPaySuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            if(retInfo.data.completed == true){ //直接支付成功 比如余额支付
                paySuccessDo();
            }else{
                if ($("input[type='radio']:checked").val() == 'lianlian') {
                    //去连连支付
                    $("input[name='req_data']").val(JSON.stringify(retInfo.data.param))
                    $('#lianlianPay').click();
                }else if($("input[type='radio']:checked").val() == 'zfb'){
                    //去支付宝支付
                    window.location.href = 'payOpen.html?paymentSn=' + retInfo.data.param.payment_sn;
                    //zfbClick(retInfo.data.param);
                    //$('#zfbPay').click();
                    //$("input[name='req_data']").val(JSON.stringify(retInfo.data.param))
                }else{
                    if(is_weixn()) {
                        //去微信公众号支付
                        Pay.payResult(retInfo);
                    }else{
                        //去微信H5支付
                        var str = window.location.href + '&isApp=true';
                        window.location.href = retInfo.data.param.url + '&redirect_url=' + encodeURIComponent(str);
                    }
                }
            }
        }else{
            alert(retInfo.data)
        }
    },
    payResult:function (jsonData) {
        var jsonDataPost = jsonData.data.param;
        /*{
            "appId":"wx2421b1c4370ec43b",     //公众号名称，由商户传入
            "timeStamp":"1395712654",         //时间戳，自1970年以来的秒数
            "nonceStr":"e61463f8efa94090b1f366cccfbbb444", //随机串
            "package":"prepay_id=u802345jgfjsdfgsdg888",
            "signType":"MD5",         //微信签名方式：
            "paySign":"70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名
        }*/
        WeixinJSBridge.invoke('getBrandWCPayRequest', jsonDataPost, function (res) {
            // 使用以下方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            //【因此微信团队建议：】当收到ok返回时，向商户后台询问是否收到交易成功的通知，
            //若收到通知，前端展示交易成功的界面；
            //若此时未收到通知，商户后台主动调用查询订单接口，查询订单的当前状态，并反馈给前端展示相应的界面。
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                //JS API的返回结果get_brand_wcpay_request：ok仅在用户成功完成支付时返回
                /*$.ajax({
                    type: 'POST',
                    url: '/WeiXinGz/QueryOrder',
                    data: {
                        orderId: jsonData.orderId
                    },
                    cache: false,
                    dataType: 'text',
                    success: function (jsonData) {
                        if (jsonData == "ok") {
                            alert("支付成功", "提示", function () {
                                alert("页面跳转等业务处理");
                            });
                        } else {
                            alert("支付失败,请稍后重试！如果收到支付通知，切勿重复支付1！");
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("支付失败,请稍后重试！如果收到支付通知，切勿重复支付2！");
                    }
                });*/
                //alert('支付成功')
                paySuccessDo()
            } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                //由于前端交互复杂，get_brand_wcpay_request：cancel或者get_brand_wcpay_request：fail可以统一处理为用户遇到错误或者主动放弃，不必细化区分。
                alert("您放弃了支付");
            } else {
                //由于前端交互复杂，get_brand_wcpay_request：cancel或者get_brand_wcpay_request：fail可以统一处理为用户遇到错误或者主动放弃，不必细化区分。
                alert("支付失败,请稍后重试！如果收到支付通知，切勿重复支付！");
            }
        });
    }
}
/*function zfbClick(param) {
        console.log(param)
        var bizStr = JSON.stringify(param);
        var queryParam = '';
        queryParam += 'bizcontent=' + encodeURIComponent(bizStr);
        /!*Array.prototype.slice.call(document.querySelectorAll("input[type=hidden]")).forEach(function (ele) {
            queryParam += '&' + ele.name + "=" + encodeURIComponent(ele.value);
        });*!/
        var constActionUrl = 'https://openapi.alipaydev.com/gateway.do?charset=utf-8&method=alipay.trade.wap.pay&sign=OZ6F53FrWshGSvPHli4zA57SqkmkTUldOyaT46eZut77Ll6vrZyspvp/0VRINBNkxr7ypvniUesRp9VU/WJMNP5qRhAoT+3MU2zNENRfFRAokE91lkNTf9oRrWVGfP4HlVjkRSlELHUs67FFinEnfmQqbEinisptQtP/bpOtbES2smlqYs63f/hcAiVVo1RfiVKTSCh6d1q8FaDzGgaHXa554LWvSKpft+6tPnVXNJqwEabSKeeuzkwXQdUHcVRtc61wWOCpjQRCeT3iUgPGLz0GRHPuiE0cg8LZXKfKWhQqIjWGt+ymTqdlROFyDg3rHTfmoaByvZmjJ7dXjkaBPg==&return_url=http://www.enuo120.com:7070/app/user/payment/ali/receive_return.htm&version=1.0&app_id=2016080700186819&sign_type=RSA2&alipay_sdk=alipay-sdk-java-3.3.49.ALL&format=json';
        constActionUrl = constActionUrl + '&timestamp=' + new Date().Format('yyyy-MM-dd hh:mm:ss') + '&notify_url=http://www.enuo120.com:7070/app/user/payment/ali/receive_notify.htm';
        var gotoUrl = constActionUrl + '&' + queryParam;
        console.log(gotoUrl);
        debugger;
        _AP.pay(gotoUrl);
}*/

function paySuccessDo() {
    if(specail == 'product' || specail == 'LINE_BROWS_CITIC' || specail == 'FIVE_LINE_BROWS' || specail == 'embroidery_eyebrow_festival_20181011' || specail == 'PERSONAL_EMBROIDERY_EYEBROW_FESTIVAL_20181011'){ //如果是特价 要去请求是否全部支付完成
        Get.specilaPayYuyue();
       /* $(".main_close").click();
        $('.modelOpen').show();
        $('.pub_hearder_left').attr('onclick','window.location.href = "order.html"');*/
    }else{
        window.location.href = 'order.html'
    }
}
function callback() {
    $('.sharePayOpenBefore').hide();
    if(specail == 'LINE_BROWS_CITIC' || specail == 'FIVE_LINE_BROWS' || specail == 'PERSONAL_EMBROIDERY_EYEBROW_FESTIVAL_20181011'){
        window.location.href = 'myBrow.html';
    }
}
