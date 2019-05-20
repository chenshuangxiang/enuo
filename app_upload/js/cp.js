var businesStatus;
var title;
var link;
var imgUrl;
var desc;
var isPreferential = false;
var productName = '';
var productImg = '';
var productPrice = '';
function init() {
    if(window.history.length == 1){
        $('.pub_hearder_left').attr("onclick","window.location.href = 'xywz.html'");
    }
    Get.detail();
    Get.cpcase();
    $('.pub_hearder_right').click(function () {
        console.log(55)
        $('.animateImg').slideToggle();
    });
    $('.tabjia').click(function () {
        $('.tabjia').children('.avtivitySpan').removeClass('avtivityactive');
        $(this).children('.avtivitySpan').addClass('avtivityactive');
    });
    $('.tabjiaLeft').click(function () {
        $('.tejiaLeft').show();
        $('.tejiaRight').hide();
        //Get.tuiMore();
    });
    $('.tabjiaRight').click(function () {
        $('.tejiaLeft').hide();
        $('.tejiaRight').show();
    });
}
var Get = {
    detail: function () {
        var url = SERVER_ADDR + '/app/specialProduct/getDetail.json'; //'http://www.yinliuta.com/activity/checkWxAccount';
        var Data = {};
        Data.id = getQueryString('cpId');
        ajaxGetRetInfo(url, Data, this.detailSuccess, '请求失败', 'GET', true, undefined);
    },
    detailSuccess:function (retInfo) {
        console.log(retInfo);
        if(retInfo.success == true){
            title = retInfo.data.name;
            link = window.location.href;
            imgUrl = retInfo.data.headImgUrl;
            desc = '约定疗效：' + retInfo.data.agreementResults[0] || ''+ retInfo.data.agreementResults[1] || ''  + retInfo.data.agreementResults[2] || '';
            isPreferential = retInfo.data.isPreferential;
            productName = retInfo.data.name;
            productImg = retInfo.data.headImgUrl;
            productPrice = retInfo.data.price;
            $('.headerimgTop').attr('src',retInfo.data.headImgUrl);
            $('.cptitleName').text(retInfo.data.name);
            $('.hosTitleSpan').text(retInfo.data.hospitalName).attr('hosId',retInfo.data.hospitalId);
            $('.line_consult').attr('employee',retInfo.data.employeeId);
            $('.hosTimeSpan').text(retInfo.data.day);
            $('.hosPriceSpan').text('￥'+retInfo.data.price + '元（不高于）');
            $('.peopelcount').text(retInfo.data.orderQuantity + '人');
            $('.yuexiao').empty();
            if(retInfo.data.agreementResults){
                retInfo.data.agreementResults.forEach(function (value, index) {
                    $('.yuexiao').append('<p>'+(index+1)+'、'+value+'；'+'</p>');
                })
            }
            if(retInfo.data.isFavorite == true){
                $('.pub_hearder_right').attr('src','img/favouriteYes.png');
            }
            businesStatus = retInfo.data.businesStatus;
            if(businesStatus == 'normal' || businesStatus == undefined){

            }else if(businesStatus == 'violate'){
                $('.cpStatus').css('background','url(../../app/img/violate.png) 100% 46% / 30% no-repeat');
            }else if(businesStatus == 'closed'){
                $('.cpStatus').css('background','url(../../app/img/closedHos.png) 100% 46% / 30% no-repeat');
            }
            //加入评论
            if(retInfo.data.evaluations){
                retInfo.data.evaluations.forEach(function (value) {
                    console.log(value)
                    var html = '';
                    html += '<div class="hos_doc_child clearfix"> ' +
                        '<div class="doc_child_left"> ' +
                        '<img src="'+value.headImgUrl+'"> ' +
                        '</div> ' +
                        '<div class="doc_child_right" style="margin: -0.5% 0 0 0%;"> ' +
                        '<div class="id"> ' +
                        '<p class="name">'+value.fullname+'<span class="commontTime">'+new Date(value.createDate).Format('yyyy-MM-dd')+'</span></p><p> ' ;
                    value.images.forEach(function (val,index) {
                        console.log(val, index)
                        html += '<a href="'+val+'"><img class="commontImg" src="'+val+'" ></a>';
                    });
                    html += '</p> <p style="clear: both;"></p> ' +
                        '<p class="commontZi">'+value.content+'</p> ' +
                        '</div> ' +
                        '</div> ' +
                        '</div>';
                    //$('.hos_list').append(html);
                    $('.hos_commont_list').append(html);
                });
                $('#gallery img').fsgallery()
            }else if(!retInfo.data.evaluations || retInfo.data.evaluations.length == 0){
                $('.all_doc_commont').hide()
            }
            //加入本院推荐
            if(retInfo.data.interests){
                retInfo.data.interests.forEach(function (value) {
                    console.log(value)
                    var html = '';
                    //html += '<div class="hos_doc_child clearfix" style="position: relative" itemId = "'+value.id+'" isPreferential="'+value.isPreferential+'" onclick="href(this)"> '
                    if(value.businesStatus == 'normal' || value.businesStatus == undefined){
                        html += '<div class="hos_doc_child clearfix" style="position: relative" itemId="'+value.id+'" isPreferential="'+value.isPreferential+'" onclick="href(this)">' ;
                    }else if(value.businesStatus == 'violate'){
                        html += '<div class="hos_doc_child clearfix" style="background: url('+"../../app/img/violate.png"+') 100% 46% / 30% no-repeat;position: relative" itemId="'+value.id+'" isPreferential="'+value.isPreferential+'" onclick="href(this)">' ;
                    }else if(value.businesStatus == 'closed'){
                        html += '<div class="hos_doc_child clearfix" style="background: url('+"../../app/img/closedHos.png"+') 100% 46% / 30% no-repeat;position: relative" itemId="'+value.id+'" isPreferential="'+value.isPreferential+'" onclick="href(this)">' ;
                    }
                    if(value.isPreferential == true){
                        html += '<img class="huiImg" src="/app/img/hui.png">'
                    }
                    html += '<div class="doc_child_left"> ' +
                        '<img src="'+value.headImgUrl+'"> ' +
                        '</div> ' +
                        '<div class="doc_child_right" style="margin: 0 0 0 0;"> ' +
                        '<div class="id" style="width: 89%;"> ' +
                        '<p class="name" style="height: inherit;"><span class="goodsName" style="    display: inline;">'+value.name+'</span></p> ' +
                        '<p class="address">'+value.hospitalName+'</p> '
                    if(value.isPreferential == true){
                        html += '<p><span style="color: #f81f7b;font-size: .2rem;">￥</span><span class="price">'+value.price+'</span>' +
                            '<del class="oldprice">￥'+value.originalPrice+'</del>' +
                            '</p>'
                    }else if(value.isPreferential == false){
                        html += '<p class="name" style="font-size: .26rem;">约定价格：<span class="goodsName" style="color: #f93688;">'+value.price+'</span>(不高于)</p>'
                    }
                    html += '<p><span class="yuyue">约定周期：<span class="peopelcount" style="color: #010101;">'+value.day+'</span>天</span>' +
                        '</p> ' +/*<span class="yuyue" style="color: #999;    float: right;">预约：<span class="peopelcount">'+value.orderQuantity+'人</span></span>*/
                        '</div> ' +
                        '</div> ' +
                        '</div>';
                    $('.hos_item_list').append(html);
                });
                $('.hos_item_list .hos_doc_child:last-child').css('border-bottom',0)
            }


        }else{
            alert(retInfo.data);
        }
    },
    cpcase: function () {
        var url = SERVER_ADDR + '/app/effectCase/getList.json';
        var Data = {};
        Data.fkId = getQueryString('cpId');
        Data.type = 'product';
        Data.pageNumber = 1;
        Data.pageSize = 5;
        ajaxGetRetInfo(url, Data, this.cpcaseSuccess, '请求失败', 'GET', true, undefined);
    },
    cpcaseSuccess:function (retInfo) {
        console.log(retInfo);
        if(retInfo.success == true){
            //加入案例
            $('.hos_case_list').empty();
            if(retInfo.data.length > 0){
                retInfo.data.forEach(function (value) {
                    console.log(value)
                    var html = '';
                    html += '<div class="hos_doc_child clearfix"> ' +
                     /*   '<div class="doc_child_left"> ' +
                        '<img src="'+value.headImgUrl+'"> ' +
                        '</div> ' +*/
                        '<div class="doc_child_right" style="margin: -0.5% 0 0 0%;    width: 99%;"> ' +
                        '<div class="id" style="margin-left: 5%"> ' +
                        '<p class="commontZi" style="margin: 0.1rem 0 0.3rem 0;">'+value.content+'</p> ' +
                        '<p> ' ;
                    value.images.forEach(function (val,index) {
                        console.log(val, index)
                        html += '<a href="'+val+'"><img class="commontImg" src="'+val+'" ></a>';
                    });
                    html += '</p> <p style="clear: both;"></p> ' +

                        '</div> ' +
                        '</div> ' +
                        '</div>';
                    //$('.hos_list').append(html);
                    $('.hos_case_list').append(html);
                });
                $('#gallery img').fsgallery()
            }else{
                $('.all_doc_case').hide()
            }
        }else{
            alert(retInfo.data);
        }
    },
    favourite: function () {
        if( $('.pub_hearder_right').attr('src') == ('img/favouriteYes.png')){
            var url = SERVER_ADDR + '/app/user/favorite/cancel';  //取消收藏
        }else{
            var url = SERVER_ADDR + '/app/user/favorite/add'; //收藏
        }
        var Data = {};
        Data.id = getQueryString('cpId');
        Data.type = 'product';
        ajaxGetRetInfo(url, Data, this.favouriteSuccess, '请求失败', 'POST', true, undefined);
    },
    favouriteSuccess:function (retInfo) {
        console.log(retInfo);
        if(retInfo.success == true){
            if( $('.pub_hearder_right').attr('src') == ('img/favouriteYes.png')){
                $('.pub_hearder_right').attr('src','img/favouriteNo.png');  //取消收藏
            }else{
                $('.pub_hearder_right').attr('src','img/favouriteYes.png'); //收藏
            }
        }else{
            alert(retInfo.data)
        }
    },
}
function href(obj) {
    if($(obj).attr('isPreferential') == 'true'){
        window.location.href = 'special_cp.html?itemId='+ $(obj).attr('itemId');
    }else if($(obj).attr('isPreferential') == 'false'){
        window.location.href = 'cp.html?cpId='+ $(obj).attr('itemId');
    }
}
var Go = {
    pay: function () {
        //$('.main_close').click();
        //$('.yixuan').text('已选：'+ $('.choose_shose').text() +' ×'+ $('.buycount').text())
        /* if ($('.yixuan').text() == '数量') {
             tochoose3()
             return;
         }*/
        //$('.make').attr('onclick','').css('background-color','#999');

        if(businesStatus == 'normal' || businesStatus == undefined){
            var url = SERVER_ADDR + '/app/user/order/submit';
            var Data = {};
            Data.specialProductId = getQueryString('cpId');
            //Data.isDean = $('.sexnameActive').attr('isDean');//$('input[name="sex"]:checked').val() == 'expert' ? false : true;
            //Data.quantity = 1;
            ajaxGetRetInfo(url, Data, this.paySuccess, '请求失败', 'POST', true, undefined);
        }else if(businesStatus == 'violate'){
            alert('为了医疗安全，不可以预约');
        }else if(businesStatus == 'closed'){
            alert('暂未开放约定医疗，不可预约');
        }
    },
    paySuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            window.location.href = 'pay/order_pay.html?payId='+retInfo.data;
        }
        /* else {
            if(retInfo.data == '请先完善个人信息'){
                alert(retInfo.data);
                window.location.href = 'bind_name.html';
            }else if(retInfo.data == '分享当前页面到朋友圈才能购买哦'){
                //window.location.href = 'bind_name.html';
                //alert(retInfo.data);
                if(is_weixn()){
                    $('.modelOpen').show()
                }
                //去分享页面
                //getSign();
            }else{
                alert(retInfo.data);
            }
        }*/
        else{
            alert(retInfo.data);
        }
    },
    hos:function () {
        if($('.hosTitleSpan').attr('hosId') == undefined){
            alert('服务器繁忙，请稍候再试')
        }else{
            window.location.href = 'hos_index.html?hosId=' + $('.hosTitleSpan').attr('hosId');
        }
    },
    chat:function () {
        window.location.href = 'chat.html?hosId=' + $('.line_consult').attr('employee') + '&type=product&isPreferential='+ isPreferential + '&productName='+ productName + '&productImg='+ productImg + '&productPrice='+ productPrice +'&productId='+ getQueryString('cpId');;
    },
    yuyue:function () {
        /*window.location.href = 'rili_yuyue.html?cpId='+getQueryString('cpId');*/
        window.location.href = 'pay/dos_yuyue.html?docId='+getQueryString('cpId') + '&type=project';
    },
    topanimate: function () {
        $(".shareCall").removeClass("call-active").addClass("am-modal-active");//向上弹出取消
        if ($(".sharebg").length > 0) {
            $(".sharebg").addClass("sharebg-active");//背景颜色变化并增加透明度
        } else {
            $("body").append('<div class="sharebg"></div>');
            $(".sharebg").addClass("sharebg-active");
        }
    },
    closetopanimate:function () {
        $(".shareCall").removeClass("am-modal-active").addClass("call-active");//向上弹出取消
        setTimeout(function () {
            $(".sharebg-active").removeClass("sharebg-active");//背景颜色恢复
            $(".sharebg").remove();

        }, 200);
    }
}