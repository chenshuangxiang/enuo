layui.use(['form','layer','jquery','laypage','laydate'],function(){
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
        laydate = layui.laydate,
		$ = layui.jquery;

	//加载页面数据
	var newsData = '';
    searchBtn(1);
	//查询
	$(".search_btn").click(function(){
        searchBtn(1);
	})
	function searchBtn(pageNumber) {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/admin/advisory/getLogs.json";
        var data = {};
        data.pageNumber = pageNumber;
        data.pageSize = 15;
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            layer.close(index);
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
		//分页
		var nums = 15; //每页出现的数据量
		laypage.render({
            elem : "page",
            skip:true,
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
                dataHtml += '<tr>'
                    +'<td>'+data[i].createDate+'</td>'
                    +'<td>'+data[i].content+'</td>'
                    + '</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="8">暂无数据</td></tr>';
        }
        return dataHtml;
    }
})
