var notPhoneCount = 0;
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
   // $('.adviosyCol').css('max-height',(document.documentElement.clientHeight - 100)/3);
   // $('.jiuzhenCol').css('max-height',(document.documentElement.clientHeight)/3);
   // $('.accessCol').css('max-height',(document.documentElement.clientHeight)/3);

	//查询
	function searchBtn(pageNumber) {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/customerService/getHistoryRecord.json";
        var data = {};

        data.patientId = getQueryString('id');
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
                    +'<td>'+data[i].storeName+'</td>'
                    +'<td title="'+data[i].brief+'">'+returnSubstring(data[i].brief)+'</td>'
                    +'<td>'+data[i].salesmanName+'</td>';
                if(data[i].status == "unallot"){
                    dataHtml += '<td style="color:#f00">未分诊</td>';
                }else if(data[i].status == "allot"){
                    dataHtml += '<td>已分诊</td>';
                }else if(data[i].status == "unchecked"){
                    dataHtml += '<td>未审核</td>';
                }else if(data[i].status == "notPass"){
                    dataHtml += '<td>被打回</td>';
                }else if(data[i].status == "coupon"){
                    dataHtml += '<td>体验券</td>';
                }else{
                    dataHtml += '<td></td>';
                }
                if(data[i].visitCount > 0){
                    dataHtml += '<td style="color: #00a2d4;cursor: pointer;" valueid="'+data[i].id+'" onclick="news_reset_recordhis(this)">已回访/'+data[i].visitCount+'次</td>';
                }else if(data[i].visitCount == 0){
                    dataHtml += '<td style="color: red">未回访</td>';
                }else{
                    dataHtml += '<td></td>';
                }
                if(data[i].nextAccessDate){
                    dataHtml += '<td>'+new Date(data[i].nextAccessDate).Format('yyyy-MM-dd')+'</td>';
                }else{
                    dataHtml += '<td></td>';
                }
                dataHtml += '<td><a class="layui-btn layui-btn-normal layui-btn-mini" style="padding: 0 9px;" onclick="addRecord(this)"  valueid="'+data[i].id+'">回访</a></td>';
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
                if(data[i].amount == '体验券（线下结算）'){
                    dataHtml +='<td>体验券</td>'
                }else{
                    dataHtml +='<td>'+returnProjectType(data[i].orderType)+'</td>'
                }
                if(data[i].userOfflineProjectId){
                    dataHtml += '<td style="color:#00a2d4;cursor: pointer;" valueuserOfflineProject="'+data[i].userOfflineProjectId+'" onclick="allOrderDetail(this)">'+data[i].projectName+'</td>'
                }else{
                    dataHtml +='<td>'+data[i].projectName+'</td>'
                }
                dataHtml +='<td>'+data[i].amount+'</td>'
                         +'<td>'+returnProjectNumber(data[i].number)+'</td>'
                if(data[i].orderType == 'offline'){
                    dataHtml += '<td>'+returnProjectVisitRecordStatus(data[i].visitRecordStatus)+'</td>';
                }else{
                    dataHtml += '<td>'+returnProjectOrderStatus(data[i].status)+'</td>';
                }
                if(data[i].source){
                    dataHtml += '<td>'+noData(data[i].source)+'</td>'
                }else{
                    dataHtml += '<td>e诺平台</td>'
                }
                dataHtml += '<td>'+noData(data[i].doctor)+'</td>'
                dataHtml += '<td>'+noData(data[i].doctorHelpmate)+'</td>'
                dataHtml += '<td>'+noData(data[i].nurse)+'</td>'
                dataHtml += '<td>'+noData(data[i].guestService)+'</td>'
                dataHtml += '<td>'+noData(data[i].creator)+'</td>'
                if(data[i].repeat == true){
                    dataHtml += '<td>复诊</td>'
                }else if(data[i].repeat == false){
                    dataHtml += '<td>初诊</td>'
                }else{
                    dataHtml += '<td>不明</td>'
                }
                dataHtml += '<td>'+noData(data[i].remark)+'</td>'
                dataHtml += '</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="15">暂无数据</td></tr>';
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
                if(data[i].platformStatus){
                    if(data[i].platformStatus == 'unConnect' || data[i].platformStatus == 'refuse'){
                        notPhoneCount++;
                    }
                }else if(data[i].hospitalStatus){
                    if(data[i].hospitalStatus == 'unConnect' || data[i].hospitalStatus == 'refuse'){
                        notPhoneCount++;
                    }
                }
                dataHtml += '<tr>'
                    +'<td>'+ new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss") +'</td>'
					+'<td>'+data[i].creator+'</td>'
                    +'<td>'+recordStatusHospital(data[i].hospitalStatus)+'</td>'
                    +'<td>'+recordStatusPlatform(data[i].platformStatus)+'</td>'
                    /*+'<td><input type="text" value="'+data[i].brief+'"/></td>'*/
                    +'<td>'+data[i].brief+'</td>'
               /* if(data[i].platformStatus){
                    dataHtml +='<td class="resetRecord" valueid="'+data[i].id+'" valuestatus="'+data[i].platformStatus+'" onclick="resetRecordOPen(this)">修改</td>';
                }else{
                    dataHtml +='<td></td>'
                }*/

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
            ajaxGetRetInfo(SERVER_ADDR + '/customerService/getAdvisoryDetail.json',{id:getQueryString('valueid')},function (retInfo) {
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
        form.render();
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
            var url = SERVER_ADDR + "/customerService/updateAdvisoryPatient";

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
            area: ['500px','550px'],
            title : "患者回访信息添加",
            type : 2,
            content : "recordAdd.html?id=" +getQueryString('valueid') + '&v=222',
            success : function(layero, index){
                //localStorage.setItem('allconsultPage',$('.layui-laypage-curr em').eq(1).text());
            }
        })

    });
})
function searchTab(type) {
    var type = type;
    var url = SERVER_ADDR + "/customerService/getPatientAccessDetail.json";
    var data = {};
    data.patientId = getQueryString('id');
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
function addRecord(obj) {
    var id = $(obj).attr('valueid');
    var index = layui.layer.open({
        area: ['500px','550px'],
        title : "患者回访信息添加",
        type : 2,
        content : "recordAdd.html?id=" +id + '&v=222',
        success : function(layero, index){
            //localStorage.setItem('allconsultPage',$('.layui-laypage-curr em').eq(1).text());
        }
    })
}
function resetRecordOPen(obj) {
    var prevConten = $(obj).prev().text();
    var prevStatus = $(obj).attr('valuestatus');
    switch (prevStatus){
        case '未接通':
            prevStatus = 'unConnect';
            break;
        case '拒接':
            prevStatus = 'refuse';
            break;
        case '有意向未到诊':
            prevStatus = 'INTENTIONALMISSVISIT';
            break;
        case '空号/停机':
            prevStatus = 'emptyNum';
            break;
        case '信息不符':
            prevStatus = 'infoError';
            break;
        case '院方未回访':
            prevStatus = 'hospitalUnAccess';
            break;
        case '跟踪复仿':
            prevStatus = 'hasAccess';
            break;
        case '暂停回访':
            prevStatus = 'pauseAccess';
            break;
        case '已成交':
            prevStatus = 'success';
            break;
        case undefined:
            prevStatus = '';
            break;
    }
    console.log(prevStatus);
    $(obj).prev().prev().html('<select class="prevStatus"> ' +
        '<option value="unConnect" title="unConnect">未接通</option> ' +
        '<option value="refuse" title="refuse">拒接</option> ' +
        '<option value="INTENTIONALMISSVISIT" title="INTENTIONALMISSVISIT">有意向未到诊</option> ' +
        '<option value="emptyNum" title="emptyNum">空号/停机</option> ' +
        '<option value="infoError" title="infoError">信息不符</option> ' +
        '<option value="hospitalUnAccess" title="hospitalUnAccess">院方未回访</option> ' +
        '<option value="success" title="success">已成交</option> ' +
        '<option value="hasAccess" title="hasAccess">跟踪复访</option> ' +
        '<option value="pauseAccess" title="pauseAccess">暂停回访</option> ' +
        '</select>');
    $('.prevStatus').val(prevStatus)
    $(obj).prev().html('<input class="briefInput" type="text" value="'+prevConten+'">');
    $(obj).attr('onclick','Get.resetRecord(this)');
    $(obj).text('确定');
}
function news_reset_recordhis(obj) {
    var id = $(obj).attr('valueid');
    var index = layui.layer.open({
        title : "回访信息",
        type : 2,
        area:['90%','80%'],
        content : "historyRecordAccess.html?id=" + id + '&v=222',
        success : function(layero, index){

        }
    })
}
var Get = {
    firstConcult: function () {
            var url = SERVER_ADDR + '/customerService/advisory/getPatientInfo.json';
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
            $('.name').text(noData(retInfo.data.name));
            $('.age').text(noData(retInfo.data.age));
            $('.mobile').text(getQueryString('mobile'));
            $('.sex').text(noData(retInfo.data.sex));
            $('.address').text(noData(retInfo.data.address));
            $('.job').text(noData(retInfo.data.job));/*'<span class="resetInfo">修改</span>';*/
            /*$(".newsName").val(retInfo.data.name);
            $(".sex").val(retInfo.data.sex);
            $(".age").val(retInfo.data.age);
            $(".newsAddress").val(retInfo.data.address);
            $(".job").val(retInfo.data.job);*/
        } else {
            alert(retInfo.data);
        }
    },
    resetRecord: function (obj) {
        var elThis = $(obj);
        var url = SERVER_ADDR + '/customerService/updateAccess';
        var Data = {};
        Data.id = elThis.attr('valueid');
        Data.brief = $('.briefInput').val();
        Data.platformStatus = $('.prevStatus').val();
        ajaxGetRetInfo(url, Data, this.resetRecordSuccess, '请求失败', 'POST', true, undefined);
    },
    resetRecordSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
           location.reload();
        } else {
            alert(retInfo.data);
        }
    }
}
