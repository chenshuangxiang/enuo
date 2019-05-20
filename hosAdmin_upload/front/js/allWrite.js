var form
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
   /* form.on('select(newsHos)', function(data){  //根据医院获取病种
        getFk(form,data.elem[data.elem.selectedIndex].title);
    });*/
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

                    dataHtml += '<td><a class="layui-btn layui-btn-normal layui-btn-mini" onclick="addwrite(this)" valueid="'+data[i].id+'"  valuemobile="'+data[i].mobile+'" valueusername="'+data[i].name+'"><i class="iconfont icon-edit"></i>添加录诊</a>' +
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
			title : "添加录诊",
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
                //layer.msg('添加录诊成功');
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
                    +'<td>'+noData(data[i].doctor)+'</td>'
					+'<td>'+noData(data[i].doctorHelpmate)+'</td>'
					+'<td>'+noData(data[i].guestService)+'</td>'
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

   /* var index = layui.layer.open({
        title : "添加录诊",
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
               var index = layui.layer.confirm('该用户今日已录诊<span style="color: red">'+res.data+'</span>次，确定继续录诊？', {
                   btn: ['继续录诊','暂不录诊'], //按钮
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

                layer.open({
                    title: '个人信息'
                    ,content: '<strong>姓名:</strong>'+retInfo.data.fullname + '' + ' &nbsp;&nbsp;&nbsp;&nbsp;<strong>手机号:</strong>' + Get.mobile  + ' &nbsp;&nbsp;&nbsp;&nbsp;<strong>性别:</strong>' + retInfo.data.sex + '<br><strong>出生日期:</strong>' +birthday+ '<br><strong>身份证号:</strong>' + noData(retInfo.data.idCard)
                });
            }
        }
    }
    Get.userInfo();
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