layui.use(['form','layer','jquery','laypage','upload'],function(){
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
        upload = layui.upload;
		laypage = layui.laypage;
		$ = layui.jquery;

    //指定允许上传的文件类型
    upload.render({
        elem: '#addTemplate'
        ,url: SERVER_ADDR + '/hospital/medicalRecordTemplate/importDiagnose'
        ,accept: 'file' //普通文件
        ,done: function(res){
            console.log(res)
            if(res.success == true){
                layer.msg('上传模板成功');
                setTimeout(function () {
                    window.location.reload();
                },1000)

            }else{
                alert(res.data);
            }
        }
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
    searchBtn(localStorage.getItem('allPatientTemplate') || 1);
    localStorage.removeItem('allPatientTemplate');
	//查询
	$(".search_btn").click(function(){
        searchBtn(1);
	})
	function searchBtn(pageNumber) {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/hospital/doctor/index/getDoctorDiseaseCourseRecord.json";
        var data = {};
        data.keyword = $(".newsName").val();
        data.type = 'PERSONAL';
        data.pageNumber = pageNumber;
        data.pageSize = 15;
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
    //添加模板
    $(".addTemplateOne").click(function(){
        //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});

        var index = layui.layer.open({
            title : "添加模板",
            type : 2,
            area:['60%','80%'],
            content : "addPatientTemplate.html",
            success : function(layero, index){
                localStorage.setItem('allPatientTemplate',$('.layui-laypage-curr em').eq(1).text());
            }
        })
    })
	function newsList(retInfo,totalCount,current){
		//渲染数据
        $(".news_content").html(renderDate(retInfo));
		//分页
		var nums = 15; //每页出现的数据量
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
                    +'<td>'+data[i].createDate+'</td>'
                    +'<td  style="color: #2299ee;cursor: pointer" valuemobile="'+data[i].mobile+'" valueid="'+data[i].hospitalUserId+'" onclick="visitUserInfo(this)">'+data[i].fullName+'</td>'
                    +'<td>'+data[i].mobile+'</td>'
                if(data[i].type == 'FIRSTVISIT'){
                    dataHtml += '<td>首诊记录</td>'
                }else if(data[i].type == 'AGAINVISIT'){
                    dataHtml += '<td>复诊记录</td>'
                }else if(data[i].type == 'OPERATION'){
                    dataHtml += '<td>手术记录</td>'
                }else if(data[i].type == 'TREATMENT'){
                    dataHtml += '<td>治疗记录</td>'
                }else{
                    dataHtml += '<td></td>'
                }
                dataHtml +='<td>'+noData(data[i].record)+'</td>'
            }
        }else{
            dataHtml = '<tr><td colspan="11">暂无数据</td></tr>';
        }
        return dataHtml;
    }
})

//用户信息
function visitUserInfo(obj){
    var mobile = $(obj).attr('valuemobile');
    var id = $(obj).attr('valueid');
    console.log(id)
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
//修改项目信息
function resetTemplate(obj) {
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var id = $(obj).attr('valueid');
    console.log(id)
    var index = layui.layer.open({
        title : "修改模板",
        type : 2,
        area:['60%','80%'],
        content : "addPatientTemplate.html?valueid=" + id + '&action=reset',
        success : function(layero, index){

        }
    })
}
function delTemplate(obj) {
    var elThisid = $(obj).attr('valueid');
    layer.confirm('确认删除？', {
        btn: ['删除','取消'], //按钮
        icon:3
    }, function(){
        var url = SERVER_ADDR + "/hospital/medicalRecordTemplate/deleteMedicalRecordTemplate";
        var data = {};
        data.id = elThisid;
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                localStorage.setItem('allPatientTemplate',$('.layui-laypage-curr em').eq(1).text());
                layer.msg(retInfo.data);
                setTimeout(function () {
                    window.location.reload();
                },1200);
            }else{
                layer.alert(retInfo.data,{icon:5})
            }
        },'请求失败', 'POST', undefined, undefined);
    }, function(){

    });
}