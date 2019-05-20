var curNavIndex=0;
function init() {
    Go.havecertification();
    Go.community();
    Go.toInfo();
    Go.tocommunity_doctorInfo();
    Go.tocommunity_nurseInfo();
}
function imgFile(obj) {
    console.log(obj)
    var elThis = $(obj);
    /* 压缩图片 */
    lrz(obj.files[0], {
        width: 1000 //设置压缩参数
    }).then(function (rst) {
        /* 处理成功后执行 */
        rst.formData.append('base64img', rst.base64); // 添加额外参数
        $.ajax({
            url: "/common/file/upload",
            type: "POST",
            data: rst.formData,
            dataType : 'json',
            cache: false,
            processData: false,
            contentType: false,
            success: function (data) {
                console.log(data);
                if (data.success == true) {
                    //$('.appendBefore').remove()
                    elThis.parent().next('.doctorFileImg').empty().append('<span class="photoPost"><img src="'+data.data+'"><span class="delPhoto" onclick="Go.delPhoto(this)">删除</span></span>')
                    if(is_weixn()){
                        funcReadImgInfo($('.doctorFileImg img'));
                    }else{
                        $('.doctorFileImg img').fsgallery();
                    }
                    $('input[type="file"]').val('');
                }else {
                    alert(data.data)
                }
            }
        });
    }).catch(function (err) {
        /* 处理失败后执行 */
    }).always(function () {
        /* 必然执行 */
    })
}
var Go = {
    delPhoto:function (obj) {
        $(obj).parent().remove();
    },
    havecertification:function(){ //是否实名认证
        var url = SERVER_ADDR + '/app/user/identify/certificationState';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.havecertificationSuccess, '请求失败', 'GET', true, undefined);
    },
    havecertificationSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            if(retInfo.data.actualNameCertification == true){
                $('.userRealName').val(retInfo.data.fullname).prop('disabled',true);
                $('.idcard').val(retInfo.data.idCard).prop('disabled',true);
                $('.certification').attr('onclick','').text('已认证');
                /*初始化菜单*/
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
                    }
                });
            }else{
                /*初始化菜单*/
                $(".nav p").click(function(){
                    var i=Number($(this).attr("i"));
                    if(i==1 || i==2){
                        alert('请先实名认证')
                        return
                    }
                    if(curNavIndex!=i) {
                        //更改列表条件
                        $(".nav .active").removeClass("active");
                        $(this).addClass("active");
                        //隐藏当前列表
                        $("#mescroll"+curNavIndex).hide();
                        //显示对应的列表
                        curNavIndex=i;
                        $("#mescroll"+curNavIndex).show();
                    }
                });
            }
        }else{
            alert(retInfo.data);
        }
    },
    certification:function(){ //实名认证
        if($('.userRealName').val().trim().length <= 1){
            alert('请输入真实姓名');
            return;
        }
        if($('.idcard').val().trim().length != 18){
            alert('请输入正确的身份证号');
            return;
        }
            var url = SERVER_ADDR + '/app/user/go/identify/certification';
            var Data = {};
            Data.fullname = $('.userRealName').val().trim();
            Data.idCard = $('.idcard').val().trim();
            ajaxGetRetInfo(url, Data, this.certificationSuccess, '请求失败', 'POST', true, undefined);
    },
    certificationSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            alert('实名认证成功');
            window.location.reload();
        }else{
            alert(retInfo.data);
        }
    },
    toInfo:function () { //获取信息初始化
        var url = SERVER_ADDR + '/app/user/myInfo';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.infoSuccess, '请求失败', 'GET', true, undefined);
    },
    infoSuccess: function (res) {
        if (res.success == true) {
            $('.userName').val(res.data.fullname);
            $('.mobile').val(res.data.mobile);
            //$('.sex[value="man"][name="sexNurse"]').prop("checked",true) ;
        } else {
            alert(res.data);
        }
    },
    tocommunity_doctorInfo:function () { //获取医生信息初始化
        var url = SERVER_ADDR + '/app/user/community_doctor/getInfo';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.tocommunity_doctorInfoSuccess, '请求失败', 'POST', true, undefined);
    },
    tocommunity_doctorInfoSuccess: function (res) {
        if (res.success == true) {
            $('.sex[value="'+res.data.sex+'"][name="sexDoctor"]').prop("checked",true) ;
            $('.communityDoctor').val(res.data.communityId);
            $('.breifDoctor').val(res.data.selfDescription);
            $('.zhiyeNumDoctor').val(res.data.practisingCertificateNum);
            $('.doctorZigeNum').val(res.data.qualificationCertificateNum);
            $('.doctorQitaNum').val(res.data.otherNum);
            $('.zhiyeDoctorImg').append('<span class="photoPost"><img src="'+res.data.practisingCertificate+'"><span class="delPhoto" onclick="Go.delPhoto(this)">删除</span></span>');
            $('.zigeDoctorImg').append('<span class="photoPost"><img src="'+res.data.qualificationCertificate+'"><span class="delPhoto" onclick="Go.delPhoto(this)">删除</span></span>')
            if(res.data.otherPic){
                $('.qitaDoctorImg').append('<span class="photoPost"><img src="'+res.data.otherPic+'"><span class="delPhoto" onclick="Go.delPhoto(this)">删除</span></span>')
            }
            //$('.userName').val(res.data.fullname);
            //$('.mobile').val(res.data.mobile);
            //$('.sex[value="man"][name="sexNurse"]').prop("checked",true) ;
        } else {
            if(res.data != '查无此人'){
                alert(res.data);
            }
        }
    },
    tocommunity_nurseInfo:function () { //获取护士信息初始化
        var url = SERVER_ADDR + '/app/user/community_nurse/getInfo';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.tocommunity_nurseInfoSuccess, '请求失败', 'POST', true, undefined);
    },
    tocommunity_nurseInfoSuccess: function (res) {
        if (res.success == true) {
            $('.sex[value="'+res.data.sex+'"][name="sexNurse"]').prop("checked",true) ;
            $('.communityNurse').val(res.data.communityId);
            $('.breifNurse').val(res.data.selfDescription);
            $('.nurseZhiyeNum').val(res.data.practisingCertificateNum);
            $('.nurseZigeNum').val(res.data.qualificationCertificateNum);
            $('.nurseQitaNum').val(res.data.otherNum);
            $('.zhiyeNurseImg').append('<span class="photoPost"><img src="'+res.data.practisingCertificate+'"><span class="delPhoto" onclick="Go.delPhoto(this)">删除</span></span>');
            $('.zigeNurseImg').append('<span class="photoPost"><img src="'+res.data.qualificationCertificate+'"><span class="delPhoto" onclick="Go.delPhoto(this)">删除</span></span>')
            if(res.data.otherPic){
                $('.qitaNurseImg').append('<span class="photoPost"><img src="'+res.data.otherPic+'"><span class="delPhoto" onclick="Go.delPhoto(this)">删除</span></span>')
            }
        } else {
            if(res.data != '查无此人'){
                alert(res.data);
            }

        }
    },
    community:function(){ //社区列表
        var url = SERVER_ADDR + '/app/user/community/json/list';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.communitySuccess, '请求失败', 'GET', true, undefined);
    },
    communitySuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            retInfo.data.forEach(function (value) {
                $('.community').append('<option value="'+value.id+'">'+value.name+'</option>')
            })

        }else{
            alert(retInfo.data);
        }
    },
    bindDoctor: function () { //提交医生审核
        if(!$.verify($('.communityDoctor').val(),"滚动选择社区名称")){return false;}
        if(!$.verify($('.breifDoctor').val(),"请输入自我简介")){return false;}
        if(!$.verify($('.zhiyeDoctorImg').find('img').attr('src'),"请上传医师执业证照片")){return false;}
        if(!$.verify($('.zhiyeNumDoctor').val(),"请输入医师执业证编码")){return false;}
        if(!$.verify($('.zigeDoctorImg').find('img').attr('src'),"请上传医师资格证照片")){return false;}
        if(!$.verify($('.doctorZigeNum').val(),"请输入医师资格证编码")){return false;}
        var url = SERVER_ADDR + '/app/user/community_doctor/info/edit';
        var Data = {};
        Data.fullname = $('.userNameDoctor').val();
        Data.sex = $('.sex[name="sexDoctor"][value="man"]').is(':checked') ? 'man' : 'woman';
        Data.mobile = $('.mobileDoctor').val();
        Data.communityId = $('.communityDoctor').val();
        Data.selfDescription = $('.breifDoctor').val();
        Data.practisingCertificate = $('.zhiyeDoctorImg').find('img').attr('src');
        Data.practisingCertificateNum = $('.zhiyeNumDoctor').val();
        Data.qualificationCertificate = $('.zigeDoctorImg').find('img').attr('src');
        Data.qualificationCertificateNum = $('.doctorZigeNum').val();
        Data.otherPic = $('.qitaDoctorImg').find('img').attr('src');
        Data.otherNum = $('.doctorQitaNum').val();
        ajaxGetRetInfo(url, Data, this.bindDoctorSuccess, '请求失败', 'POST', true, undefined);
    },
    bindDoctorSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            alert('提交成功！等待审核(1-3个工作日)')
            window.location.reload();
        } else {
            alert(retInfo.data);
        }
    },
    bindNurse: function () { //提交护士审核
        if(!$.verify($('.communityNurse').val(),"滚动选择社区名称")){return false;}
        if(!$.verify($('.breifNurse').val(),"请输入自我简介")){return false;}
        if(!$.verify($('.zhiyeNurseImg').find('img').attr('src'),"请上传护士执业证照片")){return false;}
        if(!$.verify($('.nurseZhiyeNum').val(),"请输入护士执业证编码")){return false;}
        if(!$.verify($('.zigeNurseImg').find('img').attr('src'),"请上传护士资格证照片")){return false;}
        if(!$.verify($('.nurseZigeNum').val(),"请输入护士资格证编码")){return false;}
        var url = SERVER_ADDR + '/app/user/community_nurse/info/edit';
        var Data = {};
        Data.fullname = $('.userNameNurse').val();
        Data.sex = $('.sex[name="sexNurse"][value="man"]').is(':checked') ? 'man' : 'woman';
        Data.mobile = $('.mobileNurse').val();
        Data.communityId = $('.communityNurse').val();
        Data.selfDescription = $('.breifNurse').val();
        Data.practisingCertificate = $('.zhiyeNurseImg').find('img').attr('src');
        Data.practisingCertificateNum = $('.nurseZhiyeNum').val();
        Data.qualificationCertificate = $('.zigeNurseImg').find('img').attr('src');
        Data.qualificationCertificateNum = $('.nurseZigeNum').val();
        Data.otherPic = $('.qitaNurseImg').find('img').attr('src');
        Data.otherNum = $('.nurseQitaNum').val();
        ajaxGetRetInfo(url, Data, this.bindNurseSuccess, '请求失败', 'POST', true, undefined);
    },
    bindNurseSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            alert('提交成功！等待审核(1-3个工作日)');
            window.location.reload();
        } else {
            alert(retInfo.data);
        }
    }
}

