function firstConcult() {
    var Data = {};
    Data.mobile = getQueryString('mobile');
    $.get_ajax("/hospital/allot/getPatientInfo.json",Data,function(retInfo){
        $('.span').text(retInfo.data.name);
        if(retInfo.data.sex == 'man'){
            retInfo.data.sex = '男';
        }else if(retInfo.data.sex == 'woman'){
            retInfo.data.sex = '女';
        } else if(retInfo.data.sex == 'unknown'){
            retInfo.data.sex = '不详';
        }
        if(!retInfo.data.job){
            retInfo.data.job = '';
        }
        if(!retInfo.data.address){
            retInfo.data.address = '';
        }
        $('.submenu2').html('姓名:'+retInfo.data.name + '' + ' &nbsp;&nbsp;&nbsp;&nbsp;手机号:' + getQueryString('mobile') + ' &nbsp;&nbsp;&nbsp;&nbsp;年龄:' + retInfo.data.age + ' &nbsp;&nbsp;&nbsp;&nbsp;性别:' + retInfo.data.sex + ' &nbsp;&nbsp;&nbsp;&nbsp;职业:' + retInfo.data.job + ' &nbsp;&nbsp;&nbsp;&nbsp;地址:' + retInfo.data.address);

    });
}