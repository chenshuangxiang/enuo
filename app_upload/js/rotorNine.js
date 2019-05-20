var title = '新年大礼包 美丽带回家';
var link = window.location.href;
var imgUrl = 'https://www.enuo120.com/app/img/rotor/rotorNineShare.png';  //分享的信息
var desc = '国内往返机票、硅胶假体隆鼻、额头自体脂肪填充、眼综合、瘦脸针……只要9.9元，超值大奖，等你来开！';
var result;
function init() {
  /*  if(window.innerHeight > document.body.scrollHeight){
        $('.browDetailBackImg').height(window.innerHeight);
    }else{
        $('.browDetailBackImg').height(document.body.scrollHeight);
    }*/
    $('.item,.itemNo').height($('.item').width());
    $('#lottery').height($('#lottery').width() + 40);
    getSign();
    Get.chouCi();
    var mobileFirstArray = [137,139,158,150,135,187,159,188,130,156];
    var mobileEndArray = [2203,2478,5310,2563,1451,1410,1478,3541,2415,8874];

    var productGetArray = ['国内往返机票','光子嫩肤免费体验券','水氧美人免费体验券','超声洁牙免费体验券','皮秒祛斑免费体验券','除皱免费体验券','全切双眼皮免费体验券','黑脸娃娃免费体验券','瘦脸针免费体验券','眼综合免费体验券','硅胶假体隆鼻免费体验券','额头自体脂肪填充免费体验券'];
    for(var i = 0;i <= 52; i++){
        var mathRadomMobile = Math.ceil(Math.random()*9);
        var mathRadomMobileEnd = Math.ceil(Math.random()*9);
        var mathRadomFive = Math.ceil(Math.random()*11);
        var html = '';
        html += '<li>恭喜'+mobileFirstArray[mathRadomMobile]+'****'+mobileEndArray[mathRadomMobileEnd]+'获得'+productGetArray[mathRadomFive]+'奖</li>'
        $(".line").append(html);
    }
    $(".line").slideUpGun();
}
var lottery = {
    index: -1, //当前转动到哪个位置，起点位置 -1不显示active
    count: 0, //总共有多少个位置
    timer: 0, //setTimeout的ID，用clearTimeout清除
    speed: 20, //初始转动速度
    times: 0, //转动次数
    cycle: 50, //转动基本次数：即至少需要转动多少次再进入抽奖环节
    prize: -1, //中奖位置
    prizeName:'',
    init: function(id) {
        if($('#' + id).find('.lottery-unit').length > 0) {
            var $lottery = $('#' + id);
            var $units = $lottery.find('.lottery-unit');
            this.obj = $lottery;
            this.count = $units.length; //奖项的数量 循环产生
            $lottery.find('.lottery-unit.lottery-unit-' + this.index).addClass('active'); //默认的时候给哪个设active
        };
    },
    roll: function() {
        var index = this.index;
        var count = this.count;
        var lottery = this.obj;
        $(lottery).find('.lottery-unit.lottery-unit-' + index).removeClass('active');
        index += 1;
        if(index > count - 1) {
            index = 0;
        };
        $(lottery).find('.lottery-unit.lottery-unit-' + index).addClass('active');
        this.index = index;
        return false;
    },
    stop: function(index) {
        this.prize = index;
        return false;
    }
};

function roll() {
    lottery.times += 1;
    lottery.roll(); //转动过程调用的是lottery的roll方法，这里是第一次调用初始化

    if(lottery.times > lottery.cycle + 10 && lottery.prize == lottery.index) {
        clearTimeout(lottery.timer);
        setTimeout(function () {
            layer.open({
                type: 1,
                shadeClose: true,
                shade: false,
                maxmin: true, //开启最大化最小化按钮
                area: ['893px', '600px'],
                content: $("#info").html(),
                success:function () {
                    if(result.length <= 4){
                        $('.layui-m-layercont h1').css('line-height','1.8rem').css('font-size','1.6rem');
                    }else{
                        $('.layui-m-layercont h1').css('line-height','1.8rem').css('font-size','1.4rem').css('top','19%');
                    }
                    $('.layui-m-layerchild').css('background-color','rgba(255,255,255,0)');
                }
            });
            lottery.prize = -1;
            lottery.times = 0;
            click = false;
        },1100);
    } else {
        if(lottery.times < lottery.cycle) {
            lottery.speed -= 10;
        } else if(lottery.times == lottery.cycle) {
            /*Get.switchResult(); */
            var index = prizeName;//Math.random() * (lottery.count) | 0; //静态演示，随机产生一个奖品序号，实际需请求接口产生
            lottery.prize = index;
        } else {
            if(lottery.times > lottery.cycle + 10 && ((lottery.prize == 0 && lottery.index == 7) || lottery.prize == lottery.index + 1)) {
                lottery.speed += 110;
            } else {
                lottery.speed += 20;
            }
        }
        if(lottery.speed < 40) {
            lottery.speed = 40;
        };
        lottery.timer = setTimeout(roll, lottery.speed); //循环调用
    }
    return false;
}

