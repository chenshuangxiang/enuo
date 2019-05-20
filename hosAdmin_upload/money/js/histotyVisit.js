layui.use(['form','layer','jquery','element'],function() {
    var form = layui.form,
        element = layui.element;
    layer = parent.layer === undefined ? layui.layer : parent.layer,
        $ = layui.jquery;
    /*element.on('collapse(fadeIn)', function(data){
        layer.msg('展开状态:'+ data.show);
    });*/
    //加载页面数据
    Get.firstConcult();

});
var Get = {
    firstConcult: function () {
            var url = SERVER_ADDR + '/hospital/doctor/index/getUserInfo.json';
            var Data = {};
            Data.mobile = getQueryString('mobile');
            ajaxGetRetInfo(url, Data, this.firstConcultSuccess, '请求失败', 'GET', true, undefined);
    },
    firstConcultSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            //返回填充
            $('.span').text(retInfo.data.user.fullname);
            if(retInfo.data.user.sex == 'man'){
                retInfo.data.user.sex = '男';
            }else if(retInfo.data.user.sex == 'woman'){
                retInfo.data.user.sex = '女';
            }else if(retInfo.data.user.sex == 'unknown'){
                retInfo.data.user.sex = '不详';
            }
            if(!retInfo.data.user.birthday){
                var birthday = '无'
            }else{
                var birthday = new Date(retInfo.data.user.birthday).Format("yyyy-MM-dd")
            }
            $('.layui-colla-content p').html('<strong>姓名:</strong>'+retInfo.data.user.fullname + '' + ' &nbsp;&nbsp;&nbsp;&nbsp;<strong>手机号:</strong>' + getQueryString('mobile') + ' &nbsp;&nbsp;&nbsp;&nbsp;<strong>出生日期:</strong>' +  birthday + ' &nbsp;&nbsp;&nbsp;&nbsp;<strong>性别:</strong>' + retInfo.data.user.sex + '  &nbsp;&nbsp;&nbsp;&nbsp;<strong>身份证号:</strong>' + noData(retInfo.data.user.idCard) + '<br>');
            if(retInfo.data.user.members){
                retInfo.data.user.members.forEach(function (value) {
                    console.log(value)
                    $('.layui-colla-content p').append('<strong>'+value.appellation+'</strong>' + '：' +  value.fullName + '--'  +  value.mobile + ' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');

                })
            }
            if(retInfo.data.visitRecords){
                histotyVisitList(retInfo.data.visitRecords);
            }
        } else {
            alert(retInfo.data);
        }
    }
}
function histotyVisitList(retInfo){
    $(".news_content").html(renderHistotyVisitDate(retInfo));
}
function renderHistotyVisitDate(data){
    console.log(data)
    var dataHtml = '';

    if(data && data.length != 0){
        for(var i=0;i<data.length;i++){
            switch (data[i].platformStatus){
                case 'unConnect':
                    data[i].platformStatus = '未接通';
                    break;
                case 'refuse':
                    data[i].platformStatus = '拒接';
                    break;
            }
            dataHtml += '<tr>'
                +'<td>'+ new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss") +'</td>'
            if(data[i].type == "coupon"){
                dataHtml += '<td>体验券</td>'
            }else if(data[i].type == "product"){
                dataHtml += '<td>特价项目</td>'
            }else if(data[i].type == "doctor"){
                dataHtml += '<td>医生</td>'
            }else{
                dataHtml += '<td>线下</td>'
            }
            dataHtml+='<td>'+noData(data[i].name)+'</td>'
                +'<td>'+noData(data[i].hospital)+'</td>'
                +'<td>'+noData(data[i].source)+'</td>'
                +'<td>'+noData(data[i].creator)+'</td>'
                +'<td>'+noData(data[i].brief)+'</td>'
            dataHtml += '</tr>';
        }
    }else{
        dataHtml = '<tr><td colspan="8">暂无数据</td></tr>';
    }
    return dataHtml;
}
