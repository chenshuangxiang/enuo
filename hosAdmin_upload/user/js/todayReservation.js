layui.use(['form','layer','jquery','laypage','laydate'],function(){
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
        laydate = layui.laydate,
		$ = layui.jquery;

    //getHos(form); //获取医院
    //getSaleman(form); //获取业务员
    //getFrom(form); //获取点位来源
    /*form.on('select(newsHos)', function(data){  //根据医院获取病种
        getFk(form,data.elem[data.elem.selectedIndex].title);
    });*/
    $('.todayReservationZixun').addClass('layui-this').parent().parent().addClass('layui-nav-itemed');
	//加载页面数据
    laydate.render({
        elem: '#newsTime'
    });
    laydate.render({
        elem: '#newsTimeEnd'
    });

    $('#newsTime').val(new Date().Format('yyyy-MM-dd'));
	var newsData = '';
    searchBtn(localStorage.getItem('todayRecord') || 1);
    localStorage.removeItem('todayRecord');
	//查询
	$(".search_btn").click(function(){
        searchBtn(1);
	})
	function searchBtn(pageNumber) {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/hospital/allot/getRecentReservationList.json";
        var data = {};
        data.keyword = $(".newsName").val();
        //data.recent = true;
        data.beginDate = $("#newsTime").val();
        data.endDate = $("#newsTimeEnd").val();
        data.pageNumber = pageNumber;
        data.pageSize = 11;
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
                localStorage.setItem('todayRecord',$('.layui-laypage-curr em').eq(1).text());
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
    $(".getexcel").click(function(){
        var url = SERVER_ADDR + "/admin/allot/access/export?";
        parent.window.location.href = url + 'username='+$(".newsName").val() + '&mobile=' + $(".mobile").val() + '&accessDate=' + $(".newsTime").val() + '&salesmanId=' + $(".kefuSelect").val();
    });
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
                if(!data[i].birthday){
                    var birthday = '无'
                }else{
                    var birthday = new Date(data[i].birthday).Format("yyyy-MM-dd")
                }
                if(data[i].sex == 'man'){
                    data[i].sex = '男';
                }else if(data[i].sex == 'woman'){
                    data[i].sex = '女';
                }else if(data[i].sex == 'unknown'){
                    data[i].sex = '不详';
                }
                if(!data[i].lastVisitDate){
                    var lastVisitDate = '无'
                }else{
                    var lastVisitDate = new Date(data[i].lastVisitDate).Format("yyyy-MM-dd")
                }
                dataHtml += '<tr>'
                    /* +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                    /*  +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                    /*  +'<td>'+new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss")+'</td>'*/
                    +'<td style="color: #1E9FFF;cursor: pointer" onclick="news_record_add(this)" valueid="'+data[i].id+'" patientId="'+data[i].patientId+'" mobile="'+data[i].mobile+'">'+data[i].name+'</td>'
                    +'<td>'+data[i].mobile+'</td>'
                    +'<td>'+data[i].sex+'</td>'
                   /* +'<td>'+birthday+'</td>'*/
                    +'<td>'+noData(data[i].storeName)+'</td>'
                if(new Date().Format('yyyy-MM-dd') == new Date(data[i].reservationDate).Format("yyyy-MM-dd")){
                    dataHtml += '<td>今日</td>'
                }else{
                    dataHtml += '<td>'+noData(new Date(data[i].reservationDate).Format("yyyy-MM-dd"))+'</td>'
                }
                dataHtml +='<td>'+ data[i].disease+'</td>'
                    +'<td>'+noData( new Date(data[i].createDate).Format("yyyy-MM-dd"))+'</td>'
                dataHtml += '<td><a class="layui-btn layui-btn-mini" onclick="news_record_add(this)" valueid="'+data[i].id+'" patientId="'+data[i].patientId+'" mobile="'+data[i].mobile+'"><i class="iconfont icon-edit"></i> 回访</a></td>' +
                    /*"<a class='layui-btn layui-btn-normal layui-btn-mini news_recordHis' onclick='news_recordHis(this)' valueid='"+data[i].id+"' valuehis='"+JSON.stringify(data[i].accessJsons)+"'><i class='layui-icon'>&#xe60e;</i> 历史回访</a></td>"*/
                    +'</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="9">暂无数据</td></tr>';
        }
        return dataHtml;
    }
})
/*function news_record_add(obj) {
    var elThis = $(obj);
    var index = layui.layer.open({
        area: ['500px','480px'],
        title : "患者回访信息添加",
        type : 2,
        content : "recordAddShuju.html?id=" +elThis.attr('valueid'),
        success : function(layero, index){
            //localStorage.setItem('allconsultPage',$('.layui-laypage-curr em').eq(1).text());
        }
    })
}*/
function news_record_add(obj) {
    var elThis = $(obj);
    var index = layui.layer.open({
        area:['83%','83%'],
        title : "患者回访信息添加",
        type : 2,
        content : "historyRecordShuju.html?mobile=" +elThis.attr('mobile') +"&dataid=" +elThis.attr('valueid') +"&patientid=" +elThis.attr('patientId'),
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
        switch (value.hospitalStatus){
            case 'unAccess':
                value.hospitalStatus = '未回访';
                break;
            case 'reservation':
                value.hospitalStatus = '已预约';
                break;
            case 'visit':
                value.hospitalStatus = '已到诊';
                break;
            case 'success':
                value.hospitalStatus = '已成交';
                break;
            case 'faild':
                value.hospitalStatus = '到诊未成交';
                break;
            case 'repeat':
                value.hospitalStatus = '重单';
                break;
            case 'unContact':
                value.hospitalStatus = '无法联系';
                break;
            case 'refuse':
                value.hospitalStatus = '拒接';
                break;
            case 'emptyNum':
                value.hospitalStatus = '空号/停机';
                break;
            case 'infoError':
                value.hospitalStatus = '信息不符';
                break;
            case 'hasAccess':
                value.hospitalStatus = '需要回访';
                break;
            case undefined:
                value.hospitalStatus = '';
                break;
        }
        switch (value.platformStatus){
            case 'unConnect':
                value.platformStatus = '未接通';
                break;
            case 'refuse':
                value.platformStatus = '拒接';
                break;
            case 'emptyNum':
                value.platformStatus = '空号/停机';
                break;
            case 'infoError':
                value.platformStatus = '信息不符';
                break;
            case 'hospitalUnAccess':
                value.platformStatus = '院方未回访';
                break;
            case 'hasAccess':
                value.platformStatus = '跟踪复仿';
                break;
            case 'pauseAccess':
                value.platformStatus = '暂停回访';
                break;
            case 'success':
                value.platformStatus = '已成交';
                break;
            case undefined:
                value.platformStatus = '';
                break;
        }
        var html = '';
        html += '<tr>'
            /* +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
            /*  +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
            /*+'<td><input type="checkbox" valueid="'+data[i].id+'" name="checked" lay-skin="primary" lay-filter="choose"><div class="layui-unselect layui-form-checkbox" lay-skin="primary"><i class="layui-icon"></i></div></td>'*/
            +'<td>'+new Date(value.createDate).Format("yyyy-MM-dd hh:mm:ss")+'</td>'
            +'<td>'+value.creator+'</td>'
            +'<td>'+value.hospitalStatus+'</td>'
            +'<td>'+value.platformStatus+'</td>'
            +'<td>'+value.brief+'</td>'
            +'</tr>'

        $('.today_RecordHis').append(html);
    })
}