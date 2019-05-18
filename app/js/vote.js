var pageNum = 1;
var totalCount = 0;
var mescroll;
var indexNum = 1;
var time;
var curNavIndex=0;//首页0; 奶粉1; 面膜2; 图书3;
var mescrollArr=new Array(4);//4个菜单所对应的4个mescroll对象
var localDoc = JSON.parse(localStorage.getItem('doc')) || [];
var openId;
var pageLocal = Number(localStorage.getItem('pageNum')) || 1;
var title = 'pick你最尊崇的有德医生，为他投上你宝贵的一票！';
var link = 'https://www.enuo120.com/app/vote/id/23';
var imgUrl = 'https://www.enuo120.com/app/img/vote/voteDoctor.png';  //分享的信息
function init() {
    if (new Date("2018/8/20") <= new Date()) {
        $('.scrollbtn').remove();
        $('.timespan').html('投票结束').addClass('addoverCladss');
        $('.countDownDiv').css('bottom','1.3rem');
        alert('投票结束！\n开奖时间2018年8月20日\n 敬请期待');
    }
    getSign();
    //alert('localStorageopenid'+localStorage.getItem('openid'))
    //alert('getQueryString'+getQueryString('code'))
    if(is_weixn()){ //授权
        if(localStorage.getItem('openid') == 'undefined' && getQueryString('code') == null){
            console.log('开始获取openid');
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx93fbc4fe8202b82b&redirect_uri=https://www.enuo120.com/app/vote.html&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1&uin=MjYxNjMxNDU2MA%3D%3D&key=81fa08b6d59b375f0cd22a100f5df6e9418895a32aec400ca82b5f57b4312e046da6812e7f6abe617199e6ac942c44ab&pass_ticket=Th00gdC0HTon5lHrTWbFfJ9CkZ+p2FLgbJY+EAJSQ6CYfUPvlAhf1L8cauwtwRJlv8cAXhF70E3ylf1Q9b0F7g==';
        }else if(localStorage.getItem('openid') == null && getQueryString('code') == null){
            console.log('开始获取openid');
            //Get.firstCodeGet();
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx93fbc4fe8202b82b&redirect_uri=https://www.enuo120.com/app/vote.html&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1&uin=MjYxNjMxNDU2MA%3D%3D&key=81fa08b6d59b375f0cd22a100f5df6e9418895a32aec400ca82b5f57b4312e046da6812e7f6abe617199e6ac942c44ab&pass_ticket=Th00gdC0HTon5lHrTWbFfJ9CkZ+p2FLgbJY+EAJSQ6CYfUPvlAhf1L8cauwtwRJlv8cAXhF70E3ylf1Q9b0F7g==';
        }else{
            console.log('localStorageopenid'+localStorage.getItem('openid'));
            console.log('getQueryString'+getQueryString('code'));
            //console.log('开始获取到openid');
        }
    }else{
        alert('请到公众号上进行投票');
        $('.scrollbtn').remove();
    }
    //判断倒计时
    var endime = new Date("2018/8/20");
    setInterval(function () {
        var nowtime = new Date();
        time = endime - nowtime;
        if(time <= 0){
            $('.scrollbtn').remove();
            $('.timespan').html('投票结束').addClass('addoverCladss');
            $('.countDownDiv').css('bottom','1.3rem');
        }else{
            var day = parseInt(time / 1000 / 60 / 60 / 24);
            var hour = parseInt(time / 1000 / 60 / 60 % 24);
            var minute = parseInt(time / 1000 / 60 % 60);
            var seconds = parseInt(time / 1000 % 60);
            if(day >= 1){
                $('.timespan').html('距离投票结束还有：'+ (hour + 24) + "时" + minute + "分" + seconds + "秒");
            }else{
                $('.timespan').html('距离投票结束还有：'+ hour + "时" + minute + "分" + seconds + "秒");
            }
        }
    }, 1000);
    //判断上滚下滚
    var scrollTop = 0, now = 0;
    $('#mescroll0').scroll(function () {
        scrollTop = $(this).scrollTop();
        if (now < scrollTop) {
            $('.scrollbtn').fadeOut();
            $('.countDownDiv').fadeIn();
            console.log('下滚')
        } else {
            $('.scrollbtn').fadeIn();
            $('.countDownDiv').fadeOut();
            console.log('上滚')
        }
        setTimeout(function () {
            now= scrollTop;
        }, 0)
    });
    //localStorage.removeItem('doc');
    //alert(localStorage.removeItem('doc'))
    //Choose.getOpenId();
    //codeStroage = getQueryString('code');
    //初始化首页
    mescrollArr[0]=initMescroll("mescroll0", "dataList0");
    if(localDoc.length >= 3){
        //$('.scrollbtn').fadeIn();
        $('.chooseDoc').hide();
        $('.sureVote').show();
    }
    //initPageScroll()
    $(".mubu,.payclose").click(function(){
        $('.modelOpen,.successOpen').hide();
    });
    $(".level").click(function(){
        Choose.level()
    });
    $('.levelClick').click(function () {
        console.log($(this).attr('i'))
        var iIndex = $(this).attr('i');
        switch (iIndex){
            case '0':
                //$('.chooseDoc,.sureVote').hide();
                $('.scrollbtn').show();
                break;
            case '1':
                $('.scrollbtn').hide();
                break
            case '2':
                $('.scrollbtn').hide();
                break;
        }
        if($(this).hasClass('borderActive')){
           // $(this).removeClass('borderActive');
            $('#dataList').empty();
            var page = {num: 1, size: 5, type: getQueryString('type'),keyword: getQueryString('val'),beautySubjectId:$('.borderActive').attr('levelId')}
            // mescroll.resetUpScroll();
            //mescrollArr[0].setPageNum(1)
            //getListData(page)
        }else{
            $('.levelClick').removeClass('borderActive');
            $(this).addClass('borderActive');
            $('#dataList').empty();
            var page = {num: 1, size: 5, type: getQueryString('type'),keyword: getQueryString('val'),beautySubjectId:$('.borderActive').attr('levelId')}
            // mescroll.resetUpScroll();
            //mescrollArr[0].setPageNum(1)
            //getListData(page)
        }
    });
    $('.searchVoteBtn').click(function () {
        var page = {num: 1, size: 5,name: $('.voteSou').val()}
        // mescroll.resetUpScroll();
        mescrollArr[0].setPageNum(1)
        getListData(page)
    });
    /*初始化菜单*/
    $(".slide ul li").click(function(){
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
            if(curNavIndex != 2){
                if(mescrollArr[i]==null) mescrollArr[i]=initMescroll("mescroll"+i, "dataList"+i)
            }else{
               // window.location.href = "voteIntro.html";
            }
        }
    })
   /* $(".mubuxiala").click(function(){
        $('.mubuxiala').hide();
        $('.levelLong').removeClass('grade-w-rollRight');
    })*/
}
/*var Get = {
    firstCodeGet: function () {  //无code请求
        var url = SERVER_ADDR + '/app/common/authorization';
        var Data = '';
        if (SERVER_ADDR == 'http://www.enuo120.com') {
            ajaxGetRetInfo(url, Data, this.firstCodeGetSuccess, '请求失败', 'GET', undefined, undefined);
        }
    },
    firstCodeGetSuccess: function (retInfo) {
        console.log('第一次后去结束');
        console.log(retInfo)
        /!*retInfo = JSON.parse(retInfo);*!/
        if (retInfo.success == true) {
            console.log(retInfo.data.isWxUser);
            if (retInfo.data.isWxUser == false) {
                var indexHref = window.location.href;
                var str = retInfo.data.redirectUrl;
                str = str.replace(/REDIRECT_URI/, encodeURI(indexHref));
                sessionStorage.setItem("codeValue", 'true');
                window.location.href = str;
            } else if (retInfo.data.isWxUser == true) {
                //follow.wecat();
            }
        } else if (retInfo.success == false) {
            document.write(retInfo.data);
        }
    },

    haveCodeGet: function () {  //有code请求
        localStorage.setItem('code', getQueryString('code'));
        var url = SERVER_ADDR + '/app/common/authorization';
        var Data = {};
        Data.code = getQueryString('code');
        /!*if(SERVER_ADDR == 'http://www.enuo120.com'){*!/
        ajaxGetRetInfo(url, Data, this.checkCodeSuccess, '请求失败', 'GET', undefined, undefined);
        /!*}*!/
    },
    checkCodeSuccess: function (retInfo) {
        console.log(retInfo)
        localStorage.setItem('openid',retInfo.data.openId);
        //follow.wecat();
    }
}*/
function initPageScroll() {
    for(var i=1;i<localStorage.getItem('pageNum');i++){
        getListDataFromNet(curNavIndex,i, 10,'', function(data){
            //联网成功的回调,隐藏上拉加载的状态
            console.log("data.length="+data.length);
            mescrollArr[curNavIndex].endSuccess(data.length);//传参:数据的总数; mescroll会自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
            //设置列表数据
            setListData(data);
        }, function(){
            //联网失败的回调,隐藏上拉加载的状态
            mescrollArr[curNavIndex].endErr();
        });
    }
}
//获取选择筛选
var Choose = {
    level:function () {
        if( $('.level').attr('ajax') == 'true'){
            return
        }
        var url = SERVER_ADDR + '/common/getProductCategorys.json'; //'http://www.yinliuta.com/activity/checkWxAccount';
        var Data = {};
        if(getQueryString('type') == null){
            $('.chooseFen').hide();
            $('#mescroll').css('top','2.7rem')
        }
        Data.type = getQueryString('type');
        ajaxGetRetInfo(url,Data,this.checkSuccess,'请求失败', 'GET', undefined, undefined);
    },
    checkSuccess:function (retInfo) {
        if(retInfo.success == true){
            console.log(retInfo)
            $('.swiper-slide-duplicate').remove();
            if(retInfo.data.length === 0){
                $('.chooseFen').hide();
                $('#mescroll').css('top','2.7rem');
            }else if(retInfo.data.length > 0 && retInfo.data.length <= 8 ){
                if(retInfo.data.length === 1){
                    $('.chooseFen').hide();
                    $('#mescroll').css('top','2.7rem');
                }else{
                    $('.swiper-slide-prev1,.swiper-slide-prev2').remove();
                }
            }else if(retInfo.data.length > 8 && retInfo.data.length <= 16 ){
                $('.swiper-slide-prev2').remove();
            }
            retInfo.data.forEach(function (value,index) {
                console.log(value,index)
                var html = '';
                html += "<li class='levelClick' levelid='"+value.id+"'><span style='display: block'><img style='width: 2.3rem;' src='/app/img/findspeialLogo/"+value.id+".png'></span>" +
                    "<span style='display: block'>"+value.name+"</span>" +
                    "</li> " ;
                $('.slide ul').append(html);
            });
            totalCount = retInfo.totalCount;
        }else{
            alert('请求数据有错')
        }
    },
    subsubject: function () {
        if( $('.subChildRoom').attr('ajax') == 'true'){
            return
        }
        var url = SERVER_ADDR + '/app/common/getSubSubjectList.json'; //'http://www.yinliuta.com/activity/checkWxAccount';
        var Data = {};
        Data.subjectId = getQueryString('subjectId');
        ajaxGetRetInfo(url, Data, this.checkSubsubjectSuccess, '请求失败', 'GET', true, undefined);
    },
    checkSubsubjectSuccess:function (retInfo) {
        if(retInfo.success == true){
            console.log(retInfo);
            if(retInfo.data.length === 0){
               $('.subjectLong').removeClass('grade-w-roll');
                $('.mubuxiala').hide();
                alert('暂无子科室可选择')
            }
            retInfo.data.forEach(function (value) {
                console.log(value)
                var html = '';
                html += '<li class="subsubjectClick" subsubId="'+value.id+'">'+value.name+'</li>'
                $('.subjectLongSort').append(html);
            })
            $('.subChildRoom').attr('ajax','true')
            $('.subsubjectClick').click(function () {
                $('.subjectLong').removeClass('grade-w-roll');
                $('.mubuxiala').hide();
                $('.subText').text($(this).text()).attr('subsubId',$(this).attr('subsubId'));
                $('#dataList').empty();
                var page = {num: 1, size: 5, subjectId: getQueryString('subjectId'),subSubjectId:$('.subText').text()}
                // mescroll.resetUpScroll();
                mescroll.setPageNum(1)
                getListData(page)
            })
          /*  $('#loading').remove();*/
            totalCount = retInfo.totalCount;
        }else{
            alert('请求数据有错')
        }
    },
    yanzhenOpen:function () {
        $('.yanzhenOpen').show();
        $('.yanzhenVal').focus();
        //Choose.getCheckCode();
        $('#codeImg').attr('src',SERVER_ADDR + '/app/vote/captcha');
    },
    repeatGetCheckCode:function (obj) {
        $(obj).attr('src',SERVER_ADDR + '/app/vote/captcha?'+Math.random());
    },
    /*getOpenId:function () {
        var url = SERVER_ADDR + '/app/vote/authorization';
        var Data = {};
        Data.code = codeStroage;
        ajaxGetRetInfo(url,Data,this.getOpenIdSuccess,'请求失败', 'POST', undefined, undefined);
    },
    getOpenIdSuccess:function (retInfo) {
        if(retInfo.success == true){
            openId = retInfo.data;
            localStorage.setItem('openid',openId);
            alert('openid----' + localStorage.getItem('openid'));
        }else{
            alert(retInfo.data)
        }
    },*/
    sureVote:function () {
        console.log(localStorage.getItem('openid'));
        var url = SERVER_ADDR + '/app/vote/saveVoteLog'; //'http://www.yinliuta.com/activity/checkWxAccount';
        var Data = {};
        Data.ids = Choose.getVoteLogs();
        Data.openId = localStorage.getItem('openid');
        Data.verify = $('.yanzhenVal').val();
        ajaxGetRetInfo(url,Data,this.sureVoteSuccess,'请求失败', 'POST', undefined, undefined);
    },
    sureVoteSuccess:function (retInfo) {
        if(retInfo.success == true){
            console.log(retInfo);
            Choose.chceckLogin();
            $('.successOpen').show();
            localStorage.removeItem('doc');
            localDoc = [];
        }else{
            alert(retInfo.data)
        }
    },
    getVoteLogs:function () {
        var voteLogs = [];
        JSON.parse(localStorage.getItem('doc')).forEach(function (value) {
            voteLogs.push(value);
        });
        voteLogs = voteLogs.join(',');
        return voteLogs;
    },
    chceckLogin:function () {
        var url = SERVER_ADDR + '/app/vote/isLogin';
        var Data = '';
        ajaxGetRetInfo(url,Data,this.chceckLoginSuccess,'请求失败', 'GET', undefined, undefined);
    },
    chceckLoginSuccess:function (retInfo) {
        if(retInfo.success == true){
            $('.toYuyueno').hide();
            $('.toYuyue').text('知道啦').attr('onclick','window.location.reload()').css('left','36.5%');
        }else{
            //alert(retInfo.data)
        }
    },
}

