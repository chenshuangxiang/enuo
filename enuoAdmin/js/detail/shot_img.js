/**
 * 处理图片截图
 */
var arr_doc_pic=[];
var arr_doc_pic2 = [];
var j=0;
function convertCanvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL("image/png");
    console.log(image);
    return image;
}
function getResultImage(m){
	if(j<i){
		var data = {
			"imgStr":m
		}
		$.ajax({
			url:url+"/common/file/uploadByBase64",
			type:"post",
			async:false,
			data:data,
			dataType:"json",
			success:function(res){
				if(res.success==true){
					j++;
					console.log(res.data);
					if(imgNum == 1){
                        arr_doc_pic.push(res.data);
                        init_img_hos(arr_doc_pic);
					}else if(imgNum == 2){
                        arr_doc_pic2.push(res.data);
                        init_img_hos2(arr_doc_pic2);
					}

	
				}
			},
			error:function(res){
				console.log(res);
			},
			statusCode: {
		        403:function(){
		        	parent.location.href = "login.html";
		        }
	    	}
		});

	}
	
}
var i=0;
$(".popup_box .confirmSurePic").click(function(){
	i++;
	console.log(i);
	$(".shade,.popup_box").hide();
});