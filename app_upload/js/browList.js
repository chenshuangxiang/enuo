var pageNumCount = 1;
var totalCount = 0;
var mescroll;
var curNavIndex=0;//首页0; 1;
var mescrollArr=new Array(2);//4个菜单所对应的4个mescroll对象
mescrollArr[0]=initMescroll("mescroll0", "dataList0");
function init() {
    $('#mescroll0,#mescroll1').css('top',$('.pub_hearder').height() + $('.neiAbsolut').height() + $('.nav').height() + 90);

    Get.getMyInfo();
    //Get.getOwnInfo();
    if(window.innerHeight > document.body.scrollHeight){
        $('.browDetailBackImg').height(window.innerHeight);
    }else{
        $('.browDetailBackImg').height(document.body.scrollHeight);
    }
    $('.myRankNum').text('我的超声洁牙团('+ wenxiuNum(getQueryString('id')) + '团)')
    Get.getTeamInfo();
    $(".nav p").click(function(){
        var i=Number($(this).attr("i"));
        if(curNavIndex!=i) {
            //更改列表条件
            $(".nav .active").removeClass("active");
            $(this).addClass("active");
            //隐藏当前列表
            $("#mescroll"+curNavIndex).hide();
            //显示对应的列表
            curNavIndex=i;
            $("#mescroll"+curNavIndex).show();
            //取出菜单所对应的mescroll对象,如果未初始化则初始化
            if(mescrollArr[i]==null) mescrollArr[i]=initMescroll("mescroll"+i, "dataList"+i);
        }
    })
    //判断上滚下滚
    var scrollTop = 0, now = 0;
    $('#mescroll0,#mescroll1').scroll(function () {
        scrollTop = $(this).scrollTop();
        if (now < scrollTop) {
            $('.scrollbtn').fadeOut();
            console.log('下滚')
        } else {
            $('.scrollbtn').fadeIn();
            console.log('上滚')
        }
        setTimeout(function () {
            now= scrollTop;
        }, 0)
    });
    var mobileFirstArray = [137,139,158,150,135,187,159,188,130,156];
    var mobileEndArray = [2453,2478,5310,4256,7541,3310,1011,8745,2411,9695];
    var productGetArray = ['水氧美人体验券','超声洁牙免费体验券','激光祛痣体验券','青春解码体验券','无针水光针体验券'];
    for(var i = 0;i <= 50; i++){
        var mathRadomMobile = Math.ceil(Math.random()*9);
        var mathRadomMobileEnd = Math.ceil(Math.random()*9);
        var mathRadomFive = Math.ceil(Math.random()*4);
        var html = '';
        html += '<li>恭喜'+mobileFirstArray[mathRadomMobile]+'****'+mobileEndArray[mathRadomMobileEnd]+'获得'+productGetArray[mathRadomFive]+'</li>'
        $(".line").append(html);
    }
    $(".line").slideUpGun();
    $(".payclose,.toYuyueno").click(function(){
        $('.modelOpen,.shareOpen').hide();
    });
}
function initMescroll(mescrollId,clearEmptyId){
    //创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,刷新列表数据;
    var mescroll = new MeScroll(mescrollId, {
        //上拉加载的配置项
        up: {
            callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
            noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
            empty: {
                icon: "option/mescroll-empty.png", //图标,默认null
                tip: "抓紧机会，赶快点击参与享特价优惠", //提示
                //btntext: "去逛逛 >", //按钮,默认""
                /* btnClick: function(){//点击按钮的回调,默认null
                     alert("点击了按钮,具体逻辑自行实现");
                 }*/
            },
            toTop: {
                src: "option/mescroll-totop.png" //回到顶部按钮的图片路径
            },
            clearEmptyId: clearEmptyId //相当于同时设置了clearId和empty.warpId; 简化写法;默认null
        }
    });
    return mescroll;
}
/**/
var Get = {
        getMyInfo:function () {
            var url = SERVER_ADDR + '/groupShopping/user/transactionState';
            var Data = {};
            Data.activityId = 10;
            ajaxGetRetInfo(url, Data, this.getMyInfoSuccess, '请求失败', 'GET', true, undefined);
        },
    getMyInfoSuccess:function (retInfo) {
            console.log(retInfo)
            if (retInfo.success == true) {
                if (retInfo.data.transaction == false) {  //已入团
                    if (retInfo.data.teamNum != getQueryString('id')) {
                        window.location.href = 'browList.html?id=' + retInfo.data.teamNum + '&type=me';
                    }
                    if(retInfo.data.boolMember == false){
                        $('.scrollbtn').hide();
                    }
                } else if (retInfo.data.transaction == true) {
                    $('.neiAbsolut').hide();$('.nav').css('top','5.3rem');$('.mescroll').css('top','8.5rem')
                    //alert('您还没入团，赶紧去参与活动吧！')
                    //window.location.href = 'browIndex.html';
                }
            } else {
                if(retInfo.data == '在等待队伍中并未找到您的信息!'){
                    $('.browIndexOneMe,.neiAbsolut').hide();
                    $('.nav').css('top',$('.pub_hearder').height() +45);
                    $('#mescroll0,#mescroll1').css('top',$('.pub_hearder').height() + $('.nav').height() +60);
                    //$('.scrollbtn').hide();
                }else{
                    alert(retInfo.data)
                }

            }
        },
    getOwnInfo:function () {  //是否已经当过旗主  当过未组成不能再当
        var url = SERVER_ADDR + '/groupShopping/user/transactionState';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.getOwnInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    getOwnInfoSuccess:function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            if (retInfo.data.transaction == false) {  //已入团
                if (retInfo.data.teamId != getQueryString('id')) {
                    window.location.href = 'browList.html?id=' + retInfo.data.teamId + '&type=me';
                }
            } else if (retInfo.data.transaction == true) {
                alert('您还没入团，赶紧去参与活动吧！')
                window.location.href = 'browIndex.html';
            }
        } else {
            if(retInfo.data == '在等待队伍中并未找到您的信息!'){
                $('.browIndexOneMe,.neiAbsolut').hide();
                $('.nav').css('top',$('.pub_hearder').height() +45);
                $('#mescroll0,#mescroll1').css('top',$('.pub_hearder').height() + $('.nav').height() +60);
                $('.scrollbtn').hide();
            }else{
                alert(retInfo.data)
            }
        }
    },
    getTeamInfo: function () {
        var url = SERVER_ADDR + '/groupShopping/teamInfo';
        var Data = {};
        Data.teamNum = getQueryString('id');
        Data.type = 'look';
        Data.activityId = 10;
        ajaxGetRetInfo(url, Data, this.getTeamInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    getTeamInfoSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            $('.rankDivOwnImg').attr('src', nullWxHeadImgUrl(retInfo.data.memberPictures[0]));
            countDown(retInfo.data.countdown); //倒计时毫秒数
            var myPosition = retInfo.data.myPosition;  //
            if (retInfo.data.captainIsRobot == true) {
                if (retInfo.data.numberOfTeams == 0) {
                    Add.numberOfMyTeams1(retInfo);
                } else if (retInfo.data.numberOfTeams == 1) {
                    Add.numberOfMyTeams2(retInfo);
                } else if (retInfo.data.numberOfTeams == 2) {
                    Add.numberOfMyTeams3(retInfo);
                } else if (retInfo.data.numberOfTeams == 3) {
                    Add.numberOfMyTeams4(retInfo);
                } else if (retInfo.data.numberOfTeams == 4) {
                    Add.numberOfMyTeams5(retInfo);
                }
                if(myPosition == 0){
                    $('.zhu').before('<img style="position: absolute;width: 87%;top: -.3rem;left: .15rem;border: none;border-radius: 0;" src="img/browActive/browChildMe.png">');
                }else if(myPosition == 1){
                    $('.niu').before('<img style="position: absolute;width: 87%;top: -.3rem;left: .15rem;border: none;border-radius: 0;" src="img/browActive/browChildMe.png">');
                }else if(myPosition == 2){
                    $('.hou').after('<img style="position: absolute;width: 87%;top: 1.8rem;left: .15rem;border: none;border-radius: 0;" src="img/browActive/browChildMe.png">');
                }else if(myPosition == 3){
                    $('.long').after('<img style="position: absolute;width: 87%;top: 1.8rem;left: .15rem;border: none;border-radius: 0;" src="img/browActive/browChildMe.png">');
                }
            } else if (retInfo.data.captainIsRobot == false) {
                if (retInfo.data.numberOfTeams == 1) {
                    Add.numberOfMyTeams1(retInfo);
                } else if (retInfo.data.numberOfTeams == 2) {
                    Add.numberOfMyTeams2(retInfo);
                } else if (retInfo.data.numberOfTeams == 3) {
                    Add.numberOfMyTeams3(retInfo);
                } else if (retInfo.data.numberOfTeams == 4) {
                    Add.numberOfMyTeams4(retInfo);
                } else if (retInfo.data.numberOfTeams == 5) {
                    Add.numberOfMyTeams5(retInfo);
                }
                if(myPosition == 0){
                    $('.rankDivOwnImg').before('<img style="position: absolute; width: 47.5%;top: .1rem; right: -.7rem;" src="img/browActive/browChildMe.png">');
                }else if(myPosition == 1){
                    $('.zhu').before('<img style="position: absolute;width: 87%;top: -.3rem;left: .15rem;border: none;border-radius: 0;" src="img/browActive/browChildMe.png">');
                }else if(myPosition == 2){
                    $('.niu').before('<img style="position: absolute;width: 87%;top: -.3rem;left: .15rem;border: none;border-radius: 0;" src="img/browActive/browChildMe.png">');
                }else if(myPosition == 3){
                    $('.hou').after('<img style="position: absolute;width: 87%;top: 1.8rem;left: .15rem;border: none;border-radius: 0;" src="img/browActive/browChildMe.png">');
                }else if(myPosition == 4){
                    $('.long').after('<img style="position: absolute;width: 87%;top: 1.8rem;left: .15rem;border: none;border-radius: 0;" src="img/browActive/browChildMe.png">');
                }
            }
            if(retInfo.data.countdown == 0 && retInfo.data.numberOfTeams < 5){
                $('.dingP span').text('拼团已过期').css('font-size','1.2rem').css('font-weight','600');
                $('.shenP').hide();
                $('.countDownP').empty().text('您可以继续逛团加入').css('margin-top','1rem')
            }
        } else {
            //alert(retInfo.data)
        }
    },
    doOwn: function () {
        var url = SERVER_ADDR + '/app/user/groupShopping/ln/create/team';
        var Data = {};
        Data.activityId = 10;
        ajaxGetRetInfo(url, Data, this.doOwnSuccess, '请求失败', 'POST', true, undefined);
    },
    doOwnSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            alert('创建团队成功');
            window.location.reload();
        } else {
            if(retInfo.data == '您尚未购买活动项目!'){
                //alert(retInfo.data);
                window.location.href = 'browGoOwnGun.html';
            }else if(retInfo.data == '您的项目订单尚未支付完成!'){
                alert(retInfo.data);
                window.location.href = 'order.html';
            }else{
                alert(retInfo.data);
            }
        }
    },
    getTeamSeachInfo: function () {
        var url = SERVER_ADDR + '/groupShopping/teamInfo';
        var Data = {};
        Data.teamNum = $('.toggleSou').val();
        Data.type = 'look';
        Data.activityId = 10;
        ajaxGetRetInfo(url, Data, this.getTeamSeachInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    getTeamSeachInfoSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            if(retInfo.data.state == 'cancel'){
                alert('此团队已经解散，请选择其他团队加入!')
            }else if(retInfo.data.state == 'full'){
                alert('此团队已经满员，请选择其他团队加入!')
            }else if(retInfo.data.countdown == 0){
                alert('此团队已经过期，请选择其他团队加入!')
            }else{
                window.location.href = 'browDetail.html?id=' +$('.toggleSou').val() + '&type=nome';
            }
        } else {
            alert(retInfo.data)
        }
    }
}
/*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
function getListData(page){
    console.log(page)
    page.size = 10;
    if(getQueryString('type') != null){
        page.type = getQueryString('type');
    }
    if(page.goCount == 1){
        page.keyword = '';
        page.beautySubjectId = '';
    }else{
        page.keyword = getQueryString('val');
        page.beautySubjectId = $('.borderActive').attr('levelId');
    }
    //联网加载数据
    console.log(", page.num="+page.num);
    getListDataFromNet(curNavIndex,page.num, page.size,page.type,page.keyword,page.beautySubjectId, function(data){
        //联网成功的回调,隐藏上拉加载的状态
        console.log("data.length="+data.length);
        mescrollArr[curNavIndex].endSuccess(data.length);///传参:数据的总数; mescroll会自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
        //设置列表数据
        setListData(data);
    }, function(){
        //联网失败的回调,隐藏上拉加载的状态
        mescrollArr[curNavIndex].endErr();
    });
}

/*设置列表数据*/
function setListData(data){
    var listDom = $("#dataList" + curNavIndex);
    if(curNavIndex == 0){
        for (var i = 0; i < data.length; i++) {
            var pd=data[i];
            var str='';
            str += '<div class="browListDiv"> ' +
                '<div class="browListDivrankDiv"> ' +
                '<p style="font-size: 1rem;margin: .9rem 2% .7rem 2%;;color: black"><span>超声洁牙'+ data[i].teamNum +'团</span><span class="pinping">拼团中...</span></p> ' +
                '<div class="rankDivOwn"> ' ;
            str += '<div class="rankDivOwnOne" style="width: 17%;"> ' +
                '<img style="margin-bottom: -.5rem;" class="rankDivOwnImg" src="'+nullWxHeadImgUrl(pd.memberPictures[0])+'"> ' +
                '<img style="width: 82%; margin-top: -1rem;" src="img/pin/toothOwn.png"> ' +
                '</div>' ;
            if(pd.captainIsRobot == true){
                if(pd.numberOfTeams == 0){
                    str += Add.numberOfTeams1(pd);
                }else if(pd.numberOfTeams == 1){
                    str += Add.numberOfTeams2(pd);
                }else if(pd.numberOfTeams == 2){
                    str += Add.numberOfTeams3(pd);
                }else if(pd.numberOfTeams == 3){
                    str += Add.numberOfTeams4(pd);
                }else if(pd.numberOfTeams == 4){
                    str += Add.numberOfTeams5(pd);
                }
            }else if(pd.captainIsRobot == false){
                if(pd.numberOfTeams == 1){
                    str += Add.numberOfTeams1(pd);
                }else if(pd.numberOfTeams == 2){
                    str += Add.numberOfTeams2(pd);
                }else if(pd.numberOfTeams == 3){
                    str += Add.numberOfTeams3(pd);
                }else if(pd.numberOfTeams == 4){
                    str += Add.numberOfTeams4(pd);
                }else if(pd.numberOfTeams == 5){
                    str += Add.numberOfTeams5(pd);
                }
            }
            str += '<img valueid="'+pd.teamNum+'" onclick="hrefDetail(this)" class="enterRank" src="img/browActive/browRead.jpg">'+
                '</div> ' +
                '</div> ' +
                '<div style="clear: both"></div> ' +
                '</div>';
            listDom.append(str);
        }
    }else if(curNavIndex == 1){
        var data = [];
        for (var i = 0; i < data.length; i++) {
            var firstMath = Math.floor(Math.random()*3) + 1; //用做团长是否要自定义头像
            var hundredMath  = Math.floor(Math.random()*200) + 1;
            var pd=data[i];
            var str='';
            str += '<div class="browListDiv"> ' +
                '<div class="browListDivrankDiv"> ' +
                '<p style="font-size: 1rem;margin: .9rem 2% .7rem 2%;;color: black"><span style="width: 4px;height: 1.1rem;background-color: #00ad9f;display: inline-block"></span><span class="pinping" style="float: none;vertical-align: top;margin-left: 5px;font-size: 1rem;">已拼成</span></p> ' +
                '<div class="rankDivOwn"> ' ;
            str += '<div class="rankDivOwnOne" style="width: 17%;"> '
            console.log(firstMath)
            if(pageNumCount <= 250){
                if(firstMath != 1){ //要加头像
                    str += '<img style="margin-bottom: -.5rem;" class="rankDivOwnImg" src="img/browActive/headimg/'+hundredMath+'.jpg"> '
                }else{
                    str += '<img style="margin-bottom: -.5rem;" class="rankDivOwnImg" src="'+nullWxHeadImgUrl(pd.memberPictures[0])+'"> '
                }
            }else{
                str += '<img style="margin-bottom: -.5rem;" class="rankDivOwnImg" src="'+nullWxHeadImgUrl(pd.memberPictures[0])+'"> '
            }
                str += '<img style="width: 82%; margin-top: -1rem;" src="img/pin/toothOwn.png"> ' +
                '</div>' ;

            str += Add.successOfTeams(pd);

            str += '<span class="enterRank" style="width: initial;margin: 1.7rem -2% 0 0;font-size: .9rem;">耗时'+countHao(pd.successSpendTime)+'</span>'+
                '</div> ' +
                '</div> ' +
                '<div style="clear: both"></div> ' +
                '</div>';
            pageNumCount++;
            listDom.append(str);
        }
    }
}

