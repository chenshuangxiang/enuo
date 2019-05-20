function getStatus(){
    postget_ajax("/hospital/getCertificate.json","",'GET',function(data){
        //医院审核状态
        console.log(data.data.name);
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
        }
    })
}