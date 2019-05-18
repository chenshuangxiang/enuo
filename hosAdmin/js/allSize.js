var form;
layui.use(['form','layer','jquery','laypage','laydate'],function(){
    form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
        laydate = layui.laydate,
		$ = layui.jquery;

    laydate.render({
        elem: '#newsTime', done: function (value) {
            $('.tochoosedaybtn').css('color','#555');
        }
    });
    laydate.render({
        elem: '#newsEndTime', done: function (value) {
            $('.tochoosedaybtn').css('color','#555');
        }
    });
    $('#newsTime').val(new Date().Format('yyyy-MM') + '-01');
    $('#newsEndTime').val(new Date().Format('yyyy-MM-dd'));
    $('.choosetime').text((new Date().Format('yyyy-MM') + '-01').replace(/-/g,'.') + '-' + (new Date().Format('yyyy-MM-dd')).replace(/-/g,'.'));
    //toIndex();
    toIndexTopTab();
    adviosyEcharts();
    accessEcharts();
    tonowMonth('.tonowMonth');
    form.render();
	//加载页面数据
    searchBtn('');
    allProduct();//项目总览
    pendingDisposal();//待处理
	//查询
	$(".shuaxin").click(function(){
        sureFen();
        adviosyEcharts();
        accessEcharts();
	})
})
function tonowDay(obj) {
    $('#newsTime,#newsEndTime').val(new Date().Format('yyyy-MM-dd'));

    setColor(obj);
    $('.dateIcon').removeClass('layui-bg-blue layui-bg-cyan layui-bg-green layui-bg-orange').addClass('layui-bg-blue').text('日');
    searchBtn('');
}
function tonowWeek(obj) {
    $('#newsTime').val(getWeek().split('/')[0]);
    $('#newsEndTime').val(getWeek().split('/')[1]);
    setColor(obj);
    $('.dateIcon').removeClass('layui-bg-blue layui-bg-cyan layui-bg-green layui-bg-orange').addClass('layui-bg-cyan').text('周');
    searchBtn('');
}
function tonowMonth(obj) {
    $('#newsTime').val(new Date().Format('yyyy-MM') + '-01');
    $('#newsEndTime').val(new Date().Format('yyyy-MM') + '-'+ getCountDays());
    setColor(obj);
    $('.dateIcon').removeClass('layui-bg-blue layui-bg-cyan layui-bg-green layui-bg-orange').addClass('layui-bg-green').text('月');
    searchBtn('');
}
function tonowAll(obj) {
    setColor(obj);
    $('#newsTime,#newsEndTime').val('');
    searchBtn('ALL');
    $('.choosetime').text('全部');
    $('.dateIcon').removeClass('layui-bg-blue layui-bg-cyan layui-bg-green layui-bg-orange').addClass('layui-bg-orange').text('全部');
}
function setColor(obj) {
    $('.tochoosedaybtn').css('color','#555').removeClass('choosetimeClass');
    $(obj).css('color','#009688').addClass('choosetimeClass');
}
function pendingDisposal() {
    var url = SERVER_ADDR + "/hospital/pendingDisposal";
    var data = '';
    ajaxGetRetInfo(url,data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            $('.successLists').text(retInfo.data.SuccessLists);
            if(retInfo.data.SuccessLists > 0){
                $('.successLists').addClass('cursor')
            }
            $('.visitRecordLists').text(retInfo.data.visitRecordLists);
            if(retInfo.data.visitRecordLists > 0){
                $('.visitRecordLists').addClass('cursor')
            }
            $('.noGuestServiceLists').text(retInfo.data.noGuestServiceLists);
            if(retInfo.data.noGuestServiceLists > 0){
                $('.noGuestServiceLists').addClass('cursor')
            }
        }else{
            layer.alert(retInfo.data,{icon:5});
        }



    },'请求失败', 'GET', undefined, undefined);
}
function allProduct() {
    var url = SERVER_ADDR + "/hospital/allProduct";
    var data = '';
    ajaxGetRetInfo(url,data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            $('.pass').text(retInfo.data.pass);
            $('.notpass').text(retInfo.data.notpass);
            $('.unchecked').text(retInfo.data.unchecked);
            $('.allSpecialProduct').text(retInfo.data.allSpecialProduct);
        }else{
            layer.alert(retInfo.data,{icon:5});
        }



    },'请求失败', 'GET', undefined, undefined);
}
function searchBtn(type) {
    $('.choosetime').text($('#newsTime').val().replace(/-/g,'.') + '-' + $('#newsEndTime').val().replace(/-/g,'.'));
    var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
    var url = SERVER_ADDR + "/hospital/managerData";
    var data = {};
    data.type = type;
    data.start = $("#newsTime").val();
    data.end = $("#newsEndTime").val();
    ajaxGetRetInfo(url,data,function (retInfo) {
        console.log(retInfo)
        layer.close(index);
        if(retInfo.success){
            newsList(retInfo.data);
        }else{
            layer.alert(retInfo.data,{icon:5});
        }



    },'请求失败', 'GET', undefined, undefined);
}
function newsList(data){
    //渲染数据
    console.log(data)
    $('.userOffLineProjectsCount').text(data.userOffLineProjects);
    $('.visitRecordsCount').text(data.visitRecords);
    $('.repeatVisitRecordsCount').text(data.repeatVisitRecords);
    $('.experienceReservationsCount').text(data.experienceReservations);
    $('.firstVisitRecordsCount').text(data.firstVisitRecords);
    $('.noDealVisitRecordsCount').text(data.noDealVisitRecords);
    $('.totalAmountCount').text(data.totalAmount || 0);
    $('.accessCount').text(data.accessCount);
    $('.advisoryNotPassCount').text(data.advisoryNotPassTotal);
    $('.advisoryNotPassPercent').text(data.advisoryNotPassPercent + '%');
    if(data.visitRecords == 0){
        $('.noDealVisitRecordsPercentCount').text('0.00%');
    }else{
        $('.noDealVisitRecordsPercentCount').text((data.noDealVisitRecords / data.visitRecords).toFixed(2) + '%');
    }
}

