$(document).ready(function () {
   Go.init();
});
//完善信息ajax
var Go = {
    no:1,
    init:function () {
        if(getQueryString('addcount') == 1){
            $('.continueAdd').css('color','#cccccc').attr("disabled",true);
        }
    },
    prev:function () {
        this.no--;
        console.log(this.no);
        $('.oneUser').hide();
        $('.oneUser' + this.no).show();
        $('.continueAdd').css('color','#38b69a').attr("disabled",false);
        if(this.no == 1){
            $('.continueBack').css('color','#cccccc').attr("disabled",true);
        }else{
            $('.continueAdd').attr("disabled",false);
        }
    },
    next:function () {
        console.log($('.oneUser'+this.no).find('.userSelect').val())
        if($('.oneUser'+this.no).find('.userSelect').val() == 0){
            alert('请选择关系');
            return;
        }
        if($('.oneUser'+this.no).find('.userName').val().trim() == '' || $('.oneUser'+this.no).find('.userName').val().trim().length == 1){
            alert('请输入真实姓名');
            return;
        }
        if($('.oneUser'+this.no).find('.mobile').val().trim() == ''){
            Go.nextTo();
        }else{
            if (check(/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test($('.oneUser'+this.no).find('.mobile').val().trim()) === true, "请输入正确的手机号！")) {
                Go.nextTo();
            }
        }
    },
    nextTo:function () {
        this.no++;
        console.log(this.no)
        $('.oneUser').hide();
        $('.oneUser' + this.no).show();
        if(getQueryString('addcount') == this.no){
            $('.continueAdd').css('color','#cccccc').attr("disabled",true);
        }
        $('.continueBack').css('color','#38b69a');
        if(this.no == 4){
            $('.continueAdd').css('color','#cccccc').attr("disabled",true);
        }else{
            $('.continueBack').attr("disabled",false);
        }
    },
    getFamilies: function (m) {
        var familiesList = [];
        $(m).each(function (value) {
            console.log(value)
            if(getQueryString('addcount') >= Number(value + 1)){
                if($(this).find('.userSelect').val() != 0 && $(this).find('.userName').val() != ''){
                    var oneFamilies = {};
                    console.log($(this));
                    oneFamilies.relationship = $(this).find('.userSelect').val();
                    oneFamilies.fullName = $(this).find('.userName').val();
                    oneFamilies.mobile = $(this).find('.mobile').val();
                    familiesList.push(oneFamilies);
                }
            }
        });
        return JSON.stringify(familiesList);
    },
    post:function(){
        var url = SERVER_ADDR + '/app/NursingCardUser/addNursingCardUser';
        var Data = {};
        Data.map = Go.getFamilies($('.oneUser '));
        ajaxGetRetInfo(url, Data, this.postSuccess, '请求失败', 'POST', true, undefined);
    },
    postSuccess:function (retInfo) {
        /*retInfo = JSON.parse(retInfo);*/
        if(retInfo.success == true){
            console.log(retInfo)
            /*alert(retInfo.data)*/
            //完善成功跳转
            alert('添加成功');
            window.location.href = 'myHuliCard.html';
        }else{
            alert(retInfo.data)
        }
    }
}
function check( phoneNum, errorMsg) {
    'use strict';
    if (!phoneNum) {
        alert(errorMsg);
    }
    return phoneNum;
}