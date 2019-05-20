//初始化图片
function init_img2(file){
//	console.log(file);
	var html="";
	for(var i=0;i<file.length;i++){
		
       html =html+'<div class="initImg" data_id="0"  data_val="'+i+'">' +
			        '<img src="'+file[i]+'">' +
			      '</div>'
	}
	$(".preview2").html(html);
}
//选中删除
$(".btn_remove_pic2").click(function(){
	console.log("删除");
	$(".preview2 div").each(function(){
		if($(this).attr("data_id")==1){
			var index = $(this).attr("data_val");
			console.log(index);
			arr_pic2.splice(index,1);//删除对应的元素
			console.log(arr_pic2);
		}
		init_img2(arr_pic2);//初始化图片
	});
	
});
//改变要删除的图片的状态值
$(".preview2").delegate("div","click",function(){
	console.log("点击图片");
	if($(this).attr("data_id")==0){
		console.log("变成1");
		$(this).attr("data_id",1).css({"border":"2px solid #00a2d4"});
	}else{
		console.log("变成0");
		$(this).attr("data_id",0).css({"border":"0"});
	}
});

/***
 * 3，webUpload插件
 */
var arr_pic2 = [];//已上传的图片数组（企业营业执照照片)

//创建Web Uploader实例
// 初始化Web Uploader
var uploader2 = WebUploader.create({
    // 选完文件后，是否自动上传。
    auto: true,
    // swf文件路径
//  swf: BASE_URL + '/js/Uploader.swf',
    // 文件接收服务端。
    server: url+'/common/file/upload',
    // 选择文件的按钮。可选。
    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
    pick: '#filePicker2',
    // 只允许选择图片文件。
    accept: {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png',
        mimeTypes: 'image/jpg,image/jpeg,image/png'
    }
});

//监听fileQueued事件，通过uploader2.makeThumb来创建图片预览图
// 当有文件添加进来的时候
//uploader2.on( 'fileQueued', function( file ) {
//	console.log(file);
//	var $li = $(
//      '<div id="' + file.id + '" class="file-item thumbnail" data_id="0">' +
//          '<img>' +
//          '<div class="info">' + file.name + '</div>' +
//      '</div>'
//      ),
//  $img = $li.find('img');
//});

//手动上传图片
//$(".btn_upload_pic").click(function(){
//	console.log("上传");
//	uploader2.upload();
//});

// 文件上传成功，给item添加成功class, 用样式标记上传成功。
uploader2.on( 'uploadSuccess', function( file,res) {
    $( '#'+file.id ).addClass('upload-state-done');
    console.log("上传成功");
    console.log(res.data);
    arr_pic2.push(res.data);
    console.log(arr_pic2);
    init_img2(arr_pic2);//初始化上传图片
});

// 文件上传失败，显示上传出错。
uploader2.on( 'uploadError', function( file,res) {
    var $li = $( '#'+file.id ),
        $error = $li.find('div.error');

    // 避免重复创建
    if ( !$error.length ) {
        $error = $('<div class="error"></div>').appendTo( $li );
    }

    $error.text('上传失败');
    console.log("上传成功");
});
