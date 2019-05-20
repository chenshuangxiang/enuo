layui.config({
	base : "js/"
}).use(['form','layer','jquery','laypage','laydate'],function(){
	var form = layui.form(),
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
        laydate = layui.laydate,
		$ = layui.jquery;

    getHos(form); //获取医院
    getSaleman(form); //获取业务员
    getFrom(form); //获取点位来源
    form.on('select(newsHos)', function(data){  //根据医院获取病种
        getFk(form,data.elem[data.elem.selectedIndex].title);
    });
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
        var url = SERVER_ADDR + "/admin/allot/advisory/getList.json";
        var data = {};
        data.username = $(".newsName").val();
        data.mobile = $('.mobile').val();
        data.age = $(".age").val();
        data.storeId = $(".from").val();
        data.advisoryDate = $(".newsTime").val();
        data.hospitalId = $(".newsHos").val();
        data.fkId = $(".newsDisease").val();
        data.salesmanId = $('.kefuSelect').val();
        data.status = $(".status").val();
        data.pageNumber = pageNumber;
        data.pageSize = 1;
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            newsList(retInfo.data,retInfo.totalCount,pageNumber);
            layer.close(index);
        },'请求失败', 'GET', undefined, undefined);
    }
	//分诊
	function newsList(retInfo,totalCount,current){
		//渲染数据
        renderDate(retInfo);
        //$(".news_content").html(renderDate(retInfo));
		//分页
		var nums = 1; //每页出现的数据量
        laypage({
            cont : "page",
            pages : Math.ceil(totalCount/1),
            curr: current || 1,
            jump : function(obj,firstLoaded){
                console.log(firstLoaded)
                console.log(obj)
                if (!firstLoaded) {
                    searchBtn(obj.curr);
                    //$(".news_content").html(renderDate(retInfo));
                    //$('.news_list thead input[type="checkbox"]').prop("checked",false);
                    //form.render();
                    // return; // end of function
                }/*else{

                    $(".news_content").html(renderDate(retInfo,obj.curr));
                    //$('.news_list thead input[type="checkbox"]').prop("checked",false);
                    form.render();
				}*/


            }
        })
		/*if(retInfo){
			newsData = retInfo;
		}*/
		/*laypage({
			cont : "page",
			pages : Math.ceil(totalCount/nums),
			jump : function(obj,firstLoaded){
				console.log(firstLoaded)
				console.log(obj)
                if (!firstLoaded) {
                    searchBtn(obj.curr);
                    //$(".news_content").html(renderDate(retInfo));
                    //$('.news_list thead input[type="checkbox"]').prop("checked",false);
                    //form.render();
                   // return; // end of function
                }/!*else{

                    $(".news_content").html(renderDate(retInfo,obj.curr));
                    //$('.news_list thead input[type="checkbox"]').prop("checked",false);
                    form.render();
				}*!/


			}
		})*/
	}
    function renderDate(data){
        var dataHtml = '';
        if(data.length != 0){
            for(var i=0;i<data.length;i++){
                dataHtml += '<tr>'
                    +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'
                    +'<td>'+data[i].newsName+'</td>'
                    +'<td>'+data[i].newsName+'</td>'
                    +'<td>'+data[i].newsName+'</td>'
                    +'<td>'+data[i].newsAuthor+'</td>';
                if(data[i].newsStatus == "待审核"){
                    dataHtml += '<td style="color:#f00">'+data[i].newsStatus+'</td>';
                }else{
                    dataHtml += '<td>'+data[i].newsStatus+'</td>';
                }
                dataHtml += '<td>'+data[i].newsLook+'</td>'
                    +'<td><input type="checkbox" name="show" lay-skin="switch" lay-text="是|否" lay-filter="isShow"'+data[i].isShow+'></td>'
                    +'<td>'+data[i].newsTime+'</td>'
                    +'<td>'
                    +  '<a class="layui-btn layui-btn-mini news_edit" valueid="55"><i class="iconfont icon-edit"></i> 分诊</a>'
                    +  '<a class="layui-btn layui-btn-normal layui-btn-mini news_collect"><i class="layui-icon">&#xe600;</i> 编辑</a>'
                    /*			+  '<a class="layui-btn layui-btn-danger layui-btn-mini news_del" data-id="'+data[i].newsId+'"><i class="layui-icon">&#xe640;</i> 删除</a>'*/
                    +'</td>'
                    +'</tr>';
            }
            $(".news_content").html(dataHtml);
        }else{
            dataHtml = '<tr><td colspan="8">暂无数据</td></tr>';
            $(".news_content").html(dataHtml);
        }
       // return dataHtml;
    }
})
