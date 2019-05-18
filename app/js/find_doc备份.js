var pageNum = 1;
var totalCount = 0;
$(document).ready(function () {
    $('#wrapper').height($(document).height() - $('.content').height() - 27)
})
function init() {
 /*   $('.height').height($(document).height())*/
    Get.subDocList(pageNum);
   /* $(".height").unbind("scroll").bind("scroll", function(e){
        var sum = this.scrollHeight ;
        console.log('sum'+ sum,'top'+$(this).scrollTop(),'thisheight'+$(this).height())
        if (Number(sum) <= Number($(this).scrollTop()) + Number($(this).height())) {
            if($('.hos_child').length <  totalCount){
                console.log('滚到底部了,加载没完')
                pageNum ++;
                Get.subDocList(pageNum);
            }else{
                console.log('滚到底部了,加载完了')
            }
        }
    });*/
}
//获取医生列表
var Get = {
    subDocList:function (pageNumber, keyword, type) {
        var url = SERVER_ADDR + '/app/topthree/doctor/getList.json'; //'http://www.yinliuta.com/activity/checkWxAccount';
        var Data = {};
        Data.pageNumber = pageNumber;
        Data.pageSize = 1;
        if(keyword != ''){
            Data.keyword = keyword;
        }
        if(type == 'refreash'){
            $('.hosListUl').empty();
        }

        ajaxGetRetInfo(url,Data,this.checkSuccess,'请求失败', 'GET', undefined, undefined);
    },
    checkSuccess:function (retInfo) {
        if(retInfo.success == true){
            console.log(retInfo)
            retInfo.data.forEach(function (value) {
                console.log(value)
                var html = '';
                html += '<li class="hos_child set_box_shadow" style="padding-top: .2rem;"><div class="hos_list_top clearfix">' +
                    '<div class="left"><img src="img/find_doc/hos1.png"/></div>' +
                    '<div class="right">' +
                    '<p class="detail">' +
                    '<span class="name">'+value.name+'</span> <span class="docLevel">'+value.doctorTypeName+'</span>' +
                    '</p>' +
                    '<p>' +
                    '<span>医院：</span><span>'+value.hospitalName+'</span>' +
                    '</p>' +
                    '<p>' +
                    '<span>科室：</span><span>'+value.subSubjectName+'</span>' +
                    '</p>' +
                    '<p>' +
                    '<span>预约：</span><span class="peopelCount">'+value.orderQuantity+'人</span>' +
                    '</p>' +
                    '<p class="goodPlace">' +
                    '<span>擅长领域：擅长</span><span>'+value.specialty+'</span>' +
                    '</p>' +
                    '</div>' +
                    '</div></li>'
                //$('.hos_list').append(html);
                $('.hosListUl').append(html)
            })
            totalCount = retInfo.totalCount;
            if($('.hos_child').length ==  totalCount){
                console.log('滚到底部了,加载完了')
                $('.pullUpLabel').text('全部加载完毕').css('margin-left','37%')
            }else{
                $('.pullUpLabel').text('查看更多').css('text-align','left').css('margin-left','42%');
            }
        }else{
            alert('请求数据有错')
        }
    }
}
var Show = {
    Sou:function () {
        $('.pullUpLabel').empty();
        $('.sou').attr('sou',$('.toggleSou').val());
        Get.subDocList(1,$('.sou').attr('sou'),'refreash');
        /*var search= $(".search_publish");
        if (search.css('display') == "none"){
            search.show();
            search.animate({
                "left":"-.35rem",
            },"fast");
        }else {
            if($('.toggleSou').val() == ''){
                search.animate({
                    "left":"5.15rem",
                },"fast",function(){ search.hide();});
            }else{
                $('.hos_list').empty()
                Get.subDocList(1,$('.toggleSou').val());
            }
        }*/
    }
}
//获取选择筛选
/*var Choose = {
    level:function () {
        var url = SERVER_ADDR + '/app/common/getDoctorTypeList.json'; //'http://www.yinliuta.com/activity/checkWxAccount';
        var Data = '';
        ajaxGetRetInfo(url,Data,this.checkSuccess,'请求失败', 'GET', undefined, undefined);
    },
    checkSuccess:function (retInfo) {
        if(retInfo.success == true){
            console.log(retInfo)
            //$('.ks_list').empty();
            retInfo.data.forEach(function (value) {
                console.log(value)
                var html = '';
                html += ''
                $('.hos_list').append(html);
            })
            totalCount = retInfo.totalCount;
        }else{
            alert('请求数据有错')
        }
    },
    subject: function () {
        var url = SERVER_ADDR + '/app/common/getSubjectList.json'; //'http://www.yinliuta.com/activity/checkWxAccount';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.checkSubjectSuccess, '请求失败', 'GET', true, undefined);
    },
    checkSubjectSuccess:function (retInfo) {
        if(retInfo.success == true){
            console.log(retInfo)
            $('#loading').show()
            $('.subjectLong').empty();
            retInfo.data.forEach(function (value) {
                console.log(value)
                var html = '';
                html += '<p class="subP" subId="'+value.id+'" onclick="Choose.subsubject(this)">'+value.name+'</p>'
                $('.subjectLong').append(html).show();
            })
          /!*  $('#loading').remove();*!/
            totalCount = retInfo.totalCount;
        }else{
            alert('请求数据有错')
        }
    },
    subsubject: function (obj) {
        $('.subjectLong').hide();
        $('#loading').hide();
        $('.subRoom span').text($(obj).text())
        var url = SERVER_ADDR + '/app/common/getSubSubjectList.json'; //'http://www.yinliuta.com/activity/checkWxAccount';
        var Data = {};
        Data.subjectId = $(obj).attr('subId')
        ajaxGetRetInfo(url, Data, this.checkSubsubjectSuccess, '请求失败', 'GET', undefined, undefined);
    },
    checkSubsubjectSuccess:function (retInfo) {
        if(retInfo.success == true){
            console.log(retInfo)
            //$('.ks_list').empty();
            retInfo.data.forEach(function (value) {
                console.log(value)
                var html = '';
                html += ''
                $('.hos_list').append(html);
            })
            totalCount = retInfo.totalCount;
        }else{
            alert('请求数据有错')
        }
    },
}*/
