$(document).ready(function () {
    /*init();*/
    getSign();
    if(getQueryString('open') == 1){
        $('.pinOpen').show();
    }else if(getQueryString('read') == 1){
        Get.getMyInfo();
        $('.pinOpenRead').show();
    }
});
var title = '280就能绣眉你信吗？';
var link = 'https://www.enuo120.com/app/browShare.html';
var imgUrl = 'https://www.enuo120.com/app/img/browActive/browOrder.jpg';  //分享的信息
var desc = 'e诺举办首届纹绣艺术节啦！20多款半永久眉形，多家纹绣机构任意挑选，还不快来看看？';
var mescroll;
var pageIndex = Number(getQueryString('index'));
console.log(pageIndex)
if(pageIndex == 0){
    var curNavIndex=0;//首页0; 奶粉1; 面膜2; 图书3;
    var mescrollArr=new Array(4);//4个菜单所对应的4个mescroll对象
//初始化首页
    mescrollArr[0]=initMescroll("mescroll0", "dataList0");
}else{
    var curNavIndex=pageIndex;//首页0; 奶粉1; 面膜2; 图书3;
    var mescrollArr=new Array(4);//4个菜单所对应的4个mescroll对象
//初始化首页
    mescrollArr[pageIndex]=initMescroll("mescroll"+pageIndex, "dataList"+pageIndex);
    $(".nav .active").removeClass("active");
    $('.nav p').eq(1).addClass("active");
    $("#mescroll0").hide();
    //显示对应的列表
    $("#mescroll"+pageIndex).show();
}

