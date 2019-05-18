layui.use(['form','layer','jquery','laypage','laydate','element'],function(){
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
        laydate = layui.laydate,
		$ = layui.jquery;
    $('.allFinance').addClass('layui-this');
    laydate.render({
        elem: '#newsTime'
    });
    getDocLevel(form);
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
        var url = SERVER_ADDR + "/hospital/visit/visitRecord/getFinanceList.json";
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
                dataHtml += '<tr onclick="clicktr(this)" totalAmount="'+data[i].totalAmount+'" totalPaidAmount="'+data[i].totalPaidAmount+'">'
                   /* +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                 /*  +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/

                    +'<td>'+noData(data[i].username)+'</td>'
                    +'<td>'+noData(data[i].mobile)+'</td>'
                    +'<td>'+noData(data[i].projectName)+'</td>'
                   /* +'<td>'+noData(data[i].category)+'</td>'*/
                    +'<td>'+noData(data[i].modelNo)+'</td>'
                    /*+'<td>'+noData(data[i].spec)+'</td>'
                    +'<td>'+noData(data[i].unit)+'</td>'*/
                    +'<td>'+noData(data[i].originalPrice)+'</td>'
                    +'<td>'+noData(data[i].price)+'</td>'
                    +'<td>'+noData(data[i].paidAmount)+'</td>'
                    +'<td>'+noData(data[i].quantity)+'</td>'
                    +'<td>'+noData(data[i].day)+'</td>'
                    +'<td>'+noData(data[i].result)+'</td>'
                    +'<td>'+noData(data[i].doctor)+'</td>'
                    +'<td>'+noData(data[i].receiver)+'</td>';

               /* if(data[i].status == "unallot"){
                    dataHtml += '<a class="layui-btn layui-btn-mini consultFen" style="display: none" valueid="'+data[i].id+'"><i class="iconfont icon-edit"></i> 分诊</a>' +
                        '<a class="layui-btn layui-btn-normal layui-btn-mini news_reset" style="display: none" valueid="'+data[i].id+'"><i class="layui-icon">&#xe600;</i> 编辑</a>';
                }*/
                if(data[i].status == '待付款'){
                    dataHtml += '<td><a class="layui-btn layui-btn-normal layui-btn-mini" onclick="sureOrderOpen(this)" valueid="'+data[i].id+'"  valuemobile="'+data[i].mobile+'">确认订单</a></td>'
                }else if(data[i].status == '体验中'){
                    dataHtml += '<td><a class="layui-btn layui-btn-normal layui-btn-mini" onclick="surePrintOrderOpen(this)" valueid="'+data[i].id+'"  valuemobile="'+data[i].mobile+'">打单</a></td>'
                }else if(data[i].status == '已完成'){
                    dataHtml += '<td><a class="layui-btn layui-btn-normal layui-btn-mini" onclick="surePrintOrderOpen(this)" valueid="'+data[i].id+'"  valuemobile="'+data[i].mobile+'">打单</a></td>'
                }

                dataHtml +='</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="12">暂无数据</td></tr>';
        }
        return dataHtml;
    }
})
//确认订单
    function sureOrderOpen(obj) {
        //历史回访
        //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
        //var username = $(this).attr('valueusername');
        var mobile = $(obj).attr('valuemobile');
        var id = $(obj).attr('valueid');
        var index = layui.layer.open({
            title : "确认订单",
            type : 2,
            area:['88%','83%'],
            content : "financeSureOrder.html?id=" + id + '&mobile=' + mobile,
            success : function(layero, index){


            }
        })
}
//确认打单
function surePrintOrderOpen(obj) {
    //历史回访
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    //var username = $(this).attr('valueusername');
    /*var mobile = $(obj).attr('valuemobile');
    var id = $(obj).attr('valueid');
    var index = layui.layer.open({
        title : "确认订单",
        type : 2,
        area:['88%','83%'],
        content : "financeSureOrder.html?id=" + id + '&mobile=' + mobile,
        success : function(layero, index){


        }
    })*/
    layer.msg('打单表格');
}
function clicktr(obj) {
    $('.moneyBottom').show();
    $('.yingfu').text(Number($(obj).attr('totalAmount')).toFixed(2));
    $('.yifu').text(Number($(obj).attr('totalPaidAmount')).toFixed(2));
    $('.yingshou').text((Number($(obj).attr('totalAmount')) - Number($(obj).attr('totalPaidAmount'))).toFixed(2));
}