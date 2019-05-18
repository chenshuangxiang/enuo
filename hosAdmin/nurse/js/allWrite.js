var form;
var fenTotype;
var fenToFkId;
layui.use(['form','layer','jquery','laypage','laydate','element'],function(){
	 form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
        laydate = layui.laydate,
		$ = layui.jquery;
    $('.allWrite').addClass('layui-this');
    laydate.render({
        elem: '#newsTime'
    });
    //getDocLevel(form);
    getDoctorNameFrontSelect();
    getZixunNameFrontSelect();
    form.render();
    /*form.on('select(fenTo)', function(data){  //根据分类获取类型
        getFentoNameSelect(form,data.elem[data.elem.selectedIndex].title);
    });*/
	//加载页面数据
    searchBtn(localStorage.getItem('allWrite') || 1);
    localStorage.removeItem('allWrite');
	//核对
	$(".search_hedui").click(function(){
        if($(".newsNameOne").val().trim() == '') {
            layer.msg('请输入姓名或手机号核对')
            return
        }else {
            $('.mobile').val($('.newsNameOne').val());
            searchWrite();
        }
        });
    $(".search_btn").click(function(){
        searchBtn(1);
    });
    function searchWrite() {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/hospital/reception/visitRecord/getUserInfoList.json";
        var data = {};
        data.keyword = $(".newsNameOne").val();
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            layer.close(index);
            if(retInfo.success){
                searchWriteList(retInfo.data);
            }else{
                layer.alert(retInfo.data,{icon:5});
            }



        },'请求失败', 'GET', undefined, undefined);
    }
    function searchWriteList(retInfo) {
        $(".writeSearch").html(searchWriteAdaList(retInfo));
        $('.writeSearchDiv').show();
    }
    function searchWriteAdaList(data){
        var dataHtml = '';
        if(data.length != 0){
            for(var i=0;i<data.length;i++){
                if(data[i].sex == 'man'){
                    data[i].sex = '男';
                }else if(data[i].sex == 'woman'){
                    data[i].sex = '女';
                }
                dataHtml += '<tr>'
                    /* +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                    /*  +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/

                    /*  +'<td>'+new Date(data[i].createDate).Format('yyyy-MM-dd hh:mm:ss')+'</td>'*/
                    +'<td>'+noData(data[i].fullname)+'</td>'
                    /*   +'<td>'+noData(data[i].sex)+'</td>'*/
                    +'<td>'+noData(data[i].mobile)+'</td>'
                    +'<td>'+noData(data[i].idCard)+'</td>'


                /* if(data[i].status == "unallot"){
                     dataHtml += '<a class="layui-btn layui-btn-mini consultFen" style="display: none" valueid="'+data[i].id+'"><i class="iconfont icon-edit"></i> 分诊</a>' +
                         '<a class="layui-btn layui-btn-normal layui-btn-mini news_reset" style="display: none" valueid="'+data[i].id+'"><i class="layui-icon">&#xe600;</i> 编辑</a>';
                 }*/

                    dataHtml += '<td><a class="layui-btn layui-btn-normal layui-btn-mini" onclick="addwrite(this)" valueid="'+data[i].id+'"  valuemobile="'+data[i].mobile+'" valueusername="'+data[i].name+'"><i class="iconfont icon-edit"></i>添加入诊</a>' +
                        '<a class="layui-btn layui-btn-normal layui-btn-mini" onclick="jiuzhenhis_open(this)" valueid="'+data[i].id+'">就诊记录</a></td>'

                dataHtml += '</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="12">暂无数据</td></tr>';
        }
        return dataHtml;
    }
	function searchBtn(pageNumber) {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/hospital/reception/visitRecord/getOfflineList.json";
        var data = {};
        data.keyword = $(".newsNameOne").val();
        data.pageNumber = pageNumber;
        data.pageSize = 15;
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            layer.close(index);
            if(retInfo.success){
                newsList(retInfo.data,retInfo.totalCount,pageNumber);
            }else{
                layer.alert(retInfo.data,{icon:5});
			}



        },'请求失败', 'GET', undefined, undefined);
    }
	//添加咨询
	/*$(".addWrite").click(function(){
        //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
        console.log(4555)
		var index = layui.layer.open({
			title : "添加入诊",
			type : 2,
            area:['760px','620px'],
			content : "addWrite.html",
			success : function(layero, index){
			    localStorage.setItem('allWrite',$('.layui-laypage-curr em').eq(1).text());

			}
		})
	});*/
    $('.sureFenTo').click(function () {
        var elThisid = $('.sureFenTo').attr('valueid');
        /*if($('.newsHosFen').val() == ''){
            layer.alert('请选择分诊医院',{icon:7});

        }*/
        var url = SERVER_ADDR + "/hospital/reception/visitRecord/update";
        var data = {};
        data.id =elThisid;
        data.doctorId = $('.fenToDoctor').val();
        data.doctorHelpmateId = $('.fenToZixun').val();
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                /* var elthis = $(".consultFen[valueid="+elThisid+"]");
                 elthis.parent().prev().text('已分诊').attr('style','color:black');
                 elthis.remove();
                 layui.layer.closeAll();*/
                localStorage.setItem('allWrite',$('.layui-laypage-curr em').eq(1).text());
                //layer.msg('添加入诊成功');
                layer.msg('分诊成功');
                setTimeout(function () {
                    location.reload();
                },1000)

            }else{
                layer.alert(retInfo.data,{icon:5})
            }
        },'请求失败', 'POST', undefined, undefined);

        return false
    });

	function newsList(retInfo,totalCount,current){
		//渲染数据
        $(".news_content").html(renderDate(retInfo));
		//分页
		var nums = 15; //每页出现的数据量
        laypage.render({
            elem : "page",
            skip:true,
            count:totalCount,
            layout: ['count', 'prev', 'page', 'next', 'skip'],
            limit :nums,
            curr: current || 1,
            jump : function(obj,firstLoaded){
                console.log(firstLoaded)
                console.log(obj)
                if (!firstLoaded) {
                    searchBtn(obj.curr);
                }
            }
        })
	}
    function renderDate(data){
        var dataHtml = '';
        if(data.length != 0){
            for(var i=0;i<data.length;i++){
                if(data[i].sex == 'man'){
                    data[i].sex = '男';
                }else if(data[i].sex == 'woman'){
                    data[i].sex = '女';
                }
                if(data[i].status == 'wait'){
                    data[i].status = '候诊';
                }else if(data[i].status == 'loading'){
                    data[i].status = '治疗中';
                }else if(data[i].status == 'leave'){
                    data[i].status = '弃诊';
                }else if(data[i].status == 'complete'){
                    data[i].status = '完成';
                }else if(data[i].status == 'disagress'){
                    data[i].status = '<span style="color: red">驳回</span>';
                }else if(data[i].status == 'uncheck'){
                    data[i].status = '<span style="color: #FFB800">审核中</span>';
                }else if(data[i].status == 'registration'){
                    data[i].status = '<span style="color: #d25d12">挂号中</span>';
                }
               /* if(data[i].status == 'visit'){
                    data[i].status = '已到诊';
                }else if(data[i].status == 'allot'){
                    data[i].status = '已分诊';
                }else if(data[i].status == 'waitPaid'){
                    data[i].status = '待付款';
                }else if(data[i].status == 'loading'){
                    data[i].status = '体验中';
                }else if(data[i].status == 'completed'){
                    data[i].status = '已完成';
                }*/
                dataHtml += '<tr>'
                   /* +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/
                 /*  +'<td><input type="checkbox" name="checked" lay-skin="primary" lay-filter="choose"></td>'*/

                  /*  +'<td>'+new Date(data[i].createDate).Format('yyyy-MM-dd hh:mm:ss')+'</td>'*/
                    +'<td>'+Number(i+1)+'</td>'
                    +'<td  style="color: #2299ee;cursor: pointer" valuemobile="'+data[i].mobile+'" onclick="GetuserInfo(this)">'+noData(data[i].fullName)+'</td>'
                    +'<td>'+noData(data[i].sex)+'</td>'
                    +'<td>'+noData(data[i].mobile)+'</td>'
                   /* +'<td>'+noData(data[i].source)+'</td>'*/
                  /*  +'<td>'+data[i].name+'</td>'*/
                    /*+'<td>'+noData(data[i].intentOperator)+'</td>'*/
                  /*  +'<td>'+data[i].guestService+'</td>'*/
                    +'<td>'+noData(data[i].source)+'</td>'
                    +'<td>'+noData(data[i].subjectName)+'</td>'
                    +'<td>'+data[i].registrationFee+'元</td>'
                    +'<td>'+noData(data[i].doctor)+'</td>'
					+'<td>'+noData(data[i].doctorHelpmate)+'</td>'
					+'<td>'+noData(data[i].guestService)+'</td>'
                    +'<td>'+noData(data[i].status)+'</td>'
                    +'<td>'+noData(new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss"))+'</td>';

               /* if(data[i].status == "unallot"){
                    dataHtml += '<a class="layui-btn layui-btn-mini consultFen" style="display: none" valueid="'+data[i].id+'"><i class="iconfont icon-edit"></i> 分诊</a>' +
                        '<a class="layui-btn layui-btn-normal layui-btn-mini news_reset" style="display: none" valueid="'+data[i].id+'"><i class="layui-icon">&#xe600;</i> 编辑</a>';
                }*/
             /*  if(data[i].status == 'wait'){
                   dataHtml += '<td>' +
                       '<a class="layui-btn layui-btn-normal layui-btn-mini" onclick="reset_fen_open(this)" valueid="'+data[i].id+'"  doctorid="'+data[i].doctorId+'" doctorhelpmateid="'+data[i].doctorHelpmateId+'"><i class="iconfont icon-edit"></i>修改分诊</a></td>'
               }else{
                   dataHtml += '<td></td>'
               }*/
                dataHtml += '</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="12">暂无数据</td></tr>';
        }
        return dataHtml;
    }
})
//修改分诊
/*function reset_fen_open(obj) {
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var id = $(obj).attr('valueid');
    var doctorid = $(obj).attr('doctorid');
    var doctorhelpmateid = $(obj).attr('doctorHelpmateId');
    $('.sureFenTo').attr('valueid',id)
    var index = layui.layer.open({
        title : "修改分诊",
        type : 1,
        area: ['345px','420px'],
        content : $('.writeFenOpen'),
        success : function(layero, index){
            $('.fenToDoctor').val(doctorid);
            $('.fenToZixun').val(doctorhelpmateid);
            form.render();
            localStorage.setItem('allWrite',$('.layui-laypage-curr em').eq(1).text());
            $('.layui-layer-shade').remove();
        },
        cancel: function(index, layero){
            layer.close(index)
            return false;
        }
    })
    //改变窗口大小时，重置弹窗的高度，防止超出可视区域（如F12调出debug的操作）
    /!*$(window).resize(function(){
        layui.layer.full(index);

    })
    layui.layer.full(index);*!/
    //layer.close(indexOpen);
}*/
//分诊
function jiuzhenhis_open(obj) {
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var id = $(obj).attr('valueid');
    $('.sureFenTo').attr('valueid',id)
    var index = layui.layer.open({
        title : "就诊记录",
        type : 2,
        area:['83%','83%'],
        content : "jiuzhenHis.html?id="+id,
        success : function(layero, index){

        }
    })
}
function addwrite(obj){
    var mobile = $(obj).attr('valuemobile');
    GetCheckUser(mobile);

   /* var index = layui.layer.open({富二代 泰国读书，20岁 很耿直  然后爸爸就
        title : "添加入诊",
        type : 2,
        area:['760px','620px'],
        content : "addWrite.html?mobile=" + mobile ,
        success : function(layero, index){
            localStorage.setItem('allWrite',$('.layui-laypage-curr em').eq(1).text());

        }
    })*/
}
function GetCheckUser(mobile) {
    var mobile = mobile;
    var Data = {};
    Data.mobile = mobile;
    postget_ajax("/hospital/reception/visitRecord/check",Data,'GET',function(res){
        if(res.success){
           if(res.data != 0){
               var index = layui.layer.confirm('该用户今日已入诊<span style="color: red">'+res.data+'</span>次，确定继续入诊？', {
                   btn: ['继续入诊','暂不入诊'], //按钮
                   icon:3
               }, function(){
                   firstWriteConcult(mobile);
                   layui.layer.close(index);
               }, function(){

               });
           } else {
               firstWriteConcult(mobile);
           }
        }
    })
}
var userId;
function GetuserInfo(obj) {
    var elThis = obj;
    var Get = {
        mobile:'',
        userInfo: function () {
            var url = SERVER_ADDR + '/hospital/reception/visitRecord/getUserInfoByMobile.json';
            var Data = {};
            Data.mobile = $(elThis).attr('valuemobile');
            Get.mobile = $(elThis).attr('valuemobile');
            ajaxGetRetInfo(url, Data, this.userInfoSuccess, '请求失败', 'GET', true, undefined);
        },
        userInfoSuccess: function (retInfo) {
            console.log(retInfo)
            if (retInfo.success == true) {
                if(retInfo.data.sex == 'man'){
                    retInfo.data.sex = '男';
                }else if(retInfo.data.sex == 'woman'){
                    retInfo.data.sex = '女';
                }else if(retInfo.data.sex == 'unknown'){
                    retInfo.data.sex = '不详';
                }
                if(!retInfo.data.birthday){
                    var birthday = '无'
                }else{
                    var birthday = new Date(retInfo.data.birthday).Format("yyyy-MM-dd")
                }
                userId = retInfo.data.id;
                var str = '<strong>姓名:</strong>'+retInfo.data.fullname + '' + ' &nbsp;&nbsp;&nbsp;&nbsp;<strong>手机号:</strong>' + Get.mobile  + ' &nbsp;&nbsp;&nbsp;&nbsp;<strong>性别:</strong>' + retInfo.data.sex + '<br><strong>出生日期:</strong>' +birthday+ '<br><strong>身份证号:</strong>' + noData(retInfo.data.idCard)+ '<br><strong>护理卡号:</strong>' + noData(retInfo.data.nursingCardNumber) ;
                if(retInfo.data.nursingCard == false){
                    str += '<br><div onclick="Open.addHuliCard()" class="layui-layer-btn layui-layer-btn-" style="position: fixed;margin: 16px 0 0 0;"><a style="font-size: 15px;padding: 3px 17px;" class="layui-layer-btn1">添加护理卡</a></div>'
                }
                layer.open({
                    title: '个人信息'
                    ,content: str
                });
            }
        }
    }
    Get.userInfo();
}

