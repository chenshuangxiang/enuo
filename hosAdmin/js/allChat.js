
layui.use(['form','layer','jquery','laypage','laydate','element'],function(){
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
        laydate = layui.laydate,
		$ = layui.jquery;

    laydate.render({
        elem: '#newsTime'
    });
    //getDocLevel(form);
    //getHos(form); //获取医院
    //getSaleman(form); //获取业务员
    //getFrom(form); //获取点位来源
    //getNoResultHos(form);
    form.render();
    toAllFirstTopTab('.infoLi','.toNewsBtn');
   /* form.on('select(newsHos)', function(data){  //根据医院获取病种
        getFk(form,data.elem[data.elem.selectedIndex].title);
    });*/
	//加载页面数据
	var newsData = '';
	/*$.get("../../json/newsList.json", function(data){
		var newArray = [];
		//单击首页“待审核文章”加载的信息
		if($(".top_tab li.layui-this cite",parent.document).text() == "待审核文章"){
			if(window.sessionStorage.getItem("addNews")){
				var addNews = window.sessionStorage.getItem("addNews");
				newsData = JSON.parse(addNews).concat(data);
			}else{
				newsData = data;
			}
			for(var i=0;i<newsData.length;i++){
        		if(newsData[i].newsStatus == "待审核"){
					newArray.push(newsData[i]);
        		}
        	}
        	newsData = newArray;
        	newsList(newsData);
		}else{    //正常加载信息
			newsData = data;
			if(window.sessionStorage.getItem("addNews")){
				var addNews = window.sessionStorage.getItem("addNews");
				newsData = JSON.parse(addNews).concat(newsData);
			}
			//执行加载数据的方法
			newsList();
		}
	})*/
    searchBtn(localStorage.getItem('allChat') || 1);
    chatTime = setInterval(function () {
        searchBtn(localStorage.getItem('allChat') || 1);
    },5000);
    localStorage.removeItem('allChat');
	function searchBtn(pageNumber) {
       // var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/hospital/message/getList.json";
        var data = {};
        data.pageNumber = pageNumber;
        data.pageSize = 15;
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            //layer.close(index);
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
        localStorage.setItem('allChat',$('.layui-laypage-curr em').eq(1).text());
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
                dataHtml += '<tr>' +
                    '<td style="color: #2299ee;cursor: pointer;position: relative" onclick="toUserInfo(this)" valueindex="1" valueid="'+data[i].hospitalUserId+'"  valuemobile="'+data[i].mobile+'">';
                dataHtml +=''+data[i].nickname+'</td>'
                    +'<td>'+data[i].lastMessage+'</td>'
              /*  +'<td>'+data[i].hospitaoEmployeeName+'</td>'*/
                    +'<td>'+data[i].sendDate+'</td>';
                dataHtml +=  /*'<a class="layui-btn layui-btn-normal layui-btn-mini news_record_add" style="display: none" valueid="'+data[i].id+'"><i class="layui-icon">&#xe650;</i> 回访</a>' +*/
                    '</td>' +
                    '<td><a class="layui-btn layui-btn-normal layui-btn-mini news_reset_dohis" onclick="chats_record(this)" valuehasNewMsg="'+data[i].hasNewMsg+'" valuemobile="'+data[i].mobile+'" valueid="'+data[i].userId+'" employeeid="'+data[i].employeeId+'" valuenickname="'+data[i].nickname+'"><i class="iconfont icon-edit"></i>回复' ;
                if(data[i].hasNewMsg == true){
                    dataHtml += '<span class="new" style="position: relative;float: right;right: -4px;top:2px"></span>';
                }
                dataHtml +='</a>' +
                    '</td>'
                    +'</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="9">暂无数据</td></tr>';
        }
        return dataHtml;
    }
})
//回复弹开
function chats_record(obj) {

    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var id = $(obj).attr('valueid');
    var nickname = $(obj).attr('valuenickname');
    var employeeid = $(obj).attr('employeeid');
    var hasNewMsg = $(obj).attr('valuehasNewMsg');
    var mobile = $(obj).attr('valuemobile');

    var index = layui.layer.open({
        title : nickname,
        type : 2,
        area:['600px','556px'],
        content : "chatDetail.html?valueid=" + id + '&nickname='+nickname  + '&employeeid='+ employeeid + '&mobile='+ mobile,
        success : function(layero, index){
            if(hasNewMsg == 'true'){
                getNewsCount();//获取未读消息条数
            }
        }
    })
}