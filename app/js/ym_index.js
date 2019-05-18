var pageNumber = 1;
var total = 5;
function init() {
    //Get.func();
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
}
//获取医美整形功能
var Get = {
    func:function () {
        var url = SERVER_ADDR + '/app/common/getSubSubjectList.json'; //'http://www.yinliuta.com/activity/checkWxAccount';
        var Data = {};
        Data.subjectId = 11;
        ajaxGetRetInfo(url,Data,this.checkSuccess,'请求失败', 'GET', undefined, undefined);
    },
    checkSuccess:function (retInfo) {
        if(retInfo.success == true){
            $('.ks_list').empty();
            retInfo.data.forEach(function (value) {
                console.log(value)
                if(value.id != 115){
                    $('.ks_list').append('<div class="ks_child" specialId="'+value.id+'" specialName="'+value.name+'" onclick="Get.href(this)"> ' +
                        "<p class='img1 set_img_bg'><img src='/app/img/ymlogo/"+value.id+".png'></p><span>"+value.name+"</span> " +
                        '</div>')
                }
            });
            $('.ks_list').append('<div class="ks_child" specialId="115" specialName="其他" onclick="Get.href(this)"> ' +
                    '<p class="img1 set_img_bg"><img src="/app/img/ymlogo/115.png"></p><span>其他</span> ' +
                    '</div>');
        }else{
            alert('请求数据有错')
        }
    },
    href:function (obj) {
        window.location.href = 'zxmr.html?specialId='+ $(obj).attr('specialId')+'&specialName='+ $(obj).attr('specialName');
    },
    tuiMore:function () {  //加入推荐接口
        var url = SERVER_ADDR + '/app/specialProduct/getList.json';
        var Data = {};
        Data.type = 'beauty';
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
        //$('.hos_doc_child:last-child').css('border-bottom','1px solid #dcdcdc');
        retInfo.forEach(function (value) {
            console.log(value)
            var html = '';
            html += '<div class="hos_doc_child clearfix" style="position: relative" specialId="'+value.id+'" isPreferential="'+value.isPreferential+'" onclick="href(this)">' ;
            if(value.isPreferential == true){
                html += '<img class="huiImg" src="/app/img/hui.png">'
            }
            html += '<div class="doc_child_left">' +
                '<img style="max-height: 5rem;;border-radius: 5px;overflow: hidden;" src="'+value.headImgUrl+'">' +
                '</div>' +
                '<div class="doc_child_right" style="margin: 0 0 0 0;">' +
                '<div class="id">' +
                '<p class="name" style="font-size: .85rem;"><span class="goodsName">'+value.name+'</span></p>' +
                '<p class="address">'+value.hospitalName+'</p>' ;
            if(value.isPreferential == true){
                html += '<p><span style="color: #f81f7b;font-size: .7rem;">￥</span><span class="price">'+value.price+'</span>' +
                    '<del class="oldprice">￥'+value.originalPrice+'</del>' +
                    '</p>'
            }else if(value.isPreferential == false){
                html += '<p class="name" style="font-size: .8rem;">约定价格：<span class="goodsName" style="color: #f93688;">'+value.price+'</span>（不高于）</p>'
            }
            html += '<p class="name" style="font-size: .8rem;">约定周期：<span class="goodsName">'+value.day+'天</span></p>' +/*<span class="yuyue">预约：<span class="peopelcount">'+value.orderQuantity+'</span>人</span>*/
                '<p></p>' +
                '</div>' +
                '</div>' +
                '</div>';
            //$('.hos_list').append(html);
            $('.hos_doc_list').append(html);
        })
        //$('.hos_doc_child:last-child').css('border-bottom','0');
        pageNumber++;
    }
}
function href(obj) {
    if($(obj).attr('isPreferential') == 'true'){
        window.location.href = 'special_cp.html?itemId='+ $(obj).attr('specialId');
    }else if($(obj).attr('isPreferential') == 'false'){
        window.location.href = 'cp.html?cpId='+ $(obj).attr('specialId');
    }
}
var Show = {
    func:function () {
        $('.ks_list').slideToggle();
        var statusZi = $('.shouqi .font_green');
        if(statusZi.text() == '收起'){
            statusZi.text('展开');
            $('.shouqi img').css('transform','rotate(0deg)');
        }else{
            statusZi.text('收起');
            $('.shouqi img').css('transform','rotate(180deg)');
        }
    }
}