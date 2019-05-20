layui.config({
	base : "js/"
}).use(['form','layer','jquery'],function(){
	var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		$ = layui.jquery;
	//加载页面数据
    searchBtn();
	//查询
	function searchBtn(pageNumber) {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/admin/allot/access/getHistorys.json";
        var data = {};

        data.mobile = getQueryString('mobile');
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            layer.close(index);
            if(retInfo.success){
                newsList(retInfo.data);
            }else{
                layer.alert(retInfo.data,{icon:5});
			}
        },'请求失败', 'GET', undefined, undefined);
    }
	function newsList(retInfo){
		//渲染数据
        $(".news_content").html(renderDate(retInfo));
	}
    function renderDate(data){
        var dataHtml = '';
        if(data.length != 0){
            for(var i=0;i<data.length;i++){
                dataHtml += '<tr>'
                   /* +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                 /*  +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                    +'<td>'+ Number(i + 1) +'</td>'
                    +'<td>'+ new Date(data[i].accessDate).Format("yyyy-MM-dd hh:mm:ss") +'</td>'
                   /* +'<td>'+data[i].username+'</td>'*/
                  /*  +'<td>'+data[i].mobile+'</td>'*/
                  /*  +'<td>'+data[i].storeName+'</td>'*/
					+'<td>'+data[i].salesmanName+'</td>'
					+'<td>'+data[i].disease+'</td>'
                    +'<td>'+data[i].brief+'</td>';
                /*if(data[i].status == "unallot"){
                    dataHtml += '<td style="color:#f00">未分诊</td>';
                }else if(data[i].status == "loading"){
                    dataHtml += '<td style="color:#F7B824">申请中</td>';
                }else{
                    dataHtml += '<td>已分诊</td>';
                }*/
                dataHtml += '</tr>';
              /*  if(data[i].status == "unallot"){
                    dataHtml += '<a class="layui-btn layui-btn-mini consultFen" valueid="'+data[i].id+'"><i class="iconfont icon-edit"></i> 分诊</a>';
                }*/
               /* dataHtml +=  '<a class="layui-btn layui-btn-normal layui-btn-mini news_reset" valueid="'+data[i].id+'"><i class="layui-icon">&#xe600;</i> 编辑</a>'*/
                    /*			+  '<a class="layui-btn layui-btn-danger layui-btn-mini news_del" data-id="'+data[i].newsId+'"><i class="layui-icon">&#xe640;</i> 删除</a>'*/

            }
        }else{
            dataHtml = '<tr><td colspan="8">暂无数据</td></tr>';
        }
        return dataHtml;
    }
})
