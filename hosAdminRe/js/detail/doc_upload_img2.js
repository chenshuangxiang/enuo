//医院图片
var arr_pic = [];
//监听input file
$("#file").change(function(e){
//	console.log("value变化了");
//	var files = this.files;
	var files = e.target.files;
	console.log(files);
    for (var i=0;i<files.length;i++){
        var file = files[i];
        console.log(file);
        arr_pic.push(file);
    }
    console.log(arr_pic);
//	//预览图像
	reader_img();
});

//手动上传图片
//$(".btn_upload_pic").click(function(){
//	console.log("上传");
//	console.log(arr_pic);
//  $.each(arr_pic,function(index, element) {
//      var file = arr_pic[index];
//      console.log(file);
//      var data = new FormData();
//      data.append('file', file);
//      console.log(data);
//      $.ajax({
//          url: 'http://47.95.254.125:7070/common/file/upload',
//          type: 'POST',
//          dataType: 'text',
//          data: data,
//          cache: false,
//          processData: false,
//          contentType: false,contentType: false,
//          success:function(data) {
//              console.log("成功了");
//              console.log(data);
//          }
//      });
//  });
//});

//预览图像
function reader_img(){
	//判断浏览器是否支持FileReader属性
	if(!window.FileReader){
		console.log("你的浏览器不支持FileReader接口！");
	}
	console.log(document.getElementById("file").value);
	//检验是否为图像文件
    var file = document.getElementById("file").files[0];
    if(!/image\/\w+/.test(file.type)){
        alert("看清楚，这个需要图片！");
        return false;
    }
    //读取
    var reader = new FileReader();    
    //将文件以Data URL形式读入页面
    reader.readAsDataURL(file);    
    //监听文件读取结束后事件    
    reader.onloadend = function (e) {
//    	console.log(e.target.result);
      	arr_pic.push(e.target.result);
      	//e.target.result就是最后的路径地址
//    	$(".preview1").append("<img src='"+e.target.result+"'/>");
      	var html = '<div class="initImg img-container" style="height: 400px">'+
						'<img src="'+e.target.result+'" alt="Picture">'+
					'</div>'
		$(".preview1").html(html);
      	$(".shade,.popup_box").show();
      	csx(1,1);
      	$(".cropper-container").css("height","200px");
    };    
}
//function 
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
//选中删除
$(".btn_remove_pic").click(function(){
	console.log("删除");
	$(".preview2 div").each(function(){
		if($(this).attr("data_id")==1){
			var index = $(this).attr("data_val");
			console.log(index);
			arr_doc_pic.splice(index,1);//删除对应的元素
			console.log(arr_doc_pic);
		}
		init_img_hos(arr_doc_pic);//初始化图片
	});
	
});

//初始化
function init_img_hos(file){
	console.log(file);
	var html="";
	for(var i=0;i<arr_doc_pic.length;i++){
		html = html+ '<div class="initImg" data_id="0"  data_val="'+i+'">' +
    			'<img src="'+arr_doc_pic[i]+'">' +
 	 		'</div>'
// 	 	$(".preview2").append(html);
	}
	$(".preview2").html(html);
}