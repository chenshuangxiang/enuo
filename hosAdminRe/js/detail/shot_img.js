/**
 * 处理图片截图
 */
var arr_doc_pic=[];
var j=0;
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
					arr_doc_pic.push(res.data);
					init_img_hos(arr_doc_pic);
	
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
$(".popup_box .con" +
	"firm").click(function(){
	i++;
	console.log(i);
	$(".shade,.popup_box").hide();
});