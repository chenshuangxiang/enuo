$(document).ready(function () {
   $('body').append('<div class="footer" id="nav" style="height: 3.8rem;">' +
       '<ul>' +
       '<li onclick="window.location.href = \'/app/xywz.html\'"><strong class="newsBiaoXywz"></strong><img src="img/banner/homeHui.png"><p>首页</p></li>' +
       '<li onclick="window.location.href = \'/app/special_more.html\'"><strong class="newsBiaoSpecialProduct"></strong><img src="img/banner/te.png"><p>特价专区</p></li>' +
       '<li onclick="window.location.href = \'/app/user_center.html\'"><strong class="newsBiaoUserCenter"></strong><img src="img/banner/myHui.png"><p>我的</p></li>' +
       '</ul>' +
       '</div>') 
});