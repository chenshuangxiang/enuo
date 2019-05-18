var form;
var arr_pic = [];
var map = new Map();
var superId;
layui.use(['form','layer','jquery'],function(){
	 form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		$ = layui.jquery;
    toAllFirstTopTab('.projectLi','.toProjectBtn');
    getTyq(form);
    if($('.tyqList option').length <= 1){
        $('.haveTyq').hide();
        $('.noTyq').show();
    }else{
        $('.haveTyq').show();
        $('.noTyq').hide();
    }
    form.on('select(tyqList)', function(data){
        if($('.tyqList').val() == ''){
            $(".week input").val('');
            return;
        }
        addNews.id = $('.tyqList').val();
        var url = SERVER_ADDR + "/hospital/experienceCoupon/geSchedules.json";
        var index = layer.msg('请稍候',{icon: 16,time:false,shade:0.8});
        ajaxGetRetInfo(url,addNews,function (retInfo) {
            console.log(retInfo)
            layer.close(index);
            if(retInfo.success){
                //retInfo.data.schedules = [{"week":"sunday","isMorning":"true","reservationQuantity":"5"},{"week":"sunday","isMorning":"false","reservationQuantity":"5"},{"week":"monday","isMorning":"true","reservationQuantity":"5"},{"week":"monday","isMorning":"false","reservationQuantity":"5"},{"week":"tuesday","isMorning":"true","reservationQuantity":"5"},{"week":"tuesday","isMorning":"false","reservationQuantity":"5"},{"week":"wednesday","isMorning":"true","reservationQuantity":"5"},{"week":"wednesday","isMorning":"false","reservationQuantity":"5"},{"week":"thursday","isMorning":"true","reservationQuantity":"5"},{"week":"thursday","isMorning":"false","reservationQuantity":"5"},{"week":"friday","isMorning":"true","reservationQuantity":"5"},{"week":"friday","isMorning":"false","reservationQuantity":"5"},{"week":"saturday","isMorning":"true","reservationQuantity":"5"},{"week":"saturday","isMorning":"false","reservationQuantity":"5"}]
                init_work_tb(retInfo.data);
            }else{
                layer.alert(retInfo.data,{icon:5})
            }
            //form.render('select', 'from');//更新
        },'请求失败', 'GET', undefined, undefined);
    });

 	var addNews = {};
 	form.on("submit(resetTyq)",function(data){
        if(!validate.verify(get_work_tb(),"排期表")){return false;}
        addNews.id = $('.tyqList').val();
        addNews.schedules = JSON.stringify(get_work_tb());
 		console.log(addNews);
 		var url = SERVER_ADDR + "/hospital/experienceCoupon/instal";
        var index = layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        ajaxGetRetInfo(url,addNews,function (retInfo) {
            console.log(retInfo)
            layer.close(index);
            layer.msg('修改成功');
			if(retInfo.success){

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
