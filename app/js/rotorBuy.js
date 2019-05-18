var title = '新年大礼包 美丽带回家';
var link = window.location.href;
var imgUrl = 'https://www.enuo120.com/app/img/rotor/rotorNineShare.png';  //分享的信息
var desc = '国内往返机票、硅胶假体隆鼻、额头自体脂肪填充、眼综合、瘦脸针……只要9.9元，超值大奖，等你来开！';

function init() {
    getSign();
    $('.peopelcount').text(parseInt(((new Date().getTime() - 1545235200000)/1000)/60/60));//2018.12.20开始10分钟一个人
}
function toLocalAddress() {
    if(is_weixn()){
        getSignHos();
    }else{
        window.location.href = 'http://api.map.baidu.com/geocoder?location='+30.312619+','+120.181788+'&output=html'
    }
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
            Data.specialProductId = rotorBuy;
            ajaxGetRetInfo(url, Data, this.paySuccess, '请求失败', 'POST', true, undefined);
    },
    paySuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            window.location.href = 'pay/order_pay.html?payId='+retInfo.data;
        } else {
            if(retInfo.data == '该商品只能购买一次哦'){
                $('.toOpen').show();
            }else{
                alert(retInfo.data);
            }
        }
    }
}