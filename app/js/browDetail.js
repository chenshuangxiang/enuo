var title = '想着你也需要这个，特意分享跟你一起拼啦！';
var link = window.location.href + '&isShare=true';
var imgUrl = 'https://www.enuo120.com/app/img/pin/toothcoupon.jpg';  //分享的信息
var desc = '不是好东西不会分享给你的，快点进来，急！';

var numberOfTeams;
var myPositionAll;
function init() {
    getSign();
    follow.wecat();
    if(getQueryString('type') == 'me'){  //如果是我的详细信息的
        var meRankHref = '/app/browList.html?id='+Number(getQueryString('id'))+'&type=me';
        $('.changeRank').attr('onclick',"window.location.href = '"+meRankHref+"'").attr('src',"img/pin/toothChangeRank.png");
    }else if(getQueryString('type') == 'nome'){   //如果是查看团队详细信息的
        $('.changeRank').attr('onclick',"Get.addTeam()").attr('src',"img/browActive/enterRank.png");
    }
    if(getQueryString('isShare') == 'true'){   //判断是不是分享进来的
        $('.changeRank').attr('onclick',"Get.addTeam()").attr('src',"img/browActive/enterRank.png");
    }
    if(window.history.length == 1){
        $('.pub_hearder_left').attr("onclick","window.location.href = 'browIndex.html'");
    }
    Get.getUserStatus();
    $('.head_title,title').text('超声洁牙' + wenxiuNum(getQueryString('id')) + '团');
    if(getQueryString('type') == 'me'){
        title = '我在超声洁牙活动'+wenxiuNum(getQueryString('id'))+'团,一起去洁牙吧~';
    }else {
        title = '超声洁牙活动'+wenxiuNum(getQueryString('id'))+'团,一起去洁牙吧~';
    }
  /*  if(window.innerHeight > document.body.scrollHeight){
        $('.browDetailBackImg').height(window.innerHeight);
    }else{
        $('.browDetailBackImg').height(document.body.scrollHeight);
    }*/
}
var Get = {
    getTeamInfo:function (type) {
        var url = SERVER_ADDR + '/groupShopping/teamInfo';
        var Data = {};
        Data.teamNum = getQueryString('id');
        Data.type = type;
        Data.activityId = 10;
        ajaxGetRetInfo(url, Data, this.getTeamInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    getTeamInfoSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            $('.rankDivOwnImg').attr('src',retInfo.data.memberPictures[0]);
            countDown(retInfo.data.countdown); //倒计时毫秒数
            var myPosition = retInfo.data.myPosition;  //
            myPositionAll = retInfo.data.myPosition;
            numberOfTeams = retInfo.data.numberOfTeams;
            if(myPosition >= 0){  //我在这个团
                var meRankHref = '/app/browList.html?id='+Number(getQueryString('id'))+'&type=me';
                $('.changeRank').attr('onclick',"window.location.href = '"+meRankHref+"'").attr('src',"img/pin/toothChangeRank.png");
                $('.toGoYao').show();
                if(retInfo.data.numberOfTeams < 3){
                    if(localStorage.getItem('shareCount') != 1){
                        if(myPosition == 0){  //团长弹幕
                           $('.activityFu').attr('src','img/shareXiumeiOwnImg.png')
                        }
                        $('.shareOpenBefore').show();
                        localStorage.setItem('shareCount','1');
                    }
                }
            }else{
                $('.rankDiv').css('margin-top', '1.2rem');
                $('.changeRank').css('margin-top','1rem');
            }
            if(retInfo.data.captainIsRobot == true){
                //团长是机器人，加入头像
                if(retInfo.data.numberOfTeams == 0){
                    numberOfTeams1(retInfo);
                }else if(retInfo.data.numberOfTeams == 1){
                   numberOfTeams2(retInfo);
                }else if(retInfo.data.numberOfTeams == 2){
                   numberOfTeams3(retInfo);
                }else if(retInfo.data.numberOfTeams == 3){
                    numberOfTeams4(retInfo);
                }else if(retInfo.data.numberOfTeams == 4){
                    numberOfTeams5(retInfo);
                }
                //加入我的标识
               if(myPosition == 0){
                    $('.zhu').after('<img style="width: 45%; margin-top: -4rem;border-radius: 0;border: none" src="img/browActive/browChildMe.png">');
                }else if(myPosition == 1){
                    $('.niu').after('<img style="width: 45%; margin-top: -4rem;border-radius: 0;border: none" src="img/browActive/browChildMe.png">');
                }else if(myPosition == 2){
                    $('.hou').after('<img style="width: 45%; margin-top: -4rem;border-radius: 0;border: none" src="img/browActive/browChildMe.png">');
                }else if(myPosition == 3){
                    $('.long').after('<img style="width: 45%; margin-top: -4rem;border-radius: 0;border: none" src="img/browActive/browChildMe.png">');
                }
            }else if(retInfo.data.captainIsRobot == false){
                //团长不是机器人，加入头像
                if(retInfo.data.numberOfTeams == 1){
                    numberOfTeams1(retInfo);
                }else if(retInfo.data.numberOfTeams == 2){
                    numberOfTeams2(retInfo);
                }else if(retInfo.data.numberOfTeams == 3){
                    numberOfTeams3(retInfo);
                }/*else if(retInfo.data.numberOfTeams == 4){
                    numberOfTeams4(retInfo);
                }else if(retInfo.data.numberOfTeams == 5){
                    numberOfTeams5(retInfo);
                }*/
                if(retInfo.data.myPosition == 0  && retInfo.data.numberOfTeams > 1){
                    $('.changeRank').attr('onclick',"alert('您的团队还有成员，无法换团')");
                }
                //加入我的标识
                if(myPosition == 0){
                    $('.rankDivOwnImg').before('<img style="position: absolute; width: 47.5%;top: .1rem; right: -.7rem;" src="img/browActive/browChildMe.png">');
                }else if(myPosition == 1){
                    $('.zhu').after('<img style="width: 45%; margin-top: -4rem;border-radius: 0;border: none" src="img/browActive/browChildMe.png">');
                }else if(myPosition == 2){
                    $('.niu').after('<img style="width: 45%; margin-top: -4rem;border-radius: 0;border: none" src="img/browActive/browChildMe.png">');
                }else if(myPosition == 3){
                    $('.hou').after('<img style="width: 45%; margin-top: -4rem;border-radius: 0;border: none" src="img/browActive/browChildMe.png">');
                }else if(myPosition == 4){
                    $('.long').after('<img style="width: 45%; margin-top: -4rem;border-radius: 0;border: none" src="img/browActive/browChildMe.png">');
                }
            }
            if(retInfo.data.countdown == 0  && retInfo.data.numberOfTeams < 3){
                $('.dingP span').text('拼团已过期').css('font-size','1.2rem').css('font-weight','600');
                $('.shenP').hide();
                $('.countDownP').empty().text('您可以继续逛团加入').css('margin-top','1rem')
            }
        }else{
            alert(retInfo.data)
        }
    },
    addTeam:function () {   //加入团队
     /*   if(localStorage.getItem('shareAddBeforeOpenBefore') != 1){
            $('.shareAddBeforeOpenBefore').show();
            return;
        }else{*/
            var url = SERVER_ADDR + '/app/user/groupShopping/ln/join/team';
            var Data = {};
            Data.teamNum = getQueryString('id');
             Data.activityId = toothPinActive;
            ajaxGetRetInfo(url, Data, this.addTeamSuccess, '请求失败', 'POST', true, undefined);
        //}
    },
    addTeamSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            //添加团队判断是否拼团成功，成功则去获得奖品
            alert(retInfo.data);
            $('.pub_hearder_left').attr('onclick','window.location.href = "browList.html"');
            window.location.reload();
            /*if(retInfo.data == '拼团成功!'){
                Get.getPinPrize();
            }else{
                $('.pub_hearder_left').attr('onclick','window.location.href = "browIndex.html"');
                if(retInfo.data == '团队添加成功!'){
                    localStorage.setItem('shareCount','0');
                    localStorage.setItem('shareAddBeforeOpenBefore','0');
                }
                alert(retInfo.data);
                window.location.reload();
                //window.location.href = 'browIndex.html';
            }*/
        }else{
            alert(retInfo.data)
        }
    },
    toBuy:function (id) {
      window.location.href = 'browBuyOwn.html?type=qiyuan&teamid=' + id;
    },
    getUserStatus:function () {
        var url = SERVER_ADDR + '/app/user/activityProductOrder/state';
        var Data = {};
        Data.activityProductId = toothActivityProductId;
        ajaxGetRetInfo(url, Data, this.getUserStatusSuccess, '请求失败', 'GET', true, undefined);
    },
    getUserStatusSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            if(retInfo.data.paymentStatus == 'paid'){ // 用户已经支付过的
                Get.getTeamInfo();  //我是换团的
            }else{
                Get.getTeamInfo('look'); //我是看看的
                $('.changeRank').attr('onclick','Get.toBuy('+getQueryString('id')+')');
            }
        }else{
            if(retInfo.data == '尚未登录'){
                Get.getTeamInfo('look'); //我是看看的
                $('.changeRank').attr('onclick','Get.toBuy('+getQueryString('id')+')');
                //window.location.href = 'bind_tel.html';
            }else{
                alert(retInfo.data)
            }
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
            $('.successOpen').show();
        }else{
            $('.pub_hearder_left').attr('onclick','window.location.href = "browIndex.html"');
            alert(retInfo.data)
            window.location.href = 'browIndex.html';
        }
    }
}
function numberOfTeams1(retInfo) {
    $('.shenNum').text(2);
    $('.rankDivOwnImg').attr('src',nullWxHeadImgUrl(retInfo.data.memberPictures[0]));
}
function numberOfTeams2(retInfo) {
    $('.zhu').attr('src',nullWxHeadImgUrl(retInfo.data.memberPictures[1]));
    $('.shenNum').text(1);
}
function numberOfTeams3(retInfo) {
    $('.zhu').attr('src',nullWxHeadImgUrl(retInfo.data.memberPictures[1]));
    $('.niu').attr('src',nullWxHeadImgUrl(retInfo.data.memberPictures[2]));
    $('.activetime').text(new Date(retInfo.data.createDate).Format('yyyy-MM-dd hh:mm:ss'));
    $('.activeEndtime').text(new Date(retInfo.data.modifyDate).Format('yyyy-MM-dd hh:mm:ss'));
    $('.shenP,.countDownP,.changeRank').hide();
    $('.activeTimeP,.activeAddressP').show();
    $('.pingDao').css('width','70%');
    $('.dingP span').text('已拼成').css('font-size','1.2rem').css('font-weight','600');
    //$('.dingP').append('<span class="readJiang" onclick="readJiang()">查看奖品</span>');
    $('.toGoYao').hide();
    //$('.rankDivOwn').css('margin-top','1.2rem');
}
function numberOfTeams4(retInfo) {
    $('.zhu').attr('src',nullWxHeadImgUrl(retInfo.data.memberPictures[1]));
    $('.niu').attr('src',nullWxHeadImgUrl(retInfo.data.memberPictures[2]));
    $('.hou').attr('src',nullWxHeadImgUrl(retInfo.data.memberPictures[3]));
    $('.shenNum').text(1);
}
function numberOfTeams5(retInfo) {
    $('.zhu').attr('src',nullWxHeadImgUrl(retInfo.data.memberPictures[1]));
    $('.niu').attr('src',nullWxHeadImgUrl(retInfo.data.memberPictures[2]));
    $('.hou').attr('src',nullWxHeadImgUrl(retInfo.data.memberPictures[3]));
    $('.long').attr('src',nullWxHeadImgUrl(retInfo.data.memberPictures[4]));

}
function readJiang() {
    window.location.href = 'myBrow.html?index=1';
}
function callback() {
    //alert('分享成功goShare');
    /*if($('.shareOpenBefore').attr('style') == 'display: block;'){  //加入团队后分享回调
        $('.shareOpenBefore').hide();
        $('.shareOpen').show();
    }
    if($('.shareAddBeforeOpenBefore').attr('style') == 'display: block;'){  //加入团队前必须分享回调
        localStorage.setItem('shareAddBeforeOpenBefore','1');
        $('.shareAddBeforeOpenBefore').hide();
    }
    $('.search').show();*/
}
