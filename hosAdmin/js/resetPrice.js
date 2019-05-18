var tabledata;
var form
layui.use(['form','layer','jquery','table'],function(){
	 form = layui.form,
        table = layui.table,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		$ = layui.jquery;

    form.render();
	//加载页面数据
	var newsData = '';
	if(getQueryString('type') == 'read'){
        $('.resetBtnDiv').hide();
    }
    searchBtn(1);
	function searchBtn(pageNumber) {
        var index = layer.msg('查询中，请稍候',{icon: 16,time:false,shade:0.8});
        var url = SERVER_ADDR + "/hospital/order/getMaterial.json";
        var data = {};
        data.orderId = getQueryString('valueid');
        data.fkId = getQueryString('fkid');
        ajaxGetRetInfo(url,data,function (retInfo) {
            console.log(retInfo)
            layer.close(index);
            if(retInfo.success){
                tabledata = retInfo.data;
                totlePrice();
                if(getQueryString('type') == 'read'){
                    tableRenderRead();
                }else{
                    tableRender();
                }
            }else{
                layer.alert(retInfo.data,{icon:5});
			}
        },'请求失败', 'GET', undefined, undefined);
    }
    function tableRender(retInfo) {//品名	产地  单位	数量	原价	折后价	合计
        layui.table.render({
            elem: '#news_content'
            ,cols: [[ //标题栏
                 {field: 'modelNo', title: '品名', width: 250}
                ,{field: 'type', title: '类别',  width: 100,templet: '#type'}
                ,{field: 'placeOfOrigin', title: '产地', width: 90}
                ,{field: 'spec', title: '单位', width: 80}
                ,{field: 'originalPrice', title: '原价', width: 100}
                ,{field: 'price', title: '折后价', width: 100,style:'background-color: #fff;border:0.1px dashed red;    border-right: 1px solid #e2e2e2;',edit: 'text'}
                ,{field: 'quantity', title: '数量', width: 80}
                ,{field: 'medicalInsurance', title: '医保',  width: 80,templet: '#medicalInsurance'}
                ,{field: 'totalPrice', title: '合计', width: 100}
                //,{field: 'receiveName', title: '指定医生', width: 100,edit: 'text'}
                //,{field: 'experience', title: '项目咨询', width: 100,edit: 'text'}
            ]]
            ,data: tabledata
            //,skin: 'line' //表格风格
            ,even: true
            //,page: true //是否显示分页
            //,limits: [5, 7, 10]
            //,limit: 5 //每页默认显示的数量
        });
        layui.form.render();
    }function tableRenderRead(retInfo) {//品名	产地  单位	数量	原价	折后价	合计
        layui.table.render({
            elem: '#news_content'
            ,cols: [[ //标题栏
                {field: 'modelNo', title: '品名', width: 250}
                ,{field: 'type', title: '类别',  width: 100,templet: '#type'}
                ,{field: 'placeOfOrigin', title: '产地', width: 90}
                ,{field: 'spec', title: '单位', width: 80}
                ,{field: 'originalPrice', title: '原价', width: 100}
                ,{field: 'price', title: '折后价', width: 100}
                ,{field: 'quantity', title: '数量', width: 80}
                ,{field: 'medicalInsurance', title: '医保',  width: 80,templet: '#medicalInsurance'}
                ,{field: 'totalPrice', title: '合计', width: 100}
                //,{field: 'receiveName', title: '指定医生', width: 100,edit: 'text'}
                //,{field: 'experience', title: '项目咨询', width: 100,edit: 'text'}
            ]]
            ,data: tabledata
            //,skin: 'line' //表格风格
            ,even: true
            //,page: true //是否显示分页
            //,limits: [5, 7, 10]
            //,limit: 5 //每页默认显示的数量
        });
        layui.form.render();
    }
    table.on('edit(news_content)', function(obj){
        console.log(obj)
        var value = obj.value //得到修改后的值
            ,data = obj.data //得到所在行所有键值
            ,field = obj.field; //得到字段
        console.log(value,data,field);
       // var addNews = {};
        /*addNews.modelNo = data.modelNo;
        addNews.placeOfOrigin = data.placeOfOrigin;
        addNews.spec = data.spec;
        addNews.originalPrice = data.originalPrice;
        addNews.price = data.price;
        addNews.id = data.id;

        addNews[field] = value;*/
        tabledata[data.LAY_TABLE_INDEX][field] = Number(value).toFixed(2);
        tabledata[data.LAY_TABLE_INDEX]['totalPrice'] = (Number(value) * tabledata[data.LAY_TABLE_INDEX]['quantity']).toFixed(2);
        console.log(tabledata);
        tableRender();
        totlePrice();
        //sureResetPrice(addNews);
    });
 /*   function updataTemplate(addNews) {
        var url = SERVER_ADDR + "/hospital/materialTemplate/update";
        var index = layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        ajaxGetRetInfo(url,addNews,function (retInfo) {
            console.log(retInfo)
            layer.close(index);
            if(retInfo.success){
                layer.msg('修改成功');
            }else{
                layer.alert(retInfo.data,{icon:5})
            }
            //form.render('select', 'from');//更新
        },'请求失败', 'POST', undefined, undefined);
    }*/
    function totlePrice() {
        var totalUserPrice = 0;
        tabledata.forEach(function (value) {
            totalUserPrice += Number(value.totalPrice);
            $('.totalUserPrice').text(totalUserPrice.toFixed(2));
        })
    }

})
function sureResetPrice(addNews) {
    var addNews = {};
    addNews.orderId = getQueryString('valueid');
    addNews.fkId = getQueryString('fkid');
    addNews.map = JSON.stringify(tabledata);
    var url = SERVER_ADDR + "/hospital/order/updatePrice";
    var index = layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
    ajaxGetRetInfo(url,addNews,function (retInfo) {
        console.log(retInfo)
        layer.close(index);
        if(retInfo.success){
            layer.msg('更改成功');
            setTimeout(function () {
                parent.window.location.reload();
            },1000);
        }else{
            layer.alert(retInfo.data,{icon:5})
        }
        //form.render('select', 'from');//更新
    },'请求失败', 'POST', undefined, undefined);
}
