
var totalCount = 0;
var mescroll;
var areaId;
var areaName;
$(function(){
    init();
    Choose.cityOpen(localStorage.getItem('city'),localStorage.getItem('province'));
    if(getQueryString('hosId') == 6){
        $('.dov_nav').hide();
        $('#mescroll').css('top','2.7rem')
    }
    if(is_weixn()){
        getSign();
    }else{
        baiduLocation();
    }
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
    /*  $('.sou').click(function () {
          $('#dataList').empty();
          $('.sou').attr('sou',$('.toggleSou').val());
          var page = {num: 1, size: 10, keyword: $('.sou').attr('sou')}
          // mescroll.resetUpScroll();
          mescroll.setPageNum(1)
          getListData(page)
      })*/
    //创建MeScroll对象
    /*$('.sou').attr('sou', '')*/
    //创建MeScroll对象
    mescroll = initMeScroll("mescroll", {
        up: {
            clearEmptyId:"dataList",
            isBoth: true, //上拉加载时,如果滑动到列表顶部是否可以同时触发下拉刷新;默认false,两者不可同时触发; 这里为了演示改为true,不必等列表加载完毕才可下拉;
            callback: getListData, //上拉加载的回调
        }
    });

    /*初始化菜单*/
    //var pdType=0;//全部商品0; 奶粉1; 图书2;
    /*	$(".nav p").click(function(){
            var i=$(this).attr("i");
            if(pdType!=i) {
                //更改列表条件
                pdType=i;
                $(".nav .active").removeClass("active");
                $(this).addClass("active");
                //重置列表数据
                mescroll.resetUpScroll();
            }
        })*/



});
/*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
function getListData(page){
    console.log(page)
    page.size = 10;
    if(page.goCount == 1){
        page.keyword = '';
        if(localStorage.getItem("province") != null && localStorage.getItem("city") != null){
            $('.subText').text(areaName).attr('subsubid',areaId);
        }else{
            $('.subText').text('杭州市').attr('subsubid','330100');
        }
        $('.levelText').text('全部').attr('levelid','');
    }else{
        page.keyword = getQueryString('val');
    }
    page.areaId = $('.subText').attr('subsubId');
    if(getQueryString('hosId') == 6){
        page.hospitalTypeId = 6;
    }else{
        page.hospitalTypeId = $('.levelText').attr('levelId');
    }

    //page.hospitalTypeId = getQueryString('hosId');//医美入口进还是医院入口进
    //联网加载数据
    console.log(", page.num="+page.num);
    getListDataFromNet( page.num, page.size,page.keyword, page.areaId,page.hospitalTypeId, function(data){
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
        str += '<li class="hos_child set_box_shadow ulli" hosId="'+pd.id+'" onclick="href(this)">' ;
        if(pd.businesStatus == 'normal' || pd.businesStatus == undefined){
            str += '<div class="hos_list_top clearfix">' ;
        }else if(pd.businesStatus == 'violate'){
            str += '<div class="hos_list_top clearfix" style="background: url('+"../../app/img/violate.png"+') 100% 46% / 30% no-repeat">' ;
        }else if(pd.businesStatus == 'closed'){
            str += '<div class="hos_list_top clearfix" style="background: url('+"../../app/img/closedHos.png"+') 100% 46% / 30% no-repeat">' ;
        }
        str +='<div class="left"><img src="'+pd.headImgUrl+'"/></div>' +/*<img src="'+pd.headImgUrl+'"/>*/
            '<div class="right">' +
            '<p class="detail">' +
            '<span class="name">'+pd.name+'</span>' ;
            if(Number(pd.distance) < 1000){
                str +='<span class="diatance">'+pd.distance+'m</span>';
            }else if(Number(pd.distance) >= 1000){
                str +='<span class="diatance">'+(Number(pd.distance)/1000).toFixed(1)+'km</span>';
            }else if(pd.distance == undefined){
                //str +='<span style="color: #00afa1">'+pd.distance+'</span>';
            }
            str += '</p>' +
            '<p>' +
            '<span>地址：</span><span>'+pd.address+'</span>' +
            '</p>' +
            '<p>' +
            '<span>等级：</span><span style="display: inline-block;margin-right: 7%">'+pd.hospitalLevel+'</span><span>医保：</span><span>'+pd.medicareTypeName+'</span>' +
            '</p>' +
           /* '<p>' +
            '<span>预约：</span><span class="peopelCount">'+pd.orderQuantity+'人</span>' +
            '</p>' +*/
            '</div>' +
            '</div></li>'

        /*	var liDom=document.createElement("li");
            liDom.innerHTML=str;
            listDom.appendChild(liDom);*/
        listDom.append(str);
    }
}
function href(obj) {
    window.location.href = "hos_index.html?hosId="+$(obj).attr('hosId')
}

