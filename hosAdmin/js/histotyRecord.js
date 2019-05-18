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
                    +'<td>'+data[i].hospital+'</td>'
                    +'<td>'+data[i].projectName+'</td>'
                    +'<td>'+data[i].amount+'</td>';
                if(data[i].amount == '体验券（线下结算）'){
                    if(data[i].erStatus == 'wait'){
                        dataHtml += '<td>未预约</td>';
                    }else if(data[i].erStatus == 'success'){
                        dataHtml += '<td>已预约</td>';
                    }else if(data[i].erStatus == 'completed'){
                        dataHtml += '<td>已完成</td>';
                    }else if(data[i].erStatus == 'invalid'){
                        dataHtml += '<td>失效</td>';
                    }else{
                        dataHtml += '<td></td>';
                    }
                }else{
                    if(data[i].status == 'waitConfirm'){
                        dataHtml += '<td>待确认(已支付)</td>';
                    }else if(data[i].status == 'completed'){
                        dataHtml += '<td>已完成</td>';
                    }else if(data[i].status == 'handle'){
                        dataHtml += '<td>已结算</td>';
                    }else if(data[i].status == 'waitPaid'){
                        dataHtml += '<td>待支付</td>';
                    }else if(data[i].status == 'cancelled'){
                        dataHtml += '<td>已取消</td>';
                    }else{
                        dataHtml += '<td></td>';
                    }
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
                if(data[i].createDate != undefined){
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
            content : "recordAdd.html?id=" +getQueryString('dataid') + '&advisoryid='+ getQueryString('id') + '&v=1134',
            success : function(layero, index){
                //localStorage.setItem('allconsultPage',$('.layui-laypage-curr em').eq(1).text());
            }
        })

    });
})
function searchTab(type) {
    var type = type;
    var url = SERVER_ADDR + "/hospital/allot/getPatientAccessDetail.json";
    var data = {};
    data.patientId = getQueryString('patientid');
    data.type = type;
    ajaxGetRetInfo(url,data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            if(type == 'hospital'){
                accessNewsHospitalList(retInfo.data);
                $('.hospitalAccess').attr('onclick','')
            }else if(type == 'platform'){
                accessNewsPlatfromList(retInfo.data);
                $('.platformAccess').attr('onclick','')
            }
        }else{
            layer.alert(retInfo.data,{icon:5});
        }
    },'请求失败', 'GET', undefined, undefined);
}
function accessNewsPlatfromList(retInfo){
    $(".news_content_platfrom").html(renderPlatfromDate(retInfo,'platfrom'));
}
function accessNewsHospitalList(retInfo){
    $(".news_content_hospital").html(renderPlatfromDate(retInfo,'hospital'));
}
function renderPlatfromDate(data,type){
    console.log(data)
    var dataHtml = '';
    if(data && data.length != 0){
        for(var i=0;i<data.length;i++){
            dataHtml += '<tr>'
                +'<td>'+ new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss") +'</td>'
                +'<td>'+data[i].creator+'</td>';
            if(type == 'platfrom'){
                dataHtml += '<td>'+recordStatusPlatform(data[i].platformStatus)+'</td>'
            }else if(type == 'hospital'){
                dataHtml += '<td>'+recordStatusHospital(data[i].hospitalStatus)+'</td>'
            }
            dataHtml +='<td>'+data[i].brief+'</td>'
            dataHtml += '</tr>';
        }
    }else{
        dataHtml = '<tr><td colspan="8">暂无数据</td></tr>';
    }
    return dataHtml;
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
