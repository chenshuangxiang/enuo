layui.use(['form','layer','jquery','laypage','laydate'],function(){
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
        laydate = layui.laydate,
		$ = layui.jquery;
    form.render();
	//加载页面数据
	var newsData = '';
	$('.help').mouseenter(function () {
        layui.layer.tips('已预约：用户已经预约该项目<br>已取消：用户已经取消预约该项目<br>已完成：用户已经完成该项目', '.help', {
            tips: 3
        });
    })
    toAllFirstTopTab('.yuyueLi');
    searchBtn(1);
	//查询
	$(".search_btn").click(function(){
        searchBtn(1);
	})
	function searchBtn(pageNumber) {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/hospital/reservation/getCardList.json";
        var data = {};
        data.type = 'nursingCard';//$(".projSelect").val();
        data.pageNumber = pageNumber;
        data.pageSize = 10;
        //项目名称
        if($(".newsName").val() != ""){
            data.keyword = $(".newsName").val();
            console.log(data);
        }
//		console.log(pass_val);
        //预约状态
        if($('.statusjSelect').val() != ""){
            data.status = $('.statusjSelect').val();
            console.log(data);
        }
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
        form.render('checkbox','choose')
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
            for(var i=0;i<data.length;i++){
                dataHtml += '<tr>'
                    +'<td>'+data[i].fullName+'</td>'
                    +'<td>'+data[i].mobile+'</td>';
                dataHtml += '<td>'+data[i].name+'</td>'
                    dataHtml += '<td>e诺平台</td>'
                        +'<td>'+noData(data[i].productCategoryType)+'</td>'
                        +'<td>'+noData(data[i].productCategoryName)+'</td>'
					+'<td>'+data[i].reservationDate+'</td>';
                if(data[i].status == "success"){
                    dataHtml += '<td style="color: #00389f">已预约</td>'
                }else if(data[i].status == "complete"){
                    dataHtml += '<td style="color: #009688">已完成</td>'
                }else if(data[i].status == "cancel"){
                    dataHtml += '<td style="color: red">已取消</td>'
                }
                dataHtml +=  '<td>';

                  if(data[i].status == "success"){
                      dataHtml +=  '<a class="layui-btn layui-btn-normal layui-btn-mini firm" onclick="firm(this)" valueid="'+data[i].id+'"><i class="layui-icon" style="    margin-right: -6px;">&#xe618;</i> 完成</a>' ;
                         /* '<a class="layui-btn layui-btn-normal layui-btn-mini" onclick="addWrite(this)" valueid="'+data[i].id+'">入诊</a>'*/
                  }
                dataHtml += '</td>'
                    +'</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="9">暂无数据</td></tr>';
        }
        return dataHtml;
    }
})
//添加咨询
function addWrite(obj){
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var elThis = $(obj).attr('valueid');
    console.log(4555)
    var index = layui.layer.open({
        title : "添加入诊",
        type : 2,
        area:['62%','68%'],
        content : "addWrite.html?action=reset&valueid=" + elThis ,
        success : function(layero, index){
            localStorage.setItem('allWrite',$('.layui-laypage-curr em').eq(1).text());

        }
    })
}
function firm(obj) {
    var elthis = $(obj);
    var appoint_id = elthis.attr("valueid");
    //window.localStorage.setItem("appoint_id",appoint_id);
    layer.confirm('确认该项目已完成？', {
        btn: ['完成','取消'], //按钮
        icon:3
    }, function(){
        var data = {
            "id":appoint_id
        }
        postget_ajax("/hospital/reservation/cardCompleted",data,'POST',function(res){
            if(res.success){
//				window.location.href = "appointment_list.html";
                elthis.parent().prev().text("已完成");
                elthis.remove();
                layer.closeAll();
            }else{
                layer.alert(res.data);
            }
        });
    }, function(){

    });
}