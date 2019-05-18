var form;
layui.use(['form','layer','jquery','laypage','laydate','element','table'],function(){
	form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
        laydate = layui.laydate,
        table = layui.table;
		$ = layui.jquery;
    laydate.render({
        elem: '#newsTime'
    });
    toAllFirstTopTab('.userLi','.toPeopleBtn');
    getService(form,'guestService'); //获取客服加入
    getDoctorHelpmate(form);
    form.render();
	//加载页面数据
	var newsData = '';
    searchBtn(localStorage.getItem('allAllot') || 1);
    localStorage.removeItem('allAllot');
	//查询
	$(".search_btn").click(function(){
        searchBtn(1);
	});
    form.on('checkbox(allChoose)', function(obj){
        console.log(obj.elem.checked); //当前是否选中状态
        if(obj.elem.checked){
            $('input[name="allot"]').prop('checked',true);
            form.render();
        }else{
            $('input[name="allot"]').prop('checked',false);
            form.render();
        }
    });
    $('.sureFenToHosKefu').click(function () {
        var elThisid = $('.hoskefuSelect').val();
        fenzhenAllot(elThisid)
        return false
    });
    $('.sureFenToHosDoctorHelpmate').click(function () {
        var elThisid = $('.hosDoctorHelpmateSelect').val();
        fenzhenAllot(elThisid)
        return false
    });
	function searchBtn(pageNumber,pageSize) {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/hospital/allot/getList.json";
        var data = {};
        data.keyword = $(".newsName").val();
        data.date = $("#newsTime").val();
        data.allotIs = $('.allotis').val();
        data.guestServiceId = $('.hoskefuSelectSearch').val();
        data.doctorHelpmateSearchId = $('.hosDoctorHelpmateSelectSearch').val();
        data.pageNumber = pageNumber;
        data.pageSize = pageSize || 15;
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            layer.close(index);
            if(retInfo.success){
                newsList(retInfo.data,retInfo.totalCount,pageNumber,pageSize);
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




	function newsList(retInfo,totalCount,current,pageSize){
		//渲染数据
        $(".news_content").html(renderDate(retInfo));
        form.render();
		//分页
		var nums = pageSize|| 15; //每页出现的数据量
        laypage.render({
            elem : "page",
            skip:true,
            layout: ['count', 'prev', 'page', 'next','limit', 'skip'],
            limits: [15, 50, 100],
            count:totalCount,
            limit :nums,
            curr: current || 1,
            jump : function(obj,firstLoaded){
                console.log(firstLoaded)
                console.log(obj)
                if (!firstLoaded) {
                    searchBtn(obj.curr,obj.limit);
                    $('.layui-laypage-limits select').val(obj.limit);
                }
            }
        })
	}
    function renderDate(data){
        var dataHtml = '';
        if(data.length != 0){
            var numbersCount = 0;
            for(var i=0;i<data.length;i++){
                if(data[i].status == 'notPass' || data[i].hospitalStatus == 'repeat' || data[i].hospitalStatus == 'infoError'){

                }else{
                    numbersCount += 1;
                    dataHtml += '<tr>'
                    /* +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                    /* if(data[i].guestServiceName == '' || data[i].guestServiceName == undefined || data[i].guestServiceName == null){*/
                    if(data[i].status == 'notPass' || data[i].hospitalStatus == 'repeat'|| data[i].hospitalStatus == 'infoError'){
                        dataHtml +='<td></td>'
                    }else{
                        dataHtml +='<td>'+Number(numbersCount)+'<input style="float: right" type="checkbox" name="allot" data_id="'+data[i].id+'" lay-skin="primary" lay-filter="Choose"></td>'
                    }
                    /* }else{
                         dataHtml +='<td></td>'
                     }*/
                    dataHtml += '<td style="color: #2299ee;cursor: pointer" onclick="toUserInfo(this)" valueindex="1"   valuemobile="'+data[i].mobile+'">'+data[i].username+'</td>'
                        +'<td>'+data[i].mobile+'</td>'
                        +'<td>'+data[i].disease+'</td>'
                        +'<td>'+new Date(data[i].createDate).Format('yyyy-MM-dd hh:mm:ss')+'</td>'
                    if(!data[i].guestServiceName){
                        dataHtml +='<td style="color: red">未分配</td>';
                    }else{
                        dataHtml +='<td>'+noData(data[i].guestServiceName)+'</td>';
                    }
                    if(!data[i].doctorHelpmate){
                        dataHtml +='<td style="color: red">未分配</td>';
                    }else{
                        dataHtml +='<td>'+noData(data[i].doctorHelpmate)+'</td>';
                    }

                    if(data[i].platformAccess == true){
                        dataHtml +='<td>平台已回访</td>'
                    }else{
                        dataHtml +='<td style="color: red">平台未回访</td>'
                    }
                    if(data[i].hospitalAccess == true){
                        dataHtml +='<td>本院已回访</td>'
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
                    if(data[i].status == 'notPass' || data[i].hospitalStatus == 'repeat' || data[i].hospitalStatus == 'infoError'){
                        dataHtml += '<a class="layui-btn layui-btn-normal layui-btn-disabled layui-btn-mini news_reset_recordhis" disabled="disabled" onclick="allot_record(this)" data_id="'+data[i].id+'" value_id="'+data[i].advisoryId+'" value_mobile="'+data[i].mobile+'" patient_id="'+data[i].patientId+'">回访</a></td>'
                    }else{
                        dataHtml += '<a class="layui-btn layui-btn-normal layui-btn-mini news_reset_recordhis" onclick="allot_record(this)" data_id="'+data[i].id+'" value_id="'+data[i].advisoryId+'" value_mobile="'+data[i].mobile+'" patient_id="'+data[i].patientId+'">回访</a></td>'
                    }

                    dataHtml +='</tr>';
                }

            }
        }else{
            dataHtml = '<tr><td colspan="9">暂无数据</td></tr>';
        }
        return dataHtml;
    }
})
function fenzhenAllot(obj) {
    var elThisid = obj;
    var allotList = [];
    var checkdAllot = $("input:checkbox[name='allot']:checked");
    if(checkdAllot.length == 0){
        layer.msg('请选择需要分配的数据');
        return;
    }
    if(elThisid == ''){
        layer.msg('请选择分配客服');
        return;
    }
    checkdAllot.each(function() { // 遍历name=test的多选框
        // 每一个被选中项的值
        allotList.push($(this).attr('data_id'))
    });
    allotList = allotList.join(',');
    console.log(allotList)
    var data = {};
    var url = SERVER_ADDR + "/hospital/allot/allotToCustomerService";
    data.id =elThisid;
    data.ids = allotList;
    ajaxGetRetInfo(url,data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            localStorage.setItem('allAllot',$('.layui-laypage-curr em').eq(1).text());
            layer.msg('分配成功');
            setTimeout(function () {
                location.reload();
            },1000)
        }else{
            layer.alert(retInfo.data,{icon:5})
        }
    },'请求失败', 'POST', undefined, undefined);
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
            content : "historyRecord.html?id=" + id + '&mobile=' + mobile + '&patientid='+patientid + '&dataid='+dataid,
            success : function(layero, index){
                setTimeout(function () {
                    layui.layer.tips('点击此处返回分诊列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                },500)

            }
        })
}
//分诊数据给客服
function write_fen_allot_open() {
    var checkdAllot = $("input:checkbox[name='allot']:checked");
    if(checkdAllot.length == 0){
        layer.msg('请勾选需要分配的数据');
        return;
    }
    var index = layui.layer.open({
        title : "分配给客服",
        type : 1,
        area: ['345px','420px'],
        content : $('.writeFenOpen'),
        success : function(layero, index){
            $('.layui-layer-shade').remove();
        },
        cancel: function(index, layero){
            $('.writeFenOpen').hide();
            layer.close(index)
            return false;
        }
    })
}
//分诊数据给现场咨询
function write_fen_allot_doctorHelpmate_open() {
    var checkdAllot = $("input:checkbox[name='allot']:checked");
    if(checkdAllot.length == 0){
        layer.msg('请勾选需要分配的数据');
        return;
    }
    var index = layui.layer.open({
        title : "分配给现场咨询",
        type : 1,
        area: ['345px','420px'],
        content : $('.writeFenOpendDoctorHelpmate'),
        success : function(layero, index){
            $('.layui-layer-shade').remove();
        },
        cancel: function(index, layero){
            $('.writeFenOpendDoctorHelpmate').hide();
            layer.close(index)
            return false;
        }
    })
}