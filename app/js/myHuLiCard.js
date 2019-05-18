var chika;
var huliCardId;
var myId;
var orderId;
var peopleCount;
function init() {
    Get.huliCard();
   // Get.tuiMore();
  /*  $(window).scroll(function(){
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if(scrollTop + windowHeight - scrollHeight == 0 ){
            console.log("you are in the bottom");
            if(total > $('.hos_doc_child').length){
                Get.tuiMore();
            }
        }
    });*/
    $('.levelClick').click(function () {
        $('.levelClick').removeClass('borderActive').addClass('border');
        $(this).addClass('borderActive');
        myId = $(this).attr('valueid');
    });
    /*$('.paybackclose').click(function () {
       $('.paybackOpen').hide();
    });*/
    $('.add').click(function () {
        if(peopleCount >= 5){
            alert('添加人数已满');
        }else{
            window.location.href = 'add_huliuser.html?addcount='+ (5 - peopleCount);
        }
    });
}
//获取医美整形功能
var Get = {
    huliCard:function () {  //护理卡详情
        var url = SERVER_ADDR + '/app/NursingCardUser/myNursingCard.json';
        var Data = '';
       // Data.id = getQueryString('id');
        ajaxGetRetInfo(url, Data, this.huliCardSuccess, '请求失败', 'GET', true, undefined);
    },
    huliCardSuccess:function (retInfo) {
        if(retInfo.success == true){
            if(retInfo.data && retInfo.data.cardInfo){
                $('.haveHuliCard').show();
                //$('.noHuliCard').hide();
                Get.huliCardDetail(retInfo.data);
            }
        }else{
            window.location.href = 'activityHuLiCard.html'
            //$('.haveHuliCard,.add').hide();
            //$('.noHuliCard').show();
            //alert(retInfo.data)
        }
    },
    huliCardDetail:function (retInfo) {  //护理卡详情信息加入
        $('.huliCardNum').text(retInfo.cardInfo.cardNumber);
        $('.huliCardEnd').text(retInfo.cardInfo.endDate);
        $('.surplusXiya').text(retInfo.cardInfo.toothWashing + '次');
        $('.surplusBaya').text(retInfo.cardInfo.toothExtraction + '颗');
        $('.surplusBuya').text(retInfo.cardInfo.tooth_filling + '颗');
        huliCardId = retInfo.cardInfo.id;
        orderId = retInfo.cardInfo.orderId;
        if(retInfo.cardInfo.toothWashing == 0){
            $('.xiyaBtn').attr('disabled',true).css('background-color','#cccccc');
        }
        if(retInfo.cardInfo.toothExtraction == 0){
            $('.bayaBtn').attr('disabled',true).css('background-color','#cccccc');
        }
        if(retInfo.cardInfo.tooth_filling == 0){
            $('.buyaBtn').attr('disabled',true).css('background-color','#cccccc');
        }
        peopleCount = retInfo.cardInfo.peopleCount;

        if(retInfo.cardUserList.length <= 1){
            $('.bangkaSpan').html("暂无绑卡人<br><button class='toBind' onclick='hrefBind()'>添加使用人</button>");
        }
        retInfo.cardUserList.forEach(function (value) {
            console.log(value)
            switch (value.relationship){
                case 'father':
                    value.relationship = '父亲';
                    break;
                case 'mother':
                    value.relationship = '母亲';
                    break;
                case 'fatherInLaw':
                    value.relationship = '岳父';
                    break;
                case 'motherInLaw':
                    value.relationship = '岳母';
                    break;
                case 'spouse':
                    value.relationship = '配偶';
                    break;
                case 'brotherAndSister':
                    value.relationship = '兄妹';
                    break;
                case 'children':
                    value.relationship = '子女';
                    break;
            }
            var html = '';
            if(value.holderIs ==true){  //如果没有家属关系的，就是持卡者
                $('.chikaNameText').text(value.fullname);
            }else {
                html += '<span class="bangkaNameSpan" valueid="' + value.id + '">'
                if (value.currentIs == true) {
                    html += '<span class="chikaName bangkaName" style="color: #38b69a">' + value.fullname + '</span>'
                } else {
                    html += '<span class="chikaName bangkaName">' + value.fullname + '</span>'
                }
                html += '<button class="guanxi">' + value.relationship + '</button></span>';
                $('.bangkaSpan').append(html);
            }
            $('.familyList ul').append('<li class="levelClick border" valueid="'+value.id+'"><span>'+value.fullname+'</span></li>');
            //判断登录人是持卡人设置chika 为true,
            if(value.holderIs == true && value.currentIs == true){ //登录人是持卡人的话 预约myId绑到按钮上
                    chika = true;
                    $('.chikaNameText').css('color','#38b69a');
            }else if(value.currentIs == true){ //登录人是被绑人的话 预约myId绑到按钮上
                $('.xiyaBtn,.bayaBtn,.buyaBtn').attr('valueid',value.id);
            }
        })
    }
}
function href(obj) {
    if($(obj).attr('isPreferential') == 'true'){
        window.location.href = 'special_cp.html?itemId='+ $(obj).attr('specialId');
    }else if($(obj).attr('isPreferential') == 'false'){
        window.location.href = 'cp.html?cpId='+ $(obj).attr('specialId');
    }
}
function hrefBind() {
    window.location.href = "add_huliuser.html?addcount=4";
}
var Show = {
    chooseFamily:function (value,obj) { //如果登录人是持卡人可以帮人预约，如果登录人是被绑定人直接预约
        console.log(value,obj);
        if(chika == true){  //登录人是持卡人
            $('.modelOpen').show();
            $('.toYuyue').attr('typeForTooth',value);
        }else{ //登录人是绑卡人
            window.location.href = 'pay/dos_yuyue.html?docId='+ orderId +'&huliCardId='+ huliCardId + '&nursingCardUserId=' + $(obj).attr('valueid') + '&type=nursingCard&typeForTooth=' + value;
        }
    },
    chooseFamilyHref:function () {
        if(myId == undefined){
            alert('请点击选择预约对象');
        }else {
            window.location.href = 'pay/dos_yuyue.html?docId='+ orderId + '&huliCardId='+ huliCardId + '&nursingCardUserId=' + myId + '&type=nursingCard&typeForTooth=' + $('.toYuyue').attr('typeForTooth');
        }
    },
    func:function () {
        $('.ks_list').slideToggle();
        var statusZi = $('.shouqi .font_green');
        if(statusZi.text() == '收起'){
            statusZi.text('展开');
            $('.shouqi img').css('transform','rotate(0deg)');
        }else{
            statusZi.text('收起');
            $('.shouqi img').css('transform','rotate(180deg)');
        }
    }
}