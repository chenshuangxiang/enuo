var form
layui.use(['form','layer','jquery'],function(){
	 form = layui.form,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		$ = layui.jquery;
    form.render();

    searchBtn(1);
})
function searchBtn(pageNumber,type) {
    var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
    var url = SERVER_ADDR + getQueryString('payUrl');
    var data = {};
    data.paymentDate = getQueryString('date');
    data.payMethod = getQueryString('payMethod');
    ajaxGetRetInfo(url,data,function (retInfo) {
        console.log(retInfo)
        layer.close(index);
        if(retInfo.success){
            if(retInfo.data){
                newsList(retInfo.data,retInfo.totalCount,pageNumber);
            }else {
                newsList([],retInfo.totalCount,pageNumber);
            }
        }else{
            layer.alert(retInfo.data,{icon:5});
        }
    },'请求失败', 'GET', undefined, undefined);
}
function newsList(retInfo,totalCount,current){
    //渲染数据
    $(".news_content").html(renderDate(retInfo));
}
function renderDate(data){
    var dataHtml = '';
    /*现场支付*/
    if(data.medicalInsuranceTotalAmount){
        dataHtml+= '<tr><th>今日医保支付收款</th><td>'+data.medicalInsuranceTotalAmount+'元</td></tr>'
    }
    if(data.cardTotalAmount && !data.cashTotalAmount){
        dataHtml+= '<tr><th>今日医院收款</th><td>'+data.cardTotalAmount+'元</td></tr>'
    }else if(data.cashTotalAmount && !data.cardTotalAmount){
        dataHtml+= '<tr><th>今日医院收款</th><td>'+data.cashTotalAmount+'元</td></tr>'
    }else if(data.cashTotalAmount && data.cardTotalAmount){
        dataHtml+= '<tr><th>今日医院收款</th><td>'+Number(Number(data.cashTotalAmount) + Number(data.cardTotalAmount)).toFixed(2) +'元</td></tr>'
    }
    /*平台支付*/
    if(data.wxPayTotalAmount && data.wxPayTotalAmount != 0){
        dataHtml+= '<tr><th>今日微信支付收款</th><td>'+data.wxPayTotalAmount+'元</td></tr>'
    }
    if(data.aliPayTotalAmount && data.aliPayTotalAmount != 0){
        dataHtml+= '<tr><th>今日支付宝支付收款</th><td>'+data.aliPayTotalAmount+'元</td></tr>'
    }
    if(data.lianpayTotalAmount && data.lianpayTotalAmount != 0){
        dataHtml+= '<tr><th>今日连连支付收款</th><td>'+data.lianpayTotalAmount+'元</td></tr>'
    }
    if(data.platformTotalAmount && data.platformTotalAmount != 0){
        dataHtml+= '<tr><th>今日余额支付收款</th><td>'+data.platformTotalAmount+'元</td></tr>'
    }
    return dataHtml;
}

