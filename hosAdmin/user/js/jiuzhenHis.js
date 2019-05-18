layui.use(['form','layer','jquery','element'],function(){
	var form = layui.form,
     element = layui.element;
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		$ = layui.jquery;
    /*element.on('collapse(fadeIn)', function(data){
        layer.msg('展开状态:'+ data.show);
    });*/
	//加载页面数据
    //Get.firstConcult();
    searchBtn();
	//查询
	function searchBtn(pageNumber) {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/hospital/reception/visitRecord/getListByUser.json";
        var data = {};

        data.userId = getQueryString('id');
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
                    +'<td>'+new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss")+'</td>'
                if(data[i].type == "coupon"){
                    dataHtml += '<td>体验券</td>'
                }else if(data[i].type == "product"){
                    dataHtml += '<td>特价项目</td>'
                }else if(data[i].type == "doctor"){
                    dataHtml += '<td>医生</td>'
                }else{
                    dataHtml += '<td>线下开单</td>'
                }
                dataHtml += '<td>'+noData(data[i].name)+'</td>'
                    +'<td>'+noData(data[i].source)+'</td>'
                    +'<td>'+noData(data[i].creator)+'</td>'
                    +'<td>'+noData(data[i].brief)+'</td>'
                dataHtml += '</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="6">暂无数据</td></tr>';
        }
        return dataHtml;
    }
})