$(function(){
    $('.payclose,.toYuyue').click(function () {
        $('.modelOpen').hide();
    });
    /*   init();*/
    /*	$('.levelClick').click(function () {
            console.log(555)
            $('.levelText').text($(this).text()).attr('levelId',$(this).attr('levelId'));
            $('#dataList').empty();
            var page = {num: 1, size: 5, doctorTypeId: $(this).attr('levelId')}
           // mescroll.resetUpScroll();
            mescroll.setPageNum(1)
            getListData(page)
        })
        $('.subsubjectClick').click(function () {
            $('.subText').text($(this).text()).attr('subsubId',$(this).attr('subsubId'));
            $('#dataList').empty();
            var page = {num: 1, size: 5, subSubjectId: $(this).attr('subsubId')}
            // mescroll.resetUpScroll();
            mescroll.setPageNum(1)
            getListData(page)
        })*/

    //创建MeScroll对象
    /*  mescroll = initMeScroll("mescroll", {
          up: {
              clearEmptyId:"dataList",
              isBoth: true, //上拉加载时,如果滑动到列表顶部是否可以同时触发下拉刷新;默认false,两者不可同时触发; 这里为了演示改为true,不必等列表加载完毕才可下拉;
              callback: getListData, //上拉加载的回调
          }
      });*/

    /*初始化菜单*/
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
});
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
    //联网加载数据
    console.log("curNavIndex="+curNavIndex+", page.num="+page.num);
    getListDataFromNet(curNavIndex, page.num, page.size,function(data){
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

/*设置列表数据*/
function setListData(data){
    var listDom=$("#dataList" + curNavIndex);
    if(curNavIndex == 0){
        if(data.length == 0){
            console.log(5)
            $('.mescroll-empty').append('<div class="goPin">' +
                '<p>您还没有获得入场券</p>' +
                '<button onclick="window.location.href = '+"'browIndex.html'"+'">去拼团吧</button>' +
                '</div>');
        }
        for (var i = 0; i < data.length; i++) {
            var pd = data[i];
            setDataIndex(pd, listDom);
        }
    } else if(curNavIndex == 1){
        for (var i = 0; i < data.length; i++) {
            var pd = data[i];
            setDataIndex(pd, listDom);
            console.log(pd)
        }
    }
    /* listDom.append(str);*/

}
function setDataIndex(pd,listDom) {
    var status;
    if(curNavIndex == 0){
        if(pd.type == 'FIVE_LINE_BROWS' && pd.attachPeoples.length < 2){
            $('.bindFiveOpen').show()
        }
        if(pd.ticketCanUse == true){
            status = '可使用'
        }else{
            status = '不可使用'
        }
        if(pd.orderStatus == 'USED'){
            status = '已使用'
        }
        var str='';
        str += '<li class="hos_child set_box_shadow"> ' +
            '<div class="hos_list_top clearfix"> ' +
            '<div class="yuyueTop"  itemId="'+pd.id+'"><span class="famousName hosName">e诺绣眉艺术节</span>' ;
            if(pd.collageIs == true && pd.ticketCanUse == true){
                str += '<span style="color: #00afa1;text-decoration: underline;margin-left: 11%" onclick="Card.prize()">拼团成功必中奖</span>'
            }
            str += '<span class="yuyueStatus orderStatus">'+status+'</span></div> ' +
            '<div class="orderContent" style="height: auto;"  itemId="'+pd.id+'" > ' +
            '<div class="left" cardId="' + pd.groupShoppingTeamId + '" onclick="Card.hrefDetail(this)"><img src="img/browActive/browOrder.jpg"/></div> ' ;
        str +=    '<div class="right"> ' +
            '<p class="detail"> ' +
            '<span class="name">' + pd.name;
            if(pd.canGetRedEnvelopes == true){
                str += '<span style="color: #00afa1;text-decoration: underline;letter-spacing: 0;float: right" onclick="Card.packet(event)">领取返利红包</span>'
            }
            str += '</span> ' +
            '</p> ' +
            /*'<p class="orderdetailchoose"> ' +
            '<span>已选择：</span><span class="orderdetailchooseName">' + pd.projectName + '</span> <span class="orderdetailchooseCount">×' + pd.quantity + '</span> ' +
            '</p> ' +*/
            '<p class="orderzong" cardId="' + pd.groupShoppingTeamId + '" onclick="Card.hrefDetail(this)"> ' +
            '<span>合计：</span><span class="orderzongfu">￥</span><span class="orderzongPrice">' + pd.price + '</span> ' +
            '</p> ' +
            '<p class="orderdetailchoose" cardId="' + pd.groupShoppingTeamId + '" onclick="Card.hrefDetail(this)"> ' +
            '<span>购买日期：</span><span class="orderdetailchooseName">' + pd.createDate + '</span> ' +
            '</p> ' ;
        if(pd.type == 'FIVE_LINE_BROWS' && pd.attachPeoples.length > 0){  //添加绑卡成员
            pd.attachPeoples.forEach(function (value,index) {
                if(index == 0){
                    str += '<p class="orderdetailchoose">' +
                        '<span>成员信息：</span><span class="orderdetailchooseName">' + value.fullname  +' ' + value.mobile + '</span> '+
                        '</p> ' ;
                }else{
                    str += '<p class="orderdetailchoose">' +
                        '<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="orderdetailchooseName">' + value.fullname  +' ' + value.mobile + '</span> '+
                        '</p> ' ;
                }
            });
        }
        str +='</div> ';
        str += '</div> ' ;
        str += '<div class="orderBottom">订单号：<span class="famousName orderNum">' + pd.sn + '</span>'
        if (pd.ticketCanUse == true) {
            str += '<button style="padding: .4rem 1.5rem;" class="ordercommont" cardId="' + pd.id + '" onclick="Card.useOpen(this)">使用</button>'
        } else if (pd.collageIs == true) {
            if (pd.groupShoppingTeamId) {
                str += '<button style="padding: .4rem 1.5rem;" class="ordercommont" cardId="' + pd.groupShoppingTeamId + '" onclick="Card.hrefDetail(this)">我的团</button>'
            } else if (!pd.groupShoppingTeamId) {
                str += '<button style="padding: .4rem 1.5rem;" class="ordercommont" onclick="window.location.href = '+"'browList.html'"+'">手动选团</button>'
            }
        }
        str +='</div> ';
        str +='</div></li>'

        listDom.append(str);
    }else if(curNavIndex == 1){
        if(pd.isReservation == true){
            status = '已预约'
        }else{
            status = '待预约'
        }
        var str='';
        str += '<li class="hos_child set_box_shadow"> ' +
            '<div class="hos_list_top clearfix"> ' +
            '<div class="yuyueTop"  itemId="'+pd.id+'"><span class="famousName hosName">e诺绣眉艺术节</span>' +
            '<span class="yuyueStatus orderStatus">'+status+'</span>' +
            '</div> ' +
            '<div class="orderContent"  itemId="'+pd.id+'" > ' +
            '<div class="left"><img src="'+pd.headImgUrl+'"/></div> ' ;
        str +=    '<div class="right"> ' +
            '<p class="detail"> ' +
            '<span class="name">' + pd.projectName + '</span> ' +
            '</p> ' +
            /*'<p class="orderdetailchoose"> ' +
            '<span>已选择：</span><span class="orderdetailchooseName">' + pd.projectName + '</span> <span class="orderdetailchooseCount">×' + pd.quantity + '</span> ' +
            '</p> ' +*/
            '<p class="orderzong"> ' +
           /* '<span>合计：</span><span class="orderzongfu">￥</span><span class="orderzongPrice">' + pd.price + '</span> ' +*/
            '</p> ' +
            '<p class="orderdetailchoose"> ' +
            '<span>购买日期：</span><span class="orderdetailchooseName">' + pd.createDate + '</span> ' +
            '</p> ' +
            '</div> '
        str += '</div> ' ;
        str += '<div class="orderBottom">订单号：<span class="famousName orderNum">' + pd.sn + '</span>'
        if (status == '待预约') {  //如果待预约
            str += '<button class="ordercommont" payId="' + pd.id + '" onclick="Order.Yuyue(this)">预约</button> ';
        }
        str +='</div> ';
        str +='</div></li>'

        listDom.append(str);
    }
}
var Order = {
    Yuyue: function (obj) {
        window.location.href = 'pay/dos_yuyue.html?docId=' + $(obj).attr('payId') + '&type=product';
    },

}

/*联网加载列表数据*/
function getListDataFromNet(curNavIndex,pageNum,pageSize,successCallback,errorCallback) {
    /*  var url;
      if(subjectId == '' || subjectId == undefined){
          url = SERVER_ADDR + '/app/topthree/doctor/getList.json?pageNumber='+pageNum+'&pageSize='+pageSize;
      }else{
          url = SERVER_ADDR + '/app/topthree/doctor/getList.json?pageNumber='+pageNum+'&pageSize='+pageSize+'&subjectId='+subjectId;
      }*/
    var data = {};
    var url;
    switch (curNavIndex){
        case 0:
            data.pageNumber = pageNum;
            data.pageSize = pageSize;
            data.status = 'waitPaid';
            url = '/app/embroideryEyebrow/myTicket';
            break;
        case 1:
            url = '/app/embroideryEyebrow/prize';
            break;

    }
    //延时一秒,模拟联网
    $.ajax({
        type: 'GET',
        url: SERVER_ADDR + url,
        data:data,
        dataType: 'json',
        statusCode:{
            403:function (data) {
                if(data.getResponseHeader('isAuthorization') == 'true'){
                    var str = data.getResponseHeader('userAuthUrl');
                    str = str.replace(/REDIRECT_URI/, encodeURI(window.location.href));
                    sessionStorage.setItem("codeValue", 'true');
                    window.location.href = str;
                }else{
                    window.location.href = 'bind_tel.html';
                }
            }
        },
        success: function(data){
            if(data.success == true){
                var data=data.data; // 模拟数据: ../res/pdlist1.js
                var listData=[];
                //根据type  加入不同的数组

                if(curNavIndex==0){  //绣眉入场券
                        for (var i = 0; i < data.length; i++) {
                            listData.push(data[i]);
                        }
                }else if(curNavIndex==1){ // 已获得奖品
                    for (var i = 0; i < data.length; i++) {
                        listData.push(data[i]);
                    }
                }
                //回调
                successCallback(listData);
            }else{
                if(data.data == '该用户尚未参与纹眉活动' || data.data == '尚未支付，暂无信息，请前去订单列表支付'){
                    successCallback([]);
                }else if(data.data == '尚未登录'){
                    window.location.href = 'bind_tel.html';
                }else{
                    alert(data.data);
                }

            }
        },
        error: errorCallback
    });
}

var Card = {
    useOpen: function (obj) {
        $('.modelOpen').show();
        $('.toYuyueno').attr('carid',$(obj).attr('cardId'));
    },
    use: function () {
        if(compareDate()){  //已经到时间了
            if(localStorage.getItem('shareUseBeforeOpenBefore') != 1) {
                $('.shareUseBeforeOpenBefore').show();
                return;
            }else{
                var url = SERVER_ADDR + '/app/embroideryEyebrow/use';
                var Data = {};
                Data.orderId  = $('.toYuyueno').attr('carid');
                ajaxGetRetInfo(url, Data, this.useSuccess, '请求失败', 'GET', true, undefined);
            }
        }else{
            alert('还没到活动时间，请勿使用！');
        }
    },
    useSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            alert(retInfo.data);
            window.location.reload();
        } else {
            alert(retInfo.data);
        }
    },
    hrefDetail: function (obj) {
        if($(obj).attr('cardid') != 'undefined'){
            var id = Number($(obj).attr('cardid'));
            window.location.href = 'browDetail.html?id=' + id + '&type=me'
        }
    },
    prize: function () {
        var url = SERVER_ADDR + '/app/embroideryEyebrow/luckDraw';
        var Data = {};
        Data.collageIs  = true;
        ajaxGetRetInfo(url, Data, this.prizeSuccess, '请求失败', 'GET', true, undefined);
    },
    prizeSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            alert(retInfo.data);
        } else {
            alert(retInfo.data);
        }
    },
    packet: function (event) {
        event.preventDefault();
        var url = SERVER_ADDR + '/app/embroideryEyebrow/redEnvelopes';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.packetSuccess, '请求失败', 'GET', true, undefined);
    },
    packetSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            alert(retInfo.data);
        } else {
            if(retInfo.data == '尚未登录'){
                window.location.href = 'bind_tel.html';
            }else{
                alert(retInfo.data);
            }
        }
    }
}
var Get = {
    getMyInfo: function () {
        var url = SERVER_ADDR + '/groupShopping/user/transactionState';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.getTeamInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    getTeamInfoSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            if (retInfo.data.transaction == false) {  //已入团
                $('.toRead').attr('onclick', "window.location.href = 'browDetail.html?id=" + retInfo.data.teamId + "&type=me'");
            }
        }
    },
    addPeople: function () {
        var result = [];

        if($('.bindName1').val() == $('.bindName2').val()){
            alert('两次输入的姓名不能相同');
            return
        }
        if($('.bindMobile1').val() == $('.bindMobile2').val()){
            alert('两次输入的手机号不能相同');
            return
        }
        $('.addPeopleDiv').each(function (value) {
            if ($(this).find('.bindName').val().trim().length < 2 || !isChn($(this).find('.bindName').val().trim())) {
                alert('为保证您能够正常参与此活动，请输入正确的姓名！');
                return;
            }
            if (checkMobile(/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test($(this).find('.bindMobile').val().trim()) === true, "为保证您能够正常参与此活动，请输入正确的手机号！")) {
                var peopleObj = {};
                peopleObj.fullname = $(this).find('.bindName').val();
                peopleObj.mobile = $(this).find('.bindMobile').val();
                result.push(peopleObj);
            }
        });
        result.join(',');
        console.log(result);
        console.log(result.length);
        if(result.length == 2){
            var url = SERVER_ADDR + '/app/user/attach/orderMember';
            var Data = {};
            Data.orderId = $('.ordercommont').attr('cardid');
            Data.users = JSON.stringify(result);
            ajaxGetRetInfo(url, Data, this.addPeopleSuccess, '请求失败', 'POST', true, undefined);
        }
    },
    addPeopleSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            alert('完善成功');
            window.location.reload();
        }else{
            alert(retInfo.data);
        }
    }

}
function callback() {
        localStorage.setItem('shareUseBeforeOpenBefore','1');
        $('.shareUseBeforeOpenBefore').hide();
}
function checkToInput() {
    if($('.option-input').is(":checked") == true){
        $('.sureAdd').prop('disabled',false);
        $('.sureAdd').css('background-color','#00afa1');
    }else{
        $('.sureAdd').prop('disabled',true);
        $('.sureAdd').css('background-color','#ccc');
    }
}