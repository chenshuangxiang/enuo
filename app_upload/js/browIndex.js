/*
 * 绣眉活动
 * 2018-10-16
 * https://www.enuo120.com/app/browIndex.hyml
 * author: csx
 */
var title = '想着你也需要这个，特意分享跟你一起拼啦！';
var link = window.location.href;
var imgUrl = 'https://www.enuo120.com/app/img/pin/toothcoupon.jpg';  //分享的信息
var desc = '不是好东西不会分享给你的，快点进来，急！';
function init() {
    getSign();
    follow.wecat();
    Get.getMyInfo();
  /*  if(window.innerHeight > document.body.scrollHeight){
        $('.browDetailBackImg').height(window.innerHeight);
    }else{
        $('.browDetailBackImg').height(document.body.scrollHeight);
    }*/
    var mobileFirstArray = [137,139,158,150,135,187,159,188,130,156];
    var mobileEndArray = [2203,2478,5310,2563,2452,1410,1478,3541,2415,8874];

    var productGetArray = ['水氧美人体验券','超声洁牙免费体验券','激光祛痣体验券','青春解码体验券','无针水光针体验券'];
/*    var signGetArray = ['愫美纹绣工作室','小兰私人订制纹绣','娜佳美甲','彩韵纹绣','指艺美工作室','倾城纹绣','安奈美甲', '品真一站式健康美丽','GS纹绣阁','绣之美',
        '安心纹绣','京都伊人美甲美睫','瑞倪维儿','艾美纹绣','瑞倪维儿','可可啦美甲美睫','A兰熙·私人订制', 'A美之源','韩雅姬',
        '迷鹿家美甲美睫','纤谊.美甲美睫','三色堇美甲美睫半永久皮肤管理','子雯','绣之美纹绣', '万槿国际美学院','如e美夏',
        '愫美纹绣工作室','小兰私人订制纹绣','娜佳美甲','彩韵纹绣','指艺美工作室','倾城纹绣','安奈美甲', '品真一站式健康美丽','GS纹绣阁','绣之美',
        '安心纹绣','京都伊人美甲美睫','瑞倪维儿','艾美纹绣','瑞倪维儿','可可啦美甲美睫','A兰熙·私人订制', 'A美之源','韩雅姬',
        '迷鹿家美甲美睫','纤谊.美甲美睫','三色堇美甲美睫半永久皮肤管理','子雯','绣之美纹绣', '万槿国际美学院','如e美夏'];*/
    for(var i = 0;i <= 52; i++){
        var mathRadomMobile = Math.ceil(Math.random()*9);
        var mathRadomMobileEnd = Math.ceil(Math.random()*9);
        var mathRadomFive = Math.ceil(Math.random()*4);
        var html = '';
        html += '<li>恭喜'+mobileFirstArray[mathRadomMobile]+'****'+mobileEndArray[mathRadomMobileEnd]+'获得'+productGetArray[mathRadomFive]+'一张</li>'
        $(".line").append(html);
    }
    $(".line").slideUpGun();
    $(".payclose,.toYuyueno").click(function(){
        $('.modelOpen,.shareOpen').hide();
    });
}
var Get = {
    getMyInfo:function () {
        var url = SERVER_ADDR + '/groupShopping/user/transactionState';
        var Data = {};
        Data.activityId = 10;
        ajaxGetRetInfo(url, Data, this.getTeamInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    getTeamInfoSuccess:function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            if (retInfo.data.transaction == false) {  //已入团
                $('.browIndexOneMe').show();
                $('.browIndexOneMe').attr('onclick', "window.location.href = 'browDetail.html?id=" + retInfo.data.teamNum + "&type=me'");
                $('.browIndexOne1').attr('onclick', "window.location.href = 'browDetail.html?id=" + retInfo.data.teamNum + "&type=me'");
                $('.browIndexOne2').attr('onclick', "window.location.href = 'browList.html'");
            } else if(retInfo.data.transaction == true){
                $('.browIndexOneMe').hide();
            }
        } else {
            if(retInfo.data == '在等待队伍中并未找到您的信息!'){
                $('.browIndexOneMe').hide();
            }else{
                alert(retInfo.data)
            }

        }
    }
}
/*
function callback() {
    //alert('分享成功goShare');
    $('.shareOpenBefore').hide()
    $('.shareOpen').show();
}
*/

