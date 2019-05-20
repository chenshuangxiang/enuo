//var areaData = address;
var $form;
var form;
var $;
var element;
var layer;
layui.use(['form','layer','upload','laydate','element'],function(){
	form = layui.form;
    layer = parent.layer === undefined ? layui.layer : parent.layer;
		$ = layui.jquery;
		$form = $('form');
		laydate = layui.laydate;
        element = layui.element;
        //loadProvince();
        if(window.location.href.indexOf('hosInfoParent') != -1){
            getHosDetail();//获取医院详细信息
            getHospitalInfo(); //获取医院信息开户行
        }
        if(window.location.href.indexOf('linkPeople') != -1){
            getPeople(); //商务联系人
        }
        //添加验证规则
        /*form.verify({
            oldPwd : function(value, item){
                if(value != "123456"){
                    return "密码错误，请重新输入！";
                }
            },
            newPwd : function(value, item){
                if(value.length < 6){
                    return "密码长度不能小于6位";
                }
            },
            confirmPwd : function(value, item){
                if(!new RegExp($("#oldPwd").val()).test(value)){
                    return "两次输入密码不一致，请重新输入！";
                }
            }
        })*/

        //判断是否修改过头像，如果修改过则显示修改后的头像，否则显示默认头像
        if(window.sessionStorage.getItem('userFace')){
        	$("#userFace").attr("src",window.sessionStorage.getItem('userFace'));
        }else{
        	$("#userFace").attr("src","../../images/face.jpg");
        }

        //提交个人资料
        form.on("submit(changeUser)",function(data){
        	var index = layer.msg('提交中，请稍候',{icon: 16,time:false,shade:0.8});
            setTimeout(function(){
                layer.close(index);
                layer.msg("提交成功！");
            },2000);
        	return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        })
        
/*$('.openimg').click(function () {

    var elThis = $(this);
   elThis.parent().next('div').show();
    console.log(getNaturalWidth($(this)).naturalWidth)
    getNaturalWidth($(this));

    layui.layer.open({
        type: 1,
        title: false,
        closeBtn: 1,
        area: [getNaturalWidth($(this)).naturalWidth + 'px', getNaturalWidth($(this)).naturalHeight+'px'],
        shadeClose: false,
        skin: 'yourclass',
        content: elThis,
        success: function () {
            elThis.css('width','inherit');
        },
        end: function () {
            elThis.parent().next('div').hide()
            elThis.css('width','50%');
        }

    })
});*/
        //修改密码
    form.on("submit(changePwd)", function (data) {
        var index = layer.msg('提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        var url = SERVER_ADDR + "/hospital/updatePassword";
        var Data = {};
        Data.password = $('#oldPwd').val();
        Data.newPassword = $('#newPwd').val();
        ajaxGetRetInfo(url, Data, function (retInfo) {
            console.log(retInfo)
            layer.close(index)
            if (retInfo.success) {
                layer.msg("密码修改成功！");
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            } else {
                layer.alert(retInfo.data,{icon:5});
            }
        }, '请求失败', 'POST', undefined, undefined);
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    //商务对接人
    form.on("submit(sureLinkPeople)", function (data) {
        var index = layer.msg('提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        var url = SERVER_ADDR + "/hospital/updateBusinessInfo";
        var Data = {};
        Data.name = $('#linkName').val();
        Data.mobile = $('#linkTel').val();
        ajaxGetRetInfo(url, Data, function (retInfo) {
            console.log(retInfo)
            layer.close(index)
            if (retInfo.success) {
                layer.msg("修改成功！");
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            } else {
                layer.alert(retInfo.data,{icon:5});
            }
        }, '请求失败', 'POST', undefined, undefined);
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    //医院信息开户行
    form.on("submit(hosInfoSub)", function (data) {
        var index = layer.msg('提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        var url = SERVER_ADDR + "/hospital/perfectInfo";
        var Data = {};
        Data.bank = $('.open_back').val();
        Data.accountName = $('.open_name').val();
        Data.account = $('.account').val();
        Data.financialContact = $('.financing_concat').val();
        Data.financialMobile = $('.financing_concat_phone').val();
        ajaxGetRetInfo(url, Data, function (retInfo) {
            console.log(retInfo)
            layer.close(index)
            if (retInfo.success) {
                layer.msg("修改成功！");
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            } else {
                layer.alert(retInfo.data,{icon:5});
            }
        }, '请求失败', 'POST', undefined, undefined);
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    })

})
function getPeople() {
    postget_ajax("/hospital/getBusinessInfo.json",'','GET',function(data){
        $('#linkName').val(data.data.name);
        $('#linkTel').val(data.data.mobile);
    });
}
function getHospitalInfo() {
    postget_ajax("/hospital/getHospitalInfo.json","",'GET',function(res){
        console.log(res);
        if(res.success){
            //初始化输入框
            $(".open_back").attr("value",res.data.bank);
            $(".open_name").attr("value",res.data.accountName);
            $(".account").attr("value",res.data.account);
            $(".financing_concat").attr("value",res.data.financialContact);
            $(".financing_concat_phone").attr("value",res.data.financialMobile);
        }else {
            layer.alert(res.data,{icon:5});
        }
    });
}
function getHosDetail() {
    postget_ajax("/hospital/getDetail.json",'','GET',function(res){
        console.log(res);
        if(res.success){
            $('.images img').attr('src',res.data.images[0]);
            $('.hos_name').text(res.data.name);
            $('.hos_grade').text(res.data.hospitalLevel);
            $('.hos_type').text(res.data.hospitalType);
            $('.hos_msg').text(res.data.brief);
            $('.businessContact').text(res.data.businessContact);
            $('.businessMobile').text(res.data.businessMobile);
            $('.phone').text(res.data.phone);
            $('.email').text(res.data.email);
            $('.address').text(res.data.address);
            $('.busInformation').text(res.data.busInformation);
            $('.website').text(res.data.website);
            $('.medicalLicenseNo').text(res.data.medicalLicenseNo);
            $('.medicalLicenseImage img').attr('src',res.data.medicalLicenseImage);
            $('.businessLicenseNo').text(res.data.businessLicenseNo);
            $('.businessLicenseImage img').attr('src',res.data.businessLicenseImage);
        }else {
            layer.alert(res.data,{icon:5});
        }
    });
}
 //加载省数据
function loadProvince() {
    var proHtml = '';
    for (var i = 0; i < areaData.length; i++) {
        proHtml += '<option value="' + areaData[i].provinceCode + '_' + areaData[i].mallCityList.length + '_' + i + '">' + areaData[i].provinceName + '</option>';
    }
    //初始化省数据
    $form.find('select[name=province]').append(proHtml);
    form.render();
    form.on('select(province)', function(data) {
        $form.find('select[name=area]').html('<option value="">请选择县/区</option>');
        var value = data.value;
        var d = value.split('_');
        var code = d[0];
        var count = d[1];
        var index = d[2];
        if (count > 0) {
            loadCity(areaData[index].mallCityList);
        } else {
            $form.find('select[name=city]').attr("disabled","disabled");
        }
    });
}
 //加载市数据
function loadCity(citys) {
    var cityHtml = '<option value="">请选择市</option>';
    for (var i = 0; i < citys.length; i++) {
        cityHtml += '<option value="' + citys[i].cityCode + '_' + citys[i].mallAreaList.length + '_' + i + '">' + citys[i].cityName + '</option>';
    }
    $form.find('select[name=city]').html(cityHtml).removeAttr("disabled");
    form.render();
    form.on('select(city)', function(data) {
        var value = data.value;
        var d = value.split('_');
        var code = d[0];
        var count = d[1];
        var index = d[2];
        if (count > 0) {
            loadArea(citys[index].mallAreaList);
        } else {
            $form.find('select[name=area]').attr("disabled","disabled");
        }
    });
}
 //加载县/区数据
function loadArea(areas) {
    var areaHtml = '<option value="">请选择县/区</option>';
    for (var i = 0; i < areas.length; i++) {
        areaHtml += '<option value="' + areas[i].areaCode + '">' + areas[i].areaName + '</option>';
    }
    $form.find('select[name=area]').html(areaHtml).removeAttr("disabled");
    form.render();
    form.on('select(area)', function(data) {
        //console.log(data);
    });
}