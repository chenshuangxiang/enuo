var pageNumber = 1;
var total = 5;
function init() {
    if(getQueryString('id') != null){
        To.getPatientReport();
        $('title,.head_title').text('体检报告');
        $('.postBingli,.addPhontBtn,.warnPhoto').hide();
    }
    $('#file').on('change', function() {
        var files = this.files;
        sub(files[0])
    })
}
function sub(file) {
    var formData = new FormData();
    formData.append("multipartFile", file);
    console.log(file)
    if(file == undefined){
        return
    }
    $.ajax({
        url: SERVER_ADDR + "/common/upload/img",
        type: "POST",
        data: formData,
        dataType : 'json',
        cache: false,
        processData: false,
        contentType: false,
        success: function(data) {
            console.log(data)
            if (data.success == true) {
                $('.addPhontBtn').before('<p class="postImgP"><img class="closePhoto" onclick="To.closephoto(this)" src="/app/img/closePhoto.png"><img class="postImg" valueid="'+data.data.imgId+'" src="'+data.data.imgUrl+'"></p>')
                $('input[type="file"]').val('');
            } else {
                alert(data.data)
            }
        }
    });
}
var To = {
    closephoto:function (obj) {
        $(obj).parent().remove();
    },
    getPatientReport:function () {  //初始化体检报告
        var url = SERVER_ADDR + '/app/user/communityPatientReport/one/'+getQueryString('id');
        var Data = '';
        ajaxGetRetInfo(url, Data, this.getPatientReportSuccess, '请求失败', 'GET', true, undefined);
    },
    getPatientReportSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
            $('.hosName').val(retInfo.data.medicalInstitution);
            $('textarea').val(retInfo.data.content);
            $('#bornDate').val(new Date(retInfo.data.recordTime).Format('yyyy-MM-dd'));
            retInfo.data.imgs.forEach(function (value) {
                $('.addPhontBtn').before('<p class="postImgP">' +
                    '<img class="postImg"  src="' + value.imgUrl + '">' +
                    '</p>')
            });

            //alert('添加成功');
            //window.location.reload();
        }else{
            alert(retInfo.data)
        }
    },
    addPatientReport:function () {  //加入体检报告
        var url = SERVER_ADDR + '/app/user/communityPatientReport/patientReport';
        var Data = {};
        Data.type = 'medical_examination_report';
        Data.medicalInstitution = $('.hosName').val();
        Data.recordTime = $('#bornDate').val() + ' 00:00:00';
        Data.content = $('textarea').val();
        var imgIds = [];
        $('.postImg').each(function () {
           imgIds.push($(this).attr('valueid'));
        });
        Data.imgIds = imgIds.join(',');
        ajaxGetRetInfo(url, Data, this.addPatientReportSuccess, '请求失败', 'POST', true, undefined);
    },
    addPatientReportSuccess:function (retInfo) {
        console.log(retInfo)
        if(retInfo.success == true){
           alert('添加成功');
           window.location.reload();
        }else{
            alert(retInfo.data)
        }
    }
}