layui.use(['form','layer','jquery','element'],function(){
	var form = layui.form,
     element = layui.element;
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		$ = layui.jquery;
    /*element.on('collapse(fadeIn)', function(data){
        layer.msg('展开状态:'+ data.show);
    });*/
	//加载页面数据
    Get.firstConcult();
    searchBtn();
	//查询
	function searchBtn(pageNumber) {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/hospital/allot/getHistoryRecord.json";
        var data = {};

        data.patientId = getQueryString('patientid');
        data.mobile = getQueryString('mobile');
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            layer.close(index);
            if(retInfo.success){
                accessNewsList(retInfo.data);
                advisoryNewsList(retInfo.data);
                diagnosisNewsList(retInfo.data);
            }else{
                layer.alert(retInfo.data,{icon:5});
			}
        },'请求失败', 'GET', undefined, undefined);
    }
    function advisoryNewsList(retInfo){
        $(".news_contentAdvisory").html(renderDateAdvisory(retInfo)); //咨询
        $(".news_contentAdvisoryChange").html(renderDateAdvisoryFirst(retInfo));//咨询变更
    }
    function renderDateAdvisory(data){
        console.log(data)
        data = data.advisoryJsons;
        $('.firstAdvisory').text(data[0].salesmanName + '-' + new Date(data[0].createDate).Format("yyyy-MM-dd"));
        var dataHtml = '';
        if(data && data.length != 0){
            for(var i=0;i<data.length;i++){
                dataHtml += '<tr>'
                    +'<td>'+ new Date(data[i].createDate).Format("yyyy-MM-dd") +'</td>'
                    +'<td>'+data[i].hospital+'</td>'
                    +'<td>'+data[i].disease+'</td>'
                    +'<td>'+noData(data[i].brief)+'</td>';
                if(data[i].hospital == '本院'){
                    if(data[i].visitCount > 0){
                        dataHtml += '<td valueid="'+data[i].id+'">已回访/'+data[i].visitCount+'次</td>';
                    }else if(data[i].visitCount == 0){
                        dataHtml += '<td style="color: red">未回访</td>';
                    }else{
                        dataHtml += '<td></td>';
                    }
                }else{
                    dataHtml += '<td>****</td>';
                }
                dataHtml += '</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="8">暂无数据</td></tr>';
        }
        return dataHtml;
    }
    function renderDateAdvisoryFirst(data){
        console.log(data)
        data = data.advisoryJsons;
        $('.firstAdvisory').text(data[0].salesmanName + '-' + new Date(data[0].createDate).Format("yyyy-MM-dd"));
        var dataHtml = '';
        if(data && data.length != 0){
            for(var i=0;i<data.length;i++){
                dataHtml += '<tr>'
                    +'<td>'+ new Date(data[i].createDate).Format("yyyy-MM-dd") +'</td>'
                    +'<td>'+data[i].salesmanName+'</td>';
                dataHtml += '</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="8">暂无数据</td></tr>';
        }
        return dataHtml;
    }
    function diagnosisNewsList(retInfo){
        $(".news_contentDiagnosis").html(renderDateDiagnosis(retInfo));
    }
    function renderDateDiagnosis(data){
        console.log(data)
        data = data.diagnosisInfo;
        var dataHtml = '';
        if(data && data.length != 0){
            for(var i=0;i<data.length;i++){
                dataHtml += '<tr>'
                    +'<td>'+ new Date(data[i].createDate).Format("yyyy-MM-dd") +'</td>'
                    +'<td>'+data[i].hospital+'</td>';
                if(data[i].userOfflineProjectId){
                    dataHtml += '<td style="color:#00a2d4;cursor: pointer;" valueuserOfflineProject="'+data[i].userOfflineProjectId+'" onclick="allOrderDetail(this)">'+data[i].projectName+'</td>'
                }else{
                    dataHtml +='<td>'+data[i].projectName+'</td>'
                }
                dataHtml +='<td>'+data[i].amount+'</td>';
                if(data[i].orderType == 'offline'){
                    dataHtml += '<td>'+returnProjectVisitRecordStatus(data[i].visitRecordStatus)+'</td>';
                }else{
                    dataHtml += '<td>'+returnProjectOrderStatus(data[i].status,data[i].isReservation)+'</td>';
                }
                dataHtml += '</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="8">暂无数据</td></tr>';
        }
        return dataHtml;
    }
	function accessNewsList(retInfo){
        $(".news_content").html(renderDate(retInfo));
	}
    function renderDate(data){
	    console.log(data)
	    data = data.accessJsons;
        var dataHtml = '';

        if(data && data.length != 0){
            for(var i=0;i<data.length;i++){
                dataHtml += '<tr>'
                    +'<td>'+ new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss") +'</td>'
					+'<td>'+data[i].creator+'</td>'
                    +'<td>'+recordStatusHospital(data[i].hospitalStatus)+'</td>'
                    +'<td>'+recordStatusPlatform(data[i].platformStatus)+'</td>'
                if(data[i].nextAccessDate){
                    dataHtml +='<td>'+new Date(data[i].nextAccessDate).Format('yyyy-MM-dd')+'</td>'
                }else{
                    dataHtml +='<td></td>'
                }
                dataHtml +='<td>'+data[i].brief+'</td>';
                dataHtml += '</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="8">暂无数据</td></tr>';
        }
        return dataHtml;
    }
    //操作
    $("body").on("click",".changeConsult",function(){
        /*$('.news_record_add,.consultFen,.news_reset').attr('valueid',$(this).attr('valueid'));
        var valuestatus = $(this).attr('valuestatus');
        if(valuestatus == 'unallot'){
            $('.consultFen,.news_reset').show();
        }else{
            $('.consultFen,.news_reset').hide();
        }*/
        var index = layui.layer.open({
            area: ['470px','400px'],
            title : "咨询变更信息",
            type : 1,
            content : $('.changeOpen'),
            success:function(){
                searchBtn();
            }
        })
    });
    //个人信息修改
    $("body").on("click",".resetInfo",function(){
        /*$('.news_record_add,.consultFen,.news_reset').attr('valueid',$(this).attr('valueid'));
        var valuestatus = $(this).attr('valuestatus');
        if(valuestatus == 'unallot'){
            $('.consultFen,.news_reset').show();
        }else{
            $('.consultFen,.news_reset').hide();
        }*/
        var index = layui.layer.open({
            area: ['470px','400px'],
            title : "患者信息修改",
            type : 1,
            content : $('.resetInfoOpen'),
            success:function(){
                //searchBtn();
                getPersonInfo();
            }
        })
    });
    function getPersonInfo() {
            ajaxGetRetInfo(SERVER_ADDR + '/admin/advisory/getDetail.json',{id:getQueryString('valueid')},function (retInfo) {
                console.log(retInfo)
                if(retInfo.success){
                    addResetTable(retInfo.data);
                }else{
                    layer.alert(retInfo.data,{icon:5})
                }
                //form.render('select', 'from');//更新
            },'请求失败', 'GET', undefined, undefined);
    }

    function addResetTable(retInfo) {
        $(".newsName").val(retInfo.username);
        $(".age").val(retInfo.age);
        $(".sex").val(retInfo.sex);
        form.render('select', 'sex');
        $(".newsJob").val(retInfo.job);
        $(".newsAddress").val(retInfo.address);

    }
    var addNews = {};
    form.on("submit(resetInfoBtn)",function(data){
        addNews.name = $(".newsName").val();
        addNews.id = getQueryString('valueid');
        addNews.sex = $(".sex").val();
        addNews.age = $(".age").val();
        addNews.job = $(".newsJob").val();
        addNews.address = $(".newsAddress").val();
        console.log(addNews);

            addNews.id = getQueryString('id');
            var url = SERVER_ADDR + "/admin/advisory/updatePatient";

        var index = layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        ajaxGetRetInfo(url,addNews,function (retInfo) {
            console.log(retInfo)
            layer.close(index);
            layer.msg(retInfo.data);
            if(retInfo.success){
                layer.closeAll("iframe");
                location.reload();
            }else{
                layer.alert(retInfo.data,{icon:5})
            }
            //form.render('select', 'from');//更新
        },'请求失败', 'POST', undefined, undefined);
        //return;
        //弹出loading
        return false;
    })
    //添加回访
    $("body").on("click",".news_record_add",function(){
        //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
        var index = layui.layer.open({
            area: ['500px','500px'],
            title : "患者回访信息添加",
            type : 2,
            content : "recordAddShuju.html?id=" +getQueryString('dataid') + '&advisoryid='+ getQueryString('id') + '&v=1134',
            success : function(layero, index){
                //localStorage.setItem('allconsultPage',$('.layui-laypage-curr em').eq(1).text());
            }
        })

    });
})
function allOrderDetail(obj) {
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var valueuserOfflineProject = $(obj).attr('valueuserOfflineProject');
    var index = layui.layer.open({
        title : "项目清单",
        type : 2,
        area: ['90%','550px'],
        content : 'sureOrderPrint.html?id=' + valueuserOfflineProject,
        success : function(layero, index){

        },
        cancel: function(index, layero){
            layui.layer.close(index)
            return false;
        }
    })
}
var Get = {
    firstConcult: function () {
            var url = SERVER_ADDR + '/hospital/allot/getPatientInfo.json';
            var Data = {};
            Data.mobile = getQueryString('mobile');
            ajaxGetRetInfo(url, Data, this.firstConcultSuccess, '请求失败', 'GET', true, undefined);
    },
    firstConcultSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            //返回填充
            $('.span').text(retInfo.data.name);
            if(retInfo.data.sex == 'man'){
                retInfo.data.sex = '男';
            }else if(retInfo.data.sex == 'woman'){
                retInfo.data.sex = '女';
            }else if(retInfo.data.sex == 'unknown'){
                retInfo.data.sex = '不详';
            }
            if(!retInfo.data.job){
                retInfo.data.job = '';
            }
            if(!retInfo.data.address){
                retInfo.data.address = '';
            }
            $('.layui-colla-content p').html('姓名:'+retInfo.data.name + '' + ' &nbsp;&nbsp;&nbsp;&nbsp;手机号:' + getQueryString('mobile') + ' &nbsp;&nbsp;&nbsp;&nbsp;年龄:' + retInfo.data.age + ' &nbsp;&nbsp;&nbsp;&nbsp;性别:' + retInfo.data.sex + ' &nbsp;&nbsp;&nbsp;&nbsp;职业:' + retInfo.data.job + ' &nbsp;&nbsp;&nbsp;&nbsp;地址:' + retInfo.data.address + '<!--<span class="resetInfo">修改</span>-->');
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
