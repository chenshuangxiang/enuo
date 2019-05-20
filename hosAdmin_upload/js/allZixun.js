layui.use(['form','layer','jquery','laypage','laydate','element'],function(){
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
        laydate = layui.laydate,
		$ = layui.jquery;
    $('.allZixun').addClass('layui-this').parent().parent().addClass('layui-nav-itemed');
    localStorage.removeItem('localInfo');
    laydate.render({
        elem: '#newsTime'
    });
    //getDocLevel(form);
    form.render();

	//加载页面数据
    searchBtn(localStorage.getItem('allZixun') || 1);
    localStorage.removeItem('allZixun');
	//查询
	$(".search_btn").click(function(){
        searchBtn(1);

	})
	function searchBtn(pageNumber) {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/hospital/visit/advisory/getList.json";
        var data = {};
        data.keyword = $(".newsName").val();
        data.pageNumber = pageNumber;
        data.pageSize = 10;
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
		var nums = 10; //每页出现的数据量
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
                if(data[i].sex == 'man'){
                    data[i].sex = '男';
                }else if(data[i].sex == 'woman'){
                    data[i].sex = '女';
                }
                if(data[i].status == 'visit'){
                    data[i].status = '已到诊';
                }else if(data[i].status == 'allot'){
                    data[i].status = '已分诊';
                }else if(data[i].status == 'waitPaid'){
                    data[i].status = '待付款';
                }else if(data[i].status == 'loading'){
                    data[i].status = '体验中';
                }else if(data[i].status == 'completed'){
                    data[i].status = '已完成';
                }
                dataHtml += '<tr>'
                   /* +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                 /*  +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/

                    +'<td>'+data[i].username+'</td>'
                    +'<td>'+data[i].mobile+'</td>'
                    +'<td>'+data[i].sex+'</td>'
                  /*  +'<td>'+data[i].age+'</td>'*/
                  if(data[i].roles.indexOf('advisory') != -1){
                      dataHtml += '<td>'+noData(data[i].operator)+'</td>'
                  }else{
                      dataHtml += '<td>无</td>'
                  }
                if(data[i].roles.indexOf('doctor') != -1){
                    dataHtml += '<td>'+noData(data[i].operator)+'</td>'
                }else{
                    dataHtml += '<td>无</td>'
                }
                   /* +'<td>'+noData(data[i].intentOperator)+'</td>'*/

                dataHtml += '<td>'+noData(data[i].source)+'</td>'
                    +'<td>'+noData(data[i].intentProjectName)+'</td>'
					+'<td>'+data[i].status+'</td>';

               /* if(data[i].status == "unallot"){
                    dataHtml += '<a class="layui-btn layui-btn-mini consultFen" style="display: none" valueid="'+data[i].id+'"><i class="iconfont icon-edit"></i> 分诊</a>' +
                        '<a class="layui-btn layui-btn-normal layui-btn-mini news_reset" style="display: none" valueid="'+data[i].id+'"><i class="layui-icon">&#xe600;</i> 编辑</a>';
                }*/
                if(data[i].status == '已分诊'){
                    dataHtml += '<td><a class="layui-btn layui-btn-normal layui-btn-mini" onclick="zixunDetail(this)" valueid="'+data[i].id+'" yuyueid="'+data[i].reservationId+'">咨询详情</a>' + '</td>'
                }else{
                    dataHtml += '<td></td>'
                }
                dataHtml += '</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="12">暂无数据</td></tr>';
        }
        return dataHtml;
    }
})
//修改医生信息
function zixunDetail(obj) {
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var id = $(obj).attr('valueid');
    var yuyueid = $(obj).attr('yuyueid');
    $('.layui-nav-child dd').removeClass('layui-this');
    $('.zixunNow').addClass('layui-this');
    if(yuyueid == 'undefined'){
        window.location.href = '#allZixunNow.html?id=' + id
    }else{
        window.location.href = '#allZixunNow.html?id=' + id + '&yuyueid=' + yuyueid;
    }
}