var form;
var tableLocal = JSON.parse(localStorage.getItem('localInfo')) || [];
    //tableLocal = tableLocal[0];
    console.log(tableLocal)
layui.use(['form','layer','jquery','layedit'],function(){
	 form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		layedit = layui.layedit,
		$ = layui.jquery;
    form.render();


    getTemplateProject(form);
    getFentoNameSelect(form,'doctor');
    form.on('select(projectName)', function(data){
        getTemplateProjectInfo(data.value);
    });
    function getTemplateProjectInfo(id) {
        console.log(id)
        ajaxGetRetInfo(SERVER_ADDR + '/hospital/visit/hospitalProjectTemplate/getDetail.json',{id:id},function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                addTable(retInfo.data);
            }else{
                layer.alert(retInfo.data,{icon:5})
            }
        },'请求失败', 'GET', undefined, undefined);
    }
	function addTable(retInfo) {
        //$(".newsName").val(retInfo.name);
        //$('.category').val(retInfo.category);
        $('.modelNo').val(retInfo.modelNo);
       // $('.spec').val(retInfo.spec);
        //$('.unit').val(retInfo.unit);
        $(".originalPrice").val(retInfo.originalPrice);
        $(".price").val(retInfo.price);
        $(".quantity").val(retInfo.quantity);
        $(".day").val(retInfo.day);
        special_addTag.init_appoint_result(retInfo.result,$(".addCensorItems"));
        form.render();
    }

 	var addNews = {};
 	form.on("submit(addTemplateProject)",function(data){
         addNews.name = $(".projectName").val();
         //addNews.category = $('.category').val();
        addNews.modelNo = $('.modelNo').val();
        //addNews.spec = $('.spec').val();
        //addNews.unit = $('.unit').val();
         addNews.originalPrice = $(".originalPrice").val();
         addNews.price = $(".price").val();
        addNews.paidAmount = 0;
        addNews.quantity = $(".quantity").val();
         addNews.day = $(".day").val();
         addNews.result = getMubanResult($(".appoint_result"));
         addNews.receiverId = $(".fenToName").val();
        addNews.receiveName = $('.fenToName').find("option:selected").text();
         if($("input:checkbox[name='saveTemplate']:checked").val() == 'on'){
             addNews.isTemplate = true;
         } else {
             addNews.isTemplate = false;
         }
 		console.log(addNews);
         tableLocal.push(addNews)
        console.log(tableLocal)
        localStorage.setItem('localInfo',JSON.stringify(tableLocal));
         parent.window.location.reload();
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
        m = m.split('|');
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
