layui.use(['form','layer','jquery','laypage','laydate','element'],function(){
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
        laydate = layui.laydate,
		$ = layui.jquery;
    form.render();
    toAllFirstTopTab('.orderLi','.toOrderBtn');
	//加载页面数据
	var newsData = '';
    searchBtn(localStorage.getItem('allOrder') || 1);
    localStorage.removeItem('allOrder');
        //orderCount();
    $(".searchBtnTop").click(function(){
        searchBtn(1,$(this).attr('valuestatus'));
    })
	//查询
	$(".search_btn").click(function(){
        searchBtn(1);
	})
	function searchBtn(pageNumber,status) {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/hospital/order/getOrderList.json";
        var data = {};
        data.keyword = $(".newsName").val();
        data.name = $(".projName").val();
        data.type = $(".type").val();
        data.orderStatus = $(".status").val()  || status;
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
	//添加咨询
	$(".addProject").click(function(){
        //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});

		var index = layui.layer.open({
			title : "添加项目",
			type : 2,
            area:['83%','83%'],
			content : "addProject.html",
			success : function(layero, index){
			    localStorage.setItem('allOrder',$('.layui-laypage-curr em').eq(1).text());
				setTimeout(function () {
                    layui.layer.tips('点击此处返回项目列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                },500)

			}
		})
		//改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
		/*$(window).resize(function(){
			layui.layer.full(index);

		})
		layui.layer.full(index);*/
        //layer.close(indexOpen);

	});
	//分诊
    $("body").on("click",".consultFen",function(){  //收藏.
        console.log(666666)
		$('.sureFen').attr('valueid',$(this).attr('valueid'));
        var index = layui.layer.open({
            area: ['345px','420px'],
            title : "分诊",
            type : 1,
            content : $('.fenOpen'),
            success:function(){
                $('.layui-layer-shade').remove();
			}
        })
    });
    //操作
    $("body").on("click",".caozuoBtn",function(){
        if($(this).attr('disabled') == 'disabled'){
            return
        }
        $('.news_record_add,.consultFen,.news_reset').attr('valueid',$(this).attr('valueid'));
        var valuestatus = $(this).attr('valuestatus');
        if(valuestatus == 'unallot'){
            $('.consultFen,.news_reset').show();
        }else{
            $('.consultFen,.news_reset').hide();
        }
        var index = layui.layer.open({
            area: ['270px','300px'],
            closeBtn: 1,
            shadeClose: false,
            title : "操作",
            type : 1,
            content : $('.caozuoOpen'),
            success:function(){
               $('.layui-layer-shade').remove();
            }
        })
    });
    $('.sureFen').click(function () {
        var elThisid = $('.sureFen').attr('valueid');
        if($('.newsHosFen').val() == ''){
            layer.alert('请选择分诊医院',{icon:7});

        }
        var url = SERVER_ADDR + "/admin/allot/submit";
        var data = {};
        data.advisoryId = $('.sureFen').attr('valueid');
        //data.date = $('.newsTimeFen').val();
        data.hospitalId = $('.newsHosFen').val();
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
               /* var elthis = $(".consultFen[valueid="+elThisid+"]");
                elthis.parent().prev().text('已分诊').attr('style','color:black');
                elthis.remove();
                layui.layer.closeAll();*/
                localStorage.setItem('allOrder',$('.layui-laypage-curr em').eq(1).text());
                layer.msg(retInfo.data);
                location.reload();
            }else{
                layer.alert(retInfo.data,{icon:5})
            }
        },'请求失败', 'POST', undefined, undefined);

        return false
    });
    //添加回访
    $("body").on("click",".news_record_add",function(){
        //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
        var index = layui.layer.open({
            title : "患者回访信息添加",
            type : 2,
            area:['80%','80%'],
            content : "../allRecord/recordAdd.html?id=" + $(this).attr('valueid'),
            success : function(layero, index){
                localStorage.setItem('allOrder',$('.layui-laypage-curr em').eq(1).text());
                setTimeout(function () {
                    layui.layer.tips('点击此处返回咨询列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                },500)

            }
        })
        //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
        /*$(window).resize(function(){
            layui.layer.full(index);

        })
        layui.layer.full(index);*/
        //layer.close(indexOpen);

    });
	//编辑咨询
    $("body").on("click",".news_reset",function(){  //收藏.
		var valueid = $(this).attr('valueid');
        var index = layui.layer.open({
            title : "编辑咨询",
            type : 2,
            area:['80%','80%'],
            content : "consultAdd.html?action=reset&valueid=" + valueid,
            success : function(layero, index){
                setTimeout(function () {
                    layui.layer.tips('点击此处返回咨询列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                },500)

            }
        })
        //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
        /*$(window).resize(function(){
            layui.layer.full(index);
        })
        layui.layer.full(index);*/
    });

	function newsList(retInfo,totalCount,current){
		//渲染数据
        $(".news_content").html(renderDate(retInfo));
        $('.hoverUnderline').click(function () {
            var id = $(this).attr('valueid');
            var index = layui.layer.open({
                title : "订单详情",
                type : 2,
                area:['85%','90%'],
                content : "orderDetail.html?valueid=" + id,
                success : function(layero, index){

                }
            })
        })
		//分页
		var nums = 15; //每页出现的数据量
        laypage.render({
            elem : "page",
            skip:true,
            count:totalCount,
            layout: ['count', 'prev', 'page', 'next', 'skip'],
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
/*<td>
    <div class="flex_all_center">
        <!--<img src="../img/select.png"/>&nbsp;-->
    <span>{{value.sn}}</span>
    </div>
    </td>
    <td>{{value.fullname}}</td>
    <td>{{value.mobile}}</td>
    <td>
    {{if value.type== "project"}}预约项目{{else if value.type == "product"}}特价项目{{/if}}
    </td>
    <td>{{value.name}}</td>
    <td>{{value.amount}}</td>
    <td>{{value.createDate}}</td>
    <td class="font_green">
        {{if value.orderStatus== "waitPaid"}}待支付
        {{else if value.orderStatus == "waitConfirm"}}
        {{if value.isReservation== true}}已预约
        {{else if value.isReservation == false}}未预约
        {{else}}待确认
        {{/if}}
            {{else if value.orderStatus == "completed"}}待结算
            {{else if value.orderStatus == "cancelled"}}已取消
            {{else if value.orderStatus == "handle"}}已完成{{/if}}
            </td>
            <td data_id = "{{value.id}}">
                <button class="font_green" onclick="toOrderDatail(this)">详情</button>
                </td>*/
    function renderDate(data){
        var dataHtml = '';
        if(data.length != 0){
            for(var i=0;i<data.length;i++){
                dataHtml += '<tr>'
                   /* +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                 /*  +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                +'<td>'+data[i].sn+'</td>'
                if (data[i].hospitalUserId) {
                    dataHtml +='<td  style="color: #2299ee;cursor: pointer" onclick="toUserInfo(this)" valueindex="1" valueid="'+data[i].hospitalUserId+'"  valuemobile="'+data[i].mobile+'">'+data[i].fullname+'</td>'
                }else{
                    dataHtml +='<td>'+data[i].fullname+'</td>'
                }

                dataHtml +='<td>'+data[i].mobile+'</td>';
               /* if(data[i].type == 'project'){
                    dataHtml += '<td>预约项目</td>';
                }else if(data[i].type == 'product'){
                    dataHtml += '<td>特价项目</td>';
                }else if(data[i].type == 'censor'){
                    dataHtml += '<td></td>';
                }*/
                if (data[i].orderType == 'offline') {
                    dataHtml += '<td  style="color: #2299ee;cursor: pointer" onclick="allOrderDetail(this)" valueuserOfflineProject="'+data[i].userOfflineProjectId+'" fkid="'+data[i].fkId+'">' + data[i].name + '</td>';
                } else {
                    dataHtml += '<td>' + data[i].name + '</td>';
                }

                    if(data[i].orderType == 'offline' && data[i].orderStatus == 'waitPaid'){
                        dataHtml += '<td>'+data[i].paidAmount + '/' + data[i].amount+'<br><a class="layui-btn layui-btn-normal layui-btn-mini" onclick="reset_price(this)" valueid="'+data[i].orderId+'" fkid="'+data[i].fkId+'">更改价格</a></td>' ;
                    }else if(data[i].orderType == 'PRIZE' || data[i].orderType == 'product' || data[i].orderType == 'CITIC_BANK_ACTIVATION_CODE'){
                        dataHtml += '<td>'+ '0.00' + '/' +  '0.00' +'</td>' ;
                    }else {
                        dataHtml += '<td>'+data[i].paidAmount + '/' + data[i].amount+'</td>' ;
                    }

                dataHtml += '<td>'+new Date(data[i].createDate).Format('yyyy-MM-dd hh:mm:ss')+'</td>';
                if(data[i].orderStatus == 'waitPaid'){
                    dataHtml += '<td class="hoverUnderline" valueid="'+data[i].orderId+'" style="color: red">待支付</td>';
                }else if(data[i].orderStatus == 'waitConfirm'){
                    if(data[i].isReservation == true){
                        dataHtml += '<td class="hoverUnderline" valueid="'+data[i].orderId+'" style="color: #1e9fff">已支付<span style="color: #009688">(已预约)</span></td>';
                    }else if(data[i].isReservation == false){
                        dataHtml += '<td class="hoverUnderline" valueid="'+data[i].orderId+'" style="color: #1e9fff">已支付<span style="color: red">(未预约)</span></td>';
                    }else{
                        dataHtml += '<td class="hoverUnderline" valueid="'+data[i].orderId+'">已支付</td>';
                    }
                }else if(data[i].orderStatus == 'completed'){
                    dataHtml += '<td class="hoverUnderline" valueid="'+data[i].orderId+'" style="color: #ff6600">待结算</td>';
                }else if(data[i].orderStatus == 'cancelled'){
                    dataHtml += '<td class="hoverUnderline" valueid="'+data[i].orderId+'" style="color: #666666">已取消</td>';
                }else if(data[i].orderStatus == 'handle'){
                    dataHtml += '<td class="hoverUnderline" valueid="'+data[i].orderId+'" style="color: #009688">已完成</td>';
                }
               /* if(data[i].status == "unallot"){
                    dataHtml += '<a class="layui-btn layui-btn-mini consultFen" style="display: none" valueid="'+data[i].id+'"><i class="iconfont icon-edit"></i> 分诊</a>' +
                        '<a class="layui-btn layui-btn-normal layui-btn-mini news_reset" style="display: none" valueid="'+data[i].id+'"><i class="layui-icon">&#xe600;</i> 编辑</a>';
                }*/
                dataHtml += '</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="9">暂无数据</td></tr>';
        }
        return dataHtml;
    }
    function orderCount() {
        var url = SERVER_ADDR + "/hospital/order/getOrderCountByStatus.json";
        var data = '';
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                $('.allOrderCount').text(retInfo.data.allCount);
                $('.waitpaidOrderCount').text(retInfo.data.waitPaid);
                $('.waitConfirmOrderCount').text(retInfo.data.waitConfirm);
                $('.completedOrderCount').text(retInfo.data.completed);
                $('.handleOrderCount').text(retInfo.data.handle);
            }else{
                layer.alert(retInfo.data,{icon:5})
            }
        },'请求失败', 'GET', undefined, undefined);
    }
})
//修改医生信息
function news_reset_dohis(obj) {

    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var id = $(obj).attr('valueid');
    console.log(id)
    var index = layui.layer.open({
        title : "修改项目信息",
        type : 2,
        area:['80%','80%'],
        content : "addProject.html?valueid=" + id + '&action=reset',
        success : function(layero, index){
            setTimeout(function () {
                layui.layer.tips('点击此处返回医生列表', '.layui-layer-setwin .layui-layer-close', {
                    tips: 3
                });
            },500)

        }
    })
    //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
}
function reset_price(obj) {
    var id = $(obj).attr('valueid');
    var fkid = $(obj).attr('fkid');
    var index = layui.layer.open({
        title : "更改价格",
        type : 2,
        area:['992px','60%'],
        content : "resetPrice.html?valueid=" + id + '&fkid='+ fkid +'&v=1134',
        success : function(layero, index){
            localStorage.setItem('allOrder',$('.layui-laypage-curr em').eq(1).text());
        }
    })
}
function read_price(obj) {
    var id = $(obj).attr('valueid');
    var fkid = $(obj).attr('fkid');
    var index = layui.layer.open({
        title : "订单清单",
        type : 2,
        area:['992px','60%'],
        content : "resetPrice.html?valueid=" + id + '&fkid='+ fkid +'&type=read&v=1134',
        success : function(layero, index){
            localStorage.setItem('allOrder',$('.layui-laypage-curr em').eq(1).text());
        }
    })
}
function allOrderDetail(obj) {
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var valueuserOfflineProject = $(obj).attr('valueuserOfflineProject');
    var index = layui.layer.open({
        title : "项目清单",
        type : 2,
        area: ['90%','550px'],
        content : 'sureOrderPrint.html?id=' + valueuserOfflineProject,
        success : function(layero, index){

        },
        cancel: function(index, layero){
            layui.layer.close(index)
            return false;
        }
    })
}

