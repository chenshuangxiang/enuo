var tabledata = [];
layui.use(['form','layer','jquery','laypage','laydate','element','table'],function(){
	var form = layui.form,
        table = layui.table,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
        laydate = layui.laydate,
		$ = layui.jquery;
    if(window.location.href.split('?id=')[1] != undefined){
        $('.zixunNow').addClass('layui-this').parent().parent().addClass('layui-nav-itemed');
    }

    laydate.render({
        elem: '#newsTime'
    });
    table.on('edit(zixunNow)', function(obj){
        var value = obj.value //得到修改后的值
            ,data = obj.data //得到所在行所有键值
            ,field = obj.field; //得到字段
        console.log(value,data,field);
        console.log(tabledata[0])
        localStorage.setItem('localInfo',JSON.stringify(tabledata[0]));
        //console.log(tabledata[0][data.LAY_TABLE_INDEX])
    });
    //监听工具条
    table.on('tool(zixunNow)', function(obj){
        var dataIndex
        console.log(obj)
        console.log()
        var data = obj.data;
       if(obj.event === 'del'){
           setTimeout(function () {
                dataIndex = $('.layui-table-click').attr('data-index');
           },50);
            layer.confirm('确定删除？',{icon:3}, function(index){
                console.log(dataIndex)
                console.log(tabledata[0])
                tabledata[0].splice(dataIndex, 1)
                console.log(tabledata[0])
                localStorage.setItem('localInfo',JSON.stringify(tabledata[0]));
                obj.del();
                layer.close(index);
            });
        }else if(obj.event === 'jiuzhenHis'){
           var index = layui.layer.open({
               title : "就诊记录",
               type : 2,
               area:['83%','83%'],
               content : "jiuzhenHis.html",
               success : function(layero, index){

               }
           })
        }
    });
    if(window.location.href.indexOf('&yuyueid=') != -1 && localStorage.getItem('localInfo') == null){ //线上预约，带预约id
        var yuyueid = window.location.href.split('?id=')[1].split('&yuyueid=')[1];
        getYuyueInfo(yuyueid);
    }else{
        tabledata.push(JSON.parse(localStorage.getItem('localInfo')))
    }
    console.log(tabledata)
    table.render({
        elem: '#zixunNow'
        ,cols: [[ //标题栏
            {field: 'name', title: '姓名',  width: 120,edit: 'text'}
            //,{field: 'category', title: '费用类别', width: 90,edit: 'text'}
            ,{field: 'modelNo', title: '联系方式', width: 150,edit: 'text'}
            //,{field: 'spec', title: '规格', width: 80,edit: 'text'}
            //,{field: 'unit', title: '单位', width: 80,edit: 'text'}
            ,{field: 'originalPrice', title: '项目分类', width: 150,edit: 'text'}
            ,{field: 'price', title: '项目', width: 150,edit: 'text'}
            //,{field: 'experience', title: '优惠券额', width: 100,edit: 'text'}
            ,{field: 'paidAmount', title: '来源', width: 120,edit: 'text'}
            ,{field: 'quantity', title: '预约医生', width: 100,edit: 'text'}
            ,{field: 'day', title: '咨询', width: 100,edit: 'text'}
            ,{field: 'result', title: '客服', width: 100,edit: 'text'}
            /*,{field: 'receiveName', title: '指定医生', width: 140,templet: '#selectDoctor'}*/
            ,{field: 'delZixunNow', title: '操作', width: 280,toolbar: '#delZixunNow'}
            //,{field: 'receiveName', title: '指定医生', width: 100,edit: 'text'}
            //,{field: 'experience', title: '项目咨询', width: 100,edit: 'text'}
        ]]
    /*    姓名	联系方式	项目分类	项目	来源	预约医生	咨询	客服	分诊*/

        ,data: tabledata[0]
        //,skin: 'line' //表格风格
        ,even: true
        //,page: true //是否显示分页
        //,limits: [5, 7, 10]
        //,limit: 5 //每页默认显示的数量
    });
    form.render();
    $('.layui-unselect.layui-form-select').remove();
    $('select').show();
    getDoctorNameSelect(tabledata[0]);
    var divs=document.getElementsByClassName("fenToName");
    for(var i=0;i<divs.length;i++){
        var thisIndex;
        divs[i].setAttribute("index",i);
        divs[i].onchange =function(){
            thisIndex = this.getAttribute("index")
                //alert("我是第"+thisIndex+"个div");
            console.log(tabledata[0][thisIndex])
            tabledata[0][thisIndex].receiverId = $('.fenToName').eq(thisIndex).val();
            tabledata[0][thisIndex].receiveName = $('.fenToName').eq(thisIndex).find("option:selected").text();
            console.log(tabledata[0])
            localStorage.setItem('localInfo',JSON.stringify(tabledata[0]));
            /*console.log($('.fenToName').eq(thisIndex).find("option:selected").text());
            console.log($('.fenToName').eq(thisIndex).val())*/
        }
    }
    /*$('.fenToName').change(function () {
       console.log($(this).index())
    });*/
    //添加项目
    $(".zixunAddProject").click(function(){
        var index = layui.layer.open({
            title : "添加项目",
            type : 2,
            area:['83%','83%'],
            content : "addTemplateProject.html",
            success : function(layero, index){

            }
        })
    })
});
function getYuyueInfo(yuyueid) {
    var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
    var url = SERVER_ADDR + "/hospital/visit/advisory/getOnLineReservationInfo.json";
    var data = {};
    data.reservationId = yuyueid;
    ajaxGetRetInfo(url,data,function (retInfo) {
        console.log(retInfo)
        layer.close(index);
        if(retInfo.success){
            var yuyueData = [];
            yuyueData.push(retInfo.data)
            if(retInfo.data != ''){
                localStorage.setItem('localInfo',JSON.stringify(yuyueData));
                location.reload();
            }
        }else{
            layer.alert(retInfo.data,{icon:5});
        }
    },'请求失败', 'GET', undefined, undefined);
}
function postOrder() {
    if(JSON.stringify(tabledata[0]) == 'null' || JSON.stringify(tabledata[0]) == undefined || JSON.stringify(tabledata[0]) == "[]"){
        layer.alert('无医疗项目，不可提交',{icon:7});
        return;
    }
    var index = layer.msg('提交中，请稍候',{icon: 16,time:false,shade:0.8});
    var url = SERVER_ADDR + "/hospital/visit/advisory/addProject";
    var data = {};
    var advisoryId;
    if(window.location.href.indexOf('&yuyueid=') == -1){
        advisoryId = window.location.href.split('?id=')[1];
    }else{
        advisoryId = window.location.href.split('?id=')[1].split('&yuyueid=')[0];
    }
    data.advisoryId = advisoryId;
    data.projects = JSON.stringify(tabledata[0]);
    ajaxGetRetInfo(url,data,function (retInfo) {
        console.log(retInfo)
        layer.close(index);
        if(retInfo.success){
            layer.msg('提交成功');
            localStorage.removeItem('localInfo');
            setTimeout(function () {
                $('.zixunNow').removeClass('layui-this');
                window.location.href = '#allZixun.html';
            },1000);
            //newsList(retInfo.data,retInfo.totalCount,pageNumber);
        }else{
            layer.alert(retInfo.data,{icon:5});
        }
    },'请求失败', 'POST', undefined, undefined);
}