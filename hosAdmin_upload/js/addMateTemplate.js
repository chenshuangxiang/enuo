var form;
layui.use(['form','layer','jquery','layedit'],function(){
	 form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		layedit = layui.layedit,
		$ = layui.jquery;

    form.render();

	//点了编辑进来
    if(getQueryString('action') == 'reset'){
        ajaxGetRetInfo(SERVER_ADDR + '/hospital/materialTemplate/getDetail.json',{id:getQueryString('valueid')},function (retInfo) {
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
        $('.modelNo').val(retInfo.modelNo);
        $('.placeOfOrigin').val(retInfo.placeOfOrigin);
        $('.spec').val(retInfo.spec);
        $(".originalPrice").val(retInfo.originalPrice);
        $(".price").val(retInfo.price);
        $(".type").val(retInfo.type);
        form.render();
    }
 	var addNews = {};
 	form.on("submit(addMateTemplate)",function(data){

        addNews.modelNo = $('.modelNo').val();
        addNews.placeOfOrigin = $('.placeOfOrigin').val();
        addNews.spec = $('.spec').val();
         addNews.originalPrice = $(".originalPrice").val();
         addNews.price = $(".price").val();
         addNews.type = $(".type").val();
         addNews.discount = $(".zhekou").val();
 		console.log(addNews);
        if(getQueryString('action') == 'reset'){
        	addNews.id = getQueryString('valueid');
            var url = SERVER_ADDR + "/hospital/materialTemplate/update";
        }else{
            var url = SERVER_ADDR + "/hospital/materialTemplate/add";
		}

        var index = layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        ajaxGetRetInfo(url,addNews,function (retInfo) {
            console.log(retInfo)
            layer.close(index);
            layer.msg(retInfo.data);
			if(retInfo.success){
                layer.closeAll("iframe");
                parent.window.location.reload();
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
