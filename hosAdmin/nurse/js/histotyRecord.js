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
        var url = SERVER_ADDR + "/hospital/user/getUserDetail.json";
        var data = {};
        data.hospitalUserId = getQueryString('id');
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            layer.close(index);
            if(retInfo.success){
                accessNewsList(retInfo.data);
                //advisoryNewsList(retInfo.data);
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
                    +'<td>'+data[i].salesmanName+'</td>';
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
        data = data.visitRecords;
        var dataHtml = '';
        if(data && data.length != 0){
            for(var i=0;i<data.length;i++){
                var number;
                if (data[i].number) {
                    if (data[i].number.split('-')[2] == undefined) {
                        var split2 = '';
                    } else {
                        var split2 = data[i].number.split('-')[2];
                    }
                    number = data[i].number.split('-')[0] + '<span style="color: #009688;font-weight:600">' + data[i].number.split('-')[1] + '</span>' + split2;
                } else {
                    number = '无'
                }
                if(data[i].status == 'wait'){
                    data[i].status = '候诊';
                }else if(data[i].status == 'loading'){
                    data[i].status = '治疗中';
                }else if(data[i].status == 'leave'){
                    data[i].status = '弃诊';
                }else if(data[i].status == 'complete'){
                    data[i].status = '完成';
                }else if(data[i].status == 'uncheck'){
                    data[i].status = '<span style="color: #FFB800">审核中</span>';
                }else if(data[i].status == 'registration'){
                    data[i].status = '<span style="color: #d25d12">挂号中</span>';
                }
                dataHtml += '<tr>'
                    +'<td>'+ new Date(data[i].createDate).Format("yyyy-MM-dd") +'</td>';
                if(data[i].type == "coupon"){
                    dataHtml += '<td>体验券</td>'
                }else if(data[i].type == "product"){
                    dataHtml += '<td>特价项目</td>'
                }else if(data[i].type == "doctor"){
                    dataHtml += '<td>医生</td>'
                }else{
                    dataHtml += '<td>无</td>'
                }
                dataHtml+='<td>'+noData(data[i].name)+'</td>'
                    +'<td>'+noData(data[i].hospital)+'</td>'
                    +'<td>'+noData(data[i].doctor)+'</td>'
                    +'<td>'+noData(data[i].doctorHelpmate)+'</td>'
                    +'<td>'+noData(data[i].source)+'</td>'
                    +'<td>'+noData(data[i].creator)+'</td>'
                if(data[i].repeat == true){
                    dataHtml += '<td>复诊</td>'
                }else if(data[i].repeat == false){
                    dataHtml += '<td>初诊</td>'
                }else{
                    dataHtml += '<td>不明</td>'
                }
                dataHtml += '<td>'+number+'</td>'
                    +'<td>'+data[i].status+'</td>';
                if(data[i].userOffLineProjectId){
                    dataHtml += '<td valueuserOfflineProject="'+data[i].userOffLineProjectId+'" onclick="allOrderDetail(this)" style="color: #2299ee;cursor: pointer;">查看清单</td>'
                }else{
                    if(data[i].status == '完成' && data[i].repeat == true){
                        dataHtml += '<td onclick="fuzhen(this)" valuestatus="complete" valueid="'+data[i].id+'" style="color: #2299ee;cursor: pointer;">复诊情况</td>'
                    }else{
                        dataHtml += '<td>暂未开单</td>'
                    }
                }
                dataHtml+='<td>'+noData(data[i].brief)+'</td>';
                dataHtml += '</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="11">暂无数据</td></tr>';
        }
        return dataHtml;
    }
	function accessNewsList(retInfo){
        $(".news_content").html(renderDate(retInfo));
	}
    function renderDate(data){
	    console.log(data)
	    data = data.accesses;
        var dataHtml = '';

        if(data && data.length != 0){
            for(var i=0;i<data.length;i++){
                dataHtml += '<tr>'
                    +'<td>'+ new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss") +'</td>'
					+'<td>'+data[i].operator+'</td>'
                    +'<td>'+recordStatusHospital(data[i].status)+'</td>'
                    /*+'<td><input type="text" value="'+data[i].brief+'"/></td>'*/
                    +'<td>'+data[i].content+'</td>'
                    /*+'<td class="resetRecord" valueid="'+data[i].id+'" valuestatus="'+data[i].platformStatus+'" onclick="resetRecordOPen(this)">修改</td>';*/
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
            area: ['500px','550px'],
            title : "患者回访信息添加",
            type : 2,
            content : "recordAdd.html?id=" +getQueryString('id') + '&v=1134',
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
        case '跟踪复访':
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
var Get = {
    firstConcult: function () {
            var url = SERVER_ADDR + '/hospital/doctor/index/getUserInfo.json';
            var Data = {};
            Data.mobile = getQueryString('mobile');
            ajaxGetRetInfo(url, Data, this.firstConcultSuccess, '请求失败', 'GET', true, undefined);
    },
    firstConcultSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            //返回填充
            $('.span').text(retInfo.data.user.fullname);
            if(retInfo.data.user.sex == 'man'){
                retInfo.data.user.sex = '男';
            }else if(retInfo.data.user.sex == 'woman'){
                retInfo.data.user.sex = '女';
            }else if(retInfo.data.user.sex == 'unknown'){
                retInfo.data.user.sex = '不详';
            }
            if(!retInfo.data.user.birthday){
                var birthday = '无'
            }else{
                var birthday = new Date(retInfo.data.user.birthday).Format("yyyy-MM-dd")
            }
            $('.layui-colla-content p').html('<strong>姓名:</strong>'+retInfo.data.user.fullname + '' + ' &nbsp;&nbsp;&nbsp;&nbsp;<strong>手机号:</strong>' + getQueryString('mobile') + ' &nbsp;&nbsp;&nbsp;&nbsp;<strong>出生日期:</strong>' +  birthday + ' &nbsp;&nbsp;&nbsp;&nbsp;<strong>性别:</strong>' + retInfo.data.user.sex + '  &nbsp;&nbsp;&nbsp;&nbsp;<strong>身份证号:</strong>' + noData(retInfo.data.user.idCard) + '<br>');
            if(retInfo.data.user.members){
                retInfo.data.user.members.forEach(function (value) {
                    console.log(value)
                    $('.layui-colla-content p').append('<strong>'+value.appellation+'</strong>' + '：' +  value.fullName + '--'  +  value.mobile + ' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');

                })
            }
        } else {
            alert(retInfo.data);
        }
    },
    resetRecord: function (obj) {
        var elThis = $(obj);
        var url = SERVER_ADDR + '/admin/access/updateAccess';
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
