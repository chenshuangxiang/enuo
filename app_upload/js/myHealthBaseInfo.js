var nameEl = document.getElementById('sel_city');
var first = []; /* 省，直辖市 */
var second = []; /* 市 */
var third = []; /* 镇 */
var firstName = ''; /* 省，直辖市 */
var secondName = ''; /* 市 */
var thirdName = ''; /* 镇 */
var chooseList = [];
var selectedIndex = [0,0,0]; /* 默认选中的地区 */
var checked = [0, 0, 0]; /* 已选选项 */
function init() {
    var nation = ['请选择','汉族','壮族','满族','回族','苗族','维吾尔族', '土家族','彝族','蒙古族','藏族','布依族','侗族',
        '瑶族','朝鲜族','白族','哈尼族','哈萨克族','黎族', '傣族', '畲族','傈僳族','仡佬族','东乡族','高山族',
        '拉祜族','水族','佤族','纳西族','羌族','土族', '仫佬族','锡伯族','柯尔克孜族','达斡尔族','景颇族','毛南族',
        '撒拉族','塔吉克族','阿昌族','普米族','鄂温克族','怒族', '京族','基诺族','德昂族','保安族','俄罗斯族','裕固族',
        '乌兹别克族','门巴族','鄂伦春族','独龙族','塔塔尔族','赫哲族', '珞巴族','布朗族'];
    nation.forEach(function (value) {
        $('.nation').append('<option value="'+value+'">'+value+'</option>');
    });
    $('.yibaoPay').click(function () {
        if($(this).hasClass('yibaoPayActive') == true){
            $(this).removeClass('yibaoPayActive');
        }else{
            $(this).addClass('yibaoPayActive');
        }
    });
    Go.toInfo();
}
var Go = {
    userPersonalInfo:function () {
        var url = SERVER_ADDR + '/app/user/userPersonalInformation';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.userPersonalInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    userPersonalInfoSuccess: function (res) {
        if (res.success == true) {
            $('.familyAddress').val(res.data.familyAddress);
            $('.nation').val(res.data.nationality);
            $('.xueli').val(res.data.education);
            $('.job').val(res.data.job || "请选择");
            if(res.data.maritalStatus == 0){
                $('.sex[value="man"]').prop('checked',true);
            }else if(res.data.maritalStatus == 1){
                $('.sex[value="woman"]').prop('checked',true);
            }
            if(res.data.idCard){
                $('.idCard').val(res.data.idCard);
            }
            if(res.data.medicalExpensesPaymentMethod && res.data.medicalExpensesPaymentMethod != ''){

            }
            $('.yibaoPay').each(function (index,value) {
                if(res.data.medicalExpensesPaymentMethod.split('|').indexOf(value.innerText) != -1){
                    $(value).addClass('yibaoPayActive');
                }
            });
        }
         else {
            if(res.data != '无法获取此用户个人基本信息'){
                alert(res.data);
            }
        }
    },
    addUserPersonalInfo:function () {
        var url = SERVER_ADDR + '/app/user/edit/userPersonalInformation';
        var Data = {};
        Data.familyAddress = $('.familyAddress').val();
        Data.idCard = $('.idCard').val();
        Data.nationality = $('.nation').val();
        Data.education = $('.xueli').val();
        Data.maritalStatus = $('.nan').is(':checked') ? 0 : 1;
        var medicalExpensesPaymentMethodList = [];
        $('.yibaoPayActive').each(function (index,value) {
            medicalExpensesPaymentMethodList.push(value.innerText);
        });
        Data.medicalExpensesPaymentMethod = medicalExpensesPaymentMethodList.join("|");
        Data.provinceCode = chooseList[0];
        Data.provinceName = firstName;
        Data.cityCode = chooseList[1];
        Data.cityName = secondName;
        Data.areaCode = chooseList[2];
        Data.areaName = thirdName;
        ajaxGetRetInfo(url, Data, this.addUserPersonalInfoSuccess, '请求失败', 'POST', true, undefined);
    },
    addUserPersonalInfoSuccess: function (res) {
        if (res.success == true) {
            alert('提交成功');
            window.location.reload();
        } else {
            alert(res.data);
        }
    },
    toInfo:function () {
        var url = SERVER_ADDR + '/app/user/myInfo';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.infoSuccess, '请求失败', 'GET', true, undefined);
    },
    infoSuccess: function (res) {
        if (res.success == true) {
            $('.mobile').val(res.data.mobile).attr('disabled',true);
            $('.idCard').val(res.data.idCard);
            $('.picker').remove();
            if(res.data.provinceCode){
                Go.initCity(res.data.provinceCode,res.data.cityCode,res.data.areaCode);
                chooseList[0] = res.data.provinceCode;
                firstName = res.data.provinceName;
                chooseList[1] = res.data.cityCode;
                secondName = res.data.cityName;
                chooseList[2] = res.data.areaCode;
                thirdName = res.data.areaName;
                selectedIndex[0] = res.data.provinceCode;
                selectedIndex[1] = res.data.cityCode;
                selectedIndex[2] = res.data.areaCode;
                $('#sel_city').val(res.data.provinceName + ' ' + res.data.cityName + ' ' + res.data.areaName);
            }else{
                Go.initCity(0,0,0);
            }

            Go.userPersonalInfo();
        } else {
            alert(res.data);
        }
    },
    initCity:function (provinceCan,cityCan,areaCan) {
        nameEl = document.getElementById('sel_city');
        first = []; /* 省，直辖市 */
        second = []; /* 市 */
        third = []; /* 镇 */
        firstName = ''; /* 省，直辖市 */
        secondName = ''; /* 市 */
        thirdName = ''; /* 镇 */
        chooseList = [];
        selectedIndex = [provinceCan,cityCan,areaCan]; /* 默认选中的地区 */
        checked = [0, 0, 0]; /* 已选选项 */
        function creatList(obj, list){
            obj.forEach(function(item, index, arr){
                var temp = new Object();
                temp.text = item.name;
                temp.value = index;
                list.push(temp);
            })
        }
        creatList(city, first);
        if (city[selectedIndex[0]].hasOwnProperty('sub')) {
            creatList(city[selectedIndex[0]].sub, second);
        } else {
            second = [{text: '', value: 0}];
        }
        if (city[selectedIndex[0]].sub[selectedIndex[1]].hasOwnProperty('sub')) {
            creatList(city[selectedIndex[0]].sub[selectedIndex[1]].sub, third);
        } else {
            third = [{text: '', value: 0}];
        }
        var picker = new Picker({
            data: [first, second, third],
            selectedIndex: selectedIndex,
            title: ''//地址选择
        });
        picker.on('picker.select', function (selectedVal, selectedIndex) {
            var text1 = first[selectedIndex[0]].text;
            var text2 = second[selectedIndex[1]].text;
            var text3 = third[selectedIndex[2]] ? third[selectedIndex[2]].text : '';
            nameEl.value = text1 + ' ' + text2 + ' ' + text3;
            firstName = text1; /* 省，直辖市 */
            secondName = text2; /* 市 */
            thirdName = text3; /* 镇 */
        });

        picker.on('picker.change', function (index, selectedIndex) {
            if (index === 0){
                firstChange();
            } else if (index === 1) {
                secondChange();
            }

            function firstChange() {
                second = [];
                third = [];
                checked[0] = selectedIndex;
                var firstCity = city[selectedIndex];
                if (firstCity.hasOwnProperty('sub')) {
                    creatList(firstCity.sub, second);

                    var secondCity = city[selectedIndex].sub[0]
                    if (secondCity.hasOwnProperty('sub')) {
                        creatList(secondCity.sub, third);
                    } else {
                        third = [{text: '', value: 0}];
                        checked[2] = 0;
                    }
                } else {
                    second = [{text: '', value: 0}];
                    third = [{text: '', value: 0}];
                    checked[1] = 0;
                    checked[2] = 0;
                }

                picker.refillColumn(1, second);
                picker.refillColumn(2, third);
                picker.scrollColumn(1, 0)
                picker.scrollColumn(2, 0)
            }

            function secondChange() {
                third = [];
                checked[1] = selectedIndex;
                var first_index = checked[0];
                if (city[first_index].sub[selectedIndex].hasOwnProperty('sub')) {
                    var secondCity = city[first_index].sub[selectedIndex];
                    creatList(secondCity.sub, third);
                    picker.refillColumn(2, third);
                    picker.scrollColumn(2, 0)
                } else {
                    third = [{text: '', value: 0}];
                    checked[2] = 0;
                    picker.refillColumn(2, third);
                    picker.scrollColumn(2, 0)
                }
            }

        });
        picker.on('picker.valuechange', function (selectedVal, selectedIndex) {
            console.log(selectedVal); //数组值
            console.log(selectedIndex);
            chooseList = selectedVal;
        });

        nameEl.addEventListener('click', function () {
            picker.show();
        });
    }
}