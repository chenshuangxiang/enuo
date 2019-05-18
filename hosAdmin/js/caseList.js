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
            var url = SERVER_ADDR + '/hospital/effectCase/getEffectCase.json';
            var Data = {};
            Data.id = getQueryString('id');
            Data.type = getQueryString('type');
            ajaxGetRetInfo(url, Data, this.firstConcultSuccess, '请求失败', 'GET', true, undefined);
    },
    firstConcultSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            //返回填充
            histotyVisitList(retInfo.data);
        } else {
            alert(retInfo.data);
        }
    },
    delCase: function (obj) {
        var index = layer.confirm('确定删除此案例？',{icon:3}, function(index){
            var url = SERVER_ADDR + '/hospital/effectCase/updateDeleteStatus';
            var Data = {};
            Data.effectCaseId = $(obj).attr('valueid');
            ajaxGetRetInfo(url, Data, function (retInfo) {
                console.log(retInfo)
                layer.close(index);
                if (retInfo.success == true) {
                    window.location.reload();
                } else {
                    alert(retInfo.data);
                }
            }, '请求失败', 'POST', true, undefined);
        })
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

            dataHtml += '<tr>'
                +'<td>'+data[i].createDate+'</td>'
                +'<td>'+data[i].content+'</td>'
            dataHtml +='<td>'
            data[i].images.forEach(function (value) {
                dataHtml += '<img style="margin-right: 10px;" src="'+SERVER_ADDR + value+'">'
            });
            dataHtml +='</td>'
            dataHtml+='<td><a class="layui-btn layui-btn-normal layui-btn-mini" onclick="reset_case(this)" valuetype="'+getQueryString('type')+'" valueid="'+data[i].id +'"><i class="iconfont icon-edit"></i>修改</a>' +
                '<a style="margin-left: 3px;float: right" class="layui-btn layui-btn-danger layui-btn-mini" valueid="'+data[i].id +'" onclick="Get.delCase(this)">删除</a></td>';
            dataHtml += '</tr>';
        }
    }else{
        dataHtml = '<tr><td colspan="4">暂无添加的案例</td></tr>';
    }
    return dataHtml;
}
function reset_case(obj) {
    var id = $(obj).attr('valueid');
    var type = $(obj).attr('valuetype');
    var index = layui.layer.open({
        title : "修改案例",
        type : 2,
        area:['80%','80%'],
        content : "addCase.html?id=" + id + '&type='+type + '&action=reset',
        success : function(layero, index){

        }
    })
}
//添加案例
function addCase(obj) {
    var index = layui.layer.open({
        title : "添加案例",
        type : 2,
        area:['80%','80%'],
        content : "addCase.html?id=" + getQueryString('id') + '&type=' + getQueryString('type'),
        success : function(layero, index){

        }
    })
}

