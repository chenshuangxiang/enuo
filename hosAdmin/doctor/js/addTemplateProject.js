var form;
var arr_pic = [];
var tableMateLocal = [];//JSON.parse(localStorage.getItem('localInfo')) || [];
    //tableMateLocal = tableMateLocal[0];
    console.log(tableMateLocal)
var tabledata = [];
var tablePostdata = [];
layui.use(['form','layer','jquery','layedit','table','upload'],function(){
	 form = layui.form,
         table = layui.table,
		layer = parent.layer === undefined ? layui.layer : parent.layer,
		laypage = layui.laypage,
		layedit = layui.layedit,
		$ = layui.jquery;
     upload = layui.upload;
    getTemplateProject();
    getMaintellInfo('',false); //主诉模板
    getNowIllInfo('',false); //现病史模板
    getDoctorNameFrontSelect('doctor');
    $('.fenToDoctor').val(getQueryString('doctorid'));
    //getDoctorNameFrontSelect('medicalTechnology');  //医技
    getFentoNameSelect(form,'nurse');
    getDiagnosesMuban(form); //获取病历模板
    setTimeout(function () {
        $('.projectName').next('.layui-form-select').remove();
        $('.projectName').parent().next('.layui-form-select').remove();
        $('.combo-input').attr('placeholder','请选择或输入').attr('lay-verify','required');
        $('.combo-dropdown li').eq(0).remove()
    },10);
    $('.option-item').click(function () {
        var elThis = $(this);
        setTimeout(function () {
            console.log(elThis.attr('data-value'))
            getTemplateProjectInfo(elThis.attr('data-value'),'project');
        },100);

    });
    $('.combo-input').change(function () {
        console.log($('.combo-input').val())
        var val = $('.combo-input').val();
        setTimeout(function () {
            $('.combo-input').val(val)
        },1)
    });
    $('.subsist').keyup(function(event){
        $('.factPrice').text($('.subsist').val())
        $('.shouldUserPrice').text(Number($('.totalUserPrice').text()) - Number($('.factPrice').text()));
    });
    $('.subsist').change(function () {
        if($('.subsist').val() == ''){
            $('.subsist').val(0);
            $('.factPrice').text(0)
            $('.shouldUserPrice').text($('.totalUserPrice').text() - $('.factPrice').text());
        }
    });

  /*  form.on('select(projectName)', function(data){  //品名获取品名信息
        getTemplateProjectInfo(data.elem[data.elem.selectedIndex].title);
    });*/
    form.on('select(diagnosesMuban)', function(data){  //获取病历模板信息
        if(data.elem[data.elem.selectedIndex].title != ''){
            getDiagnosesMubanInfo(data.elem[data.elem.selectedIndex].title);
        }else{
            $('.maintell').val('');
            $('.nowIll').val('');
            $('.tutorshipCheck').val('');
            $('.treatmentAdvice').val('');
        }
    });
    form.on('select(cailiaoName)', function(data){  //品名获取品名信息
        if($('.model').hasClass('sureTime') == true){
            getModelNoInfo(form,data.elem[data.elem.selectedIndex].title,"/hospital/doctor/index/getMaterialDetail.json",false);
        }else if($('.medicalmodel').hasClass('sureTime') == true){
            getModelNoInfo(form,data.elem[data.elem.selectedIndex].title,"/hospital/doctor/index/getMaterialMedicalcareDetail.json",true);
        }
        $('.cailiaoName').val('');
        form.render();
        setTimeout(function () {
            $('.projectName').next('.layui-form-select').remove();
            $('.projectName').parent().next('.layui-form-select').remove();
            $('.combo-input').attr('placeholder','请选择或输入').attr('lay-verify','required');
            $('.combo-dropdown li').eq(0).remove()
        },10);
    });
    form.render();
   /* var nowIllInput = $('.nowIll').next('.layui-form-select').find('.layui-input'); //现病史的值
       nowIllInput.blur(function () {
          console.log(nowIllInput.val());
          var blurVal = nowIllInput.val();
          setTimeout(function () {
              nowIllInput.val(blurVal)
          },200);
       });*/

    upload.render({
        elem: '.projectImg1',
        url: SERVER_ADDR + '/common/file/upload',
        done: function(res){
            //arr_pic.push(res.data);
            init_img_phpto(res.data,1);//初始化上传图片
        }
    });
    //病历信息
    function getDiagnosesMubanInfo(id) {
        var url = SERVER_ADDR + '/hospital/doctor/index/getMedicalRecordTemplateDetails.json';
        var Data = {};
        Data.id = id;
        ajaxGetRetInfo(url,Data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                //初始化病历信息进去
                $('.maintell').val(retInfo.data.chiefComplaint);
                $('.nowIll').val(retInfo.data.presentMedicalHistory);
                $('.tutorshipCheck').val(retInfo.data.supplementaryExamination);
                $('.treatmentAdvice').val(retInfo.data.treatmentAdvice);
            }else{
                alert(retInfo.data);
            }
        },'请求失败', 'GET', undefined, undefined);
    }
    //品名信息
    function getModelNoInfo(form,id,Url,medicalInsurance) {  //medicalInsurance 是否医保项目
        var url = SERVER_ADDR + Url;  ///hospital/doctor/index/getMaterialMedicalcareDetail.json
        var Data = {};
        Data.id = id;
        var medicalInsurance = medicalInsurance;
        ajaxGetRetInfo(url,Data,function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                //选完品名进行存储
                var addCailiao = {};
                addCailiao.disease =  $('.combo-input').val();
                addCailiao.placeOfOrigin = retInfo.data.placeOfOrigin;
                addCailiao.modelNo = retInfo.data.modelNo;
                addCailiao.medicalInsurance = medicalInsurance;
                if(medicalInsurance == true){
                    addCailiao.medicalInsurance = '是';
                }else{
                    addCailiao.medicalInsurance = '否';
                }
                if(retInfo.data.type == 'cure' || !retInfo.data.type){
                    addCailiao.type = '医疗类';
                }else if(retInfo.data.type == 'materialScience'){
                    addCailiao.type = '材料类';
                }else if(retInfo.data.type == 'drugs'){
                    addCailiao.type = '药品类';
                }else if(retInfo.data.type == 'check'){
                    addCailiao.type = '检查类';
                }else if(retInfo.data.type == 'health'){
                    addCailiao.type = '保健类';
                }
                addCailiao.spec = retInfo.data.spec;
                addCailiao.quantity = 1;
                addCailiao.noChangePrice = retInfo.data.price;
                addCailiao.originalPrice = retInfo.data.originalPrice;
                addCailiao.price = retInfo.data.price;
                addCailiao.totlePrice = retInfo.data.price;
                addCailiao.discount = retInfo.data.discount || 0;
                console.log(addCailiao);
                if(localStorage.getItem('localInfo') == '' || localStorage.getItem('localInfo') == null){
                    tableMateLocal = [];
                }else{
                    tableMateLocal = JSON.parse(localStorage.getItem('localInfo'));
                }
                tableMateLocal.push(addCailiao)
                console.log(tableMateLocal)
                localStorage.setItem('localInfo',JSON.stringify(tableMateLocal)); //先存储 在放到tabledata 供全部使用tabledata[0]
                if(tabledata.length != 0){
                    tabledata.splice(0,1);
                    tabledata.push(JSON.parse(localStorage.getItem('localInfo')))
                }else{
                    tabledata.push(JSON.parse(localStorage.getItem('localInfo')))
                }

                tableRender(); //更新可修改的表单
                getmateTotlePrice(); //更新表原价格
            }
        },'请求失败', 'GET', undefined, undefined);
    }
   /* form.on('select(cailiaoName)', function(data){
        getTemplateProjectInfo(data.value);
        localStorage.setItem('localInfo',JSON.stringify(tabledata[0]));
    });*/
    table.on('edit(addMateTable)', function(obj){
        var value = obj.value //得到修改后的值
            ,data = obj.data //得到所在行所有键值
            ,field = obj.field; //得到字段
        console.log(value,data,field,this);
      /*  data.totlePrice =
            tabledata[0]*/
      if(field == 'quantity'){
          tabledata[0][data.LAY_TABLE_INDEX].totlePrice =  Number(value) * Number(data.price);
          tabledata[0][data.LAY_TABLE_INDEX].quantity =  Number(value);
      }else if(field == 'price'){
          //console.log(tabledata[0][data.LAY_TABLE_INDEX].price)
          /*if(((data.totlePrice/data.quantity - value) / (data.totlePrice/data.quantity)) * 100 > data.discount){  //折扣大于限定的，改回原来的价格,总价不变
              tabledata[0][data.LAY_TABLE_INDEX].price =  Number(data.totlePrice/data.quantity);
              this.value = Number(data.totlePrice/data.quantity);
              //tabledata[0][data.LAY_TABLE_INDEX].totlePrice =  Number(value) * Number(data.quantity);
              layer.msg('超出最低折扣率，请联系主管理员修改')
          }else{
              if(((data.totlePrice/data.quantity - value) / (data.totlePrice/data.quantity)) * 100 < 0){  //折扣小于限定的，且为负  改回原来的价格,总价不变
                  tabledata[0][data.LAY_TABLE_INDEX].price =  Number(data.totlePrice/data.quantity);
                  this.value = Number(data.totlePrice/data.quantity);
                  //tabledata[0][data.LAY_TABLE_INDEX].totlePrice =  Number(value) * Number(data.quantity);
                  layer.msg('不得超出最高折扣价')
              }else{
                  tabledata[0][data.LAY_TABLE_INDEX].price =  Number(value);
                  tabledata[0][data.LAY_TABLE_INDEX].totlePrice =  Number(value) * Number(data.quantity);
              }
          }*/
          if(((data.noChangePrice - value) / (data.noChangePrice)) * 100 > data.discount){  //折扣大于限定的，改回原来的价格,总价不变
              tabledata[0][data.LAY_TABLE_INDEX].price =  Number(data.noChangePrice);
              this.value = Number(data.noChangePrice);
              //tabledata[0][data.LAY_TABLE_INDEX].totlePrice =  Number(value) * Number(data.quantity);
              layer.msg('超出最低折扣率，请联系主管理员修改')
          }else{
              if(((data.noChangePrice - value) / (data.noChangePrice)) * 100 < 0){  //折扣小于限定的，且为负  改回原来的价格,总价不变
                  tabledata[0][data.LAY_TABLE_INDEX].price =  Number(data.noChangePrice);
                  this.value = Number(data.noChangePrice);
                  //tabledata[0][data.LAY_TABLE_INDEX].totlePrice =  Number(value) * Number(data.quantity);
                  layer.msg('不得超出最高折扣价')
              }else{
                  tabledata[0][data.LAY_TABLE_INDEX].price =  Number(value);
                  tabledata[0][data.LAY_TABLE_INDEX].totlePrice =  Number(value) * Number(data.quantity);
              }
          }
      }

        localStorage.setItem('localInfo',JSON.stringify(tabledata[0]));  //修改后要进行再次修改存储
        getmateTotlePrice(); //计算材料总和
        //console.log(tabledata[0][data.LAY_TABLE_INDEX])
    });
    //监听工具条
    table.on('tool(addMateTable)', function(obj){
        var dataIndex
        console.log(obj)
        console.log()
        var data = obj.data;
        if(obj.event === 'del'){
            /*setTimeout(function () {*/
                dataIndex = obj.tr[0].rowIndex;
         /*   },50);*/
            layer.confirm('确定删除？',{icon:3}, function(index){
                console.log(dataIndex)
                console.log(tabledata[0])
                tabledata[0].splice(dataIndex, 1)
                console.log(tabledata[0])
                localStorage.setItem('localInfo',JSON.stringify(tabledata[0])); //删除后要进行再次修改存储
                getmateTotlePrice(); //计算材料总和
                obj.del();
                layer.close(index);
            });
        }
    });
    function getTemplateProjectInfo(id,project) {
        console.log(id)
        var project = project;
        ajaxGetRetInfo(SERVER_ADDR + '/hospital/visit/hospitalProjectTemplate/getDetail.json',{id:id},function (retInfo) {
            console.log(retInfo)
            if(retInfo.success){
                addTable(retInfo.data);
                //加入提交表格
                retInfo.data.totlePrice = retInfo.data.quantity * retInfo.data.price;
                retInfo.data.disease = $('.combo-input').val() || retInfo.data.name;
                retInfo.data.placeOfOrigin = '无';
                retInfo.data.proNo = 1;
                retInfo.data.spec = retInfo.data.unit || '无';

                /*tableFirstPostdata = [];
                tableFirstPostdata.push(retInfo.data);
                if(tablePostdata.length == 0){
                    tablePostdata.unshift(tableFirstPostdata);
                    $('.news_content').empty().append(renderTableDate(tablePostdata[0],project))
                } else {
                    if($('tr[datatype="1"]').length == 0){ //判断长度==0 时直接加入
                        tablePostdata[0].unshift(tableFirstPostdata[0]);
                        $('.news_content').empty().append(renderTableDate(tablePostdata[0],project))
                    }else {
                        $('tr[datatype="1"]').remove();
                        tablePostdata[0].splice(0,1);
                        tablePostdata[0].unshift(tableFirstPostdata[0]);
                        $('.news_content').empty().prepend(renderTableDate(tablePostdata[0],project))
                    }
                }
                totalUserPrice();
                tableFirstPostdata = [];*/
            }else{
                layer.alert(retInfo.data,{icon:5})
            }
        },'请求失败', 'GET', undefined, undefined);
    }
	function addTable(retInfo) {
        //$(".newsName").val(retInfo.name);
        //$('.category').val(retInfo.category);
        $('.modelNo').val(retInfo.modelNo);
       // $('.spec').val(retInfo.spec);
        //$('.unit').val(retInfo.unit);
        $(".originalPrice").val(retInfo.originalPrice);
        $(".price").val(retInfo.price);
        $(".quantity").val(retInfo.quantity);
        $(".day").val(retInfo.day);
        special_addTag.init_appoint_result(retInfo.result,$(".addCensorItems"));
        form.render();
        $('.projectName').next('.layui-form-select').remove();
        $('.projectName').parent().next('.layui-form-select').remove();
        $('.combo-input').attr('placeholder','请选择或输入').attr('lay-verify','required');
    }
    console.log(tabledata[0])


 	var addNews = {};
 	form.on("submit(addTemplateProject)",function(data){
 	    if($('.fenToDoctor').val() == '' && $('.nurse').val() == '' ){
 	        layer.msg('请选择治疗医生或护士');
 	        return false;
        }
        treeOpen();
 		return false;
 	})
    form.on("submit(addProjectPost)",function(data){
        if(tablePostdata[0]  == undefined || tablePostdata[0].length == 0){
            layer.msg('请添加项目');
            return false
        }
        var postData = {};
        postData.visitRecordId = getQueryString('valueid');
        postData.diseases = $('.combo-input').val();
        //postData.projectName = $(".newsName").val();
        postData.doctorId = $('.fenToDoctor').val();
        postData.nurseId = $('.nurse').val();
        //postData.price = $(".price").val();
        //postData.subsist = $('.subsist').val();
        postData.day = $(".day").val();
        postData.result = getMubanResult($(".appoint_result"));
        postData.type = $('.fenToDoctor').find("option:selected").attr('title');
        postData.remarks = $('.remarks').val();
        tablePostdata[0].forEach(function (value,index) {
            //var src = value.src;
            console.log(value,index)
            if(value.type == '医疗类'){
                postData['projectMaterials[' + index + '].type'] = 'cure';
            }else if(value.type == '材料类'){
                postData['projectMaterials[' + index + '].type'] = 'materialScience';
            }else if(value.type == '药品类'){
                postData['projectMaterials[' + index + '].type'] = 'drugs';
            }else if(value.type == '检查类'){
                postData['projectMaterials[' + index + '].type'] = 'check';
            }else if(value.type == '保健类'){
                postData['projectMaterials[' + index + '].type'] = 'health';
            }
            if(value.medicalInsurance == '是'){
                postData['projectMaterials[' + index + '].medicalInsurance'] = true;
            }else if(value.medicalInsurance == '否'){
                postData['projectMaterials[' + index + '].medicalInsurance'] = false;
            }
            //postData['projectMaterials[' + index + '].disease'] = value.disease;
            postData['projectMaterials[' + index + '].placeOfOrigin'] = value.placeOfOrigin;
            postData['projectMaterials[' + index + '].modelNo'] = value.modelNo;
            postData['projectMaterials[' + index + '].spec'] = value.spec;
            postData['projectMaterials[' + index + '].quantity'] = value.quantity;
            postData['projectMaterials[' + index + '].originalPrice'] = value.originalPrice;
            postData['projectMaterials[' + index + '].price'] = value.price;
        })
        postData['diagnoses[0].chiefComplaint'] = $('.maintell').val();
        postData['diagnoses[0].presentMedicalHistory'] = $('.nowIll').val();
        postData['diagnoses[0].preliminaryDiagnosis'] = $('.firstDiagnosis').val();
        postData['diagnoses[0].treatmentAdvice'] = $('.treatmentAdvice').val();
        $('.photoDiv').each(function(){
            var bigIndex = $(this).index();
            if($(this).find('.tutorshipCheck').val() != ''){
                postData['diagnoses[0].supplementaryExaminations[' + bigIndex + '].content'] = $(this).find('.tutorshipCheck').val();
            }
            $(this).find('.initImg').each(function(){ //
                var smallIndex = $(this).index();
                postData['diagnoses[0].supplementaryExaminations[' + bigIndex + '].images[' + smallIndex + ']'] = $(this).find('.photoImg').attr('src');
            });
        })
        var url = SERVER_ADDR + "/hospital/doctor/index/addProject";
       // var index = layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        console.log(postData)
        ajaxGetRetInfo(url,postData,function (retInfo) {
            console.log(retInfo)
         //   layer.close(index);
            if(retInfo.success){
                layer.msg('提交成功');
                setTimeout(function () {
                    parent.window.location.reload();
                },1000)
            }else{
                layer.alert(retInfo.data,{icon:5})
            }
            //form.render('select', 'from');//更新
        },'请求失败', 'POST', undefined, undefined);
        //弹出loading
        return false;
    })
});
/*
*   更新可修改的表单
* */
function tableRender() {
    layui.table.render({
        elem: '#addMateTable'
        ,cols: [[ //标题栏
            {field: 'modelNo', title: '品名',  width: 170},
            {field: 'type', title: '类型',  width: 82}
            ,{field: 'placeOfOrigin', title: '产地', width: 100}
            ,{field: 'spec', title: '单位', width: 90}
            ,{field: 'originalPrice', title: '原价', width: 90}
            ,{field: 'price', title: '折后价', width: 90,style:'background-color: #fff;border:0.1px dashed red;    border-right: 1px solid #e2e2e2;',edit: 'text'}
            ,{field: 'quantity', title: '数量', width: 80,style:'background-color: #fff;border:0.1px dashed red;    border-right: 1px solid #e2e2e2;',edit: 'text'}
            ,{field: 'medicalInsurance', title: '医保',  width: 82}
            ,{field: 'delMateTable', title: '操作', width: 90,toolbar: '#delMateTable'}
            //,{field: 'receiveName', title: '指定医生', width: 100,edit: 'text'}
            //,{field: 'experience', title: '项目咨询', width: 100,edit: 'text'}
        ]]
        ,data: tabledata[0]
        //,skin: 'line' //表格风格
        ,even: true
        //,page: true //是否显示分页
        //,limits: [5, 7, 10]
        //,limit: 5 //每页默认显示的数量
    });
    layui.form.render();
    $('.projectName').next('.layui-form-select').remove();
    $('.projectName').parent().next('.layui-form-select').remove();
    $('.combo-input').attr('placeholder','请选择或输入').attr('lay-verify','required');
}
/*
*   计算选择品名的价格
*   retuen :  价格
* */
function getmateTotlePrice() {
    var mateTotlePrice = 0;
    if(tabledata.length != 0){
        tabledata[0].forEach(function (value) {
            console.log(value.quantity)
            mateTotlePrice = mateTotlePrice +  Number(value.quantity) * Number(value.price);
            console.log(mateTotlePrice)
        });
        $('.addMatePrice').text(mateTotlePrice)
    }else{
        $('.addMatePrice').text(0)
    }
}
/*
*   计算总价应付金额的价格
*   retuen :  价格
* */
function totalUserPrice() {
    var totalUserPrice = 0;
    $('.totlePrice').each(function () {
        console.log($(this).text())
        totalUserPrice = totalUserPrice + Number($(this).text());
    });
    $('.totalUserPrice').text(totalUserPrice);
    $('.shouldUserPrice').text(totalUserPrice - Number($('.factPrice').text()));
}
function treeOpen(obj) {
    if($(".fenToDoctor").find("option:selected").attr('title') == 'check'){  //如果是医疗类的
        getModelNo(form,$(".fenToDoctor").find("option:selected").attr('title'));
    }else{
        getModelNo(form,undefined);
    }
    $('.thatTimeChoose').css('background-color','white').css('color','#222').css('border','1px solid #e7e7e7').removeClass('sureTime');
    $('.model').css('background-color','#009688').css('color','white').addClass('sureTime');
    console.log(tabledata[0])
   /* tableRender();
    getmateTotlePrice();*/
    firstGetAll();
     var index = layui.layer.open({
        title : "选择项目",
        type : 1,
        area:['890px','93%'],
        content : $('.treeOpen'),
        success : function(layero, index){
           // layui.layer.close(index);
            $('.layui-layer-shade').remove();
            $('.sureCailiao').click(function () {
                console.log(55)
                layui.layer.close(index);
                if(localStorage.getItem('localInfo') == '' || localStorage.getItem('localInfo') == null){

                }else {
                    if(tablePostdata.length == 0){
                        tablePostdata.push(JSON.parse(localStorage.getItem('localInfo')))
                    }else{
                        for(var i = 0 ; i < JSON.parse(localStorage.getItem('localInfo')).length; i++){
                            tablePostdata[0].push(JSON.parse(localStorage.getItem('localInfo'))[i]);
                        }
                    }
                }
                $('.news_content').empty().append(renderTableDate(tablePostdata[0]))
                totalUserPrice();
                localStorage.setItem('localInfo',''); //确定选完材料后清空
                tabledata = [];
            })
        }
    })
}

