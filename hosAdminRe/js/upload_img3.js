//初始化图片
function init_img3(file){
//	console.log(file);
	var html="";
	for(var i=0;i<file.length;i++){
		
       html =html+'<div class="initImg" style="border: 1px solid #dddddd" data_id="0"  data_val="'+i+'">' +
			        '<img style="height: inherit" onclick="delphoto3(this)" class="closePhoto" src="img/closePhoto.png"><img src="'+file[i]+'">' +
			      '</div>'
	}
	$(".preview3").html(html);
}
//初始化图片
function init_img4(file){
//	console.log(file);
    var html="";
    for(var i=0;i<file.length;i++){

        html =html+'<div class="initImg" style="border: 1px solid #dddddd" data_id="0"  data_val="'+i+'">' +
            '<img src="'+file[i]+'">' +
            '</div>'
    }
    $(".preview4").html(html);
}
function delphoto3(obj) {
    /*  $(".preview div").each(function(){*/
    if($(obj).parent().attr("data_id")==0){
        var index = $(obj).parent().attr("data_val");
        console.log(index);
        arr_pic3.splice(index,1);//删除对应的元素
        arr_pic4.splice(index,1);//删除对应的元素
        console.log(arr_pic3);
        console.log(arr_pic4);
    }
    init_img3(arr_pic3);//初始化图片
    init_img4(arr_pic4);//初始化图片
    /*});*/
}
//选中删除
/*$(".btn_remove_pic3").click(function(){
	console.log("删除");
	$(".preview3 div").each(function(){
		if($(this).attr("data_id")==1){
			var index = $(this).attr("data_val");
			console.log(index);
			arr_pic3.splice(index,1);//删除对应的元素
			console.log(arr_pic3);
		}
		init_img3(arr_pic3);//初始化图片
	});
	
});*/
//改变要删除的图片的状态值
/*$(".preview3").delegate("div","click",function(){
	console.log("点击图片");
	if($(this).attr("data_id")==0){
		console.log("变成1");
		$(this).attr("data_id",1).css({"border":"3px solid #00a3d4"});
	}else{
		console.log("变成0");
		$(this).attr("data_id",0).css({"border":"0"});
	}
});*/

/***
 * 3，webUpload插件
 */
var arr_pic3 = [];//已上传的图片数组
var arr_pic4 = [];//已上传的图片数组
$(document).ready(function () {
    $('#file3').on('change', function() {
    	console.log(3)
        var files = this.files;
        sub3(files[0])
        sub4(files[0])
    })
});

function sub3(file) {
    var formData = new FormData();
    formData.append("file", file);
    console.log(file)
    if(file == undefined){
        return
    }
    $.ajax({
        url: url+'/common/file/upload',
        type: "POST",
        data: formData,
        dataType : 'json',
        cache: false,
        processData: false,
        contentType: false,
        success: function(res) {
            console.log(res)
            if (res.success == true) {
                console.log(res.data);
                arr_pic3.push(res.data);
                console.log(arr_pic3);
                init_img3(arr_pic3);//初始化上传图片
                //$('.addPhontBtn').before('<p class="postImgP"><img class="closePhoto" onclick="To.closephoto(this)" src="/app/img/closePhoto.png"><img class="postImg" src="'+data.data+'"></p>')
                $('input[type="file"]').val('');
            } else {
                alert(res.data)
            }
        }
    });
}
function sub4(file) {
    var formData = new FormData();
    formData.append("file", file);
    console.log(file)
    if(file == undefined){
        return
    }
    $.ajax({
        url: url+'/common/file/upload?isClip=true',
        type: "POST",
        data: formData,
        dataType : 'json',
        cache: false,
        processData: false,
        contentType: false,
        success: function(res) {
            console.log(res)
            if (res.success == true) {
                console.log(res.data);
                arr_pic4.push(res.data);
                console.log(arr_pic4);
                init_img4(arr_pic4);//初始化上传图片
                //$('.addPhontBtn').before('<p class="postImgP"><img class="closePhoto" onclick="To.closephoto(this)" src="/app/img/closePhoto.png"><img class="postImg" src="'+data.data+'"></p>')
                $('input[type="file"]').val('');
            } else {
                alert(res.data)
            }
        }
    });
}
