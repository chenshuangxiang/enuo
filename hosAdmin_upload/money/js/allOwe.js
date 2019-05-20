var form
layui.use(['form','layer','jquery','laypage','laydate'],function(){
	 form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
        laydate = layui.laydate,
		$ = layui.jquery;

    //getFentoNameSelect(form,'doctorHelpmate');
    //getFentoNameSelect(form,'doctor');

    form.render();
    /*form.on('select(fenTo)', function(data){  //根据分类获取类型
        getFentoNameSelect(form,data.elem[data.elem.selectedIndex].title);
    });*/
    searchBtn(localStorage.getItem('allOwe') || 1);
    localStorage.removeItem('allOwe');
    $('.allOwe').addClass('layui-this').parent().parent().addClass('layui-nav-itemed');
	//加载页面数据
	$(".search_btn").click(function(){
        searchBtn(1);
	})

})
function searchBtn(pageNumber) {
    var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
    var url = SERVER_ADDR + "/hospital/finance/getReceiptRecordList.json";
    var data = {};
    data.pageNumber = pageNumber;
    data.pageSize = 15;
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
    //form.render('checkbox','choose')
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
            if(data[i].number){
                var number;
                if(data[i].number.split('-')[2] == undefined){
                    var split2 = '';
                }else{
                    var split2 = data[i].number.split('-')[2];
                }
                number =  data[i].number.split('-')[0] + '<span style="color: #009688;font-weight:600">'+ data[i].number.split('-')[1]+'</span>' +  split2;

            }

            dataHtml += '<tr>'
                /* +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                /*  +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                /*  +'<td><input type="checkbox" valueid="'+data[i].id+'" name="checked" lay-skin="primary" lay-filter="choose"><div class="layui-unselect layui-form-checkbox" lay-skin="primary"><i class="layui-icon"></i></div></td>'*/
                /*+'<td>'+data[i].sn+'</td>'*/
                +'<td>'+Number(i+1)+'</td>'
              /*  +'<td>'+data[i].reservationDate+'</td>'*/
                +'<td style="color: #2299ee;cursor: pointer" valuemobile="'+data[i].mobile+'" onclick="visitUserInfo(this)">'+data[i].userName+'</td>'
                +'<td>'+data[i].mobile+'</td>';
            dataHtml += '<td>'+noData(data[i].name)+'</td>' +
                '<td>'+noData(number)+'</td>'

                /*   +'<td>'+noData(data[i].doctor)+'</td>'
                  +'<td>'+noData(data[i].doctorHelpmate)+'</td>'
                  +'<td>'+noData(data[i].huli)+'</td>'
                  +'<td>'+noData(data[i].guestService)+'</td>'*/
                +'<td>'+noData(data[i].lastAmount)+'</td>';
           /* if(data[i].payMethod == 'cash'){
                dataHtml += '<td>现金支付</td>';
            }else if(data[i].payMethod == 'card'){
                dataHtml += '<td>POS机支付</td>';
            }else if(data[i].payMethod == 'medicalInsurance'){
                dataHtml += '<td>医保支付</td>';
            }else if(data[i].payMethod == 'platform') {
                dataHtml +=  '<td>平台支付</td>';
            }else{
                dataHtml += '<td style="color: red">未支付</td>';
            }*/
               /* +'<td>'+noData(data[i].status)+'</td>'*/
            /*if(data[i].status == "success"){
                dataHtml += '<td>已预约</td>'
            }else if(data[i].status == "complete"){
                dataHtml += '<td>已完成</td>'
            }else if(data[i].status == "cancel"){
                dataHtml += '<td>已取消</td>'
            }*/
            dataHtml +=  '<td>';
                /*if(data[i].status == "候诊"){
                    if(!data[i].doctor){
                        dataHtml += '<a class="layui-btn layui-btn-normal layui-btn-mini firm" onclick="fenVisitTo(this)" valueid="'+data[i].id+'" >分诊</a>' ;
                    }
                    dataHtml += '<a class="layui-btn layui-btn-normal layui-btn-mini firm" onclick="addVisitProject(this)" valueid="'+data[i].id+'" >治疗</a>';
                    dataHtml +=  '<a class="layui-btn layui-btn-normal layui-btn-mini" onclick="visit_firm(this)" valueid="'+data[i].id+'">完成</a>'
                }else if(data[i].status == "治疗中"){
                //dataHtml +=  '<a class="layui-btn layui-btn-normal layui-btn-mini firm" onclick="reset_fen_appiontmentList_open(this)" valueid="'+data[i].id+'" visitrecordid="'+data[i].visitRecordId+'" doctorid="'+data[i].doctorId+'" doctorhelpmateid="'+data[i].doctorHelpmateId+'">添加项目</a>'
                    dataHtml +=  '<a class="layui-btn layui-btn-normal layui-btn-mini" onclick="visit_firm(this)" valueid="'+data[i].id+'">完成</a>'
                }*/
            dataHtml +=  '<a class="layui-btn layui-btn-normal layui-btn-mini" onclick="printOrderOpen(this)"  valueid="'+data[i].id+'" payMethod="'+data[i].payMethod+'">缴费</a>'

            dataHtml += '</td>'
                +'</tr>';
        }
    }else{
        dataHtml = '<tr><td colspan="11">暂无数据</td></tr>';
    }
    return dataHtml;
}
function printOrderOpen(obj) {
   /* layui.layer.open({
        type: 1,
        shade: false,
        title: false, //不显示标题
        content: $('.payChooseOpen'), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
        success : function(layero, index){

        },
    });*/
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var id = $(obj).attr('valueid');
    var payMethods = $(obj).attr('payMethod');
    if(payMethods == "undefined"){
        //直接弹出sureOrderPrint
        var index = layui.layer.open({
            title : "打印",
            type : 2,
            area: ['750px','80%'],
            content : 'orderDetailOwe.html?id=' + id + '&v=333',
            success : function(layero, index){

            },
            cancel: function(index, layero){
                layer.close(index)
                return false;
            }
        })
    }else{
        var index = layui.layer.open({
            title : "打印",
            type : 2,
            area: ['750px','80%'],
            content : 'sureOrderPrint.html?id=' + id + '&v=333',
            success : function(layero, index){

            },
            cancel: function(index, layero){
                layer.close(index)
                return false;
            }
        })
    }
}

//添加项目
function visitUserInfo(obj){
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var elThis = $(obj).attr('valuemobile');
    console.log(4555)
    var index = layui.layer.open({
        title : "个人/就诊信息",
        type : 2,
        area:['800px','75%'],
        content : "historyVisit.html?mobile=" + elThis,
        success : function(layero, index){
            //localStorage.setItem('visit',$('.layui-laypage-curr em').eq(1).text());

        }
    })
}