function renderTableDate(data,project){
    var dataHtml = '';
    var project = project;
    console.log(data)
    if(data!=undefined){
        if(data.length != 0){
            //var totalUserPrice = 0;
            for(var i=0;i<data.length;i++){

                dataHtml += '<tr dataType="'+data[i].proNo+'">'
                    +'<td>'+noData(data[i].modelNo)+'</td>'
                    +'<td>'+noData(data[i].type)+'</td>'
                    +'<td>'+noData(data[i].placeOfOrigin)+'</td>'
                    +'<td>'+noData(data[i].spec)+'</td>'
                    +'<td>'+noData(data[i].quantity)+'</td>'
                    +'<td>'+noData(data[i].originalPrice)+'</td>'
                    +'<td>'+noData(data[i].price)+'</td>'
                    +'<td>'+noData(data[i].medicalInsurance)+'</td>'
                    +'<td class="totlePrice">'+noData(data[i].totlePrice)+'</td>'

                        dataHtml +=  '<td><a style=" height: 26px; line-height: 26px; padding: 0 8px;" class="layui-btn layui-btn-danger layui-btn-xs" delvalue="'+i+'" onclick="delPostData(this)">删除</a></td>'

                dataHtml += '</tr>'
                //totalUserPrice = totalUserPrice + data[i].totlePrice;
            }
        }else{
            //dataHtml = '<tr><td colspan="9">暂无数据</td></tr>';
        }
        return dataHtml;
    }
}
function delPostData(obj) {
    var indexlayer = layer.confirm('确认删除？', {
        btn: ['删除','取消'], //按钮
        icon:3
    }, function(){
        $(obj).parent().parent().remove()
        var index = Number($(obj).attr('delvalue'))

        tablePostdata[0].splice(index,1);
        $('.news_content').empty().append(renderTableDate(tablePostdata[0]))
        totalUserPrice();
        layer.close(indexlayer);
    }, function(){

    });
}
function addDiagnosesMuban(obj) {
    //var indexOpen = top.layer.msg('',{icon: 16,time:false,shade:0.8});
    var index = parent.layui.layer.open({
        area: ['550px','450px'],
        title : "新增病历模板",
        type : 2,
        content : "addPatientTemplateOpen.html?maintell=" +$('.maintell').val() + "&nowIll=" +$('.nowIll').val()+ "&tutorshipCheck=" +$('.tutorshipCheck').val()+ "&treatmentAdvice=" +$('.treatmentAdvice').val() +'&v=1134',
        success : function(layero, index){
            //localStorage.setItem('allconsultPage',$('.layui-laypage-curr em').eq(1).text());
        }
    })
};
var photos = {
    num:1,
    //增约定效果
    addResult:function(m){
        this.num++;
        /* var html = '<div class="layui-inline"> ' +
             '<label class="layui-form-label"></label> ' +
             '<div class="layui-input-inline"> ' +
             '<input type="text" value="" placeholder="检查项目" class="layui-input search_input appoint_result appoint_result_name"> ' +
             '</div> ' +
             '</div> ' +
             '<input type="button" class="layui-btn layui-btn-danger" onclick="special_addTag.delResult(this)" value="删除"/>' ;*/
        var html = '<div class="layui-inline photoDiv" style="width: 30.5%;"> ' +
            '<input type="text" name="" placeholder="您可以输入辅助检查" autocomplete="off" class="layui-input tutorshipCheck" style="display: inline-block;margin-right: 15px;"> ' +
            '<input type="button" class="layui-btn layui-btn-danger" onclick="special_addTag.delResult(this)" value="X" style="font-weight: 600;font-size: 12px;padding: 0 6px;height: 19px;line-height: 20px;position: absolute;top: 10px;right: 6px;">'+
            '<div class="imgList imgList'+this.num+'"></div> ' +
            '<div class="layui-upload-drag projectImg'+ this.num+'"> ' +
            '<i class="layui-icon"></i> ' +
            '<p>点击上传，或将文件拖拽到此处</p> ' +
            '</div><input class="layui-upload-file" type="file" name="file"> ' +
            '</div>';
        $(m).before(html);
        var nuym = this.num;
        upload.render({
            elem: '.projectImg'+ nuym,
            url: SERVER_ADDR + '/common/file/upload',
            done: function(res){
                console.log(res)
                init_img_phpto(res.data,nuym);//初始化上传图片   有问题 TODO
            }
        });
    },
    //减约定效果
    delResult:function(m){
        $(m).parent().remove();
    },
    //初始化约定效果
    init_appoint_result:function(m,tag){
        m = m.split('|');
        if(!m[0]){
            return false;
        }

        var html = "";
        //	m=["aa","bb"];
        for(var i=0;i<m.length;i++){
            if(i==0){
                html=html+'<label class="layui-form-label">约定效果</label><div class="layui-input-block"> ' +
                    '<input type="text" name="identity" lay-verify="required" placeholder="" autocomplete="off" value="'+m[0]+'" class="layui-input appoint_result" style="width: 75%;display: inline-block;margin-right: 15px;    margin-bottom: 10px;"> ' +
                    '<button style="padding: 0 8px;height: 34px;line-height: 34px" class="layui-btn layui-btn-sm" onclick="special_addTag.addResult(this);return false"> ' +
                    '<i class="layui-icon">&#xe654;</i> ' +
                    '</button>'+
                    '</div>';
            }
            if(i>0){
                html=html+'<div class="layui-input-block">' +
                    '<input type="text" name="identity" lay-verify="required" placeholder="" value="'+m[i]+'" autocomplete="off" class="layui-input appoint_result"  style="width: 75%;display: inline-block;margin-right: 15px;    margin-bottom: 10px;">' +
                    '<input type="button" class="layui-btn layui-btn-danger" onclick="special_addTag.delResult(this)" value="一" style="font-weight: 600;font-size: 17px;padding: 0 10px;height: 34px;line-height: 34px"/></div>';
            }
        }
        $(tag).html(html);
    },
    //获取列表的值
    getResult:function(){
        var arrResult = [];
        $(".appoint_result").each(function (index,value) {
            console.log("进来了");
            var arrChild = {};
            if($(this).hasClass("appoint_result_name")){
                console.log("name进来了");
                arrChild.name = $(this).val();
            }
            if($(this).hasClass("appoint_result_detail")){
                arrChild.description = $(this).val();
            }
            arrResult.push(arrChild);
            console.log(arrResult);
        });

        return arrResult;
    }
}
var special_addTag = {
    num:1,
    //增约定效果
    addResult:function(m){
        this.num++;
       /* var html = '<div class="layui-inline"> ' +
            '<label class="layui-form-label"></label> ' +
            '<div class="layui-input-inline"> ' +
            '<input type="text" value="" placeholder="检查项目" class="layui-input search_input appoint_result appoint_result_name"> ' +
            '</div> ' +
            '</div> ' +
            '<input type="button" class="layui-btn layui-btn-danger" onclick="special_addTag.delResult(this)" value="删除"/>' ;*/
       var html = '<div class="layui-input-block">' +
           '<input type="text" name="identity" lay-verify="required" placeholder="" autocomplete="off" class="layui-input appoint_result"  style="width: 75%;display: inline-block;margin-right: 15px;    margin-bottom: 10px;">' +
           '<input type="button" class="layui-btn layui-btn-danger" onclick="special_addTag.delResult(this)" value="一" style="font-weight: 600;font-size: 17px;padding: 0 10px;height: 34px;line-height: 34px"/></div>';
        $('.addCensorItems').append(html);
    },
    //减约定效果
    delResult:function(m){
        this.num--;
        $(m).parent().remove();
    },
    //初始化约定效果
    init_appoint_result:function(m,tag){
        m = m.split('|');
        if(!m[0]){
            return false;
        }

        var html = "";
        //	m=["aa","bb"];
        for(var i=0;i<m.length;i++){
            if(i==0){
                html=html+'<label class="layui-form-label">约定效果</label><div class="layui-input-block"> ' +
                    '<input type="text" name="identity" lay-verify="required" placeholder="" autocomplete="off" value="'+m[0]+'" class="layui-input appoint_result" style="width: 75%;display: inline-block;margin-right: 15px;    margin-bottom: 10px;"> ' +
                    '<button style="padding: 0 8px;height: 34px;line-height: 34px" class="layui-btn layui-btn-sm" onclick="special_addTag.addResult(this);return false"> ' +
                    '<i class="layui-icon">&#xe654;</i> ' +
                    '</button>'+
                    '</div>';
            }
            if(i>0){
                html=html+'<div class="layui-input-block">' +
                    '<input type="text" name="identity" lay-verify="required" placeholder="" value="'+m[i]+'" autocomplete="off" class="layui-input appoint_result"  style="width: 75%;display: inline-block;margin-right: 15px;    margin-bottom: 10px;">' +
                    '<input type="button" class="layui-btn layui-btn-danger" onclick="special_addTag.delResult(this)" value="一" style="font-weight: 600;font-size: 17px;padding: 0 10px;height: 34px;line-height: 34px"/></div>';
            }
        }
        $(tag).html(html);
    },
    //获取列表的值
    getResult:function(){
        var arrResult = [];
        $(".appoint_result").each(function (index,value) {
            console.log("进来了");
            var arrChild = {};
            if($(this).hasClass("appoint_result_name")){
                console.log("name进来了");
                arrChild.name = $(this).val();
            }
            if($(this).hasClass("appoint_result_detail")){
                arrChild.description = $(this).val();
            }
            arrResult.push(arrChild);
            console.log(arrResult);
        });

        return arrResult;
    }
}
function csxbtn() {
    $(".cailiaoName").next("div").addClass("layui-form-selected");
}
function firstGetAll() {
    if(localStorage.getItem('localInfo') == '' || localStorage.getItem('localInfo') == null){
        tableMateLocal = [];
    }else{
        tableMateLocal = JSON.parse(localStorage.getItem('localInfo'));
    }
    //tableMateLocal.push(addCailiao)
    console.log(tableMateLocal)
    localStorage.setItem('localInfo',JSON.stringify(tableMateLocal)); //先存储 在放到tabledata 供全部使用tabledata[0]
    if(tabledata.length != 0){
        tabledata.splice(0,1);
        tabledata.push(JSON.parse(localStorage.getItem('localInfo')))
    }else{
        tabledata.push(JSON.parse(localStorage.getItem('localInfo')))
    }

    tableRender(); //更新可修改的表单
    getmateTotlePrice(); //更新表原价格
}