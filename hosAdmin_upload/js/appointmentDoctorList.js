layui.use(['form','layer','jquery','laypage','laydate'],function(){
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
        laydate = layui.laydate,
		$ = layui.jquery;
    form.render();
	//加载页面数据
	var newsData = '';
	$('.help').mouseenter(function () {
        layui.layer.tips('已预约：用户已经预约该项目<br>已取消：用户已经取消预约该项目<br>已完成：用户已经完成该项目', '.help', {
            tips: 3
        });
    })

    searchBtn(1);
	//查询
	$(".search_btn").click(function(){
        searchBtn(1);
	})
	function searchBtn(pageNumber) {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/hospital/reservation/getList.json";
        var data = {};
        data.type = 'doctor';
        data.pageNumber = pageNumber;
        data.pageSize = 10;
        //项目名称
        if($(".newsName").val() != ""){
            data.keyword = $(".newsName").val();
            console.log(data);
        }
//		console.log(pass_val);
        //预约状态
        if($('.statusjSelect').val() != ""){
            data.status = $('.statusjSelect').val();
            console.log(data);
        }
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
    $(".yuyueDocOpen").click(function(){
        var index = layui.layer.open({
            title : "立即预约二维码",
            type : 2,
            area:['500px','400px'],
            content : "docErweima.html",
            success : function(layero, index){


            }
        })
    })
	//添加回访
	$(".consultAdd").click(function(){
        //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
		var index = layui.layer.open({
			title : "患者回访信息添加",
			type : 2,
			content : "recordAdd.html",
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
    //检查
    $("body").on("click",".examine",function(){
        var elthis = $(this);
        var value_id = elthis.attr("value_id");
        $('.sureExamine').attr('valueid',value_id);
        var index = layui.layer.open({
            title : "检查",
            type : 1,
            content : $('.examineOpen'),
            success : function(layero, index){
                setTimeout(function () {
                    layui.layer.tips('点击此处返回体验列表', '.layui-layer-setwin .layui-layer-close', {
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
    });
    //诊断
    $("body").on("click",".diagnose",function(){
        var elthis = $(this);
        var value_id = elthis.attr("value_id");
        //$('.sureDiagnose').attr('valueid',value_id);
        var index = layui.layer.open({
            title : "诊断",
            type : 2,
            content : 'diagnose.html?id='+ value_id,
            success : function(layero, index){
                setTimeout(function () {
                    layui.layer.tips('点击此处返回体验列表', '.layui-layer-setwin .layui-layer-close', {
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
    });
	//完成
    /*$("body").on("click",".firm",function(){
        var elthis = $(this);
        var appoint_id = elthis.attr("value_id");
        //window.localStorage.setItem("appoint_id",appoint_id);
        layer.confirm('确定完成？', {
            btn: ['完成','取消'] //按钮
        }, function(){
            var data = {
                "id":appoint_id
            }
            $.post_ajax("/hospital/reservation/completed",data,function(res){
                if(res.success){
//				window.location.href = "appointment_list.html";
                    elthis.parent().prev().text("已完成");
                    elthis.remove();
                }else{
                    alert(res.data);
                }
            });
        }, function(){

        });
    });*/
    //确定检查
    $(".sureExamine").click(function(){
        var amount = $(".amount").val();
        //非必填
        var medicareAmount = $(".medicareAmount").val();
        var mainStatement = $(".mainStatement").val();
        var currentDiseaseHistory = $(".currentDiseaseHistory").val();

        var data = {
            "reservationId": $('.sureExamine').attr('valueid'),
            "amount":amount,
            //非必填
            "medicareAmount":medicareAmount,
            "mainStatement":mainStatement,
            "currentDiseaseHistory":currentDiseaseHistory
//		"censorItems":toHash(special_addTag.getResult()),
        }
        $('.appoint_result_name').each(function (index,value) {
            var value = value.value;
            if(!validate.verify(value,"检查项目名称")){
                return false;
            }
            //console.log(src)
            //属性名是变量的时候，得用[]括号
            data['censorItems['+index+'].name'] = value;
        });
        $('.appoint_result_detail').each(function (index,value) {
            var value = value.value;
            //console.log(src)
            data['censorItems[' + index + '].description'] = value;
        });
        console.log(data);

//	验证
        if(!validate.verifyNum(amount,"预交总费用")){return false;}
        $.post_ajax("/hospital/topthree/censor/add",data,function(data){
            if(data.success){
//			alert("data.data");
                //$(".shade,.popup_box").hide();
                //window.location.href = "appointment_list.html";
            }else{
                alert(data.data);
            }
        });
    });
    $('.sureFen').click(function () {
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
    });
	//编辑咨询
    $("body").on("click",".news_reset",function(){  //收藏.
		var valueid = $(this).attr('valueid');
        var index = layui.layer.open({
            title : "编辑咨询",
            type : 2,
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
        $(window).resize(function(){
            layui.layer.full(index);
        })
        layui.layer.full(index);
    })
	//推荐文章
	$(".recommend").click(function(){
		var $checkbox = $(".news_list").find('tbody input[type="checkbox"]:not([name="show"])');
		if($checkbox.is(":checked")){
			var index = layer.msg('推荐中，请稍候',{icon: 16,time:false,shade:0.8});
            setTimeout(function(){
                layer.close(index);
				layer.msg("推荐成功");
            },2000);
		}else{
			layer.msg("请选择需要推荐的文章");
		}
	})

	//审核文章
	$(".audit_btn").click(function(){
		var $checkbox = $('.news_list tbody input[type="checkbox"][name="checked"]');
		var $checked = $('.news_list tbody input[type="checkbox"][name="checked"]:checked');
		if($checkbox.is(":checked")){
			var index = layer.msg('审核中，请稍候',{icon: 16,time:false,shade:0.8});
            setTimeout(function(){
            	for(var j=0;j<$checked.length;j++){
            		for(var i=0;i<newsData.length;i++){
						if(newsData[i].newsId == $checked.eq(j).parents("tr").find(".news_del").attr("data-id")){
							//修改列表中的文字
							$checked.eq(j).parents("tr").find("td:eq(3)").text("审核通过").removeAttr("style");
							//将选中状态删除
							$checked.eq(j).parents("tr").find('input[type="checkbox"][name="checked"]').prop("checked",false);
							form.render();
						}
					}
            	}
                layer.close(index);
				layer.msg("审核成功");
            },2000);
		}else{
			layer.msg("请选择需要审核的文章");
		}
	})

	//批量删除
	$(".batchDel").click(function(){
		var $checkbox = $('.news_list tbody input[type="checkbox"][name="checked"]');
		var $checked = $('.news_list tbody input[type="checkbox"][name="checked"]:checked');
		if($checkbox.is(":checked")){
			layer.confirm('确定删除选中的信息？',{icon:3, title:'提示信息'},function(index){
				var index = layer.msg('删除中，请稍候',{icon: 16,time:false,shade:0.8});
	            setTimeout(function(){
	            	//删除数据
	            	for(var j=0;j<$checked.length;j++){
	            		for(var i=0;i<newsData.length;i++){
							if(newsData[i].newsId == $checked.eq(j).parents("tr").find(".news_del").attr("data-id")){
								newsData.splice(i,1);
								newsList(newsData);
							}
						}
	            	}
	            	$('.news_list thead input[type="checkbox"]').prop("checked",false);
	            	form.render();
	                layer.close(index);
					layer.msg("删除成功");
	            },2000);
	        })
		}else{
			layer.msg("请选择需要删除的文章");
		}
	})

	//全选
	form.on('checkbox(allChoose)', function(data){
		var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"])');
		child.each(function(index, item){
			item.checked = data.elem.checked;
		});
		form.render('checkbox');
	});

	//通过判断文章是否全部选中来确定全选按钮是否选中
	form.on("checkbox(choose)",function(data){
		var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"])');
		var childChecked = $(data.elem).parents('table').find('tbody input[type="checkbox"]:not([name="show"]):checked')
		if(childChecked.length == child.length){
			$(data.elem).parents('table').find('thead input#allChoose').get(0).checked = true;
		}else{
			$(data.elem).parents('table').find('thead input#allChoose').get(0).checked = false;
		}
		form.render('checkbox');
	})

	//是否展示
	form.on('switch(isShow)', function(data){
		var index = layer.msg('修改中，请稍候',{icon: 16,time:false,shade:0.8});
        setTimeout(function(){
            layer.close(index);
			layer.msg("展示状态修改成功！");
        },2000);
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
                dataHtml += '<tr>'
                   /* +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                 /*  +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                  /*  +'<td><input type="checkbox" valueid="'+data[i].id+'" name="checked" lay-skin="primary" lay-filter="choose"><div class="layui-unselect layui-form-checkbox" lay-skin="primary"><i class="layui-icon"></i></div></td>'*/
                    /*+'<td>'+data[i].sn+'</td>'*/
                    +'<td>'+data[i].fullname+'</td>'
                    +'<td>'+data[i].mobile+'</td>';
                  /*  +'<td>'+data[i].storeName+'</td>'*/
                /*if(data[i].type == "coupon"){
                    dataHtml += '<td>体验券</td>'
                }else if(data[i].type == "product"){
                    dataHtml += '<td>项目</td>'
                }*/
                dataHtml += '<td>'+data[i].name+'</td>'
					+'<td>'+data[i].reservationDate+'</td>';
                if(data[i].status == "success"){
                    dataHtml += '<td>已预约</td>'
                }else if(data[i].status == "complete"){
                    dataHtml += '<td>已完成</td>'
                }else if(data[i].status == "cancel"){
                    dataHtml += '<td>已取消</td>'
                }
                dataHtml +=  '<td>';
              if(data[i].type == "doctor"){
                  /*if(data[i].status == "success"){
                      dataHtml +=  '<a class="layui-btn layui-btn-normal layui-btn-mini examine" valueid="'+data[i].id+'">检查</a>' +
                          '<a class="layui-btn layui-btn-normal layui-btn-mini btnorange diagnose" valueid="'+data[i].id+'">诊断</a>'
                  }*/
                  if(data[i].status == "success"){
                      dataHtml +=  '<a class="layui-btn layui-btn-normal layui-btn-mini firm" onclick="firm(this)" valueid="'+data[i].id+'"><i class="layui-icon"  style="    margin-right: -6px;">&#xe618;</i> 完成</a><a class="layui-btn layui-btn-normal layui-btn-mini" onclick="addWriteDoctor(this)" valueid="'+data[i].id+'">录诊</a>';
                  }
              }else {
                  /*if(data[i].status == "success"){
                      dataHtml +=  '<a class="layui-btn layui-btn-normal layui-btn-mini firm" onclick="firm(this)" valueid="'+data[i].id+'"><i class="layui-icon">&#xe618;</i> 完成</a><a class="layui-btn layui-btn-normal layui-btn-mini" onclick="addWriteDoctor(this)" valueid="'+data[i].id+'">录诊</a>';
                  }*/
              }
                dataHtml += '</td>'
                    +'</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="8">暂无数据</td></tr>';
        }
        return dataHtml;
    }
})
//添加咨询
function addWriteDoctor(obj){
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var elThis = $(obj).attr('valueid');
    console.log(4555)
    var index = layui.layer.open({
        title : "添加录诊",
        type : 2,
        area:['62%','68%'],
        content : "addWrite.html?action=reset&type=doctor&valueid=" + elThis ,
        success : function(layero, index){
            localStorage.setItem('allWrite',$('.layui-laypage-curr em').eq(1).text());

        }
    })
}
function firm(obj) {
    var elthis = $(obj);
    var appoint_id = elthis.attr("valueid");
    //window.localStorage.setItem("appoint_id",appoint_id);
    layer.confirm('确认该项目已完成？', {
        btn: ['完成','取消'], //按钮
        icon:3
    }, function(){
        var data = {
            "id":appoint_id
        }
        postget_ajax("/hospital/reservation/completed",data,'POST',function(res){
            if(res.success){
//				window.location.href = "appointment_list.html";
                elthis.parent().prev().text("已完成");
                elthis.remove();
                layer.closeAll();
            }else{
                layer.alert(res.data);
            }
        });
    }, function(){

    });
}

var special_addTag = {
    num:1,
    //增约定效果
    addResult:function(m){
        this.num++;
        var html = '<div class="layui-form-item" style="margin-bottom: 1px;">' +
            '<div class="layui-inline">' +
            '<label class="layui-form-label"></label>' +
            '<div class="layui-input-inline">' +
            '<input type="text" value="" placeholder="检查项目" class="layui-input search_input appoint_result appoint_result_name">' +
            '</div>' +
            '</div>' +
            '<div class="layui-inline">' +
            '<div class="layui-input-inline">' +
            '<input type="text" value="" placeholder="检查结果" class="layui-input search_input appoint_result appoint_result_detail">' +
            '</div>' +
            '</div>' +
            '<input type="button" class="layui-btn layui-btn-danger" onclick="special_addTag.delResult(this)" value="删除"/>' +
            '</div>';
        $('.addCensorItems').append(html);
    },
    //减约定效果
    delResult:function(m){
        this.num--;
        $(m).parent().remove();
    },
    //初始化约定效果
    init_appoint_result:function(m,tag){
        if(!m[0]){
            return false;
        }
//		console.log("沃日");
        var html = "";
        //	m=["aa","bb"];
        for(var i=0;i<m.length;i++){
            if(i==0){
                html=html+"<p>"
                    +"<input type='text' class='appoint_result appoint_result_name' placeholder='如' value='"+m[i]+"'/>"
                    +"<input type='text' class='appoint_result appoint_result_detail' placeholder='如'/>"
                    +"<span class='font_green' onclick='special_addTag.addResult(this)'> [+]</span>"
                    +"</p>";
            }
            if(i>0){
                html=html+"<p>"
                    +"<input type='text' class='appoint_result appoint_result_name' placeholder='如' value='"+m[i]+"'/>"
                    +"<input type='text' class='appoint_result appoint_result_detail' placeholder='如'/>"
                    +"<span class='font_green' onclick='special_addTag.delResult(this)'> [-]</span>"
                    +"</p>";
            }
        }
        $(tag).html(html);
    },
    //获取列表的值
    getResult:function(){
        var arrResult = [];
        $(".appoint_result").each(function (index,value) {
            console.log("进来了");
            var arrChild = {};
            if($(this).hasClass("appoint_result_name")){
                console.log("name进来了");
                arrChild.name = $(this).val();
            }
            if($(this).hasClass("appoint_result_detail")){
                arrChild.description = $(this).val();
            }
            arrResult.push(arrChild);
            console.log(arrResult);
        });

        return arrResult;
    }
}