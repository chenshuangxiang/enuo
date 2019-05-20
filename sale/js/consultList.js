$(document).ready(function () {

})

var mescrollArr=new Array(5);//4个菜单所对应的4个mescroll对象
var localSalerCurNavIndex = Number(localStorage.getItem('salerCurNavIndex'));
var curNavIndex = localSalerCurNavIndex;//全部0; 未分诊1; 已分诊2; 未审核3; 未通过4
mescrollArr[localSalerCurNavIndex]=initMescroll("mescroll" + localSalerCurNavIndex, "dataList" + localSalerCurNavIndex);
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
            localStorage.removeItem('salerScrollTop');
            if(mescrollArr[i]==null){
                mescrollArr[i]=initMescroll("mescroll"+i, "dataList"+i);
                indexcount[curNavIndex] = 0;
            }
            localStorage.setItem('salerCurNavIndex',curNavIndex);
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
        indexcount[curNavIndex] = 0;
        page.keyword = '';
        page.disease = '';
        page.hospitalId = '';
        page.beginDate = '';
        page.endDate = '';
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
        if(localStorage.getItem('salerScrollTop')!=null && localStorage.getItem('salerScrollTop')!= 0 && $('#mescroll'+curNavIndex).scrollTop() < localStorage.getItem('salerScrollTop')){
            $('#mescroll'+curNavIndex).scrollTop(localStorage.getItem('salerScrollTop'));
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

        indexcount[curNavIndex] = indexcount[curNavIndex] + 1;

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
            case 'notPass':
                pd.status = '未通过';
                break;
        }
        if( pd.status != 'coupon'){
            var str='';
            /*if(curNavIndex == 0){*/
            str += '<div class="ticket mainmenu"> ' +
                '<div class="title" onclick="slideToggle(this)"> ' +
                '<label class="ticket_num">'+indexcount[curNavIndex]+'.咨询疾病：<span class="num">'+pd.disease+'</span></label>' +
                '<label class="ticket_status">' ;
            if(pd.deleteStatus == true){
                str += '<span class="status" style="color: red">已删除</span>'
            }else{
                str += '<span class="status">'+pd.status+'</span>'
            }
            str +=  '</label> ' +
                '</div> ' +
                '<div class="ticket_content submenu"> ' +
                '<p style="float: left;width: 48%;">患者姓名：<span>'+pd.name+'</span></p> ' +
                '<p style="float: right;width: 48%;">电话：<span><a href="tel:'+pd.mobile+'">'+pd.mobile+'</a></span></p> ' +
                '<p>意向医院：<span>'+pd.hospital+'</span></p> ' +
                '<p>咨询时间：<span>'+new Date(pd.createDate).Format('yyyy-MM-dd hh:mm:ss')+'</span>' ;
            if(pd.deleteStatus != true){
                str +=  '<button class="revice" onclick="revice(this)" revicrid="'+pd.id+'">回访</button>' ;
            }
            if(pd.status == '未通过' && pd.deleteStatus != true){
                str += '<button class="revice" style="margin-right: 4%" onclick="resetConsult(this)" revicrid="'+pd.id+'">修改</button></p> '
                str += '<p>未通过原因：<span>'+pd.reason+'</span></p>'
                if(pd.intention){
                    str += '<p>意向等级：<span>'+returnIntentStatus(pd.intention)+'</span></p>'
                }
            }else{
                if(pd.intention){
                    str += '<p>意向等级：<span>'+returnIntentStatus(pd.intention)+'</span></p>'
                }
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
/*联网加载列表数据*/
function getListDataFromNet(curNavIndex,pageNum,pageSize,keyword,disease,hospitalId,beginDate,endDate,successCallback,errorCallback) {
    /*  var url;
      if(subjectId == '' || subjectId == undefined){
          url = SERVER_ADDR + '/app/topthree/doctor/getList.json?pageNumber='+pageNum+'&pageSize='+pageSize;
      }else{
          url = SERVER_ADDR + '/app/topthree/doctor/getList.json?pageNumber='+pageNum+'&pageSize='+pageSize+'&subjectId='+subjectId;
      }*/
    /** 未分诊 */
    /*unallot,

        /!** 已分诊 *!/
        allot,

        /!** 体验券 *!/
        coupon,

        /!*未审核*!/
        unchecked,

        /!*未通过*!/
        notPass*/
    var data = {};
    data.pageNumber = pageNum;
    data.pageSize = pageSize;
    if(curNavIndex == 0){
        //data.type = 'product';
    }else if(curNavIndex == 1){
        data.status = 'unallot';
    }else if(curNavIndex == 2){
        data.status = 'allot';
    }else if(curNavIndex == 3){
        data.status = 'unchecked';
    }else if(curNavIndex == 4){
        data.status = 'notPass';
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
        url: SERVER_ADDR + '/salesman/advisory/getList.json',
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
    localStorage.setItem('salerCurNavIndex',curNavIndex);
    localStorage.setItem('salerScrollTop',$('#mescroll' + curNavIndex).scrollTop());
    window.location.href = 'advisoryList.html?id=' + $(obj).attr('revicrid');
}
function resetConsult(obj) {
    localStorage.setItem('salerCurNavIndex',curNavIndex);
    localStorage.setItem('salerScrollTop',$('#mescroll' + curNavIndex).scrollTop());
    window.location.href = 'addConsult.html?id=' + $(obj).attr('revicrid');
}