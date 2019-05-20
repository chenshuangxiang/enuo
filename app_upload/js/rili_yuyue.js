
function init() {
    Get.name();
}
//判断滑动
var startx, starty;
//获得角度
function getAngle(angx, angy) {
    return Math.atan2(angy, angx) * 180 / Math.PI;
}

//根据起点终点返回方向 1向上 2向下 3向左 4向右 0未滑动
function getDirection(startx, starty, endx, endy) {
    var angx = endx - startx;
    var angy = endy - starty;
    var result = 0;
    console.log(angx,angy)
    //如果滑动距离太短
    if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
        return result;
    }

    var angle = getAngle(angx, angy);
    if (angle >= -135 && angle <= -45) {
        result = 1;
    } else if (angle > 45 && angle < 135) {
        result = 2;
    } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
        result = 3;
    } else if (angle >= -45 && angle <= 45) {
        result = 4;
    }

    return result;
}
//手指接触屏幕
document.getElementById("schedule-box").addEventListener("touchstart", function(e) {
    startx = e.touches[0].pageX;
    starty = e.touches[0].pageY;
}, false);
//手指离开屏幕
document.getElementById("schedule-box").addEventListener("touchend", function(e) {
    var endx, endy;
    endx = e.changedTouches[0].pageX;
    endy = e.changedTouches[0].pageY;
    var direction = getDirection(startx, starty, endx, endy);
    console.log(direction)
    switch (direction) {
         /*case 0:
             alert("未滑动！");
             break;*/
         case 1:
             /*alert("向上！")*/
             $('#nextMonth').click();
             break;
         case 2:
           /*  alert("向下！")*/
             $('#prevMonth').click();
             break;
        case 3:
            //alert("向左！")
            $('#nextMonth').click();
            break;
        case 4:
            //alert("向右！")
            $('#prevMonth').click();
            break;
        default:
    }
}, false);
var Get = {
    name: function () {
        var url = SERVER_ADDR + '/app/medical/beautyProject/getReservationInfo.json';
        var Data = {};
        Data.id = getQueryString('cpId');
        ajaxGetRetInfo(url, Data, this.nameSuccess, '请求失败', 'GET', true, undefined);
    },
    nameSuccess:function (retInfo) {
        console.log(retInfo);
        /*retInfo = JSON.parse(retInfo);*/
        if(retInfo.success == true){
            $('.riliHos').text(retInfo.data.hospitalName);
            $('.riliFunc').text(retInfo.data.name);
        }else{
            alert(retInfo.data);
        }
    }
}
var Btn = {
    yuyue: function () {
        var url = SERVER_ADDR + '/app/user/reservation';
        var Data = {};
        var reservationDate = $('#h3Ele').text() == '' ? $('.today-flag').attr('title') : $('#h3Ele').text();
        Data.fkId = getQueryString('cpId');
        Data.reservationDate = reservationDate;
        Data.type = 'medicalBeauty';
        ajaxGetRetInfo(url, Data, this.yuyueSuccess, '请求失败', 'POST', true, undefined);
    },
    yuyueSuccess:function (retInfo) {
        console.log(retInfo);
        /*retInfo = JSON.parse(retInfo);*/
        if(retInfo.success == true){
            window.location.href = 'my_yuyue.html';
        }else{
            alert(retInfo.data);
        }
    },
}