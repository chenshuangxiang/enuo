var pageNum = 1;
var totalCount = 0;
/*$(document).ready(function(){
    $(".subChildRoom").click(function(){
        if ($('.Category-eject').hasClass('grade-w-roll')){
            $('.Category-eject').removeClass('grade-w-roll');
        };
    });
});
$(document).ready(function(){
    $(".subChildRoom").click(function(){
        if ($('.grade-eject').hasClass('grade-w-roll')){
            $('.grade-eject').removeClass('grade-w-roll');
        };

    });
});
$(document).ready(function(){
    $(".subChildRoom").click(function(){
        if ($('.meishi22').hasClass('grade-w-roll')){
            $('.meishi22').removeClass('grade-w-roll');
        };

    });
});*/
function init() {
    $('.head_title').text(getQueryString('subjectName'));
    Choose.level()
  /*  $(".subChildRoom").click(function(){
        Choose.subsubject()
        $('.levelLong').removeClass('grade-w-rollRight');
        if ($('.subjectLong').hasClass('grade-w-roll')) {
            $('.subjectLong').removeClass('grade-w-roll');
        } else {
            $('.subjectLong').addClass('grade-w-roll');
        }
    });*/
    $(".level").click(function(){
        Choose.level()
    /*    $('.subjectLong').removeClass('grade-w-roll');*/
        if ($('.levelLong').hasClass('grade-w-rollRight')) {
            $('.levelLong').removeClass('grade-w-rollRight');
            $('.mubuxiala').hide();
        } else {
            $('.levelLong').addClass('grade-w-rollRight');
            $('.mubuxiala').show();
        }
    });
    $(".mubuxiala").click(function(){
        $('.mubuxiala').hide();
        $('.levelLong').removeClass('grade-w-rollRight');
    })
}
//获取选择筛选
var Choose = {
    level:function () {
        if( $('.level').attr('ajax') == 'true'){
            return
        }
        var url = SERVER_ADDR + '/common/getProductCategorys.json'; //'http://www.yinliuta.com/activity/checkWxAccount';
        var Data = {};
        if(getQueryString('type') == null){
            $('.chooseFen').hide();
            $('#mescroll').css('top','2.7rem')
        }
        Data.type = getQueryString('type');
        ajaxGetRetInfo(url,Data,this.checkSuccess,'请求失败', 'GET', undefined, undefined);
    },
    checkSuccess:function (retInfo) {
        if(retInfo.success == true){
            console.log(retInfo)
            $('.swiper-slide-duplicate').remove();
            if(retInfo.data.length === 0){
                $('.chooseFen').hide();
                $('#mescroll').css('top','2.7rem');
            }else if(retInfo.data.length > 0 && retInfo.data.length <= 8 ){
                if(retInfo.data.length === 1){
                    $('.chooseFen').hide();
                    $('#mescroll').css('top','2.7rem');
                }else{
                    $('.swiper-slide-prev1,.swiper-slide-prev2').remove();
                }
            }else if(retInfo.data.length > 8 && retInfo.data.length <= 16 ){
                $('.swiper-slide-prev2').remove();
            }
            //$('.ks_list').empty();
            /*if(retInfo.data.length === 0){
                $('.levelLong').removeClass('grade-w-rollRight');
                alert('暂无职称可选择')
            }else{
                $('.levelLong').addClass('grade-w-rollRight');
            }*/
            retInfo.data.forEach(function (value,index) {
                console.log(value,index)
                var html = '';
                html += "<li class='levelClick' levelid='"+value.id+"'><span style='display: block'><img style='width: 2.3rem;' src='/app/img/findspeialLogo/"+value.id+".png'></span>" +
                    "<span style='display: block'>"+value.name+"</span>" +
                    "</li> " ;
                if(index <= 7){
                    $('.swiper-slide-prev0 ul').append(html);
                }else if(index > 7 && index <= 15 ){
                    $('.swiper-slide-prev1 ul').append(html);
                }else{
                    $('.swiper-slide-prev2 ul').append(html);
                }

            })
            new Swiper('.swiper-container-lun', {
                pagination: '.swiper-pagination',
                loop: true,//轮播图循环
                grabCursor: false,
                //paginationClickable: true,// 原点点击切换
                // autoplay: 3000, // 三秒钟自动轮播
                speed:600,
                observer: true,//修改swiper自己或子元素时，自动初始化swiper

                observeParents: true,//修改swiper的父元素时，自动初始化swiper
                autoplayDisableOnInteraction: false //手指滚过后继续轮播
            });
            $('.levelClick').click(function () {
                console.log(555)
                if($(this).hasClass('borderActive')){
                    $(this).removeClass('borderActive');
                    $('#dataList').empty();
                    var page = {num: 1, size: 5, type: getQueryString('type'),keyword: getQueryString('val'),beautySubjectId:$('.borderActive').attr('levelId')}
                    // mescroll.resetUpScroll();
                    mescroll.setPageNum(1)
                    getListData(page)
                }else{
                    $('.levelClick').removeClass('borderActive');
                    $(this).addClass('borderActive');
                    $('#dataList').empty();
                    var page = {num: 1, size: 5, type: getQueryString('type'),keyword: getQueryString('val'),beautySubjectId:$('.borderActive').attr('levelId')}
                    // mescroll.resetUpScroll();
                    mescroll.setPageNum(1)
                    getListData(page)
                }

            })
            totalCount = retInfo.totalCount;
        }else{
            alert('请求数据有错')
        }
    },
    subsubject: function () {
        if( $('.subChildRoom').attr('ajax') == 'true'){
            return
        }
        var url = SERVER_ADDR + '/app/common/getSubSubjectList.json'; //'http://www.yinliuta.com/activity/checkWxAccount';
        var Data = {};
        Data.subjectId = getQueryString('subjectId');
        ajaxGetRetInfo(url, Data, this.checkSubsubjectSuccess, '请求失败', 'GET', true, undefined);
    },
    checkSubsubjectSuccess:function (retInfo) {
        if(retInfo.success == true){
            console.log(retInfo);
            if(retInfo.data.length === 0){
               $('.subjectLong').removeClass('grade-w-roll');
                $('.mubuxiala').hide();
                alert('暂无子科室可选择')
            }
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
                $('.subjectLong').removeClass('grade-w-roll');
                $('.mubuxiala').hide();
                $('.subText').text($(this).text()).attr('subsubId',$(this).attr('subsubId'));
                $('#dataList').empty();
                var page = {num: 1, size: 5, subjectId: getQueryString('subjectId'),subSubjectId:$('.subText').text()}
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
}
