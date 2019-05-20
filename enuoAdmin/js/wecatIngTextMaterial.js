var form
layui.use(['form','layer','jquery','laypage'],function(){
	 form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		$ = layui.jquery;
    form.render();
    searchBtn(1);
})
function searchBtn(pageNumber) {
    //var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
    var url = getUrl() + "/wechat/batach_material/get";
    var data = {};
    data.type = 'news';
    data.pageNumber = pageNumber;
    data.pageSize = 10;
    ajaxGetRetInfo(url,data,function (retInfo) {
        console.log(retInfo)
        //layer.close(index);
        if(retInfo.success){
            newsList(retInfo.data,retInfo.totalCount,pageNumber);
        }else{
            layer.alert(retInfo.data,{icon:5});
        }
    },'请求失败', 'GET', undefined, undefined);
}
function newsList(retInfo,totalCount,current){
    //渲染数据
    $(".news_list ul").html(renderDate(retInfo));
    //form.render('checkbox','choose')
    //分页
    var nums = 10; //每页出现的数据量
    laypage.render({
        elem : "page",
        skip:true,
        layout: ['count', 'prev', 'page', 'next', 'skip'],
        count:totalCount,
        limit :nums,
        curr: current || 1,
        jump : function(obj,firstLoaded){
            console.log(firstLoaded)
            console.log(obj)
            if (!firstLoaded) {
                searchBtn(obj.curr);
            }
        }
    })
}
function renderDate(data){
    /*data = [{
            "content": {
                "articles": [
                    {
                        "author": "",
                        "contentSourceUrl": "https://jinshuju.net/f/kyB6KD",
                        "digest": "",
                        "needOpenComment": false,
                        "onlyFansCanComment": false,
                        "showCoverPic": false,
                        "thumbMediaId": "alsAvvZMXqmAED7dZTT8Jbkhxf4csRyFJEPaiEqujG4",
                        "thumbUrl": "http://mmbiz.qpic.cn/mmbiz_jpg/tzCe21IfVAccLFNm0z8rj0WQvDicdQyxnJcPjtVhLu57JuVKKMM9aZY89O2Qe31icjrbrJvaUibcLAiaIAwSYB89cA/0?wx_fmt=jpeg",
                        "title": "为什么下午不能拔牙？原来是这个道理",
                        "url": "http://mp.weixin.qq.com/s?__biz=MzUxMTkxNjM3NA==&mid=100000403&idx=1&sn=7c41eeeee3a3f6f81fb15332357caf94&chksm=796d22aa4e1aabbc8c31ae3e09ee95c3c51067847bbf96708632443ef7b86546ca3c203b4451#rd"
                    },
                    {
                        "author": "",
                        "contentSourceUrl": "https://jinshuju.net/f/kyB6KD",
                        "digest": "对于矫正，大家都有许多问题想知道，“整牙有没有副作用啊？”“我的情况能做矫正吗？”“矫正后会不会反弹啊？",
                        "needOpenComment": false,
                        "onlyFansCanComment": false,
                        "showCoverPic": false,
                        "thumbMediaId": "alsAvvZMXqmAED7dZTT8JcxkxJC0VPaBRUsCtxZboxw",
                        "thumbUrl": "http://mmbiz.qpic.cn/mmbiz_jpg/tzCe21IfVAccLFNm0z8rj0WQvDicdQyxnjxdX59mIMMo074mXYwUgqAvGUk8YfWCJlBiayUuRy36ibld3v0ERSAaQ/0?wx_fmt=jpeg",
                        "title": "牙齿矫正知多少？正畸必看！！！",
                        "url": "http://mp.weixin.qq.com/s?__biz=MzUxMTkxNjM3NA==&mid=100000403&idx=2&sn=1576d283a7631e936f053e42015b7271&chksm=796d22aa4e1aabbc29612a1ca286edb377133e019917c18aa916433ca99fc462cf43e7a0cf31#rd"
                    }
                ],
                "createTime": 1538276848000,
                "empty": false,
                "updateTime": 1538296551000
            },
            "mediaId": "alsAvvZMXqmAED7dZTT8JX4vUVohPTvYu3PMHZxX57k",
            "updateTime": 1538296551000
        },
        {
            "content": {
                "articles": [
                    {
                        "author": "",
                        "contentSourceUrl": "https://jinshuju.net/f/kyB6KD",
                        "digest": "fghgh",
                        "needOpenComment": false,
                        "onlyFansCanComment": false,
                        "showCoverPic": false,
                        "thumbMediaId": "alsAvvZMXqmAED7dZTT8JXKwHN_Tl_LlDYfRDv-X7Ck",
                        "thumbUrl": "http://mmbiz.qpic.cn/mmbiz_jpg/tzCe21IfVAf2T1lUCWBCnzn7jWZ1U5COFh0sUjicfOWX9fW2L7fNUoBJZtoyuPTDhnzg63PU0nSAlZ5Ay2v2LZg/0?wx_fmt=jpeg",
                        "title": "电动牙刷到底是装逼神器，还是实用工具？",
                        "url": "http://mp.weixin.qq.com/s?__biz=MzUxMTkxNjM3NA==&mid=100000396&idx=1&sn=9e73983436d097a9ff015249dc3f3e46&chksm=796d22b54e1aaba3b3e579afcd4e97db9815c6ba8d3d741d3208fb106b277939bccc293d139d#rd"
                    },
                    {
                        "author": "",
                        "contentSourceUrl": "https://jinshuju.net/f/kyB6KD",
                        "digest": "fghgh",
                        "needOpenComment": false,
                        "onlyFansCanComment": false,
                        "showCoverPic": false,
                        "thumbMediaId": "alsAvvZMXqmAED7dZTT8JS-A02G3vRCjDnCldIzGvks",
                        "thumbUrl": "http://mmbiz.qpic.cn/mmbiz_jpg/tzCe21IfVAf2T1lUCWBCnzn7jWZ1U5COwsm82ev11ERibyYj8xYaiaPO3WblWS0ibxFrW3HuSEzNsv1icylHDxvNnQ/0?wx_fmt=jpeg",
                        "title": "为什么有些人只有28颗牙，有些人却长了32颗？",
                        "url": "http://mp.weixin.qq.com/s?__biz=MzUxMTkxNjM3NA==&mid=100000396&idx=2&sn=fec22a229dc1d96dacc1fdf5ffdb2872&chksm=796d22b54e1aaba3528cd2a143f9b3b46f15d51616e47fbd9ba8e893d4cd9b107623444c4a92#rd"
                    }
                ],
                "createTime": 1538205544000,
                "empty": false,
                "updateTime": 1538211874000
            },
            "mediaId": "alsAvvZMXqmAED7dZTT8JTQAv0xM7f_FeiF02jW3Fso",
            "updateTime": 1538211874000
        },
        {
            "content": {
                "articles": [
                    {
                        "author": "",
                        "contentSourceUrl": "https://jinshuju.net/f/kyB6KD",
                        "digest": "fghgh",
                        "needOpenComment": false,
                        "onlyFansCanComment": false,
                        "showCoverPic": false,
                        "thumbMediaId": "alsAvvZMXqmAED7dZTT8JXKwHN_Tl_LlDYfRDv-X7Ck",
                        "thumbUrl": "http://mmbiz.qpic.cn/mmbiz_jpg/tzCe21IfVAf2T1lUCWBCnzn7jWZ1U5COFh0sUjicfOWX9fW2L7fNUoBJZtoyuPTDhnzg63PU0nSAlZ5Ay2v2LZg/0?wx_fmt=jpeg",
                        "title": "电动牙刷到底是装逼神器，还是实用工具？",
                        "url": "http://mp.weixin.qq.com/s?__biz=MzUxMTkxNjM3NA==&mid=100000396&idx=1&sn=9e73983436d097a9ff015249dc3f3e46&chksm=796d22b54e1aaba3b3e579afcd4e97db9815c6ba8d3d741d3208fb106b277939bccc293d139d#rd"
                    },
                    {
                        "author": "",
                        "contentSourceUrl": "https://jinshuju.net/f/kyB6KD",
                        "digest": "fghgh",
                        "needOpenComment": false,
                        "onlyFansCanComment": false,
                        "showCoverPic": false,
                        "thumbMediaId": "alsAvvZMXqmAED7dZTT8JS-A02G3vRCjDnCldIzGvks",
                        "thumbUrl": "http://mmbiz.qpic.cn/mmbiz_jpg/tzCe21IfVAf2T1lUCWBCnzn7jWZ1U5COwsm82ev11ERibyYj8xYaiaPO3WblWS0ibxFrW3HuSEzNsv1icylHDxvNnQ/0?wx_fmt=jpeg",
                        "title": "为什么有些人只有28颗牙，有些人却长了32颗？",
                        "url": "http://mp.weixin.qq.com/s?__biz=MzUxMTkxNjM3NA==&mid=100000396&idx=2&sn=fec22a229dc1d96dacc1fdf5ffdb2872&chksm=796d22b54e1aaba3528cd2a143f9b3b46f15d51616e47fbd9ba8e893d4cd9b107623444c4a92#rd"
                    }
                ],
                "createTime": 1538205544000,
                "empty": false,
                "updateTime": 1538211874000
            },
            "mediaId": "alsAvvZMXqmAED7dZTT8JTQAv0xM7f_FeiF02jW3Fso",
            "updateTime": 1538211874000
        },
        {
            "content": {
                "articles": [
                    {
                        "author": "",
                        "contentSourceUrl": "https://jinshuju.net/f/kyB6KD",
                        "digest": "fghgh",
                        "needOpenComment": false,
                        "onlyFansCanComment": false,
                        "showCoverPic": false,
                        "thumbMediaId": "alsAvvZMXqmAED7dZTT8JXKwHN_Tl_LlDYfRDv-X7Ck",
                        "thumbUrl": "http://mmbiz.qpic.cn/mmbiz_jpg/tzCe21IfVAf2T1lUCWBCnzn7jWZ1U5COFh0sUjicfOWX9fW2L7fNUoBJZtoyuPTDhnzg63PU0nSAlZ5Ay2v2LZg/0?wx_fmt=jpeg",
                        "title": "电动牙刷到底是装逼神器，还是实用工具？",
                        "url": "http://mp.weixin.qq.com/s?__biz=MzUxMTkxNjM3NA==&mid=100000396&idx=1&sn=9e73983436d097a9ff015249dc3f3e46&chksm=796d22b54e1aaba3b3e579afcd4e97db9815c6ba8d3d741d3208fb106b277939bccc293d139d#rd"
                    },
                    {
                        "author": "",
                        "contentSourceUrl": "https://jinshuju.net/f/kyB6KD",
                        "digest": "fghgh",
                        "needOpenComment": false,
                        "onlyFansCanComment": false,
                        "showCoverPic": false,
                        "thumbMediaId": "alsAvvZMXqmAED7dZTT8JS-A02G3vRCjDnCldIzGvks",
                        "thumbUrl": "http://mmbiz.qpic.cn/mmbiz_jpg/tzCe21IfVAf2T1lUCWBCnzn7jWZ1U5COwsm82ev11ERibyYj8xYaiaPO3WblWS0ibxFrW3HuSEzNsv1icylHDxvNnQ/0?wx_fmt=jpeg",
                        "title": "为什么有些人只有28颗牙，有些人却长了32颗？",
                        "url": "http://mp.weixin.qq.com/s?__biz=MzUxMTkxNjM3NA==&mid=100000396&idx=2&sn=fec22a229dc1d96dacc1fdf5ffdb2872&chksm=796d22b54e1aaba3528cd2a143f9b3b46f15d51616e47fbd9ba8e893d4cd9b107623444c4a92#rd"
                    }
                ],
                "createTime": 1538205544000,
                "empty": false,
                "updateTime": 1538211874000
            },
            "mediaId": "alsAvvZMXqmAED7dZTT8JTQAv0xM7f_FeiF02jW3Fso",
            "updateTime": 1538211874000
        }
    ]*/
    console.log(data)
    var dataHtml = '';
    if(data.length != 0){
        for(var i=0;i<data.length;i++){
            dataHtml += '<li class="weui-desktop-img-picker__item" valueid="'+data[i].mediaId+'" valueTitle="'+data[i].content.articles[0].title+'" valueUrl="'+data[i].content.articles[0].url+'" valuePicurl="'+data[i].content.articles[0].thumbUrl+'" valueDesc="'+data[i].content.articles[0].digest+'" onclick="chooseImg(this)">' +
                '<a href="" target="_blank" class="weui-desktop-appmsg__cover__title">'+data[i].content.articles[0].title+'</a>'+
                '<img class="weui-desktop-img-picker__img-thumb" valueid="'+data[i].mediaId+'" src="'+data[i].content.articles[0].thumbUrl+'"/> ' +
                '<p title="'+data[i].content.articles[0].digest+'" class="weui-desktop-appmsg__cover__desc">'+data[i].content.articles[0].digest+'</p>' +
                '</li>';
        }
    }else{
        dataHtml = '<tr><td colspan="5">暂无数据</td></tr>';
    }
    return dataHtml;
}
function chooseImg(obj) {
    $('.card_mask_global').remove();
    $(obj).append('<div class="card_mask_global"><img class="icon_card_selected_global" src="./img/gouback.png"></div>');
    console.log($('.card_mask_global').parent().attr('valueid'));
    console.log(parent.$('.imgPostP'))
    //$('.card_mask_global').hide();
    //$(obj).find('.card_mask_global').show()
}
function closeLayer() {
    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    parent.layer.close(index); //再执行关闭
}
function sureLayer() {
    parent.$('.imgTextPostP').empty().append($('.card_mask_global').parent());
    parent.$('.imgTextPostP').find('.card_mask_global').remove();
    parent.$('.imgTextPostP').find('.weui-desktop-img-picker__item').attr('onclick','');
    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    parent.layer.close(index); //再执行关闭
}