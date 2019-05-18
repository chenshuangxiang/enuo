function init() {
    parentGet.toGet();
    imgPost.toGet();
  /*  $("input:file").localResizeIMG({
        width: 300,
        quality: 0.8,
        success: function (result) {
            var img = new Image();
            img.src = result.base64;
            console.log(img.src);
            console.log(result.clearBase64);
            //$("body").append(img);
            /!*$("#imgInput").empty();*!/
            $("#imgInput").append(img); //呈现图像(拍照結果)
            /!*    $("#result").find('img').attr(img)*!/
            imgPost.toGet(result.clearBase64)
        }
    });*/
}
//获取一级科室
var parentGet = {
    toGet:function () {
        var url = 'http://127.0.0.1/admin/subject/getList.json'; //'http://www.yinliuta.com/activity/checkWxAccount';
        var Data = '';
        ajaxGetRetInfo(url,Data,this.checkSuccess,'请求失败', 'GET', undefined, undefined);
    },
    checkSuccess:function (retInfo) {
        console.log(retInfo)
        console.log(value)
        retInfo.data.forEach(function (value) {
            $('#section').append('<option opId="'+value.id+'">'+value.name+'</option>')
        })
        $('#section').change(function () {
            getchild.toGet()
        })

    }
}
//获取二级科室
var getchild = {
    toGet:function () {
        var url = 'http://127.0.0.1/admin/subSubject/getChildren.json';
        var data = {};
        data.subjectId  = $('#section').find('option:selected').attr('opId');
        var Data = JSON.stringify(data);
        ajaxGetRetInfo(url,data,this.checkchildSuccess,'请求失败', 'GET', undefined, undefined);
    },
    checkchildSuccess:function (retInfo) {
        console.log(retInfo)
        $('#sub-section').empty();
        retInfo.data.forEach(function (value) {
            console.log(value)
            $('#sub-section').append('<option opId="'+value.id+'">'+value.name+'</option>')
        })

    }

}
var addYue = {
    add:function (obj) {
        console.log($(obj))
        var kwCount = $(obj).parent().parent('#result-box').find('.add_xiaoguo').length;
        console.log(kwCount)
        $(obj).parent().parent('#result-box').append('<div class="add_xiaoguo">\n' +
            '<span>'+Number(Number(kwCount) + 1)+'</span>\n' +
            '<input class="addyuedingInput" type="text" placeholder="请填写约定效果">\n' +
            '<span class="input-add" id="result" onclick="addYue.close(this)">[&nbsp;-&nbsp;]</span></div>')
    },
    close:function (obj) {
        $(obj).parent().remove()
    }
}
var addLiang = {
    add:function (obj) {
        console.log($(obj))
        var kwCount = $(obj).parent().parent('#forgive-box').find('.add_yueding').length;
        $(obj).parent().parent('#forgive-box').append('<div class="add_yueding">\n' +
            '<span>'+Number(Number(kwCount) + 1)+'</span>\n' +
            '<input class="addliangjieInput" type="text" placeholder="请填写谅解部分">\n' +
            '<span class="input-add" id="result" onclick="addLiang.close(this)">[&nbsp;-&nbsp;]</span></div>')

    },
    close:function (obj) {
        $(obj).parent().remove()
    }
}

//提交图片
var imgPost = {
    /*toGet:function (imgBase) {
        var url = 'http://127.0.0.1/common/file/upload';
        var data = {};
        data.file  = imgBase;
        ajaxGetRetInfo(url,data,this.checkimgSuccess,'请求失败', 'GET', undefined, undefined);
    },*/
    toGet:function () {
        var url = 'js/img.json';
        var data = '';
        ajaxGetRetInfo(url,data,this.checkimgSuccess,'请求失败', 'GET', undefined, undefined);
    },
    checkimgSuccess:function (retInfo) {
        console.log(retInfo)
        retInfo.data.forEach(function (value) {
            console.log(value)
            $('#imgInput').append('<img class="postImg" src="'+value.src+'">')
        })
    },
   /* getImgPost:function () {
        $.ajax({
            type: "POST",
            url: 'http://127.0.0.1/common/file/upload', // 先请求数据 看下my json 里面的 version 是一个数组, name 是一个对象
            success: function (data) {
                var dataOne = JSON.parse(data);
            }
        });
    },*/
  /*  getImg:function (e) {
        var file = e.target.files[0] || e.dataTransfer.files[0];
       // $('#photoCover').val(document.getElementById("file").files[0].name);
        console.log(file)
        /!*  if (file) {
              var reader = new FileReader();
              reader.onload = function () {
                  $("img").attr("src", this.result);
              }
      }*!/
    }*/
}


