var form;
var arr_pic = [];
var isPreferential = false;
var marketable = false;
var isDrainage = false;
var huliCardCheck = false;
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
    //getKs(form);
    form.on('select(type)', function(data){  //根据分类获取类型
        getProductCategory(form,data.elem[data.elem.selectedIndex].title);
    });
    form.on('switch(isPreferential)', function(data){ //是否优惠
        this.checked ? isPreferential = true : isPreferential = false;
    });
    form.on('switch(marketable)', function(data){ //是否上架
        this.checked ? marketable = true : marketable = false;
        console.log(marketable)
    });
    form.on('switch(isDrainage)', function(data){ //是否引流
        this.checked ? isDrainage = true : isDrainage = false;
        console.log(isDrainage)
    });
    /* form.on('switch(isPreferential)', function(data){
         console.log(data)
        // console.log(this.checked);
         layer.msg('开关checked：'+ (this.checked ? 'true' : 'false'), {
             offset: '6px'
         });
         layer.tips('温馨提示：请注意开关状态的文字可以随意定义，而不仅仅是ON|OFF', data.othis)
     });*/
    form.render();
    //拖拽上传
    upload.render({
        elem: '#projectImg',
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
        var serverUrl;
        if(getQueryString('valueid') == 261){
            serverUrl = '/hospital/specialProduct/NursingCard/getDetail.json'
        }else{
            serverUrl = '/hospital/specialProduct/getDetail.json'
        }
        ajaxGetRetInfo(SERVER_ADDR + serverUrl,{id:getQueryString('valueid')},function (retInfo) {
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
        $(".day").val(retInfo.day);
        $(".originalPrice").val(retInfo.originalPrice);
        $(".price").val(retInfo.price);
        if(retInfo.isPreferential == true){
            isPreferential = true;
            $('.isPreferential').attr('checked',true);
        }else{
            isPreferential = false;
            $('.isPreferential').attr('checked',false);
        }
        if(retInfo.marketable == true){
            marketable = true;
            $('.marketable').attr('checked',true);
        }else{
            marketable = false;
            $('.marketable').attr('checked',false);
        }
        if(retInfo.isDrainage == true){
            isDrainage = true;
            $('.isDrainage').attr('checked',true);
        }else{
            isDrainage = false;
            $('.isDrainage').attr('checked',false);
        }
        $('.type').val(retInfo.type);
        getProductCategory(form,$(".type option[value="+retInfo.type+"]").attr('title'));
        $('.productCategory').val(retInfo.productCategoryId);
        arr_pic = retInfo.images;//医生头像
        init_img(arr_pic);
        special_addTag.init_appoint_result(retInfo.agreementResults,$(".addCensorItems"));
        //判断是护理卡还是特价项目
        if(retInfo.schedules){
            $('.specialProduct').show();
            $('.huliCardProduct').hide();
            huliCardCheck = false;
            init_work_tb(retInfo.schedules);
        }else{
            $('.specialProduct').hide();
            $('.huliCardProduct').show();
            huliCardCheck = true;
            init_workhuliCard_tb(retInfo.schedulesMap.toothWashing,$(".washingweek input"));
            init_workhuliCard_tb(retInfo.schedulesMap.toothFilling,$(".fillingweek input"));
            init_workhuliCard_tb(retInfo.schedulesMap.toothExtraction,$(".extractionweek input"));
        }
        form.render();
    }

 	var addNews = {};
 	form.on("submit(addProject)",function(data){
         addNews.name = $(".newsName").val();
         addNews.productCategoryId = $('.productCategory').val();
         addNews.images = toHash(arr_pic);
         addNews.day = $(".day").val();
         addNews.originalPrice = $(".originalPrice").val();
         addNews.price = $(".price").val();
         addNews.agreementResults = toHash(getResult($(".appoint_result")));
         if(huliCardCheck == true){
             addNews.schedulesToothWashing = JSON.stringify(get_workhuliCard_tb($(".washingweek input"))); //洗牙
             addNews.schedulesToothFilling = JSON.stringify(get_workhuliCard_tb($(".fillingweek input")));  //补牙
             addNews.schedulesToothExtraction = JSON.stringify(get_workhuliCard_tb($(".extractionweek input"))); //拔牙
         }else{
             addNews.schedules = JSON.stringify(get_work_tb());
         }
         addNews.isPreferential = isPreferential;
         addNews.marketable = marketable;
         addNews.isDrainage = isDrainage;
         addNews.bShowInApp = true;
      /*  addNews.subjectId = $(".ksChild").val();
        addNews.doctorTypeId = $(".docLevel").val();
        addNews.specialty = $(".specialty").val();
        addNews.schedules = JSON.stringify(get_work_tb());
        addNews.brief = $(".brief").val();*/
 		console.log(addNews);
        var url;
        if (getQueryString('action') == 'reset') {
            addNews.id = getQueryString('valueid');
            if (getQueryString('valueid') == 261) {
                url = SERVER_ADDR + "/hospital/specialProduct/NursingCard/update";
            } else {
                url = SERVER_ADDR + "/hospital/specialProduct/update";
            }
        } else {
            url = SERVER_ADDR + "/hospital/specialProduct/add";
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

var special_addTag = {
    num:1,
    //增约定效果
    addResult:function(m){
        this.num++;
       /* var html = '<div class="layui-inline"> ' +
            '<label class="layui-form-label"></label> ' +
            '<div class="layui-input-inline"> ' +
            '<input type="text" value="" placeholder="检查项目" class="layui-input search_input appoint_result appoint_result_name"> ' +
            '</div> ' +
            '</div> ' +
            '<input type="button" class="layui-btn layui-btn-danger" onclick="special_addTag.delResult(this)" value="删除"/>' ;*/
       var html = '<div class="layui-input-block">' +
           '<input type="text" name="identity" lay-verify="required" placeholder="" autocomplete="off" class="layui-input appoint_result"  style="width: 75%;display: inline-block;margin-right: 15px;    margin-bottom: 10px;">' +
           '<input type="button" class="layui-btn layui-btn-danger" onclick="special_addTag.delResult(this)" value="删除"/></div>';
        $('.addCensorItems').append(html);
    },
    //减约定效果
    delResult:function(m){
        this.num--;
        $(m).parent().remove();
    },
    //初始化约定效果
    init_appoint_result:function(m,tag){
        if(!m[0]){
            return false;
        }

        var html = "";
        //	m=["aa","bb"];
        for(var i=0;i<m.length;i++){
            if(i==0){
                html=html+'<label class="layui-form-label">约定效果</label><div class="layui-input-block"> ' +
                    '<input type="text" name="identity" lay-verify="required" placeholder="" autocomplete="off" value="'+m[0]+'" class="layui-input appoint_result" style="width: 75%;display: inline-block;margin-right: 15px;    margin-bottom: 10px;"> ' +
                    '<input type="button" class="layui-btn" onclick="special_addTag.addResult(this)" value="增加"> ' +
                    '</div>';
            }
            if(i>0){
                html=html+'<div class="layui-input-block">' +
                    '<input type="text" name="identity" lay-verify="required" placeholder="" value="'+m[i]+'" autocomplete="off" class="layui-input appoint_result"  style="width: 75%;display: inline-block;margin-right: 15px;    margin-bottom: 10px;">' +
                    '<input type="button" class="layui-btn layui-btn-danger" onclick="special_addTag.delResult(this)" value="删除"/></div>';
            }
        }
        $(tag).html(html);
    },
    //获取列表的值
    getResult:function(){
        var arrResult = [];
        $(".appoint_result").each(function (index,value) {
            console.log("进来了");
            var arrChild = {};
            if($(this).hasClass("appoint_result_name")){
                console.log("name进来了");
                arrChild.name = $(this).val();
            }
            if($(this).hasClass("appoint_result_detail")){
                arrChild.description = $(this).val();
            }
            arrResult.push(arrChild);
            console.log(arrResult);
        });

        return arrResult;
    }
}
