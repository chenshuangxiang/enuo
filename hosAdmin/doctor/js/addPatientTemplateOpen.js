var form;
layui.use(['form','layer','jquery','layedit','table'],function(){
	 form = layui.form,
         table = layui.table,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		layedit = layui.layedit,
		$ = layui.jquery;
	 $('.maintell').val(getQueryString('maintell'));
    $('.nowIll').val(getQueryString('nowIll'));
    $('.tutorshipCheck').val(getQueryString('tutorshipCheck'));
    $('.treatmentAdvice').val(getQueryString('treatmentAdvice'));
    form.on("submit(addPatientTemplateBtn)",function(data){
        var addNews = {};
        addNews.name = $(".mubanName").val();
        addNews.chiefComplaint = $(".maintell").val();
        addNews.presentMedicalHistory = $(".nowIll").val();
        //addNews.supplementaryExamination = $(".tutorshipCheck").val();
        addNews.treatmentAdvice = $(".treatmentAdvice").val();
        addNews.type = 'PERSONAL';
        var url = SERVER_ADDR + "/hospital/medicalRecordTemplate/addMedicalRecordTemplate";
        ajaxGetRetInfo(url,addNews,function (retInfo) {
            console.log(retInfo)
         //   layer.close(index);
            if(retInfo.success){
                layer.msg('提交成功');
                setTimeout(function () {
                    parent.layer.close(parent.layer.getFrameIndex(window.name));
                    //parent.window.location.reload();
                },1000)
            }else{
                layer.alert(retInfo.data,{icon:5})
            }
            //form.render('select', 'from');//更新
        },'请求失败', 'POST', undefined, undefined);
        //弹出loading
        return false;
    })
});