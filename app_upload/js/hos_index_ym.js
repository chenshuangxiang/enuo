
var surplus = []; //存入剩余医院医生 数组
var hosdesc = '';
function init() {
    Get.GetHocInfo();
}
var Get = {
    GetHocInfo:function () {
        var url = SERVER_ADDR + '/app/hospital/getDetail.json';
        var Data = {};
        Data.id = getQueryString('hosId');
        ajaxGetRetInfo(url, Data, this.getHocInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    getHocInfoSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
           $('.hocImg').attr('src', retInfo.data.headImgUrl);
            $('.hosname').text(retInfo.data.name);
           $('.hosnameBu').text(retInfo.data.typeName);
            $('.make_num').text(retInfo.data.orderQuantity);
            $('.hosAddress').text(retInfo.data.address);
            $('.descinfo').text(retInfo.data.brief);
            if(retInfo.data.isFavorite == true){
                $('.pub_hearder_right').attr('src','img/favouriteYes.png');
            }
            hosdesc = retInfo.data.brief;
            if(hosdesc.length >= 34){
                $('.flex_all_center').show();
            }else {
                $('.flex_all_center').hide();
            }
           /* $('.lunscore').text(retInfo.data.evaluationQuantity);
            $('.commontCount').text('(' + retInfo.data.evaluationQuantity + ')' );
            $('.hosName').text(retInfo.data.hospitalName).attr('hosId',retInfo.data.hospitalId);*/

            $('.hosDiv').attr('hosId',retInfo.data.hospitalId);
            retInfo.data.images.forEach(function (value) {   //加入医院图片
                $('.hos_detail_pic').append('<img src="'+value+'" />')
            })
            if(retInfo.data.doctors){
                if(retInfo.data.doctors.length <= 3){
                    $('.all_doc').hide();
                }else{
                    $('.all_doc').show();
                }
                retInfo.data.doctors.forEach(function (value,index) {  //加入医院医生
                    if(index <= 2){
                        Get.adddoc(value);
                    }else{
                        surplus.push(value);
                    }
                })
            }else {
                $('.all_doc').hide();
            }

        }else{
            alert(retInfo.data)
        }
    },
    adddoc:function (value) {
            var html = '';
            html += '<div class="hos_child set_box_shadow" itemid="4" onclick="href(this)"> ' +
                '<div class="hos_list_top clearfix"> ' +
                '<div class="left"><img src="'+value.headImgUrl+'"></div> ' +
                '<div class="right"><p class="detail"><span class="name">'+value.hospitalName+'</span></p> ' +
                '<p><span>项目：</span><span>'+value.subjectName+'</span></p> ' +
                '<p><span>预约：</span><span class="peopelCount">'+value.sellQuantity+'人</span></p></div> ' +
                '</div> ' +
                '</div>';
            $('.hos_doc_list').append(html);
    },
    surplus:function () {
        surplus.forEach(function (value) {
            Get.adddoc(value);
            $('.all_doc').hide();
        })
    },
    descsurplus:function () {
        $('.descinfo').removeClass('overflow_num_ellipsis');
        $('.flex_all_center').hide();
    },
    favourite: function () {  //收藏医院
        if( $('.pub_hearder_right').attr('src') == ('img/favouriteYes.png')){
            return;
        }
        var url = SERVER_ADDR + '/app/user/favorite/add';
        var Data = {};
        Data.id = getQueryString('hosId');
        Data.type = 'hopital';
        ajaxGetRetInfo(url, Data, this.favouriteSuccess, '请求失败', 'POST', true, undefined);
    },
    favouriteSuccess:function (retInfo) {
        console.log(retInfo);
        if(retInfo.success == true){
            $('.pub_hearder_right').attr('src','img/favouriteYes.png');
        }else{
            alert('请求数据有错')
        }
    },
}