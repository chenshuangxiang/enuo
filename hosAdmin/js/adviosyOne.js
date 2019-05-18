
var layer;
layui.use(['form','layer','jquery','element'],function(){
    var form = layui.form,
        element = layui.element;
    layer = parent.layer === undefined ? layui.layer : parent.layer,
        $ = layui.jquery;
    //加载页面数据
    Get.adviosyInfo();

})

var Get = {
    adviosyInfo:function () {
        var url = SERVER_ADDR + "/hospital/user/getOneAdvisoryInfo";
        var data = {};
        data.advisoryId = getQueryString('id');
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
               $('.userAdviosyInfoData').html(Get.setAdviosyDate(retInfo.data));
            }else{
                layer.alert(retInfo.data,{icon:5});
            }
        },'请求失败', 'GET', undefined, undefined);
    },
    setAdviosyDate:function (data) {
        console.log(data)
        var dataHtml = '';
        if(data && data.length != 0){
            for(var i=0;i<data.length;i++){
                dataHtml += '<tr>'
                    +'<td>'+ new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss") +'</td>'
                    +'<td>'+data[i].allotHospitalName+'</td>'
                    +'<td>'+data[i].disease+'</td>'
                    +'<td>'+data[i].storeName+'</td>'
                    +'<td title="'+data[i].brief+'">'+noData(returnSubstring(data[i].brief))+'</td>'
                    +'<td>'+data[i].salesmanName+'</td>'
                    +'<td>'+returnAllotStatus(data[i].status)+'</td>';
                if(data[i].count > 0){
                    dataHtml += '<td style="color: #00a2d4;cursor: pointer;" valueid="'+data[i].id+'" onclick="advisoryOneAccess(this)">已回访/'+data[i].count+'次</td>';
                }else if(data[i].count == 0){
                    dataHtml += '<td style="color: red">未回访</td>';
                }else{
                    dataHtml += '<td></td>';
                }
                if(data[i].nextAccessDate){
                    dataHtml += '<td>'+new Date(data[i].nextAccessDate).Format('yyyy-MM-dd')+'</td>';
                }else{
                    dataHtml += '<td></td>';
                }
                dataHtml += '</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="9">暂无数据</td></tr>';
        }
        return dataHtml;
    },
}
