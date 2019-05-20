var form;
layui.use(['form','layer','jquery','element'],function(){
	 form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		$ = layui.jquery;

	//加载页面数据
	var newsData = '';
    form.render();
    searchBtn(localStorage.getItem('allconsultPage') || 1);
    localStorage.removeItem('allconsultPage');
	//查询
	$(".search_btn").click(function(){

        searchBtn(1);

	})
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
                sessionStorage.setItem('diseaseLabel',$(".newsDiseasetag").val());
               $('.layui-layer-shade').remove();
            }
        })
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
                localStorage.setItem('allconsultPage',$('.layui-laypage-curr em').eq(1).text());
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
            area:['686px','80%'],
            content : "consultAdd.html?action=reset&valueid=" + valueid,
            success : function(layero, index){
                /*setTimeout(function () {
                    layui.layer.tips('点击此处返回咨询列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                },500)*/
                localStorage.setItem('allconsultPage',$('.layui-laypage-curr em').eq(1).text());
            }
        })
        //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
        /*$(window).resize(function(){
            layui.layer.full(index);
        })
        layui.layer.full(index);*/
    });
})
function news_reset(obj) {
    var valueid = $(obj).attr('valueid');
    var index = layui.layer.open({
        title : "编辑咨询",
        type : 2,
        area:['686px','80%'],
        content : "consultAdd.html?action=reset&valueid=" + valueid + '&v=222',
        success : function(layero, index){

        }
    })
}
function searchBtn(pageNumber,orderType) {
    var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
    var url = SERVER_ADDR + "/customerService/getOnePatientAdvisories.json";
    var data = {};
    data.patientId = getQueryString('id');
    ajaxGetRetInfo(url,data,function (retInfo) {
        console.log(retInfo)
        layer.close(index);
        if(retInfo.success){
            $(".news_content").html(renderDate(retInfo.data));

        }else{
            layer.alert(retInfo.data,{icon:5});
        }



    },'请求失败', 'GET', undefined, undefined);
}
function renderDate(data){
    var dataHtml = '';
    if(data.length != 0){
        for(var i=0;i<data.length;i++){
            dataHtml += '<tr onclick="backColor(this)">'
                /* +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                /*  +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                +'<td>'+new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss")+'</td>'
                +'<td style="color: #1E9FFF;cursor: pointer" valuemobile="'+data[i].mobile+'" onclick="Get.userInfo(this)">'+data[i].name+'</td>'
                +'<td>'+data[i].mobile+'</td>'
                +'<td>'+data[i].storeName+'</td>'
                +'<td>'+data[i].salesmanName+'</td>'
                +'<td>'+data[i].disease+'</td>'+'<td>'+data[i].hospital+'</td>';
            if(data[i].status == "unallot"){
                dataHtml += '<td style="color:#f00">未分诊</td>';
                if(data[i].visitCount > 0){
                    dataHtml += '<td>已回访/'+data[i].visitCount+'次</td>';
                }else{
                    dataHtml += '<td style="color: red">未回访</td>';
                }
                //dataHtml += '<td><a class="layui-btn layui-btn-mini caozuoBtn" valueid="'+data[i].id+'" valuestatus="'+data[i].status+'"><i class="iconfont icon-edit"></i> 操作</a>';
            }else if(data[i].status == "allot"){
                dataHtml += '<td>已分诊</td>';
                if(data[i].visitCount > 0){
                    dataHtml += '<td>已回访/'+data[i].visitCount+'次</td>';
                }else{
                    dataHtml += '<td style="color: red">未回访</td>';
                }
                //dataHtml += '<td><a class="layui-btn layui-btn-mini layui-btn-disabled caozuoBtn" disabled="disabled" valueid="'+data[i].id+'" valuestatus="'+data[i].status+'"><i class="iconfont icon-edit"></i> 操作</a>';
            }else{
                dataHtml += '<td>体验券</td>';
                if(data[i].visitCount > 0){
                    dataHtml += '<td>已回访/'+data[i].visitCount+'次</td>';
                }else{
                    dataHtml += '<td style="color: red">未回访</td>';
                }
                //dataHtml += '<td><a class="layui-btn layui-btn-mini layui-btn-disabled caozuoBtn" disabled="disabled" valueid="'+data[i].id+'" valuestatus="'+data[i].status+'"><i class="iconfont icon-edit"></i> 操作</a>';
            }

            /* if(data[i].status == "unallot"){
                 dataHtml += '<a class="layui-btn layui-btn-mini consultFen" style="display: none" valueid="'+data[i].id+'"><i class="iconfont icon-edit"></i> 分诊</a>' +
                     '<a class="layui-btn layui-btn-normal layui-btn-mini news_reset" style="display: none" valueid="'+data[i].id+'"><i class="layui-icon">&#xe600;</i> 编辑</a>';
             }*/
            dataHtml += '<td>' +
                '<a class="layui-btn layui-btn-mini" onclick="news_reset(this)" valueid="'+data[i].id+'" valuestatus="'+data[i].status+'"><i class="iconfont icon-edit"></i></a>' +
                '</td>';
            dataHtml +=  /*'<a class="layui-btn layui-btn-normal layui-btn-mini news_record_add" style="display: none" valueid="'+data[i].id+'"><i class="layui-icon">&#xe650;</i> 回访</a>' +*/
                '<td><a class="layui-btn layui-btn-normal layui-btn-mini news_reset_dohis" style="padding: 0" onclick="news_reset_dohis(this)" valueid="'+data[i].id+'"  valuemobile="'+data[i].mobile+'" valueusername="'+data[i].name+'"><i class="layui-icon" style="font-size: 19px !important;margin-right: 0">&#xe60a;</i></a>' +
                '<a class="layui-btn layui-btn-normal layui-btn-mini news_reset_recordhis" style="padding: 0 9px;" onclick="news_reset_recordhis(this)" valueid="'+data[i].id+'" patientid="'+data[i].patientId+'" valuemobile="'+data[i].mobile+'" valueusername="'+data[i].name+'">回访</a></td>'
                +'</tr>';
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
        content : "historyDo.html?id=" + id,
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
        content : "historyRecord.html?id=" + id + '&mobile=' + mobile + '&valueid='+valueid + '&v=7777',
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