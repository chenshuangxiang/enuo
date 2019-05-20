layui.use(['form','layer','jquery','laypage','laydate'],function(){
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
        laydate = layui.laydate,
		$ = layui.jquery;

    laydate.render({
        elem: '#timeInputOpen', //指定元素
        type:'month',
        done: function(value, date, endDate) {
            console.log(value); //得到日期生成的值，如：2017-08-18
            console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
            console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
            searchBtn(value);
        }
    });
    huiZongLeftClick();
    $('.shujuLi').addClass('layui-nav-itemed');
    //getHos(form); //获取医院
    getSaleman(form); //获取业务员
    form.render();
	//加载页面数据
	var newsData = '';
    $('#timeInputOpen').val(new Date().Format('yyyy-MM'));
    searchBtn(localStorage.getItem('allrecordPage') || 1);
    localStorage.removeItem('allrecordPage');
	//查询
	$(".search_btn").click(function(){
        searchBtn(1);
	})
	function searchBtn(pageNumber) {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/customerService/repulseRate";
        var data = {};
        data.date =$("#timeInputOpen").val() + '-01';
        data.isMonth = true;
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            layer.close(index);
            if(retInfo.success){
                newsList(retInfo.data);
            }else{
                layer.alert(retInfo.data,{icon:5});
			}
        },'请求失败', 'POST', undefined, undefined);
    }
	function newsList(retInfo){
		//渲染数据
        $(".news_content").html(renderDate(retInfo));
	}
    function renderDate(data){
        var dataHtml = '';
        console.log(data.length)
        if(data.length != 0){
            for(var i=0;i<data.length;i++){
                dataHtml += '<tr>'
                    +'<td>'+data[i].name+'</td>'
					+'<td>'+data[i].advisorys+'</td>'
                    +'<td>'+data[i].repulse+'</td>'
                    +'<td>'+data[i].repulseRate+'</td>'
                dataHtml += '</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="4">暂无数据</td></tr>';
        }
        return dataHtml;
    }
})
/*function resetRecordOPen(obj) {
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
    $(obj).prev().prev().html('<select style="display: block" class="prevStatus"> ' +
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
}*/
function news_reset_recordhis(obj) {
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var username = $(obj).attr('valueusername');
    var mobile = $(obj).attr('valuemobile');
    var id = $(obj).attr('patientid');
    var valueid = $(obj).attr('valueid');
    var elThis = $(obj);
    var index = layui.layer.open({
        title : "回访",
        type : 2,
        area:['90%','90%'],
        content : "historyRecord.html?id=" + id + '&mobile=' + mobile + '&valueid='+valueid + '&v=222',
        success : function(layero, index){
            //$('.news_content tr').css('background-color','white');
            //elThis.parent().parent().css('background-color','#f2f2f2');


        }
    })
}
var Get = {
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
            localStorage.setItem('allrecordPage',$('.layui-laypage-curr em').eq(1).text());
            location.reload();
        } else {
            alert(retInfo.data);
        }
    }
}