function init() {
    //Get.subject();
    new Vue({
        el:'.adminBox',
        data:{
            cityInputVal:'杭州',
        },
        methods:{
            cityPatFun:function(){
                $('.xywz').css('position','fixed');
                this.$refs.city.cityFun();
            },
            cityjs:function(data,parentName){
                window.scrollTo(0,0);
                console.log('父城市' + parentName);
                this.cityInputVal = data;
            }
        }
    })
   // getLocationCity();//获取当前城市定位
    Get.tuiMore();
    //Get.tuiMorejiancha();
   /* $(window).scroll(function(){
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if(scrollTop + windowHeight - scrollHeight == 0 ){
            console.log("you are in the bottom");
            if(total > $('.hos_doc_child').length){
                Get.tuiMore();
            }
        }
    });*/
 /*   follow.getNewsCount();
    setInterval(function () {
        follow.getNewsCount();//获取未读消息条数
    },10000);*/
}
var type;
var pageNumber = 1;
var total = 5;
//获取一级科室
var Get = {
    firstCodeGet:function () {  //无code请求
        var url = SERVER_ADDR + '/app/common/authorization';
        var Data = '';
        if(SERVER_ADDR == 'http://www.enuo120.com') {
            ajaxGetRetInfo(url, Data, this.firstCodeGetSuccess, '请求失败', 'GET', undefined, undefined);
        }
    },
    firstCodeGetSuccess:function (retInfo) {
        console.log(retInfo)

        /*retInfo = JSON.parse(retInfo);*/
        if(retInfo.success == true){
            if(retInfo.data.isWxUser == false){
                var indexHref = "https://www.enuo120.com/app/xywz.html";
                var str = retInfo.data.redirectUrl;
                str = str.replace(/REDIRECT_URI/, encodeURI(indexHref));
                sessionStorage.setItem("codeValue", 'true');
                window.location.href = str;
            }else if(retInfo.data.isWxUser == true){
                //follow.wecat();
            }
        }else if(retInfo.success == false){
            document.write(retInfo.data);
        }
    },

    haveCodeGet:function () {  //有code请求
        localStorage.setItem('code',getQueryString('code'));
        var url = SERVER_ADDR + '/app/common/authorization';
        var Data = {};
        Data.code = getQueryString('code');
        /*if(SERVER_ADDR == 'http://www.enuo120.com'){*/
            ajaxGetRetInfo(url,Data,this.checkCodeSuccess,'请求失败', 'GET', undefined, undefined);
        /*}*/
    },
    checkCodeSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == false){
            //alert(retInfo.data);
           // window.location.href = 'follow.html';
        }
        //follow.wecat();
    },
    subject:function () {
        var url = SERVER_ADDR + '/app/common/getSubjectList.json'; //'http://www.yinliuta.com/activity/checkWxAccount';
        var Data = '';
        ajaxGetRetInfo(url,Data,this.checkSuccess,'请求失败', 'GET', undefined, undefined);
    },
    checkSuccess:function (retInfo) {
        if(retInfo.success == true){
            $('.ks_list').empty();
            retInfo.data.forEach(function (value,index) {
                console.log(value,index)
                console.log(index)
                if(index== 0|| index >= 4 && /^[0-9]*[1-9][0-9]*$/.test((index)/4)){
                    if(index == 0){
                        $('.ks_list').prepend('<div class="ks_child" style="border-right: 0;border-bottom: 0" subId="'+value.id+'" onclick="Get.href(this)"> ' +
                            '<p class="img1 set_img_bg"><img src="'+value.icon+'"></p><br /><span>'+value.name+'</span> ' +
                            '</div>')
                    }else{
                        $('.ks_list').prepend('<div class="ks_child" style="border-right: 0" subId="'+value.id+'" onclick="Get.href(this)"> ' +
                            '<p class="img1 set_img_bg"><img src="'+value.icon+'"></p><br /><span>'+value.name+'</span> ' +
                            '</div>')
                    }
                }else{
                    if(index <= 3){
                        $('.ks_list').prepend('<div class="ks_child" style="border-bottom: 0" subId="'+value.id+'" onclick="Get.href(this)"> ' +
                            '<p class="img1 set_img_bg"><img src="'+value.icon+'"></p><br /><span>'+value.name+'</span> ' +
                            '</div>')
                    }else{
                    $('.ks_list').prepend('<div class="ks_child" subId="'+value.id+'" onclick="Get.href(this)"> ' +
                        '<p class="img1 set_img_bg"><img src="'+value.icon+'"></p><br /><span>'+value.name+'</span> ' +
                        '</div>')
                    }
                }

            })
        }else{
            alert(retInfo.data)
        }
    },
    href:function (obj) {
        if($(obj).find('span').text() == '整形美容科'){
            window.location.href = 'zxmr.html?subjectId='+ $(obj).attr('subId') + '&subjectName=整形美容科';
        }else{
            window.location.href = 'find_subject.html?subjectId='+ $(obj).attr('subId') + '&subjectName='+$(obj).children().text();
        }
    },
    tuiMore:function (city,province) {  //加入推荐接口
        var url = SERVER_ADDR + '/app/common/recommend';
        var Data = {};
        Data.pageNumber = 1;
        Data.pageSize = 4;
        Data.type = 'beauty';
        Data.cityName = city || localStorage.getItem('city');
        Data.provinceName = province || localStorage.getItem('province');
        ajaxGetRetInfo(url, Data, this.tuiMoreSuccess, '请求失败', 'GET', true, undefined);
    },
    tuiMoreSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            $('.hos_doc_list').empty();
            if(retInfo.data && retInfo.data.length > 0){
                Get.addTui(retInfo.data);
            }
            total = retInfo.totalCount;
        }else{
            alert(retInfo.data)
        }
    },
    addTui:function (retInfo) {  //加入推荐
        $('.hos_doc_child:last-child').css('border-bottom','1px solid #dcdcdc');
        retInfo.forEach(function (value) {
            var html = '';
            html += '<div class="hos_doc_child clearfix" specialId="'+value.id+'" onclick="href(this)">' +
                '<div class="doc_child_left">' +
                '<img style="max-height: 4.5rem;width: initial;" src="'+value.headImgUrl+'">' +
                '</div>' +
                '<div class="doc_child_right" style="margin: 0 0 0 0;">' +
                '<div class="id">' +
                '<p class="name"><span class="hot">热销</span><span class="goodsName">'+value.name+'</span></p>' +
                '<p class="address">'+value.hospitalName+'</p>' +
                '<p><span style="color: #f81f7b;font-size: .7rem;">￥</span><span class="price">'+value.price+'</span><del class="oldprice">￥'+value.originalPrice+'</del></p>' + /*<span class="yuyue">已售<span class="peopelcount">'+value.sellQuantity+'</span>人</span>*/
                '</div>' +
                '</div>' +
                '</div>';
            //$('.hos_list').append(html);
            $('.hos_doc_list').append(html);
        })
        $('.hos_doc_child:last-child').css('border-bottom','0');
        //pageNumber++;
    },
    tuiMorejiancha:function (type) {  //加入推荐接口
        var url = SERVER_ADDR + '/app/common/recommend';
        var Data = {};
        Data.pageNumber = 1;
        Data.pageSize = 4;
        Data.type = 'check';
        Data.cityName = localStorage.getItem('city');
        Data.provinceName = localStorage.getItem('province');
        ajaxGetRetInfo(url, Data, this.tuiMorejianchaSuccess, '请求失败', 'GET', true, undefined);
    },
    tuiMorejianchaSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            $('.hos_doc_listJiancha').empty();
            if(retInfo.data && retInfo.data.length > 0){
                Get.addTuijiancha(retInfo.data);
            }
            total = retInfo.totalCount;
        }else{
            alert(retInfo.data)
        }
    },
    addTuijiancha:function (retInfo) {  //加入推荐
        $('.hos_doc_child:last-child').css('border-bottom','1px solid #dcdcdc');
        retInfo.forEach(function (value) {
            var html = '';
            html += '<div class="hos_doc_child clearfix" specialId="'+value.id+'" onclick="href(this)">' +
                '<div class="doc_child_left">' +
                '<img style="max-height: 4.5rem;" src="'+value.headImgUrl+'">' +
                '</div>' +
                '<div class="doc_child_right" style="margin: 0 0 0 0;">' +
                '<div class="id">' +
                '<p class="name"><span class="hot">热销</span><span class="goodsName">'+value.name+'</span></p>' +
                '<p class="address">'+value.hospitalName+'</p>' +
                '<p><span style="color: #f81f7b;font-size: .7rem;">￥</span><span class="price">'+value.price+'</span><del class="oldprice">￥'+value.originalPrice+'</del></p>' +/*<span class="yuyue">已售<span class="peopelcount">'+value.sellQuantity+'</span>人</span>*/
                '</div>' +
                '</div>' +
                '</div>';
            //$('.hos_list').append(html);
            $('.hos_doc_listJiancha').append(html);
        })
        $('.hos_doc_child:last-child').css('border-bottom','0');
    }
}
function href(obj) {
    window.location.href = 'special_cp.html?itemId='+ $(obj).attr('specialId');
}
function callback() {

}