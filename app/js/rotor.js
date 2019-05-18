var flag="";
var turnplate={
    restaraunts:[],				//大转盘奖品名称
    colors:[],					//大转盘奖品区块对应背景颜色
    outsideRadius:183,			//大转盘外圆的半径
    textRadius:130,				//大转盘奖品位置距离圆心的距离
    insideRadius:50,			//大转盘内圆的半径
   /* outsideRadius:170,			//大转盘外圆的半径
    textRadius:130,				//大转盘奖品位置距离圆心的距离
    insideRadius:55,			//大转盘内圆的半径*/
    startAngle:0,				//开始角度
    bRotate:false				//false:停止;ture:旋转
};
var title = '【女神大狂欢】狂欢特价！';
var link = 'https://www.enuo120.com/app/browShare.html';
var imgUrl = 'https://www.enuo120.com/app/img/browActive/browOrder.jpg';  //分享的信息
var desc = '一大波超值福利等你来抢！';
window.onload = function () {
    Get.drawRouletteWheel();
};
function  init() {
    //动态添加大转盘的奖品与奖品区域背景颜色  fff4d8   ffffff
    turnplate.restaraunts = ["衡力单部位除皱针","爱芙莱0.5ml","C6全面部嫩肤","深蓝面部提升", "私密保养", "除皱针", "海薇玻尿酸","妊娠纹修复","有针水光", "干细胞祛皱",
        "优立塑","点阵激光收缩毛孔"];
    /*turnplate.colors = ["#a5da35", "#50c2ee", "#a5da35", "#50c2ee","#a5da35", "#50c2ee", "#a5da35", "#50c2ee",
        "#a5da35", "#50c2ee", "#a5da35", "#50c2ee","#a5da35", "#50c2ee", "#a5da35", "#50c2ee",
        "#a5da35", "#50c2ee", "#a5da35"];*/
    turnplate.colors = ["#fff4d8", "#ffffff", "#fff4d8", "#ffffff","#fff4d8", "#ffffff", "#fff4d8", "#ffffff",
        "#fff4d8", "#ffffff", "#fff4d8", "#ffffff"];
    getSign();
    if(window.innerHeight > document.body.scrollHeight){
        $('.browDetailBackImg').height(window.innerHeight);
    }else{
        $('.browDetailBackImg').height(document.body.scrollHeight);
    }
    Get.chouCi();
    var mobileFirstArray = [137,139,158,150,135,187,159,188,130,156];
    var mobileEndArray = [2203,2478,5310,2563,2452,1410,1478,3541,2415,8874];

    var productGetArray = turnplate.restaraunts;//['水氧美人体验券','超声洁牙免费体验券','激光祛痣体验券','青春解码体验券','无针水光针体验券'];
    for(var i = 0;i <= 52; i++){
        var mathRadomMobile = Math.ceil(Math.random()*9);
        var mathRadomMobileEnd = Math.ceil(Math.random()*9);
        var mathRadomFive = Math.ceil(Math.random()*4);
        var html = '';
        html += '<li>恭喜'+mobileFirstArray[mathRadomMobile]+'****'+mobileEndArray[mathRadomMobileEnd]+'获得'+productGetArray[mathRadomFive]+'奖</li>'
        $(".line").append(html);
    }
    $(".line").slideUpGun();
}
var Get = {
    chouCi:function () {
        var url = SERVER_ADDR + '/app/user/activity/remaining/pickOutSize';
        var Data = {};
        Data.activityId = 5;
        ajaxGetRetInfo(url, Data, this.chouCiSuccess, '请求失败', 'GET', true, undefined);
    },
    chouCiSuccess:function (res) {
        if(res.success){
            $('.chouCi').text(res.data.size);
        }else{
                alert(res.data);
        }
    },
    chou:function () {
        if ($('.pointer').attr('click') != 'false') {
            var url = SERVER_ADDR + '/app/user/activity/luckyWeel';
            var Data = '';
            $('.pointer').attr('click', 'false');
            ajaxGetRetInfo(url, Data, this.chouSuccess, '请求失败', 'POST', true, undefined);
        }
    },
    chouSuccess:function (res) {
        if(res.success){
            Get.chouCi();
            for (var i = 0; i < turnplate.restaraunts.length; i++) {
                console.log(res.data)
                if (turnplate.restaraunts[i] == res.data) {
                    //alert("奖品结果的下标"+i);
                    var item = i;
                    if (turnplate.bRotate) return;
                    turnplate.bRotate = !turnplate.bRotate;
                    //奖品数量等于10,指针落在对应奖品区域的中心角度[252, 216, 180, 144, 108, 72, 36, 360, 324, 288]
                    console.log(item + "," + turnplate.restaraunts[item]);
                    Get.rotateFn(item + 1, turnplate.restaraunts[item]);
                }
            }
        }else{
            $('.pointer').attr('click','true');
            alert(res.data);
        }
    },
    rotateFn:function (item, txt) {  //旋转转盘 item:奖品位置; txt：提示语;
        var angles = item * (360 / turnplate.restaraunts.length) - (360 / (turnplate.restaraunts.length*2));
        if(angles<270){
            angles = 270 - angles;
        }else{
            angles = 360 - angles + 270;
        }
        $('#wheelcanvas').stopRotate();
        $('#wheelcanvas').rotate({
            angle:0,
            animateTo:angles+3600,
            duration:7000, //转盘速度
            callback:function (){
                $('.paySuccessZi').text("恭喜您抽中了:"+txt);
                $('.modelOpen').show();
                $('.pointer').attr('click','true');
                turnplate.bRotate = !turnplate.bRotate;
            }
        });
    },
    drawRouletteWheel:function () {
        var canvas = document.getElementById("wheelcanvas");
        if (canvas.getContext) {
            //根据奖品个数计算圆周角度
            var arc = Math.PI / (turnplate.restaraunts.length/2);
            var ctx = canvas.getContext("2d");
            //在给定矩形内清空一个矩形
            ctx.clearRect(0,0,400,400);
            //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
            ctx.strokeStyle = "#FFBE04";
            //font 属性设置或返回画布上文本内容的当前字体属性
            ctx.font = '15px Microsoft YaHei';
            for(var i = 0; i < turnplate.restaraunts.length; i++) {
                var angle = turnplate.startAngle + i * arc;
                ctx.fillStyle = turnplate.colors[i];
                ctx.beginPath();
                //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
                ctx.arc(200, 200, turnplate.outsideRadius, angle, angle + arc, false);
                ctx.arc(200, 200, turnplate.insideRadius, angle + arc, angle, true);
                ctx.stroke();
                ctx.fill();
                //锁画布(为了保存之前的画布状态)
                ctx.save();
                //----绘制奖品开始----
                ctx.fillStyle = "#E5302F";
                var text = turnplate.restaraunts[i];
                var line_height = 17;
                //translate方法重新映射画布上的 (0,0) 位置
                ctx.translate(200 + Math.cos(angle + arc / 2) * turnplate.textRadius, 200 + Math.sin(angle + arc / 2) * turnplate.textRadius);
                //rotate方法旋转当前的绘图
                ctx.rotate(angle + arc / 2 + Math.PI / 2);
                ctx.rotate(90*Math.PI/180);  //文字旋转
                /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
                if(text.indexOf("M")>0){//流量包
                    var texts = text.split("M");
                    for(var j = 0; j<texts.length; j++){
                        ctx.font = j == 0?'bold 20px Microsoft YaHei':'16px Microsoft YaHei';
                        if(j == 0){
                            ctx.fillText(texts[j]+"M", -ctx.measureText(texts[j]+"M").width / 2, j * line_height);
                        }else{
                            ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
                        }
                    }
                }else if(text.indexOf("M") == -1 && text.length>7){//奖品名称长度超过一定范围
                    text = text.substring(0,7)+"||"+text.substring(7);
                    var texts = text.split("||");
                    for(var j = 0; j<texts.length; j++){
                        ctx.fillText(texts[j], -ctx.measureText(texts[j]).width / 2, j * line_height);
                    }
                }else{
                    //在画布上绘制填色的文本。文本的默认颜色是黑色
                    //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
                    ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
                }
                //添加对应图标
                if(text.indexOf("闪币")>0){
                    var img= document.getElementById("shan-img");
                    img.onload=function(){
                        ctx.drawImage(img,-15,10);
                    };
                    ctx.drawImage(img,-15,10);
                }else if(text.indexOf("谢谢参与")>=0){
                    var img= document.getElementById("sorry-img");
                    img.onload=function(){
                        ctx.drawImage(img,-15,10);
                    };
                    ctx.drawImage(img,-15,10)
                }
                //把当前画布返回（调整）到上一个save()状态之前
                ctx.restore();
                //----绘制奖品结束----
            }
        }
    }
}
