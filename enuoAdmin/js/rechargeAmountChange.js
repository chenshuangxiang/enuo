var form
layui.use(['form','layer','jquery','laypage'],function(){
	 form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		$ = layui.jquery;
    form.render();
    searchBtn(1);
})
function searchBtn(pageNumber) {
    //var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
    var url = getUrl() + "/admin/user/getRechargeAmountChange.json";
    var data = {};
    data.userId = getQueryString('id');
    data.pageNumber = pageNumber;
    data.pageSize = 10;
    ajaxGetRetInfo(url,data,function (retInfo) {
        console.log(retInfo)
        //layer.close(index);
        if(retInfo.success){
            newsList(retInfo.data,retInfo.totalCount,pageNumber);
        }else{
            layer.alert(retInfo.data,{icon:5});
        }
    },'请求失败', 'GET', undefined, undefined);
}
function newsList(retInfo,totalCount,current){
    //渲染数据
    $(".news_content").html(renderDate(retInfo));
    //form.render('checkbox','choose')
    //分页
    var nums = 10; //每页出现的数据量
    laypage.render({
        elem : "page",
        skip:true,
        layout: ['count', 'prev', 'page', 'next', 'skip'],
        count:totalCount,
        limit :nums,
        curr: current || 1,
        jump : function(obj,firstLoaded){
            console.log(firstLoaded)
            console.log(obj)
            if (!firstLoaded) {
                searchBtn(obj.curr);
            }
        }
    })
}
function renderDate(data){
    var dataHtml = '';
    if(data.length != 0){
        for(var i=0;i<data.length;i++){
            if(data[i].method == 'INCOME'){
                data[i].method = '收入';
            }else if(data[i].method == 'EXPENDITURE'){
                data[i].method = '支出';
            }
            dataHtml += '<tr>'
                +'<td>'+data[i].createDate+'</td>'
                +'<td>'+data[i].method+'</td>'
                +'<td>'+data[i].reasonsForChange+'</td>';
                if(data[i].method == '收入'){
                    dataHtml +='<td>+'+data[i].priceForChange+'</td>'
                }else{
                    dataHtml +='<td>-'+data[i].priceForChange+'</td>'
                }
            dataHtml +='<td>'+data[i].totalPriceChange+'</td>'
                +'</tr>';
        }
    }else{
        dataHtml = '<tr><td colspan="5">暂无数据</td></tr>';
    }
    return dataHtml;
}