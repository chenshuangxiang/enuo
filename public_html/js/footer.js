return false;/*商务通*/var jspath, scripts = document.getElementsByTagName("script");jspath = scripts[scripts.length - 1].getAttribute("src");jspath = jspath.substring(0, jspath.lastIndexOf("/") + 1);var csspath = jspath.substring(0, jspath.lastIndexOf("/") -3)+'/css/';document.writeln("<script language=\"javascript\" src=\"http://pht.zoosnet.net/JS/LsJS.aspx?siteid=PHT77047529&float=1\"></script>");document.writeln("<link href=\""+csspath+"pfstyle.css\" rel=\"stylesheet\"/>");//右侧代码结构document.writeln("<div class=\"swtRirhgt translateY\"> <a href=\"javascript:void(0)\"  target=\"_self\" class=\"commonIcon swtLink\"><em>5</em></a>");document.writeln("  <div class=\"freeTell\">");document.writeln("    <div class=\"conner clearfix\"> <a href=\"javascript:void(0)\" class=\"commonIcon1 tellIcon fl\"></a>");document.writeln("      <div class=\"tellForm fl\">");document.writeln("      	<div class=\"inner clearfix\">");document.writeln("        <input type=\"text\" name=\"tellNumber\" id=\"tellNumber\" class=\"tellNumberTxt fl\" onblur=\"if(!value)value=defaultValue\" onfocus=\"value=\'\'\" value=\"请输入您的电话号码\"/>");document.writeln("        <a href=\"javascript:void(0)\" class=\"tellNumberBtn fl\" title=\"免费回电\">免费回电</a> </div>");document.writeln("        </div>");document.writeln("    </div>");document.writeln("  </div>");document.writeln("  <a href=\"http://wpa.b.qq.com/cgi/wpa.php?ln=1&key=XzgwMDEyODM5MF8zODM4ODVfODAwMTI4MzkwXzJf\" class=\"commonIcon qqLink\" target=\"_blank\"></a>");document.writeln("  <a href=\"#\" target=\"_blank\" class=\"commonIcon addressLink\"></a>");/*document.writeln("  <a href=\"/pinpai/hmaddress.html\" target=\"_blank\" class=\"commonIcon addressLink\"></a>");*/document.writeln("  <a href=\"javascript:void(0)\" class=\"commonIcon scrollTop\"></a>");document.writeln("</div>");//中间弹窗代码结构//右下角document.writeln("<div class=\"swtBottom\" id=\"swtBottom\">");document.writeln("	<div class=\"title\">");document.writeln("    	<span>快速咨询</span>");document.writeln("        <a href=\"javascript:void(0)\" class=\"closeBtn\"></a>");document.writeln("    </div>");document.writeln("    <div class=\"chatBox\">");document.writeln("    	<div class=\"welcomeWord\">您好，有什么可以帮助您的？整形可分期付款哦~");document.writeln("</div>");document.writeln("    </div>");document.writeln("    <div class=\"chatTxt clearfix\">");document.writeln("    	<div class=\"txt fl\"><textarea id=\"myInput\"  placeholder=\"在此输入可直接对话\"></textarea></div>");document.writeln("        <a href=\"javascript:openswt()\"  class=\"txtSubmit fl\" target=\"_self\"><span>发送</span><span>Enter</span></a>");document.writeln("    </div>");document.writeln("</div>");$(function(){	//生成咨询随机数	function GetRandomNum(Min,Max)	{   	var Range = Max - Min;   	var Rand = Math.random();   	return(Min - Math.round(Rand * Range));   	}   	var num = GetRandomNum(40,70);		$(".swtLink em").html(num);	$(".swtCenter i").html(num);	//右侧   swtRirhgt执行效果	$(".freeTell").on("mouseenter",function(e){			$(this).find(".conner").stop().animate({left:-246+'px'},600)		}).on("mouseleave",function(){				$(this).find(".conner").stop().animate({left:0},400)	});	//右下角咨询显示效果	setTimeout(function(){$(".swtBottom").animate({width:185+"px",height:158+"px"},600)	},1300);			$(".swtBottom .txtSubmit").on("click",function(){	var swt="http://pht.zoosnet.net/LR/Chatpre.aspx?id=PHT77047529&lng=cn&r=foot&p=foot";	window.open(swt);	})	//右下角	$(".swtBottom").find(".closeBtn").on("click",function(){			$(".swtBottom").animate({width:0,height:0},800,function(){					setTimeout(function(){							$(".swtCenter").removeClass("off");						},70000)									})		});	$(".swtBottom").find("textarea").keyup(function (e) {  	   if (e.which == 13){  			$(".swtBottom .txtSubmit").click();  	   }  	});		//电话回拨触发	$(".swtRirhgt .tellNumberBtn").on("click",function(){			var tellNumber = $(".tellNumberTxt").val();			lxb.call(tellNumber);		});	/*返回顶部*/	function pageScroll(){		//把内容滚动指定的像素数（第一个参数是向右滚动的像素数，第二个参数是向下滚动的像素数）		window.scrollBy(0,-100);		//延时递归调用，模拟滚动向上效果速度		scrolldelay = setTimeout(function(){pageScroll()},10);	//获取scrollTop值，声明了DTD的标准网页取document.documentElement.scrollTop，否则取document.body.scrollTop；因为二者只有一个会生效，另一个就恒为0，所以取和值可以得到网页的真正的scrollTop值		var sTop=document.documentElement.scrollTop+document.body.scrollTop;		//判断当页面到达顶部，取消延时代码（否则页面滚动到顶部会无法再向下正常浏览页面）		if(sTop==0) clearTimeout(scrolldelay);	};	$(".swtRirhgt .scrollTop").on("click",function(e){			pageScroll();		})	});document.write('<script type="text/javascript"   data-lxb-uid="3624729" data-lxb-gid="73971" src="http://lxbjs.baidu.com/api/asset/api.js?t=' + new Date().getTime() + '" charset="utf-8"></scr' + 'ipt>' );document.writeln("<script>");document.writeln("document.getElementById(\"sub_btn\").onclick = function () { ");document.writeln("lxb.call(document.getElementById(\"tell_num\"));");document.writeln("};");document.writeln("</script>");function openswt(){	openZoosUrl();LR_HideInvite();;return false;}/*bd统计*/var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");document.write(unescape("%3Cspan style='display:none;' id='cnzz_stat_icon_1257107611'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s95.cnzz.com/z_stat.php%3Fid%3D1257107611' type='text/javascript'%3E%3C/script%3E"));var _hmt = _hmt || [];(function() {  var hm = document.createElement("script");  hm.src = "https://hm.baidu.com/hm.js?780f1ee841dd062c97c4b047abcf01b5";  var s = document.getElementsByTagName("script")[0];   s.parentNode.insertBefore(hm, s);})();//lxbvar lxbID=setInterval("update_lxb()", 100);function update_lxb() {    var o = $("ins");    if (o.length>0) {        $("ins").remove();		clearInterval(lxbID);     }}//swtvar swtID=setInterval("update_swt()", 100);function update_swt() {    if (typeof(LR_UserInviteDiv) != "undefined") {		LR_UserInviteDiv="<div style=\"position:relative;\"><a href=\"javascript:void(0);\" onclick=\"openZoosUrl();LR_HideInvite();return false;\"><img src=\"http://www.lymeirong.com/images/meirongSwt.png\" width=\"422\" height=\"220\" border=\"0\" /></a><a style=\"position:absolute;top:0px;right:0px;z-index:999;width:30px;height:30px;\" href=\"javascript:void(0);\" onclick=\"LR_RefuseChat();LR_HideInvite();return false;\"></a></div>";        		clearInterval(swtID);     }}