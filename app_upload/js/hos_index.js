
var surplus = []; //存入剩余医院医生 数组
var surplusYm = [];//存入剩余医美推荐
var surplusYmSpeical = [];//存入剩余医美推荐
var hosdesc = '';
var tolatitude;
var tolongitude;
var toname;
var toaddress;
var businesStatus;
var title;
var link;
var imgUrl;
var desc;
function init() {
    if(window.history.length == 1){
        $('.pub_hearder_left').attr("onclick","window.location.href = 'xywz.html'");
    }
    Get.GetHocInfo();
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
function toLocalAddress() {
    if(is_weixn()){
        getSignHos();
    }else{
        window.location.href = 'http://api.map.baidu.com/geocoder?location='+tolatitude+','+tolongitude+'&output=html'
    }
}
function getSignHos() {
    var url = SERVER_ADDR + '/wx/getSign.json';
    var Data = {};
    Data.url = window.location.href;
    /*if(SERVER_ADDR == 'http://www.enuo120.com'){*/
        ajaxGetRetInfo(url, Data, getSignHosSuccess, '请求失败', 'GET', true, undefined);
    /*}*/
}
function getSignHosSuccess(retInfo) {
    console.log(retInfo)
    payResultHos(retInfo);
}
function payResultHos(jsonData) {
    wx.config({
        debug: true,
        appId: jsonData.data.appId,
        timestamp: jsonData.data.timestamp,
        nonceStr: jsonData.data.nonceStr,
        signature: jsonData.data.signature,
        jsApiList: ['openLocation']
    });
    wx.ready(function () {
        wx.openLocation({
            latitude: tolatitude,
            longitude: tolongitude,
            name: toname,
            address: toaddress,
            scale: 14
        });
    })
}
var Get = {
    GetHocInfo:function () {
        var url = SERVER_ADDR + '/app/hospital/getDetail.json';
        var Data = {};
        Data.id = getQueryString('hosId');
        ajaxGetRetInfo(url, Data, this.getHocInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    getHocInfoSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            //$('#thisAddress').attr('href','http://api.map.baidu.com/geocoder?location='+40.916979519873+','+119.41004950566+'&coord_type=bd09ll&output=html&src=yourCompanyName|yourAppName');
           //$('.hocImg').attr('src', retInfo.data.headImgUrl);
            title = retInfo.data.name;
            link = window.location.href;
            imgUrl = retInfo.data.headImgUrl;
            desc = retInfo.data.brief;
            $('.hocImg').attr('src',retInfo.data.headImgUrl);
            $('.hosImgBack').attr('src',retInfo.data.images[0]);
            $('.hosname').text(retInfo.data.name);
            $('.hosnameBu').text(retInfo.data.typeName);
            $('.make_num').text(retInfo.data.orderQuantity);
            $('.hosAddress').text(retInfo.data.address);
            $('.descinfo').text(retInfo.data.brief);
            businesStatus = retInfo.data.businesStatus;
            if(businesStatus == 'normal' || businesStatus == undefined){

            }else if(businesStatus == 'violate'){
                $('.hospitail_detailDiv').css('background','url(../../app/img/violate.png) 100% 46% / 30% no-repeat');
            }else if(businesStatus == 'closed'){
                $('.hospitail_detailDiv').css('background','url(../../app/img/closedHos.png) 100% 46% / 30% no-repeat');
            }
            tolatitude = retInfo.data.latitude;
            tolongitude = retInfo.data.longitude;
            toname = retInfo.data.name;
            toaddress = retInfo.data.address;
            if(retInfo.data.isFavorite == true){
                $('.pub_hearder_right').attr('src','img/favouriteYes.png');
            }
            hosdesc = retInfo.data.brief;
            if(hosdesc.length >= 34){
                $('.flex_all_center').show();
            }else {
                $('.flex_all_center').hide();
            }
           /* $('.lunscore').text(retInfo.data.evaluationQuantity);
            $('.commontCount').text('(' + retInfo.data.evaluationQuantity + ')' );
            $('.hosName').text(retInfo.data.hospitalName).attr('hosId',retInfo.data.hospitalId);*/

            $('.hosDiv').attr('hosId',retInfo.data.hospitalId);
            retInfo.data.images.forEach(function (value) {   //加入医院图片
                $('.hos_detail_pic').append('<img src="'+value+'" />')
            })

                //$('.hos_doc_team').show();
                //$('.hos_doc_team_ym').hide();
                if(retInfo.data.doctors){
                    if(retInfo.data.doctors.length <= 3){
                        $('.all_doc').hide();
                    }else{
                        $('.all_doc').show();
                    }
                    retInfo.data.doctors.forEach(function (value,index) {  //加入医院医生
                        if(index <= 2){
                            Get.adddoc(value);
                        }else{
                            surplus.push(value);
                        }
                    })
                }else {
                    $('.all_doc').hide();
                }

                //$('.hos_doc_team').hide();
                //$('.hos_doc_team_ym,.hospitail_detail').show();
                if(retInfo.data.productJsons && retInfo.data.productJsons.length != 0){
                    if(retInfo.data.productJsons.length <= 3){
                        $('.all_doc_ym').hide();
                    }else{
                        $('.all_doc_ym').show();
                    }
                    retInfo.data.productJsons.forEach(function (value,index) {  //加入医院产品
                        if(index <= 2){
                            Get.addTui(value);
                        }else{
                            surplusYm.push(value);
                        }
                    })
                }else {
                    $('.all_doc_ym').hide();
                    $('.tabjiaLeft').hide();
                    $('.tejiaLeft').hide();
                    $('.tejiaRight').show();
                    $('.tabjiaRight').css('margin-left','24%').children('.avtivitySpan').addClass('avtivityactive');
                }
                /*if(retInfo.data.productJsons  && retInfo.data.productJsons.length != 0){
                    if(retInfo.data.productJsons.length <= 3){
                        $('.all_doc_spcial').hide();
                    }else{
                        $('.all_doc_spcial').show();
                    }
                    retInfo.data.productJsons.forEach(function (value,index) {  //加入医院特价
                        if(index <= 2){
                            Get.addSpecial(value);
                            if(!retInfo.data.projects){
                                $('.tejiaRight').show();
                                $('.tabjiaRight').children('.avtivitySpan').addClass('avtivityactive');
                            }
                        }else{
                            surplusYmSpeical.push(value);
                        }
                    })
                }else {
                    $('.all_doc_spcial').hide();
                    $('.tabjiaRight').hide();
                    $('.tabjiaLeft').css('margin-left','24%');
                }*/
                /*if(!retInfo.data.projects && !retInfo.data.productJsons){
                    $('.hos_doc_team_ym').hide();
                }*/



        }else{
            alert(retInfo.data)

        }
    },
    adddoc:function (value) {
            var html = '';
        if(businesStatus == 'normal' || businesStatus == undefined){
            html += '<div class="hos_doc_child clearfix" itemid="'+value.id+'" onclick="href(this)">' ;
        }else if(businesStatus == 'violate'){
            html += '<div class="hos_doc_child clearfix" style="background: url('+"../../app/img/violate.png"+') 100% 46% / 30% no-repeat" itemid="'+value.id+'" onclick="href(this)">' ;
        }else if(businesStatus == 'closed'){
            html += '<div class="hos_doc_child clearfix" style="background: url('+"../../app/img/closedHos.png"+') 100% 46% / 30% no-repeat" itemid="'+value.id+'" onclick="href(this)">' ;
        }
            html += '<div class="doc_child_left"> ' +
            '<img src="'+value.headImgUrl+'"> ' +
            '</div> ' +
            '<div class="doc_child_right" style="margin: 2% 0 0 0%;"> ' +
            '<div class="id" style="height: inherit;"> ' +
            '<p class="name" style="height: inherit;line-height: inherit">'+value.name+'&nbsp;<span class="hosLevel">'+value.doctorTypeName+'</span></p> ' +
            '<p><span>科室：</span><span>'+value.subSubjectName+'</span></p> ' +
            '<p style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;    margin-top: -.5rem;"><span>擅长领域：'+value.specialty+'</span><span>' ;
            /*if(value.diseases && value.diseases.length > 0){
                value.diseases.forEach(function (value,index) {
                    //$('.docGood').append(value+' ');
                    html += value + ' ';
                })
            }*/
            html +=   '</span></p> ' +
            '</div> ' +
            '</div> ' +
            '</div>';
            $('.hos_doc_list_doc').append(html);
    },
    addTui:function (value) {  //医美加入推荐
        var html = '';
        html += '<div class="hos_child set_box_shadow" style="position: relative" isPreferential="'+value.isPreferential+'" itemid="'+value.id+'" onclick="ymhref(this)"> '
        if(value.isPreferential == true){
            html += '<img class="huiImg" src="/app/img/hui.png">'
        }
        if(businesStatus == 'normal' || businesStatus == undefined){
            html += '<div class="hos_list_top clearfix">' ;
        }else if(businesStatus == 'violate'){
            html += '<div class="hos_list_top clearfix" style="background: url('+"../../app/img/violate.png"+') 100% 46% / 30% no-repeat">' ;
        }else if(businesStatus == 'closed'){
            html += '<div class="hos_list_top clearfix" style="background: url('+"../../app/img/closedHos.png"+') 100% 46% / 30% no-repeat">' ;
        }
        html += '<div class="left"><img src="'+value.headImgUrl+'"></div> ' +
            '<div class="right" style="width: 61%"><p class="detail"><span class="name">'+value.name+'</span></p> ' +
            '<p><span style="color: #00afa1;font-size: .75rem">'+value.hospitalName+'</span></p> ' ;
        if(value.isPreferential == true){
            html += '<p><span style="color: #f81f7b;font-size: .7rem;">￥</span><span class="price">'+value.price+'</span>' +
                '<del class="oldprice">￥'+value.originalPrice+'</del>' +
                '</p>'
        }else if(value.isPreferential == false){
            html += '<p class="name" style="font-size: .8rem;">约定价格：<span class="goodsName" style="color: #f93688;">'+value.price+'</span>（不高于）</p>'
        }
        html +=    '<p><span><span>约定周期：</span><span class="">'+value.day+'天</span</span><span style="float: right;color: #707070"></span></p></div> ' +/*<span>预约：</span><span class="">'+value.orderQuantity+'人</span>*/
            '</div> ' +
            '</div> ' +
            '</div>';
        $('.hos_doc_list_ym').append(html);
    },
    addSpecial:function (value) {
        var html = '';
        html += '<div class="hos_doc_child clearfix" specialid="'+value.id+'" onclick="specialhref(this)"> ' +
            '<div class="doc_child_left">' +
            '<img style="max-height: 4.5rem;" src="'+value.headImgUrl+'"> ' +
            '</div> ' +
            '<div class="doc_child_right" style="margin: 0 0 0 0;"> ' +
            '<div class="id">' +
            '<p class="name"><span class="hot" style="font-size: .75rem;line-height: 1.1rem;height: 1.3rem;vertical-align: top;margin-top: .05rem;">热销</span>' +
            '<span class="goodsName" style="font-size: .85rem;display: inline-block;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;width: 80%;">'+value.name+'</span> ' +
            '</p> ' +
            '<p class="address">'+value.hospitalName+'</p> ' +
            '<p><span style="color: #f81f7b;font-size: .7rem;">￥</span><span class="price" style="font-size: 1.1rem">'+value.price+'</span> ' +
            '<del class="oldprice">￥'+value.originalPrice+'</del> ' +
            '</p> ' +
            '</div> ' +
            '</div> ' +
            '</div>';
        $('.hos_doc_list_special').append(html);
    },
    surplus:function () {
        surplus.forEach(function (value) {
            Get.adddoc(value);
            $('.all_doc').hide();
        })
    },
    surplusym:function () {
        surplusYm.forEach(function (value) {
            Get.addTui(value);
            $('.all_doc_ym').hide();
        })
    },
    surplusspecial:function () {
        surplusYmSpeical.forEach(function (value) {
            Get.addSpecial(value);
            $('.all_doc_spcial').hide();
        })
    },
    descsurplus:function () {
        $('.descinfo').removeClass('overflow_num_ellipsis');
        $('.flex_all_center').hide();
    },
    favourite: function () {  //收藏医院
        if( $('.pub_hearder_right').attr('src') == ('img/favouriteYes.png')){
            var url = SERVER_ADDR + '/app/user/favorite/cancel';  //取消收藏
        }else{
            var url = SERVER_ADDR + '/app/user/favorite/add'; //收藏
        }
        var Data = {};
        Data.id = getQueryString('hosId');
        Data.type = 'hopital';
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
            alert('请求数据有错')
        }
    },
}
function href(obj) {
    window.location.href = 'dos_index.html?docId='+ $(obj).attr('itemid');
}
function ymhref(obj) {
    if($(obj).attr('isPreferential') == 'true'){
        window.location.href = 'special_cp.html?itemId='+ $(obj).attr('itemid');
    }else if($(obj).attr('isPreferential') == 'false'){
        window.location.href = 'cp.html?cpId='+ $(obj).attr('itemid');
    }
}
function specialhref(obj) {
    window.location.href = "special_cp.html?itemId="+ $(obj).attr('specialid');
}