$(document).ready(function () {
    if(getQueryString('name') != null){
        $('.toptitle,title').text(getQueryString('name') + '咨询列表')
    }
    $(".closeopen").click(function () {
        $('.shadow,.layeropen,.layeropen2').hide();
        //$('.accurate_btn').attr('disabled',false).css('background-color','#00afa1');
    });
})
var localSalermanageCurNavIndex = Number(localStorage.getItem('salermanageCurNavIndex'));
var curNavIndex = localSalermanageCurNavIndex;//首页0; 奶粉1; 面膜2; 图书3;
var mescrollArr=new Array(5);//4个菜单所对应的4个mescroll对象
mescrollArr[localSalermanageCurNavIndex]=initMescroll("mescroll"+localSalermanageCurNavIndex, "dataList"+localSalermanageCurNavIndex);
var indexcount = {};
indexcount[curNavIndex] = 0;
$(".nav .active").removeClass("active");
$('.navIndexP[i="'+curNavIndex+'"]').addClass("active");
$("#mescroll0").hide();
$("#mescroll"+curNavIndex).show();
$(function(){
    $(".nav p").click(function(){
        var i=Number($(this).attr("i"));
        if(curNavIndex!=i) {
            //更改列表条件
            $(".nav .active").removeClass("active");
            $(this).addClass("active");
            //隐藏当前列表
            $("#mescroll"+curNavIndex).hide();
            //显示对应的列表
            curNavIndex=i;
            $("#mescroll"+curNavIndex).show();
            //取出菜单所对应的mescroll对象,如果未初始化则初始化
            localStorage.removeItem('salermanageScrollTop');
            if(mescrollArr[i]==null){
                mescrollArr[i]=initMescroll("mescroll"+i, "dataList"+i);
                indexcount[curNavIndex] = 0;
            }
            localStorage.setItem('salermanageCurNavIndex',curNavIndex);
        }
    })
});
/*创建MeScroll对象*/
function initMescroll(mescrollId,clearEmptyId){
    //创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,刷新列表数据;
    var mescroll = new MeScroll(mescrollId, {
        //上拉加载的配置项
        up: {
            callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
            noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
            empty: {
                icon: "option/mescroll-empty.png", //图标,默认null
                tip: "亲,暂无结果~", //提示
                //btntext: "去逛逛 >", //按钮,默认""
                /* btnClick: function(){//点击按钮的回调,默认null
                     alert("点击了按钮,具体逻辑自行实现");
                 }*/
            },
            toTop: {
                src: "option/mescroll-totop.png" //回到顶部按钮的图片路径
            },
            clearEmptyId: clearEmptyId //相当于同时设置了clearId和empty.warpId; 简化写法;默认null
        }
    });
    return mescroll;
}
/*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
function getListData(page){
    console.log(page)
    page.size = 15;
    if(page.goCount == 1){
        page.keyword = '';
        page.disease = '';
        page.hospitalId = '';
        page.beginDate = '';
        page.endDate = '';
        indexcount[curNavIndex] = 0;
    }else{
        page.keyword = getQueryString('keyword');
        page.disease = getQueryString('disease');
        page.hospitalId = getQueryString('hos');
        page.beginDate = getQueryString('start');
        page.endDate = getQueryString('end');
    }
    //联网加载数据
    console.log("curNavIndex="+curNavIndex+", page.num="+page.num);
    getListDataFromNet(curNavIndex, page.num, page.size,page.keyword,page.disease,page.hospitalId,page.beginDate,page.endDate,function(data){
        //联网成功的回调,隐藏上拉加载的状态
        console.log("data.length="+data.length);
        mescrollArr[curNavIndex].endSuccess(data.length);//传参:数据的总数; mescroll会自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
        //设置列表数据
        setListData(data);
        if(localStorage.getItem('salermanageScrollTop')!=null && localStorage.getItem('salermanageScrollTop')!= 0 && $('#mescroll'+curNavIndex).scrollTop() < localStorage.getItem('salermanageScrollTop')){
            $('#mescroll'+curNavIndex).scrollTop(localStorage.getItem('salermanageScrollTop'));
        }
    }, function(){
        //联网失败的回调,隐藏上拉加载的状态
        mescrollArr[curNavIndex].endErr();
    });
}
/*设置列表数据*/
function setListData(data){
    var listDom=$("#dataList" + curNavIndex);
    for (var i = 0; i < data.length; i++) {
        var pd=data[i];
        if(curNavIndex == 4){
            indexcount[curNavIndex] = indexcount[curNavIndex] + 1;
        }else{
            if(pd.deleteStatus != true){
                indexcount[curNavIndex] = indexcount[curNavIndex] + 1;
            }
        }
        switch (pd.status)
        {
            case 'unallot':
                pd.status = '未分诊';
                break;
            case 'allot':
                pd.status = '已分诊';
                break;
            case 'unchecked':
                pd.status = '未审核';
                break;
        }
        var str='';
        if(pd.status != 'coupon' && pd.deleteStatus == false){   //主管看到状态是没有被删的才显示
            /*if(curNavIndex == 0){*/
            str += '<div class="ticket mainmenu"> ' +
                '<div class="title" onclick="slideToggle(this)"> ' +
                '<input onclick="stopEvt(event)" valueid="'+pd.id+'" type="checkbox" class="option-input">'+
                '<label class="ticket_num">'+indexcount[curNavIndex]+'.咨询疾病：<span class="num">'+pd.disease+'</span></label>' +
                '<label class="ticket_status">' ;
            /*if(pd.deleteStatus == true){
                str += '<span class="status" style="color: red">已删除</span>'
            }else{*/
            str += '<span class="status">'+pd.status+'</span>'
            /*}*/
            str +='</label> ' +
                '</div> ' +
                '<div class="ticket_content submenu"> ' +
                '<p style="float: left;width: 48%;">患者姓名：<span>'+pd.name+'</span></p> ' +
                '<p style="float: right;width: 48%;">电话：<span><a href="tel:'+pd.mobile+'">'+pd.mobile+'</a></span></p> ' +
                '<p>意向医院：<span>'+pd.hospital+'</span>' ;
            if(pd.status == '未审核'){
                str +='<button class="revice" onclick="revice(this)" revicrid="'+pd.id+'">回访</button>' ;
                if(getQueryString('id') != null && pd.allotIs == false){
                    str +='<button class="revice" style="border: 1px solid #ff3d23;color: #ff3d23;margin-right: 4%;" onclick="checkdelOpen(this)" revicrid="'+pd.id+'">删除</button>' ;
                }
            }
            str +='</p> ' +
                '<p>咨询时间：<span>'+new Date(pd.createDate).Format('yyyy-MM-dd hh:mm:ss')+'</span>' ;
            if(pd.status != '未审核'){
                str +='<button class="revice" onclick="revice(this)" revicrid="'+pd.id+'">回访</button>' ;
                if(getQueryString('id') != null && pd.allotIs == false){  //allotIs为false 是未被分诊 可以删
                    str +='<button class="revice" style="border: 1px solid #ff3d23;color: #ff3d23;margin-right: 4%;" onclick="checkdelOpen(this)" revicrid="'+pd.id+'">删除</button>' ;
                }
            }
            /*'<button class="revice" style="margin-right: 4%" onclick="resetConsult(this)" revicrid="'+pd.id+'">修改</button>' +*/
            if(pd.status == '未审核'){
                str += '<button class="revice" style="border: 1px solid #ff3d23;color: #ff3d23" onclick="checkConsultOpen(this)" revicrid="'+pd.id+'">打回</button>' +
                    '<button class="revice" style="margin-right: 4%" salesmancount="'+pd.salesmanCount+'" advisorycount="'+pd.advisoryCount+'" onclick="checkConsult('+pd.id+',true,this)" revicrid="'+pd.id+'">通过</button>'
            }
            str +='</p> ' ;
            if(getQueryString('id') == null){
                str += '<p>所属业务员：<span>'+pd.salesmanName+'</span>' ;
                if(pd.allotIs == false){
                    str +='<button class="revice" style="border: 1px solid #ff3d23;color: #ff3d23" onclick="checkdelOpen(this)" revicrid="'+pd.id+'">删除</button>' ;
                }
                if(pd.salesmanCount > 1 || pd.advisoryCount > 1){
                    str +='<button class="revice" style="border: 1px solid #ff3d23;color: #ff3d23;margin-right: 4%;" onclick="chongOpen(this)" patientId="'+pd.patientId+'" valuemobile="'+pd.mobile+'">有重单风险</button>' ;
                }
                str +='</p>'
            }
            if(pd.intention){
                str += '<p>意向等级：<span>'+returnIntentStatus(pd.intention)+'</span></p>'
            }
            str += '</div> ' +
                '</div>';
        }
        if(pd.status != 'coupon' && pd.deleteStatus == true && curNavIndex == 4){   //主管看到回收站
            /*if(curNavIndex == 0){*/
            str += '<div class="ticket mainmenu"> ' +
                '<div class="title" onclick="slideToggle(this)"> ' +
                '<input onclick="stopEvt(event)" valueid="'+pd.id+'" type="checkbox" class="option-input">'+
                '<label class="ticket_num">'+indexcount[curNavIndex]+'.咨询疾病：<span class="num">'+pd.disease+'</span></label>' +
                '<label class="ticket_status">' ;
            /*if(pd.deleteStatus == true){
                str += '<span class="status" style="color: red">已删除</span>'
            }else{*/
            str += '<span class="status"  style="color: red">已删除</span>'
            /*}*/
            str +='</label> ' +
                '</div> ' +
                '<div class="ticket_content submenu"> ' +
                '<p style="float: left;width: 48%;">患者姓名：<span>'+pd.name+'</span></p> ' +
                '<p style="float: right;width: 48%;">电话：<span>'+pd.mobile+'</span></p> ' +
                '<p>意向医院：<span>'+pd.hospital+'</span>' ;
            str +='</p> ' +
                '<p>咨询时间：<span>'+new Date(pd.createDate).Format('yyyy-MM-dd hh:mm:ss')+'</span>' ;
            str +='</p> ' ;
            if(getQueryString('id') == null){
                str += '<p>所属业务员：<span>'+pd.salesmanName+'</span>' ;
                str +='<button class="revice" style="border: 1px solid #ff3d23;color: #ff3d23" onclick="checkdelOpen(this,false)" revicrid="'+pd.id+'">恢复</button>' ;
                str +='</p>'
            }
            if(pd.intention){
                str += '<p>意向等级：<span>'+returnIntentStatus(pd.intention)+'</span></p>'
            }
            str += '</div> ' +
                '</div>';
        }
        /*}else if(curNavIndex == 1){

        }else if(curNavIndex == 2){

        }*/
        listDom.append(str);
    }
}
function stopEvt(e) {
    e.stopPropagation();//阻止点击事件向上冒泡
}

