layui.use(['form','layer','jquery','laypage','laydate','element'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : parent.layer,
        laypage = layui.laypage,
        laydate = layui.laydate,
        $ = layui.jquery;

    form.render();

    //加载页面数据
    var newsData = '';
    searchBtn(localStorage.getItem('allDoc') || 1);

    //查询
    $(".search_btn").click(function(){
        searchBtn(1);
    })
    function searchBtn(pageNumber) {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = getUrl() + "/admin/community_user_role/bebinded/restractions";
        var data = {};
        data.id = getQueryString("id");
        data.pageNumber = pageNumber;
        data.pageSize = 10;
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

    function newsList(retInfo,totalCount,current){
        //渲染数据
        $(".news_content").html(renderDate(retInfo));
        form.render();
        //分页
        var nums = 10; //每页出现的数据量
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
            var numbersCount = 0;
            for(var i=0;i<data.length;i++){
                numbersCount += 1;
                dataHtml += '<tr>'
                    +'<td>'+Number(numbersCount)+'</td>'
                    +'<td onclick="userOpen(this)" style="color: #00AFA1;cursor: pointer" valueusername="'+data[i].fullname+'"  valuemobile="'+data[i].mobile+'">'+data[i].fullname+'</td>'
                    +'<td>'+data[i].mobile+'</td>'
                dataHtml += '</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="3">暂无数据</td></tr>';
        }
        return dataHtml;
    }
})