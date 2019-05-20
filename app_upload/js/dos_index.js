var pageNumber = 1;
var total = 5;
var nexttotal = 0;
var pageNumberCase = 1;
var totalCase = 5;
var businesStatus;
var title;
var link;
var imgUrl;
var desc;
var productName = '';
var productImg = '';
var docotrType = '';
var hospitalName = '';
var doctorSubject = ''
function init() {
    if(window.history.length == 1){
        $('.pub_hearder_left').attr("onclick","window.location.href = 'xywz.html'");
    }
    Get.GetDocInfo();
    Get.cpcase();
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
        /*if( $('.tabjiaRight').attr('ajax') != 'true'){
            Get.cpcase();
        }*/


    });
    $(window).scroll(function(){
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if(scrollTop + windowHeight - scrollHeight == 0 ){
            console.log("you are in the bottom");
            if((total == $('.hos_commont_child').length && pageNumber == 2) || (total >= $('.hos_commont_child').length && pageNumber > 2)){
                Get.commontMore();
            }
            if(totalCase > $('.hos_case_child').length){
                Get.cpcase();
            }
        }
    });
}
var Get = {
    descsurplus:function () {
        $('.descinfo').removeClass('overflow_num_ellipsis');
        $('.all_descsurplus').hide();
    },
    descgooddoc:function () {
        $('.docGood').removeClass('overflow_num_ellipsis');
        $('.all_descgooddoc').hide();
    },
    GetDocInfo:function () {
        var url = SERVER_ADDR + '/app/doctor/getDetail.json';
        var Data = {};
        Data.id = getQueryString('docId');
        ajaxGetRetInfo(url, Data, this.getDocInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    getDocInfoSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            title = retInfo.data.hospitalName + '-' +retInfo.data.name;
            link = window.location.href;
            imgUrl = retInfo.data.headImgUrl;
            desc =  '擅长：' + retInfo.data.specialty;
            productName = retInfo.data.name;
            productImg = retInfo.data.headImgUrl;
            docotrType = retInfo.data.doctorTypeName;
            hospitalName = retInfo.data.hospitalName;
            doctorSubject = retInfo.data.subjectName;
            $('.docImg').attr('src', retInfo.data.headImgUrl);
            $('.hosImg').attr('src', retInfo.data.hosImgUrl);
            $('.docname').text(retInfo.data.name);
            $('.docSubject').text(retInfo.data.subjectName);
            $('.docLevel').text(retInfo.data.doctorTypeName);
            $('.descinfo').text(retInfo.data.brief);
            $('.hosName').text(retInfo.data.hospitalName).attr('hosId',retInfo.data.hospitalId);
            $('.line_consult').attr('employee',retInfo.data.employeeId);
            $('.docGood').text(retInfo.data.specialty);
            if(retInfo.data.specialty.length < 50){
                $('.all_descgooddoc').hide();
            }
            if(retInfo.data.specialty.brief < 50){
                $('.all_descsurplus').hide();
            }
            businesStatus = retInfo.data.businesStatus;
            if(businesStatus == 'normal' || businesStatus == undefined){

            }else if(businesStatus == 'violate'){
                $('.docTop').css('background','url(../../app/img/violate.png) 100% 46% / 30% no-repeat');
            }else if(businesStatus == 'closed'){
                $('.docTop').css('background','url(../../app/img/closedHos.png) 100% 46% / 30% no-repeat');
            }
           /* if(retInfo.data.diseases && retInfo.data.diseases.length > 0){
                retInfo.data.diseases.forEach(function (value, index) {
                    $('.docGood').append(value+' ');
                })
            }*/
            $('.make_num').text(retInfo.data.orderQuantity);
            $('.shouscore').text(retInfo.data.favoriteQuantity);
            $('.pingscore').text(retInfo.data.score);
            $('.lunscore').text(retInfo.data.evaluationQuantity);
            $('.commontCount').text('(' + retInfo.data.evaluationQuantity + ')' );
            $('.hosDiv').attr('hosId',retInfo.data.hospitalId);
            if(retInfo.data.isFavorite == true){
                $('.pub_hearder_right').attr('src','img/favouriteYes.png');
            }
            if(retInfo.data.evaluations && retInfo.data.evaluations.length > 0){
                Get.addcomment(retInfo.data.evaluations);
            }
        }else{
            alert(retInfo.data)
        }
    },
    addcomment:function (retInfo) {
        retInfo.forEach(function (value) {
            console.log(value)
            var html = '';
            html += '<div class="hos_doc_child hos_commont_child clearfix"> ' +
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
            $('.doc_commont_list').append(html);
        })
        $('#gallery img').fsgallery()
        pageNumber++;
    },
    commontMore:function () {
        var url = SERVER_ADDR + '/app/evaluation/getList.json';
        var Data = {};
        Data.pageNumber = pageNumber;
        Data.type = 'doctor';
        Data.id = getQueryString('docId');
        ajaxGetRetInfo(url, Data, this.commontMoreSuccess, '请求失败', 'GET', true, undefined);
    },
    commontMoreSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            if(retInfo.data && retInfo.data.length > 0){
                Get.addcomment(retInfo.data);
            }
            total = retInfo.total;
            nexttotal = retInfo.total;

        }else{
            alert(retInfo.data)
        }
    },
    cpcase: function () {
        var url = SERVER_ADDR + '/app/effectCase/getList.json';
        var Data = {};
        Data.fkId = getQueryString('docId');
        Data.type = 'doctor';
        Data.pageNumber = pageNumberCase;
        Data.pageSize = 5;
        ajaxGetRetInfo(url, Data, this.cpcaseSuccess, '请求失败', 'GET', true, undefined);
    },
    cpcaseSuccess:function (retInfo) {
        console.log(retInfo);
        if(retInfo.success == true){
            //加入案例
            //$('.doc_case_list').empty();
            if(retInfo.data.length > 0){
                retInfo.data.forEach(function (value) {
                    console.log(value)
                    var html = '';
                    html += '<div class="hos_doc_child hos_case_child clearfix" style="margin-top: 0"> ' +
                        /*   '<div class="doc_child_left"> ' +
                           '<img src="'+value.headImgUrl+'"> ' +
                           '</div> ' +*/
                        '<div class="doc_child_right" style="margin: -0.5% 0 0 0%;    width: 99%;"> ' +
                        '<div class="id" style="margin-left: 5%"> ' +
                        '<p class="commontZi" style="margin: 0.4rem 0 0.8rem 0;">'+value.content+'</p> ' +
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
                    $('.doc_case_list').append(html);
                });
                $('#gallery img').fsgallery()
                pageNumberCase++;
            }
            totalCase = retInfo.totalCount;
            /*$('.tabjiaRight').attr('ajax',true);*/
        }else{
            alert(retInfo.data);
        }
    },
}
var To = {
    favorite:function () {
        if( $('.pub_hearder_right').attr('src') == ('img/favouriteYes.png')){
            var url = SERVER_ADDR + '/app/user/favorite/cancel';  //取消收藏
        }else{
            var url = SERVER_ADDR + '/app/user/favorite/add'; //收藏
        }
        //var url = SERVER_ADDR + '/app/user/favorite/add';
        var Data = {};
        Data.id = getQueryString('docId');
        Data.type = 'doctor';
        ajaxGetRetInfo(url, Data, this.favoriteSuccess, '请求失败', 'POST', true, undefined);
    },
    favoriteSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            //$('.shoucang').css('background-color','#b6b6b6').text('已收藏').attr('disabled',true);
            //$('.pub_hearder_right').attr('src','img/favouriteYes.png');
            if( $('.pub_hearder_right').attr('src') == ('img/favouriteYes.png')){
                $('.pub_hearder_right').attr('src','img/favouriteNo.png');  //取消收藏
            }else{
                $('.pub_hearder_right').attr('src','img/favouriteYes.png'); //收藏
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
    dos:function () {
            window.location.href = 'dos_info.html?dosId=' + getQueryString('docId');
    }
}
var Go = {
    chat:function () {
        window.location.href = 'chat.html?hosId=' + $('.line_consult').attr('employee') + '&type=doctor' + '&doctorSubject='+ doctorSubject + '&productName='+ productName + '&hospitalName='+ hospitalName + '&productImg='+ productImg + '&docotrType='+ docotrType +'&productId='+ getQueryString('docId');;
    },
    yuyue:function () {
        if(businesStatus == 'normal' || businesStatus == undefined){
            window.location.href = 'pay/dos_yuyue.html?docId='+getQueryString('docId') + '&type=doctor';
        }else if(businesStatus == 'violate'){
            alert('为了医疗安全，不可以预约');
        }else if(businesStatus == 'closed'){
            alert('暂未开放约定医疗，不可预约');
        }
    },
    topanimate: function () {
        $(".share").removeClass("first-active").addClass("am-modal-active");//向上弹出取消
        if ($(".sharebg").length > 0) {
            $(".sharebg").addClass("sharebg-active");//背景颜色变化并增加透明度
        } else {
            $("body").append('<div class="sharebg"></div>');
            $(".sharebg").addClass("sharebg-active");
        }
    },
    closetopanimate:function () {
        $(".share").removeClass("am-modal-active").addClass("first-active");//向上弹出取消
        setTimeout(function () {
            $(".sharebg-active").removeClass("sharebg-active");//背景颜色恢复
            $(".sharebg").remove();

        }, 200);
    }
}