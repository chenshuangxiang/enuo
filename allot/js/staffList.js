var form;
layui.use(['form','layer','jquery','laypage','laydate','element'],function(){
	 form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
        laydate = layui.laydate,
		$ = layui.jquery;
    aviosyLeftClick();
    $('.adviosyLi').addClass('layui-nav-itemed');
    laydate.render({elem: '#newsTime'});
    laydate.render({elem: '#newsEndTime'});
    getHos(form); //获取医院
    getSaleman(form); //获取业务员
    getFrom(form); //获取点位来源
    getService(form,'guestService'); //获取客服
    getNoResultHos(form);
   /* form.on('select(newsHos)', function(data){  //根据医院获取病种
        getFk(form,data.elem[data.elem.selectedIndex].title);
    });*/
    var chooseHosList = [];
    //去掉医院选择数组
    form.on("checkbox(choosehospital)",function(data){
        console.log(data)
        if(chooseHosList.indexOf(data.value) == -1){
            chooseHosList.push(data.value);
        }else{
            chooseHosList.removeval(data.value);
        }
        console.log(chooseHosList)
    })
    form.on("select(newsNoResultHos)",function(data){
        console.log(data.value) //id
        console.log(data.elem[data.elem.selectedIndex].title)
            $('.fenHospitalSpan').each(function () {
                console.log($(this).attr('valueid'))
                if(data.value == $(this).attr('valueid') && chooseHosList.indexOf(data.value) == -1){
                    $(this).parent().children('.hoscheckboxInput').prop('checked',true);
                    chooseHosList.push(data.value);
                    console.log(chooseHosList)
                    form.render('checkbox');
                }
            })
            if(chooseHosList.indexOf(data.value) == -1 && data.value != ''){  //已选择数组没有这个医院id 且 选择的不能是空医院
                $('.fenHospitalDiv').append('<div><input class="hoscheckboxInput" type="checkbox" dataid="'+data.value+'" value="'+data.value+'" name="hospital" checked lay-skin="primary" lay-filter="choosehospital"><span class="fenHospitalSpan" valueid="'+data.value+'">'+data.elem[data.elem.selectedIndex].title+'</span></div>');
                chooseHosList.push(data.value);
                console.log(chooseHosList)
            }
        form.render('checkbox');
    });

	//加载页面数据
	var newsData = '';
    $(".newsName").val(sessionStorage.getItem('keyword'));
    $(".from").val(sessionStorage.getItem('storeId'));
    $(".newsTime").val(sessionStorage.getItem('beginDate'));
    $(".newsEndTime").val(sessionStorage.getItem('endDate'));
    $(".newsHos").val(sessionStorage.getItem('hospitalId'));
    $(".newsDisease").val(sessionStorage.getItem('fkId'));
    $(".kefuSelect").val(sessionStorage.getItem('salesmanId'));
    $(".status").val(sessionStorage.getItem('status'));
    $(".visitCount").val(sessionStorage.getItem('visitCount'));
    $(".intention").val(sessionStorage.getItem('intention'));
    $(".newsDiseasetag").val(sessionStorage.getItem('diseaseLabel'));
    form.render();
    searchBtn(localStorage.getItem('allstadffList') || 1);
    localStorage.removeItem('allstadffList');
	//查询
	$(".search_btn").click(function(){
        searchBtn(1);
	})

	//添加咨询
	$(".consultAdd").click(function(){
        //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});

		var index = layui.layer.open({
			title : "添加咨询",
			type : 2,
            area:['686px','80%'],
			content : "consultAdd.html?v=222",
			success : function(layero, index){
			    localStorage.setItem('allstadffList',$('.layui-laypage-curr em').eq(1).text());
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
  /*  $("body").on("click",".consultFen",function(){  //收藏.
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
    });*/
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
                sessionStorage.setItem('keyword',$(".newsName").val());
                sessionStorage.setItem('storeId',$(".from").val());
                sessionStorage.setItem('beginDate',$(".newsTime").val());
                sessionStorage.setItem('endDate',$(".newsEndTime").val());
                sessionStorage.setItem('hospitalId',$(".newsHos").val());
                sessionStorage.setItem('fkId',$(".newsDisease").val());
                sessionStorage.setItem('salesmanId',$(".kefuSelect").val());
                sessionStorage.setItem('status',$(".status").val());
                sessionStorage.setItem('visitCount',$(".visitCount").val());
                sessionStorage.setItem('intention',$(".intention").val());
                sessionStorage.setItem('diseaseLabel',$(".newsDiseasetag").val());
               $('.layui-layer-shade').remove();
            }
        })
    });
    $('.sureFen').click(function () {
        var elThisid = $('.sureFen').attr('valueid');
        if(chooseHosList.length == 0){   //$('.newsHosFen').val() == ''
            layer.alert('请选择分诊医院',{icon:7});
            return
        }
        var url;
        var data = {};
        if($('.sureFen').attr('fen') == 'all'){  //批量分诊
            url = SERVER_ADDR + "/customerService/batchAllotToHospital";
            var allotList = [];
            var checkdAllot = $("input:checkbox[name='allot']:checked");
            if(checkdAllot.length == 0){
                layer.msg('请选择需要分诊的数据');
                return;
            }
            checkdAllot.each(function() { // 遍历name=test的多选框
                // 每一个被选中项的值
                allotList.push($(this).attr('data_id'))
            });
            console.log(allotList)
            if(allotList[0] == undefined){
                allotList.splice(0,1);
            }
            allotList = allotList.join(',');
            console.log(allotList)
            data.ids = allotList;
        }else{ //单独分诊
            url = SERVER_ADDR + "/customerService/allot/submit";
            data.advisoryId = $('.sureFen').attr('valueid');
        }
        //data.date = $('.newsTimeFen').val();
        //data.hospitalId = $('.newsHosFen').val();

        var csxList = [];
        chooseHosList.forEach(function (value) {
            var csx = {};
            csx.hospitalId = value;
            csxList.push(csx);
        });
        data.map = JSON.stringify(csxList);//chooseHosList.join(',');
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
               /* var elthis = $(".consultFen[valueid="+elThisid+"]");
                elthis.parent().prev().text('已分诊').attr('style','color:black');
                elthis.remove();
                layui.layer.closeAll();*/
                localStorage.setItem('allstadffList',$('.layui-laypage-curr em').eq(1).text());
                layer.msg(retInfo.data);
                setTimeout(function () {
                    location.reload();
                },1000);
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
            content : "../allRecord/recordAdd.html?id=" + $(this).attr('valueid') + '&v=222',
            success : function(layero, index){
                localStorage.setItem('allstadffList',$('.layui-laypage-curr em').eq(1).text());
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
})
$('.sureFenToHosKefu').click(function () {
    var elThisid = $('.hoskefuSelect').val();
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
    console.log(allotList)
    if(allotList[0] == undefined){
        allotList.splice(0,1);
    }
    allotList = allotList.join(',');
    console.log(allotList)
    var data = {};
    var url = SERVER_ADDR + "/customerService/distributionToCustomerService";
    data.id =elThisid;
    data.ids = allotList;
    console.log(data)
    ajaxGetRetInfo(url,data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            localStorage.setItem('allstadffList',$('.layui-laypage-curr em').eq(1).text());
            layer.msg('分配成功');
            setTimeout(function () {
                location.reload();
            },1000)
        }else{
            layer.alert(retInfo.data,{icon:5})
        }
    },'请求失败', 'POST', undefined, undefined);
    return false
});
function searchBtn(pageNumber,orderType) {
    var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
    var url = SERVER_ADDR + "/customerService/getAdvisoryList.json";
    var data = {};
    data.keyword = $(".newsName").val();
    data.sex = $(".sex").val();
    data.storeId = $(".from").val();
    data.beginDate = $(".newsTime").val();
    data.endDate = $(".newsEndTime").val();
    data.hospitalId = $(".newsHos").val();
    data.fkId = $(".newsDisease").val();
    data.diseaseLabel = $(".newsDiseasetag").val();
    data.salesmanId = $('.kefuSelect').val();
    data.status = $(".status").val();
    data.visitCount = $(".visitCount").val();
    data.intention = $(".intention").val();
    data.orderType = orderType;
    data.pageNumber = pageNumber;
    data.pageSize = 11;
    sessionStorage.removeItem('keyword');
    sessionStorage.removeItem('storeId');
    sessionStorage.removeItem('beginDate');
    sessionStorage.removeItem('endDate');
    sessionStorage.removeItem('hospitalId');
    sessionStorage.removeItem('fkId');
    sessionStorage.removeItem('salesmanId');
    sessionStorage.removeItem('status');
    sessionStorage.removeItem('visitCount');
    sessionStorage.removeItem('diseaseLabel');
    sessionStorage.removeItem('intention');
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
function newsList(retInfo,totalCount,current){
    //渲染数据
    $(".news_content").html(renderDate(retInfo));
    form.render();
    //分页
    var nums = 11; //每页出现的数据量
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
            dataHtml += '<tr onclick="backColor(this)">'
                /* +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
            /*if(data[i].customerServiceName == '' || data[i].customerServiceName == undefined || data[i].customerServiceName == null){*/
                dataHtml +='<td><input type="checkbox" name="allot" data_id="'+data[i].id+'" lay-skin="primary" lay-filter="choose"></td>'
            /*}else{
                dataHtml +='<td></td>'
            }*/
            dataHtml +='<td>'+new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss")+'</td>'

            dataHtml +='<td style="color: #1E9FFF;cursor: pointer" title="注意：该咨询有重单或者重复添加的可能" onclick="news_reset_recordhis(this)" valueid="'+data[i].id+'" patientid="'+data[i].patientId+'" valuemobile="'+data[i].mobile+'" valueusername="'+data[i].name+'">'+data[i].name+'</td>'
            dataHtml +='<td>'+data[i].mobile+'</td>'
                +'<td>'+data[i].storeName+'</td>'
                +'<td>'+data[i].salesmanName+'</td>'
                +'<td>'+noData(data[i].customerServiceName)+'</td>'
                +'<td title="'+data[i].disease+'">'+returnSubstring(data[i].disease)+'</td>'
                +'<td>'+data[i].hospital+'</td>'
                if(data[i].intention == 'STRONG_INTENEION'){
                    dataHtml += '<td title="'+returnIntentStatus(data[i].intention)+'"><img style="width: 22px;" src="./img/intentGood.png">'+returnSubstringSize(returnIntentStatus(data[i].intention),5)+'</td>';
                }else{
                    dataHtml += '<td title="'+returnIntentStatus(data[i].intention)+'">'+returnSubstringSize(returnIntentStatus(data[i].intention),5)+'</td>';
                }
            if(data[i].status == "unallot"){
                dataHtml += '<td style="color:#f00">未分诊</td>';
                if(data[i].visitCount > 0){
                    dataHtml += '<td>已回访/'+data[i].visitCount+'次</td>';
                }else{
                    dataHtml += '<td style="color: red">未回访</td>';
                }
                dataHtml += '<td>' ;
                if(data[i].advisoryCount > 1){
                    dataHtml +='<a class="layui-btn layui-btn-mini layui-btn-danger" title="注意：该咨询有重单或者重复添加的可能" onclick="consultFen(this)" valueid="'+data[i].id+'" valuestatus="'+data[i].status+'">分诊</a>' ;
                }else{
                    dataHtml +='<a class="layui-btn layui-btn-mini" title="分诊" onclick="consultFen(this)" valueid="'+data[i].id+'" valuestatus="'+data[i].status+'">分诊</a>' ;
                }
            }else if(data[i].status == "allot"){
                var allotHosList = data[i].allotJsons;//[{id:23,name:'杭州时光医疗美容医院'},{id:58,name:'杭州阿波罗男子医院'}];
                /*dataHtml += '<td><a class="layui-btn layui-btn-normal layui-btn-mini" valuelist="'+allotHosList+'">已分诊</a></td>';*/
                dataHtml += "<td style='color: #1E9FFF;cursor: pointer;text-decoration: underline' onclick='consultAlreadyFen(this)' valuelist='"+JSON.stringify(allotHosList)+"'>已分诊</td>";
                if(data[i].visitCount > 0){
                    dataHtml += '<td>已回访/'+data[i].visitCount+'次</td>';
                }else{
                    dataHtml += '<td style="color: red">未回访</td>';
                }
                dataHtml += '<td>'
                if(data[i].advisoryCount > 1){
                    dataHtml += "<a class='layui-btn layui-btn-mini layui-btn-danger' title='注意：该咨询有重单或者重复添加的可能' valuelist='"+JSON.stringify(allotHosList)+"' onclick='consultFen(this)' valueid='"+data[i].id+"' valuestatus='"+data[i].status+"'>继续分诊</a>"
                }else{
                    dataHtml += "<a class='layui-btn layui-btn-mini' title='继续分诊' valuelist='"+JSON.stringify(allotHosList)+"' onclick='consultFen(this)' valueid='"+data[i].id+"' valuestatus='"+data[i].status+"'>继续分诊</a>"
                }
            }else if(data[i].status == "coupon"){
                dataHtml += '<td>体验券</td>';
                if(data[i].visitCount > 0){
                    dataHtml += '<td>已回访/'+data[i].visitCount+'次</td>';
                }else{
                    dataHtml += '<td style="color: red">未回访</td>';
                }
                dataHtml += '<td>'
                  //  '<a class="layui-btn layui-btn-mini layui-btn-disabled" onclick="consultFen(this)" valueid="'+data[i].id+'" valuestatus="'+data[i].status+'">分诊</a>' ;

            }else if(data[i].status == "notPass"){
                dataHtml += '<td>被打回</td>';
                if(data[i].visitCount > 0){
                    dataHtml += '<td>已回访/'+data[i].visitCount+'次</td>';
                }else{
                    dataHtml += '<td style="color: red">未回访</td>';
                }
                dataHtml += '<td>'
                //  '<a class="layui-btn layui-btn-mini layui-btn-disabled" onclick="consultFen(this)" valueid="'+data[i].id+'" valuestatus="'+data[i].status+'">分诊</a>' ;

            }
            dataHtml +=  '<a class="layui-btn layui-btn-mini"  title="编辑患者信息" onclick="news_reset(this)" valueid="'+data[i].id+'" valuestatus="'+data[i].status+'"><i class="iconfont icon-edit"></i></a>' +
                '</td>';
            /* if(data[i].status == "unallot"){
                 dataHtml += '<a class="layui-btn layui-btn-mini consultFen" style="display: none" valueid="'+data[i].id+'"><i class="iconfont icon-edit"></i> 分诊</a>' +
                     '<a class="layui-btn layui-btn-normal layui-btn-mini news_reset" style="display: none" valueid="'+data[i].id+'"><i class="layui-icon">&#xe600;</i> 编辑</a>';
             }*/
            dataHtml +=  /*'<a class="layui-btn layui-btn-normal layui-btn-mini news_record_add" style="display: none" valueid="'+data[i].id+'"><i class="layui-icon">&#xe650;</i> 回访</a>' +*/
                '<td><a class="layui-btn layui-btn-normal layui-btn-mini news_reset_dohis" style="padding: 0" onclick="news_reset_dohis(this)" valueid="'+data[i].id+'"  valuemobile="'+data[i].mobile+'" valueusername="'+data[i].name+'"><i class="layui-icon" style="font-size: 19px !important;margin-right: 0">&#xe60a;</i></a>'
            if(data[i].status != "notPass"){
                dataHtml += '<a class="layui-btn layui-btn-normal layui-btn-mini news_reset_recordhis" style="padding: 0 9px;" onclick="news_reset_recordhis(this)" valueid="'+data[i].id+'" patientid="'+data[i].patientId+'" valuemobile="'+data[i].mobile+'" valueusername="'+data[i].name+'">回访</a></td>'
            }else{
                dataHtml += '<a class="layui-btn layui-btn-normal layui-btn-disabled layui-btn-mini news_reset_recordhis" disabled="disabled" style="padding: 0 9px;" onclick="news_reset_recordhis(this)" valueid="'+data[i].id+'" patientid="'+data[i].patientId+'" valuemobile="'+data[i].mobile+'" valueusername="'+data[i].name+'">回访</a></td>'
            }
            dataHtml += '</tr>';
        }
    }else{
        dataHtml = '<tr><td colspan="11">暂无数据</td></tr>';
    }
    return dataHtml;
}
function backColor(obj) {
    $('.news_content tr').css('background-color','white');
    $(obj).css('background-color','#f2f2f2');
}
function consultFen(obj) {
    var alreadyFen = $(obj).attr('valuelist');
    console.log(alreadyFen)
    if(alreadyFen != undefined && alreadyFen != '' && alreadyFen != 'undefined'){
        var alreadyFenJson = JSON.parse(alreadyFen);
    }else{
        var alreadyFenJson = '';
    }

    console.log('弹出分诊')
    if($(obj).attr('title') == '注意：该咨询有重单或者重复添加的可能'){
        $('.fenWarnZi').show();
    }else{
        $('.fenWarnZi').hide();
    }
    $('.sureFen').attr('valueid',$(obj).attr('valueid'));
    var index = layui.layer.open({
        area: ['360px','480px'],
        title : "分诊",
        type : 1,
        content : $('.fenOpen'),
        success:function(){
            $('.fenHospitalAlreadyZi').show();
            $('.fenHospitalAlreadyDiv').empty();
            if(alreadyFenJson.length > 0){
                alreadyFenJson.forEach(function (value) {
                    $('.fenHospitalAlreadyDiv').append('<div><span class="fenHospitalSpan">'+value.hospital+'</span></div>');
                })
            }
           sessionStorage.setItem('keyword',$(".newsName").val());
           sessionStorage.setItem('storeId',$(".from").val());
           sessionStorage.setItem('beginDate',$(".newsTime").val());
           sessionStorage.setItem('endDate',$(".newsEndTime").val());
           sessionStorage.setItem('hospitalId',$(".newsHos").val());
           sessionStorage.setItem('fkId',$(".newsDisease").val());
           sessionStorage.setItem('salesmanId',$(".kefuSelect").val());
           sessionStorage.setItem('status',$(".status").val());
           sessionStorage.setItem('visitCount',$(".visitCount").val());
           sessionStorage.setItem('diseaseLabel',$(".newsDiseasetag").val());
           sessionStorage.setItem('intention',$(".intention").val());
            $('.layui-layer-shade').remove();
            $('.sureFen').attr('fen','one')
        }
    })
}
function consultAlreadyFen(obj) {
    var alreadyFen = $(obj).attr('valuelist');
    console.log(alreadyFen)
    if(alreadyFen != undefined && alreadyFen != '' && alreadyFen != 'undefined'){
        var alreadyFenJson = JSON.parse(alreadyFen);
    }else{
        var alreadyFenJson = '';
    }
    var index = layui.layer.open({
        area: ['360px','480px'],
        title : "已分诊医院",
        type : 1,
        content : $('.fenAlreadyOpen'),
        success:function(){
            $('.layui-layer-shade').remove();
            //var alreadyFenJson = JSON.parse(alreadyFen);
            $('.fenHospitalAlreadyDiv').empty();
            if(alreadyFenJson.length != 0){
                alreadyFenJson.forEach(function (value) {
                    $('.fenHospitalAlreadyDiv').append('<div><span class="fenHospitalSpan">'+value.hospital+'</span></div>');
                })
            }


        }
    })
}
function consultFenAll(obj) {
    console.log('弹出分诊')
    var checkdAllot = $("input:checkbox[name='allot']:checked");
    if(checkdAllot.length == 0){
        layer.msg('请勾选需要分诊的数据');
        return;
    }
    var index = layui.layer.open({
        area: ['360px','480px'],
        title : "批量分诊",
        type : 1,
        content : $('.fenOpen'),
        success:function(){
            $('.fenHospitalAlreadyZi').hide();
            $('.fenHospitalAlreadyDiv').empty();
            sessionStorage.setItem('keyword',$(".newsName").val());
            sessionStorage.setItem('storeId',$(".from").val());
            sessionStorage.setItem('beginDate',$(".newsTime").val());
            sessionStorage.setItem('endDate',$(".newsEndTime").val());
            sessionStorage.setItem('hospitalId',$(".newsHos").val());
            sessionStorage.setItem('fkId',$(".newsDisease").val());
            sessionStorage.setItem('salesmanId',$(".kefuSelect").val());
            sessionStorage.setItem('status',$(".status").val());
            sessionStorage.setItem('visitCount',$(".visitCount").val());
            sessionStorage.setItem('diseaseLabel',$(".newsDiseasetag").val());
            sessionStorage.setItem('intention',$(".intention").val());
            $('.layui-layer-shade').remove();
            $('.sureFen').attr('fen','all')
        }
    })
}
function news_reset(obj) {
    var valueid = $(obj).attr('valueid');
    var index = layui.layer.open({
        title : "编辑咨询",
        type : 2,
        area:['686px','80%'],
        content : "consultAdd.html?action=reset&valueid=" + valueid + '&v=222',
        success : function(layero, index){
            sessionStorage.setItem('keyword',$(".newsName").val());
            sessionStorage.setItem('storeId',$(".from").val());
            sessionStorage.setItem('beginDate',$(".newsTime").val());
            sessionStorage.setItem('endDate',$(".newsEndTime").val());
            sessionStorage.setItem('hospitalId',$(".newsHos").val());
            sessionStorage.setItem('fkId',$(".newsDisease").val());
            sessionStorage.setItem('salesmanId',$(".kefuSelect").val());
            sessionStorage.setItem('status',$(".status").val());
            sessionStorage.setItem('visitCount',$(".visitCount").val());
            sessionStorage.setItem('diseaseLabel',$(".newsDiseasetag").val());
            sessionStorage.setItem('intention',$(".intention").val());
            localStorage.setItem('allstadffList',$('.layui-laypage-curr em').eq(1).text());
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
            //$('.news_content tr').css('background-color','white');
            //elThis.parent().parent().css('background-color','#f2f2f2');
            setTimeout(function () {
                layui.layer.tips('点击此处返回咨询列表', '.layui-layer-setwin .layui-layer-close', {
                    tips: 3
                });
            },500)

        }
    })
}
function news_reset_recordhis(obj) {
    if($(obj).attr('disabled') == 'disabled'){
        layer.alert('该咨询已被打回',{icon:7});
        return
    }
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
            setTimeout(function () {
                layui.layer.tips('点击此处返回咨询列表', '.layui-layer-setwin .layui-layer-close', {
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
        title : "分配",
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
var Get = {
    userInfo: function (obj) {
        var elThis =  $(obj);
        var url = SERVER_ADDR + '/customerService/advisory/getPatientInfo.json';
        var Data = {};
        Data.mobile = elThis.attr('valuemobile');
        ajaxGetRetInfo(url, Data, this.userInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    userInfoSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            //返回填充
            $('.span').text(retInfo.data.name);
            if (retInfo.data.sex == 'man') {
                retInfo.data.sex = '男';
            } else if (retInfo.data.sex == 'woman') {
                retInfo.data.sex = '女';
            } else if (retInfo.data.sex == 'unknown') {
                retInfo.data.sex = '不详';
            }
            if (!retInfo.data.job) {
                retInfo.data.job = '';
            }
            if (!retInfo.data.address) {
                retInfo.data.address = '';
            }
            layer.alert('姓名:' + retInfo.data.name + '' + ' &nbsp;&nbsp;&nbsp;&nbsp;年龄:' + retInfo.data.age + ' &nbsp;&nbsp;&nbsp;&nbsp;性别:' + retInfo.data.sex + ' &nbsp;&nbsp;&nbsp;&nbsp;职业:' + retInfo.data.job + ' &nbsp;&nbsp;&nbsp;&nbsp;地址:' + retInfo.data.address);
            /*$(".newsName").val(retInfo.data.name);
            $(".sex").val(retInfo.data.sex);
            $(".age").val(retInfo.data.age);
            $(".newsAddress").val(retInfo.data.address);
            $(".job").val(retInfo.data.job);*/
        } else {
            alert(retInfo.data);
        }
    }
}