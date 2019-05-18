var form;
layui.use(['form','layer','jquery'],function(){
	 form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		$ = layui.jquery;
    getDoc(form);
    form.on('select(hosDoc)', function(data){
        if(data.elem[data.elem.selectedIndex].title != ''){
            getDocErweima(data.elem[data.elem.selectedIndex].title);
        }
    });
});

function getDocErweima(id) {
    console.log(id)
    var Data = {};
    Data.doctorId = id;
    var url = SERVER_ADDR + "/hospital/doctor/getDoctorQRcode.json";
    var index = layer.msg('二维码生成中，请稍候',{icon: 16,time:false,shade:0.8});
    ajaxGetRetInfo(url,Data,function (retInfo) {
        console.log(retInfo)
        layer.close(index);

        if(retInfo.success){
            $(".code").empty();
            newCode(".code",retInfo.data);
        }else{
            layer.alert(retInfo.data,{icon:5})
        }
        //form.render('select', 'from');//更新
    },'请求失败', 'GET', undefined, undefined);
}
