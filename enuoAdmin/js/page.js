/**
 * 分页
 */
var control_page = {
	page_num:1,//当前页
	pageSize:15,//每页的长度
	//基本条件
	getData:function(){
		var data = {
			"pageNumber":this.page_num,//当前页
			"pageSize":this.pageSize//每页的长度
			//
		}
		return data;
	},
	//1,初始化分页
	currentPage:function(current_num,all_recode){
		//current_num 当前页
		//all_recode  总记录数
		//all_num  总页数
		//clickSkipPage(this):直接点击数字页码跳转函数
		var all_num = Math.ceil(all_recode/control_page.pageSize);
//		console.log(all_num);
		//1，初始化
		$(".all_page").text(all_num);//全部页数
		$(".all_recode").text(all_recode);//全部记录
		/**
		 * 操作分页
		 */
		var page_element="";
		/**
		 *2，展示全部页
		 * 
		 */
		if(all_num<=5){
			for(var i=1;i<all_num+1;i++){
				page_element = page_element +"<span onclick='clickSkipPage(this)'>"+i+"</span>"
	//			$(".page .page_num").append("<span>"+i+"</span>");
			}
			$(".page .page_num").html(page_element);
		}
		if(all_num>5){
			//展示1-5页
			for(var i=1;i<6;i++){
				page_element = page_element +"<span onclick='clickSkipPage(this)'>"+i+"</span>"
			}
			$(".page .page_num").html(page_element);
		}
		/**
		 *,3，当前页问题
		 */
		//当前页>5，当前页必在中间显示
		if(current_num>5){
			page_element="";
			index_cur = current_num-3;//起始页
			for(var i=0;i<5;i++){
				//当index_cur达到总页数时,不再添加span
				if(index_cur<all_num){
					index_cur++
				}else{
					break;
				}
				console.log(index_cur);
				page_element = page_element +"<span onclick='clickSkipPage(this)'>"+index_cur+"</span>"
			}
			$(".page .page_num").html(page_element);
		}
		//给当前页加颜色
		$(".page_num span").each(function(){
	//		console.log(current_num);
	//		console.log($(this).text());
			if($(this).text()==current_num){
				$(this).css({"color":"white","border":"solid 1px #00afa1","background-color":"#00afa1"});
			}
		})
	},
	//2，操作分页
	init_page:function(data,fun){
//		console.log(data);
		if(fun){
			fun(data);
		}
	}
	
};

//1，上一页
function backPage(){
	if(control_page.page_num>1){
		control_page.page_num--;
	}
	//reqPage(control_page.getData());
    //$(".searchBtn").click();
    search();
}
//2，下一页
function nextPage(){
	if(Number(control_page.page_num)<Number($(".all_page").text())){
		control_page.page_num++;
//		console.log(control_page.page_num);
	}
	//reqPage(control_page.getData());
    //$(".searchBtn").click();
    search();
}
//3，首页
function indexPage(){
	control_page.page_num = 1;
	console.log(control_page.page_num);//当前页
	//reqPage(control_page.getData());
    search(control_page.getData());
}
//4，末尾页
function endPage(){
	control_page.page_num = $(".all_page").text();;
	console.log(control_page.page_num);//当前页
	//reqPage(control_page.getData());
    search(control_page.getData());
}
//5，输入页码确定跳转
function skipPage(){
	control_page.page_num = $(".select_page").val() || 1;
	console.log(control_page.page_num);//当前页
	//reqPage(control_page.getData());
    search(control_page.getData());
}
//6，点击数字直接跳转页
function clickSkipPage(m){
	control_page.page_num = $(m).text();
	console.log(control_page.page_num);//当前页
	//reqPage(control_page.getData());
    search(control_page.getData());
}