//提交
var lastPost = {
    toGet:function () {
        var url = 'http://127.0.0.1/admin/diseaseTemplate/add';
        var data = this.getData();
        /*data.subjectId  = $('#section').find('option:selected').attr('opId');
        var Data = JSON.stringify(data);*/
        ajaxGetRetInfo(url,data,this.checkchildSuccess,'请求失败', 'POST', undefined, undefined);
    },
    checkchildSuccess:function (retInfo) {
        console.log(retInfo)
        $('#sub-section').empty();
        retInfo.data.forEach(function (value) {
            console.log(value)
            $('#sub-section').append('<option opId="'+value.id+'">'+value.name+'</option>')
        })
    },
    getData:function () {
        var data = new Object();
        data.subjectId = $('#section').find('option:selected').attr('opId');
        data.subSubjectId = $('#sub-section').find('option:selected').attr('opId');
        data.name = $('#name').val();
        data.minPrice = $('#minPrice').val();
        data.maxPrice = $('#maxPrice').val();
        data.minDay = $('#minDay').val();
        data.maxDay = $('#maxDay').val();
        data.keyword = $('#keyword').val();
        data.type = $('#type').val();
        data.treatmentMethod = $('#treatmentMethod ').val();
        data.diagnosis = $('#diagnosis').val();
        data.mainStatement = $('#mainStatement').val();
        data.currentDiseaseHistory = $('#currentDiseaseHistory').val();
        data.physiqueCheck = $('#physiqueCheck').val();
        data.laboratoryCheck = $('#laboratoryCheck').val();
        data.auxiliaryCheck = $('#auxiliaryCheck').val();
        var images = $('.postImg').length;
        //data.images[0] = $('#postImg').attr('src');

        $('.postImg').each(function (index,value) {
            var src = value.src;
            console.log(src)
          /*  data.images[0] = src;*/
            data['images[' + index + ']'] = src
        })
        $('.addyuedingInput').each(function (index,value) {
            console.log(index,value)
            data['treatmentEffectAgreementResult[' + index + ']'] = value.value
            //data['treatmentEffectAgreementResult['+index+']'] = value.value;
        })
        $('.addliangjieInput').each(function (index,value) {
            console.log(index,value)
            data['treatmentEffectUnderstanding[' + index + ']'] = value.value
            //data['treatmentEffectUnderstanding['+index+']'] = value.value;
        })
        console.log(data)
        /*var AgreementResultCount = $('.addyuedingInput').length;
        var UnderstandingCount = $('.addliangjieInput').length;

        data.treatmentEffectAgreementResult[AgreementResultCount] = '';
        data.treatmentEffectUnderstanding[UnderstandingCount] = '';*/
        return data
    }

}
/**
 * 返回结果为 RetInfo 结构，
 */
function ajaxGetRetInfo(url, data, onSuccess, onFailure, type, showLoad, params) {
    'use strict';
    var ajaxOnSuccess = function (retInfo) {
        onSucessCpmRetInfo(retInfo, onSuccess);
    };
    alert('ajaxGetRetInfo')
    ajaxGetJson(url, data, ajaxOnSuccess, onFailure, type, showLoad, params);
}
function ajaxGetJson(url, data, onSuccess, onFailure, type, showLoad, params) {
    'use strict';
    var onComplete;
    if (showLoad) {
        onComplete = function () {
            //请求中的操作
            // 正在请求中

        };
    }
    alert('ajaxGetJson')
    var ajaxParam =
        {
            url: url,
            type: type || 'post',
            data: data,
            // 设置返回类型为 json，jquey 自动解析中文乱码，
            // 和服务器配置有关
            //dataType : 'json',
            timeout: 15000,
            error: onFailure || function () {
                alert('请求失败')
            },
            // 带上 cookie
            xhrFields: {
                withCredentials: true
            },
            success: function (dataStr) {
                alert('success')
                onSuccess(dataStr);
            },
            complete: onComplete,
        };

    for (var prop in params) {
        ajaxParam[prop] = params[prop];
    }

    $.ajax(ajaxParam);
}
function onSucessCpmRetInfo(retInfo, onSuccess) {
    'use strict';
    var succZhi = 0;
    var retCode = retInfo.success;
    if (retCode === true) {
        onSuccess(retInfo);
    }else {
        var comList = ['demo'];  //如果是这些页面，则回调success
        comList.forEach(function (t) {
            if(window.location.href.indexOf(t) != -1){
                onSuccess(retInfo);
                succZhi = 1;
            }
        }) q qwe
        if(succZhi  !== 1){



           alert('请求结果出错')
        }

    }
}