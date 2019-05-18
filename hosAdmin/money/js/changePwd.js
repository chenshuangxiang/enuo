/*
var layer;
layui.use(['form','layer','upload','laydate','jquery'],function(){
	var form = layui.form();
    layer = parent.layer === undefined ? layui.layer : parent.layer;
		var $ = layui.jquery;
        //添加验证规则
       /!* form.verify({
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
        })*!/
        //修改密码

        form.on("submit(changePwd)",function(data){

        })

})
function changePwd() {
    var Data = {};
    Data.password =  $("#Pwd").val();
    Data.oldPasswowrd =  $("#oldPwd").val();
    //var index = layer.msg('提交中，请稍候',{icon: 16,time:false,shade:0.8});
    ajaxGetRetInfo(SERVER_ADDR + '/admin/admin/updatePassword',Data,function (retInfo) {
        console.log(retInfo)
        layer.close(index);
        if(retInfo.success){
            layer.msg(retInfo.data);
            //window.location.reload();
        }else{
            layer.alert(retInfo.data,{icon:5});
        }
    },'请求失败', 'POST', undefined, undefined);
}*/
var $;
var layer;
layui.use(['form', 'jquery', 'layer'], function () {
    $ = layui.jquery;
    var form = layui.form;
    layer = layui.layer;
    console.log(form)
    //修改账户密码
    form.on("submit(changePwd)", function (data) {
        if($('#PwdAgain').val() != $('#Pwd').val()){
            layer.msg('两次输入的密码不一致');
            return
        }
        var index = layer.msg('提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        var url = SERVER_ADDR + "/hospital/updatePassword";
        var Data = {};
        Data.password = $('#oldPwd').val();
        Data.newPassword = $('#Pwd').val();
        ajaxGetRetInfo(url, Data, function (retInfo) {
            console.log(retInfo)
            layer.close(index)
            if (retInfo.success) {
                layer.msg("账户密码修改成功！");
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            } else {
                layer.alert(retInfo.data,{icon:5});
            }
        }, '请求失败', 'POST', undefined, undefined);
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
    //修改收银密码
    form.on("submit(changeSyPwd)", function (data) {
        if($('#syPwdAgain').val() != $('#syPwd').val()){
            layer.msg('两次输入的密码不一致');
            return
        }
        var index = layer.msg('提交中，请稍候', {icon: 16, time: false, shade: 0.8});
        var url = SERVER_ADDR + "/hospital/employee/updatePaymentPassword";
        var Data = {};
        Data.oldPassword = $('#syoldPwd').val();
        Data.newPassword = $('#syPwd').val();
        ajaxGetRetInfo(url, Data, function (retInfo) {
            console.log(retInfo)
            layer.close(index)
            if (retInfo.success) {
                layer.msg("收银密码修改成功！");
                setTimeout(function () {
                    //window.location.reload();
                }, 1000);
            } else {
                layer.alert(retInfo.data,{icon:5});
            }
        }, '请求失败', 'POST', undefined, undefined);
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });
});