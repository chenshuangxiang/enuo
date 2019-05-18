layui.use(['form','layer','jquery','laypage','upload'],function(){
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
        upload = layui.upload;
		laypage = layui.laypage;
		$ = layui.jquery;

    //指定允许上传的文件类型
    upload.render({
        elem: '#addTemplate'
        ,url: SERVER_ADDR + '/hospital/visit/hospitalProjectTemplate/import'
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
    toAllFirstTopTab('.templateLi','.toTemplateBtn');
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
    searchBtn(localStorage.getItem('allTemplate') || 1);
    localStorage.removeItem('allTemplate');
	//查询
	$(".search_btn").click(function(){
        searchBtn(1);
	})
	function searchBtn(pageNumber) {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/hospital/visit/hospitalProjectTemplate/getList.json";
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
    $(".addTemplateOne").click(function(){
        //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});

        var index = layui.layer.open({
            title : "添加模板",
            type : 2,
            area:['60%','60%'],
            content : "addTemplate.html",
            success : function(layero, index){
                localStorage.setItem('allTemplate',$('.layui-laypage-curr em').eq(1).text());
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
                    +'<td>'+noData(data[i].name)+'</td>'
                    /*+'<td>'+noData(data[i].category)+'</td>'
                    +'<td>'+noData(data[i].modelNo)+'</td>'
                    +'<td>'+noData(data[i].spec)+'</td>'
                    +'<td>'+noData(data[i].unit)+'</td>'
                    +'<td>'+noData(data[i].originalPrice)+'</td>'
                    +'<td>'+noData(data[i].price)+'</td>'
                    +'<td>'+noData(data[i].quantity)+'</td>'*/
                    +'<td>'+ noData(data[i].day)+'</td>'
					+'<td>'+noData(data[i].result)+'</td>'

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
            dataHtml = '<tr><td colspan="11">暂无数据</td></tr>';
        }
        return dataHtml;
    }
})
//修改项目信息
function resetTemplate(obj) {
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var id = $(obj).attr('valueid');
    console.log(id)
    var index = layui.layer.open({
        title : "修改模板",
        type : 2,
        area:['60%','60%'],
        content : "addTemplate.html?valueid=" + id + '&action=reset',
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
        var url = SERVER_ADDR + "/hospital/visit/hospitalProjectTemplate/delete";
        var data = {};
        data.id = elThisid;
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                localStorage.setItem('allTemplate',$('.layui-laypage-curr em').eq(1).text());
                layer.msg(retInfo.data);
                window.location.reload();
            }else{
                layer.alert(retInfo.data,{icon:5})
            }
        },'请求失败', 'POST', undefined, undefined);
    }, function(){

    });
}