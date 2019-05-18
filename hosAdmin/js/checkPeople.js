function getStatus(){
    postget_ajax("/hospital/getCertificate.json","",'GET',function(data){
        //医院审核状态
        console.log(data.data.name);
        /*if(data.data.hospitalName == '浙江爱德口腔科'){
            alert('无此账号');
            return;
        }*/
        //缓存医院名字
        window.localStorage.setItem("hos_name",data.data.hospitalName);
        //缓存用户名字
        window.localStorage.setItem("username",data.data.username);
        //把医院类型存入缓存中
        window.localStorage.setItem("hos_type",data.data.type);
        if(data.data.isPerfect == false){
            //把是否完善信息存入缓存中  ，去完善开户行
            window.localStorage.setItem("isPerfect",data.data.isPerfect);
        }
        //跳转

        if(!data.data.roles){
            $('.usertype').text('医院主管：');
            if(window.location.href.indexOf('hosAdmin/index.html') == -1){
                window.location.href='/hosAdmin/index.html';
            }
        }else if(data.data.roles[0] == 'reception'){
            if(window.location.href.indexOf('front/index.html') == -1){
                window.location.href='/hosAdmin/front/index.html';
            }
        }else if(data.data.roles[0] == 'doctor'){
            if(window.location.href.indexOf('doctor/index.html') == -1){
                window.location.href='/hosAdmin/doctor/index.html';
            }
        }else if(data.data.roles[0] == 'doctorHelpmate'){
            if(window.location.href.indexOf('doctor/index.html') == -1){
                window.location.href='/hosAdmin/doctor/index.html';
            }
        }else if(data.data.roles[0] == 'guestService'){
            if(window.location.href.indexOf('user/index.html') == -1){
                window.location.href='/hosAdmin/user/index.html';
            }
        }else if(data.data.roles[0] == 'cashier'){
            if(window.location.href.indexOf('money/index.html') == -1){
                window.location.href='/hosAdmin/money/index.html';
            }
        }else if(data.data.roles[0] == 'medicalTechnology'){
            if(window.location.href.indexOf('skill/index.html') == -1){
                window.location.href='/hosAdmin/skill/index.html';
            }
        }else if(data.data.roles[0] == 'finance'){
            if(window.location.href.indexOf('finance/index.html') == -1){
                window.location.href='/hosAdmin/finance/index.html';
            }
        }else if(data.data.roles[0] == 'nurse'){
            if(window.location.href.indexOf('nurse/index.html') == -1){
                window.location.href='/hosAdmin/nurse/index.html';
            }
        }else{
            alert('角色不存在');
        }
    })
}
function todayNeedAccessCount() {
    ajaxGetRetInfo(SERVER_ADDR+"/hospital/user/today/need/access/count",'',function (retInfo) {
        console.log(retInfo)
        if(retInfo.success){
            localStorage.setItem('loginEnter',0);
            localStorage.setItem('todayNeedAccessCount',retInfo.data);
            //window.location.href="/hosAdmin/login.html";
        }else{
            layer.alert(retInfo.data,{icon:5})
        }
    },'请求失败', 'GET', undefined, undefined);
}