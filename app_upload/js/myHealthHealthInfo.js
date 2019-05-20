function init() {
    Go.userBasicHealthInfo();
    $('.xuexing').click(function () { //血型选项
        $('.xuexing').removeClass('xuexingActive');
        $(this).addClass('xuexingActive');
    });
    $('.bushi').click(function () { //不适选项
        $('.bushi').removeClass('bushiActive');
        $(this).addClass('bushiActive');
    });
    $('.huanbing').click(function () { //患病选项
        $('.huanbing').removeClass('huanbingActive');
        $(this).addClass('huanbingActive');
    });
    $('.yaowuGuomin').click(function () {  //有无 药物过敏
        $('.yaowuGuomin').removeClass('yaowuGuominActive');
        $(this).addClass('yaowuGuominActive');
    });
    $('.haveYaowuGm').click(function () { //药物过敏
        if($(this).hasClass('haveYaowuGmActive') == true){
            $(this).removeClass('haveYaowuGmActive');
            if($(this).text() == '其他'){
                $('.qitaYaowuGmDiv').hide();
            }
        }else{
            $(this).addClass('haveYaowuGmActive');
            if($(this).text() == '其他'){
                $('.qitaYaowuGmDiv').show();
            }
        }
    });
    $('.fatherDisease').click(function () {  //父亲有无患病
        $('.fatherDisease').removeClass('fatherDiseaseActive');
        $(this).addClass('fatherDiseaseActive');
    });
    $('.havefatherDisease').click(function () { //父亲患的病
        if($(this).hasClass('havefatherDiseaseActive') == true){
            $(this).removeClass('havefatherDiseaseActive');
            if($(this).text() == '其他'){
                $('.qitafatherDiseaseDiv').hide();
            }
        }else{
            $(this).addClass('havefatherDiseaseActive');
            if($(this).text() == '其他'){
                $('.qitafatherDiseaseDiv').show();
            }
        }
    });
    $('.motherDisease').click(function () {  //母亲有无患病
        $('.motherDisease').removeClass('motherDiseaseActive');
        $(this).addClass('motherDiseaseActive');
    });
    $('.havemotherDisease').click(function () { //母亲患的病
        if($(this).hasClass('havemotherDiseaseActive') == true){
            $(this).removeClass('havemotherDiseaseActive');
            if($(this).text() == '其他'){
                $('.qitamotherDiseaseDiv').hide();
            }
        }else{
            $(this).addClass('havemotherDiseaseActive');
            if($(this).text() == '其他'){
                $('.qitamotherDiseaseDiv').show();
            }
        }
    });
    $('.brosisDisease').click(function () {  //兄弟姐妹有无患病
        $('.brosisDisease').removeClass('brosisDiseaseActive');
        $(this).addClass('brosisDiseaseActive');
    });
    $('.havebrosisDisease').click(function () { //兄弟姐妹患的病
        if($(this).hasClass('havebrosisDiseaseActive') == true){
            $(this).removeClass('havebrosisDiseaseActive');
            if($(this).text() == '其他'){
                $('.qitabrosisDiseaseDiv').hide();
            }
        }else{
            $(this).addClass('havebrosisDiseaseActive');
            if($(this).text() == '其他'){
                $('.qitabrosisDiseaseDiv').show();
            }
        }
    });
    $('.childrenDisease').click(function () {  //子女有无患病
        $('.childrenDisease').removeClass('childrenDiseaseActive');
        $(this).addClass('childrenDiseaseActive');
    });
    $('.havechildrenDisease').click(function () { //子女患的病
        if($(this).hasClass('havechildrenDiseaseActive') == true){
            $(this).removeClass('havechildrenDiseaseActive');
            if($(this).text() == '其他'){
                $('.qitachildrenDiseaseDiv').hide();
            }
        }else{
            $(this).addClass('havechildrenDiseaseActive');
            if($(this).text() == '其他'){
                $('.qitachildrenDiseaseDiv').show();
            }
        }
    });
    $('.history').click(function () {  //有无 既往史
        $('.history').removeClass('historyActive');
        $(this).addClass('historyActive');
    });
    $('.guomin').click(function () {  //有无 过敏
        $('.guomin').removeClass('guominActive');
        $(this).addClass('guominActive');
    });
    $('.fuyao').click(function () {  //有无 服药
        $('.fuyao').removeClass('fuyaoActive');
        $(this).addClass('fuyaoActive');
    });
    $('.yimiao').click(function () {  //有无 疫苗
        $('.yimiao').removeClass('yimiaoActive');
        $(this).addClass('yimiaoActive');
    });
}
function addHuanbing(obj) {
    $(obj).attr('onclick','$(this).parent().remove()').attr('src','img/closeInput.png');
    $('.chooseHuanbingDiv').append('<div class="huanbingDivOne"> ' +
        '<input class="huanbingName" style="width: 75%;" placeholder="请输入患病名称" type="text"> ' +
        '<img class="addInput" onclick="addHuanbing(this)" src="img/addPhoto.png"> ' +
        '</div>')
}
function addQitafatherDisease(obj) {
    $(obj).attr('onclick','$(this).parent().remove()').attr('src','img/closeInput.png');
    $('.qitafatherDiseaseDiv').append('<div class="qitafatherDiseaseDivOne"> ' +
        '<input class="fatherDiseaseName" style="width: 75%;margin-right: 0" placeholder="请输入患病名称" type="text"> ' +
        '<img class="addInput" onclick="addQitafatherDisease(this)" src="img/addPhoto.png"> ' +
        '</div>')
}
function addQitamotherDisease(obj) {
    $(obj).attr('onclick','$(this).parent().remove()').attr('src','img/closeInput.png');
    $('.qitamotherDiseaseDiv').append('<div class="qitamotherDiseaseDivOne"> ' +
        '<input class="motherDiseaseName" style="width: 75%;margin-right: -8px" placeholder="请输入患病名称" type="text"> ' +
        '<img class="addInput" onclick="addQitamotherDisease(this)" src="img/addPhoto.png"> ' +
        '</div>')
}
function addQitabrosisDisease(obj) {
    $(obj).attr('onclick','$(this).parent().remove()').attr('src','img/closeInput.png');
    $('.qitabrosisDiseaseDiv').append('<div class="qitabrosisDiseaseDivOne"> ' +
        '<input class="brosisDiseaseName" style="width: 75%;margin-right: -8px" placeholder="请输入患病名称" type="text"> ' +
        '<img class="addInput" onclick="addQitabrosisDisease(this)" src="img/addPhoto.png"> ' +
        '</div>')
}
function addQitachildrenDisease(obj) {
    $(obj).attr('onclick','$(this).parent().remove()').attr('src','img/closeInput.png');
    $('.qitachildrenDiseaseDiv').append('<div class="qitachildrenDiseaseDivOne"> ' +
        '<input class="childrenDiseaseName" style="width: 75%;margin-right: -8px" placeholder="请输入患病名称" type="text"> ' +
        '<img class="addInput" onclick="addQitachildrenDisease(this)" src="img/addPhoto.png"> ' +
        '</div>')
}
function addQitaYaowuGm(obj) {
    $(obj).attr('onclick','$(this).parent().remove()').attr('src','img/closeInput.png');
    $('.qitaYaowuGmDiv').append('<div class="qitaYaowuGmDivOne">' +
        '<input class="qitaYaowuGm" style="width: 75%;margin-right: 8px;" placeholder="请输入其他药物过敏" type="text">' +
        '<img class="addInput" onclick="addQitaYaowuGm(this)" src="img/addPhoto.png">' +
        '</div>')
}
function addGuomin(obj) {
    $(obj).attr('onclick','$(this).parent().remove()').attr('src','img/closeInput.png');
    $('.chooseGuominDiv').append('<div class="guominDivOne"> ' +
        '<input class="guominName" style="width: 75%;" placeholder="请输入过敏源" type="text"> ' +
        '<img class="addInput" onclick="addGuomin(this)" src="img/addPhoto.png"> ' +
        '</div>')
}
function addFuyao(obj) {
    $(obj).attr('onclick','$(this).parent().remove()').attr('src','img/closeInput.png');
    $('.chooseFuyaoDiv').append('<div class="fuyaoDivOne"> ' +
        '<input class="fuyaowuName" style="width: 75%;" placeholder="请输入药品名称" type="text"> ' +
        '<img class="addInput" onclick="addFuyao(this)" src="img/addPhoto.png"> ' +
        '</div>')
}
function addhistory(obj) {
    $(obj).attr('onclick','$(this).parent().remove()').attr('src','img/closeInput.png');
    $('.choosehistoryDiv').append('	<div class="historyDivOne"> ' +
        '<input class="historyName" style="width: 75%;" placeholder="请输入既往史" type="text"> ' +
        '<img class="addInput" onclick="addhistory(this)" src="img/addPhoto.png"> ' +
        '</div>')
}

