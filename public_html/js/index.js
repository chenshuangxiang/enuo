function loadImage(url, callback) {
    var img = new Image();
    img.src = url;
    if (img.complete) {
        callback.call(img);
        return;
    }
    img.onload = function () {
        callback.call(img);
    };
};

$(function () {
	 //头部banner幻灯片
	 (function () {
		$("#banner .loading").show();
        $(".container").find("div").eq(0).addClass("on").show();
        var $slide = $("#J_default_slide"),
		    $container = $(".container", $slide),
			html = "";
        $("div", $container).each(function (i) {
            html += '<a href="javascript:void(0);">' + i + "</a>";
        });
        $slide.append('<div class="pagination">' + html + '</div>');
        $(".pagination a", $slide).eq(0).addClass("on");
		if($("div", $container).length == 1){
			$(".prev", $slide).hide();
			$(".next", $slide).hide();
		}
		//判断第一张默认大图是否加载完毕
		var index_auto_first=$("div", $container).eq(0).attr("data-autoimage");
		loadImage(index_auto_first, function () {
			$("#banner .loading").hide();
			auto_indexplay(0);
		});
		$slide.hover(function(){
			$(".prev", $slide).stop().fadeIn(0).animate({ margin:"-40px 0 0 -470px",opacity:"1"}, 400);
			$(".next", $slide).stop().fadeIn(0).animate({ margin:"-40px 0 0 410px",opacity:"1"}, 400);
		},function(){
			$(".prev", $slide).stop().animate({ margin:"-40px 0 0 -570px",opacity:"0"}, 400).delay(400).fadeOut(0);
			$(".next", $slide).stop().animate({ margin:"-40px 0 0 510px",opacity:"0"}, 400).delay(400).fadeOut(0);
		});
			
        $(".pagination a", $slide).live("click", function () {
			$("#banner .loading").show();
			clearInterval(timer_indexflash);
            $(this).addClass("on").siblings().removeClass("on");
            $("div", $container).eq($(this).index()).fadeIn(750).addClass("on").siblings().fadeOut(750).removeClass("on");
			auto_indexplay($(this).index());
			auto_pic_load($(this).index());
        });
        $(".prev", $slide).on("click", function () {
			$("#banner .loading").show();
			clearInterval(timer_indexflash);
            var index = $("div.on", $container).index();
			if(index==0){
				index=$("div", $container).length-1;
			}
			else{index--;}
			$("div", $container).eq(index).fadeIn(750).addClass("on").siblings().fadeOut(750).removeClass("on");
			$(".pagination a", $slide).eq(index).addClass("on").siblings().removeClass("on");
			auto_indexplay(index);
			auto_pic_load(index);
        })
        $(".next", $slide).on("click", function () {
			$("#banner .loading").show();
			clearInterval(timer_indexflash);
            var index = $("div.on", $container).index();
			if(index==$("div", $container).length-1){
				index=0;
			}
			else{index++;}
			$("div", $container).eq(index).fadeIn(750).addClass("on").siblings().fadeOut(750).removeClass("on");
			$(".pagination a", $slide).eq(index).addClass("on").siblings().removeClass("on");
			auto_indexplay(index);
			auto_pic_load(index);
        })
		function auto_indexplay(zd_index){
			timer_indexflash = setInterval(function(){
				if(zd_index<$("div", $container).length-1){
					zd_index++;
				}
				else{zd_index=0;}
				$("#banner .loading").show();
				$("div", $container).eq(zd_index).fadeIn(750).addClass("on").siblings().fadeOut(750).removeClass("on");
				$(".pagination a", $slide).eq(zd_index).addClass("on").siblings().removeClass("on");
				auto_pic_load(zd_index);
				},7500);
		}
		function auto_pic_load(index_pic){
			var index_auto_picurl=$("div", $container).eq(index_pic).attr("data-autoimage");
			loadImage(index_auto_picurl, function () {
				$("#banner .loading").hide();
			});
		}
		/*首页新闻滚动播放*/

		function AutoScroll(obj) {
			var objHeight = $(obj).height();
			$(obj).find("ul:first").animate({
				marginTop: -objHeight + "px"
			}, 500, function() {
				$(this).css({
					marginTop: "0px"
				}).find("li:first").appendTo(this);
			});
		};
		if ($(".newsScroll")) {
			setInterval(function() {
				AutoScroll(".newsScroll")
			}, 4500);
		}
		/*hot图标上下抖动
		setInterval(function(){
				$(".subMenuLinkBox a.hot,.zhutiWripper a.hot,.stage1Title span").toggleClass("active");
			},2000)
		*/
		
		
		
     //品牌形象墙效果切换
	 $("#YH_ppq .loading").show();
        $(".t_ppq_cont").find("div").eq(0).addClass("on").show();
        var $t_ppq = $("#t_ppq"),
		    $t_ppq_cont = $(".t_ppq_cont", $t_ppq),
			html_txt = "";
		$(".t_ppq_nav li", $t_ppq).eq(0).addClass("on");
		//判断第一张默认大图是否加载完毕
		var index_auto_first_pp=$("div", $t_ppq_cont).eq(0).attr("data-autoimage");
		loadImage(index_auto_first_pp, function () {
			$("#YH_ppq .loading").hide();
			auto_indexplay_pp(0);
		});
		function auto_indexplay_pp(pp_index){
		  timer_indexflash_pp = setInterval(function(){
			if(pp_index<$("div", $t_ppq_cont).length-1){
				pp_index++;
			}
			else{pp_index=0;}
			$("#YH_ppq .loading").show();
			$("div", $t_ppq_cont).eq(pp_index).fadeIn(750).addClass("on").siblings().fadeOut(750).removeClass("on");
			$(".t_ppq_nav li", $t_ppq).eq(pp_index).addClass("on").siblings().removeClass("on");
			auto_pic_pp_load(pp_index);
			},7500);
		}
		$(".t_ppq_nav li", $t_ppq).live("click", function () {
			$("#YH_ppq .loading").show();
			clearInterval(timer_indexflash_pp);
            $(this).addClass("on").siblings().removeClass("on");
            $("div", $t_ppq_cont).eq($(this).index()).fadeIn(750).addClass("on").siblings().fadeOut(750).removeClass("on");
			auto_indexplay_pp($(this).index());
			auto_pic_pp_load($(this).index());
        });
		function auto_pic_pp_load(indexpp_pic){
			var pp_picurl=$("div", $t_ppq_cont).eq(indexpp_pic).attr("data-autoimage");
			loadImage(pp_picurl, function () {
				$("#YH_ppq .loading").hide();
			});
		}
	})();
	
	//专家切换
	$(".stage1_c").touchSlider({
		duration: 800, // 动画速度
        delay: 9000, // 动画时间间隔
		margin:0,
        mouseTouch: true,
        next: ".nextBtn",
        pagination: ".focus span",
        currentClass: "active",
        prev: ".preBtn",
		autoplay:true, // 自动播放
		viewport: ".expertSlide"
	});
	//你想要的·都在这里---热门项目切换
	$(".rmxm_lists").touchSlider({
		duration: 600, // 动画速度
        delay: 7000, // 动画时间间隔
		margin:0,
        mouseTouch: false,
        next: ".rmxm-next",
        pagination: ".rmxm-nav-item",
        currentClass: "rmxm-nav-item-current",
        prev: ".rmxm-prev",
		autoplay:true, // 自动播放
		viewport: ".rmxm-viewport"
	});
	//美丽·是爱的礼物----真实对比
	$(".YHanli_lists").touchSlider({
		duration: 600, // 动画速度
        delay: 7000, // 动画时间间隔
		margin:0,
        mouseTouch: true,
        next: ".anli-next",
        pagination: ".anli-nav-item",
        currentClass: "anli-nav-item-current",
        prev: ".anli-prev",
		viewport: ".anli-viewport"
	});
	//品牌活动展示效果
	$(document).ready(function(){
	$("#ms_hd").mouseslide({
		height:'754px', //元素高度
		widthExpand:true, //宽度自适应
		mirror:false,
		});
	});
	//*****底部监督单位、授权合作、学术会议、媒体支持、友情链接、更多项目切换效果
	 
	$(".foot_box").find(".slide").eq(0).addClass("current").show();
	var $footer = $("#footer"),
		$foot_box = $(".foot_box", $footer),
		html_txt = "";
	$(".slideFocus span", $footer).eq(0).addClass("current");
	$(".slideFocus span", $footer).live("click", function () {
		$(this).addClass("current").siblings().removeClass("current");
		$(".slide", $foot_box).eq($(this).index()).fadeIn(0).addClass("current").siblings().fadeOut(0).removeClass("current");
		
	});
	//更多项目 详细文章切换效果
	$(".seoMenus").touchSlider({
		duration: 300, // 动画速度
        delay: 500, // 动画时间间隔
		margin:0,
        mouseTouch: false,
        pagination: ".seo-nav-item",
        currentClass: "active",
		viewport: ".foot_seo"
	});
});

$(function() {
	var st = 180;
	// 地址
	$(".middle > .add_box").hover(function() {
        $(this).find('.add_down').stop(false, true).slideDown(st);
		//$(".middle > .add_box").children(".add_down").fadeIn(100);
	}, function() {
        $(this).find('.add_down').stop(false, true).slideUp(st);
		//$(".middle > .add_box").children(".add_down").fadeOut(100);
	});
	/*导航效果*/
	$(function() {
		$('.nav-wrap').prepend('<p class="mask"></p>');
		$('.nav-menu').hover(
			function() {
				$('.mask').stop();
				$(this).find('.dbt').css('color','#fff');
				//$(this).children('.nav_xl').show();
				$(this).parents('.nav-wrap').children('.mask').animate({
					'left': ($(this).position().left) + 'px'
				}, 'fast');
        		$(this).find('.nav_xl').stop(false, true).slideDown(st);
			},
			function() {
				//$(this).children('.nav_xl').hide();
				$(this).find('.dbt').css('color','#ccc');	
        		$(this).find('.nav_xl').stop(false, true).slideUp(st);		
			}
		);
	});
	
})