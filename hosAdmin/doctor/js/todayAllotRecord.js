layui.use(['form','layer','jquery','laypage','laydate'],function(){
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
        laydate = layui.laydate,
		$ = layui.jquery;
    laydate.render({
        elem: '#newsTime'
    });
    laydate.render({
        elem: '#newsTimeEnd'
    });

    $('#newsTime').val(new Date().Format('yyyy-MM-dd'));
    //getHos(form); //获取医院
    //getSaleman(form); //获取业务员
    //getFrom(form); //获取点位来源
    /*form.on('select(newsHos)', function(data){  //根据医院获取病种
        getFk(form,data.elem[data.elem.selectedIndex].title);
    });*/
	//加载页面数据
    //aviosyLeftClick();
    $('.todayAllotRecord').addClass('layui-this');
	var newsData = '';

	//查询
    searchBtn(1);
	$(".search_btn").click(function(){
        searchBtn(1);
	})
	function searchBtn(pageNumber) {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/hospital/allot/allotTodayAccess.json";
        var data = {};
        data.pageNumber = pageNumber;
        data.pageSize = 10;
        data.beginDate = $("#newsTime").val();
        data.endDate = $("#newsTimeEnd").val();
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
            content : "historyRecord.html?id=" + id,
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
    /*$('.sureFen').click(function () {
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
    //添加回访
    /*$("body").on("click",".news_record_add",function(){
        //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
        var elThis = $(this);
        var index = layui.layer.open({
            area: ['500px','480px'],
            title : "患者回访信息添加",
            type : 2,
            content : "../allRecord/recordAdd.html?id=" +elThis.attr('valueid'),
            success : function(layero, index){
                //localStorage.setItem('allconsultPage',$('.layui-laypage-curr em').eq(1).text());
            }
        })
    });*/
//历史回访
   /* $("body").on("click",".news_recordHis",function(){
        var valuehis = $(this).attr('valuehis');
        var index = layui.layer.open({
            area: ['600px','500px'],
            title : "历史回访",
            type : 1,
            content : $('.fenOpen'),
            success:function(){
                addHis(valuehis);
            }
        })
    });*/

	function newsList(retInfo,totalCount,current){
		//渲染数据
        $(".news_content").html(renderDate(retInfo));
        form.render('checkbox','choose')
		//分页
		var nums = 10; //每页出现的数据量
        laypage.render({
            elem : "page",
            skip:true,
            layout: ['count', 'prev', 'page', 'next', 'skip'],
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
                switch (data[i].sex){
                    case 'man':
                        data[i].sex = '男';
                        break
                    case 'woman':
                        data[i].sex = '女';
                        break
                    case 'unknown':
                        data[i].sex = '不详';
                        break
                }
                dataHtml += '<tr>'
                   /* +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                 /*  +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                    /*+'<td><input type="checkbox" valueid="'+data[i].id+'" name="checked" lay-skin="primary" lay-filter="choose"><div class="layui-unselect layui-form-checkbox" lay-skin="primary"><i class="layui-icon"></i></div></td>'*/
                    +'<td>'+data[i].name+'</td>'
                    +'<td>'+data[i].mobile+'</td>'
                    +'<td>'+data[i].sex+'</td>'
                    +'<td>'+data[i].storeName+'</td>'
                   /* +'<td>'+data[i].hospital+'</td>'*/
                    +'<td title="'+data[i].disease+'">'+returnSubstring(data[i].disease)+'</td>'
                if(new Date().Format('yyyy-MM-dd') == new Date(data[i].nextAccessDate).Format("yyyy-MM-dd")){
                    dataHtml += '<td>今日</td>'
                }else{
                    dataHtml += '<td>'+noData(new Date(data[i].nextAccessDate).Format("yyyy-MM-dd"))+'</td>'
                }
                dataHtml +='<td>'+data[i].accessContent+'</td>';
                if(data[i].todayNeedAccess == true || new Date().Format('yyyy-MM-dd') != new Date(data[i].nextAccessDate).Format("yyyy-MM-dd")){
                    dataHtml += '<td style="color: red">未回访</td>'
                }else{
                    dataHtml += '<td>已回访</td>'
                }
                dataHtml +='<td>'+new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss")+'</td>';

                dataHtml += '<td><a class="layui-btn layui-btn-normal layui-btn-mini news_reset_recordhis" onclick="allot_record(this)" data_id="'+data[i].allotId+'" value_id="'+data[i].id+'" value_mobile="'+data[i].mobile+'" patient_id="'+data[i].patientId+'">回访</a></td>'

              /*  if(data[i].status == "unallot"){
                    dataHtml += '<a class="layui-btn layui-btn-mini consultFen" valueid="'+data[i].id+'"><i class="iconfont icon-edit"></i> 分诊</a>';
                }*/
               /* '<a class="layui-btn layui-btn-normal layui-btn-mini news_record" valueid="'+data[i].id+'" valuemobile="'+data[i].mobile+'" valueusername="'+data[i].username+'"><i class="layui-icon">&#xe60e;</i> 历史回访</a>'*/
                    /*			+  '<a class="layui-btn layui-btn-danger layui-btn-mini news_del" data-id="'+data[i].newsId+'"><i class="layui-icon">&#xe640;</i> 删除</a>'*/
                   /* +'</td>'*/
                dataHtml += '</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="10">暂无数据</td></tr>';
        }
        return dataHtml;
    }
})
function news_todayrecord_add(obj) {
    var elThis = $(obj);
    var index = layui.layer.open({
        area: ['500px','480px'],
        title : "患者回访信息添加",
        type : 2,
        content : "recordAdd.html?id=" +elThis.attr('valueid'),
        success : function(layero, index){
            //localStorage.setItem('allconsultPage',$('.layui-laypage-curr em').eq(1).text());
        }
    })
}

function news_recordHis(obj) {
    var valuehis = $(obj).attr('valuehis');
    if(valuehis == 'undefined'){
        layer.msg('暂无历史回访内容');
        return;
    }
    var index = layui.layer.open({
        area: ['600px','500px'],
        title : "历史回访",
        type : 1,
        content : $('.fenOpen'),
        success:function(){
            $('.layui-layer-shade').remove();
            addHis(valuehis);
        }
    })
}
function addHis(valuehis) {
    console.log(JSON.parse(valuehis))
    $('.today_RecordHis').empty();
    JSON.parse(valuehis).forEach(function(value){
        var html = '';
        html += '<tr>'
            /* +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
            /*  +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
            /*+'<td><input type="checkbox" valueid="'+data[i].id+'" name="checked" lay-skin="primary" lay-filter="choose"><div class="layui-unselect layui-form-checkbox" lay-skin="primary"><i class="layui-icon"></i></div></td>'*/
            +'<td>'+new Date(value.createDate).Format("yyyy-MM-dd hh:mm:ss")+'</td>'
            +'<td>'+value.creator+'</td>'
            +'<td>'+recordStatusHospital(value.hospitalStatus)+'</td>'
            +'<td>'+recordStatusPlatform(value.platformStatus)+'</td>'
            +'<td>'+value.brief+'</td>'
            +'</tr>'

        $('.today_RecordHis').append(html);
    })
}
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