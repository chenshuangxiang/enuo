var form;
layui.use(['form','layer','jquery','layedit'],function(){
	 form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		layedit = layui.layedit,
		$ = layui.jquery;


    form.render();
    //拖拽上传

    //$('.nextRecordTime').val(laydate.now(2));
	/**	 请求各项下拉
	*
	**/
    //自定义验证规则
    form.verify({
       phone: [/^1[3|4|5|7|8|9]\d{9}$/, '手机必须11位，只能是数字！']
    });

	//点了编辑进来
    if(getQueryString('action') == 'reset'){
        ajaxGetRetInfo(SERVER_ADDR + '/hospital/doctor/index/getMedicalRecordTemplateDetails.json',{id:getQueryString('valueid')},function (retInfo) {
            console.log(retInfo)
			if(retInfo.success){
                addTable(retInfo.data);
			}else{
                layer.alert(retInfo.data,{icon:5})
			}
            //form.render('select', 'from');//更新
        },'请求失败', 'GET', undefined, undefined);
	}
	function addTable(retInfo) {
        $(".newsName").val(retInfo.name);
        $('.mainTell').val(retInfo.chiefComplaint);
        $('.nowIll').val(retInfo.presentMedicalHistory);
        //$('.tutorshipCheck').val(retInfo.supplementaryExamination);
        $('.treatmentAdvice').val(retInfo.treatmentAdvice);
        form.render();
    }

 	var addNews = {};
 	form.on("submit(addTemplate)",function(data){
        addNews.name = $(".newsName").val();
        addNews.chiefComplaint = $(".mainTell").val();
        addNews.presentMedicalHistory = $(".nowIll").val();
        //addNews.supplementaryExamination = $(".tutorshipCheck").val();
        addNews.treatmentAdvice = $(".treatmentAdvice").val();
        if(getQueryString('action') == 'reset'){
        	addNews.id = getQueryString('valueid');
            var url = SERVER_ADDR + "/hospital/medicalRecordTemplate/updateMedicalRecordTemplate";
        }else{
            addNews.type = 'PERSONAL';
            var url = SERVER_ADDR + "/hospital/medicalRecordTemplate/addMedicalRecordTemplate";
		}
        console.log(addNews);
        var index = layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        ajaxGetRetInfo(url,addNews,function (retInfo) {
            console.log(retInfo)
            layer.close(index);
            layer.msg(retInfo.data);
			if(retInfo.success){
                setTimeout(function () {
                    parent.window.location.reload();
                },1200);
			}else{
            	layer.alert(retInfo.data,{icon:5})
			}
            //form.render('select', 'from');//更新
        },'请求失败', 'POST', undefined, undefined);
        //return;
 		//弹出loading
 		return false;
 	})
});