var click = false;

window.onload = function() {
    lottery.init('lottery');
    $('.draw-btn').click(function() {
        if(click) { //click控制一次抽奖过程中不能重复点击抽奖按钮，后面的点击不响应
            Get.haveOrder();
            return false;
        } else {
            Get.chou();
        }
    });
};
var Get = {
    chouCi: function () {
        var url = SERVER_ADDR + '/app/activity/remaining/pickOutSize';
        var Data = {};
        Data.activityId = 5;
        Data.specialProductId = rotorBuy;
        ajaxGetRetInfo(url, Data, this.chouCiSuccess, '请求失败', 'GET', true, undefined);
    },
    chouCiSuccess: function (res) {
        if (res.success) {
            $('.chouCi').text(res.data.size);
            if(res.data.size == 0){
                click = true;
                $('.openClick').attr('src','img/rotor/tk_img_ling.png').attr('onclick','window.location.href = "myRotorJiang.html"');
            }else if(res.data.size == 1){
                $('.openClick').attr('src','img/rotor/tk_img_zaichou.png').attr('onclick','layer.closeAll()');
            }
        } else {
            if(res.data != '请先登录!'){
                alert(res.data);
            }
        }
    },
    chou:function () {
            var url = SERVER_ADDR + '/app/user/activity/luckyWeel';
            var Data = {};
            Data.specialProductId = rotorBuy;
            ajaxGetRetInfo(url, Data, this.chouSuccess, '请求失败', 'POST', true, undefined);
    },
    chouSuccess:function (res) {
        if(res.success){
            Get.chouCi();
            prizeName = Get.switchResult(res.data);
            $('#info h1').text(res.data);
            lottery.speed = 100;    //初始转动速度 100
            result = res.data;
            roll(); //转圈过程不响应click事件，会将click置为false
            click = true; //一次抽奖完成后，设置click为true，可继续抽奖
            return false;

        }else{
            if(res.data == '请先支付'){
                window.location.href = 'rotorBuy.html'
            }else{
                alert(res.data);
            }
           // $('.pointer').attr('click','true');
        }
    },
    switchResult:function (result) {
        var resultCount;
        switch (result){
            case '国内往返机票':
                resultCount = 0;
                break;
            case '眼综合':
                resultCount = 1;
                break;
            case '全切双眼皮':
                resultCount = 2;
                break;
            case '黑脸娃娃':
                resultCount = 3;
                break;
            case '额头自体脂肪填充':
                resultCount = 4;
                break;
            case '瘦脸针':
                resultCount = 5;
                break;
            case '超声洁牙':
                resultCount = 6;
                break;
            case '皮秒祛斑':
                resultCount = 7;
                break;
            case '硅胶假体隆鼻':
                resultCount = 8;
                break;
            case '水氧美人':
                resultCount = 9;
                break;
            case '除皱':
                resultCount = 10;
                break;
            case '光子嫩肤':
                resultCount = 11;
                break;
        }
        return resultCount;
    },
    haveOrder:function () {
        var url = SERVER_ADDR + '/app/user/order/hasBeenBuy/specialProduct';
        var Data = {};
        Data.specialProductId = rotorBuy;
        ajaxGetRetInfo(url, Data, this.haveOrderSuccess, '请求失败', 'GET', true, undefined);
    },
    haveOrderSuccess: function (res) {
        if (res.success == true) {
            if(res.data == true){
                alert('您的抽奖次数已经用完~');
            }else if(res.data == false){
                window.location.href = 'rotorBuy.html'
            }
        } else {
            //alert(res.data);
        }
    }
}