var Add = {
    numberOfTeams1: function (retInfo) {
        var str = '<div class="rankDivChild" style="width: 50%;margin-left: 6%;margin-top: 1rem;"> ' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="img/browActive/browChild.png"></div>' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="img/browActive/browChild.png"></div>' +
           /* '<div class="rankDivChildOne" style="width: 23%"><img src="img/browActive/browChild.png"></div>' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="img/browActive/browChild.png"></div> ' +*/
            '</div> ';
        return str;
    },
    numberOfTeams2: function (retInfo) {
        var str = '<div class="rankDivChild" style="width: 50%;margin-left: 6%;margin-top: 1rem;"> ' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="'+nullWxHeadImgUrl(retInfo.memberPictures[1])+'"></div>' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="img/browActive/browChild.png"></div>' +
           /* '<div class="rankDivChildOne" style="width: 23%"><img src="img/browActive/browChild.png"></div>' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="img/browActive/browChild.png"></div> ' +*/
            '</div> ';
        return str;
    },
    numberOfTeams3: function (retInfo) {
        var str = '<div class="rankDivChild" style="width: 50%;margin-left: 6%;margin-top: 1rem;"> ' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="'+nullWxHeadImgUrl(retInfo.memberPictures[1])+'"></div>' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="'+nullWxHeadImgUrl(retInfo.memberPictures[2])+'"></div>' +
          /*  '<div class="rankDivChildOne" style="width: 23%"><img src="img/browActive/browChild.png"></div>' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="img/browActive/browChild.png"></div> ' +*/
            '</div> ';
        return str;
    },
    numberOfTeams4: function (retInfo) {
        var str = '<div class="rankDivChild" style="width: 50%;margin-left: 6%;margin-top: 1rem;"> ' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="'+nullWxHeadImgUrl(retInfo.memberPictures[1])+'"></div>' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="'+nullWxHeadImgUrl(retInfo.memberPictures[2])+'"></div>' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="'+nullWxHeadImgUrl(retInfo.memberPictures[3])+'"></div>' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="img/browActive/browChild.png"></div> ' +
            '</div> ';
        return str;
    },
    numberOfTeams5: function (retInfo) {
        var str = '<div class="rankDivChild" style="width: 50%;margin-left: 6%;margin-top: 1rem;"> ' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="'+nullWxHeadImgUrl(retInfo.memberPictures[1])+'"></div>' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="'+nullWxHeadImgUrl(retInfo.memberPictures[2])+'"></div>' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="'+nullWxHeadImgUrl(retInfo.memberPictures[3])+'"></div>' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="'+nullWxHeadImgUrl(retInfo.memberPictures[4])+'"></div> ' +
            '</div> '
        return str;
    },
    numberOfMyTeams1: function (retInfo) {
        $('.shenNum').text(2);
        $('.rankDivOwnImg').attr('src',nullWxHeadImgUrl(retInfo.data.memberPictures[0]));
    },
    numberOfMyTeams2: function (retInfo) {
        $('.zhu').attr('src', nullWxHeadImgUrl(retInfo.data.memberPictures[1]));
        $('.shenNum').text(1);
    },
    numberOfMyTeams3: function (retInfo) {
        $('.zhu').attr('src', nullWxHeadImgUrl(retInfo.data.memberPictures[1]));
        $('.niu').attr('src', nullWxHeadImgUrl(retInfo.data.memberPictures[2]));
        $('.shenNum').text(2);
        $('.shenP,.countDownP,.changeRank').hide();
        $('.dingP span').text('已拼成').css('font-size', '1.2rem').css('font-weight', '600');
    },
    numberOfMyTeams4: function (retInfo) {
        $('.zhu').attr('src', nullWxHeadImgUrl(retInfo.data.memberPictures[1]));
        $('.niu').attr('src', nullWxHeadImgUrl(retInfo.data.memberPictures[2]));
        $('.hou').attr('src', nullWxHeadImgUrl(retInfo.data.memberPictures[3]));
        $('.shenNum').text(1);
    },
    numberOfMyTeams5: function (retInfo) {
        $('.zhu').attr('src', nullWxHeadImgUrl(retInfo.data.memberPictures[1]));
        $('.niu').attr('src', nullWxHeadImgUrl(retInfo.data.memberPictures[2]));
        $('.hou').attr('src', nullWxHeadImgUrl(retInfo.data.memberPictures[3]));
        $('.long').attr('src',nullWxHeadImgUrl(retInfo.data.memberPictures[4]));
    },
    successOfTeams: function (retInfo) {
        var str = '';
        var firstMath = Math.floor(Math.random()*3) + 1; //用做团员是否要自定义头像
        str += '<div class="rankDivChild" style="width: 50%;margin-left: 6%;margin-top: 1rem;"> ' ;
        if(pageNumCount <= 250){
            if(firstMath != 1){
                var hundredMath  = Math.floor(Math.random()*200) + 1;
                str += '<div class="rankDivChildOne" style="width: 23%"><img src="img/browActive/headimg/'+hundredMath+'.jpg"></div>'
            }else{
                str += '<div class="rankDivChildOne" style="width: 23%"><img src="'+nullWxHeadImgUrl(retInfo.memberPictures[1])+'"></div>'
            }
        }else{
            str += '<div class="rankDivChildOne" style="width: 23%"><img src="'+nullWxHeadImgUrl(retInfo.memberPictures[1])+'"></div>'
        }
        if(pageNumCount <= 250){
            var firstMath = Math.floor(Math.random()*3) + 1; //用做团员是否要自定义头像
            if(firstMath != 1){
                var hundredMath  = Math.floor(Math.random()*200) + 1;
                str += '<div class="rankDivChildOne" style="width: 23%"><img src="img/browActive/headimg/'+hundredMath+'.jpg"></div>'
            }else{
                str += '<div class="rankDivChildOne" style="width: 23%"><img src="'+nullWxHeadImgUrl(retInfo.memberPictures[2])+'"></div>'
            }
        }else{
            str += '<div class="rankDivChildOne" style="width: 23%"><img src="'+nullWxHeadImgUrl(retInfo.memberPictures[2])+'"></div>'
        }
     /*   if(pageNumCount <= 250){
            var firstMath = Math.floor(Math.random()*3) + 1; //用做团员是否要自定义头像
            if(firstMath != 1){
                var hundredMath  = Math.floor(Math.random()*200) + 1;
                str += '<div class="rankDivChildOne" style="width: 23%"><img src="img/browActive/headimg/'+hundredMath+'.jpg"></div>'
            }else{
                str += '<div class="rankDivChildOne" style="width: 23%"><img src="'+nullWxHeadImgUrl(retInfo.memberPictures[3])+'"></div>'
            }
        }else{
            str += '<div class="rankDivChildOne" style="width: 23%"><img src="'+nullWxHeadImgUrl(retInfo.memberPictures[3])+'"></div>'
        }
        if(pageNumCount <= 250){
            var firstMath = Math.floor(Math.random()*3) + 1; //用做团员是否要自定义头像
            if(firstMath != 1){
                var hundredMath  = Math.floor(Math.random()*200) + 1;
                str += '<div class="rankDivChildOne" style="width: 23%"><img src="img/browActive/headimg/'+hundredMath+'.jpg"></div>'
            }else{
                str += '<div class="rankDivChildOne" style="width: 23%"><img src="'+nullWxHeadImgUrl(retInfo.memberPictures[4])+'"></div>'
            }
        }else {
            str += '<div class="rankDivChildOne" style="width: 23%"><img src="'+nullWxHeadImgUrl(retInfo.memberPictures[4])+'"></div>'
        }*/
        str +='</div> '
        return str;
    }
}


