var pageNum = 1;
var totalCount = 0;
$(document).ready(function () {
    $('#wrapper').height($(document).height() - $('.content').height() - 27)
})
function init() {

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
                    '<span>擅长：</span>' ;
                if(value.diseases && value.diseases.length > 0){
                    value.diseases.forEach(function (value, index) {
                        html +=  '<span>'+value+' '+'</span>'
                    })
                }
                html += '</p>' +
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
