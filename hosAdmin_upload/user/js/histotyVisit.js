layui.use(['form','layer','jquery','element'],function(){
	var form = layui.form,
     element = layui.element;
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		$ = layui.jquery;
    /*element.on('collapse(fadeIn)', function(data){
        layer.msg('展开状态:'+ data.show);
    });*/
	//加载页面数据
    //Get.firstConcult();
    searchBtn();
	//查询
	function searchBtn(pageNumber) {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/hospital/reception/visitRecord/getListByUser.json";
        var data = {};

        data.userId = 3675//getQueryString('id');
       /* data.mobile = getQueryString('mobile');*/
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            layer.close(index);
            if(retInfo.success){
                accessNewsList(retInfo.data);

            }else{
                layer.alert(retInfo.data,{icon:5});
			}
        },'请求失败', 'GET', undefined, undefined);
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
                switch (data[i].hospitalStatus){
                    case 'unAccess':
                        data[i].hospitalStatus = '未回访';
                        break;
                    case 'reservation':
                        data[i].hospitalStatus = '已预约';
                        break;
                    case 'visit':
                        data[i].hospitalStatus = '已到诊';
                        break;
                    case 'success':
                        data[i].hospitalStatus = '已成交';
                        break;
                    case 'faild':
                        data[i].hospitalStatus = '到诊未成交';
                        break;
                    case 'repeat':
                        data[i].hospitalStatus = '重单';
                        break;
                    case 'unContact':
                        data[i].hospitalStatus = '无法联系';
                        break;
                    case 'refuse':
                        data[i].hospitalStatus = '拒接';
                        break;
                    case 'emptyNum':
                        data[i].hospitalStatus = '空号/停机';
                        break;
                    case 'infoError':
                        data[i].hospitalStatus = '信息不符';
                        break;
                    case 'hasAccess':
                        data[i].hospitalStatus = '需要回访';
                        break;
                    case undefined:
                        data[i].hospitalStatus = '';
                        break;
                }
                switch (data[i].platformStatus){
                    case 'unConnect':
                        data[i].platformStatus = '未接通';
                        break;
                    case 'refuse':
                        data[i].platformStatus = '拒接';
                        break;
                    case 'emptyNum':
                        data[i].platformStatus = '空号/停机';
                        break;
                    case 'infoError':
                        data[i].platformStatus = '信息不符';
                        break;
                    case 'hospitalUnAccess':
                        data[i].platformStatus = '院方未回访';
                        break;
                    case 'hasAccess':
                        data[i].platformStatus = '跟踪复仿';
                        break;
                    case 'pauseAccess':
                        data[i].platformStatus = '暂停回访';
                        break;
                    case 'success':
                        data[i].platformStatus = '已成交';
                        break;
                    case undefined:
                        data[i].platformStatus = '';
                        break;
                }
                dataHtml += '<tr>'
                    +'<td>'+ new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss") +'</td>'
					+'<td>'+data[i].creator+'</td>'
                    +'<td>'+data[i].hospitalStatus+'</td>'
                    +'<td>'+data[i].platformStatus+'</td>'
                    /*+'<td><input type="text" value="'+data[i].brief+'"/></td>'*/
                    +'<td>'+data[i].brief+'</td>'
                    +'<td class="resetRecord" valueid="'+data[i].id+'" valuestatus="'+data[i].platformStatus+'" onclick="resetRecordOPen(this)">修改</td>';
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
            content : "recordAdd.html?id=" +getQueryString('valueid'),
            success : function(layero, index){
                //localStorage.setItem('allconsultPage',$('.layui-laypage-curr em').eq(1).text());
            }
        })

    });
})
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
            var url = SERVER_ADDR + '/admin/advisory/getPatientInfo.json';
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
            $('.layui-colla-content p').html('姓名:'+retInfo.data.name + '' + ' &nbsp;&nbsp;&nbsp;&nbsp;手机号:' + getQueryString('mobile') + ' &nbsp;&nbsp;&nbsp;&nbsp;年龄:' + retInfo.data.age + ' &nbsp;&nbsp;&nbsp;&nbsp;性别:' + retInfo.data.sex + ' &nbsp;&nbsp;&nbsp;&nbsp;职业:' + retInfo.data.job + ' &nbsp;&nbsp;&nbsp;&nbsp;地址:' + retInfo.data.address + '<span class="resetInfo">修改</span>');
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