function specialhref(obj) {
    //window.location.href = "special_cp.html?itemId="+ $(obj).attr('specialid');
}
/*联网加载列表数据*/
function getListDataFromNet(curNavIndex,pageNum,pageSize,type,keyword,beautySubjectId,successCallback,errorCallback) {
    /*  var url;
      if(subjectId == '' || subjectId == undefined){
          url = SERVER_ADDR + '/app/topthree/doctor/getList.json?pageNumber='+pageNum+'&pageSize='+pageSize;
      }else{
          url = SERVER_ADDR + '/app/topthree/doctor/getList.json?pageNumber='+pageNum+'&pageSize='+pageSize+'&subjectId='+subjectId;
      }*/
    var curNavIndex = curNavIndex;
    var data = {};
    data.pageNumber = pageNum;
    data.pageSize = pageSize;
    var url;
    if(curNavIndex == 0){
        url = '/groupShopping/noFull/team';
        data.activityId = 10;
    }else if(curNavIndex == 1){
        url = '/groupShopping/full/team';
        data.activityId = 10;
        if(pageNumCount < 250){
            data.getIsTrue = false;
        }else{
            data.getIsTrue = true;
            data.pageNumber = Number(pageNum - 25);
        }
    }
    //延时一秒,模拟联网
    $.ajax({
        type: 'GET',
        url: SERVER_ADDR + url,
        data:data,
        dataType: 'json',
        success: function(data){
            if(data.success == true){
                var data=data.data; // 模拟数据: ../res/pdlist1.js
                var listData=[];
                //pdType 全部商品0; 奶粉1; 图书2;
                //奶粉
                for (var i = 0; i < data.length; i++) {
                    listData.push(data[i]);
                }

                //回调
                successCallback(listData);
            }else{
                alert(data.data);
            }
        },
        error: errorCallback
    });
}
function hrefSouDetail() {
    if(isNaN($('.toggleSou').val()) == true && $('.toggleSou').val().length != 3){
        alert('请输入正确的团号进行搜索！如：001');
        return
    }else{
        Get.getTeamSeachInfo()
    }
}
function hrefDetail(obj) {
    window.location.href = 'browDetail.html?id=' +$(obj).attr('valueid') + '&type=nome';
}
