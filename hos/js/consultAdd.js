var form;
layui.use(['form','layer','jquery','layedit','laydate'],function(){
	 form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		layedit = layui.layedit,
		laydate = layui.laydate,
		$ = layui.jquery;
    laydate.render({
        elem: '#nextRecordTime',
        value: new Date(new Date().getTime()+60*60*24*1000*2)
    });
    //$('.nextRecordTime').val(laydate.now(2));
	/**	 请求各项下拉
	*
	**/
    //自定义验证规则
    form.verify({
       phone: [/^1[3|4|5|7|8]\d{9}$/, '手机必须11位，只能是数字！']
    });
    getHos(form); //获取医院
    getSaleman(form); //获取业务员
    getFrom(form); //获取点位来源
    form.render();
    /*form.on('select(newsHos)', function(data){  //根据医院获取病种
        getFk(form,data.elem[data.elem.selectedIndex].title);
    });*/
	//点了编辑进来
    if(getQueryString('action') == 'reset'){
        ajaxGetRetInfo(SERVER_ADDR + '/admin/advisory/getDetail.json',{id:getQueryString('valueid')},function (retInfo) {
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
        $(".newsName").val(retInfo.username);
        $('.mobile').val(retInfo.mobile).attr('disabled','disabled');
        $(".age").val(retInfo.age);
        $(".sex").val(retInfo.sex);
        form.render('select', 'sex');
        $(".newsJob").val(retInfo.job);
        $(".from").val(retInfo.storeId);
        form.render('select', 'from');
        //$(".newsTime").val(new Date(retInfo.advisoryDate).Format("yyyy-MM-dd hh:mm:ss"));
        if(!retInfo.hospitalId){
            $(".newsHos").val(0);
        }else{
            $(".newsHos").val(retInfo.hospitalId);
        }
        form.render('select', 'newsHos');
        //getFk(form,$(".newsHos option[value="+retInfo.advisoryHospitalId+"]").attr('title'));//获取病种
        $(".newsDisease").val(retInfo.disease);
        //form.render('select', 'newsDisease');
        $(".kefuSelect").val(retInfo.salesmanId);
        form.render('select', 'kefuSelect');
        $(".newsAddress").val(retInfo.address);
        $(".brief").val(retInfo.brief);
        $(".nextRecordTime").val(retInfo.nextAccessDate);

    }

 	var addNews = {};
 	form.on("submit(addNews)",function(data){
        addNews.name = $(".newsName").val();
        addNews.mobile = $('.mobile').val();
        addNews.sex = $(".sex").val();
        addNews.age = $(".age").val();
        addNews.job = $(".newsJob").val();
        addNews.address = $(".newsAddress").val();
        addNews.brief = $(".brief").val();
        addNews.hospitalId = $(".newsHos").val();
        addNews.storeId = $(".from").val();
        //addNews.advisoryDate = $(".newsTime").val();
        addNews.disease = $(".newsDisease").val();
        addNews.salesmanId = $('.kefuSelect').val();
        addNews.nextAccessDate = $('.nextRecordTime').val();
 		console.log(addNews);
        if(getQueryString('action') == 'reset'){
        	addNews.id = getQueryString('valueid');
            var url = SERVER_ADDR + "/admin/advisory/update";
        }else{
            var url = SERVER_ADDR + "/admin/advisory/add";
		}

        var index = layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        ajaxGetRetInfo(url,addNews,function (retInfo) {
            console.log(retInfo)
            layer.close(index);
            layer.msg(retInfo.data);
			if(retInfo.success){
                layer.closeAll("iframe");
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
var Get = {
    firstConcult: function () {
        if (check(/^[1][3,4,5,7,8,9][0-9]{9}$/.test($(".mobile").val().trim()) === true, "请输入正确的手机号！")) {
            var url = SERVER_ADDR + '/admin/advisory/getPatientInfo.json';
            var Data = {};
            Data.mobile = $('.mobile').val();
            ajaxGetRetInfo(url, Data, this.firstConcultSuccess, '请求失败', 'GET', true, undefined);
        }
    },
    firstConcultSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            //返回填充
            $(".newsName").val(retInfo.data.name);
            $(".sex").val(retInfo.data.sex);
            form.render('select', 'sex');
            $(".age").val(retInfo.data.age);
            $(".newsAddress").val(retInfo.data.address);
            $(".job").val(retInfo.data.job);
        } else {
            alert(retInfo.data);
        }
    }
}