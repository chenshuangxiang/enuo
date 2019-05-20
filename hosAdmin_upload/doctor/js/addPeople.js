var form;
var arr_pic = [];
var map = new Map();
var superId;
layui.use(['form','layer','jquery','layedit','laydate'],function(){
	 form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		layedit = layui.layedit,
		laydate = layui.laydate,
		$ = layui.jquery;

    /*laydate.render({
        elem: '#nextRecordTime',
        value: new Date(new Date().getTime()+60*60*24*1000*2)
    });*/
    laydate.render({
        elem: '#bornTime'
    });
    laydate.render({
        elem: '#nextRecordTime'
    });
    $('.addPeople').addClass('layui-this').parent().parent().addClass('layui-nav-itemed');
    getSourseList();
    setTimeout(function () {
        $('.fromYuyue').next('.layui-form-select').remove();
        $('.fromYuyue').parent().next('.layui-form-select').remove();
        $('.combo-input').attr('placeholder','请选择或输入').attr('lay-verify','required');
        $('.combo-dropdown li').eq(0).remove()
    },10);
    $('.combo-input').change(function () {
        console.log($('.combo-input').val())
        var val = $('.combo-input').val();
        setTimeout(function () {
            $('.combo-input').val(val)
        },1)
    })

    //getDocLevel(form);
    /*if(window.location.href.indexOf('addWrite') == -1){
        getFentoNameSelect(form,'doctorHelpmate');
        getFentoNameSelect(form,'doctor');
    }
    getFentoNameSelect(form,'guestService');
    getFentoNameSelect(form,'market');*/
    form.render();
    $('.familySelect').next('.layui-unselect.layui-form-select').hide();
    form.on('select(familySelect)', function(data){  //根据分类获取类型
        console.log(data.elem[data.elem.selectedIndex].title)
        var familiName = data.elem[data.elem.selectedIndex].title;
        if($('.familyName').text().indexOf(familiName) == -1){
            famaliy_addTag.addResult(familiName);
        }
    });
    if(getQueryString('mobile') != null){
        $('.mobile').val(getQueryString('mobile'));
        Get.firstConcult();
    }
    form.on('select(allotStatus)', function(data){
        console.log(data.elem[data.elem.selectedIndex].title);
        if(data.elem[data.elem.selectedIndex].title == 'hasAccess'){
            $('.nextRecordTimeDiv').show();
        }else {
            $('.nextRecordTimeDiv').hide();
        }
    });

    //$('.nextRecordTime').val(laydate.now(2));
	/**	 请求各项下拉
	*
	**/
    //自定义验证规则
    form.verify({
       phone: [/^1[3|4|5|7|8]\d{9}$/, '手机必须11位，只能是数字！']
    });
	//点了编辑进来
    if(getQueryString('action') == 'reset'){
        ajaxGetRetInfo(SERVER_ADDR + '/hospital/reservation/getDetail.json',{id:getQueryString('valueid')},function (retInfo) {
            console.log(retInfo)
			if(retInfo.success){
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
        $(".newsName").val(retInfo.userName);
        $('.mobile').val(retInfo.mobile);
        $('.sex').val(retInfo.sex);
        if(getQueryString('type') == 'doctor'){
            $('.intentOperator').val(retInfo.name);
        }else{
            $('.intentProjectName').val(retInfo.name);
        }

        $('.fromYuyue').val(retInfo.source);
        if(retInfo.birthday){
            $('#bornTime').val(new Date(retInfo.birthday).Format('yyyy-MM-dd'));
        }

        //$('.ks').val(retInfo.subjectId);
       // getKsChild(form,retInfo.subjectId);
       // $('.ksChild').val(retInfo.subSubjectId);
        //initSubject();
        //arr_pic[0] = retInfo.headImgUrl;//医生头像
        //init_img(arr_pic);
        //$(".docLevel").val(retInfo.doctorTypeId);
        //$(".brief").val(retInfo.brief);
        //$(".specialty").val(retInfo.specialty);
        //init_work_tb(retInfo.schedules);
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
 	form.on("submit(addWrite)",function(data){
        //addNews.intentProjectName = $(".intentProjectName").val();
        /*if($(".fenToDoctor").val() == '' &&  $(".fenToZixun").val() == ''){
            //layer.msg('请选择预约医生或咨询');
            //return
            //$('.fenToDoctor').attr('lay-verify','required')
        }*/
        //addSourse();
        addNews.fullname = $(".newsName").val();
        addNews.mobile = $('.mobile').val();
        addNews.sex = $('.sex').val();
        addNews.birthday = $('#bornTime').val();
        addNews.source = $(".combo-input").val();
        //addNews.intentOperator = $(".intentOperator").val();
        //addNews.customerCare = $(".jiedai").val();
        addNews.idCard = $(".peopleId").val();
        addNews.guestService = $(".kefu").val();
        addNews.status = $(".allotStatus").val();
        if($(".allotStatus").val() == 'hasAccess'){
            addNews.nextAccessDate = $(".nextRecordTime").val();
        }
        addNews.remark = $(".brief").val();

            var url = SERVER_ADDR + "/hospital/user/addUser";

        //addNews.doctorHelpmateId = $(".fenToZixun").val();
        if(getFamilies($('.familyOne')) != '[]'){
            addNews.members = getFamilies($('.familyOne'));
        }
 		console.log(addNews);

        var index = layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        ajaxGetRetInfo(url,addNews,function (retInfo) {
            console.log(retInfo)
            layer.close(index);
            layer.msg(retInfo.data);
			if(retInfo.success){
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
})
function getSourseList() {
    var addNews = '';
    var url = SERVER_ADDR + "/hospital/sourceTemplate/getList.json";
    ajaxGetRetInfo(url,addNews,function (retInfo) {
        if(retInfo.success){
            if(retInfo.data.length != 0){
                $('.fromYuyue').append('<option></option>');
                retInfo.data.forEach(function (value) {
                    $('.fromYuyue').append('<option>'+value.name+'</option>');
                })
            }
            $('.fromYuyue').comboSelect();
        }else{
            layer.alert(retInfo.data,{icon:5})
        }
        //form.render('select', 'from');//更新
    },'请求失败', 'GET', undefined, undefined);
}
function addSourse() {
    var addNews = {};
    addNews.name = $('.combo-input').val();
    var url = SERVER_ADDR + "/hospital/sourceTemplate/add";
    ajaxGetRetInfo(url,addNews,function (retInfo) {
        if(retInfo.success){

        }else{
            layer.alert(retInfo.data,{icon:5})
        }
        //form.render('select', 'from');//更新
    },'请求失败', 'POST', undefined, undefined);
}
function addFamily() {
    $('.familySelect').next('.layui-unselect.layui-form-select').css('display','inline-block');
}
function getFamilies(m){
    var familiesList = [];
    $(m).each(function(){
        var oneFamilies = {};
        console.log($(this));
        oneFamilies.appellation = $(this).children('.familyName').text();
        oneFamilies.fullName = $(this).find('.familyFullName').val();
        oneFamilies.mobile = $(this).find('.familyFullMobile').val();
        familiesList.push(oneFamilies);
    });
    return JSON.stringify(familiesList);
}
var Get = {
    checkUser: function (obj) {
        $('.mobile').val(obj);
        var url = SERVER_ADDR + '/hospital/user/check';
        var Data = {};
        Data.mobile = obj;
        ajaxGetRetInfo(url, Data, this.checkUserSuccess, '请求失败', 'GET', true, undefined);
    },
    checkUserSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            if(retInfo.data == 'save'){ //可添加,要先清空
                Get.emptyUserInfo();
            }else if(retInfo.data == 'noAuthority'){ //无权限,全清空
                $('.mobile').val('');
                Get.emptyUserInfo();
                layer.msg('该用户已经是本院用户，无法添加');
            }else if(retInfo.data == 'update'){ //可修改
                Get.firstConcult($('.mobile').val());
            }
        }
    },
    emptyUserInfo: function () {
            $(".newsName").val('');
            $(".sex").val('');
            $("#bornTime").val('');
            $(".peopleId").val('');
            $(".kefu").val('');
            $('.combo-input').val('');
            $(".fenTo").val('');
            $('.allotStatus').val('');
            $('#nextRecordTime').val('');
            $('.familySelect').val('');
            $('.familyOne').remove();
            form.render();
            $('.familySelect').next('.layui-unselect.layui-form-select').hide();
            $('.fromYuyue').next('.layui-form-select').remove();
            $('.fromYuyue').parent().next('.layui-form-select').remove();
            $('.combo-input').attr('placeholder','请选择或输入').attr('lay-verify','required');
    },
    firstConcult: function (obj) {
        $('.mobile').val(obj);
        var url = SERVER_ADDR + '/hospital/reception/visitRecord/getUserInfoByMobile.json';
        var Data = {};
        Data.mobile = obj;
        ajaxGetRetInfo(url, Data, this.firstConcultSuccess, '请求失败', 'GET', true, undefined);
    },
    firstConcultSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            $(".newsName").val(retInfo.data.fullname);
          $(".sex").val(retInfo.data.sex);
          if (retInfo.data.birthday){
              $("#bornTime").val(new Date(retInfo.data.birthday).Format("yyyy-MM-dd"));
          }
            $(".peopleId").val(retInfo.data.idCard);
            $(".kefu").val(retInfo.data.guestServiceId);
            $('.combo-input').val(retInfo.data.sourceStr);
            if(retInfo.data.doctorHelpmateId){
                $(".fenTo").val(retInfo.data.doctorHelpmateId);
            }else {
                $(".fenTo").val(retInfo.data.doctorId);
            }
            if(retInfo.data.members && retInfo.data.members.length > 0){
                famaliy_addTag.init_appoint_result(retInfo.data.members,'.familyList');
            }
            form.render();
            $('.familySelect').next('.layui-unselect.layui-form-select').hide();
            $('.fromYuyue').next('.layui-form-select').remove();
            $('.fromYuyue').parent().next('.layui-form-select').remove();
            $('.combo-input').attr('placeholder','请选择或输入').attr('lay-verify','required');
        }
    }
}
var famaliy_addTag = {
    num:1,
    //增约定效果
    addResult:function(m){
        console.log(m)
        if(m == ''){
            return
        }
        this.num++;
        /* var html = '<div class="layui-inline"> ' +
             '<label class="layui-form-label"></label> ' +
             '<div class="layui-input-inline"> ' +
             '<input type="text" value="" placeholder="检查项目" class="layui-input search_input appoint_result appoint_result_name"> ' +
             '</div> ' +
             '</div> ' +
             '<input type="button" class="layui-btn layui-btn-danger" onclick="special_addTag.delResult(this)" value="删除"/>' ;*/
        var html = '<div class="layui-inline familyOne"> ' +
            '<label class="layui-form-label familyName" style="width: 50px;">'+m+'</label> ' +
            '<div class="layui-input-inline" style="width: 75px;"> ' +
            '<input type="text" name="price_min" placeholder="'+m+'名字" autocomplete="off" class="layui-input familyFullName"> ' +
            '</div> ' +
            '<div class="layui-form-mid" style="display: inline-block;vertical-align: middle;float: none;">-</div> ' +
            '<div class="layui-input-inline" style="width: 110px;"> ' +
            '<input type="number" lay-verify="required|phone" style="width: 113px" name="price_max" placeholder="'+m+'联系方式" autocomplete="off" class="layui-input familyFullMobile"> ' +
            '</div> ' +
            '<a style=" height: 26px; line-height: 26px; padding: 0 8px;" onclick="famaliy_addTag.delResult(this)" class="layui-btn layui-btn-danger layui-btn-xs">删除</a> ' +
            '</div>';
        $('.familyList').append(html);
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
        for (var i = 0; i < m.length; i++) {
            html += '<div class="layui-inline familyOne"> ' +
                '<label class="layui-form-label familyName" style="width: 50px;">' + m[i].appellation + '</label> ' +
                '<div class="layui-input-inline" style="width: 75px;"> ' +
                '<input type="text" name="price_min" placeholder="' + m[i].appellation + '名字" autocomplete="off" class="layui-input familyFullName" value="'+m[i].fullName+'"> ' +
                '</div> ' +
                '<div class="layui-form-mid" style="display: inline-block;vertical-align: middle;float: none;">-</div> ' +
                '<div class="layui-input-inline" style="width: 110px;"> ' +
                '<input type="number" lay-verify="required|phone" style="width: 113px" name="price_max" placeholder="' + m[i].appellation + '联系方式" autocomplete="off" class="layui-input familyFullMobile" value="'+m[i].mobile+'"> ' +
                '</div> ' +
                '<a style=" height: 26px; line-height: 26px; padding: 0 8px;" onclick="famaliy_addTag.delResult(this)" class="layui-btn layui-btn-danger layui-btn-xs">删除</a> ' +
                '</div>';
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
