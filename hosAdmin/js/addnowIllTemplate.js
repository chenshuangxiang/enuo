var form;
var arr_pic = [];
var map = new Map();
var superId;
layui.use(['form','layer','jquery','layedit','laydate','upload'],function(){
	 form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		layedit = layui.layedit,
		laydate = layui.laydate,
		$ = layui.jquery;
    var upload = layui.upload;

    laydate.render({
        elem: '#nextRecordTime',
        value: new Date(new Date().getTime()+60*60*24*1000*2)
    });
    //getDocLevel(form);
    /*getKs(form);
    form.on('select(ks)', function(data){  //根据科室获取子科室
        getKsChild(form,data.elem[data.elem.selectedIndex].title);
    });*/
    /*form.on('select(ks)', function(data){  //根据科室获取子科室
        getKsChild(form,data.elem[data.elem.selectedIndex].title);
    });*/
    form.on('select(ks)', function(data){
        $('.ksChild').html('');
        console.log($(this))
        var val = $('.ks').val();
        var child = getChildren(val,map);
        for (var i = 0; i < child.length; i++){
            $('.ksChild').append('<option value = '+ child[i].id +' >' +child[i].name +'</option>');
        }
        form.render();
    });
    form.render();
    //拖拽上传
    upload.render({
        elem: '#docImg',
        url: SERVER_ADDR + '/common/file/upload?isClip=true',
        done: function(res){
            arr_pic.push(res.data);
            init_img(arr_pic);//初始化上传图片
            /*$('.imgList').append('<div class="initImg" style="border: 1px solid #dddddd" data_id="0" data_val="0">' +
                '<img style="height: inherit" onclick="delphoto(this)" class="closePhoto" src="img/closePhoto.png">' +
                '<img src="'+res.data+'"></div>');*/
        }
    });

    //$('.nextRecordTime').val(laydate.now(2));
	/**	 请求各项下拉
	*
	**/
    //自定义验证规则
    form.verify({
       phone: [/^1[3|4|5|7|8|9]\d{9}$/, '手机必须11位，只能是数字！']
    });
    //getHos(form); //获取医院
    //getSaleman(form); //获取业务员
    //getFrom(form); //获取点位来源
    /*form.on('select(newsHos)', function(data){  //根据医院获取病种
        getFk(form,data.elem[data.elem.selectedIndex].title);
    });*/
	//点了编辑进来
    if(getQueryString('action') == 'reset'){
        ajaxGetRetInfo(SERVER_ADDR + '/hospital/parentIllnessHistoryTemplate/hpiContent/one',{hpiContentId:getQueryString('valueid')},function (retInfo) {
            console.log(retInfo)
			if(retInfo.success){
                addTable(retInfo.data);
			}else{
                layer.alert(retInfo.data,{icon:5})
			}
            //form.render('select', 'from');//更新
        },'请求失败', 'GET', undefined, undefined);
	}else{
        initSubject();
    }
	function addTable(retInfo) {
        superId = retInfo.subSubjectId;
        initSubject();
        $(".newsName").val(retInfo.hpiContent);
        form.render();
    }

 	var addNews = {};
 	form.on("submit(addDoc)",function(data){
        //addNews.subjectId = $(".ks").val();
        addNews.subSubjectId = $('.ksChild').val();
        addNews.hpiContent = $(".newsName").val();
 		console.log(addNews);
        if(getQueryString('action') == 'reset'){
        	addNews.hospitalSubSubjectHpiContentId = getQueryString('valueid');
        }
        var url = SERVER_ADDR + "/hospital/parentIllnessHistoryTemplate/edit/hpiContent";
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


    function get_work_tb(){
        var arr_job=[];
        //得到坐诊数据
        $(".week input").each(function(){
            var work_obj={};//当前子表格对象
            work_obj.week=$(this).attr("data_week");
            work_obj.isMorning=$(this).attr("data_morning");
            work_obj.reservationQuantity=$(this).val();
            //处理空
            if($(this).val() == ""){
                work_obj.reservationQuantity=0;
                console.log(work_obj.reservationQuantity);
            }
            console.log(work_obj);
            //处理非数字
            if(!validate.regNum(work_obj.reservationQuantity)){
                alert("坐诊表数据必须为数字");
                return false;
            }
            arr_job.push(work_obj);
        });
        console.log(arr_job);
        return arr_job;
    }
    //编辑医生初始化坐诊表格
    function init_work_tb(m){
        var arr_job = m;
        console.log(arr_job);
        var i=0;
        $(".week input").each(function(){
            for(var i=0;i<arr_job.length;i++){
                //判断是否同一天
                if($(this).attr("data_week")==arr_job[i].week){
//				console.log(arr_job[i].week+","+$(this).attr("data_morning")+";;;;;"+arr_job[i].isMorning+","+i);
                    //判断是同一个上午否
                    if($(this).attr("data_morning")==""+arr_job[i].isMorning){
                        $(this).val(arr_job[i].reservationQuantity);
                    }
                }
            }
        });
    }
    /**
     * 初始化
     */
    function initSubject() {
        // 把数据存到map里
        $.getJSON(SERVER_ADDR + "/hospital/getSubjects.json",function (res) {
            var data = res.data;
            var isCheck = 0;
            for (var i = 0; i < data.length ; i++) {
                var d = data[i];
                var item = d.item;
                map.set(d.name, item);
            }

            //绑定并选中一级菜单
            var isCheck = 0;
            var parentName;
            var parentHtml = $('.ks');
            map.forEach(function (value, key) {
                if (parentName == null) {
                    var child = getChildren(key, map);
                    for (var i = 0; i < child.length; i++){
                        if (superId == child[i].id)
                        {
                            isCheck = 1;
                        }
                    }
                }

                if (isCheck == 1) {
                    parentHtml.append('<option selected = "selected">' +key +'</option>');
                    isCheck = 0;
                    parentName = key;
                }else{
                    parentHtml.append('<option>' + key +'</option>');
                }
                form.render();//更新
            });

            //绑定并选中二级菜单
            var child = getChildren(parentName,map);
            //$('#two').append('<option>请选择</option>')
            if(child){
                for (var i = 0; i < child.length; i++){
                    if (superId == child[i].id ) {
                        $('.ksChild').append('<option selected = "selected" value = '+ child[i].id +' >' +child[i].name +'</option>');
                    } else {
                        $('.ksChild').append('<option value = '+ child[i].id +' >' +child[i].name +'</option>');
                    }
                }
                form.render();//更新
            }

        });
    }

    /**
     * 根据一级菜单获取二级菜单
     * @param param
     * @param map
     * @returns {*}
     */
    function getChildren( param, map) {
        var  result;
        map.forEach(function (value, key) {
            if (param == key)
            {
                result = value;
            }
        });
        return result;
    }
	
})
