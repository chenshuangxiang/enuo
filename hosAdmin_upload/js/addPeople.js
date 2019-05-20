var form;
var arr_pic = [];
var map = new Map();
var superId;
var use = true;

layui.use(['form','layer','jquery','layedit'],function(){
	 form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		layedit = layui.layedit,
		$ = layui.jquery;
    getHosName();
    getSection(form);
    getRole(form);
    form.on('switch(use)', function(data){ //是否启用
        this.checked ? use = true : use = false;
    });
    form.on('checkbox(role)', function(data){
        console.log(data.elem.checked); //是否被选中，true或者false
        console.log(data.value); //复选框value值，也可以通过data.elem.value得到
    });

    form.verify({
        username: function (value, item) {
            if (!/^[A-Za-z]+$/.test(value)) {
                return '用户名只能是英文字母';
            }
        }
    })
    form.render();
	/**	 请求各项下拉
	*
	**/
    //自定义验证规则
    form.verify({
       phone: [/^1[3|4|5|7|8]\d{9}$/, '手机必须11位，只能是数字！']
    });
	//点了编辑进来
    if(getQueryString('action') == 'reset'){
        ajaxGetRetInfo(SERVER_ADDR + '/hospital/employee/getDetail.json',{id:getQueryString('valueid')},function (retInfo) {
            console.log(retInfo)
			if(retInfo.success){
                $('.psdDiv').remove();
                addTable(retInfo.data);
			}else{
                layer.alert(retInfo.data,{icon:5})
			}
            //form.render('select', 'from');//更新
        },'请求失败', 'GET', undefined, undefined);
	}else{
        //initSubject();
    }
	function addTable(retInfo) {
        //superId = retInfo.subjectId;
        //initSubject();
        if(retInfo.manager == true){
            $('.hosUserName').remove();
            $('.role').empty().append('<span style="line-height: 38px;">主管理员</span>');
            $(".userName").val(retInfo.username);
        }else {
            $(".userName").val(retInfo.username.split('@')[1]);
        }
        //$('.psd').val(retInfo.password);
        $('.newsName').val(retInfo.fullname);
        $(".mobile").val(retInfo.mobile);
        if(retInfo.enabled == true){
            use = true;
            $('.use').attr('checked',true);
        }else{
            use = false;
            $('.use').attr('checked',false);
        }
        /*if(retInfo.hospitalDepartmentId){
            $('.section').val(retInfo.hospitalDepartmentId);
        }else {
            $('.section').val('直属员工');
        }*/

        /*if($('.section').val() != '直属员工'){
            addNews.hospitalDepartmentId =
        }*/
        if(retInfo.roleIds){
            $("input:radio[name='role'][value='"+retInfo.roleIds[0]+"']").prop('checked',true);
           /* retInfo.roleIds.forEach(function (value) {
                $("input:radio[name='role'][value='"+value+"']").prop('checked',true);
            });*/
        }

        form.render();
        /*$(".age").val(retInfo.age);
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
        $(".nextRecordTime").val(retInfo.nextAccessDate);*/

    }

 	var addNews = {};

 	form.on("submit(addPeople)",function(data){
        var roleList = [];
        addNews.username = $(".hosUserName").text() + $(".userName").val();
        addNews.fullname = $('.newsName').val();
        addNews.mobile = $(".mobile").val();
        addNews.enabled = use;
       /* if($('.section').val() != '直属员工'){
            addNews.hospitalDepartmentId = $('.section').val();
        }*/

        $("input:radio[name='role']:checked").each(function() { // 遍历name=test的多选框
            // 每一个被选中项的值
            roleList.push($(this).val())
        });
        roleList = roleList.join(',');
        addNews.roles = roleList;
        if(getQueryString('action') == 'reset'){
        	addNews.id = getQueryString('valueid');
            var url = SERVER_ADDR + "/hospital/employee/update";
        }else{
            addNews.password = $('.psd').val();
            var url = SERVER_ADDR + "/hospital/employee/add";
		}
        console.log(addNews);
        var index = layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        ajaxGetRetInfo(url,addNews,function (retInfo) {
            console.log(retInfo)
            layer.close(index);
            layer.msg('成功');
			if(retInfo.success){
                //layer.closeAll("iframe");
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
    function verity() {
        var string = document.getElementById("tmp").value;
        var parent=/^[A-Za-z]+$/;
        if(parent.test(string)) {
            alert("格式正确"+string);
        } else {
            alert("只能输入英文字母");
        }
    }
    function getHosName(pageNumber) {
        var url = SERVER_ADDR + "/hospital/getHospitalUsername.json";
        var data = ''
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                $('.hosUserName').text(retInfo.data + '@');
            }else{
                layer.alert(retInfo.data,{icon:5});
            }
        },'请求失败', 'GET', undefined, undefined);
    }
	
})
