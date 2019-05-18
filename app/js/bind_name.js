function init() {
    var calendar = new datePicker();
    calendar.init({
        'trigger': '#bornDate', /*按钮选择器，用于触发弹出插件*/
        'type': 'date',/*模式：date日期；datetime日期时间；time时间；ym年月；*/
        'minDate':'1900-1-1',/*最小日期*/
        'maxDate':'2100-12-31',/*最大日期*/
        'onSubmit':function(){/*确认时触发事件*/
            var theSelectData=calendar.value;
        },
        'onClose':function(){/*取消时触发事件*/
        }
    });
    Go.toInfo();
    //Go.initCity(0,0,0);
}
//完善信息ajax
var Go = {
    bind:function(){
        if($(".userName").val().trim() == ''){
            alert('请输入姓名');
            return;
        }
        if($(".userName").val().trim().length < 2){
            alert('姓名不能少于两个汉字');
            return;
        }
        var url = SERVER_ADDR + '/app/user/updateMyInfo';
        var Data = {};
        Data.fullname = $(".userName").val().trim();
        Data.sex = $('.nan').is(':checked') ? 'man' : 'woman';
        Data.birthday = $('#bornDate').val();
        Data.provinceCode = chooseList[0];
        Data.provinceName = firstName;
        Data.cityCode = chooseList[1];
        Data.cityName = secondName;
        Data.areaCode = chooseList[2];
        Data.areaName = thirdName;
        ajaxGetRetInfo(url, Data, this.bindSuccess, '请求失败', 'POST', true, undefined);
    },
    bindSuccess:function (retInfo) {
        /*retInfo = JSON.parse(retInfo);*/
        if(retInfo.success == true){
            console.log(retInfo)
            alert('完善成功')
            Go.href();
        }else{
            alert(retInfo.data)
        }
    },
    href:function () {
        if(window.location.href.indexOf('returnUrl') != -1){  //有returnUrl的则会跳
            window.location.href = window.location.href.split('returnUrl=')[1];
        }else{
            //完善成功跳转
            console.log('完善成功跳转');
            window.location.href = 'xywz.html';
        }
    },
        certification:function(){ //实名认证
            if($('.userRealName').val().trim().length <= 1){
                alert('请输入真实姓名');
                return;
            }
            if($('.idcard').val().trim().length != 18){
                alert('请输入正确的身份证号');
                return;
            }
            var url = SERVER_ADDR + '/app/user/go/identify/certification';
            var Data = {};
            Data.fullname = $('.userRealName').val().trim();
            Data.idCard = $('.idcard').val().trim();
            ajaxGetRetInfo(url, Data, this.certificationSuccess, '请求失败', 'POST', true, undefined);
        },
        certificationSuccess:function (retInfo) {
            console.log(retInfo)
            if(retInfo.success == true){
                alert('实名认证成功');
                $('.modelOpen').hide();
                $('.renzhen').attr('src','img/user_center/alreadyRealName.png').attr('onclick','');
            }else{
                alert(retInfo.data);
            }
        },
    toInfo:function () {
        var url = SERVER_ADDR + '/app/user/myInfo';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.infoSuccess, '请求失败', 'GET', true, undefined);
    },
    infoSuccess: function (res) {
        if (res.success == true) {
            if(res.data.actualNameCertification == false){
                $('.renzhen').attr('src','img/user_center/noRealName.png');
            }else if(res.data.actualNameCertification == true){
                $('.renzhen').attr('src','img/user_center/alreadyRealName.png').attr('onclick','');
            }
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
            $('.userName').val(res.data.fullname)
            if(res.data.birthday){
                $('#bornDate').val(new Date(res.data.birthday).Format('yyyy-MM-dd'))
            }

            //$('.docImg').attr('src',res.data.headImgUrl);
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
