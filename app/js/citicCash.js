
var title = '开袋送送送 刮奖中中中';
var link = 'https://www.enuo120.com/app/scratch.html';
var imgUrl = 'https://www.enuo120.com/app/img/scratchShare.png';  //分享的信息
var desc = '叮——您有一份好礼还未刮开，快来点击领取吧！';
function  init() {
    getSign();
    if(window.innerHeight > document.body.scrollHeight){
        $('.browDetailBackImg').height(window.innerHeight);
    }else{
        $('.browDetailBackImg').height(document.body.scrollHeight);
    }
    var mobileFirstArray = [137,139,158,150,135,187,159,188,130,156];
    var mobileEndArray = [2203,2478,5310,2563,2452,1410,1478,3541,2415,8874];

    var productGetArray = ['超声洁牙一次','普通拔牙一次','补牙一次','66元抵用券'];
    for(var i = 0;i <= 52; i++){
        var mathRadomMobile = Math.ceil(Math.random()*9);
        var mathRadomMobileEnd = Math.ceil(Math.random()*9);
        var mathRadomFive = Math.ceil(Math.random()*3);
        var html = '';
        html += '<li>恭喜'+mobileFirstArray[mathRadomMobile]+'****'+mobileEndArray[mathRadomMobileEnd]+'获得'+productGetArray[mathRadomFive]+'奖</li>'
        $(".line").append(html);
    }
    $(".line").slideUpGun();
}
var Get = {
    chouCi:function () {
        var url = SERVER_ADDR + '/app/user/activationCode/selectByActivationCode';
        var Data = {};
        Data.code = $('.code').val();
        Data.type = 'CITIC_BANK';
        ajaxGetRetInfo(url, Data, this.chouCiSuccess, '请求失败', 'POST', true, undefined);
    },
    chouCiSuccess:function (res) {
        if(res.success){
            window.location.href = "special_cp.html?itemId=" + res.data + "&type=exchange";
            /* if(res.data == '恭喜您获得超声洁牙'){

            }else if(res.data == '恭喜您获得普通拔牙'){
                window.location.href = 'special_cp.html?itemId=249&type=exchange';
            }else if(res.data == '恭喜您获得玻璃离子补牙'){
                window.location.href = 'special_cp.html?itemId=256&type=exchange';
            }else if(res.data == '恭喜您获得66元平台余额'){
                $('.modelOpen').show();
            }*/
        }else{
            alert(res.data);
        }
    }
}
