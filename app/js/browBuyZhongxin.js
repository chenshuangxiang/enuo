var title = '';
var link = window.location.href;
var imgUrl = 'https://www.enuo120.com/app/img/browActive/browOrder.jpg';  //分享的信息
var desc = '';

var tolatitude = 30.306619;  //爱德地址经纬度
var tolongitude = 120.175088;
var toname = '爱德医院南侧';
var toaddress = '杭州市下城区东新路509号爱德医院南侧';
function init() {
    getSign();
    $('.peopelcount').text(parseInt(((new Date().getTime() - 1541055975000)/1000)/60/60));//2018.10.15开始10分钟一个人
    Get.getDocInfo();
}
function toLocalAddress() {
    if(is_weixn()){
        getSignHos();
    }else{
        window.location.href = 'http://api.map.baidu.com/geocoder?location='+30.312619+','+120.181788+'&output=html'
    }
}
var Get = {
    getDocInfo:function () {
        var url = SERVER_ADDR + '/app/specialProduct/getDetail.json';
        var Data = {};
        Data.id = xiumeiIdOneZhongxin;
        ajaxGetRetInfo(url, Data, this.getDocInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    getDocInfoSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            $('.line_consult').attr('employee',retInfo.data.employeeId);
        }else{
            alert(retInfo.data)
        }
    },
}
var Go = {
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
    },
    chat:function () {
        window.location.href = 'chat.html?hosId=' + $('.line_consult').attr('employee');
    },
    pay: function () {
            var url = SERVER_ADDR + '/app/user/order/submit';
            var Data = {};
            Data.specialProductId = xiumeiIdOneZhongxin;
            ajaxGetRetInfo(url, Data, this.paySuccess, '请求失败', 'POST', true, undefined);
    },
    paySuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            window.location.href = 'pay/order_pay.html?payId='+retInfo.data;
        } else {
            if(retInfo.data == '纹眉活动只能购买一次哦'){
                $('.toOpen').show();
            }else{
                alert(retInfo.data);
            }
        }
    }
}