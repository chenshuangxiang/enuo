layui.use(['form','layer','jquery','laypage','laydate','element'],function(){
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
        laydate = layui.laydate,
		$ = layui.jquery;

    /*laydate.render({
        elem: '#newsTime'
    });*/
    //getDocLevel(form);
    //getHos(form); //获取医院
    //getSaleman(form); //获取业务员
    //getFrom(form); //获取点位来源
    //getNoResultHos(form);
    form.render();
   /* form.on('select(newsHos)', function(data){  //根据医院获取病种
        getFk(form,data.elem[data.elem.selectedIndex].title);
    });*/
	//加载页面数据
	var newsData = '';
	/*$.get("../../json/newsList.json", function(data){
		var newArray = [];
		//单击首页“待审核文章”加载的信息
		if($(".top_tab li.layui-this cite",parent.document).text() == "待审核文章"){
			if(window.sessionStorage.getItem("addNews")){
				var addNews = window.sessionStorage.getItem("addNews");
				newsData = JSON.parse(addNews).concat(data);
			}else{
				newsData = data;
			}
			for(var i=0;i<newsData.length;i++){
        		if(newsData[i].newsStatus == "待审核"){
					newArray.push(newsData[i]);
        		}
        	}
        	newsData = newArray;
        	newsList(newsData);
		}else{    //正常加载信息
			newsData = data;
			if(window.sessionStorage.getItem("addNews")){
				var addNews = window.sessionStorage.getItem("addNews");
				newsData = JSON.parse(addNews).concat(newsData);
			}
			//执行加载数据的方法
			newsList();
		}
	})*/
    searchBtn(localStorage.getItem('allOrder') || 1);
    localStorage.removeItem('allOrder');
	//查询
	$(".search_btn").click(function(){
        searchBtn(1);
            /*	$.ajax({
					url : "../../json/newsList.json",
					type : "get",
					dataType : "json",
					success : function(data){
                        layer.close(index);
						if(window.sessionStorage.getItem("addNews")){
							var addNews = window.sessionStorage.getItem("addNews");
							newsData = JSON.parse(addNews).concat(data);
						}else{
							newsData = data;
						}
						for(var i=0;i<newsData.length;i++){
							var newsStr = newsData[i];
							var selectStr = $(".search_input").val();
		            		function changeStr(data){
		            			var dataStr = '';
		            			var showNum = data.split(eval("/"+selectStr+"/ig")).length - 1;
		            			if(showNum > 1){
									for (var j=0;j<showNum;j++) {
		            					dataStr += data.split(eval("/"+selectStr+"/ig"))[j] + "<i style='color:#03c339;font-weight:bold;'>" + selectStr + "</i>";
		            				}
		            				dataStr += data.split(eval("/"+selectStr+"/ig"))[showNum];
		            				return dataStr;
		            			}else{
		            				dataStr = data.split(eval("/"+selectStr+"/ig"))[0] + "<i style='color:#03c339;font-weight:bold;'>" + selectStr + "</i>" + data.split(eval("/"+selectStr+"/ig"))[1];
		            				return dataStr;
		            			}
		            		}
		            		//文章标题
		            		if(newsStr.newsName.indexOf(selectStr) > -1){
			            		newsStr["newsName"] = changeStr(newsStr.newsName);
		            		}
		            		//发布人
		            		if(newsStr.newsAuthor.indexOf(selectStr) > -1){
			            		newsStr["newsAuthor"] = changeStr(newsStr.newsAuthor);
		            		}
		            		//审核状态
		            		if(newsStr.newsStatus.indexOf(selectStr) > -1){
			            		newsStr["newsStatus"] = changeStr(newsStr.newsStatus);
		            		}
		            		//浏览权限
		            		if(newsStr.newsLook.indexOf(selectStr) > -1){
			            		newsStr["newsLook"] = changeStr(newsStr.newsLook);
		            		}
		            		//发布时间
		            		if(newsStr.newsTime.indexOf(selectStr) > -1){
			            		newsStr["newsTime"] = changeStr(newsStr.newsTime);
		            		}
		            		if(newsStr.newsName.indexOf(selectStr)>-1 || newsStr.newsAuthor.indexOf(selectStr)>-1 || newsStr.newsStatus.indexOf(selectStr)>-1 || newsStr.newsLook.indexOf(selectStr)>-1 || newsStr.newsTime.indexOf(selectStr)>-1){
		            			newArray.push(newsStr);
		            		}
		            	}


					}
				})*/
	})
	function searchBtn(pageNumber) {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/hospital/order/getList.json";
        var data = {};
        data.keyword = $(".newsName").val();
        data.name = $(".projName").val();
        data.type = $(".type").val();
        data.status = $(".status").val();
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
                +'<td>'+data[i].fullname+'</td>'
                +'<td>'+data[i].mobile+'</td>';
               /* if(data[i].type == 'project'){
                    dataHtml += '<td>预约项目</td>';
                }else if(data[i].type == 'product'){
                    dataHtml += '<td>特价项目</td>';
                }else if(data[i].type == 'censor'){
                    dataHtml += '<td></td>';
                }*/
                dataHtml += '<td>'+data[i].name+'</td>' +
                    '<td>'+data[i].amount+'</td>' +
                    '<td>'+data[i].createDate+'</td>';
                if(data[i].orderStatus == 'waitPaid'){
                    dataHtml += '<td>待支付</td>';
                }else if(data[i].orderStatus == 'waitConfirm'){
                    if(data[i].isReservation == true){
                        dataHtml += '<td>已支付(已预约)</td>';
                    }else if(data[i].isReservation == false){
                        dataHtml += '<td>已支付(未预约)</td>';
                    }else{
                        dataHtml += '<td>已支付</td>';
                    }
                }else if(data[i].orderStatus == 'completed'){
                    dataHtml += '<td>待结算</td>';
                }else if(data[i].orderStatus == 'cancelled'){
                    dataHtml += '<td>已取消</td>';
                }else if(data[i].orderStatus == 'handle'){
                    dataHtml += '<td>已完成</td>';
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
    /*$(window).resize(function(){
        layui.layer.full(index);

    })
    layui.layer.full(index);*/
    //layer.close(indexOpen);
}