/*联网加载列表数据*/
function getListDataFromNet(pageNum,pageSize,keyword,areaId,hospitalTypeId,successCallback,errorCallback) {
    /*  var url;
      if(subjectId == '' || subjectId == undefined){
          url = SERVER_ADDR + '/app/topthree/doctor/getList.json?pageNumber='+pageNum+'&pageSize='+pageSize;
      }else{
          url = SERVER_ADDR + '/app/topthree/doctor/getList.json?pageNumber='+pageNum+'&pageSize='+pageSize+'&subjectId='+subjectId;
      }*/
    var data = {};
    data.pageNumber = pageNum;
    data.pageSize = pageSize;
    if(keyword != '' && keyword != undefined && keyword != null){
        data.keyword = keyword;
    }
    data.areaId = areaId;
    if(hospitalTypeId != '' && hospitalTypeId != undefined){
        data.hospitalTypeId = hospitalTypeId;
    }
    data.latitude = localStorage.getItem("latitude");//30.317750930786133//
    data.longitude = localStorage.getItem("longitude");//120.10475158691406//
   /* data.cityName = localStorage.getItem('city');
    data.provinceName = localStorage.getItem('province');*/
    //延时一秒,模拟联网
    $.ajax({
        type: 'GET',
        url: SERVER_ADDR + '/app/hospital/getList.json',
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
function callback() {
    var page = {num: 1, size: 5, areaId: undefined,hospitalTypeId: undefined}
    // mescroll.resetUpScroll();
    mescroll.setPageNum(1)
    getListData(page)
}
function init() {
    $(".subChildRoom").click(function(){
        Choose.subsubject()
        $('.levelLong').removeClass('grade-w-rollRight').css('top',-$('.levelLongSort').height());
        if ($('.subjectLong').hasClass('grade-w-roll')) {
            $('.subjectLong').removeClass('grade-w-roll').css('top',-$('.subjectLongSort').height())
            $('.mubuxiala').hide();
        } else {
            $('.subjectLong').addClass('grade-w-roll').css('top','5.2rem');
            $('.mubuxiala').show();
        }
    });
    $(".level").click(function(){
        $('.subjectLong').removeClass('grade-w-roll').css('top',-$('.subjectLongSort').height());
        if ($('.levelLong').hasClass('grade-w-rollRight')) {
            $('.levelLong').removeClass('grade-w-rollRight').css('top',-$('.levelLongSort').height());
            $('.mubuxiala').hide();
        } else {
            $('.levelLong').addClass('grade-w-rollRight').css('top','5.2rem');
            $('.mubuxiala').show();
        }
        Choose.level();
    });
    $(".mubuxiala").click(function(){
        $('.mubuxiala').hide();
        $('.levelLong').removeClass('grade-w-rollRight').css('top',-$('.levelLongSort').height());
        $('.subjectLong').removeClass('grade-w-roll').css('top',-$('.subjectLongSort').height());
    })
}
//获取选择筛选
var Choose = {
    cityOpen:function (city,province) {
        var city = city;
        var province = province;
        var url = SERVER_ADDR + '/app/common/findArea';
        var Data = {};
        Data.provinceName = province;
        Data.cityName = city;
        var elThis = this;
        ajaxGetRetInfo(url, Data, function (retInfo) {
            if(retInfo.success == true){
                if(retInfo.data == '未开通'){ //定位城市未开通

                }else{
                    areaId = retInfo.data.id;
                    areaName = retInfo.data.areaName + retInfo.data.typeName;
                    $('.subText').attr('subsubId',areaId).text(areaName);
                }
            }else{
                console.log(retInfo.data)
            }
        }, '请求失败', 'GET', undefined, undefined);
    },
    subsubject: function () {
        if( $('.subChildRoom').attr('ajax') == 'true'){
            return
        }
        var url = SERVER_ADDR + '/common/getAreaList.json'; //'http://www.yinliuta.com/activity/checkWxAccount';
        var Data = {};
        Data.parentId = $('.subText').attr('subsubId');//'330100';
        ajaxGetRetInfo(url, Data, this.checkSubsubjectSuccess, '请求失败', 'GET', true, undefined);
      //  Choose.checkSubsubjectSuccess();
    },
    checkSubsubjectSuccess:function (retInfo) {
        if(retInfo.success == true){
            console.log(retInfo);
            /*if(retInfo.data.length === 0){
               $('.subjectLong').removeClass('grade-w-roll');
                alert('暂无子科室可选择')
            }*/
            /*if(retInfo.data.length === 0){
                $('.subjectLong').removeClass('grade-w-roll');
                alert('暂无子科室可选择')
            }else{
                $('.subjectLong').addClass('grade-w-roll');
            }*/
            retInfo.data.forEach(function (value) {
                console.log(value)
                var html = '';
                html += '<li class="subsubjectClick" subsubId="'+value.id+'">'+value.name+'</li>'
                $('.subjectLongSort').append(html);
            })
            $('.subChildRoom').attr('ajax','true')
            $('.subsubjectClick').click(function () {
                $('.subjectLong').removeClass('grade-w-roll').css('top',-$('.subjectLongSort').height());
                $('.mubuxiala').hide();
                $('.subText').text($(this).text()).attr('subsubId',$(this).attr('subsubId'));
                $('#dataList').empty();
                var page = {num: 1, size: 5, areaId: $('.subText').attr('subsubId'),hospitalTypeId: $('.levelText').attr('levelid')}
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
    level:function () {
        if( $('.level').attr('ajax') == 'true'){
            return
        }
        var url = SERVER_ADDR + '/common/getHospitalTypes.json'; //'http://www.yinliuta.com/activity/checkWxAccount';
        var Data = '';
        ajaxGetRetInfo(url,Data,this.checkSuccess,'请求失败', 'GET', undefined, undefined);
        //Choose.checkSuccess();
    },
    checkSuccess:function (retInfo) {
        if(retInfo.success == true){
            console.log(retInfo)
            if(retInfo.data.length === 0){
                $('.levelLong').removeClass('grade-w-rollRight').css('top','0');
                $('.mubuxiala').hide();
                alert('暂无医院类型可选择')
            }
            //$('.ks_list').empty();
            /*if(retInfo.data.length === 0){
                $('.levelLong').removeClass('grade-w-rollRight');
                alert('暂无职称可选择')
            }else{
                $('.levelLong').addClass('grade-w-rollRight');
            }*/
            retInfo.data.forEach(function (value) {
                console.log(value)
                if(value.id != 6){
                    var html = '';
                    html += '<li class="levelClick" levelId="'+value.id+'">'+value.name+'</li>'
                    $('.levelLongSort').append(html);
                }
            })
            $('.level').attr('ajax','true')
            $('.levelClick').click(function () {
                console.log(555)
                $('.levelLong').removeClass('grade-w-rollRight').css('top',-$('.levelLongSort').height());
                $('.mubuxiala').hide();
                $('.levelText').text($(this).text()).attr('levelId',$(this).attr('levelId'));
                $('#dataList').empty();
                var page = {num: 1, size: 5, areaId: $('.subText').attr('subsubId'),hospitalTypeId: $('.levelText').attr('levelid')}
                // mescroll.resetUpScroll();
                mescroll.setPageNum(1)
                getListData(page)
            })
            totalCount = retInfo.totalCount;
        }else{
            alert('请求数据有错')
        }
        if(retInfo.data.length === 0){
            $('.levelLong').removeClass('grade-w-rollRight').css('top','0');
            $('.mubuxiala').hide();
            alert('暂无医院类型可选择')
        }
        //$('.ks_list').empty();
        /*if(retInfo.data.length === 0){
            $('.levelLong').removeClass('grade-w-rollRight');
            alert('暂无职称可选择')
        }else{
            $('.levelLong').addClass('grade-w-rollRight');
        }*/
        /*$('.levelLongSort').empty();
            var html = '';
            html += '<li class="levelClick">智能排序</li><li class="levelClick" levelid="scoreDesc">评分最多</li><li class="levelClick" levelid="salesDesc">销量最高</li>'
            $('.levelLongSort').append(html);
        $('.level').attr('ajax','true')
        $('.levelClick').click(function () {
            console.log(555)
            $('.levelLong').removeClass('grade-w-rollRight').css('top',-$('.levelLongSort').height());
            $('.mubuxiala').hide();
            $('.levelText').text($(this).text()).attr('levelId',$(this).attr('levelId'));
            $('#dataList').empty();
            var page = {num: 1, size: 5, areaId: $('.subText').attr('subsubId'),orderType: $('.levelText').attr('levelid'),hospitalTypeId:undefined}
            // mescroll.resetUpScroll();
            mescroll.setPageNum(1)
            getListData(page)
        })*/
        //totalCount = retInfo.totalCount;
    },
}
