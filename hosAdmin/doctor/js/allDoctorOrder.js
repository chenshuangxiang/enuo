var form
layui.use(['form','layer','jquery','laypage','laydate'],function(){
	 form = layui.form,
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
    $('#newsTimeEnd').val(new Date().Format('yyyy-MM-dd'));
    var firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    $('#newsTime').val(firstDay.Format('yyyy-MM-dd'));
    //getFentoNameSelect(form,'doctorHelpmate');
    //getFentoNameSelect(form,'doctor');
    getFentoNameSelect(form,'nurse');
    form.render();
    /*form.on('select(fenTo)', function(data){  //根据分类获取类型
        getFentoNameSelect(form,data.elem[data.elem.selectedIndex].title);
    });*/
    searchBtn(localStorage.getItem('allDoctorOrder') || 1);
    localStorage.removeItem('allDoctorOrder');
    $('.allDoctorOrder').addClass('layui-this').parent().parent().addClass('layui-nav-itemed');
	//加载页面数据
	$(".search_btn").click(function(){
        searchBtn(1);
	})
    $('.sureFen').click(function () {
        var elThisid = $('.sureFen').attr('valueid');
        if($('.nurse').val() == ''){   //$('.newsHosFen').val() == ''
            layer.alert('请选择护士',{icon:7});
            return
        }
        var url;
        var data = {};
        url = SERVER_ADDR + "/hospital/doctor/index/updateNurse";
        data.userOfflineProjectId = elThisid;
        data.nurseId = $('.nurse').val();
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
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
})
function searchBtn(pageNumber) {
    var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
    var url = SERVER_ADDR + "/hospital/doctor/index/getOrderList.json";
    var data = {};
    data.keyword = $(".newsName").val();
    data.beginDate = $("#newsTime").val();
    data.endDate = $("#newsTimeEnd").val();
    data.pageNumber = pageNumber;
    data.pageSize = 10;
    //项目名称
    if($(".newsName").val() != ""){
        data.keyword = $(".newsName").val();
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
function newsList(retInfo,totalCount,current){
    //渲染数据
    $(".news_content").html(renderDate(retInfo));
    //form.render('checkbox','choose')
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
            var number;
            if(data[i].number.split('-')[2] == undefined){
                var split2 = '';
            }else{
                var split2 = data[i].number.split('-')[2];
            }
            number =  data[i].number.split('-')[0] + '<span style="color: #009688;font-weight:600">'+ data[i].number.split('-')[1]+'</span>' +  split2;

            dataHtml += '<tr>'
                /* +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                /*  +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                /*  +'<td><input type="checkbox" valueid="'+data[i].id+'" name="checked" lay-skin="primary" lay-filter="choose"><div class="layui-unselect layui-form-checkbox" lay-skin="primary"><i class="layui-icon"></i></div></td>'*/
                /*+'<td>'+data[i].sn+'</td>'*/
                +'<td>'+Number(i+1)+'</td>'
              /*  +'<td>'+data[i].reservationDate+'</td>'*/
                +'<td style="color: #2299ee;cursor: pointer" valuemobile="'+data[i].mobile+'" valueid="'+data[i].hospitalUserId+'" onclick="visitUserInfo(this)">'+data[i].fullName+'</td>'
                +'<td>'+data[i].mobile+'</td>';
            if(data[i].type == "coupon"){
                dataHtml += '<td>体验券</td>'
            }else if(data[i].type == "product"){
                dataHtml += '<td>特价项目</td>'
            }else if(data[i].type == "doctor"){
                dataHtml += '<td>医生</td>'
            }else{
                dataHtml += '<td>线下开单</td>'
            }
            dataHtml += '<td>'+noData(data[i].projectName)+'</td>'
                +'<td>'+noData(data[i].diseases)+'</td>';
                if(data[i].source){
                    dataHtml += '<td>'+noData(data[i].source)+'</td>'
                }else if(!data[i].source){
                    dataHtml += '<td>e诺平台</td>'
                }
            dataHtml += '<td>'+noData(data[i].doctor)+'</td>'
                +'<td>'+noData(data[i].doctorHelpmate)+'</td>'
               /* +'<td>'+noData(data[i].medicalTechnology)+'</td>'*/
               if(data[i].nurse){
                   dataHtml +='<td>'+noData(data[i].nurse)+'<br><span style="color: #2299ee;cursor: pointer" nurseid="'+data[i].nurseId+'" valueid="'+data[i].userOffLineProjectId+'" onclick="addNurse(this)">修改</span></td>'
               }else{
                   dataHtml +='<td>'+noData(data[i].nurse)+'<br><span style="color: #2299ee;cursor: pointer" valueid="'+data[i].userOffLineProjectId+'" onclick="addNurse(this)">添加</span></td>'
               }
            dataHtml +='<td>'+noData(data[i].guestService)+'</td>'
            if(data[i].repeat == true){
                    dataHtml += '<td>复诊</td>'
            }else if(data[i].repeat == false){
                dataHtml += '<td>初诊</td>'
            }else{
                dataHtml += '<td>不明</td>'
            }
            dataHtml += '<td>'+number+'</td>'
                +'<td>'+returnProjectVisitRecordStatus(data[i].status)+'</td>'

            dataHtml +=  '<td>';
                if(data[i].diseases){
                    dataHtml +=  '<a class="layui-btn layui-btn-normal layui-btn-mini" onclick="allOrderDetail(this)" valueuserOfflineProject="'+data[i].userOffLineProjectId+'"  valuesubsist="'+data[i].subsist+'" valuedisease="'+data[i].diseases+'" valueid="'+data[i].id+'">查看清单</a>' +
                        '<a class="layui-btn layui-btn-mini" onclick="addVisitProject(this)" valueuserOfflineProject="'+data[i].userOffLineProjectId+'" valuesubsist="'+data[i].subsist+'" valuedisease="'+data[i].diseases+'" valueid="'+data[i].id+'">添加项目</a>'
                }else{
                    if(data[i].status == 'complete' && data[i].repeat == true){
                        dataHtml +=  '<a class="layui-btn layui-btn-normal layui-btn-mini" onclick="fuzhen(this)" valuestatus="complete" valueid="'+data[i].id+'">复诊情况</a>'
                    }
                }
                           /* <a class="layui-btn layui-btn-mini firm" onclick="addVisitProject(this)" valueid="'+data[i].id+'" >再次治疗</a>*/
            if(data[i].status == "complete") {
                //dataHtml += '<a class="layui-btn  layui-btn-mini" onclick="getPhotos(this)" valueid="' + data[i].mobile + '">查看图片</a>'
            }
               dataHtml += '</td>'
                +'</tr>';
        }
    }else{
        dataHtml = '<tr><td colspan="16">暂无数据</td></tr>';
    }
    return dataHtml;
}
function addNurse(obj) {
    if($(obj).attr('nurseid') != undefined){
        $('.nurse').val($(obj).attr('nurseid'));
    }else{
        $('.nurse').val('');
    }
    form.render();
    $('.sureFen').attr('valueid',$(obj).attr('valueid'));
    var index = layui.layer.open({
        area: ['360px','480px'],
        title : "分诊",
        type : 1,
        content : $('.chooseNurseOpen'),
        success:function(){

            $('.layui-layer-shade').remove();

        }
    })
}
function allOrderDetail(obj) {
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var id = $(obj).attr('valueid');
    var disease = $(obj).attr('valuedisease');
    var subsist = $(obj).attr('valuesubsist');
    var valueuserOfflineProject = $(obj).attr('valueuserOfflineProject');
    var index = layui.layer.open({
        title : "项目清单",
        type : 2,
        area: ['80%','85%'],
        content : 'orderDetail.html?id=' + id + '&disease=' + disease  + '&subsist=' + subsist + '&valueuserOfflineProject='+valueuserOfflineProject,
        success : function(layero, index){

        },
        cancel: function(index, layero){
            layer.close(index)
            return false;
        }
    })
}
function addVisitProject(obj) {
    var elThis = $(obj).attr('valueuserOfflineProject');
    console.log(4555)
    var index = layui.layer.open({
        title : "治疗",
        type : 2,
        area:['950px','92%'],
        content : "addAgainTemplateProject.html?valueid=" + elThis + '&v=1134',
        success : function(layero, index){
            localStorage.setItem('allDoctorOrder',$('.layui-laypage-curr em').eq(1).text());

        }
    })
}
function getPhotos(obj) {
    var id = $(obj).attr('valueid');

    var index = layui.layer.open({
        title : "查看图片",
        type : 2,
        area: ['95%','95%'],
        content : "getPhotos.html?valueid=" + id,
        success : function(layero, index){
            localStorage.setItem('allDoctorOrder',$('.layui-laypage-curr em').eq(1).text());
        },
        cancel: function(index, layero){
            layer.close(index)
            return false;
        }
    })
}
//添加项目
function visitUserInfo(obj){
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
  /*  var elThis = $(obj).attr('valuemobile');
    console.log(4555)
    var index = layui.layer.open({
        title : "个人/就诊信息",
        type : 2,
        area:['800px','75%'],
        content : "historyVisit.html?mobile=" + elThis,
        success : function(layero, index){
            //localStorage.setItem('visit',$('.layui-laypage-curr em').eq(1).text());

        }
    })*/
    var mobile = $(obj).attr('valuemobile');
    var id = $(obj).attr('valueid');
    if(id == 'undefined'){
        layer.alert('此用户还不是本院客户，请先添加！',{icon:7});
        return;
    }
    var index = layui.layer.open({
        title : "回访",
        type : 2,
        area:['85%','85%'],
        content : "historyRecord.html?id=" + id + '&mobile=' + mobile,
        success : function(layero, index){
            /*setTimeout(function () {
                layui.layer.tips('点击此处返回咨询列表', '.layui-layer-setwin .layui-layer-close', {
                    tips: 3
                });
            },500)*/

        }
    })
}