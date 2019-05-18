/*
var pageNumber = 1;
var total = 5;
var nexttotal = 0;
var businesStatus;
var title = 'e诺平台全新改版上线啦！超值1元购项目正在火热进行中！全脸皮秒祛斑1元，腹部B超1元，洗牙1元……';
var link = 'https://www.enuo120.com/app/activity_more.html';
var imgUrl = 'https://www.enuo120.com/upload/image/201801/28/CQiZY54sBz1s5Ya9QdK.jpg';  //分享的信息
*/
var title = 'pick你最尊崇的有德医生，为他投上你宝贵的一票！';
var link = window.location.href;
var imgUrl = 'https://www.enuo120.com/app/img/vote/voteDoctor.png';  //分享的信息
var localDoc = JSON.parse(localStorage.getItem('doc')) || [];
function init() {
    getSign();
    Get.getDocInfo();
    if(JSON.parse(localStorage.getItem('doc')) != null){
        if(JSON.parse(localStorage.getItem('doc')).indexOf(Number($('.sureBack').attr('valueid'))) != -1){
            //$('.option-input').prop('checked',true);
            $('.sureBack').prop('disabled',false).css('background-color','#cccccc').text('已勾选');
        }
    }
}
var Get = {
    getDocInfo:function () {
        var url = SERVER_ADDR + '/app/vote/selectVoteInfoById';
        var Data = {};
        Data.voteInfoId = getQueryString('id');
        ajaxGetRetInfo(url, Data, this.getDocInfoSuccess, '请求失败', 'GET', true, undefined);
    },
    getDocInfoSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            retInfo.data = retInfo.data[0];
            switch (retInfo.data.title)
            {
                case 'medicalOfficer':
                    retInfo.data.title = '医士';
                    break;
                case 'physician':
                    retInfo.data.title = '医师';
                    break;
                case 'attendingDoctor':
                    retInfo.data.title = '主治医师';
                    break;
                case 'deputyDirector':
                    retInfo.data.title = '副主任医师';
                    break;
                case 'director':
                    retInfo.data.title = '主任医师';
                    break;
            }
            $('.docNum').text('编号:' + retInfo.data.id);
            $('.sureBack').attr('valueid',retInfo.data.id);
            $('.docImg').attr('src',retInfo.data.imgUrl);
            imgUrl = retInfo.data.imgUrl;
            title = '我是'+retInfo.data.name+'，我正在参加e诺平台首届医德之星评选活动，捧个人场快来投我一票吧！';
            $('.name').text(retInfo.data.name);
            $('.title').text(retInfo.data.title);
            $('.hospital').text(retInfo.data.hospitalName);
            $('.reason').text(retInfo.data.doctorEthics);
        }else{
            alert(retInfo.data)
        }
    },
    check:function (obj) {
        if(localDoc.length >= 3){
            alert('最多只能勾选三个医生');
            return
        }
        console.log('选中----' + $(obj).attr('valueid'));
        localDoc.push(Number($(obj).attr('valueid')));
        console.log(localDoc)
        localStorage.setItem('doc',JSON.stringify(localDoc));
        window.location.href = 'vote.html';

        console.log(localDoc);
        /*if($(obj).is(":checked") == true){
            if(localDoc.length >= 3){
                $(obj).prop('checked',false);
                //$('.warnZi').text('最多只能勾选三个');
                //$('.modelOpen').show();
                alert('最多只能勾选三个');
                return
            }
            console.log('选中----' + $(obj).attr('valueid'));
            localDoc.push(Number($(obj).attr('valueid')));
            console.log(localDoc)
            localStorage.setItem('doc',JSON.stringify(localDoc));
            /!*if( JSON.parse(localStorage.getItem('doc')).length == 3){
                $('.chooseDoc').hide();
                $('.sureVote').show();
            }*!/
        }else{
            localDoc.forEach(function (value) {
                console.log(value)
                if(Number($(obj).attr('valueid')) == value){
                    console.log('要去删除的local')
                    localDoc.removeArrayOne(value);
                }
            })
            localStorage.setItem('doc',JSON.stringify(localDoc));
            console.log('取消选中' + $(obj).attr('valueid') + '删除后：'+JSON.stringify(localDoc));
            /!*if( JSON.parse(localStorage.getItem('doc')).length < 3){
                $('.chooseDoc').show();
                $('.sureVote').hide();
            }*!/
        }*/
    }
}
