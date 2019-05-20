layui.use(['form','layer','jquery','laypage','laydate'],function(){
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
        laydate = layui.laydate,
		$ = layui.jquery;

    laydate.render({
        elem: '#newsTime'
    });
    aviosyLeftClick();
    $('.hospitalRecordDD').addClass('layui-this');
    $('.allRecordLi').addClass('layui-nav-itemed');
    //getHos(form); //获取医院
    getSaleman(form); //获取业务员
    //getFrom(form); //获取点位来源
    /*form.on('select(newsHos)', function(data){  //根据医院获取病种
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
    searchBtn(localStorage.getItem('allrecordPage') || 1);
    localStorage.removeItem('allrecordPage');
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
        var url = SERVER_ADDR + "/customerService/getAccessList.json";
        var data = {};
        data.keyword = $(".newsName").val();
        //data.mobile = $('.mobile').val();
     /*   data.age = $(".age").val();
        data.storeId = $(".from").val();*/
        data.date = $(".newsTime").val();
        data.type = 'hospital';
        data.hospitalStatus = $('.allotStatus').val();
     /*   data.hospitalId = $(".newsHos").val();
        data.fkId = $(".newsDisease").val();*/
        data.salesmanId = $('.kefuSelect').val();
     /*   data.status = $(".status").val();*/
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
	//添加回访
	$(".consultAdd").click(function(){
        //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
		var index = layui.layer.open({
			title : "患者回访信息添加",
			type : 2,
			content : "recordAdd.html",
			success : function(layero, index){
                localStorage.setItem('allrecordPage',$('.layui-laypage-curr em').eq(1).text());
				setTimeout(function () {
                    layui.layer.tips('点击此处返回回访列表', '.layui-layer-setwin .layui-layer-close', {
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
//导出回访
    /*$(".getexcel").click(function(){
        var url = SERVER_ADDR + "/admin/allot/access/export?";
        parent.window.location.href = url + 'username='+$(".newsName").val() + '&mobile=' + $(".mobile").val() + '&accessDate=' + $(".newsTime").val() + '&salesmanId=' + $(".kefuSelect").val();
    });*/
	//历史回访
    $("body").on("click",".news_record",function(){  //收藏.
        //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
        var username = $(this).attr('valueusername');
        var mobile = $(this).attr('valuemobile');
        var id = $(this).attr('valueid');
        var index = layui.layer.open({
            title : "历史回访 》 " + username + ' - ' +  mobile,
            type : 2,
            content : "historyRecord.html?id=" + id  + '&v=222',
            success : function(layero, index){
                setTimeout(function () {
                    layui.layer.tips('点击此处返回回访列表', '.layui-layer-setwin .layui-layer-close', {
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
   /* $('.sureFen').click(function () {
        var elThisid = $('.sureFen').attr('valueid');
        if($('.newsTimeFen').val() == ''){
            layer.alert('请选择分诊时间',{icon:7});
        }
        if($('.newsHosFen').val() == ''){
            layer.alert('请选择分诊医院',{icon:7});
        }
        var url = SERVER_ADDR + "/admin/allot/advisory/allot";
        var data = {};
        data.id = $('.sureFen').attr('valueid');
        data.date = $('.newsTimeFen').val();
        data.hospitalId = $('.newsHosFen').val();
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                var elthis = $(".consultFen[valueid="+elThisid+"]");
                elthis.parent().prev().text('申请中').attr('style','color:#F7B824');
                elthis.remove();
                layui.layer.closeAll();
                layer.msg(retInfo.data)

            }else{
                layer.alert(retInfo.data,{icon:5})
            }
        },'请求失败', 'POST', undefined, undefined);

        return false
    });*/
	//编辑咨询
    $("body").on("click",".news_reset",function(){  //收藏.
		var valueid = $(this).attr('valueid');
        var index = layui.layer.open({
            title : "编辑咨询",
            type : 2,
            content : "consultAdd.html?action=reset&valueid=" + valueid  + '&v=222',
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
    })
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
                    +'<td>'+new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss")+'</td>'
                    +'<td style="color: #1E9FFF;cursor: pointer" onclick="news_reset_recordhis(this)" valueid="'+data[i].advisoryId+'" patientid="'+data[i].patientId+'" valuemobile="'+data[i].mobile+'" valueusername="'+data[i].name+'">'+data[i].username+'</td>'
                    +'<td>'+data[i].mobile+'</td>'
                  /*  +'<td>'+data[i].storeName+'</td>'*/
                    +'<td>'+data[i].disease+'</td>'
					+'<td>'+data[i].creator+'</td>'

                   /* +'<td>'+data[i].allotHospitalName+'</td>'*/
                    +'<td>'+recordStatusOnlyOne(data[i].hospitalStatus,data[i].platformStatus)+'</td>'
                    +'<td>'+data[i].brief+'</td>'
                    /*if(data[i].platformStatus){
                        dataHtml +='<td style="color: #1E9FFF;cursor: pointer;" class="resetRecord" valueid="'+data[i].id+'" valuestatus="'+data[i].platformStatus+'" onclick="resetRecordOPen(this)">修改</td>';
                    }else{
                        dataHtml +='<td></td>'
                    }*/
                    /*+ '<td>';*/
              /*  if(data[i].status == "unallot"){
                    dataHtml += '<a class="layui-btn layui-btn-mini consultFen" valueid="'+data[i].id+'"><i class="iconfont icon-edit"></i> 分诊</a>';
                }*/
               /* '<a class="layui-btn layui-btn-normal layui-btn-mini news_record" valueid="'+data[i].id+'" valuemobile="'+data[i].mobile+'" valueusername="'+data[i].username+'"><i class="layui-icon">&#xe60e;</i> 历史回访</a>'*/
                    /*			+  '<a class="layui-btn layui-btn-danger layui-btn-mini news_del" data-id="'+data[i].newsId+'"><i class="layui-icon">&#xe640;</i> 删除</a>'*/
                   /* +'</td>'*/
                dataHtml += '</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="9">暂无数据</td></tr>';
        }
        return dataHtml;
    }
})
/*function resetRecordOPen(obj) {
    var prevConten = $(obj).prev().text();
    var prevStatus = $(obj).attr('valuestatus');
    switch (prevStatus){
        case '未接通':
            prevStatus = 'unConnect';
            break;
        case '拒接':
            prevStatus = 'refuse';
            break;
        case '有意向未到诊':
            prevStatus = 'INTENTIONALMISSVISIT';
            break;
        case '空号/停机':
            prevStatus = 'emptyNum';
            break;
        case '信息不符':
            prevStatus = 'infoError';
            break;
        case '院方未回访':
            prevStatus = 'hospitalUnAccess';
            break;
        case '跟踪复仿':
            prevStatus = 'hasAccess';
            break;
        case '暂停回访':
            prevStatus = 'pauseAccess';
            break;
        case '已成交':
            prevStatus = 'success';
            break;
        case undefined:
            prevStatus = '';
            break;
    }
    console.log(prevStatus);
    $(obj).prev().prev().html('<select style="display: block" class="prevStatus"> ' +
        '<option value="unConnect" title="unConnect">未接通</option> ' +
        '<option value="refuse" title="refuse">拒接</option> ' +
        '<option value="INTENTIONALMISSVISIT" title="INTENTIONALMISSVISIT">有意向未到诊</option> ' +
        '<option value="emptyNum" title="emptyNum">空号/停机</option> ' +
        '<option value="infoError" title="infoError">信息不符</option> ' +
        '<option value="hospitalUnAccess" title="hospitalUnAccess">院方未回访</option> ' +
        '<option value="success" title="success">已成交</option> ' +
        '<option value="hasAccess" title="hasAccess">跟踪复访</option> ' +
        '<option value="pauseAccess" title="pauseAccess">暂停回访</option> ' +
        '</select>');
    $('.prevStatus').val(prevStatus)
    $(obj).prev().html('<input class="briefInput" type="text" value="'+prevConten+'">');
    $(obj).attr('onclick','Get.resetRecord(this)');
    $(obj).text('确定');
}*/
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
var Get = {
    resetRecord: function (obj) {
        var elThis = $(obj);
        var url = SERVER_ADDR + '/customerService/updateAccess';
        var Data = {};
        Data.id = elThis.attr('valueid');
        Data.brief = $('.briefInput').val();
        Data.platformStatus = $('.prevStatus').val();
        ajaxGetRetInfo(url, Data, this.resetRecordSuccess, '请求失败', 'POST', true, undefined);
    },
    resetRecordSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            localStorage.setItem('allrecordPage',$('.layui-laypage-curr em').eq(1).text());
            location.reload();
        } else {
            alert(retInfo.data);
        }
    }
}