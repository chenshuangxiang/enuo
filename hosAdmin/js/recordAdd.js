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
        ajaxGetRetInfo(SERVER_ADDR + '/admin/allot/advisory/getDetail.json',{id:getQueryString('valueid')},function (retInfo) {
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
        $('.mobile').val(retInfo.mobile);
        $(".age").val(retInfo.age);
        $(".from").val(retInfo.storeId);
        form.render('select', 'from');
        $(".newsTime").val(new Date(retInfo.advisoryDate).Format("yyyy-MM-dd hh:mm:ss"));
        $(".newsHos").val(retInfo.advisoryHospitalId);
        form.render('select', 'newsHos');
        getFk(form,$(".newsHos option[value="+retInfo.advisoryHospitalId+"]").attr('title'));//获取病种
        $(".newsDisease").val(retInfo.fkId);
        form.render('select', 'newsDisease');
        $(".kefuSelect").val(retInfo.salesmanId);
        form.render('select', 'kefuSelect');
        $(".newsAddress").val(retInfo.address);
        $(".brief").val(retInfo.brief);
    }

 	var addNews = {};
 	form.on("submit(addNews)",function(data){

        var backZi = $('.allotStatus').val();
        if(backZi == 'repeat' || backZi == 'emptyNum' || backZi == 'infoError'){
            addRecord('repulseAdvisory');//直接打回
        }else if(backZi == 'unContact' || backZi == 'refuse'){
            layer.confirm($('.allotStatus option:selected').text() + ',需要打回吗？', {
                btn: ['打回','不打回'], //按钮
                icon:3
            }, function(){
                addRecord('repulseAdvisory');
            }, function(){
                addRecord();
            });
        }else{
            addRecord();
        }


       /* addNews.username = $(".newsName").val();
        addNews.mobile = $('.mobile').val();
        addNews.accessDate = $(".newsTime").val();
        addNews.allotHospitalId = $(".newsHos").val();
        addNews.fkId = $(".newsDisease").val();*/
   /*     addNews.allotId = getQueryString('id');
        addNews.brief = $(".brief").val();
        addNews.status = $(".allotStatus").val();
        if($(".allotStatus").val() == 'hasAccess'){
            addNews.hospitalAccessDate = $(".nextRecordTime").val();
        }
        //addNews.salesmanId = $('.kefuSelect').val();
 		console.log(addNews);
       /!* if(getQueryString('action') == 'reset'){
        	addNews.id = getQueryString('valueid');
            var url = SERVER_ADDR + "/admin/allot/advisory/update";
        }else{

		}*!/
        var url = SERVER_ADDR + "/hospital/allot/addAccess";
        var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        ajaxGetRetInfo(url,addNews,function (retInfo) {
            console.log(retInfo)
            top.layer.close(index);
            top.layer.msg(retInfo.data);
			if(retInfo.success){
                //layer.closeAll("iframe");
                parent.location.reload();
			}else{
            	layer.alert(retInfo.data,{icon:5})
			}
            //form.render('select', 'from');//更新
        },'请求失败', 'POST', undefined, undefined);*/
        //return;
 		//弹出loading
 		return false;
 	});
    function addRecord(obj) {
        var caozuo = obj;
        addNews.allotId = getQueryString('id');
        addNews.brief = $(".brief").val();
        addNews.status = $(".allotStatus").val();
        if($(".allotStatus").val() == 'hasAccess'){
            addNews.hospitalAccessDate = $(".nextRecordTime").val();
        }/*else if($(".allotStatus").val() == 'reservation'){
            addNews.reservationDate = $(".nextRecordTime").val();
        }*/
        console.log(addNews);
        var url = SERVER_ADDR + "/hospital/allot/addAccess";
        var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        ajaxGetRetInfo(url,addNews,function (retInfo) {
            console.log(retInfo)
            top.layer.close(index);
            top.layer.msg(retInfo.data);
            if(retInfo.success){
                if(caozuo == 'repulseAdvisory'){
                    repulseAdvisory();
                }else{
                    parent.location.reload();
                }
                //layer.closeAll("iframe");
            }else{
                layer.alert(retInfo.data,{icon:5})
            }
            //form.render('select', 'from');//更新
        },'请求失败', 'POST', undefined, undefined);
    }
    function repulseAdvisory() {
        postget_ajax("/hospital/allot/repulseAdvisory",{"advisoryId":getQueryString('advisoryid'),"brief":$('.allotStatus option:selected').text()},'POST',function(retInfo){
            if(retInfo.success){
                top.layer.msg(retInfo.data);
                setTimeout(function () {
                    parent.location.reload();
                },1000);
            }else{
                layer.alert(retInfo.data);
            }
        });
    }
	
})
