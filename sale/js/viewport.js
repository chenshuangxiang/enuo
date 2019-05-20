//设置rem
(function(doc, win) {
    var docEl = doc.documentElement;
    //是判断窗口有没有orientationchange(浏览器支持的改变窗口方向的函数)这个方法，有就把该方法赋值给一个变量，没有就返回resize方法。
    var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    var calFont= function() {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if (clientWidth >= 750) {
                docEl.style.fontSize = '100px';
            } else {
                docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
            }
    };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, calFont, false);
    doc.addEventListener('DOMContentLoaded', calFont, false);//DOMContentLoaded它在DOM加载之后及资源加载之前被触发
})(document, window);