/*联网加载列表数据*/
function getListDataFromNet(curNavIndex,pageNum,pageSize,keyword,disease,hospitalId,beginDate,endDate,successCallback,errorCallback) {
    /*  var url;
      if(subjectId == '' || subjectId == undefined){
          url = SERVER_ADDR + '/app/topthree/doctor/getList.json?pageNumber='+pageNum+'&pageSize='+pageSize;
      }else{
          url = SERVER_ADDR + '/app/topthree/doctor/getList.json?pageNumber='+pageNum+'&pageSize='+pageSize+'&subjectId='+subjectId;
      }*/
    var data = {};
    data.pageNumber = pageNum;
    data.pageSize = pageSize;
    data.delete = false;
    if(curNavIndex == 0){
        //data.type = 'product';
    }else if(curNavIndex == 1){
        data.status = 'unallot';
    }else if(curNavIndex == 2){
        data.status = 'allot';
    }else if(curNavIndex == 3){
        data.status = 'unchecked';
    }else if(curNavIndex == 4){
        data.delete = true;
    }
    if(getQueryString('id') != null){
        data.salesmanId = getQueryString('id');
    }
    if(hospitalId != '' && hospitalId != '请选择'){
        data.hospitalId = hospitalId;
    }
    if(keyword != ''){
        data.keyword = keyword;
    }
    if(disease != ''){
        data.disease = disease;
    }
    if(beginDate != ''){
        data.beginDate = beginDate;
    }
    if(endDate != ''){
        data.endDate = endDate;
    }
    //延时一秒,模拟联网
    $.ajax({
        type: 'GET',
        url: SERVER_ADDR + '/salesman/manager/getAdvisoryList.json',
        data:data,
        dataType: 'json',
        success: function(data){
            if(data.success == true){
                var data=data.data; // 模拟数据: ../res/pdlist1.js
                var listData=[];

                //奶粉
                for (var i = 0; i < data.length; i++) {
                    listData.push(data[i]);
                }
                //回调
                successCallback(listData);
            }else{
                alert(data.data)
            }
        },
        statusCode:{
            403:function () {
                window.location.href = 'login.html';
            }
        },
        error: errorCallback
    });
}
function revice(obj) {
    localStorage.setItem('salermanageCurNavIndex',curNavIndex);
    localStorage.setItem('salermanageScrollTop',$('#mescroll' + curNavIndex).scrollTop());
    window.location.href = 'advisoryList.html?id=' + $(obj).attr('revicrid')+ '&href="'+ window.location.href + '"';
}
function resetConsult(obj) {
    window.location.href = 'addConsult.html?id=' + $(obj).attr('revicrid');
}
function checkConsultOpen(obj) {
    $('.shadow,.layeropen').show();
    $('.accurate_btn').attr('valueid',$(obj).attr('revicrid'));
    //window.location.href = 'advisoryList.html?id=' + $(obj).attr('revicrid');
}
function resetAdvOpen(obj) {
    if($('.option-input:checked').length == 0){
        alert('请勾选需要重新分配的咨询');
        return;
    }
    var url = SERVER_ADDR + '/salesman/manager/getMembers.json';
    var Data = '';
    ajaxGetRetInfo(url, Data, function (retInfo) {
        $('.salesmanSelect').empty();
        retInfo.data.forEach(function (value) {
            $('.salesmanSelect').append('<option value="'+value.id+'">'+value.name+'</option>');
        })
    }, '请求失败', 'GET', true, undefined);

    $('.shadow,.layeropen2').show();
    $('.accurate_btn').attr('valueid',$(obj).attr('revicrid'));
    //window.location.href = 'advisoryList.html?id=' + $(obj).attr('revicrid');
}
function checkdelOpen(obj,bool) {
    var elThis = $(obj);
    var boolZi = bool;
    var layerAnswer;
    if(boolZi == false){
        layerAnswer = '确定要恢复咨询？';
    }else{
        layerAnswer = '确定要删除咨询？';
    }
    layer.open({
        content: layerAnswer
        ,btn: ['取消', '确定']
        ,no: function(index){
            var url = SERVER_ADDR + '/salesman/advisory/deleteAdvisory';
            var Data = {};
            Data.advisoryId = elThis.attr('revicrid');
            if(boolZi == false){
                Data.delete = false;
            }else{
                Data.delete = true;
            }
            ajaxGetRetInfo(url, Data, function (retInfo) {
                console.log(retInfo)
                if (retInfo.success == true) {
                    alert(retInfo.data);
                    elThis.parent().parent().parent().remove();
                }else {
                    alert(retInfo.data);
                }
            }, '请求失败', 'POST', true, undefined);
            layer.close(index);
        }
    });
}
function chongClose() {
    var index = SERVER_ADDR  + '1';
}
function chongOpen(obj) {
    var url = SERVER_ADDR + '/salesman/manager/getPatientAdvisory.json';
    var Data = {};
    Data.patientId = $(obj).attr('patientId');
    Data.mobile = $(obj).attr('valuemobile');
    ajaxGetRetInfo(url, Data, function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            var html = '';
            for(var i = retInfo.data.length-1;i>=0;i--){
                html+= '<tr><td>'+new Date(retInfo.data[i].createDate).Format('yyyy-MM-dd')+'</td><td>'+retInfo.data[i].disease+'</td><td>'+retInfo.data[i].storeName+'</td><td>'+retInfo.data[i].salesmanName+'</td></tr>';
            }
            /*retInfo.data.forEach(function (value) {

            });*/
            var htmlAppend = '<table class="layui-table" style="margin-top: 0">' +
                '<thead>' +
                '<tr>' +
                '<th>咨询时间</th>' +
                '<th width="35%">咨询项目</th>' +
                '<th>来源</th>' +
                '<th>咨询员</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody class="news_contentAdvisory">'+html+'</tbody>' +
                '</table>';
            layer.open({
                content: htmlAppend
            });
            $('.layui-m-layer0 .layui-m-layerchild').css('width','94%');
            $('.layui-m-layercont').css('max-height',$(window).height() - 200 + 'px').css('padding', '2px 2px');
        }else {
            alert(retInfo.data);
        }
    }, '请求失败', 'GET', true, undefined);

}
function checkConsult(advisoryId,val,obj) {
    console.log($(obj))
    var url = SERVER_ADDR + '/salesman/manager/checkAdvisory';
    var Data = {};
    Data.advisoryId = advisoryId;
    Data.passed = val;
    if(val == false){
        if($('.reason').val() == ''){
            alert('请输入打回原因');
            return;
        }else {
            Data.reason = $('.reason').val();
            adviosyToYesNo(url,Data);
        }
    }else if(val == true){
        if($(obj).attr('salesmancount') > 1 || $(obj).attr('advisorycount') > 1){
            layer.open({
                content: '该咨询有重单或者重复添加的可能，请认真核对是否确定通过！'
                ,btn: ['取消', '通过']
                ,no: function(index){
                    adviosyToYesNo(url,Data);
                    layer.close(index);
                }
            });
        }else{
            layer.open({
                content: '确定通过该咨询吗？'
                ,btn: ['取消', '通过']
                ,no: function(index){
                    adviosyToYesNo(url,Data);
                    layer.close(index);
                }
            });
        }
    }
}
function adviosyToYesNo(url,Data) {
    ajaxGetRetInfo(url, Data, function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            localStorage.setItem('salermanageCurNavIndex',curNavIndex);
            localStorage.setItem('salermanageScrollTop',$('#mescroll' + curNavIndex).scrollTop());
            window.location.reload();
        }else {
            alert(retInfo.data);
        }
    }, '请求失败', 'POST', true, undefined);
}
function sureResetAdv() {
    var url = SERVER_ADDR + '/salesman/manager/distributionAdvisory';
    var Data = {};
    var advCheckboxList = [];
    $('.option-input:checked').each(function () {
        advCheckboxList.push($(this).attr('valueid'));
    });
    advCheckboxList = advCheckboxList.join(',');
    Data.salesmanId = $('.salesmanSelect').val();
    Data.advisoryIds = advCheckboxList;
    ajaxGetRetInfo(url, Data, function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            alert(retInfo.data);
            window.location.reload();
        }else {
            alert(retInfo.data);
        }
    }, '请求失败', 'GET', true, undefined);
}