function sureFen() {
    if($('#newsTime').val() != '' && $('#newsEndTime').val() == ''){
        layer.msg('请选择结束时间');
        return;
    }else if($('#newsTime').val() == '' && $('#newsEndTime').val() != ''){
        layer.msg('请选择开始时间');
        return;
    }else if($('#newsTime').val() == '' && $('#newsEndTime').val() == ''){
        if($('.tonowAll').hasClass('choosetimeClass')){
            searchBtn('ALL');
            $('.choosetime').text('全部');
            $('.dateIcon').removeClass('layui-bg-blue layui-bg-cyan layui-bg-green layui-bg-orange').addClass('layui-bg-orange').text('全部');
            layer.closeAll();
            return;
        }else{
            layer.msg('请选择开始时间和结束时间');
            return;
        }
    }
    if($('.tonowDay').hasClass('choosetimeClass')){
        $('.dateIcon').removeClass('layui-bg-blue layui-bg-cyan layui-bg-green layui-bg-orange').addClass('layui-bg-blue').text('日');
    }else if($('.tonowWeek').hasClass('choosetimeClass')){
        $('.dateIcon').removeClass('layui-bg-blue layui-bg-cyan layui-bg-green layui-bg-orange').addClass('layui-bg-cyan').text('周');
    }else if($('.tonowMonth').hasClass('choosetimeClass')){
        $('.dateIcon').removeClass('layui-bg-blue layui-bg-cyan layui-bg-green layui-bg-orange').addClass('layui-bg-green').text('月');
    }
    $('.choosetime').text($('#newsTime').val().replace(/-/g,'.') + '-' + $('#newsEndTime').val().replace(/-/g,'.'));
    $('.dateIcon').removeClass('layui-bg-blue layui-bg-cyan layui-bg-green layui-bg-orange').addClass('layui-bg-blue').text('日');
    searchBtn('');
    layer.closeAll();
}
function openTimeChoose() {
    var index = layui.layer.open({
        area: ['345px','420px'],
        title : "选择日期",
        type : 1,
        content : $('.chooseTimeOpen'),
        success:function(){
            $('.layui-layer-shade').remove();
        }
    })
}
function adviosyEcharts() {
    var dataGet = '';
    /*请求折线数组*/
    ajaxGetRetInfo("/hospital/ordersStatistics",dataGet,function (data) {
        if(data.success){
            console.log(data);
            var dataList = data.data.weekOrdersDate;
            console.log(dataList)
            var myAdviosyEcharts = echarts.init(document.getElementById('adviosyEcharts'));
            var dataAxis = [];
            var datayAxis = [];
            var sevencount = 0;
            for(var key in dataList){
                dataAxis.push(new Date(Number(key)).Format('MM-dd'));
                datayAxis.push(dataList[key]);
                sevencount += dataList[key];
            }
            var day1 = new Date();
            var day2 = new Date();
            day1.setTime(day1.getTime()-24*60*60*1000);
            day2.setTime(day2.getTime()-7*24*60*60*1000);
            if(day1.getDate() < 10){
                var s1 = day1.getFullYear()+"." + (day1.getMonth()+1) + ".0" + day1.getDate();
            }else{
                var s1 = day1.getFullYear()+"." + (day1.getMonth()+1) + "." + day1.getDate();
            }
            if(day2.getDate() < 10){
                var s2 = day2.getFullYear()+"." + (day2.getMonth()+1) + ".0" + day2.getDate();
            }else{
                var s2 = day2.getFullYear()+"." + (day2.getMonth()+1) + "." + day2.getDate();
            }
            $('.dateAfterSevenAdvoisy').html(s2 + ' - '+ s1 + ' | 过去7天 ' + '<strong style="font-size: 22px;margin-left: 10px">'+sevencount + '</strong>次');

            var option = {
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        console.log(params)
                        return '订单数: ' + params[0].value;
                    }
                },
                title: {
                    left: 'center',
                    text: '过去7天订单统计',
                },
                /*legend: {
                    selectedMode:false,
                    data:[{name: monthZi,textStyle: {fontSize: 18}}]
                },*/
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '5%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: dataAxis,
                    /*axisLabel: {
                        formatter: function(value)
                        {
                            return value.split(' ')[0] + '\n\r' +value.split(' ')[1]
                        }
                    }*/

                },
                yAxis: {
                    type: 'value',
                    /* minInterval : 1,
                   boundaryGap : [ 0, 0.1 ],
                    min: 0,*/
                    /* max: 10000*/
                },
                series: [
                    {
                        name:'订单数',
                        type:'line',
                        stack: '总数',
                        data:datayAxis,
                        itemStyle: {
                            normal: {
                                color: "#009688",
                                lineStyle: {
                                    color: "#009688"
                                }
                            }
                        }
                    }
                ]
            };
            myAdviosyEcharts.setOption(option);
            /*窗口自适应，关键代码*/
            setTimeout(function (){
                window.onresize = function () {
                    myAdviosyEcharts.resize();
                }
            },200)

        }else{
            layer.alert(data.data,{icon:5});
        }
    },'请求失败', 'GET', undefined, undefined);
}
function accessEcharts() {
    var dataGet = '';
    ajaxGetRetInfo("/hospital/visitRecordStatistics",dataGet,function (data) {
        if(data.success){
            console.log(data);
            var dataList = data.data.weekVisitRecordsDate;
            console.log(dataList.length)
            var myAccessEcharts = echarts.init(document.getElementById('accessEcharts'));
            var dataAxis = [];
            var datayAxis = [];
            var sevencount = 0;
            for(var key in dataList){
                dataAxis.push(new Date(Number(key)).Format('MM-dd'));
                datayAxis.push(dataList[key]);
                sevencount += dataList[key];
            }
    var day1 = new Date();
    var day2 = new Date();
    day1.setTime(day1.getTime()-24*60*60*1000);
    day2.setTime(day2.getTime()-7*24*60*60*1000);
    if(day1.getDate() < 10){
        var s1 = day1.getFullYear()+"." + (day1.getMonth()+1) + ".0" + day1.getDate();
    }else{
        var s1 = day1.getFullYear()+"." + (day1.getMonth()+1) + "." + day1.getDate();
    }
    if(day2.getDate() < 10){
        var s2 = day2.getFullYear()+"." + (day2.getMonth()+1) + ".0" + day2.getDate();
    }else{
        var s2 = day2.getFullYear()+"." + (day2.getMonth()+1) + "." + day2.getDate();
    }
    $('.dateAfterSevenAccess').html(s2 + ' - '+ s1 + ' | 过去7天 ' + '<strong style="font-size: 22px;margin-left: 10px">'+sevencount + '</strong>次');
    //var monthZi = data.data.title;
            var option = {
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        console.log(params)
                        return '就诊数: ' + params[0].value;
                    }
                },
                title: {
                    left: 'center',
                    text: '过去7天就诊统计',
                },
                /*legend: {
                    selectedMode:false,
                    data:[{name: monthZi,textStyle: {fontSize: 18}}]
                },*/
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '5%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: dataAxis

                },
                yAxis: {
                    type: 'value',
                    /* minInterval : 1,
                   boundaryGap : [ 0, 0.1 ],
                    min: 0,*/
                    /* max: 10000*/
                },
                series: [
                    {
                        name:'就诊数',
                        type:'line',
                        stack: '总数',
                        data:datayAxis,
                        itemStyle: {
                            normal: {
                                color: "#1E9FFF",
                                lineStyle: {
                                    color: "#1E9FFF"
                                }
                            }
                        }
                    }
                ]
            };
            myAccessEcharts.setOption(option);
            /*窗口自适应，关键代码*/
            setTimeout(function (){
                window.onresize = function () {
                    myAccessEcharts.resize();
                }
            },200)
        }else{
            layer.alert(data.data,{icon:5});
        }
    },'请求失败', 'GET', undefined, undefined);
}