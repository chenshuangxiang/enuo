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
    toIndex();
    adviosyEcharts();
    form.render();
	//加载页面数据
    searchBtn('');
	//查询
	$(".shuaxin").click(function(){
        sureFen();
        adviosyEcharts();
	})
})
function tonowDay(obj) {
    $('#newsTime,#newsEndTime').val(new Date().Format('yyyy-MM-dd'));
    setColor(obj);
}
function tonowWeek(obj) {
    $('#newsTime').val(getWeek().split('/')[0]);
    $('#newsEndTime').val(getWeek().split('/')[1]);
    setColor(obj);
}
function tonowMonth(obj) {
    $('#newsTime').val(new Date().Format('yyyy-MM') + '-01');
    $('#newsEndTime').val(new Date().Format('yyyy-MM') + '-'+ getCountDays());
    setColor(obj);
}
function tonowAll(obj) {
    setColor(obj);
    $('#newsTime,#newsEndTime').val('');
}
function setColor(obj) {
    $('.tochoosedaybtn').css('color','#555').removeClass('choosetimeClass');
    $(obj).css('color','#009688').addClass('choosetimeClass');
}
function searchBtn(type) {
    var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
    var url = SERVER_ADDR + "/customerService/getCaptainData.json";
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
    $('.adviosyCount').text(data.advisories);
    $('.accessCount').text(data.access);
    $('.allotCount').text(data.allots);
    $('.couponCount').text(data.experienceReservations);
    $('.userCount').text(data.users);
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
function adviosyEcharts(value) {
    var dataGet = {};
    /*请求折线数组*/
    ajaxGetRetInfo("/customerService/getWeekCaptainData.json",dataGet,function (data) {
        if(data.success){
            console.log(data);
            var accessList = data.data.accessList[0];
            accessEcharts(accessList);
            var dataList = data.data.advisoryList[0];
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
                        return '咨询量: ' + params[0].value;
                    }
                },
                title: {
                    left: 'center',
                    text: '过去7天咨询量',
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
                        name:'咨询量',
                        type:'line',
                        stack: '总量',
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
function accessEcharts(value) {
    var dataGet = {};
    /*请求折线数组*/
            var dataList = value;
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
                        return '回访量: ' + params[0].value;
                    }
                },
                title: {
                    left: 'center',
                    text: '过去7天回访量',
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
                        name:'回访量',
                        type:'line',
                        stack: '总量',
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
}