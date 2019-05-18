layui.use(['form','layer','jquery','laypage','element'],function(){
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
        laypage = layui.laypage,
        element = layui.element,
		$ = layui.jquery;

    form.render();
    toAllFirstTopTab('.shenheLi','.toHospitalBtn');
    form.on('switch(enabled)', function(data){
        console.log(data); //得到radio原始DOM对象
        console.log(data.value); //被点击的radio的value值
        switchEnabled(data.elem.title,data.elem.checked);
    });
	//加载页面数据
    searchBtn(1);
    $(".search_btn").click(function() {
        searchBtn(1);
    });
	//查询
	function searchBtn(pageNumber) {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/hospital/employee/getList.json";
        var data = {};
        data.keyword = $('.newsName').val();
        data.enabled = true;
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
	//添加部门
    $("body").on("click",".addSection",function(){
        console.log(666666)
		$('.sureFen').attr('valueid',$(this).attr('valueid'));
        var index = layui.layer.open({
            area: ['350px','270px'],
            title : "添加部门",
            type : 1,
            content : $('.sectionOpen'),
            success:function(){
                $('.layui-layer-shade').remove();
			}
        })
    });
//添加员工
   /* $("body").on("click",".addPeople",function(){*/
        $(".addPeople").click(function(){
        //$('.sureFen').attr('valueid',$(this).attr('valueid'));
        var index = layui.layer.open({
            area: ['654px','500px'],
            title : "添加员工",
            type : 2,
            content : 'addPeople.html',
            success:function(){
                //$('.layui-layer-shade').remove();
            }
        })
    });
    function newsList(retInfo,totalCount,current){
        //渲染数据
        $(".tbodytable").html(renderDate(retInfo));
        form.render()
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
        console.log(data);
        var htmlstaff = '';
        if(data.length != 0){
            data.forEach(function (value) {
                htmlstaff += '<tr>' +
                    '<td>'+value.username+'</td>'+
                    '<td>'+value.fullname+'</td>'+
                    '<td>'+value.mobile+'</td>';
                if(value.roleName){
                    htmlstaff += '<td>'+value.roleName+'</td>';
                    if(value.enabled == true){
                        htmlstaff += '<td><input type="checkbox" name="close" class="enabled" title="'+value.id+'" checked lay-skin="switch" lay-filter="enabled" lay-text="是|否"></td>';
                    }else if(value.enabled == false){
                        htmlstaff += '<td><input type="checkbox" name="close" class="enabled" title="'+value.id+'" lay-skin="switch" lay-filter="enabled" lay-text="是|否"></td>';
                    }
                    htmlstaff += '<td class="bianji" valueid="'+value.id+'">' +
                        '<span style="display: inline-block;margin-right: 15px;" onclick="allPeopleReset(this)">编辑</span>' ;

                    if(value.roleName == '收银'){
                        htmlstaff += '<span onclick="showChoose(this)" valueShow="0"  style="position: relative">重置密码▼<dl style="top: 22px;left: -17px;min-width: 118px;line-height: 32px; padding: 5px 0;" class="layui-nav-child layui-anim-fadein layui-anim layui-anim-upbit">' +
                            '<dd layadmin-event="closeThisTabs"><a valueid="'+value.id+'" onclick="resetPsdOpen(this)">重置账户密码</a></dd>' +
                            '<dd layadmin-event="closeOtherTabs"><a valueid="'+value.id+'" onclick="resetSyPsdOpen(this)">重置收银密码</a></dd>' +
                            '</dl></span>'
                    }else{
                        htmlstaff += '<span onclick="resetPsdOpen(this)" valueid="'+value.id+'" style="position: relative">重置密码 &nbsp;&nbsp;</span>'
                    }
                    htmlstaff +='</td>'
                }else{
                    htmlstaff += '<td>主管理员</td>';
                    htmlstaff += '<td></td>';
                    htmlstaff += '<td></td>';
                }


                htmlstaff +='</tr>';
                //$(".tbodytable").append(htmlstaff);
            })
        } else{
            htmlstaff = '<tr><td colspan="6">暂无数据</td></tr>';
        }
        return htmlstaff;
        /*  data.data.push({name: "直属员工"});
          data.data.forEach(function (value) {
              var htmlsection = '<div class="csx" style="clear: both; display: block;">' +
                  '<ul class="renwu_mainmenu" sectionid="'+value.id+'">' +
                  '<li onclick="togetstaff(this)" valueId="'+value.id+'"><span class="zhankai">▼</span>' +
                  '<span class="zhankai zhankaizi">展开</span>'+ value.name + '</li>' +
                  '<ul class="submenu2">' +
                  '<table class="layui-table">' +
                  '<thead>' +
                  '<tr>' +
                  '<td>用户名</td>' +
                  '<td>姓名</td>' +
                  '<td>电话</td>' +
                  '<td>角色</td>' +
                  '<td>是否启用</td>' +
                  '<td>操作</td>' +
                  '</tr>' +
                  '</thead>' +
                  '<tbody class="tbodytable">' +

                  '</tbody>' +
                  '</table>'+
                  '</ul>' +
                  '</ul>' +
                  '</div>';
              $(".tbody").append(htmlsection);
          })*/
    }
    function switchEnabled(id,bool) {
        var url = SERVER_ADDR + "/hospital/employee/change/enabled";
        var data = {};
        data.id = id;
        data.enabled = bool;
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                layer.msg(retInfo.data);
            }else{
                layer.alert(retInfo.data,{icon:5})
            }
        },'请求失败', 'GET', undefined, undefined);
    }
})

