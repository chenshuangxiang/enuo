var pageNumber = 1;
var total = 5;
function init() {
    $('.nowDay').text(new Date().Format('yyyy-MM-dd'));
    $('.ceTime').html(new Date().Format('hh:mm'));
    Go.tuiMore();
    $(window).scroll(function(){
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if(scrollTop + windowHeight - scrollHeight == 0 ){
            console.log("you are in the bottom");
            if(total > $('.addShuju').length){
                Go.tuiMore();
            }
        }
    });
    var numArr1=['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24'];
    var numArr2=['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59'];
    var numArr3=['点'];
    var numArr4=['分'];
    var mobileSelect3 = new MobileSelect({
        trigger: '#trigger3',
        title: '选择时间',
        wheels: [
            {data: numArr1},
            {data: numArr3},
            {data: numArr2},
            {data: numArr4}
        ],
        position:[0,0,0,0],
        //transitionEnd:function(indexArr, data){
        //    console.log(data);
        //},
        callback:function(indexArr, data){
            //$("#trigger3").html("ccccccccccccccccccccc");
        }
    });
    $('.wheel').eq(0).css('width','35%');
    $('.wheel').eq(1).css('width','15%');
    $('.wheel').eq(2).css('width','35%');
    $('.wheel').eq(3).css('width','15%');
    var str = $('#trigger3 span').text();
    str.substring(0,str.length-1)
}
var Go = {
    xueya: function () { //添加血压
        var url = SERVER_ADDR + '/app/user/bloodPressure/addBloodPressure';
        var Data = {};
        Data.maximumPressure = $('.maximumPressure').val();
        Data.minimumPressure = $('.minimumPressure').val();
        Data.heartRate = $('.heartRate').val();
        Data.monitoringDatetime = $('.nowDay').text() + ' ' +$('.ceTime').text() + ':00';
        //Data.monitoringDatetime = $('.nowDay').text() + ' ' +$('.ceTime').text() + ':00';
        //Data.WhoCommit = 'user';
        ajaxGetRetInfo(url, Data, this.xueyaSuccess, '请求失败', 'POST', true, undefined);
    },
    xueyaSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            alert(retInfo.data);
            window.location.reload();
        } else {
            alert(retInfo.data);
        }
    },
    tuiMore:function () {  //加入血压接口
        var url = SERVER_ADDR + '/app/user/bloodPressure/findPage';
        var Data = {};
        Data.pageNumber = pageNumber;
        Data.pageSize = 5;
        ajaxGetRetInfo(url, Data, this.tuiMoreSuccess, '请求失败', 'GET', true, undefined);
    },
    tuiMoreSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            if(retInfo.data && retInfo.data.content.length > 0){
                Go.addTui(retInfo.data.content);
            }
            total = retInfo.totalCount;
        }else{
            alert(retInfo.data)
        }
    },
    addTui:function (retInfo) {  //加入推荐
        retInfo.forEach(function (value) {
            console.log(value)
            var html = '';
            html += '<li class="hos_child addShuju set_box_shadow"> ' +
                '<div class="hos_list_top clearfix"> ' +
                '<div class="yuyueTop"> ' +
                '<span class="famousName hosName">血压</span> ' +
                '</div> ' +
                '<div class="orderContent"> ' +
                '<div class="left"><img src="img/health/xueya.png"></div> ' +
                '<div class="right"> ' +
                '<p class="detail"> ' +
                '<span class="name">高压  '+value.maximumPressure+'mmHg</span> ' +
                '</p> ' +
                '<p class="detail"> ' +
                '<span class="name">低压 '+value.minimumPressure+'mmHg</span> ' +
                '</p> ' +
                '<p class="detail" style="margin-bottom: .45rem;"> ' +
                '<span class="name">心率 '+value.heartRate+'bpm</span> ' +
                '</p> ' +
                '<p class="orderdetailchoose" style="    margin-bottom: .5rem;"> ' +
                '<span>测量时间：</span> ' +
                '<span class="orderdetailchooseName">'+new Date(value.createDate).Format('yyyy-MM-dd hh:mm:ss')+'</span> ' +
                '</p> ' +
                '</div> ' +
                '</div> ' +
                '</div> ' +
                '</li>';
            //$('.hos_list').append(html);
            $('#mescroll3').append(html);
        })
        //$('.hos_doc_child:last-child').css('border-bottom','0');
        pageNumber++;
    }
}