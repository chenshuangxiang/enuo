var type = 'FIRSTVISIT';
layui.use(['form','layer','jquery','layedit','element'],function(){
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
        element = layui.element,
		layedit = layui.layedit,
		$ = layui.jquery;

        $('.allDiseaseWrite1').prop('checked',true);
        form.render();
    DiseaseWriteHis();
    DiseaseWriteHisDoctorHelpmate();
     form.on('radio(allDiseaseWrite)', function(data){
         console.log(data.value)
         type = data.value;
         if(data.value == 'FIRSTVISIT'){
             $('.allDiseaseWriteZi').text('首诊记录');
             $('.brief').val('').attr('placeholder','请输入首诊记录');
         }else if(data.value == 'AGAINVISIT'){
             $('.allDiseaseWriteZi').text('复诊记录');
             $('.brief').val('').attr('placeholder','请输入复诊记录');
         }else if(data.value == 'OPERATION'){
             $('.allDiseaseWriteZi').text('手术记录');
             $('.brief').val('').attr('placeholder','请输入手术记录');
         }else if(data.value == 'TREATMENT'){
             $('.allDiseaseWriteZi').text('治疗记录');
             $('.brief').val('').attr('placeholder','请输入治疗记录');
         }else if(data.value == 'ADVIOSY'){
             $('.allDiseaseWriteZi').text('咨询记录');
             $('.brief').val('').attr('placeholder','请输入咨询记录');
         }
    });
 	form.on("submit(addDiseaseWrite)",function(data){
        var addNews = {};
        if(type == 'ADVIOSY'){
            addNews.visitRecordId = getQueryString('valueid');
            addNews.detail = $(".brief").val();
            var url = SERVER_ADDR + "/hospital/doctor/index/addLiveAdvisory.json";
        }else{
            addNews.visitRecordId = getQueryString('valueid');
            addNews.type = type;
            addNews.record = $(".brief").val();
            var url = SERVER_ADDR + "/hospital/reception/visitRecord/addDiseaseCourseRecord";
        }
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
        },'请求失败', 'POST', undefined, undefined);
        //return;
 		//弹出loading
 		return false;
 	})
    function DiseaseWriteHis() {
        var addNews = {};
        addNews.visitRecordId = getQueryString('valueid');
        var url = SERVER_ADDR + "/hospital/reception/visitRecord/getDiseaseCourseRecordDetail.json";
        ajaxGetRetInfo(url,addNews,function (retInfo) {
            if(retInfo.success){
                if(retInfo.data.length > 0){
                    $('.layui-collapseDoctor').show();
                }else{
                    $('.layui-collapseDoctor').hide();
                }
              $('.news_content').html(renderTableDate(retInfo.data));
            }else{
                layer.alert(retInfo.data,{icon:5})
            }
            //form.render('select', 'from');//更新
        },'请求失败', 'GET', undefined, undefined);
    }
    function DiseaseWriteHisDoctorHelpmate() {
        var addNews = {};
        addNews.visitId = getQueryString('valueid');
        var url = SERVER_ADDR + "/hospital/doctor/index/findLiveAdvisory";
        ajaxGetRetInfo(url,addNews,function (retInfo) {
            if(retInfo.success){
                if(retInfo.data.length > 0){
                    $('.layui-collapseDoctorHelpmate').show();
                }else{
                    $('.layui-collapseDoctorHelpmate').hide();
                }
                $('.news_contentDoctorHelpmate').html(renderDoctorHelpmateTableDate(retInfo.data));
            }else{
                layer.alert(retInfo.data,{icon:5})
            }
            //form.render('select', 'from');//更新
        },'请求失败', 'GET', undefined, undefined);
    }
    function renderTableDate(data){
        var dataHtml = '';
        console.log(data)
        if(data.length != 0){
            for(var i=0;i<data.length;i++){
                dataHtml += '<tr>'
                    +'<td>'+data[i].createDate+'</td>'
                if(data[i].type == 'FIRSTVISIT'){
                    dataHtml += '<td>首诊记录</td>'
                }else if(data[i].type == 'AGAINVISIT'){
                    dataHtml += '<td>复诊记录</td>'
                }else if(data[i].type == 'OPERATION'){
                    dataHtml += '<td>手术记录</td>'
                }else if(data[i].type == 'TREATMENT'){
                    dataHtml += '<td>治疗记录</td>'
                }else{
                    dataHtml += '<td></td>'
                }
                dataHtml +='<td>'+noData(data[i].record)+'</td>'
            }
        }else{
            dataHtml = '<tr><td colspan="2">暂无数据</td></tr>';
        }
        return dataHtml;
    }
    function renderDoctorHelpmateTableDate(data){
        var dataHtml = '';
        console.log(data)
        if(data.length != 0){
            for(var i=0;i<data.length;i++){
                dataHtml += '<tr>'
                    +'<td>'+new Date(data[i].createDate).Format('yyyy-MM-dd hh:mm:ss')+'</td>'
                dataHtml +='<td>'+noData(data[i].detail)+'</td>'
            }
        }else{
            dataHtml = '<tr><td colspan="2">暂无数据</td></tr>';
        }
        return dataHtml;
    }
})
