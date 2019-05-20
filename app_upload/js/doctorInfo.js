
function init() {
    Go.toInfo();
}
var Go = {
    toInfo:function () { //获取信息初始化
        var url = SERVER_ADDR + '/communityUserRole/doctorInfo';
        var Data = {};
        Data.communityUserRoleId = getQueryString('id');
        ajaxGetRetInfo(url, Data, this.infoSuccess, '请求失败', 'GET', true, undefined);
    },
    infoSuccess: function (res) {
        if (res.success == true) {
            $('.headImg').attr('src',res.data.headImgUrl);
            $('.userName').text(res.data.fullname);
            $('.mobile').val(res.data.mobile);
            $('.breifDoctor').val(res.data.selfDescription);
            if(res.data.age){
                $('.userAgeDoctor').val(res.data.age);
            }else{
                $('.userAgeDoctor').val(getAge(res.data.birthday));
            }
            if(res.data.sex == 'woman'){
                $('.healthSexImg').attr('src','img/health/healthWoman.png');
                $('.sexname').text('女')
            }
            if(res.data.actualNameCertification == true){
                $('.renzhen').attr('src','img/user_center/alreadyRealName.png');
                $('.renzhenZi').text('已认证');
            }else{
                $('.renzhenZi').text('未认证');
            }
            //$('.sex[value="man"][name="sexNurse"]').prop("checked",true) ;
        } else {
            alert(res.data);
        }
    }
}

