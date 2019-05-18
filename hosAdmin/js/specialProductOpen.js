var tabledata;
var form
layui.use(['form','layer','jquery','table'],function(){
	 form = layui.form,
        table = layui.table,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		$ = layui.jquery;

    form.render();
	//加载页面数据
	var newsData = '';
	if(getQueryString('type') == 'product' || getQueryString('type') == 'PRIZE'){
        searchBtn(1);
    }else{
	    $('.time').remove();
        setHtml();
    }

	function searchBtn(pageNumber) {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/hospital/order/findOrderByVisitRecord";
        var data = {};
        data.visitRecordId = getQueryString('id');
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            layer.close(index);
            if(retInfo.success){
                var html = '';
                html += '<tr>' +
                    '<td>' + retInfo.data.createDate + '</td>' +
                    '<td>' + getQueryString('name') + '</td>' ;
                if(retInfo.data.isDrainage == true){
                    html +='<td>是</td>'
                    html += '<td>0.00</td>'
                    html +='<td>0.00</td>'
                }else{
                    html += '<td>否</td>'
                    if(retInfo.data.type == 'product'){
                        html +='<td>'+ retInfo.data.amount + '</td>'
                        html +='<td>'+ retInfo.data.paidAmount + '</td>'
                    }else if(retInfo.data.type == 'PRIZE'){
                        html += '<td>0.00</td>'
                        html +='<td>0.00</td>'
                    }else{
                        html += '<td>'+ retInfo.data.amount + '</td>'
                        html +='<td>'+ retInfo.data.paidAmount + '</td>'
                    }
                }
                html +='<td>平台支付</td>'
                $('.news_content').html(html);
            }else{
                layer.alert(retInfo.data,{icon:5});
			}
        },'请求失败', 'POST', undefined, undefined);
    }
    function setHtml() {
        var html = '';
        html += '<tr>' +
            '<td>' + getQueryString('name') + '</td>' ;
            html +='<td>是</td>'
            html += '<td>0.00</td>'
            html +='<td>0.00</td>'
        html +='<td>线下支付</td>'
        $('.news_content').html(html);
    }
})