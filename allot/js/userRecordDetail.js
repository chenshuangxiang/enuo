layui.use(['form','layer','jquery','element'],function(){
	var form = layui.form,
     element = layui.element;
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		$ = layui.jquery;

    searchBtn();
	//查询
	function searchBtn(pageNumber) {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/customerService/getOnePatientAccess.json";
        var data = {};

        data.patientId = getQueryString('id');
        //data.mobile = getQueryString('mobile');
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            layer.close(index);
            if(retInfo.success){
                accessNewsList(retInfo.data);
                //advisoryNewsList(retInfo.data);
                //diagnosisNewsList(retInfo.data);
            }else{
                layer.alert(retInfo.data,{icon:5});
			}
        },'请求失败', 'GET', undefined, undefined);
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
                    +'<td>'+ new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss") +'</td>'
                    +'<td>'+data[i].username+'</td>'
                    +'<td>'+data[i].mobile+'</td>'
                    +'<td>'+data[i].disease+'</td>'
                    +'<td>'+data[i].creator+'</td>'

                    +'<td>'+recordStatusHospital(data[i].hospitalStatus)+'</td>'
                    +'<td>'+recordStatusPlatform(data[i].platformStatus)+'</td>'
                    /*+'<td><input type="text" value="'+data[i].brief+'"/></td>'*/
                    +'<td>'+data[i].brief+'</td>'
               /* if(data[i].platformStatus){
                    dataHtml +='<td class="resetRecord" valueid="'+data[i].id+'" valuestatus="'+data[i].platformStatus+'" onclick="resetRecordOPen(this)">修改</td>';
                }else{
                    dataHtml +='<td></td>'
                }*/

                dataHtml += '</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="8">暂无数据</td></tr>';
        }
        return dataHtml;
    }
})

