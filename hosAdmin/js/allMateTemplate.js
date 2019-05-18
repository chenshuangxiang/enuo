var tabledata = [];
var form
layui.use(['form','layer','jquery','laypage','upload','table'],function(){
	 form = layui.form,
        table = layui.table,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
        upload = layui.upload;
		laypage = layui.laypage;
		$ = layui.jquery;

    var importUrl;
    if(indexOfMedicalcare()){  //是医保项目
        importUrl = SERVER_ADDR + '/hospital/materialMedicalcareTemplate/import';
        $('.cite').text('医保品名模板');
    }else{
        importUrl = SERVER_ADDR + '/hospital/materialTemplate/import';
    }
    //指定允许上传的文件类型
    upload.render({
        elem: '#addMateTemplate'
        ,url: importUrl
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
    toAllFirstTopTab('.templateLi','.toTemplateBtn');
   /* form.on('select(newsHos)', function(data){  //根据医院获取病种
        getFk(form,data.elem[data.elem.selectedIndex].title);
    });*/
	//加载页面数据
	var newsData = '';
    searchBtn(localStorage.getItem('allMateTemplate') || 1);
    localStorage.removeItem('allMateTemplate');
	//查询
	$(".search_btn").click(function(){
        searchBtn(1);
	})
    form.on('checkbox(choose)', function(data){
        console.log(data.elem); //得到checkbox原始DOM对象
        console.log(data.elem.checked); //是否被选中，true或者false
        console.log(data.value); //复选框value值，也可以通过data.elem.value得到
        console.log(data.othis); //得到美化后的DOM对象
    });
    $(".resetDiscount").click(function(){
       /* var checkStatus = table.checkStatus('checked')
            ,data = checkStatus.data;
        console.log(checkStatus);
        */
       if($("input:checkbox[name='checked']:checked").length == 0){
           layer.msg('请勾选要更改的数据');
           return;
       }
       var ids = [];
        $("input:checkbox[name='checked']:checked").each(function () {
           console.log($(this).attr('valueid'))
            ids.push($(this).attr('valueid'));
        });
        ids = ids.join(',');
        console.log(ids);
       /* layer.prompt({title: '请输入折扣率，并确认', formType: 1}, function(pass, index){
            layer.close(index);
            console.log(pass);
        });*/
        var index = layer.open({
            type: 1 //Page层类型
            //,area: ['500px', '300px']
            ,btn:["确定","取消"]
            ,title: '请输入折扣率，并确认'
            ,skin: 'layui-layer-prompt'
            ,content: "<div class=''><input type='number' style='display: inline-block;width: 87%;' class='layui-layer-input' value='' placeholder='请输入折扣率'><span>%</span></div>"
            ,yes: function(index, layero){
                //按钮【按钮一】的回调
                if($(layero).find("input[type='number']").val() == ''){
                    layer.msg('请输入折扣率');
                    return false;
                }else {
                    updateDiscount(ids,$(layero).find("input[type='number']").val())
                }
            }
        });
    });
    function updateDiscount(ids,number) {
        var url;
        if(indexOfMedicalcare()) {  //是医保项目
            url = SERVER_ADDR + "/hospital/materialMedicalcareTemplate/updateDiscount";
        }else{
            url = SERVER_ADDR + "/hospital/materialTemplate/updateDiscount";
        }
        var data = {};
        data.ids = ids;
        data.discount = number;
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                localStorage.setItem('allMateTemplate',$('.layui-laypage-curr em').eq(1).text());
                layer.msg('更新成功');
                setTimeout(function () {
                    window.location.reload();
                },1000)

            }else{
                layer.alert(retInfo.data,{icon:5});
            }
        },'请求失败', 'POST', undefined, undefined);
    }
	function searchBtn(pageNumber) {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url;
        if(indexOfMedicalcare()) {  //是医保项目
            url = SERVER_ADDR + "/hospital/materialMedicalcareTemplate/getList.json";
        }else{
            url = SERVER_ADDR + "/hospital/materialTemplate/getList.json";
        }
        var data = {};
        data.keyword = $(".newsName").val();
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
    $(".addMateTemplateOne").click(function(){
        //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});

        var index = layui.layer.open({
            title : "添加项目模板",
            type : 2,
            area:['62%','47%'],
            content : "addMateTemplate.html",
            success : function(layero, index){
                localStorage.setItem('allMateTemplate',$('.layui-laypage-curr em').eq(1).text());
            }
        })
    })
	function newsList(retInfo,totalCount,current){
		//渲染数据
        //$(".news_content").html(renderDate(retInfo));
        tableRender(retInfo);
		//分页
		var nums = 15; //每页出现的数据量
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
    function tableRender(retInfo) {
        layui.table.render({
            elem: '#news_content'
            ,cols: [[ //标题栏
                {templet: '#check', fixed: true}
                ,{field: 'type', title: '类别',  width: 100,templet: '#type'}
                ,{field: 'modelNo', title: '品名', width: 250,edit: 'text'}
                ,{field: 'placeOfOrigin', title: '产地', width: 90,edit: 'text'}
                ,{field: 'spec', title: '单位', width: 80,edit: 'text'}
                ,{field: 'originalPrice', title: '原价', width: 90,edit: 'text'}
                ,{field: 'price', title: '现价', width: 90,edit: 'text'}
                ,{field: 'discount', title: '最大折扣率', width: 120,edit: 'text'}
                ,{field: 'delTemplate', title: '操作', width: 90,toolbar: '#delTemplate'}
                //,{field: 'receiveName', title: '指定医生', width: 100,edit: 'text'}
                //,{field: 'experience', title: '项目咨询', width: 100,edit: 'text'}
            ]]
            ,data: retInfo
            //,skin: 'line' //表格风格
            ,even: true
            //,page: true //是否显示分页
            //,limits: [5, 7, 10]
            //,limit: 5 //每页默认显示的数量
        });
        layui.form.render();
        $('.typeSelect').show().next('.layui-form-select').remove();

    }
    //监听工具条---删除
    table.on('tool(news_content)', function(obj){
        var dataIndex
        console.log(obj)
        console.log()
        var data = obj.data;
        if(obj.event === 'del'){
            delTemplate(data.id,function () {
                obj.del();
            });
        }
    });
    //监听工具条---修改
    $('.typeSelect').change(function () {
        var type = $(this).val();
        var id = $(this).attr('valueid')
        var url;
        if(indexOfMedicalcare()) {  //是医保项目
            url = SERVER_ADDR + "/hospital/materialMedicalcareTemplate/getDetail.json";
        }else{
            url = SERVER_ADDR + "/hospital/materialTemplate/getDetail.json";
        }
        ajaxGetRetInfo(url,{id:id},function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                var addNews = {};
                addNews.modelNo = retInfo.data.modelNo;
                addNews.placeOfOrigin = retInfo.data.placeOfOrigin;
                addNews.spec = retInfo.data.spec;
                addNews.originalPrice = retInfo.data.originalPrice;
                addNews.price = retInfo.data.price;
                addNews.type = type;
                addNews.discount = retInfo.data.discount;
                addNews.id = id;
                updataTemplate(addNews);
            }else{
                layer.alert(retInfo.data,{icon:5})
            }
            //form.render('select', 'from');//更新
        },'请求失败', 'GET', undefined, undefined);
    })
    table.on('edit(news_content)', function(obj){
        var value = obj.value //得到修改后的值
            ,data = obj.data //得到所在行所有键值
            ,field = obj.field; //得到字段
        console.log(value,data,field);
        var addNews = {};
        addNews.modelNo = data.modelNo;
        addNews.placeOfOrigin = data.placeOfOrigin;
        addNews.spec = data.spec;
        addNews.originalPrice = data.originalPrice;
        addNews.price = data.price;
        addNews.type = data.type;
        addNews.discount = data.discount;
        addNews.id = data.id;

        addNews[field] = value;
        updataTemplate(addNews);
        /*  data.totlePrice =
              tabledata[0]*/
        //if(field == 'quantity'){
        //    tabledata[0][data.LAY_TABLE_INDEX].totlePrice =  Number(value) * Number(data.price);
        //    tabledata[0][data.LAY_TABLE_INDEX].quantity =  Number(value);
        //}else if(field == 'price'){
        //    tabledata[0][data.LAY_TABLE_INDEX].totlePrice =  Number(value) * Number(data.quantity);
        //    tabledata[0][data.LAY_TABLE_INDEX].price =  Number(value);
        //}
//
        //localStorage.setItem('localInfo',JSON.stringify(tabledata[0]));  //修改后要进行再次修改存储
        //getmateTotlePrice(); //计算材料总和
        //console.log(tabledata[0][data.LAY_TABLE_INDEX])
    });
    function updataTemplate(addNews) {
        var url;
        if(indexOfMedicalcare()) {  //是医保项目
            url = SERVER_ADDR + "/hospital/materialMedicalcareTemplate/update";
        }else{
            url = SERVER_ADDR + "/hospital/materialTemplate/update";
        }
        var index = layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        ajaxGetRetInfo(url,addNews,function (retInfo) {
            console.log(retInfo)
            layer.close(index);
            if(retInfo.success){
                layer.msg('修改成功');
            }else{
                layer.alert(retInfo.data,{icon:5})
            }
            //form.render('select', 'from');//更新
        },'请求失败', 'POST', undefined, undefined);
    }

    function renderDate(data){
        var dataHtml = '';
        if(data.length != 0){
            for(var i=0;i<data.length;i++){
                dataHtml+= '<tr>';
                if(data[i].type == 'check'){
                    dataHtml += '<td>检查类</td>';
                }else if(data[i].type == 'cure'){
                    dataHtml += '<td>治疗类</td>';
                }else {
                    dataHtml += '<td></td>';
                }
                dataHtml += '<td>'+noData(data[i].modelNo)+'</td>'
                    +'<td>'+noData(data[i].placeOfOrigin)+'</td>'
                    +'<td>'+noData(data[i].spec)+'</td>'
                    +'<td>'+noData(data[i].originalPrice)+'</td>'
                    +'<td>'+noData(data[i].price)+'</td>'
                    +'<td>'+noData('20%')+'</td>'

               /* if(data[i].status == "unallot"){
                    dataHtml += '<a class="layui-btn layui-btn-mini consultFen" style="display: none" valueid="'+data[i].id+'"><i class="iconfont icon-edit"></i> 分诊</a>' +
                        '<a class="layui-btn layui-btn-normal layui-btn-mini news_reset" style="display: none" valueid="'+data[i].id+'"><i class="layui-icon">&#xe600;</i> 编辑</a>';
                }*/
                dataHtml += '<td>' +
                    '<a class="layui-btn layui-btn-normal layui-btn-mini" onclick="resetTemplate(this)" valueid="'+data[i].id+'"><i class="iconfont icon-edit"></i>修改</a>' +
                    '<a class="layui-btn layui-btn-danger layui-btn-mini" onclick="delTemplate(this)" valueid="'+data[i].id+'"><i class="layui-icon">&#xe640;</i>删除</a>' +
                    '</td>'
                    +'</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="10">暂无数据</td></tr>';
        }
        return dataHtml;
    }
})
function indexOfMedicalcare() {
    if(window.location.href.indexOf('medicalcare') != -1){
        return true
    }else{
        return false
    }
}
//修改项目信息
function resetTemplate(obj) {
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var id = $(obj).attr('valueid');
    console.log(id)
    var index = layui.layer.open({
        title : "修改项目模板",
        type : 2,
        area:['62%','47%'],
        content : "addMateTemplate.html?valueid=" + id + '&action=reset',
        success : function(layero, index){

        }
    })
}
function delTemplate(id,callback) {
    var elThisid = id;
    layer.confirm('确认删除？', {
        btn: ['删除','取消'], //按钮
        icon:3
    }, function(){
        var url;
        if(indexOfMedicalcare()) {  //是医保项目
            url = SERVER_ADDR + "/hospital/materialMedicalcareTemplate/delete";
        }else{
            url = SERVER_ADDR + "/hospital/materialTemplate/delete";
        }
        var data = {};
        data.id = elThisid;
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                //localStorage.setItem('allMateTemplate',$('.layui-laypage-curr em').eq(1).text());
                layer.msg(retInfo.data);
                callback();
                //window.location.reload();
            }else{
                layer.alert(retInfo.data,{icon:5})
            }
        },'请求失败', 'POST', undefined, undefined);
    }, function(){

    });
}
function Get_FileUploadLocalPath(obj) {
    alert(GetFileUploadLocalPath(obj));
}
//返回选取文件的本地路径
function GetFileUploadLocalPath(obj) {
//alert(window.navigator.userAgent);
    if (obj) {
        if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
            obj.select();
            var o = obj.createTextRange();
//alert(o.text);
            return o.text;
        }
        else if (window.navigator.userAgent.indexOf("Firefox") >= 1) {
            if (obj.files) {
                return obj.files.item(0).getAsDataURL();
            }
            return obj.value;
        }
        return obj.value;
    }
}