layui.use(['form','layer','jquery','layedit','laydate'],function(){
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		layedit = layui.layedit,
		laydate = layui.laydate,
		$ = layui.jquery;
    laydate.render({
        elem: '#nextRecordTime'
    });
	/**	 请求各项下拉
	*
	**/
    //自定义验证规则
    form.verify({
       phone: [/^1[3|4|5|7|8|9]\d{9}$/, '手机必须11位，只能是数字！']
    });
     form.on('select(allotStatus)', function(data){
         console.log(data.elem[data.elem.selectedIndex].title);
         if(data.elem[data.elem.selectedIndex].title == 'hasAccess'){
             $('.nextRecordTimeDiv').show();
         }else {
             $('.nextRecordTimeDiv').hide();
         }
    });
    //getHos(form); //获取医院
    //getSaleman(form); //获取业务员
    //getFrom(form); //获取点位来源
    /*form.on('select(newsHos)', function(data){  //根据医院获取病种
        getFk(form,data.elem[data.elem.selectedIndex].title);
    });*/

	//点了编辑进来
    if(getQueryString('action') == 'reset'){
        ajaxGetRetInfo(SERVER_ADDR + '/hospital/doctor/index/hospitalRepeatDiagnosis/one',{visitRecordId:getQueryString('valueid')},function (retInfo) {
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
        $(".brief").val(retInfo.lastTreatmentSituation);
        $('.thisbrief').val(retInfo.theTreatmentSituation);
        $(".purpose").val(retInfo.remark);
    }

 	var addNews = {};
 	form.on("submit(addNews)",function(data){
        addNews.visitRecordId = getQueryString('valueid');
        addNews.lastTreatmentSituation = $(".brief").val();
        addNews.theTreatmentSituation = $(".thisbrief").val();
        addNews.remark = $(".purpose").val();

        var url = SERVER_ADDR + "/hospital/doctor/index/hospitalRepeatDiagnosis";
        ajaxGetRetInfo(url,addNews,function (retInfo) {
            console.log(retInfo)
           // top.layer.close(index);
            top.layer.msg(retInfo.data);
			if(retInfo.success){
                //layer.closeAll("iframe");
                parent.location.reload();
			}else{
            	layer.alert(retInfo.data,{icon:5})
			}
            //form.render('select', 'from');//更新
        },'请求失败', 'POST', undefined, undefined);
        //return;
 		//弹出loading
 		return false;
 	})
	
})
