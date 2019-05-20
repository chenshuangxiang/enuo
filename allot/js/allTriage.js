layui.use(['form','layer','jquery','laypage','laydate'],function(){
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
        laydate = layui.laydate,
		$ = layui.jquery;
//自定义验证规则
    form.verify({
        phone: [/^1[3|4|5|7|8]\d{9}$/, '手机必须11位，只能是数字！']
    });

    laydate.render({
        elem: '#newsTime'
    });
    aviosyLeftClick();
    $('.triageLi').addClass('layui-this');
    getHos(form); //获取医院
    /*getSaleman(form); //获取业务员
    getFrom(form); //获取点位来源
    form.on('select(newsHos)', function(data){  //根据医院获取病种
        getFk(form,data.elem[data.elem.selectedIndex].title);
    });*/
    form.render();
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
    searchBtn(localStorage.getItem('alltriagePage') || 1);
    localStorage.removeItem('alltriagePage');
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
        var url = SERVER_ADDR + "/customerService/getAllotList.json";
        var data = {};
        data.keyword = $(".newsName").val();
        //data.mobile = $('.mobile').val();
        data.date = $(".newsTime").val();
        data.hospitalId = $(".newsHos").val();
        //data.status = $(".status").val();
        data.pageNumber = pageNumber;
        data.pageSize = 16;
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
	$(".consultAdd").click(function(){
        //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
		var index = layui.layer.open({
			title : "添加咨询",
			type : 2,
			content : "consultAdd.html?v=222",
			success : function(layero, index){
				setTimeout(function () {
                    layui.layer.tips('点击此处返回咨询列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                },500)

			}
		})
		//改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
		$(window).resize(function(){
			layui.layer.full(index);

		})
		layui.layer.full(index);
        //layer.close(indexOpen);

	});
    //导出分诊
 /*   $(".getexcel").click(function(){
        var url = SERVER_ADDR + "/admin/allot/export?";
        parent.window.location.href = url +'username='+ $(".newsName").val() + '&mobile' + $(".mobile").val() + '&allotDate' + $(".newsTime").val() + '&hospitalId' + $(".newsHos").val() + '&status'+ $(".status").val();
    });*/
	//修改分诊
    $("body").on("click",".news_reset",function(){  //收藏.
        console.log(666666)
        $(".newsHosFen").val($(this).attr('valuehosid'));
        form.render('select', 'newsHos');
        $('.newsTimeFen').val(new Date(Number($(this).attr('valuedate'))).Format("yyyy-MM-dd hh:mm:ss"));
		$('.sureFen').attr('valueid',$(this).attr('valueid'));
        $('.newsNameReset').val($(this).attr('valueusername'));
        $('.mobileReset').val($(this).attr('valuemobile'));
        var index = layui.layer.open({
            area: ['345px','420px'],
            title : "分诊信息修改",
            type : 1,
            content : $('.fenOpen'),
            success:function(){

			}
        })
    });
  /*  $('.sureFen').click(function () {
        if($('.newsTimeFen').val() == ''){
            layer.alert('请选择分诊时间',{icon:7});
        }
        if($('.newsHosFen').val() == ''){
            layer.alert('请选择分诊医院',{icon:7});
        }
        if($('.newsNameReset').val() == ''){
            layer.alert('请输入姓名',{icon:7});
        }
        if($('.mobileReset').val() == ''){
            layer.alert('请输入手机号',{icon:7});
        }
        var url = SERVER_ADDR + "/admin/allot/update";
        var data = {};
        data.id = $('.sureFen').attr('valueid');
        data.allotDate = $('.newsTimeFen').val();
        data.hospitalId = $('.newsHosFen').val();
        data.username = $('.newsNameReset').val();
        data.mobile = $('.mobileReset').val();
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                localStorage.setItem('alltriagePage',$('.layui-laypage-curr em').eq(1).text());
                layer.msg(retInfo.data);
                location.reload();
                //form.render(null, 'tablelist')
                //layui.layer.closeAll();
            }else{
                layer.alert(retInfo.data,{icon:5})
            }
        },'请求失败', 'POST', undefined, undefined);

        return false
    });*/

	//同意分诊
   /* $("body").on("click",".consultYes",function(){  //收藏.
		var valueid = $(this).attr('valueid');
		var elThis = $(this);
        ajaxGetRetInfo( SERVER_ADDR + "/admin/allot/agree",{id:valueid},function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                elThis.parent().prev().text('已分诊').attr('style','');
                elThis.remove();

                layer.msg(retInfo.data);

                //form.render(null, 'tablelist')
                //layui.layer.closeAll();
            }else{
                layer.alert(retInfo.data,{icon:5})
            }
        },'请求失败', 'POST', undefined, undefined);
    })*/
 
	//操作
	$("body").on("click",".news_edit",function(){  //编辑
		//layer.alert('您点击了文章编辑按钮，由于是纯静态页面，所以暂时不存在编辑内容，后期会添加，敬请谅解。。。',{icon:6, title:'文章编辑'});
		console.log($(this).attr('valueid'));
        var index = layui.layer.open({
            title : "添加文章",
            type : 2,
            content : "newsAdd.html",
            success : function(layero, index){
                layui.layer.tips('点击此处返回咨询列表', '.layui-layer-setwin .layui-layer-close', {
                    tips: 3
                });
            }
        })
        //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
        $(window).resize(function(){
            layui.layer.full(index);
        })
        layui.layer.full(index);
	})

	$("body").on("click",".news_collect",function(){  //收藏.
        var index = layui.layer.open({
            title : "添加文章",
            type : 2,
            content : "newsList.html",
            success : function(layero, index){
                layui.layer.tips('点击此处返回咨询列表', '.layui-layer-setwin .layui-layer-close', {
                    tips: 3
                });
            }
        })
        //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
        $(window).resize(function(){
            layui.layer.full(index);
        })
        layui.layer.full(index);
	})

	$("body").on("click",".news_del",function(){  //删除
		var _this = $(this);
		layer.confirm('确定删除此信息？',{icon:3, title:'提示信息'},function(index){
			//_this.parents("tr").remove();
			for(var i=0;i<newsData.length;i++){
				if(newsData[i].newsId == _this.attr("data-id")){
					newsData.splice(i,1);
					newsList(newsData);
				}
			}
			layer.close(index);
		});
	})

	function newsList(retInfo,totalCount,current){
		//渲染数据
        $(".news_content").html(renderDate(retInfo));
        form.render('checkbox','choose')
		//分页
		var nums = 16; //每页出现的数据量
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
    function renderDate(data){
        var dataHtml = '';
        if(data.length != 0){
            for(var i=0;i<data.length;i++){
                dataHtml += '<tr>'
                   /* +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                   /*+'<td><input type="checkbox" valueid="'+data[i].id+'" name="checked" lay-skin="primary" lay-filter="choose"><div class="layui-unselect layui-form-checkbox" lay-skin="primary"><i class="layui-icon"></i></div></td>'*/
                    +'<td>'+new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss")+'</td>'
                    +'<td style="color: #1E9FFF;cursor: pointer" onclick="news_reset_recordhis(this)" valueid="'+data[i].advisoryId+'" patientid="'+data[i].patientId+'" valuemobile="'+data[i].mobile+'" valueusername="'+data[i].name+'">'+data[i].username+'</td>'
                    +'<td>'+data[i].mobile+'</td>'
                    +'<td>'+data[i].storeName+'</td>'
					+'<td>'+data[i].salesmanName+'</td>'
                    +'<td title="'+data[i].disease+'">'+returnSubstring(data[i].disease)+'</td>'
                    +'<td>'+data[i].hospital+'</td>';
                dataHtml += '<td>' +
                    '<a class="layui-btn layui-btn-mini" onclick="consultFen(this)" valueid="'+data[i].id+'" valuestatus="'+data[i].status+'">修改分诊</a>' +
                    '<a class="layui-btn layui-btn-mini" onclick="news_reset_dohis(this)" valueid="'+data[i].advisoryId+'" valuemobile="'+data[i].mobile+'" valueusername="'+data[i].name+'"><i class="layui-icon" style="font-size: 19px !important;margin-right: 0">&#xe60a;</i></a>' +
                    '</td>';
               /* if(data[i].status == "loading"){
                    dataHtml += '<td style="color:#F7B824">申请中</td>';
                }else{
                    dataHtml += '<td>已分诊</td>';
                }*/
                dataHtml += '</tr>'
                /*if(data[i].status == "loading"){
                    dataHtml += '<a class="layui-btn layui-btn-mini consultYes" valueid="'+data[i].id+'"><i class="layui-icon ">&#xe618</i> 同意</a>'
                }*/
                //dataHtml  +=  /*'<a class="layui-btn layui-btn-normal layui-btn-mini news_reset" valueid="'+data[i].id+'" valuehosid="'+data[i].hospitalId+'" valueusername="'+data[i].username+'" valuemobile="'+data[i].mobile+'" valuedate="'+data[i].allotDate+'"><i class="iconfont icon-edit"></i> 修改</a>'*//*'<a class="layui-btn layui-btn-normal layui-btn-mini news_reset" valueid="'+data[i].id+'" valuehosid="'+data[i].hospitalId+'" valueusername="'+data[i].username+'" valuemobile="'+data[i].mobile+'" valuedate="'+data[i].allotDate+'"><i class="iconfont icon-edit"></i> 修改</a>'*/
                    /*			+  '<a class="layui-btn layui-btn-danger layui-btn-mini news_del" data-id="'+data[i].newsId+'"><i class="layui-icon">&#xe640;</i> 删除</a>'*/
                   // +'</td>'
                  //  +'</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="10">暂无数据</td></tr>';
        }

        return dataHtml;
    }
    $('.sureFen').click(function () {
        if($('.newsHosFen').val() == ''){
            layer.alert('请选择分诊医院',{icon:7});
        }
        var url;
        var data = {};
        url = SERVER_ADDR + "/customerService/modifyDiagnosisHospital";
        data.allotId = $('.sureFen').attr('valueid');
        //data.date = $('.newsTimeFen').val();
        data.hospitalId = $('.newsHosFen').val();
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                /* var elthis = $(".consultFen[valueid="+elThisid+"]");
                 elthis.parent().prev().text('已分诊').attr('style','color:black');
                 elthis.remove();
                 layui.layer.closeAll();*/
                localStorage.setItem('alltriagePage',$('.layui-laypage-curr em').eq(1).text());
                layer.msg(retInfo.data);
                location.reload();
            }else{
                layer.alert(retInfo.data,{icon:5})
            }
        },'请求失败', 'POST', undefined, undefined);

        return false
    });
})
function consultFen(obj) {
    console.log('弹出分诊')
    $('.sureFen').attr('valueid',$(obj).attr('valueid'));
    var index = layui.layer.open({
        area: ['345px','420px'],
        title : "分诊",
        type : 1,
        content : $('.fenOpen'),
        success:function(){
            $('.layui-layer-shade').remove();
        }
    })
}
function news_reset_dohis(obj) {
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var username = $(obj).attr('valueusername');
    var mobile = $(obj).attr('valuemobile');
    var id = $(obj).attr('valueid');
    var elThis = $(obj);
    var index = layui.layer.open({
        title : "操作记录 》 " + username + ' - ' +  mobile,
        type : 2,
        area:['80%','80%'],
        content : "historyDo.html?id=" + id + '&v=222',
        success : function(layero, index){

        }
    })
}
function news_reset_recordhis(obj) {
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var username = $(obj).attr('valueusername');
    var mobile = $(obj).attr('valuemobile');
    var id = $(obj).attr('patientid');
    var valueid = $(obj).attr('valueid');
    var elThis = $(obj);
    var index = layui.layer.open({
        title : "回访",
        type : 2,
        area:['90%','90%'],
        content : "historyRecord.html?id=" + id + '&mobile=' + mobile + '&valueid='+valueid + '&v=222',
        success : function(layero, index){
            //$('.news_content tr').css('background-color','white');
            //elThis.parent().parent().css('background-color','#f2f2f2');


        }
    })
}