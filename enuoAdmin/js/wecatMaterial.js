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
    data.type = 'image';
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
    var dataHtml = '';
    //data = [{"mediaId":"alsAvvZMXqmAED7dZTT8JTtn3KbTBBEWB9jcM4mM2sc","name":"9e6f3ff824e4814155bc05f617ac08d.jpg","updateTime":1544488244000,"url":"http://mmbiz.qpic.cn/mmbiz_jpg/tzCe21IfVAecAmgAJIic7ibeOicO0ian58c9DW8sXazFVJNnhnOetYqMxxuNNZN6xwWHHUDjJrGUvOoAKlIibdHeNHA/0?wx_fmt=jpeg"},{"mediaId":"alsAvvZMXqmAED7dZTT8JcxkxJC0VPaBRUsCtxZboxw","name":"CropImage","updateTime":1538295616000,"url":"http://mmbiz.qpic.cn/mmbiz_jpg/tzCe21IfVAccLFNm0z8rj0WQvDicdQyxnjxdX59mIMMo074mXYwUgqAvGUk8YfWCJlBiayUuRy36ibld3v0ERSAaQ/0?wx_fmt=jpeg"},{"mediaId":"alsAvvZMXqmAED7dZTT8JUK-pj8Xem2YIYbuFAvGKwU","name":"QQ图片20180930155928.jpg","updateTime":1538294701000,"url":"http://mmbiz.qpic.cn/mmbiz_jpg/tzCe21IfVAccLFNm0z8rj0WQvDicdQyxnia0YNdeTficjpYuxiar5VniaibUtMnH8gRcQcxqGmEbJ09skba8VzwVUzug/0?wx_fmt=jpeg"},{"mediaId":"alsAvvZMXqmAED7dZTT8JWliEiHbD1-MMTlfZIuUQn4","name":"QQ图片20180930155922.jpg","updateTime":1538294700000,"url":"http://mmbiz.qpic.cn/mmbiz_jpg/tzCe21IfVAccLFNm0z8rj0WQvDicdQyxn3BxzAib87vj39ibw8d82yibkPcN1RSluE24MVSp48tQPpJwePsvHwwdWg/0?wx_fmt=jpeg"},{"mediaId":"alsAvvZMXqmAED7dZTT8JcLZ17Kq1l6u9G9MLNUJebg","name":"CropImage","updateTime":1538276843000,"url":"http://mmbiz.qpic.cn/mmbiz_jpg/tzCe21IfVAccLFNm0z8rj0WQvDicdQyxn9WlHaDOOMJUjFFTNDlDOywZVT0kWEV3ib1sBwKolF9hPjj5nmNDhIYg/0?wx_fmt=jpeg"},{"mediaId":"alsAvvZMXqmAED7dZTT8Jbkhxf4csRyFJEPaiEqujG4","name":"CropImage","updateTime":1538276842000,"url":"http://mmbiz.qpic.cn/mmbiz_jpg/tzCe21IfVAccLFNm0z8rj0WQvDicdQyxnJcPjtVhLu57JuVKKMM9aZY89O2Qe31icjrbrJvaUibcLAiaIAwSYB89cA/0?wx_fmt=jpeg"},{"mediaId":"alsAvvZMXqmAED7dZTT8JejlpxXGPEuXsUGScNOJ-nc","name":"微信图片_20170803162550.jpg","updateTime":1538276783000,"url":"http://mmbiz.qpic.cn/mmbiz_jpg/tzCe21IfVAccLFNm0z8rj0WQvDicdQyxnNSDUPoOwxG9leDslc1VfFPZsKNxgkF8OxgYslUUkTicc84faeN2soMg/0?wx_fmt=jpeg"},{"mediaId":"alsAvvZMXqmAED7dZTT8JS-A02G3vRCjDnCldIzGvks","name":"CropImage","updateTime":1538207177000,"url":"http://mmbiz.qpic.cn/mmbiz_jpg/tzCe21IfVAf2T1lUCWBCnzn7jWZ1U5COwsm82ev11ERibyYj8xYaiaPO3WblWS0ibxFrW3HuSEzNsv1icylHDxvNnQ/0?wx_fmt=jpeg"}]
    if(data.length != 0){
        for(var i=0;i<data.length;i++){

            dataHtml += '<li class="weui-desktop-img-picker__item" valueid="'+data[i].mediaId+'" onclick="chooseImg(this)">' +
                '<img class="weui-desktop-img-picker__img-thumb" valueid="'+data[i].mediaId+'" src="'+data[i].url+'"/> ' +
                '<strong class="weui-desktop-img-picker__img-title">'+data[i].name+'</strong> ' +
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
    parent.$('.imgPostP').empty().append($('.card_mask_global').parent().find('img')[0]);
    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    parent.layer.close(index); //再执行关闭
}