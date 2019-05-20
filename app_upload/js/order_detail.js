var tolatitude;
var tolongitude;
var toname;
var toaddress;
function init() {
    Get.orderInfo();
    $('.diagnosesInfo').width($('.diagnosesDiv').width() - $('.diagnosesName').width() - 10)
 /*   $('.daymm').click(function () {
         if( !$(this).attr('disabled')){
            $('.daymm').removeClass('yuyueActive');
            $(this).addClass('yuyueActive');
        }
    })*/
}
function toLocalAddress() {
    if(is_weixn()){
        getSign();
    }else{
        window.location.href = 'http://api.map.baidu.com/geocoder?location='+tolatitude+','+tolongitude+'&output=html'
    }
}
function getSign() {
    var url = SERVER_ADDR + '/wx/getSign.json';
    var Data = {};
    Data.url = window.location.href;
    /*if(SERVER_ADDR == 'http://www.enuo120.com'){*/
        ajaxGetRetInfo(url, Data, getSignSuccess, '请求失败', 'GET', true, undefined);
    /*}*/
}
function getSignSuccess(retInfo) {
    console.log(retInfo)
    payResult(retInfo);
}
function payResult(jsonData) {
    wx.config({
        debug: true,
        appId: jsonData.data.appId,
        timestamp: jsonData.data.timestamp,
        nonceStr: jsonData.data.nonceStr,
        signature: jsonData.data.signature,
        jsApiList: ['openLocation']
    });
    wx.ready(function () {
        wx.openLocation({
            latitude: tolatitude,
            longitude: tolongitude,
            name: toname,
            address: toaddress,
            scale: 14
        });
    })
}
var To = {
    topanimate: function () {
        $(".shareCall").removeClass("call-active").addClass("am-modal-active");//向上弹出取消
        if ($(".sharebg").length > 0) {
            $(".sharebg").addClass("sharebg-active");//背景颜色变化并增加透明度
        } else {
            $("body").append('<div class="sharebg"></div>');
            $(".sharebg").addClass("sharebg-active");
        }
    },
    closetopanimate:function () {
        $(".shareCall").removeClass("am-modal-active").addClass("call-active");//向上弹出取消
        setTimeout(function () {
            $(".sharebg-active").removeClass("sharebg-active");//背景颜色恢复
            $(".sharebg").remove();

        }, 200);
    }
}
var Get = {
    orderInfo:function () {
            var url = SERVER_ADDR + '/app/user/order/getDetail.json';
            var Data = {};
            Data.id = getQueryString('itemId');
            ajaxGetRetInfo(url, Data, this.orderInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    orderInfoSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            var orderType = retInfo.data.type;
            var orderStatus = retInfo.data.orderStatus;
            //支付状态 置状态
            if (orderStatus == 'waitPaid') { //如果是待支付的
                $('.closeOrder').show();
                if(retInfo.data.amount == retInfo.data.lastAmount){ //如果未付款
                    $('.orderFuDiv').empty().append('<button onclick="Order.toPay(this)" class="orderPay" paySn="' + retInfo.data.sn + '" payAmount="' + retInfo.data.amount + '">支付</button>')
                }else if(Number(retInfo.data.amount) > Number(retInfo.data.lastAmount) && Number(retInfo.data.lastAmount) > 0){
                    $('.orderFuDiv').empty().append('<button onclick="Order.toPay(this)" class="orderPay" paySn="' + retInfo.data.sn + '" payAmount="' + retInfo.data.lastAmount + '">继续支付</button><span class="lastFu"><span>剩余应付：</span><span class="orderzongPriceLast">￥'+retInfo.data.lastAmount+'</span></span>')
                }
                if(retInfo.data.type == 'censor'){
                    $('.closeOrder').text('取消检查');
                    $('.orderFuDiv').empty().append('<button onclick="Order.toPay(this)" class="orderPay" paySn="' + retInfo.data.sn + '" payAmount="' + retInfo.data.amount + '">确认检查</button>')
                }
            } else if (orderStatus == 'waitConfirm') { //如果是待确认的
                $('.closeOrder').hide();
                $('.orderFuDiv').empty().append('<button class="ordersure" onclick="Order.sure()">确认治疗</button>');
                    if (retInfo.data.type == 'product' || retInfo.data.type == 'PRIZE' || retInfo.data.type == 'CITIC_BANK_ACTIVATION_CODE') {
                        $('.closeOrder').hide();
                        if(retInfo.data.specialProductId == huliCardId){
                            $('.orderFuDiv').empty().append('<button onclick="Order.toHuliCard()" class="orderPay" style="background-color: #00afa1;">查看详情</button>')
                        }else if(retInfo.data.specialProductId == rotorBuy){
                            $('.orderFuDiv').empty().append('<button onclick="window.location.href = '+"'rotorNine.html'"+'" class="orderPay" style="background-color: #00afa1;">去抽奖</button>')
                        }else if(retInfo.data.specialProductId == toothPin){
                            if (retInfo.data.groupShoppingTeamState == 'full') {
                                if (retInfo.data.isReservation == false) {
                                    $('.orderFuDiv').empty().append('<button onclick="Order.Yuyue()" class="orderPay">预约</button>')
                                } else {
                                    $('.orderFuDiv').empty().append('<span class="yuyueStatus">已预约</span>')
                                }
                            }else if (retInfo.data.groupShoppingTeamState == 'wait') {
                                if (retInfo.data.teamEndDatetime > new Date().getTime()) {  //拼团结束时间大于当前时间，还没超时
                                    $('.orderFuDiv').empty().append('<span class="yuyueStatus">已支付</span>')
                                } else {
                                    $('.orderFuDiv').empty().append('<span class="yuyueStatus">拼团超时</span>')
                                }
                            }else if (retInfo.data.groupShoppingTeamState == 'none') { //未入团
                                $('.orderFuDiv').empty().append('<button onclick="Order.toTeam()" class="orderPay">入团</button>')
                            }
                        }else{
                            if (retInfo.data.isReservation == false) {
                                if (retInfo.data.prizeInvalid == true) {
                                    $('.orderFuDiv').empty().append('<span class="yuyueStatus" style="color: #666">已失效</span>')
                                }else{
                                    $('.orderFuDiv').empty().append('<button onclick="Order.Yuyue()" class="orderPay">预约</button>')
                                }
                                if(retInfo.data.isActivity && retInfo.data.isActivity == true){ //线下卡的才会加进去
                                    if(retInfo.data.hasBeenGiveUseEffectiveDateStr < new Date().Format('yyyy-MM-dd hh:mm:ss')){
                                        $('.orderFuDiv').empty().append('<span class="yuyueStatus" style="color: #666">已失效(活动商品)</span>')
                                    }else{
                                        $('.orderFuDiv').empty().append('<button onclick="Order.Yuyue()" class="orderPay">预约</button>')
                                    }
                                }
                            } else {
                                $('.orderFuDiv').empty().append('<span class="yuyueStatus">已预约</span>')
                            }
                        }
                    }
            } else if (orderStatus == 'cancelled') { //如果是取消的
                $('.closeOrder').hide();
                $('.orderFuDiv').empty().append('<button class="orderDel" onclick="Order.del()">删除订单</button>')
            } else if (orderStatus == 'completed') { //如果是完成的
                $('.closeOrder').hide();
                if(retInfo.data.isEvaluation == false){ //如果是待评价的
                    $('.orderFuDiv').empty().append('<button class="ordercommontBtn" valueamount="'+retInfo.data.amount+'" valuename="'+retInfo.data.name+'" onclick="Order.commont(this)">评价</button>')
                }else{  //如果是交易成功的
                    $('.orderFuDiv').empty().append('<span class="orderclose">交易成功</span>')
                }
            }
            //订单类型 医生医美特价
            if (orderType == 'doctor') {  //如果是医生
                $('.doc').show();
                $('.subject').html('疾&nbsp;&nbsp;病：');
            } else if (orderType == 'project') {  //如果是医美
                $('.doc').hide();
                $('.subject').html('项&nbsp;&nbsp;目：');
            } else if (orderType == 'product' || orderType == 'PRIZE' || orderType == 'CITIC_BANK_ACTIVATION_CODE') {  //如果是特价
                $('.orderContent').show();
                $('.orderContentYm').hide();
                $('.name,.orderdetailchooseName').text(retInfo.data.name);
                $('.orderdetailchooseCount').text('×'+1);
                $('.orderzongPrice').text(retInfo.data.amount);
                $('.orderContent .left img').attr('src',retInfo.data.headImgUrl);
                if(orderType == 'PRIZE'){
                    $('.orderzong').hide();
                    $('.amount').parent().hide();
                    $('.orderdetailchoose').css('margin-top','1.5rem');
                }
            }else if (orderType == 'censor') {  //如果是检查
                $('.orderContent').show();
                $('.orderContentYm,.orderdetailchoose').hide();
                $('.name').text(retInfo.data.name);
                $('.orderzongPrice').text(retInfo.data.amount);
            }else if (orderType == 'offline') {  //如果是线下开单
                $('.orderContent,.hosOrderDetail').show();
                $('.orderContentYm,.orderdetailchoose').hide();
                $('.name').text(retInfo.data.name);
                $('.orderzongPrice').text(retInfo.data.amount);
                if(retInfo.data.diagnoses){
                    $('.diagnoses').show();
                    $('.maintell').text(retInfo.data.diagnoses[0].chiefComplaint);
                    $('.nowIll').text(retInfo.data.diagnoses[0].presentMedicalHistory);
                    //$('.tutorshipCheck').text(retInfo.data.diagnoses[0].supplementaryExamination);
                    $('.firstDiagnosis').text(retInfo.data.diagnoses[0].preliminaryDiagnosis);
                    $('.treatmentAdvice').text(retInfo.data.diagnoses[0].treatmentAdvice);
                    if(retInfo.data.diagnoses[0].supplementaryExaminations){
                        var file = retInfo.data.diagnoses[0].supplementaryExaminations;
                        var html="";
                        for(var i=0;i<file.length;i++){
                            html += '<div class="layui-inline photoDiv" style="width: 48%;">' +
                                '<input type="text" name="" value="'+file[i].supplementaryExamination+'" disabled class="layui-input tutorshipCheck" style="display: inline-block;margin-right: 15px;border: none;background-color: white;color: black;    font-size: .8rem;"><div class="imgList">' ;
                            file[i].images.forEach(function (value) {
                                html += '<img class="photoImg" style="height: 50px;margin-right: 6px;" src="'+value+'">'
                            });
                            html += '</div></div>'
                        }
                        $(".tutorshipCheck").append(html);
                        $('#gallery img').fsgallery();
                       // init_img_read(retInfo.data.diagnoseList[0].supplementaryExaminations);
                    }
                   /* if(retInfo.data.diagnoses[0].images.length > 0){
                        retInfo.data.diagnoses[0].images.forEach(function (val,index) {
                            console.log(val, index)
                            $('.tutorshipCheckImg').append('<a href="'+val+'"><img  style="margin-right: 4%;width: 46%" src="'+val+'" ></a>');
                        });
                    }*/

                }

                if(retInfo.data.projectMaterials){
                    retInfo.data.projectMaterials.forEach(function (value, index) {
                        $('.hosOrderDetail').append('<span style="display: block;margin-bottom: .1rem;">' +
                            '<span class="hosOrderDetailName">'+value.modelNo+'</span>' +
                            '<span class="hosOrderDetailCount">x'+value.quantity+'</span>' +
                            '<span class="hosOrderDetailPrice">￥'+value.price+'</span>' +
                            '</span>')
                    })
                }
            }else if (orderType == 'registration_fee') {  //如果是线下挂号费
                $('.orderContent,.hosOrderDetail').show();
                $('.orderContentYm,.orderdetailchoose').hide();
                $('.name').text(retInfo.data.name);
                $('.orderzongPrice').text(retInfo.data.amount);
                $('.orderContent .left img').attr('src',retInfo.data.headImgUrl);
            }
            tolatitude = retInfo.data.latitude;
            tolongitude = retInfo.data.longitude;
            toname = retInfo.data.hospitalName;
            toaddress = retInfo.data.addressName;
            $('.hos_to').attr('hosId',retInfo.data.hospitalId);
            $('.subjectName').text(retInfo.data.subjectName);
            $('.doctorName').text(retInfo.data.doctorName);
            $('.projectName').text(retInfo.data.name);
            $('.amount').text('￥'+retInfo.data.amount);
            $('.day').text(retInfo.data.day + '天');
            //$('.result').text(retInfo.data.orderAgreementResult[0]);
          /*  $('.yuexiao').empty();
            if(retInfo.data.agreementResults){
                retInfo.data.agreementResults.forEach(function (value, index) {
                    $('.yuexiao').append('<p>'+(index+1)+'、'+value+'；'+'</p>');
                })
            }*/
            $('.time').text(retInfo.data.day +'天');
            $('.orderAgreementResult,.orderUnderstanding').empty();
            if(retInfo.data.orderAgreementResult){
                retInfo.data.orderAgreementResult.forEach(function (value, index) {
                    $('.orderAgreementResult').append((index+1)+'.'+value+' ')
                    $('.result').append((index+1)+'.'+value+' ')
                })
            }
            if(retInfo.data.orderUnderstanding){
                retInfo.data.orderUnderstanding.forEach(function (value, index) {
                    $('.orderUnderstanding').append((index+1)+'.'+value +' ')
                })
            }
            $('.zhenduan').text(retInfo.data.diagnosis);
            $('.hospitalName').text(retInfo.data.hospitalName);
            $('.addressName').text(retInfo.data.addressName);
            $('.creatDate').text(retInfo.data.createDate);
            $('.sn').text(retInfo.data.sn);
            $('.mobile').text(retInfo.data.mobile);
        }else{
            alert(retInfo.data)
        }
    },
}
function href(obj) {
    window.location.href = "hos_index.html?hosId="+$(obj).attr('hosId')
}
/*订单*/
var Order = {
    del:function () { //删除订单
        layer.open({
            content: '确定要删除订单？'
            ,btn: ['取消', '确定']
            ,no: function(index){
                var url = SERVER_ADDR + '/app/user/order/delete';
                var Data = {};
                Data.id = getQueryString('itemId');
                ajaxGetRetInfo(url, Data, Order.delSuccess, '请求失败', 'POST', true, undefined);
                layer.close(index);
            }
        });
    },
    delSuccess:function (res) {
        if(res.success == true){
            window.location.href = 'order.html';
        }else {
            alert(res.data);
        }
    },
    sure:function () { //确认治疗
        var url = SERVER_ADDR + '/app/user/order/confirm';
        var Data = {};
        Data.id = getQueryString('itemId');
        ajaxGetRetInfo(url, Data, this.sureSuccess, '请求失败', 'POST', true, undefined);
    },
    sureSuccess:function (res) {
        if(res.success == true){
            window.location.reload();
        }else {
            alert(res.data);
        }
    },
    cancel:function () { //取消订单
        layer.open({
            content: '确定要取消订单？'
            ,btn: ['取消', '确定']
            ,no: function(index){
                var url = SERVER_ADDR + '/app/user/order/cancel';
                var Data = {};
                Data.id = getQueryString('itemId');
                ajaxGetRetInfo(url, Data, Order.cancelSuccess, '请求失败', 'POST', true, undefined);
                layer.close(index);
            }
        });
    },
    cancelSuccess:function (res) {
        if(res.success == true){
            window.location.reload();
        }else {
            alert(res.data);
        }
    },
    toPay:function (obj) {
        window.location.href = 'pay/order_pay.html?payId=' + getQueryString('itemId') + '&paySn=' + $(obj).attr('paySn') + '&payAmount=' + $(obj).attr('payAmount')
    },
    commont:function (obj) {
        window.location.href = 'order_commont.html?itemId=' + getQueryString('itemId') + '&payName='+$(obj).attr('valuename')+'&payAmount='+$(obj).attr('valueamount');
    },
    Yuyue:function () {
        window.location.href = 'pay/dos_yuyue.html?docId=' + getQueryString('itemId')+ '&type=product';
    },
    toTeam:function () {
        window.location.href = 'browList.html'
    },
    toHuliCard:function (obj) {
        window.location.href = 'myHuliCard.html';
    }
}