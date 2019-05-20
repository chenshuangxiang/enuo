function init() {
    //Get.avtivity();
    //Get.subject();
    Get.tuiMore();
    $(window).scroll(function(){
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if(scrollTop + windowHeight - scrollHeight == 0 ){
            console.log("you are in the bottom");
            if(total > $('.hos_doc_child').length){
                Get.tuiMore();
            }
        }
    });
    /*follow.getNewsCount();
    setInterval(function () {
        follow.getNewsCount();//获取未读消息条数
    },10000);*/
}
var pageNumber = 1;
var total = 5;
//获取一级科室
var Get = {
    avtivity:function () {
        var url = SERVER_ADDR + '/app/common/platformRecommend'; //'http://www.yinliuta.com/activity/checkWxAccount';
        var Data = {};
        Data.pageNumber = 1;
        Data.pageSize = 4;
        ajaxGetRetInfo(url,Data,this.avtivitySuccess,'请求失败', 'GET', undefined, undefined);
    },
    avtivitySuccess:function (retInfo) {
        if(retInfo.success == true){
            retInfo.data.forEach(function (value,index) {
                var html = '';
                html += '<li specialId="'+value.id+'" onclick="href(this)"> ' +
                    '<div class="left" style="border-radius: 5px;overflow: hidden;"><img src="'+value.headImgUrl+'"></div> ' +
                    '<p class="advername">'+value.name+'</p> ' +
                    '<p class="adveraddress">'+value.hospitalName+'</p> ' +
                    '<p class="detail"><span style="color: #f81f7b;font-size: .7rem;">￥</span><span class="adverprice">'+value.price+'</span> <del class="adveroldPrice">￥'+value.originalPrice+'</del></p> ' +
                    '</li>';
                $('.adverlist').append(html);
                $('.left').css('max-height',$('.adverlist li').width()).css('min-height',$('.adverlist li').width());
                //$('.adverDiv').height($('li').height());
            })
        }else{
            alert(retInfo.data);
        }
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
            alert('请求数据有错')
        }
    },
    href:function (obj) {
        if($(obj).find('span').text() == '整形美容科'){
            window.location.href = 'zxmr.html?subjectId='+ $(obj).attr('subId') + '&subjectName=整形美容科';
        }else{
            window.location.href = 'find_subject.html?subjectId='+ $(obj).attr('subId') + '&subjectName='+$(obj).children().text();
        }
    },
    tuiMore:function () {  //加入推荐接口
        var url = SERVER_ADDR + '/app/common/recommend';
        var Data = {};
        Data.pageNumber = pageNumber;
        Data.pageSize = 5;
        Data.cityName = localStorage.getItem('city');
        Data.provinceName = localStorage.getItem('province');
        ajaxGetRetInfo(url, Data, this.tuiMoreSuccess, '请求失败', 'GET', true, undefined);
    },
    tuiMoreSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
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
            console.log(value)
            var html = '';
            html += '<div class="hos_doc_child clearfix" specialId="'+value.id+'" onclick="href(this)">' +
                '<div class="doc_child_left">' +
                '<img style="max-height: 4.5rem;" src="'+value.headImgUrl+'">' +
                '</div>' +
                '<div class="doc_child_right" style="margin: 0 0 0 0;">' +
                '<div class="id">' +
                '<p class="name"><span class="hot">热销</span><span class="goodsName">'+value.name+'</span></p>' +
                '<p class="address">'+value.hospitalName+'</p>' +
                '<p><span style="color: #f81f7b;font-size: .7rem;">￥</span><span class="price">'+value.price+'</span><del class="oldprice">￥'+value.originalPrice+'</del></p>' +/*<span class="yuyue">已预约<span class="peopelcount">'+value.sellQuantity+'</span>人</span>*/
                '</div>' +
                '</div>' +
                '</div>';
            //$('.hos_list').append(html);
            $('.hos_doc_list').append(html);
        })
        $('.hos_doc_child:last-child').css('border-bottom','0');
        pageNumber++;
    }
}
function href(obj) {
    window.location.href = 'special_cp.html?itemId='+ $(obj).attr('specialId');
}