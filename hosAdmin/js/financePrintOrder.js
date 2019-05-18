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
        var url = SERVER_ADDR + "/hospital/visit/visitRecord/getFinanceDetail.json";
        var data = {};

        data.id = getQueryString('id');
        //data.mobile = getQueryString('mobile');
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            layer.close(index);
            if(retInfo.success){
                accessNewsList(retInfo.data);
                //advisoryNewsList(retInfo.data);
                //diagnosisNewsList(retInfo.data);
            }else{
                layer.alert(retInfo.data,{icon:5});
			}
        },'请求失败', 'GET', undefined, undefined);
    }
   /* function advisoryNewsList(retInfo){
        $(".news_contentAdvisory").html(renderDateAdvisory(retInfo)); //咨询
        $(".news_contentAdvisoryChange").html(renderDateAdvisoryFirst(retInfo));//咨询变更
    }*/
    /*function renderDateAdvisory(data){
        console.log(data)
        data = data.advisoryJsons;
        $('.firstAdvisory').text(data[0].salesmanName + '-' + new Date(data[0].createDate).Format("yyyy-MM-dd"));
        var dataHtml = '';
        if(data && data.length != 0){
            for(var i=0;i<data.length;i++){
                dataHtml += '<tr>'
                    +'<td>'+ new Date(data[i].createDate).Format("yyyy-MM-dd") +'</td>'
                    +'<td>'+data[i].hospital+'</td>'
                    +'<td>'+data[i].disease+'</td>';
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
    }*/
    /*function renderDateDiagnosis(data){
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
                dataHtml += '</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="8">暂无数据</td></tr>';
        }
        return dataHtml;
    }*/
	function accessNewsList(retInfo){
	    $('.yingfu').text(retInfo.amount)
        $(".news_content").html(renderDate(retInfo));
	}
    function renderDate(data){
	    console.log(data)
	    data = data.financeDetail;
        var dataHtml = '';

        if(data && data.length != 0){
            for(var i=0;i<data.length;i++){
                dataHtml += '<tr>'
                    +'<td>'+noData(data[i].userName)+'</td>'
                    +'<td>'+noData(data[i].mobile)+'</td>'
                    +'<td>'+noData(data[i].name)+'</td>'
                    /* +'<td>'+noData(data[i].category)+'</td>'*/
                    +'<td>'+noData(data[i].modelNo)+'</td>'
                    /*+'<td>'+noData(data[i].spec)+'</td>'
                    +'<td>'+noData(data[i].unit)+'</td>'*/
                    +'<td>'+noData(data[i].originalPrice)+'</td>'
                    +'<td>'+noData(data[i].price)+'</td>'
                    +'<td>'+noData(data[i].paidAmount)+'</td>'
                    +'<td>'+noData(data[i].quantity)+'</td>'
                    +'<td>'+noData(data[i].day)+'</td>'
                    +'<td>'+noData(data[i].result)+'</td>'
                    +'<td>'+noData(data[i].doctor)+'</td>'
                    +'<td>'+noData(data[i].receiver)+'</td>'
                dataHtml += '</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="12">暂无数据</td></tr>';
        }
        return dataHtml;
    }

    var addNews = {};
    form.on("submit(resetInfoBtn)",function(data){
        doPrint();
        addNews.name = $(".newsName").val();
        addNews.id = getQueryString('valueid');
        addNews.sex = $(".sex").val();
        addNews.age = $(".age").val();
        addNews.job = $(".newsJob").val();
        addNews.address = $(".newsAddress").val();
        addNews.payType = $('input[type="radio"][name="sex"]:checked')
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
})

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
function printAjax() {
    var addNews = {};
    //addNews.name = $(".newsName").val();
    if($('input[type="radio"][name="sex"]:checked').length == 0){
        layer.alert('请选择支付方式',{icon:3});
        return;
    }
    addNews.id = getQueryString('id');
    addNews.payMethod = $('input[type="radio"][name="sex"]:checked').val();
    var url = SERVER_ADDR + "/hospital/visit/visitRecord/confirm";
    var index = layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
    ajaxGetRetInfo(url,addNews,function (retInfo) {
        console.log(retInfo)
        layer.close(index);
        layer.msg('开始打单');
        if(retInfo.success){
            layer.closeAll("iframe");
            doPrint();
        }else{
            layer.alert(retInfo.data,{icon:5})
        }
    },'请求失败', 'POST', undefined, undefined);
}
function doPrint() {
    bdhtml = window.document.body.innerHTML;
    sprnstr = "<!--startprint-->"; //开始打印标识字符串有17个字符
    eprnstr = "<!--endprint-->"; //结束打印标识字符串
    prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 17); //从开始打印标识之后的内容
    prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr)); //截取开始标识和结束标识之间的内容
    window.document.body.innerHTML = prnhtml; //把需要打印的指定内容赋给body.innerHTML
    window.print(); //调用浏览器的打印功能打印指定区域
    window.document.body.innerHTML = bdhtml; // 最后还原页面
}
