function init() {
    Get.subject();
    Get.doclist();
  /*  Get.tuiMore();
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
    });*/
}
var pageNumber = 1;
var total = 5;
//获取一级科室
var Get = {
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
                if(value.id != 11){
                    $('.ks_list').append('<div class="ks_child" subId="'+value.id+'" onclick="Get.href(this)"> ' +
                        '<p class="img1 set_img_bg"><img src="'+value.icon+'"></p><br /><span>'+value.name+'</span> ' +
                        '</div>')
                }
            })
        }else{
            alert('请求数据有错')
        }
    },
    href:function (obj) {
        if($(obj).find('span').text() == '营养科' || $(obj).find('span').text() == '老年科' || $(obj).find('span').text() == '传染科'){
            //window.location.href = 'zxmr.html?subjectId='+ $(obj).attr('subId') + '&subjectName=整形美容科';
            //window.location.href = 'ym_index.html';
            layer.open({
                content: '此科室尚未开通'
                ,skin: 'msg'
                ,time: 2 //2秒后自动关闭
            });
        }else{
            window.location.href = 'find_subject.html?subjectId='+ $(obj).attr('subId') + '&subjectName='+$(obj).children().text();
        }
    },
    tuiMore:function () {  //加入推荐接口
        var url = SERVER_ADDR + '/app/common/recommend';
        var Data = {};
        Data.pageNumber = pageNumber;
        Data.pageSize = 5;
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
                '<p><span style="color: #f81f7b;font-size: .7rem;">￥</span><span class="price">'+value.price+'</span><del class="oldprice">￥'+value.originalPrice+'</del><span class="yuyue">已预约<span class="peopelcount">'+value.sellQuantity+'</span>人</span></p>' +
                '</div>' +
                '</div>' +
                '</div>';
            //$('.hos_list').append(html);
            $('.hos_doc_list').append(html);
        })
        $('.hos_doc_child:last-child').css('border-bottom','0');
        pageNumber++;
    },
    doclist:function () {
        var url = SERVER_ADDR + '/app/doctor/getRandomList.json';
        var Data = {};
        Data.latitude = localStorage.getItem("latitude");//30.317750930786133//
        Data.longitude = localStorage.getItem("longitude");//120.10475158691406//
        Data.cityName = localStorage.getItem('city');
        Data.provinceName = localStorage.getItem('province');
        ajaxGetRetInfo(url,Data,this.doclistSuccess,'请求失败', 'GET', undefined, undefined);
    },
    doclistSuccess:function (retInfo) {
        if(retInfo.success == true){
            var listDom=$("#dataList");
            listDom.empty();
            for (var i = 0; i < retInfo.data.length; i++) {
                var pd=retInfo.data[i];

                var str='';
                str += '<li class="hos_child set_box_shadow" docId="'+pd.id+'" onclick="dochref(this)">' ;
                if(pd.businesStatus == 'normal' || pd.businesStatus == undefined){
                    str += '<div class="hos_list_top clearfix">' ;
                }else if(pd.businesStatus == 'violate'){
                    str += '<div class="hos_list_top clearfix" style="background: url('+"../../app/img/violate.png"+') 100% 46% / 30% no-repeat;">' ;
                }else if(pd.businesStatus == 'closed'){
                    str += '<div class="hos_list_top clearfix" style="background: url('+"../../app/img/closedHos.png"+') 100% 46% / 30% no-repeat;">' ;
                }
                str += '<div class="left"><img src="'+pd.headImgUrl+'"/></div>' +
                    '<div class="right">' +
                    '<p class="detail">' +
                    '<span class="name">'+pd.name+'</span> <span class="docLevel">'+pd.subSubjectName+'<span style="color: #707070;display: inline-block;margin-left: .6rem;">'+ pd.doctorTypeName+'</span></span>' +
                    '<span style="float: right;color: #707070;display: inline-block">' ;

                if(Number(pd.distance) < 1000){
                    str +='<span style="color: #00afa1">'+pd.distance+'m</span>';
                }else if(Number(pd.distance) >= 1000){
                    str +='<span style="color: #00afa1">'+(Number(pd.distance)/1000).toFixed(1)+'km</span>';
                }else if(pd.distance == undefined){
                    //str +='<span style="color: #00afa1"></span>';
                }
                //'<span class="" style="color: #00afa1">'+pd.orderQuantity+'</span></span>' +

                str += '</p>' +
                    '<p>' +
                    '<span style="color: #00afa1">'+pd.hospitalName+'</span><span style="display: inline-block;margin-left: .8rem">'+pd.hospitalLevel+'</span>' +
                    '</p>' +
                    /* '<p>' +
                     '<span>科室：</span><span>'+pd.subSubjectName+'</span>' +
                     '</p>' +*/
                    '<p class="goodPlace overflow_num_ellipsis" style="height: 2.6em;border-top: 0;color: #707070;">' +
                    '<span>擅长领域：'+pd.specialty+'</span>' ;
                /*if(pd.diseases && pd.diseases.length > 0){
                    pd.diseases.forEach(function (value, index) {
                        str +=  '<span>'+value+' '+'</span>'
                    })
                }*/
                str += '</p>' +
                    '</div>' +
                    '</div></li>'

                /*	var liDom=document.createElement("li");
                    liDom.innerHTML=str;
                    listDom.appendChild(liDom);*/
                listDom.append(str);
            }
        }else{
            alert(retInfo.data);
        }
    }
}
function callback() {
    Get.doclist();
}
function href(obj) {
    window.location.href = 'special_cp.html?itemId='+ $(obj).attr('specialId');
}
function dochref(obj) {
    window.location.href = "dos_index.html?docId="+$(obj).attr('docId')
}