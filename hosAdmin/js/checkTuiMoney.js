layui.use(['form','layer','jquery','laypage','laydate'],function(){
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
        laydate = layui.laydate,
		$ = layui.jquery;
    form.render();
    toAllFirstTopTab('.shenheLi','.toHospitalBtn');
    searchBtn(1);
	//查询
	$(".search_btn").click(function(){
        searchBtn(1);
	})
	function searchBtn(pageNumber) {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/hospital/finance/findRefundRecordAuditPage";
        var data = {};
        //data.type = $(".projSelect").val();
        data.pageNumber = pageNumber;
        data.pageSize = 10;
        //项目名称
        if($(".newsName").val() != ""){
            data.keyword = $(".newsName").val();
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
                var number;
                if (data[i].number) {
                    if (data[i].number.split('-')[2] == undefined) {
                        var split2 = '';
                    } else {
                        var split2 = data[i].number.split('-')[2];
                    }
                    number = data[i].number.split('-')[0] + '<span style="color: #009688;font-weight:600">' + data[i].number.split('-')[1] + '</span>' + split2;
                } else {
                    number = ''
                }
                dataHtml += '<tr>'
                    +'<td>'+new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss")+'</td>'
                    +'<td style="color: #2299ee;cursor: pointer" onclick="toUserInfo(this)" valueindex="1"   valuemobile="'+data[i].mobile+'">'+data[i].fullname+'</td>'
                    +'<td>'+data[i].mobile+'</td>'
                    +'<td valueuserOfflineProject="'+data[i].userOfflineProjectId+'" onclick="allOrderDetail(this)" style="color: #2299ee;cursor: pointer;">'+data[i].diseases+'</td>'
                    +'<td>'+noData(data[i].paidAmount.toFixed(2)) + '/' +noData(data[i].totalAmount.toFixed(2))+'</td>'
                    +'<td>'+data[i].amount+'元</td>'
                    +'<td>'+noDataKong(data[i].remard)+'</td>'
                dataHtml +=  '<td>';
                dataHtml +=  '<a class="layui-btn layui-btn-normal layui-btn-mini firm" onclick="checkfirm(this)" check="true"  valueid="'+data[i].id+'" valueuserOffLineProjectId="'+data[i].userOfflineProjectId+'"><i class="layui-icon" style="margin:0 -7px 0 -6px;">&#xe618;</i> 通过</a>' +
                    '<a class="layui-btn layui-btn-danger layui-btn-mini layui-btn-xs" onclick="checkfirm(this)" check="false" valueid="'+data[i].id+'" valueuserOffLineProjectId="'+data[i].userOfflineProjectId+'"><i class="layui-icon" style="margin-right: 0;">&#x1006;</i>驳回</a>';
                dataHtml += '</td>'
                    +'</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="11">暂无数据</td></tr>';
        }
        return dataHtml;
    }
})
function checkfirm(obj) {
    var elthis = $(obj);
    var check = $(obj).attr('check');
    var checkZi;
    if(check == 'true'){
        checkZi = '确定通过审核？';
    }else{
        checkZi = '确定驳回审核？';
    }
    var id = elthis.attr("valueid");
    var userOfflineProjectId = elthis.attr("valueuserOffLineProjectId");
    layer.confirm(checkZi, {
        btn: ['确认','取消'], //按钮
        icon:3
    }, function(){
        var url = SERVER_ADDR + "/hospital/finance/refundRecordAudit";
        var data = {};
        data.id = id;
        data.userOfflineProjectId = userOfflineProjectId;
        if(check == 'true'){
            data.status = 'success';
        }else{
            data.status = 'auditFail';
        }
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                layer.msg(retInfo.data);
                setTimeout(function () {
                    window.location.reload();
                },1000);
            }else{
                layer.alert(retInfo.data,{icon:5});
            }
        },'请求失败', 'GET', undefined, undefined);
    }, function(){

    });
}