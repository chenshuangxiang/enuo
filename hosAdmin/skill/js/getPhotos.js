var form;
var arr_pic = [];
layui.use(['form','layer','jquery','layedit','upload'],function(){
	 form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		layedit = layui.layedit,
		$ = layui.jquery;
    var upload = layui.upload;

    form.render();
    //拖拽上传
    upload.render({
        elem: '#projectImg',
        url: SERVER_ADDR + '/common/file/upload'
        ,multiple: true,
        done: function(res){
            arr_pic.push(res.data);
            init_img(arr_pic);//初始化上传图片
            /*$('.imgList').append('<div class="initImg" style="border: 1px solid #dddddd" data_id="0" data_val="0">' +
                '<img style="height: inherit" onclick="delphoto(this)" class="closePhoto" src="img/closePhoto.png">' +
                '<img src="'+res.data+'"></div>');*/
        }
    });

 	var addNews = {};
         addNews.mobile = getQueryString('valueid');
 		console.log(addNews);
 		var url = SERVER_ADDR + "/hospital/user/getUserImage.json";
       // var index = layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        ajaxGetRetInfo(url,addNews,function (retInfo) {
            console.log(retInfo)

			if(retInfo.success){
                init_getimg(retInfo.data);//初始化上传图片

                //layer.closeAll("iframe");
                //parent.window.location.reload();
			}else{
            	layer.alert(retInfo.data,{icon:5})
			}
            //form.render('select', 'from');//更新
        },'请求失败', 'GET', undefined, undefined);
});
//拍照照片
function getPhotoList(){
    var arr_job=[];
    //得到坐诊数据
    $(".initImg").each(function(){
        var work_obj={};//当前子表格对象
        work_obj.imgUrl=$(this).children('.imgPhoto').attr("src");
        work_obj.remark=$(this).children('.remark').val();
        arr_job.push(work_obj);
    });
    console.log(arr_job);
    return arr_job;
}
