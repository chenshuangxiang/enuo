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
    $('.head_title').text(getQueryString('subjectName'))
    $(".subChildRoom").click(function(){
        Choose.subsubject()
        $('.levelLong').removeClass('grade-w-rollRight');
        if ($('.subjectLong').hasClass('grade-w-roll')) {
            $('.subjectLong').removeClass('grade-w-roll');
            $('.mubuxiala').hide();
        } else {
            $('.subjectLong').addClass('grade-w-roll');
            $('.mubuxiala').show();
        }
    });
    $(".level").click(function(){
       /* if($('.subText').attr('subsubId') == undefined){
            alert('请先选择子科室');
            return
        }*/
        $('.subjectLong').removeClass('grade-w-roll');
        if ($('.levelLong').hasClass('grade-w-rollRight')) {
            $('.levelLong').removeClass('grade-w-rollRight');
            $('.mubuxiala').hide();
        } else {
            $('.levelLong').addClass('grade-w-rollRight');
            $('.mubuxiala').show();
        }
        Choose.level();
    });
    $(".mubuxiala").click(function(){
        $('.mubuxiala').hide();
        $('.levelLong,.subjectLong').removeClass('grade-w-roll');
        $('.levelLong,.subjectLong').removeClass('grade-w-rollRight');
    })
}
//获取选择筛选
var Choose = {
    level:function () {
        if($('.level').attr('ajax') == 'true' && $('.levelLongSort li').length == 0){
            $('.levelLong').removeClass('grade-w-rollRight');
            $('.mubuxiala').hide();
            alert('暂无职称可选择')
        }
        if( $('.level').attr('ajax') == 'true'){
            return
        }
        var url = SERVER_ADDR + '/app/common/getDoctorTypeList.json'; //'http://www.yinliuta.com/activity/checkWxAccount';
        var Data = '';
        ajaxGetRetInfo(url,Data,this.checkSuccess,'请求失败', 'GET', undefined, undefined);
    },
    checkSuccess:function (retInfo) {
        if(retInfo.success == true){
            console.log(retInfo)
            if(retInfo.data.length === 0){
                $('.levelLong').removeClass('grade-w-rollRight');
                $('.mubuxiala').hide();
                alert('暂无职称可选择')
            }
            //$('.ks_list').empty();
            /*if(retInfo.data.length === 0){
                $('.levelLong').removeClass('grade-w-rollRight');
                alert('暂无职称可选择')
            }else{
                $('.levelLong').addClass('grade-w-rollRight');
            }*/
            $('.levelLongSort').empty();
            retInfo.data.forEach(function (value) {
                console.log(value)
                var html = '';
                html += '<li class="levelClick" levelId="'+value.id+'">'+value.name+'</li>'
                $('.levelLongSort').append(html);
            })
            $('.level').attr('ajax','true')
            $('.levelClick').click(function () {
                $('.levelLong').removeClass('grade-w-rollRight');
                $('.mubuxiala').hide();
                $('.levelText').text($(this).text()).attr('levelId',$(this).attr('levelId'));
                $('#dataList').empty();
                var page = {num: 1, size: 5, subjectId: getQueryString('subjectId'),doctorTypeId:$('.levelText').text()}
                // mescroll.resetUpScroll();
                mescroll.setPageNum(1)
                getListData(page)
            })
            totalCount = retInfo.totalCount;
        }else{
            alert(retInfo.data)
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
                $('.level').attr('ajax','false');
                $('.levelText').text('职称').attr('levelid','');
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
            alert(retInfo.data)
        }
    },
}