function addYimiao(obj) {
    $(obj).attr('onclick','$(this).parent().remove()').attr('src','img/closeInput.png');
    $('.chooseYimiaoDiv').append('<div class="yimiaoDivOne"> ' +
        '<input class="yimiaoName" style="width: 75%;" placeholder="请输入接种疫苗" type="text"> ' +
        '<img class="addInput" onclick="addYimiao(this)" src="img/addPhoto.png"> ' +
        '</div>')
}
var Go = {
    userBasicHealthInfo:function () {
        var url = SERVER_ADDR + '/app/user/userBasicHealthInfo';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.userBasicHealthInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    userBasicHealthInfoSuccess: function (res) {
        if (res.success == true) {
            $('.height').val(res.data.height);
            $('.weight').val(res.data.weight);
            $('.waist').val(res.data.waist);
            $('.hip').val(res.data.hip);
            $('.xuexing').each(function (index,value) {
                if(value.innerText == res.data.bloodType){
                    $('.xuexing').removeClass('xuexingActive');
                    $(value).addClass('xuexingActive');
                }
            });
            if(res.data.discomfort && res.data.discomfort != ''){
                $('.bushi').removeClass("bushiActive").eq(1).addClass("bushiActive");
                $('.bushiInput').css('display','inline-block').val(res.data.discomfort);
            }
            if(res.data.ill && res.data.ill != ''){
                $('.huanbing').removeClass("huanbingActive").eq(1).addClass("huanbingActive");
                $('.chooseHuanbingDiv').css('display','inline-block');
                if(res.data.ill.split('|').length <= 1){
                   $('.huanbingName').val(res.data.ill.split('|')[0]);
                }else{
                    var html = '';
                    res.data.ill.split('|').forEach(function (value,index) {
                        html += '<div class="huanbingDivOne"> ' +
                            '<input class="huanbingName" style="width: 75%;" placeholder="请输入患病名称" value="'+value+'" type="text"> ' ;
                        if(res.data.pastHis.split('|').length -1 == index){
                            html += '<img class="addInput" onclick="addHuanbing(this)" src="img/addPhoto.png"> '
                        }else{
                            html += '<img class="addInput" onclick="$(this).parent().remove()" src="img/closeInput.png"> '
                        }
                        html +='</div>'
                    });
                    $('.chooseHuanbingDiv').empty().append(html);
                }
            }
            /*家庭健康开始*/
            console.log(JSON.parse(res.data.familyHealthSituation))
            if(res.data.familyHealthSituation && res.data.familyHealthSituation != '' && res.data.familyHealthSituation != '[]'){
                var familyHealthSituation = JSON.parse(res.data.familyHealthSituation);
                familyHealthSituation.forEach(function (valueJuese) {
                    if(valueJuese.hasOwnProperty('father') == true){
                       Go.huanbingFather(valueJuese);
                    }
                    if(valueJuese.hasOwnProperty('mother') == true){
                        Go.huanbingMother(valueJuese);
                    }
                    if(valueJuese.hasOwnProperty('brosis') == true){
                        Go.huanbingBrosis(valueJuese);
                    }
                    if(valueJuese.hasOwnProperty('children') == true){
                        Go.huanbingChildren(valueJuese);
                    }
                })

            }
            /*家庭健康结束*/
            if(res.data.pastHis && res.data.pastHis != ''){
                $('.history').removeClass("historyActive").eq(1).addClass("historyActive");
                $('.choosehistoryDiv').css('display','inline-block');
                if(res.data.pastHis.split('|').length <= 1){
                    $('.historyName').val(res.data.pastHis.split('|')[0]);
                }else{
                    var html = '';
                    res.data.pastHis.split('|').forEach(function (value,index) {
                        html += '<div class="historyDivOne"> ' +
                            '<input class="historyName" style="width: 75%;" placeholder="请输入既往史" value="'+value+'" type="text"> ';
                       if(res.data.pastHis.split('|').length -1 == index){
                            html += '<img class="addInput" onclick="addhistory(this)" src="img/addPhoto.png"> '
                        }else{
                            html += '<img class="addInput" onclick="$(this).parent().remove()" src="img/closeInput.png"> '
                        }
                        html +='</div>'
                    });
                    $('.choosehistoryDiv').empty().append(html);
                }
            }
            if(res.data.drugAllergyHis && res.data.drugAllergyHis != ''){
                $('.yaowuGuomin').removeClass("yaowuGuominActive").eq(1).addClass("yaowuGuominActive");
                $('.chooseYaowuDiv').css('display','inline-block');
                $('.haveYaowuGm').each(function (index,value) {
                    if(res.data.drugAllergyHis.split('|').indexOf(value.innerText) != -1){
                        $(value).addClass('haveYaowuGmActive');
                    }
                });
                    var html = '';
                    res.data.drugAllergyHis.split('|').forEach(function (value,index) {
                        if(value == '其他'){
                            $('.qitaYaowuGmDiv').css('display','inline-block');
                        }
                        if($('.haveYaowuGm').text().indexOf(value) == -1){
                            html += '<div class="qitaYaowuGmDivOne"> ' +
                                '<input class="qitaYaowuGm" style="width: 75%;" placeholder="请输入其他药物过敏" value="'+value+'" type="text"> ';
                            if(res.data.drugAllergyHis.split('|').length -1 == index){
                                html += '<img class="addInput" onclick="addQitaYaowuGm(this)" src="img/addPhoto.png"> '
                            }else{
                                html += '<img class="addInput" onclick="$(this).parent().remove()" src="img/closeInput.png"> '
                            }
                            html +='</div>'
                        }
                    });
                if(html != ''){
                    $('.qitaYaowuGmDiv').empty().append(html);
                }
            }
            if(res.data.foodAndContactAllergyHis && res.data.foodAndContactAllergyHis != ''){
                $('.guomin').removeClass("guominActive").eq(1).addClass("guominActive");
                $('.chooseGuominDiv').css('display','inline-block');
                if(res.data.foodAndContactAllergyHis.split('|').length <= 1){
                    $('.guominName').val(res.data.foodAndContactAllergyHis.split('|')[0]);
                }else{
                    var html = '';
                    res.data.foodAndContactAllergyHis.split('|').forEach(function (value,index) {
                        html += '<div class="guominDivOne"> ' +
                            '<input class="guominName" style="width: 75%;" placeholder="请输入过敏源" value="'+value+'" type="text"> ';
                        if(res.data.foodAndContactAllergyHis.split('|').length -1 == index){
                            html += '<img class="addInput" onclick="addGuomin(this)" src="img/addPhoto.png"> '
                        }else{
                            html += '<img class="addInput" onclick="$(this).parent().remove()" src="img/closeInput.png"> '
                        }
                        html +='</div>'
                    });
                    $('.chooseGuominDiv').empty().append(html);
                }
            }
            if(res.data.takeMedicine && res.data.takeMedicine != ''){
                $('.fuyao').removeClass("fuyaoActive").eq(1).addClass("fuyaoActive");
                $('.chooseFuyaoDiv').css('display','inline-block');
                if(res.data.takeMedicine.split('|').length <= 1){
                    $('.fuyaowuName').val(res.data.takeMedicine.split('|')[0]);
                }else{
                    var html = '';
                    res.data.takeMedicine.split('|').forEach(function (value,index) {
                        html += '<div class="fuyaoDivOne"> ' +
                            '<input class="fuyaowuName" style="width: 75%;" placeholder="请输入药品名称" value="'+value+'" type="text"> ';
                        if(res.data.takeMedicine.split('|').length -1 == index){
                            html += '<img class="addInput" onclick="addFuyao(this)" src="img/addPhoto.png"> '
                        }else{
                            html += '<img class="addInput" onclick="$(this).parent().remove()" src="img/closeInput.png"> '
                        }
                        html +='</div>'
                    });
                    $('.chooseFuyaoDiv').empty().append(html);
                }
            }
            if(res.data.vaccinationHis && res.data.vaccinationHis != ''){
                $('.yimiao').removeClass("yimiaoActive").eq(1).addClass("yimiaoActive");
                $('.chooseYimiaoDiv').css('display','inline-block');
                if(res.data.vaccinationHis.split('|').length <= 1){
                    $('.yimiaoName').val(res.data.vaccinationHis.split('|')[0]);
                }else{
                    var html = '';
                    res.data.vaccinationHis.split('|').forEach(function (value,index) {
                        html += '<div class="yimiaoDivOne"> ' +
                            '<input class="yimiaoName" style="width: 75%;" placeholder="请输入接种疫苗" value="'+value+'" type="text"> ';
                        if(res.data.vaccinationHis.split('|').length -1 == index){
                            html += '<img class="addInput" onclick="addYimiao(this)" src="img/addPhoto.png"> '
                        }else{
                            html += '<img class="addInput" onclick="$(this).parent().remove()" src="img/closeInput.png"> '
                        }
                        html +='</div>'
                    });
                    $('.chooseYimiaoDiv').empty().append(html);
                }
            }
        } else {
            if(res.data != '无法获取此用户个人基本信息'){
                alert(res.data);
            }
        }
    },
    huanbingFather:function (valueJuese) {
        $('.fatherDisease').removeClass("fatherDiseaseActive").eq(1).addClass("fatherDiseaseActive");
        $('.choosefatherDiseaseDiv').css('display','inline-block');
        $('.havefatherDisease').each(function (index,value) {
            if(valueJuese.father.split('|').indexOf(value.innerText) != -1){
                $(value).addClass('havefatherDiseaseActive');
            }
        });
        var html = '';
        valueJuese.father.split('|').forEach(function (value,index) {
            if(value == '其他'){
                $('.qitafatherDiseaseDiv').css('display','inline-block');
            }
            if($('.havefatherDisease').text().indexOf(value) == -1){
                html += '<div class="qitafatherDiseaseDivOne"> ' +
                    '<input class="fatherDiseaseName" style="width: 75%;" placeholder="请输入患病名称" value="'+value+'" type="text"> ';
                if(valueJuese.father.split('|').length -1 == index){
                    html += '<img class="addInput" onclick="addQitafatherDisease(this)" src="img/addPhoto.png"> '
                }else{
                    html += '<img class="addInput" onclick="$(this).parent().remove()" src="img/closeInput.png"> '
                }
                html +='</div>'
            }
        });
        if(html != ''){
            $('.qitafatherDiseaseDiv').empty().append(html);
        }
    },
    huanbingMother:function (valueJuese) {
        $('.motherDisease').removeClass("motherDiseaseActive").eq(1).addClass("motherDiseaseActive");
        $('.choosemotherDiseaseDiv').css('display','inline-block');
        $('.havemotherDisease').each(function (index,value) {
            if(valueJuese.mother.split('|').indexOf(value.innerText) != -1){
                $(value).addClass('havemotherDiseaseActive');
            }
        });
        var html = '';
        valueJuese.mother.split('|').forEach(function (value,index) {
            if(value == '其他'){
                $('.qitamotherDiseaseDiv').css('display','inline-block');
            }
            if($('.havemotherDisease').text().indexOf(value) == -1){
                html += '<div class="qitamotherDiseaseDivOne"> ' +
                    '<input class="motherDiseaseName" style="width: 75%;" placeholder="请输入患病名称" value="'+value+'" type="text"> ';
                if(valueJuese.mother.split('|').length -1 == index){
                    html += '<img class="addInput" onclick="addQitamotherDisease(this)" src="img/addPhoto.png"> '
                }else{
                    html += '<img class="addInput" onclick="$(this).parent().remove()" src="img/closeInput.png"> '
                }
                html +='</div>'
            }
        });
        if(html != ''){
            $('.qitamotherDiseaseDiv').empty().append(html);
        }
    },
    huanbingBrosis:function (valueJuese) {
        $('.brosisDisease').removeClass("brosisDiseaseActive").eq(1).addClass("brosisDiseaseActive");
        $('.choosebrosisDiseaseDiv').css('display','inline-block');
        $('.havebrosisDisease').each(function (index,value) {
            if(valueJuese.brosis.split('|').indexOf(value.innerText) != -1){
                $(value).addClass('havebrosisDiseaseActive');
            }
        });
        var html = '';
        valueJuese.brosis.split('|').forEach(function (value,index) {
            if(value == '其他'){
                $('.qitabrosisDiseaseDiv').css('display','inline-block');
            }
            if($('.havebrosisDisease').text().indexOf(value) == -1){
                html += '<div class="qitabrosisDiseaseDivOne"> ' +
                    '<input class="brosisDiseaseName" style="width: 75%;" placeholder="请输入患病名称" value="'+value+'" type="text"> ';
                if(valueJuese.brosis.split('|').length -1 == index){
                    html += '<img class="addInput" onclick="addQitabrosisDisease(this)" src="img/addPhoto.png"> '
                }else{
                    html += '<img class="addInput" onclick="$(this).parent().remove()" src="img/closeInput.png"> '
                }
                html +='</div>'
            }
        });
        if(html != ''){
            $('.qitabrosisDiseaseDiv').empty().append(html);
        }
    },
    huanbingChildren:function (valueJuese) {
        $('.childrenDisease').removeClass("childrenDiseaseActive").eq(1).addClass("childrenDiseaseActive");
        $('.choosechildrenDiseaseDiv').css('display','inline-block');
        $('.havechildrenDisease').each(function (index,value) {
            if(valueJuese.children.split('|').indexOf(value.innerText) != -1){
                $(value).addClass('havechildrenDiseaseActive');
            }
        });
        var html = '';
        valueJuese.children.split('|').forEach(function (value,index) {
            if(value == '其他'){
                $('.qitachildrenDiseaseDiv').css('display','inline-block');
            }
            if($('.havechildrenDisease').text().indexOf(value) == -1){
                html += '<div class="qitachildrenDiseaseDivOne"> ' +
                    '<input class="childrenDiseaseName" style="width: 75%;" placeholder="请输入患病名称" value="'+value+'" type="text"> ';
                if(valueJuese.children.split('|').length -1 == index){
                    html += '<img class="addInput" onclick="addQitachildrenDisease(this)" src="img/addPhoto.png"> '
                }else{
                    html += '<img class="addInput" onclick="$(this).parent().remove()" src="img/closeInput.png"> '
                }
                html +='</div>'
            }
        });
        if(html != ''){
            $('.qitachildrenDiseaseDiv').empty().append(html);
        }
    },
    addUserBasicHealthInfo:function () {
        var url = SERVER_ADDR + '/app/user/edit/userBasicHealthInfo';
        var Data = {};
        Data.height = $('.height').val();
        Data.weight = $('.weight').val();
        Data.waist = $('.waist').val();
        Data.hip = $('.hip').val();
        Data.bloodType = $('.xuexingActive').text();
        if($('.bushiActive').text() == '有'){
            Data.discomfort = $('.bushiInput').val();
        }
        if($('.huanbingActive').text() == '是'){
            var illList = [];
            $('.huanbingName').each(function (index,value) {
                console.log(value.value)
                if(value.value.trim() != ''){
                    illList.push(value.value);
                }
            });
            Data.ill = illList.join("|");
        }
        var familyHealthSituationList = [];
        if($('.fatherDiseaseActive').text() == '有'){ //家庭父亲
            var fatherObj = {};
            var fatherList = [];
            $('.havefatherDiseaseActive').each(function (index,value) {
                fatherList.push(value.innerText);
            });
            $('.fatherDiseaseName').each(function (index,value) {
                if(value.value.trim() != ''){
                    fatherList.push(value.value);
                }
            });
            if(fatherList.join("|") != ''){
                fatherObj.father = fatherList.join("|");
                familyHealthSituationList.push(fatherObj);
            }
        }
        if($('.motherDiseaseActive').text() == '有'){ //家庭母亲
            var motherObj = {};
            var motherList = [];
            $('.havemotherDiseaseActive').each(function (index,value) {
                motherList.push(value.innerText);
            });
            $('.motherDiseaseName').each(function (index,value) {
                if(value.value.trim() != ''){
                    motherList.push(value.value);
                }
            });
            if(motherList.join("|") != ''){
                motherObj.mother = motherList.join("|");
                familyHealthSituationList.push(motherObj);
            }
        }
        if($('.brosisDiseaseActive').text() == '有'){ //家庭母亲
            var brosisObj = {};
            var brosisList = [];
            $('.havebrosisDiseaseActive').each(function (index,value) {
                brosisList.push(value.innerText);
            });
            $('.brosisDiseaseName').each(function (index,value) {
                if(value.value.trim() != ''){
                    brosisList.push(value.value);
                }
            });
            if(brosisList.join("|") != ''){
                brosisObj.brosis = brosisList.join("|");
                familyHealthSituationList.push(brosisObj);
            }
        }
        if($('.childrenDiseaseActive').text() == '有'){ //家庭母亲
            var childrenObj = {};
            var childrenList = [];
            $('.havechildrenDiseaseActive').each(function (index,value) {
                childrenList.push(value.innerText);
            });
            $('.childrenDiseaseName').each(function (index,value) {
                if(value.value.trim() != ''){
                    childrenList.push(value.value);
                }
            });
            if(childrenList.join("|") != ''){
                childrenObj.children = childrenList.join("|");
                familyHealthSituationList.push(childrenObj);
            }
        }
        Data.familyHealthSituation = JSON.stringify(familyHealthSituationList);
        if($('.historyActive').text() == '是'){
            var pastHisList = [];
            $('.historyName').each(function (index,value) {
                console.log(value.value)
                if(value.value.trim() != ''){
                    pastHisList.push(value.value);
                }
            });
            Data.pastHis = pastHisList.join("|");
        }
        if($('.yaowuGuominActive').text() == '有'){ //药物过敏
            var drugAllergyHisList = [];
            $('.haveYaowuGmActive').each(function (index,value) {
                console.log(value.innerText)
                drugAllergyHisList.push(value.innerText);
            });
            $('.qitaYaowuGm').each(function (index,value) {
                console.log(value.value)
                if(value.value.trim() != ''){
                    drugAllergyHisList.push(value.value);
                }
            });
            Data.drugAllergyHis = drugAllergyHisList.join("|");
        }
        if($('.guominActive').text() == '有'){
            var foodAndContactAllergyHisList = [];
            $('.guominName').each(function (index,value) {
                console.log(value.value)
                if(value.value.trim() != ''){
                    foodAndContactAllergyHisList.push(value.value);
                }
            });
            Data.foodAndContactAllergyHis = foodAndContactAllergyHisList.join("|");
        }
        if($('.fuyaoActive').text() == '是'){
            var takeMedicineList = [];
            $('.fuyaowuName').each(function (index,value) {
                console.log(value.value)
                if(value.value.trim() != ''){
                    takeMedicineList.push(value.value);
                }
            });
            Data.takeMedicine = takeMedicineList.join("|");
        }
        if($('.yimiaoActive').text() == '有'){
            var vaccinationHisList = [];
            $('.yimiaoName').each(function (index,value) {
                console.log(value.value)
                if(value.value.trim() != ''){
                    vaccinationHisList.push(value.value);
                }
            });
            Data.vaccinationHis = vaccinationHisList.join("|");
        }
        ajaxGetRetInfo(url, Data, this.addUserBasicHealthInfoSuccess, '请求失败', 'POST', true, undefined);
    },
    addUserBasicHealthInfoSuccess: function (res) {
        if (res.success == true) {
            alert('提交成功');
            window.location.reload();
        } else {
            alert(res.data);
        }
    }
}