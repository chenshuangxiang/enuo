var pageNumber = 1;
var total = 5;
var nexttotal = 0;
var businesStatus;
var isPreferential = true;
var productName = '';
var productImg = '';
var productPrice = '';
var title = 'e诺平台全新改版上线啦！超值1元购项目正在火热进行中！全脸皮秒祛斑1元，腹部B超1元，洗牙1元……';
var link = 'https://www.enuo120.com/app/activity_more.html';
var imgUrl = 'https://www.enuo120.com/upload/image/201801/28/CQiZY54sBz1s5Ya9QdK.jpg';  //分享的信息
var desc;
function init() {
    if(getQueryString('type') == 'exchange'){
        $('.make').text('确认兑换').attr("onclick","alert('兑换成功');window.location.href = 'order.html'");
    }
    if(window.history.length == 1){
        $('.pub_hearder_left').attr("onclick","window.location.href = 'xywz.html'");
    }
    Get.cpcase();
    Get.getDocInfo();
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
var Click = {
    jian:function () {
        var thisCount = Number($('.buycount').text());
        if(thisCount > 1){
            thisCount--;
            $('.buycount').text(thisCount)
        }
    },
    jia:function () {
        var thisCount = Number($('.buycount').text());
        thisCount++;
        $('.buycount').text(thisCount)
    },
    sure:function () {
        $('.main_close').click();
        $('.yixuan').text('已选：'+ $('.choose_shose').text() +' ×'+ $('.buycount').text())
    }
}
var To = {
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
            Data.specialProductId = getQueryString('itemId');
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
        } else {
            if(retInfo.data == '请先完善个人信息'){
                alert(retInfo.data);
                window.location.href = 'bind_name.html?returnUrl=' + window.location.href;
            }else if(retInfo.data == '分享当前页面到朋友圈才能购买哦'){
                //window.location.href = 'bind_name.html';
                //alert(retInfo.data);
                if(is_weixn()){
                    $('.modelOpen').show()
                }
                //去分享页面
                //getSign();
            }else{
                if(retInfo.data == '该商品只能购买一次哦'){
                    $('.toOpen').show();
                }else{
                    alert(retInfo.data);
                }
            }
        }
    },
    chat:function () {
        window.location.href = 'chat.html?hosId=' + $('.line_consult').attr('employee') + '&type=product&isPreferential='+ isPreferential + '&productName='+ productName + '&productImg='+ productImg + '&productPrice='+ productPrice +'&productId='+ getQueryString('itemId');
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
    },
    share: function () {
        var url = SERVER_ADDR + '/app/user/share'; //获取分享成功后调取
        var Data = '';
        /*Data.specialProductId = getQueryString('itemId');*/
        ajaxGetRetInfo(url, Data, this.shareSuccess, '请求失败', 'POST', true, undefined);
    },
    shareSuccess: function (retInfo) {
        console.log(retInfo)
        /*if (retInfo.success == true) {
            //window.location.href = 'pay/order_pay.html?payId='+retInfo.data;
        }*/
    }
}
var Get = {
    getDocInfo:function () {
        var url = SERVER_ADDR + '/app/specialProduct/getDetail.json';
        var Data = {};
        Data.id = getQueryString('itemId');
        ajaxGetRetInfo(url, Data, this.getDocInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    getDocInfoSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            if(retInfo.data.isActivity == true){
                $('.pub_hearder_left').attr('onclick','window.location.href = "activity_more.html"');
                /*if(retInfo.data.isShare == false){
                    localStorage.setItem('share','false');
                }else{
                    localStorage.setItem('share','true');
                }*/
                getSign();
            }
            if(retInfo.data.deanPrice){
                $('.dean').show();
            }else{
                $('.dean').hide();
            }
            title = retInfo.data.name;
            link = window.location.href;
            imgUrl = retInfo.data.headImgUrl;
            desc = '约定疗效：' + retInfo.data.agreementResults[0] || '' + retInfo.data.agreementResults[1] || ''  + retInfo.data.agreementResults[2] || '';
            isPreferential = retInfo.data.isPreferential;
            productName = retInfo.data.name;
            productImg = retInfo.data.headImgUrl;
            productPrice = retInfo.data.price;
            $('.hosDiv').attr('hosId',retInfo.data.hospitalId);
            $('.headerimgTop').attr('src',retInfo.data.headImgUrl);
            $('.hosAddress').text(retInfo.data.hospitalName);
            $('.zizhi span').text(retInfo.data.hosoitalType);
            $('.hosimg').attr('src',retInfo.data.hospitalImgUrl);
            $('.dizhiSpan').text(retInfo.data.address);
            $('.cptitleName,.choose_shose').text(retInfo.data.name);
            $('.line_consult').attr('employee',retInfo.data.employeeId);
            $('.peopelcount').text(retInfo.data.sellQuantity);
            $('.oldprice').text('￥'+ retInfo.data.originalPrice);
            $('.beforePrice').text('￥'+ retInfo.data.originalPrice);
            $('.price').text('￥'+ retInfo.data.price);
            $('.hosPriceSpan').text('￥'+retInfo.data.price);
            $('.hosTimeSpan').text(retInfo.data.day);
            $('.yuexiao').empty();
            if(retInfo.data.agreementResults){
                retInfo.data.agreementResults.forEach(function (value, index) {
                    $('.yuexiao').append('<p>'+(index+1)+'、'+value+'；'+'</p>');
                })
            }
            businesStatus = retInfo.data.businesStatus;
            if(businesStatus == 'normal' || businesStatus == undefined){

            }else if(businesStatus == 'violate'){
                $('.cpStatus').css('background','url(../../app/img/violate.png) 100% 46% / 30% no-repeat');
            }else if(businesStatus == 'closed'){
                $('.cpStatus').css('background','url(../../app/img/closedHos.png) 100% 46% / 30% no-repeat');
            }
            $('.commontCount').text('('+retInfo.data.evaluationQuantity+')');
            $('.yuanzhang').click(function () {
                $('.priceIndex,.hosPriceSpan').text('￥'+ retInfo.data.deanPrice);
            })
            $('.zhuren').click(function () {
                $('.priceIndex,.hosPriceSpan').text('￥'+ retInfo.data.price);
            })
            if(retInfo.data.interests && retInfo.data.interests.length > 0){
                Get.interests(retInfo.data.interests);
            }
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
                        html += '<img class="commontImg" src="'+val+'" >';
                    });
                    html += '</p> <p style="clear: both;"></p> ' +
                        '<p class="commontZi">'+value.content+'</p> ' +
                        '</div> ' +
                        '</div> ' +
                        '</div>';
                    //$('.hos_list').append(html);
                    $('.hos_commont_list').append(html);
                });
            }else if(!retInfo.data.evaluations || retInfo.data.evaluations.length == 0){
                $('.all_doc_commont').hide()
            }
            //待返回评价数和收藏状态和评价列表$('.commontCount').text('(' + retInfo.data.evaluationQuantity + ')' );
            if(retInfo.data.evaluations && retInfo.data.evaluations.length > 0){
                $('.all_doc_commont').show()
                Get.addcomment(retInfo.data.evaluations);
            }else if(!retInfo.data.evaluations || retInfo.data.evaluations.length == 0){
                $('.all_doc_commont').hide()
            }

        }else{
            alert(retInfo.data)
        }
    },
    hos:function () {
        if($('.hosDiv').attr('hosId') == undefined){
            alert('服务器繁忙，请稍候再试')
        }else{
            window.location.href = 'hos_index.html?hosId=' + $('.hosDiv').attr('hosId');
        }

    },
    cpcase: function () {
        var url = SERVER_ADDR + '/app/effectCase/getList.json';
        var Data = {};
        Data.fkId = getQueryString('itemId');
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
    addcomment:function (retInfo) {
        retInfo.forEach(function (value) {
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
                html += '<img class="commontImg" src="'+val+'" >';
            });
            html += '</p> <p style="clear: both;"></p> ' +
                '<p class="commontZi">'+value.content+'</p> ' +
                '</div> ' +
                '</div> ' +
                '</div>';
            $('.commontList').append(html);
        })
    },
    interests:function (retInfo) {
        retInfo.forEach(function (value) {
            console.log(value)
            var html = '';
            //html += '<div class="hos_doc_child clearfix" specialId="'+value.id+'" onclick="href(this)">' ;
            if(value.businesStatus == 'normal' || value.businesStatus == undefined){
                html += '<div class="hos_doc_child clearfix" style="position: relative" specialId="'+value.id+'" isPreferential="'+value.isPreferential+'" onclick="href(this)">' ;
            }else if(value.businesStatus == 'violate'){
                html += '<div class="hos_doc_child clearfix" style="background: url('+"../../app/img/violate.png"+') 100% 46% / 30% no-repeat" specialId="'+value.id+'" isPreferential="'+value.isPreferential+'" onclick="href(this)">' ;
            }else if(value.businesStatus == 'closed'){
                html += '<div class="hos_doc_child clearfix" style="background: url('+"../../app/img/closedHos.png"+') 100% 46% / 30% no-repeat" specialId="'+value.id+'" isPreferential="'+value.isPreferential+'" onclick="href(this)">' ;
            }
            if(value.isPreferential == true){
                html += '<img class="huiImg" src="/app/img/hui.png">'
            }
            html += '<div class="doc_child_left">' +
                '<img src="' + value.headImgUrl + '">' +
                '</div>' +
                '<div class="doc_child_right" style="margin: 0 0 0 0;">' +
                '<div class="id">' +
                '<p class="name" style="height: inherit;"><span class="hot" style="height: .4rem">热销</span><span class="goodsName" style="    display: inline;">' + value.name + '</span></p>' +
                '<p class="address">' + value.hospitalName + '</p>' ;
            if(value.isPreferential == true){
                html += '<p><span style="color: #f81f7b;font-size: .4rem;">￥</span><span class="price">'+value.price+'</span>' +
                    '<del class="oldprice">￥'+value.originalPrice+'</del>' +
                    '</p>'
            }else if(value.isPreferential == false){
                html += '<p class="name" style="font-size: .26rem;">约定价格：<span class="goodsName" style="color: #f93688;">'+value.price+'</span>(不高于)</p>'
            }
            html += '<p><span class="yuyue" style="float:none;">约定周期：<span class="peopelcount" style="color: #010101;">'+value.day+'</span>天</span></p>' +/*<span class="yuyue">已预约<span class="peopelcount">' + value.sellQuantity + '</span>人</span>*/
                '</div>' +
                '</div>' +
                '</div>';
            //$('.hos_list').append(html);
            $('.interestList').append(html);
        });
    },
}
function href(obj) {
    //window.location.href = 'special_cp.html?itemId='+ $(obj).attr('specialId');
    if($(obj).attr('isPreferential') == 'true'){
        window.location.href = 'special_cp.html?itemId='+ $(obj).attr('specialId');
    }else if($(obj).attr('isPreferential') == 'false'){
        window.location.href = 'cp.html?cpId='+ $(obj).attr('specialId');
    }
}
function closeopen() {
    $('.modelOpen').hide();
}
function callback() {
    $('.modelOpen').hide();
    Go.share();
}