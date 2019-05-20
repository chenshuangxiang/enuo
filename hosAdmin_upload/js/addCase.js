var form;
var arr_pic = [];
var isPreferential = false;
var marketable = false;
var isDrainage = false;
layui.use(['form','layer','jquery','upload'],function(){
	 form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		$ = layui.jquery;
    var upload = layui.upload;
    form.render();
    //拖拽上传
    upload.render({
        elem: '#projectImg',
        url: SERVER_ADDR + '/common/file/upload',
        done: function(res){
            arr_pic.push(res.data);
            init_img(arr_pic);//初始化上传图片
            /*$('.imgList').append('<div class="initImg" style="border: 1px solid #dddddd" data_id="0" data_val="0">' +
                '<img style="height: inherit" onclick="delphoto(this)" class="closePhoto" src="img/closePhoto.png">' +
                '<img src="'+res.data+'"></div>');*/
        }
    });
 	var addNews = {};
 	form.on("submit(addCase)",function(data){
        addNews.fkId = getQueryString('id');
        addNews.type = getQueryString('type');
        addNews.images = toHash(arr_pic);
        addNews.content = $(".brief").val();
 		console.log(addNews);
 		var url = SERVER_ADDR + "/hospital/effectCase/add";

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
