
layui.use(['form','layer','jquery','layedit','element'],function(){
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
        element = layui.element,
		layedit = layui.layedit,
		$ = layui.jquery;
        form.render();

 	form.on("submit(addDiseaseWrite)",function(data){
        var addNews = {};
        addNews.visitRecordId = getQueryString('valueid');
        addNews.noDealRemarks = $(".brief").val();

        var url = SERVER_ADDR + "/hospital/doctor/index/noDealRemarks";
        ajaxGetRetInfo(url,addNews,function (retInfo) {
            console.log(retInfo)
           // top.layer.close(index);
            top.layer.msg(retInfo.data);
			if(retInfo.success){
                //layer.closeAll("iframe");
                setTimeout(function () {
                    location.reload();
                },1000);

			}else{
            	layer.alert(retInfo.data,{icon:5})
			}
            //form.render('select', 'from');//更新
        },'请求失败', 'GET', undefined, undefined);
        //return;
 		//弹出loading
 		return false;
 	})
})
