layui.use(['form','layer','jquery','element'],function(){
	var form = layui.form,
     element = layui.element;
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		$ = layui.jquery;

    searchTab(undefined);
  	//查询

})
function searchTab(type) {
    var type = type;
    var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
    var url = SERVER_ADDR + "/hospital/user/getAdvisoryInfo";
    var data = {};
    data.advisoryId = getQueryString('id');
    data.type = type;
    ajaxGetRetInfo(url,data,function (retInfo) {
        console.log(retInfo)
        layer.close(index);
        if(retInfo.success){
            if(type == 'hospital'){
                accessNewsHospitalList(retInfo.data);
                $('.hospitalAccess').attr('onclick','')
            }else if(type == 'platform'){
                accessNewsPlatfromList(retInfo.data);
                $('.platformAccess').attr('onclick','')
            }else{
                accessNewsList(retInfo.data);
            }
        }else{
            layer.alert(retInfo.data,{icon:5});
        }
    },'请求失败', 'GET', undefined, undefined);
}
function accessNewsPlatfromList(retInfo){
    $(".news_content_platfrom").html(renderPlatfromDate(retInfo,'platfrom'));
}
function accessNewsHospitalList(retInfo){
    $(".news_content_hospital").html(renderPlatfromDate(retInfo,'hospital'));
}
function accessNewsList(retInfo){
    $(".news_content").html(renderDate(retInfo));
}
function renderDate(data){
    console.log(data)
    var dataHtml = '';
    if(data && data.length != 0){
        for(var i=0;i<data.length;i++){
            dataHtml += '<tr>'
                +'<td>'+ new Date(data[i].accessDate).Format("yyyy-MM-dd hh:mm:ss") +'</td>'
                +'<td>'+data[i].salesmanName+'</td>'
                +'<td>'+recordStatusHospital(data[i].hospitalStatus)+'</td>'
                +'<td>'+recordStatusPlatform(data[i].platformStatus)+'</td>'
                +'<td>'+data[i].brief+'</td>'
            dataHtml += '</tr>';
        }
    }else{
        dataHtml = '<tr><td colspan="8">暂无数据</td></tr>';
    }
    return dataHtml;
}
function renderPlatfromDate(data,type){
    console.log(data)
    var dataHtml = '';
    if(data && data.length != 0){
        for(var i=0;i<data.length;i++){
            dataHtml += '<tr>'
                +'<td>'+ new Date(data[i].accessDate).Format("yyyy-MM-dd hh:mm:ss") +'</td>'
                +'<td>'+data[i].salesmanName+'</td>';
            if(type == 'platfrom'){
                dataHtml += '<td>'+recordStatusPlatform(data[i].platformStatus)+'</td>'
            }else if(type == 'hospital'){
                dataHtml += '<td>'+recordStatusHospital(data[i].hospitalStatus)+'</td>'
            }
            dataHtml +='<td>'+data[i].brief+'</td>'
            dataHtml += '</tr>';
        }
    }else{
        dataHtml = '<tr><td colspan="8">暂无数据</td></tr>';
    }
    return dataHtml;
}