var Open = {
    addHuliCard:function(){
        var index = layer.open({
            type: 1 //Page层类型
            //,area: ['500px', '300px']
            ,btn:["确认添加"]
            ,title: '请输入护理卡号，并确认'
            ,skin: 'layui-layer-prompt'
            ,btnAlign: 'c' //按钮居中
            ,content: "<div class=''><span>护理卡号：</span><input type='number' style='display: inline-block;width: 66%;' class='layui-layer-input' value='' placeholder='请输入护理卡号'></div>"
            ,yes: function(index, layero){
                var hulicardNum = $(layero).find("input[type='number']").val();
                if(hulicardNum.length == 5 && hulicardNum.substr(0,2) == '00'){
                    Open.sureaddHuliCard(hulicardNum);
                }else{
                    layer.msg('请输入正确的护理卡号');
                }
                //按钮【按钮一】的回调
            }
        });
    },
    sureaddHuliCard: function (hulicardNum) {
        var url = SERVER_ADDR + '/hospital/reception/visitRecord/bindingNursingCard';
        var Data = {};
        Data.nursingCardNumber = hulicardNum;
        Data.userId = userId;
        ajaxGetRetInfo(url, Data, this.sureaddHuliCardSuccess, '请求失败', 'POST', true, undefined);
    },
    sureaddHuliCardSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            layer.msg('添加成功');
            localStorage.setItem('allWrite',$('.layui-laypage-curr em').eq(1).text());
            setTimeout(function () {
                window.location.reload();
            },1000);
        }else{
            layer.alert(retInfo.data,{icon:5});
        }
    }
}
function firstWriteConcult(mobile) {
    console.log(mobile)
    var url = SERVER_ADDR + '/hospital/reception/visitRecord/getUserInfoByMobile.json';
    var Data = {};
    Data.mobile = mobile;
    ajaxGetRetInfo(url, Data,firstWriteConcultSuccess, '请求失败', 'GET', true, undefined);
   /* var Get = {
        firstWriteConcult: function (obj) {
            console.log(obj)
            var url = SERVER_ADDR + '/hospital/reception/visitRecord/getUserInfoByMobile.json';
            var Data = {};
            Data.mobile = obj;
            ajaxGetRetInfo(url, Data, this.firstWriteConcultSuccess, '请求失败', 'GET', true, undefined);
        },

    }*/
}

    function firstWriteConcultSuccess(retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            $(".newsName").val(retInfo.data.fullname);
            $(".sex").val(retInfo.data.sex);
            if(!retInfo.data.birthday){
                $("#bornTime").val('');
            }else{
                $("#bornTime").val(new Date(retInfo.data.birthday).Format("yyyy-MM-dd"));
            }
            $(".peopleId").val(retInfo.data.idCard);
            $(".kefu").val(retInfo.data.guestServiceId);
            $('.combo-input').val(retInfo.data.sourceStr);
            if(retInfo.data.doctorHelpmateId){  //选中select的title
                //$(".fenTo").val(retInfo.data.doctorHelpmateId);
                $('.fenTo option[titletype="doctorHelpmate"][title="'+retInfo.data.doctorHelpmateId+'"]').prop("selected",true);
            }else {
                $('.fenTo option[titletype="doctor"][title="'+retInfo.data.doctorId+'"]').prop("selected",true);
                //$(".fenTo").val(retInfo.data.doctorId);
            }
            fenTotype = $(".fenTo").find("option:selected").attr('titletype');
            fenToFkId = $(".fenTo").find("option:selected").attr('title');
            form.on('select(fenTo)', function(data){  //修改咨询或医生
                //getFk(form,data.elem[data.elem.selectedIndex].title);
                if(fenToFkId != $(".fenTo").find("option:selected").attr('title') || fenTotype != $(".fenTo").find("option:selected").attr('titletype')){
                    var index = layer.confirm('如何修改并分诊这位患者？', {
                        btn: ['长期','临时'], icon:3, closeBtn: 0
                    }, function(){
                        console.log('长期')
                        $('.longtime').attr('longtime',true);
                        layer.close(index);
                    }, function(){
                        console.log('临时')
                        $('.longtime').attr('longtime',false);
                    });
                }else{
                    $('.longtime').attr('longtime',true);
                }
                console.log(fenToFkId)
                console.log(fenTotype);
                console.log($(".fenTo").find("option:selected").attr('title'));
                console.log($(".fenTo").find("option:selected").attr('titletype'));
            });
            if(retInfo.data.sourceStr == 'e诺平台' && !retInfo.data.salesmanName){  //如果是enuo来的 且 业务员名字没有的
                $('.enuoSalesman').show();
                //$('.enuoSalesmanName').attr('lay-verify', 'required');
            }else{
                //$('.enuoSalesman').hide().attr('lay-verify', '');
                $('.enuoSalesman').hide();
                $('.enuoSalesmanName').val(retInfo.data.salesmanName);

            }
            //
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


//添加案例
function reset_docexample(obj) {
    var id = $(obj).attr('valueid');
    var type = $(obj).attr('valuetype');
    var index = layui.layer.open({
        title : "添加案例",
        type : 2,
        area:['80%','80%'],
        content : "addCase.html?id=" + id + '&type='+type,
        success : function(layero, index){
            setTimeout(function () {
                layui.layer.tips('点击此处返回列表', '.layui-layer-setwin .layui-layer-close', {
                    tips: 3
                });
            },500)

        }
    })
}
var famaliy_addTag = {
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
    }
}