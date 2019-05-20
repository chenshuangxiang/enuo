
//绑定家人
var Go = {
    bindFamily:function(){
        var url = SERVER_ADDR + '/app/user/family/add';
        var Data = {};
        Data.appellation = $('.familySelect').val();
        Data.fullName = $('.userName').val();
        Data.sex = $('.nan').is(':checked') ? 'man' : 'woman';
        Data.mobile = $('.telNum').val();
        Data.updateOld = false;
        ajaxGetRetInfo(url, Data, this.bindSuccess, '请求失败', 'POST', true, undefined);
    },
    bindSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            alert('添加成功');
            window.location.reload();
        }else{
            alert(retInfo.data)
        }
    }
}