/*创建MeScroll对象*/
function initMescroll(mescrollId,clearEmptyId){
    //创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,刷新列表数据;
    var mescroll = new MeScroll(mescrollId, {
        //上拉加载的配置项
        up: {
            callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
            noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
            empty: {
                icon: "option/mescroll-empty.png", //图标,默认null
                tip: "亲,暂无结果~", //提示
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

/*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
function getListData(page){
    console.log(page)
    page.size = 10;
    if(page.goCount == 1){
        page.name = '';
        $('.voteSou').val('');
        localStorage.removeItem('scrollTop');
    }else{
        page.name = $('.voteSou').val();
    }
    //page.num = page.num ;
    //pageLocal = 0;
    //联网加载数据
    console.log(", page.num="+page.num);
    getListDataFromNet(curNavIndex,page.num, page.size,page.name, function(data){
        //联网成功的回调,隐藏上拉加载的状态
        console.log("data.length="+data.length);
        mescrollArr[curNavIndex].endSuccess(data.length);//传参:数据的总数; mescroll会自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
        //设置列表数据
        setListData(data);
        if(localStorage.getItem('scrollTop')!=null && localStorage.getItem('scrollTop')!= 0 && $('#mescroll0').scrollTop() < localStorage.getItem('scrollTop')){
            $('#mescroll0').scrollTop(localStorage.getItem('scrollTop'));
            //localStorage.removeItem('pageNum');
            //localStorage.removeItem('scrollTop');
        }
    }, function(){
        //联网失败的回调,隐藏上拉加载的状态
        mescrollArr[curNavIndex].endErr();
    });
}
var pageNumbers = 1;
var index = 1;
/*设置列表数据*/
function setListData(data){
    if(pageNumbers == 1){
        $('#dataList1').append('<div class="hos_doc_child htmlDiv clearfix" style="padding-top: 1.5rem;"></div>');
    }
    var listDom=$("#dataList" + curNavIndex);
    console.log('++++++++++++++'+data.length)
    for (var i = 0; i < data.length; i++) {
        var pd=data[i];
        if(curNavIndex == 0){
            switch (pd.title)
            {
                case 'medicalOfficer':
                    pd.title = '医士';
                    break;
                case 'physician':
                    pd.title = '医师';
                    break;
                case 'attendingDoctor':
                    pd.title = '主治医师';
                    break;
                case 'deputyDirector':
                    pd.title = '副主任医师';
                    break;
                case 'director':
                    pd.title = '主任医师';
                    break;
            }
            var str='';
            str += '<div class="hos_doc_child clearfix">' +
                '<p class="docNum">编号:'+pd.id+'</p>'+
                '<div class="doc_child_left" style="text-align: center;" valueid="'+pd.id+'" onclick="docDetailhref(this)"><img src="'+pd.imgUrl+'">' +
                '</div>' +
                '<div class="doc_child_right" style="margin: 0 0 0 0;">' +
                '<div class="id"><p class="name" style="margin-top: .5rem;">'
                if(JSON.parse(localStorage.getItem('doc')) == null){
                    str+= '<input onchange="checkToInput(this)"  valueid="'+pd.id+'" type="checkbox" class="option-input">'
                }else if(JSON.parse(localStorage.getItem('doc')).indexOf(pd.id) != -1){
                    str +='<input onchange="checkToInput(this)" checked  valueid="'+pd.id+'" type="checkbox" class="option-input">' ;
                }else{
                    str+= '<input onchange="checkToInput(this)"  valueid="'+pd.id+'" type="checkbox" class="option-input">'
                }
                str += '<span class="goodsName">'+ pd.name +'</span>' +
                '<span class="oldprice">'+pd.title+'</span>' +
                /*'<span class="yuyue">已预约<span class="peopelcount">'+pd.sellQuantity+'</span>人</span>' +*/
                '</p>' +
                '<p class="address">'+pd.hospitalName+'</p>' +
                '<p><span class="thisVoteCount">'+pd.voteCounts+'票</span>' +
                '</p>' +
                '</div>' +
                '</div>' +
                '</div>';
            //$('.doc_child_left').css('line-height',$('.doc_child_left').height());
            listDom.append(str);
            //$('.doc_child_left').height($('.doc_child_left').width());
            indexNum++;
        }else if(curNavIndex == 1){
            if (i == 0 && pageNumbers == 1) {
                var html = '';
                html += '<div class="rankGood2" style="margin: -.2rem 1% 0 1%;width: 30%">' +
                    '<img style="width: 4.8rem;margin: -.5rem 0 -.9rem 16%;;z-index: 9;' +
                    'position: relative;"  src="img/vote/king.png">' +
                    '<div class="doc_child_left" style="width: 5.7rem;max-height: 5.7rem;float: none;margin-left: 10%;border: 3px solid #fffe03">' +
                    '<img class="docImg" style="height: 5.7rem" src="'+pd.imgUrl+'">' +
                    '</div>' +
                    '<p class="rankGood2Name"  style="font-size: 1.1rem;">' + pd.name + '</p>' +
                    '<p class="rankGood2Count" style="font-size: 1rem">' + pd.voteCounts + '票</p>' +
                    '</div>';
               // $('.doc_child_left').height($('.doc_child_left').width());
                $('.htmlDiv').append(html);
            } else if (i == 1  && pageNumbers == 1) {
                var html = '';
                html += '<div class="rankGood2" style="margin: 1rem 1% 0 10%;">' +
                    '<img style="width: 3rem;margin-left: 1rem"  src="img/vote/num2.png">' +
                    '<div class="doc_child_left" style="width: 4.5rem;max-height: 4.5rem;    float: none;margin-left: 10%;">' +
                    '<img class="docImg" style="height: 4.5rem" src="'+pd.imgUrl+'">' +
                    '</div>' +
                    '<p class="rankGood2Name">' + pd.name + '</p>' +
                    '<p class="rankGood2Count">' + pd.voteCounts + '票</p>' +
                    '</div>';
                //$('.doc_child_left').height($('.doc_child_left').width());
                $('.htmlDiv').prepend(html);
            }else if(i == 2  && pageNumbers == 1) {
                var html = '';
                html += '<div class="rankGood2" style="margin: 1rem 1% 0 1%;">' +
                    '<img style="width: 3rem;margin-left: 1rem"  src="img/vote/num3.png">' +
                    '<div class="doc_child_left" style="width: 4.5rem;max-height: 4.5rem;    margin-left: 10%;float: none;">' +
                    '<img class="docImg" style="height: 4.5rem" src="'+pd.imgUrl+'">' +
                    '</div>' +
                    '<p class="rankGood2Name">' + pd.name + '</p>' +
                    '<p class="rankGood2Count">'+pd.voteCounts+'票</p>' +
                    '</div>';
               // $('.doc_child_left').height($('.doc_child_left').width());
                $('.htmlDiv').append(html);
            } else {
                var str = '';
                str += '<div class="hos_doc_child clearfix" onclick="specialhref(this)"><span class="rankNum">' + index + '</span>' +
                    '<div class="doc_child_left" style="margin-top: .8rem"><img class="docImg" src="'+pd.imgUrl+'">' +
                    '</div>' +
                    '<div class="doc_child_right" style="margin: 0 0 0 0;">' +
                    '<div class="id"><span class="name"><span class="docName">' + pd.name + '</span>' +
                    '</span>' +
                    '<span class="totlerank">' + pd.voteCounts + '票</span>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
               // $('.doc_child_left').height($('.doc_child_left').width());
                listDom.append(str);
            }
            index++;
        }
    }

}
function docDetailhref(obj) {
    console.log($(obj).attr('valueid'));
    localStorage.setItem('pageNum',pageNumbers);
    localStorage.setItem('scrollTop',$('#mescroll0').scrollTop());
    window.location.href = 'voteDocDetail.html?id='+ $(obj).attr('valueid');
}
function specialhref(obj) {
    //window.location.href = "special_cp.html?itemId="+ $(obj).attr('specialid');
}
/*联网加载列表数据*/
function getListDataFromNet(curNavIndex,pageNum,pageSize,name,successCallback,errorCallback) {
    console.log(curNavIndex);
    var data = {};
    data.pageNumber = pageNum;
    data.pageSize = pageSize;
    pageNumbers = pageNum;
    if(name != '' && name != undefined){
        data.name = name;
    }
    if(curNavIndex == 1){
        data.sort = 'DESC';
    }
    //延时一秒,模拟联网
    $.ajax({
        type: 'GET',
        url: SERVER_ADDR + '/app/vote/listVoteInfo.json',
        data:data,
        dataType: 'json',
        statusCode:{
            403:function (data) {
                if(data.getResponseHeader('isAuthorization') == 'true'){
                    var str = data.getResponseHeader('userAuthUrl');  //跳去微信授权
                    str = str.replace(/REDIRECT_URI/, encodeURI(window.location.href));  //回跳当前页面
                    sessionStorage.setItem("codeValue", 'true');
                    window.location.href = str;
                }
            }
        },
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
/*function checkTo(obj) {
    console.log($(obj).find('.option-input'))
    if($(obj).find('.option-input').is(":checked") == true){
        $(obj).find('.option-input').prop('checked',false)
    }else{
        $(obj).find('.option-input').prop('checked',true)
    }
}*/
function checkToInput(obj) {
    console.log(localDoc);

    if($(obj).is(":checked") == true){
        if( localDoc.length >= 3){
            $(obj).prop('checked',false);
            $('.warnZi').text('最多只能勾选三个');
            $('.modelOpen').show();
            return
        }
        console.log('选中----' + $(obj).attr('valueid'));
        localDoc.push(Number($(obj).attr('valueid')));
        console.log(localDoc)
        localStorage.setItem('doc',JSON.stringify(localDoc));
        if( JSON.parse(localStorage.getItem('doc')).length == 3){
            $('.chooseDoc').hide();
            $('.sureVote').show();
            $('.scrollbtn').fadeIn();
        }
    }else{
        localDoc.forEach(function (value) {
            console.log(value)
            if(Number($(obj).attr('valueid')) == value){
                console.log('要去删除的local')
                localDoc.removeArrayOne(value);
            }
        })
        localStorage.setItem('doc',JSON.stringify(localDoc));
        console.log('取消选中' + $(obj).attr('valueid') + '删除后：'+JSON.stringify(localDoc));
        if( JSON.parse(localStorage.getItem('doc')).length < 3){
            $('.chooseDoc').show();
            $('.sureVote').hide();
        }
    }
}