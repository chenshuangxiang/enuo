layui.use(['form','layer','jquery','laypage','laydate','element'],function(){
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
        laydate = layui.laydate,
		$ = layui.jquery;

    laydate.render({
        elem: '#newsTime'
    });
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
    searchBtn(localStorage.getItem('allAllot') || 1);
    localStorage.removeItem('allAllot');
	//查询
	$(".search_btn").click(function(){
        searchBtn(1);

	})
	function searchBtn(pageNumber) {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/hospital/allot/getList.json";
        var data = {};
        data.keyword = $(".newsName").val();
        data.date = $("#newsTime").val();
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
	$(".consultAdd").click(function(){
        //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});

		var index = layui.layer.open({
			title : "添加咨询",
			type : 2,
            area:['80%','80%'],
			content : "consultAdd.html",
			success : function(layero, index){
			    localStorage.setItem('allAllot',$('.layui-laypage-curr em').eq(1).text());
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
                localStorage.setItem('allAllot',$('.layui-laypage-curr em').eq(1).text());
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
                localStorage.setItem('allAllot',$('.layui-laypage-curr em').eq(1).text());
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
                if(data[i].status == 'notPass' || data[i].hospitalStatus == 'repeat' || data[i].hospitalStatus == 'infoError'){

                }else{
                    dataHtml += '<tr>'
                    /* +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                    /*  +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                    if(data[i].status == 'notPass'){
                        dataHtml +='<td style="color: #1E9FFF;cursor: pointer" disabled="disabled" onclick="allot_record(this)" data_id="'+data[i].id+'" value_id="'+data[i].advisoryId+'" value_mobile="'+data[i].mobile+'" patient_id="'+data[i].patientId+'">'+data[i].username+'</td>'
                    }else{
                        dataHtml +='<td style="color: #1E9FFF;cursor: pointer" onclick="allot_record(this)" data_id="'+data[i].id+'" value_id="'+data[i].advisoryId+'" value_mobile="'+data[i].mobile+'" patient_id="'+data[i].patientId+'">'+data[i].username+'</td>'
                    }
                    dataHtml +='<td>'+data[i].mobile+'</td>'
                        +'<td>'+data[i].disease+'</td>'
                        +'<td>'+new Date(data[i].createDate).Format('yyyy-MM-dd hh:mm:ss')+'</td>';
                    if(data[i].platformAccess == true){
                        dataHtml +='<td>平台已回访</td>'
                    }else{
                        dataHtml +='<td style="color: red">平台未回访</td>'
                    }
                    if(data[i].hospitalAccess == true){
                        dataHtml +='<td>本院已回访('+recordStatusHospital(data[i].hospitalStatus)+')</td>'
                    }else{
                        dataHtml +='<td style="color: red">本院未回访</td>'
                    }


                    /* if(data[i].status == "unallot"){
                         dataHtml += '<a class="layui-btn layui-btn-mini consultFen" style="display: none" valueid="'+data[i].id+'"><i class="iconfont icon-edit"></i> 分诊</a>' +
                             '<a class="layui-btn layui-btn-normal layui-btn-mini news_reset" style="display: none" valueid="'+data[i].id+'"><i class="layui-icon">&#xe600;</i> 编辑</a>';
                     }*/
                    dataHtml +=  /*'<a class="layui-btn layui-btn-normal layui-btn-mini news_record_add" style="display: none" valueid="'+data[i].id+'"><i class="layui-icon">&#xe650;</i> 回访</a>' +*/
                        '</td>' +
                        '<td>' ;
                    if(data[i].status == 'notPass'){
                        dataHtml += '<a class="layui-btn layui-btn-normal layui-btn-disabled layui-btn-mini news_reset_recordhis" disabled="disabled" onclick="allot_record(this)" data_id="'+data[i].id+'" value_id="'+data[i].advisoryId+'" value_mobile="'+data[i].mobile+'" patient_id="'+data[i].patientId+'">回访</a>';
                    }else{
                        if(data[i].hospitalStatus == 'recontact'){
                            dataHtml += '<a class="layui-btn layui-btn-normal layui-btn-mini news_reset_recordhis" style="background-color: red;" onclick="allot_record(this)" data_id="'+data[i].id+'" value_id="'+data[i].advisoryId+'" value_mobile="'+data[i].mobile+'" patient_id="'+data[i].patientId+'">再次回访</a>';
                        }else{
                            dataHtml += '<a class="layui-btn layui-btn-normal layui-btn-mini news_reset_recordhis" onclick="allot_record(this)" data_id="'+data[i].id+'" value_id="'+data[i].advisoryId+'" value_mobile="'+data[i].mobile+'" patient_id="'+data[i].patientId+'">回访</a>';
                        }
                    }
                    dataHtml += '</td>'
                        +'</tr>';
                }

            }
        }else{
            dataHtml = '<tr><td colspan="9">暂无数据</td></tr>';
        }
        return dataHtml;
    }
})

function allot_record(obj) {
    if($(obj).attr('disabled') == 'disabled'){
        layer.alert('该咨询已被打回',{icon:7});
        return
    }
    //历史回访
        //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
        //var username = $(this).attr('valueusername');
        var mobile = $(obj).attr('value_mobile');
        var id = $(obj).attr('value_id');
        var patientid = $(obj).attr('patient_id');
        var dataid = $(obj).attr('data_id');
        var index = layui.layer.open({
            title : "回访",
            type : 2,
            area:['83%','83%'],
            content : "../user/historyRecordShuju.html?id=" + id + '&mobile=' + mobile + '&patientid='+patientid + '&dataid='+dataid  + '&v=1134',
            success : function(layero, index){
                setTimeout(function () {
                    layui.layer.tips('点击此处返回分诊列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                },500)

            }
        })
}