function showChoose(obj) {
    if($(obj).attr('valueShow') == 0){
        $(obj).attr('valueShow',1);
        $(obj).children('.layui-nav-child').show();
    }else if($(obj).attr('valueShow') == 1){
        $(obj).attr('valueShow',0);
        $(obj).children('.layui-nav-child').hide();
    }

}
function togetstaff(obj) {
    var elThis = obj;
    $(elThis).next('.submenu2').slideToggle()/*.siblings('.submenu2').slideUp()*/;
    $(elThis).parent().parent().siblings('.csx').children().children('.submenu2').slideUp();
    //$('.zhankaizi').text('展开');
    if($(elThis).children('.zhankaizi').text() == '收起'){
        $('.zhankaizi').text('展开');
        $(elThis).children('.zhankaizi').text('展开');
    }else{
        $('.zhankaizi').text('展开');
        $(elThis).children('.zhankaizi').text('收起');
    }
    //$(elThis).next('.submenu2').children('table').children('.tbodytable').empty();
    if($(elThis).attr('ajax') == 'true'){
        return
    }
    togetstaffAjax(obj);
}
function togetstaffAjax(obj) {
    var elThis = obj;
    var url = SERVER_ADDR + '/hospital/employee/getList.json';
    var data = {};
    if($(obj).attr('valueid') != 'undefined'){
        data.hospitalDepartmentId = $(obj).attr('valueid');
    }
    ajaxGetRetInfo(url,data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            console.log(retInfo);
            $(elThis).attr('ajax',true);
            retInfo.data.forEach(function (value) {
                var htmlstaff = '';
                htmlstaff += '<tr>' +
                    '<td>'+value.username+'</td>'+
                    '<td>'+value.fullname+'</td>'+
                    '<td>'+value.mobile+'</td>';
                if(value.roleName){
                    htmlstaff += '<td>'+value.roleName+'</td>';
                }else{
                    htmlstaff += '<td>主管理员</td>';
                }
                if(value.enabled == true){
                    htmlstaff += '<td>是</td>';
                }else if(value.enabled == false){
                    htmlstaff += '<td>否</td>';
                }
                htmlstaff += '<td class="bianji" valueid="'+value.id+'">' +
                    '<span style="display: inline-block;margin-right: 15px;" onclick="allPeopleReset(this)">编辑</span><span onclick="resetPsdOpen(this)">重置密码</span>' +
                    '</td></tr>';
                $(elThis).next('.submenu2').children('table').children('.tbodytable').append(htmlstaff);
            })
        }else{
            layer.alert(retInfo.data,{icon:5})
        }
    },'请求失败', 'GET', undefined, undefined);
}
function addSctionOpenBtn() {
    var url = SERVER_ADDR + "/hospital/department/add";
    var data = {};
    data.name = $('.addSctionInput').val();
    ajaxGetRetInfo(url,data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            layer.msg('添加成功')
            setTimeout(function () {
                window.location.reload();
            },300);
        }else{
            layer.alert(retInfo.data,{icon:5})
        }
    },'请求失败', 'POST', undefined, undefined);
}
function resetPsdOpenBtn() {
    var url = SERVER_ADDR + "/hospital/employee/resetPassword";
    var data = {};
    data.employeeId = $('.resetPsdOpenBtn').attr('valueid');
    //data.password = $('.resetPsdOpenInput').val();
    ajaxGetRetInfo(url,data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            layer.msg('重置成功')
            setTimeout(function () {
                window.location.reload();
            },300);
        }else{
            layer.alert(retInfo.data,{icon:5})
        }
    },'请求失败', 'POST', undefined, undefined);
}
function resetSyPsdOpenBtn() {
    var url = SERVER_ADDR + "/hospital/employee/resetPaymentPassword";
    var data = {};
    data.id = $('.resetSyPsdOpenBtn').attr('valueid');
    //data.password = $('.resetPsdOpenInput').val();
    ajaxGetRetInfo(url,data,function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            layer.msg('重置收银密码成功')
            setTimeout(function () {
                window.location.reload();
            },500);
        }else{
            layer.alert(retInfo.data,{icon:5})
        }
    },'请求失败', 'POST', undefined, undefined);
}
function allPeopleReset(obj) {
        var id = $(obj).parent().attr('valueid');
        var index = layui.layer.open({
            title : "编辑",
            type : 2,
            area: ['654px','450px'],
            content : "addPeople.html?valueid=" + id + '&action=reset&v=1134',
            success : function(layero, index){

            }
        })
}
function resetPsdOpen(obj) {
    $('.resetPsdOpenBtn').attr('valueid',$(obj).attr('valueid'));
    var index = layui.layer.open({
        area: ['350px','270px'],
        title : "重置密码",
        type : 1,
        content : $('.resetPsdOpen'),
        success:function(){
            $('.layui-layer-shade').remove();
        }
    })
}
function resetSyPsdOpen(obj) {
    $('.resetSyPsdOpenBtn').attr('valueid',$(obj).attr('valueid'));
    var index = layui.layer.open({
        area: ['350px','270px'],
        title : "重置密码",
        type : 1,
        content : $('.resetSyPsdOpen'),
        success:function(){
            $('.layui-layer-shade').remove();
        }
    })
}