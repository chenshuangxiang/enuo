var tabledata = [];
var form;
var salsman;
layui.use(['form','layer','jquery','table','laydate'],function(){
	 form = layui.form,
        table = layui.table, laydate = layui.laydate,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		$ = layui.jquery;
    //getHos(form); //获取医院
    //getSaleman(form); //获取业务员
    //getFrom(form); //获取点位来源
    //getNoResultHos(form);
    huiZongLeftClick();
    $('.shujuLi').addClass('layui-nav-itemed');
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
    form.render();
   /* form.on('select(newsHos)', function(data){  //根据医院获取病种
        getFk(form,data.elem[data.elem.selectedIndex].title);
    });*/
    //toHuiZong();
	//加载页面数据
	var newsData = '';
	$('#timeInputOpen').val(new Date().Format('yyyy-MM'));
    searchBtn(new Date().Format('yyyy-MM'));
	//查询
	/*$(".search_btn").click(function(){
        searchBtn(new Date().Format('yyyy-MM-dd'));
	})*/
	function searchBtn(value) {
        //var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/customerService/salesman/timePriodStatistical";
        var data = {};
        data.date = value + '-01';
        if(window.location.href.indexOf('allAdvisory.html?type=advisory') != -1){
            data.dataSource = 'advisory';
        }else{
            data.dataSource = 'hospital_experience_coupon';
        }
        data.operation = 'see';
        data.dateType = 'month';
        ajaxGetRetInfo(url,data,function (retInfo) {
            //console.log(retInfo)
            //layer.close(index);
            if(retInfo.success){
                newsList(retInfo.data);
            }else{
                layer.alert(retInfo.data,{icon:5});
			}
        },'请求失败', 'GET', undefined, undefined);
    }

	function newsList(retInfo,totalCount,current){
		//渲染数据
        $('.news_contentTr').empty().append('<th>'+new Date().Format('yyyy')+'</th>');
        retInfo.days.forEach(function (value) {
            $('.news_contentTr').append('<th>'+value+'</th>');
        })
        $('.news_content').html(renderDate(retInfo));
	}
    function renderDate(data){
        var dataHtml = '';
        var salesmanName = data.salesmanNames;
        var data = data.amount;

        if(data.length != 0){
            for(var i=0;i<data.length;i++){
                if(i % 2 == 0){
                    dataHtml+= '<tr>' ;
                }else{
                    dataHtml+= '<tr style="background-color: #f1f1f1">' ;
                }
                dataHtml+= '<td style="display: inline-block;padding: 2px 0px;line-height: 20px;    width: 42px;">'+salesmanName[i]+'</td>'
                 for(var j=0; j<data[i].length;j++){
                     dataHtml+='<td>'+data[i][j]+'</td>'
                 }
                dataHtml+= '</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="10">暂无数据</td></tr>';
        }
        return dataHtml;
    }
})
function searchBtnOutExcel(value) {
    //var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
    var url = SERVER_ADDR + "/customerService/salesman/timePriodStatistical";
    var data = {};
    data.date = value + '-01';
    if(window.location.href.indexOf('allAdvisory.html?type=advisory') != -1){
        data.dataSource = 'advisory';
    }else{
        data.dataSource = 'hospital_experience_coupon';
    }
    data.operation = 'out_excel';
    data.dateType = 'month';
    ajaxGetRetInfo(url,data,function (retInfo) {
        //console.log(retInfo)
        //layer.close(index);
        if(retInfo.success){
            window.open(retInfo.data.excelURL);
            //newsList(retInfo.data);
        }else{
            layer.alert(retInfo.data,{icon:5});
        }
    },'请求失败', 'GET', undefined, undefined);
}
