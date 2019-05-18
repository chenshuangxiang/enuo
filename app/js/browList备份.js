var pageNum = 1;
var totalCount = 0;
var mescroll;
function init() {
    $('#mescroll').css('top',$('.pub_hearder').height() + $('.neiAbsolut').height() + 80);
    Get.getMyInfo();
    //Get.getOwnInfo();
    if(window.innerHeight > document.body.scrollHeight){
        $('.browDetailBackImg').height(window.innerHeight);
    }else{
        $('.browDetailBackImg').height(document.body.scrollHeight);
    }
    $('.myRankNum').text('我的纹绣团('+ wenxiuNum(getQueryString('id')) + '团)')
    Get.getTeamInfo();

    mescroll = initMeScroll("mescroll", {
        up: {
            clearEmptyId:"dataList",
            isBoth: true, //上拉加载时,如果滑动到列表顶部是否可以同时触发下拉刷新;默认false,两者不可同时触发; 这里为了演示改为true,不必等列表加载完毕才可下拉;
            callback: getListData, //上拉加载的回调
        }
    });
    //判断上滚下滚
    var scrollTop = 0, now = 0;
    $('#mescroll').scroll(function () {
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
}
var Get = {
        getMyInfo:function () {
            var url = SERVER_ADDR + '/groupShopping/user/transactionState';
            var Data = '';
            ajaxGetRetInfo(url, Data, this.getMyInfoSuccess, '请求失败', 'GET', true, undefined);
        },
    getMyInfoSuccess:function (retInfo) {
            console.log(retInfo)
            if (retInfo.success == true) {
                if (retInfo.data.transaction == false) {  //已入团
                    if (retInfo.data.teamId != getQueryString('id')) {
                        window.location.href = 'browList.html?id=' + retInfo.data.teamId + '&type=me';
                    }
                    if(retInfo.data.boolMember == false){
                        $('.scrollbtn').hide();
                    }
                } else if (retInfo.data.transaction == true) {
                    alert('您还没入团，赶紧去参与活动吧！')
                    window.location.href = 'browIndex.html';
                }
            } else {
                if(retInfo.data == '在等待队伍中并未找到您的信息!'){
                    $('.browIndexOneMe,.neiAbsolut').hide();
                    $('#mescroll').css('top',$('.pub_hearder').height()+50);
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
                $('#mescroll').css('top',$('.pub_hearder').height()+50);
                $('.scrollbtn').hide();
            }else{
                alert(retInfo.data)
            }
        }
    },
    getTeamInfo: function () {
        var url = SERVER_ADDR + '/groupShopping/teamInfo';
        var Data = {};
        Data.teamId = getQueryString('id');
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
            if(retInfo.data.countdown == 0){
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
        var Data = '';
        ajaxGetRetInfo(url, Data, this.doOwnSuccess, '请求失败', 'POST', true, undefined);
    },
    doOwnSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            alert('创建团队成功');
            window.location.reload();
        } else {
            alert(retInfo.data);
        }
    },
    getTeamSeachInfo: function () {
        var url = SERVER_ADDR + '/groupShopping/teamInfo';
        var Data = {};
        Data.teamId = $('.toggleSou').val();
        ajaxGetRetInfo(url, Data, this.getTeamSeachInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    getTeamSeachInfoSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            if(retInfo.data.state == 'cancel'){
                alert('此团队已经解散，请选择其他团队加入!')
            }else if(retInfo.data.countdown == 0){
                alert('此团队已经解散，请选择其他团队加入!')
            }else {
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
    getListDataFromNet( page.num, page.size,page.type,page.keyword,page.beautySubjectId, function(data){
        //联网成功的回调,隐藏上拉加载的状态
        console.log("data.length="+data.length);
        mescroll.endSuccess(data.length);//传参:数据的总数; mescroll会自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
        //设置列表数据
        setListData(data);
    }, function(){
        //联网失败的回调,隐藏上拉加载的状态
        mescroll.endErr();
    });
}

/*设置列表数据*/
function setListData(data){
    var listDom=$("#dataList");
    for (var i = 0; i < data.length; i++) {
        var pd=data[i];
        var str='';
        str += '<div class="browListDiv"> ' +
            '<div class="browListDivrankDiv"> ' +
            '<p style="font-size: 1rem;margin: .9rem 2% .7rem 2%;;color: black"><span>纹绣'+ wenxiuNum(String(data[i].id)) +'团</span><span class="pinping">拼团中...</span></p> ' +
            '<div class="rankDivOwn"> ' ;
        str += '<div class="rankDivOwnOne" style="width: 17%;"> ' +
            '<img style="margin-bottom: -.5rem;" class="rankDivOwnImg" src="'+nullWxHeadImgUrl(pd.memberPictures[0])+'"> ' +
            '<img style="width: 82%; margin-top: -1rem;" src="img/browActive/browOwn.png"> ' +
            '</div> ' ;
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

           str += '<img valueid="'+pd.id+'" onclick="hrefDetail(this)" class="enterRank" src="img/browActive/browRead.jpg">'+
            '</div> ' +
            '</div> ' +
            '<div style="clear: both"></div> ' +
            '</div>';
        pageNum++;
        listDom.append(str);
    }
}

var Add = {
    numberOfTeams1: function (retInfo) {
        var str = '<div class="rankDivChild" style="width: 50%;margin-left: 6%;margin-top: 1rem;"> ' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="img/browActive/browChild.png"></div>' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="img/browActive/browChild.png"></div>' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="img/browActive/browChild.png"></div>' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="img/browActive/browChild.png"></div> ' +
            '</div> ';
        return str;
    },
    numberOfTeams2: function (retInfo) {
        var str = '<div class="rankDivChild" style="width: 50%;margin-left: 6%;margin-top: 1rem;"> ' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="'+nullWxHeadImgUrl(retInfo.memberPictures[1])+'"></div>' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="img/browActive/browChild.png"></div>' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="img/browActive/browChild.png"></div>' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="img/browActive/browChild.png"></div> ' +
            '</div> ';
        return str;
    },
    numberOfTeams3: function (retInfo) {
        var str = '<div class="rankDivChild" style="width: 50%;margin-left: 6%;margin-top: 1rem;"> ' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="'+nullWxHeadImgUrl(retInfo.memberPictures[1])+'"></div>' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="'+nullWxHeadImgUrl(retInfo.memberPictures[2])+'"></div>' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="img/browActive/browChild.png"></div>' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="img/browActive/browChild.png"></div> ' +
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
            '<div class="rankDivChildOne" style="width: 23%"><img src="'+nullWxHeadImgUrl(retInfo.memberPictures[1])+'"></div>' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="'+nullWxHeadImgUrl(retInfo.memberPictures[3])+'"></div>' +
            '<div class="rankDivChildOne" style="width: 23%"><img src="'+nullWxHeadImgUrl(retInfo.memberPictures[4])+'"></div> ' +
            '</div> '
        return str;
    },
    numberOfMyTeams1: function (retInfo) {
        $('.shenNum').text(4);
        $('.rankDivOwnImg').attr('src',nullWxHeadImgUrl(retInfo.data.memberPictures[0]));
    },
    numberOfMyTeams2: function (retInfo) {
        $('.zhu').attr('src', nullWxHeadImgUrl(retInfo.data.memberPictures[1]));
        $('.shenNum').text(3);
    },
    numberOfMyTeams3: function (retInfo) {
        $('.zhu').attr('src', nullWxHeadImgUrl(retInfo.data.memberPictures[1]));
        $('.niu').attr('src', nullWxHeadImgUrl(retInfo.data.memberPictures[2]));
        $('.shenNum').text(2);
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
        $('.shenP,.countDownP,.changeRank').hide();
        $('.dingP span').text('已拼成').css('font-size', '1.2rem').css('font-weight', '600');
    }
}


function specialhref(obj) {
    //window.location.href = "special_cp.html?itemId="+ $(obj).attr('specialid');
}
/*联网加载列表数据*/
function getListDataFromNet(pageNum,pageSize,type,keyword,beautySubjectId,successCallback,errorCallback) {
    /*  var url;
      if(subjectId == '' || subjectId == undefined){
          url = SERVER_ADDR + '/app/topthree/doctor/getList.json?pageNumber='+pageNum+'&pageSize='+pageSize;
      }else{
          url = SERVER_ADDR + '/app/topthree/doctor/getList.json?pageNumber='+pageNum+'&pageSize='+pageSize+'&subjectId='+subjectId;
      }*/
    var data = {};
    data.pageNumber = pageNum;
    data.pageSize = pageSize;
    //延时一秒,模拟联网
    $.ajax({
        type: 'GET',
        url: SERVER_ADDR + '/groupShopping/noFull/team',
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
