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
    form.on("submit(changePwd)",function(data){
        var Data = {};
        Data.password =  $("#Pwd").val();
        Data.oldPasswowrd =  $("#oldPwd").val();
        var index = layer.msg('提交中，请稍候',{icon: 16,time:false,shade:0.8});
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
        return false;
    })
});