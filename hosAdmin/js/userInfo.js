
var layer;
layui.use(['form','layer','jquery','element'],function(){
    var form = layui.form,
        element = layui.element;
    layer = parent.layer === undefined ? layui.layer : parent.layer,
        $ = layui.jquery;
    /*element.on('collapse(fadeIn)', function(data){
        layer.msg('展开状态:'+ data.show);
    });*/
    //加载页面数据
    Get.userNewInfo();

    //添加回访
    $("body").on("click",".news_record_add",function(){
        //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
        var index = layui.layer.open({
            area: ['500px','500px'],
            title : "患者回访信息添加",
            type : 2,
            content : "recordAdd.html?id=" +getQueryString('dataid') + '&advisoryid='+ getQueryString('id') + '&v=1134',
            success : function(layero, index){
                //localStorage.setItem('allconsultPage',$('.layui-laypage-curr em').eq(1).text());
            }
        })

    });
})

var Get = {
    userNewInfo: function () {
        var url = SERVER_ADDR + '/hospital/user/getUserEssentialInfo';
        var Data = {};
        Data.mobile = getQueryString('mobile');
        ajaxGetRetInfo(url, Data, this.userNewInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    userNewInfoSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
            if(retInfo.data.userInfo){
                var retInfoUser = retInfo.data.userInfo[0];
                if(retInfo.data.family){
                    var retInfoFamily = retInfo.data.family;
                }else{
                    var retInfoFamily =[];
                }
               Get.addUserInfoData(retInfoUser,retInfoFamily,retInfoUser.fullname)
            }else{
                Get.patientInfo()
            }
        } else {
            alert(retInfo.data);
        }
    },
    patientInfo: function () {
        var url = SERVER_ADDR + '/hospital/user/getPatientByMobile.json';
        var Data = {};
        Data.mobile = getQueryString('mobile');
        ajaxGetRetInfo(url, Data, this.patientInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    patientInfoSuccess: function (retInfo) {
        console.log(retInfo)
        if (retInfo.success == true) {
                var retInfoUser = retInfo.data;
                if(retInfo.data.family){
                    var retInfoFamily = retInfo.data.family;
                }else{
                    var retInfoFamily =[];
                }
            Get.addUserInfoData(retInfoUser,retInfoFamily,retInfoUser.name)
            }
        else {
            alert(retInfo.data);
        }
    },
    addUserInfoData:function (retInfoUser,retInfoFamily,name) {
        //返回填充
        $('.userName').text(name);
        if(retInfoUser.sex == 'man'){
            retInfoUser.sex = '男';
        }else if(retInfoUser.sex == 'woman'){
            retInfoUser.sex = '女';
        }else if(retInfoUser.sex == 'unknown' || !retInfoUser.sex){
            retInfoUser.sex = '不详';
        }
        if(!retInfoUser.job){
            retInfoUser.job = '';
        }
        if(!retInfoUser.address){
            retInfoUser.address = '';
        }
        if(retInfoUser.idCard && retInfoUser.idCard.length == 18){
            retInfoUser.age = new Date().getYear()+1900 - retInfoUser.idCard.substring(6,10);
        }
        //$('.userBaseInfo').html('姓名:'+retInfo.data.name + '' + ' &nbsp;&nbsp;&nbsp;&nbsp;手机号:' + getQueryString('mobile') + ' &nbsp;&nbsp;&nbsp;&nbsp;年龄:' + retInfo.data.age + ' &nbsp;&nbsp;&nbsp;&nbsp;性别:' + retInfo.data.sex + ' &nbsp;&nbsp;&nbsp;&nbsp;职业:' + retInfo.data.job + ' &nbsp;&nbsp;&nbsp;&nbsp;地址:' + retInfo.data.address + '<!--<span class="resetInfo">修改</span>-->');
        $(".userMobile").text(getQueryString('mobile'));
        $(".userSex").text(retInfoUser.sex);
        $(".userAge").text(retInfoUser.age);
        $(".userAddress").text(retInfoUser.address);
        $('.headImgUrl').attr('src',retInfoUser.headImgUrl);
        var dataHtml = '';
        dataHtml += '<tr><td width="50%">姓名：'+name+'</td><td>性别：'+retInfoUser.sex+'</td></tr>';
        dataHtml += '<tr><td width="50%">身份证号：'+noDataKong(retInfoUser.idCard)+'</td><td>年龄：'+noDataKong(retInfoUser.age)+'</td></tr>';
        dataHtml += '<tr><td width="50%">手机号：'+retInfoUser.mobile+'</td><td>护理卡号：'+noDataKong(retInfoUser.nursingCardNumber)+'</td></tr>';
        dataHtml += '<tr><td width="50%">职业：'+noDataKong(retInfoUser.job)+'</td><td>地址：'+noDataKong(retInfoUser.address)+'</td></tr>';
        $(".news_content").html(dataHtml);

        if(retInfoFamily.length > 0){
            var dataFamilyHtml = '';
            for(var i = 0; i< retInfoFamily.length; i++){
                if(i % 2 == 0){
                    dataFamilyHtml += '<tr>' ;
                    dataFamilyHtml += '<td width="50%">'+retInfoFamily[i].appellation + '：<span style="" valuemobile="'+retInfoFamily[i].mobile+'">'+retInfoFamily[i].fullName+'</span></td>' ;

                }else if(i % 2 == 1){
                    dataFamilyHtml += '<td width="50%">'+retInfoFamily[i].appellation + '：<span style="" valuemobile="'+retInfoFamily[i].mobile+'">'+retInfoFamily[i].fullName+'</span></td>' ;
                    dataFamilyHtml += '</tr>';
                }
            }
            $(".news_content_family").html(dataFamilyHtml);
        }else{
            $(".news_content_family").html('<tr><td style="text-align: center">暂无数据</td></tr>');
        }
    },
    adviosyInfo:function () {
        var url = SERVER_ADDR + "/hospital/user/getUserAdvisoryInfo";
        var data = {};
        data.mobile = getQueryString('mobile');
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                $('.userAdviosyInfo').attr('onclick','');
               $('.userAdviosyInfoData').html(Get.setAdviosyDate(retInfo.data));
            }else{
                layer.alert(retInfo.data,{icon:5});
            }
        },'请求失败', 'GET', undefined, undefined);
    },
    setAdviosyDate:function (data) {
        console.log(data)
        var dataHtml = '';
        if(data && data.length != 0){
            for(var i=0;i<data.length;i++){
                dataHtml += '<tr>'
                    +'<td>'+ new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss") +'</td>'
                    +'<td>'+data[i].allotHospitalName+'</td>'
                    +'<td>'+data[i].disease+'</td>'
                    +'<td>'+data[i].storeName+'</td>'
                    +'<td title="'+data[i].brief+'">'+noData(returnSubstring(data[i].brief))+'</td>'
                    +'<td>'+data[i].salesmanName+'</td>'
                    +'<td>'+returnAllotStatus(data[i].status)+'</td>';
                if(data[i].count > 0){
                    dataHtml += '<td style="color: #00a2d4;cursor: pointer;" valueid="'+data[i].id+'" onclick="advisoryOneAccess(this)">已回访/'+data[i].count+'次</td>';
                }else if(data[i].count == 0){
                    dataHtml += '<td style="color: red">未回访</td>';
                }else{
                    dataHtml += '<td></td>';
                }
                if(data[i].nextAccessDate){
                    dataHtml += '<td>'+new Date(data[i].nextAccessDate).Format('yyyy-MM-dd')+'</td>';
                }else{
                    dataHtml += '<td></td>';
                }
                dataHtml += '</tr>';
            }
        }else{
            dataHtml = '<tr><td colspan="9">暂无数据</td></tr>';
        }
        return dataHtml;
    },
    reservationInfo: function () {
        var url = SERVER_ADDR + "/hospital/user/getUserReservationInfo";
        var data = {};
        data.mobile = getQueryString('mobile');
        ajaxGetRetInfo(url, data, function (retInfo) {
            console.log(retInfo)
            if (retInfo.success) {
                $('.userReservationInfo').attr('onclick', '');
                $('.userReservationInfoCouponData').html(Get.setReservationCouponDate(retInfo.data.coupon));
                $('.userReservationInfoProjectData').html(Get.setReservationProjectDate(retInfo.data.product));
                $('.userReservationInfoNursingCardData').html(Get.setReservationNursingCardDate(retInfo.data.nursingCard));
                $('.userReservationInfoDoctorData').html(Get.setReservationDoctorDate(retInfo.data.doctor));
            } else {
                layer.alert(retInfo.data, {icon: 5});
            }
        }, '请求失败', 'GET', undefined, undefined);
    },
    setReservationCouponDate: function (data) {
        console.log(data)
        var dataHtml = '';
        if (data && data.length != 0) {
            for (var i = 0; i < data.length; i++) {
                dataHtml += '<tr>'
                    + '<td>' + data[i].name + '</td>'
                    + '<td>' + data[i].source + '</td>'
                    + '<td>体验券</td>'
                    + '<td>' + data[i].reservationDate + '</td>'
                    + '<td>' + noData(data[i].hospitalName) + '</td>'
                    + '<td>' + returnReservationStatus(data[i].status) + '</td>'
                dataHtml += '</tr>';
            }
        } else {
            dataHtml = '<tr><td colspan="6">暂无数据</td></tr>';
        }
        return dataHtml;
    },
    setReservationProjectDate: function (data) {
        console.log(data)
        var dataHtml = '';
        if (data && data.length != 0) {
            for (var i = 0; i < data.length; i++) {
                dataHtml += '<tr>'
                    + '<td>' + data[i].name + '</td>'
                    + '<td>' + data[i].source + '</td>'
                    + '<td>' + staticFunc.rtProductCategoryType(data[i].productCategoryType) + '</td>'
                    + '<td>' + noData(data[i].productCategoryName) + '</td>'
                    + '<td>' + data[i].reservationDate + '</td>'
                    + '<td>' + noData(data[i].hospitalName) + '</td>'
                    + '<td>' + returnReservationStatus(data[i].status) + '</td>'
                dataHtml += '</tr>';
            }
        } else {
            dataHtml = '<tr><td colspan="7">暂无数据</td></tr>';
        }
        return dataHtml;
    },
    setReservationNursingCardDate: function (data) {
        console.log(data)
        var dataHtml = '';
        if (data && data.length != 0) {
            for (var i = 0; i < data.length; i++) {
                dataHtml += '<tr>'
                    + '<td>' + data[i].name + '</td>'
                    + '<td>e诺平台</td>'
                    + '<td>医疗类</td>'
                    + '<td>口腔科</td>'
                    + '<td>' + data[i].reservationDate + '</td>'
                    + '<td>'+data[i].hospitalName+'</td>'
                    + '<td>' + returnReservationStatus(data[i].status) + '</td>'
                dataHtml += '</tr>';
            }
        } else {
            dataHtml = '<tr><td colspan="7">暂无数据</td></tr>';
        }
        return dataHtml;
    },
    setReservationDoctorDate: function (data) {
        console.log(data)
        var dataHtml = '';
        if (data && data.length != 0) {
            for (var i = 0; i < data.length; i++) {
                dataHtml += '<tr>'
                    + '<td>' + data[i].name + '</td>'
                    + '<td>' + data[i].subjectName + '</td>'
                    + '<td>' + data[i].doctorTypeName + '</td>'
                    + '<td>' + data[i].reservationDate + '</td>'
                    + '<td>' + noData(data[i].hospitalName) + '</td>'
                    + '<td>' + returnReservationStatus(data[i].status) + '</td>'
                dataHtml += '</tr>';
            }
        } else {
            dataHtml = '<tr><td colspan="6">暂无数据</td></tr>';
        }
        return dataHtml;
    },
    visitRecordInfo: function () {
        var url = SERVER_ADDR + "/hospital/user/getUserVisitRecordInfo";
        var data = {};
        data.mobile = getQueryString('mobile');
        ajaxGetRetInfo(url, data, function (retInfo) {
            console.log(retInfo)
            if (retInfo.success) {
                $('.userVisitRocordInfo').attr('onclick', '');
                $('.userVisitRocordData').html(Get.setVisitRocordDate(retInfo.data));

            } else {
                layer.alert(retInfo.data, {icon: 5});
            }
        }, '请求失败', 'GET', undefined, undefined);
    },
    setVisitRocordDate: function (data) {
        console.log(data)
        var dataHtml = '';
        if (data && data.length != 0) {
            for (var i = 0; i < data.length; i++) {
                dataHtml += '<tr>'
                    + '<td>' + new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss") + '</td>'
                if(!data[i].type){
                    dataHtml += '<td>无</td>'
                }else{
                    dataHtml += '<td>'+returnProjectType(data[i].type)+'</td>'
                }
                dataHtml += '<td>' + noData(data[i].name) + '</td>'
                    + '<td>' + noData(data[i].diseases) + '</td>'
                    + '<td>' + returnVisitRecordNumber(data[i].returnVisitRecordNumber) + '</td>'
                    + '<td>' + returnProjectVisitRecordStatus(data[i].status) + '</td>'
                    if(data[i].userOffLineProjectId){
                        dataHtml += '<td style="color: #2299ee;cursor: pointer;" valueuserofflineproject="'+data[i].userOffLineProjectId+'" onclick="allOrderDetail(this)">查看清单</td>'
                    }else{
                        dataHtml += '<td>暂未开单</td>'
                    }
                dataHtml += '<td>' + noData(data[i].brief) + '</td>'
                    + '<td>' + noData(data[i].source) + '</td>'
                    + '<td>' + noData(data[i].hospital) + '</td>'
                    + '<td>' + noData(data[i].doctor) + '</td>'
                    + '<td>' + noData(data[i].doctorHelpmate) + '</td>'
                    + '<td>' + noData(data[i].price) + '</td>'
                    + '<td>' + noData(data[i].nurse) + '</td>'
                    + '<td>' + noData(data[i].guestService) + '</td>'
                    + '<td>' + noData(data[i].reception) + '</td>'
                    + '<td>' + returnVisitRecordRepeat(data[i].repeat) + '</td>'
                    if(data[i].diseasesIs == true){
                        dataHtml += '<td style="color: #2299ee;cursor: pointer;" valuevisitrecord="'+data[i].visitRecordId+'" onclick="diagnoseOpen(this)">查看</td>'
                    }else{
                        dataHtml += '<td>无</td>'
                    }
                dataHtml += '</tr>';
            }
        } else {
            dataHtml = '<tr><td colspan="17">暂无数据</td></tr>';
        }
        return dataHtml;
    },
    accessInfo: function (type) {
        var type = type;
        var url = SERVER_ADDR + "/hospital/user/getUserAccessInfo";
        var data = {};
        data.mobile = getQueryString('mobile');
        data.type = type;
        ajaxGetRetInfo(url, data, function (retInfo) {
            console.log(retInfo)
            if (retInfo.success) {
                if(type == 'platform'){
                    $('.platformAccess').attr('onclick', '');
                    $('.userAccessPlatfromInfoData').empty().append(Get.setAccessInfoDate(retInfo.data,'platform'));
                }else if(type == 'hospital'){
                    $('.hospitalAccess').attr('onclick', '');
                    $('.userAccessHospitalInfoData').append(Get.setAccessInfoDate(retInfo.data,'hospital'));
                }else{
                    $('.userAccessInfo').attr('onclick', '');
                    $('.userAccessInfoData').empty().append(Get.setAccessInfoDate(retInfo.data));
                }
            } else {
                layer.alert(retInfo.data, {icon: 5});
            }
        }, '请求失败', 'GET', undefined, undefined);
    },
    setAccessInfoDate: function (data,type) {
        console.log(data)
        var dataHtml = '';
        if (data && data.length != 0) {
            for (var i = 0; i < data.length; i++) {
                dataHtml += '<tr>'
                    +'<td>'+ new Date(data[i].accessDate).Format("yyyy-MM-dd hh:mm:ss") +'</td>'
                    +'<td>'+data[i].salesmanName+'</td>';
                    if(type == 'platform'){
                        dataHtml += '<td>'+recordStatusPlatform(data[i].platformStatus)+'</td>'
                    }else if(type == 'hospital'){
                        dataHtml += '<td>'+recordStatusHospital(data[i].hospitalStatus)+'</td>'
                    }else{
                        dataHtml += '<td>'+recordStatusHospital(data[i].hospitalStatus)+'</td>'
                        dataHtml += '<td>'+recordStatusPlatform(data[i].platformStatus)+'</td>'
                    }
                if(data[i].nextAccessDate){
                    if(new Date().Format('yyyy-MM-dd') == new Date(data[i].nextAccessDate).Format("yyyy-MM-dd")){
                        dataHtml += '<td>今日</td>'
                    }else{
                        dataHtml += '<td>'+new Date(data[i].nextAccessDate).Format("yyyy-MM-dd")+'</td>'
                    }
                }else{
                    dataHtml +='<td></td>'
                }
                dataHtml +='<td>'+data[i].brief+'</td>'
                    +'<td  style="color: #2299ee;cursor: pointer;" onclick="adviosyOne(this)" valueid="'+data[i].advisoryId+'">'+data[i].disease+'</td>'
                    +'<td>'+ new Date(data[i].advisoryDate).Format("yyyy-MM-dd hh:mm:ss")+'</td>';
                dataHtml += '</tr>';
            }
        }/* else {
            dataHtml = '<tr><td colspan="7">暂无数据</td></tr>';
        }*/
        return dataHtml;
    },
    accessHosInfo: function () {
        var url = SERVER_ADDR + "/hospital/user/getHospitalUserAccessInfo";
        var data = {};
        data.mobile = getQueryString('mobile');
        ajaxGetRetInfo(url, data, function (retInfo) {
            console.log(retInfo)
            if (retInfo.success) {
                $('.userAccessInfo').attr('onclick', '');
                $('.userAccessInfoData').append(Get.setAccessHosInfoDate(retInfo.data));
                $('.userAccessHospitalInfoData').append(Get.setAccessHosInfoOnlyHosDate(retInfo.data));
            } else {
                layer.alert(retInfo.data, {icon: 5});
            }
        }, '请求失败', 'GET', undefined, undefined);
    },
    setAccessHosInfoDate: function (data) {
        console.log(data)
        var dataHtml = '';
        if (data && data.length != 0) {
            for (var i = 0; i < data.length; i++) {
                dataHtml += '<tr style="background-color: #f3f3f3">'
                    +'<td>'+ new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss") +'</td>'
                    +'<td>'+data[i].operator+'</td>';
                dataHtml += '<td>'+recordStatusHospital(data[i].status)+'</td>'
                dataHtml += '<td></td>'
                if(data[i].nextAccessDate){
                    if(new Date().Format('yyyy-MM-dd') == new Date(data[i].nextAccessDate).Format("yyyy-MM-dd")){
                        dataHtml += '<td>今日</td>'
                    }else{
                        dataHtml += '<td>'+new Date(data[i].nextAccessDate).Format("yyyy-MM-dd")+'</td>'
                    }
                }else{
                    dataHtml +='<td></td>'
                }
                dataHtml +='<td>'+data[i].content+'</td>'
                    +'<td></td>'
                    +'<td></td>';
                dataHtml += '</tr>';
            }
        }/* else {
            dataHtml = '<tr><td colspan="7">暂无数据</td></tr>';
        }*/
        return dataHtml;
    },
    setAccessHosInfoOnlyHosDate: function (data) {
        console.log(data)
        var dataHtml = '';
        if (data && data.length != 0) {
            for (var i = 0; i < data.length; i++) {
                dataHtml += '<tr style="background-color: #f3f3f3">'
                    +'<td>'+ new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss") +'</td>'
                    +'<td>'+data[i].operator+'</td>';
                dataHtml += '<td>'+recordStatusHospital(data[i].status)+'</td>'
                if(data[i].nextAccessDate){
                    if(new Date().Format('yyyy-MM-dd') == new Date(data[i].nextAccessDate).Format("yyyy-MM-dd")){
                        dataHtml += '<td>今日</td>'
                    }else{
                        dataHtml += '<td>'+new Date(data[i].nextAccessDate).Format("yyyy-MM-dd")+'</td>'
                    }
                }else{
                    dataHtml +='<td></td>'
                }
                dataHtml +='<td>'+data[i].content+'</td>'
                    +'<td></td>'
                    +'<td></td>';
                dataHtml += '</tr>';
            }
        }/* else {
            dataHtml = '<tr><td colspan="7">暂无数据</td></tr>';
        }*/
        return dataHtml;
    },
    orderInfo: function () {
        var url = SERVER_ADDR + "/hospital/user/getUserOrderInfo";
        var data = {};
        data.mobile = getQueryString('mobile');
        ajaxGetRetInfo(url, data, function (retInfo) {
            console.log(retInfo)
            if (retInfo.success) {
                $('.userOrderInfo').attr('onclick', '');
                $('.userOrderPlatformData').html(Get.setOrderInfoPlatformDate(retInfo.data.ja));
                $('.userOrderHospitalData').html(Get.setOrderInfoHospitalDate(retInfo.data.hospital));
            } else {
                layer.alert(retInfo.data, {icon: 5});
            }
        }, '请求失败', 'GET', undefined, undefined);
    },
    setOrderInfoPlatformDate: function (data) {
        console.log(data)
        var dataHtml = '';
        if (data && data.length != 0) {
            for (var i = 0; i < data.length; i++) {
                dataHtml += '<tr>'
                    + '<td style="word-break: break-all;word-wrap: break-word">' + data[i].sn+ '</td>'
                    + '<td>' + new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss")+ '</td>'
                    + '<td>' + noData(data[i].name) + '</td>'
                    if(data[i].orderStatus == 'waitConfirm' && data[i].paidAmount == 0 && data[i].name == 'VIP家庭口腔护理卡'){
                        dataHtml += '<td>医院添加</td>';
                    }else{
                        dataHtml += '<td>' + returnOrderType(data[i].type) + '</td>';
                    }
                dataHtml += '<td>' + staticFunc.rtProductCategoryType(data[i].productCategoryType) + '</td>'
                    + '<td>' + noData(data[i].productCategoryName) + '</td>'
                    if(data[i].isDrainage == true ||data[i].type == 'PRIZE' || data[i].type == 'CITIC_BANK_ACTIVATION_CODE'){
                        dataHtml += '<td>' + '0.00' + '/' + '0.00' + '</td>'
                    }else{
                        dataHtml += '<td>' + data[i].paidAmount + '/' + data[i].amount + '</td>'
                    }
                dataHtml += '<td>' + returnProjectOrderStatus(data[i].orderStatus,data[i].isReservation) + '</td>'
                dataHtml += '</tr>';
              /*  if(data[i].isReservation == true){
                    dataHtml += '<td>已预约(已支付)</td>';
                }else if(data[i].isReservation == false){
                    dataHtml += '<td>未预约(已支付)</td>';
                }else{
                    dataHtml += '<td>'+returnProjectOrderStatus(data[i].status)+'</td>';
                }*/
            }
        } else {
            dataHtml = '<tr><td colspan="17">暂无数据</td></tr>';
        }
        return dataHtml;
    },
    setOrderInfoHospitalDate: function (data) {
        console.log(data)
        var dataHtml = '';
        if (data && data.length != 0) {
            for (var i = 0; i < data.length; i++) {
                dataHtml += '<tr>'
                    + '<td style="word-break: break-all;word-wrap: break-word">' + data[i].sn+ '</td>'
                    + '<td>' + data[i].createDate+ '</td>'
                    + '<td style="color: #2299ee;cursor: pointer;" valueuserofflineproject="'+data[i].userOffLineId+'" onclick="allOrderDetail(this)">' + noData(data[i].name) + '</td>'
                dataHtml += '<td>' + data[i].paidAmount + '/' + data[i].amount + '</td>'
                dataHtml += '<td>' + returnProjectOrderStatus(data[i].orderStatus,data[i].isReservation) + '</td>'
                dataHtml += '</tr>';
            }
        } else {
            dataHtml = '<tr><td colspan="17">暂无数据</td></tr>';
        }
        return dataHtml;
    },
    moneyPayInfo: function () {
        var url = SERVER_ADDR + "/hospital/finance/getEveryHospitalReceipt.json";
        var data = {};
        data.keyword = getQueryString('mobile');
        data.pageNumber = 1;
        data.pageSize = 100;
        ajaxGetRetInfo(url, data, function (retInfo) {
            console.log(retInfo)
            if (retInfo.success) {
                $('.userMoneyInfo').attr('onclick', '');
                $('.userMoneyUserofflinePayData').html(Get.setMoneyUserofflinePayDate(retInfo.data.list || []));
            } else {
                layer.alert(retInfo.data, {icon: 5});
            }
        }, '请求失败', 'GET', undefined, undefined);
    },
    setMoneyUserofflinePayDate: function (data) {
        console.log(data)
        var dataHtml = '';
        if (data && data.length != 0) {
            for (var i = 0; i < data.length; i++) {
                dataHtml += '<tr>'
                   /* +'<td>'+Number(i+1)+'</td>'*/
                    +'<td>'+new Date(data[i].createDate).Format('yyyy-MM-dd hh:mm:ss')+'</td>'
                if(!data[i].diseases){
                    dataHtml += '<td>无</td>'
                }else{
                    dataHtml += '<td valueuserOfflineProject="'+data[i].userOfflineProjectId+'" onclick="allOrderDetail(this)" style="color: #2299ee;cursor: pointer;">'+data[i].diseases+'</td>'
                }
                dataHtml +='<td style="word-break: break-all;word-wrap: break-word">'+returnVisitRecordNumber(data[i].number)+'</td>'
                dataHtml +='<td>'+noData(data[i].source)+'</td>'
                dataHtml +='<td>'+noData(data[i].creator)+'</td>'
                    +'<td>'+noData(data[i].doctorHelpmate)+'</td>'
                    +'<td>'+noData(data[i].doctor)+'</td>'
                    +'<td>'+noData(data[i].nurse)+'</td>'
                if (data[i].payMethod == 'card' || data[i].payMethod == 'cash') {
                    dataHtml += '<td>医院收款</td>'
                } else if (data[i].payMethod == 'medicalInsurance') {
                    dataHtml += '<td>医保支付</td>'
                } else if (data[i].payMethod == 'platform') {
                    dataHtml += '<td>平台支付</td>'
                }
                dataHtml +='<td>'+noData(data[i].amount) +'</td>'
                if(!data[i].remark){
                    dataHtml += '<td style="color: #2299ee;cursor: pointer;" valueId="'+data[i].id+'" vauleText=""></td>'
                }else{
                    dataHtml += '<td title="'+data[i].remark+'">'+returnSubstring(noData(data[i].remark))+'</td>'
                }
                dataHtml += '</tr>';
            }
        } else {
            dataHtml = '<tr><td colspan="17">暂无数据</td></tr>';
        }
        return dataHtml;
    },
    moneyInfo: function () {
        var url = SERVER_ADDR + "/hospital/user/getUserChargeInfo";
        var data = {};
        data.mobile = getQueryString('mobile');
        data.hospital = true;
        ajaxGetRetInfo(url, data, function (retInfo) {
            console.log(retInfo)
            if (retInfo.success) {
                $('.userMoneyInfo').attr('onclick', '');
                $('.userMoneyUserofflineData').html(Get.setMoneyUserofflineDate(retInfo.data.visitRecordJson));
                $('.userOrderGuahaoData').html(Get.setMoneyGuahaoDate(retInfo.data.registrationFeeForVisitRecordJson));
            } else {
                layer.alert(retInfo.data, {icon: 5});
            }
        }, '请求失败', 'GET', undefined, undefined);
    },
    setMoneyUserofflineDate: function (data) {
        console.log(data)
        var dataHtml = '';
        if (data && data.length != 0) {
            for (var i = 0; i < data.length; i++) {
                dataHtml += '<tr>'
                    + '<td>' + new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss")+ '</td>'
                    + '<td style="color: #2299ee;cursor: pointer;" valueuserofflineproject="'+data[i].userOffLineProjectId+'" onclick="allOrderDetail(this)">' + noData(data[i].diseases) + '</td>'
                    + '<td>' + returnVisitRecordNumber(data[i].number)+ '</td>'
                dataHtml += '<td>' + Number(data[i].totalAmount).toFixed(2) + '</td>'
                dataHtml += '<td style="color: #2299ee;cursor: pointer;" valueuserofflineproject="'+data[i].userOffLineProjectId+'" onclick="allOrderDetail(this)">' + Number(data[i].totalAmount - data[i].totalPaidAmount).toFixed(2) + '</td>'
                dataHtml += '</tr>';
            }
        } else {
            dataHtml = '<tr><td colspan="17">暂无数据</td></tr>';
        }
        return dataHtml;
    },
    setMoneyGuahaoDate: function (data) {
        console.log(data)
        var dataHtml = '';
        if (data && data.length != 0) {
            for (var i = 0; i < data.length; i++) {
                dataHtml += '<tr>'
                    + '<td>' + new Date(data[i].createDate).Format("yyyy-MM-dd hh:mm:ss")+ '</td>'
                    + '<td>' + data[i].subjectName+ '</td>'
                    + '<td>' + returnVisitRecordNumber(data[i].number)+ '</td>';
                dataHtml += '<td>' + Number(data[i].fee).toFixed(2) + '</td>'
                dataHtml += '<td style="color: #2299ee;cursor: pointer;" valueguahaoid="' + data[i].id+ '" onclick="printOrderOpen(this)">' + Number(data[i].fee - data[i].paidFee).toFixed(2) + '</td>'
                dataHtml += '</tr>';
            }
        } else {
            dataHtml = '<tr><td colspan="17">暂无数据</td></tr>';
        }
        return dataHtml;
    },
    DiseaseCourseRecord: function () {
        var url = SERVER_ADDR + "/hospital/user/getDiseaseCourseRecordListByUser.json";
        var data = {};
        data.mobile = getQueryString('mobile');
        ajaxGetRetInfo(url, data, function (retInfo) {
            console.log(retInfo)
            if (retInfo.success) {
                $('.userDiseaseCourseRecordInfo').attr('onclick', '');
                $('.userDiseaseCourseRecordData').html(Get.setDiseaseCourseRecordData(retInfo.data));
            } else {
                layer.alert(retInfo.data, {icon: 5});
            }
        }, '请求失败', 'GET', undefined, undefined);
    },
    setDiseaseCourseRecordData: function (data) {
        console.log(data)
        var dataHtml = '';
        if (data && data.length != 0) {
            for (var i = 0; i < data.length; i++) {
                dataHtml += '<tr>'
                    + '<td>' + data[i].createDate + '</td>';
                    if(data[i].type == 'FIRSTVISIT'){
                        dataHtml += '<td>首诊记录</td>'
                    }else if(data[i].type == 'AGAINVISIT'){
                        dataHtml += '<td>复诊记录</td>'
                    }else if(data[i].type == 'OPERATION'){
                        dataHtml += '<td>手术记录</td>'
                    }else if(data[i].type == 'TREATMENT'){
                        dataHtml += '<td>治疗记录</td>'
                    }else{
                        dataHtml += '<td></td>'
                    }
                dataHtml +='<td>' + data[i].record + '</td>'
                dataHtml += '</tr>';
            }
        } else {
            dataHtml = '<tr><td colspan="5">暂无数据</td></tr>';
        }
        return dataHtml;
    },
    DiseaseDoctorHelpmateCourseRecord: function () {
        var url = SERVER_ADDR + "/hospital/doctor/index/findLiveAdvisory";
        var data = {};
        data.mobile = getQueryString('mobile');
        ajaxGetRetInfo(url, data, function (retInfo) {
            console.log(retInfo)
            if (retInfo.success) {
                $('.userDiseaseCourseRecordInfo').attr('onclick', '');
                $('.userDiseaseCourseDoctorHelpmateRecordData').html(Get.setDiseaseDoctorHelpmateCourseRecordData(retInfo.data));
            } else {
                layer.alert(retInfo.data, {icon: 5});
            }
        }, '请求失败', 'GET', undefined, undefined);
    },
    setDiseaseDoctorHelpmateCourseRecordData: function (data) {
        console.log(data)
        var dataHtml = '';
        if (data && data.length != 0) {
            for (var i = 0; i < data.length; i++) {
                dataHtml += '<tr>'
                    + '<td>' + new Date(data[i].createDate).Format('yyyy-MM-dd hh:mm:ss') + '</td>';
                dataHtml +='<td>' + data[i].detail + '</td>'
                dataHtml += '</tr>';
            }
        } else {
            dataHtml = '<tr><td colspan="5">暂无数据</td></tr>';
        }
        return dataHtml;
    }
}
function printOrderOpen(obj) {
    var id = $(obj).attr('valueguahaoid');
    var index = layui.layer.open({
        title : "打印",
        type : 2,
        area: ['80%','80%'],
        content : 'sureOrderPrintGuahao.html?id=' + id + '&v=1134',
        success : function(layero, index){

        },
        cancel: function(index, layero){
            layui.layer.close(index)
            return false;
        }
    })
}
function diagnoseOpen(obj) {
    var id = $(obj).attr('valuevisitrecord');
    var index = layui.layer.open({
        title : "诊断依据",
        type : 2,
        area: ['80%','80%'],
        content : 'diagnose.html?id=' + id + '&v=1134',
        success : function(layero, index){

        },
        cancel: function(index, layero){
            layui.layer.close(index)
            return false;
        }
    })
}
function adviosyOne(obj) {
    var id = $(obj).attr('valueid');
    var index = layui.layer.open({
        title : "咨询信息",
        type : 2,
        area: ['80%','80%'],
        content : 'adviosyOne.html?id=' + id + '&v=1134',
        success : function(layero, index){

        },
        cancel: function(index, layero){
            layui.layer.close(index)
            return false;
        }
    })
}
