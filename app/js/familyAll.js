$(document).ready(function () {
    /*init();*/
        Go.familyList();
})

var Go = {
    familyList:function () {  //家庭成员列表
        var url = SERVER_ADDR + '/app/user/family/all';
        var Data = '';
        ajaxGetRetInfo(url, Data, this.familyListSuccess, '请求失败', 'GET', true, undefined);
    },
    familyListSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            if(retInfo.data && retInfo.data.length > 0){
                $('.noFamily').hide();
                retInfo.data.forEach(function (value) {
                    console.log(value)
                    var html = '';
                    html += '<div class="hos_child caseDiv set_box_shadow" style="width: 94%;float: none"> ' +
                        '<div class="hos_list_top clearfix"> ' +
                        '<div class="orderContent" style="margin: .3rem 0 0 2%;"> ' +
                        '<div class="left" style="width: 24%;line-height: inherit"><img src="./img/enuoFang.jpg"></div> ' +
                        '<div class="right" style="margin-top: .1rem;padding-left: 2%"> ' +
                        '<p class="detail" style="margin-bottom: .5rem">'
                    html += '<span class="name" style="font-size: 1.05rem">'+value.fullName+'</span>' ;
                    if(value.sex == 'man'){
                        html += '<span class="name" style="font-size: 1.05rem"><img style="width: 1.4rem;vertical-align: top;margin: 0 0 0 .5rem;" src="./img/health/healthMan.png"></span>' ;
                    }else{
                        html += '<span class="name" style="font-size: 1.05rem"><img style="width: 1.4rem;vertical-align: top;margin: 0 0 0 .5rem;" src="./img/health/healthWoman.png"></span>' ;
                    }
                    if(value.actualNameCertification == true){
                        html += '<span class="already" style="font-size: .85rem">已实名</span>' ;
                    }else{
                        html += '<span class="noalready" style="font-size: .85rem">未实名</span>' ;
                    }
                    if(value.age){
                        html += '<span class="name" style="font-size: .85rem;color: #777">'+value.age+'</span>' ;
                    }

                        html += '<p class="orderdetailchoose" style="    margin-bottom: .5rem;color: #999"> ' +
                            '<span class="appelliation">'+value.appellation+'</span> ' +
                        '<span>联系方式：</span> ' +
                        '<span class="orderdetailchooseName">'+value.mobile+'</span> ' +
                        '</p> ' +
                           /* '<p class="detail" style="line-height: 1rem;color: #999;    height: auto;"> ' +
                            '<button class="orderReadMore" valueid="'+value.id+'" onclick="Go.readPatientReports(this)">查看健康档案></button> ' +
                            '</p> ' +*/
                        '</div> ' +
                        '</div> ' +
                        '</div> ' +
                        '</div>';
                    //$('.hos_list').append(html);
                    $('.mescroll1DivList').append(html);
                })
                //$('.hos_doc_child:last-child').css('border-bottom','0');
            }
        }else{
            alert(retInfo.data)
        }
    },
    readPatientReports:function (obj) {
        alert('敬请期待');
        //window.location.href = 'myHealthFileBingliAdd.html?id='+$(obj).attr('valueid');
    }
}