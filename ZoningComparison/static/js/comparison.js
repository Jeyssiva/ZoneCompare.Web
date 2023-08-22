var zoningstatusoverall = [];
var currentpageid = '';
var exceptionstatus = ''

$(document).ready(function(){
    
    $('#btnsearch').click(function() {
        getcandidatescriptids()
    });
    
    $("input[name=searchcre]").change(function() {
        enablesearchcriteria();
    });

    $("#drpseries").change(function(){
        loadcomponent();
    });
    
    $("#drpcomp").change(function(){
        loadquestionpaper();
    });

    $("#btnsubmit").click(function(){
    
    var results_data = []
    $.each($("input[name='hidexception']"), function(){            
        qpid = $('#qpid').val()
        csid = $('#lblcsid').text()
        docpageid = $(this).attr("id").split('_')[1]
        values = $(this).attr("value").split('$')
        iscorrect = values[0]
        exceptionid = values[1]
        comments = values[2]

        results_data.push([qpid,csid,docpageid,iscorrect,exceptionid,comments])
    });

    $.ajax({
        url:"/api/exceptionsavebulk/",
		crossDomain: true,
        type: 'GET',
        dataType: 'JSON',
        data : {
            results : JSON.stringify(results_data)
        },
        async: true,
        beforeSend:function(){
            $("#spinner").dialog('open');
            window.scrollTo(0,0)
        },
        success: function(data) {
            if(data == 'success'){
                // After saved successfully, move to the next script.
                getunprocessedcsid(false, false) 
            }
        },
        error: function(error) {
            alert(error)
        },
        complete: function(data){
            //$("#spinner").dialog('close');
            window.scrollTo(0,0)
        }        
    })
    })

    $("#btnok").click(function(){      
       var exceptionvalue =  $('#drpexcep option:selected').val()
       var commentbox = $.trim($('#txtareacomment').val())
        
       var hid_exception = 'he_' + currentpageid
       var imgexcpicon = 'imgeicon_' + currentpageid

       if (exceptionvalue != -1 && ($("#cmdstar").hasClass('whitecolor') || ($("#cmdstar").hasClass('redcolor') && commentbox != ''))){
            $("#" + hid_exception).val(0 + "$" + exceptionvalue + "$" + commentbox)
       }else{
            alert ('Please fill required fields')
            //$('#sprequired').removeClass('whitecolor').addClass('redcolor')
            //$("#cmdrequired").removeClass('whitecolor').addClass('redcolor')            
            //$('#sprequired').css('display', 'block');
            return
       }
       
       currentpageid = ''
       $("#exceptionstatus").dialog('close')
       $("#" + imgexcpicon).css('display', 'block');
    })

    $("#btncancel").click(function(){  
        var hid_exception = 'he_' + currentpageid
        var imgexcpicon = 'imgeicon_' + currentpageid
        var chkaccuracy = 'chk_' + currentpageid
        $("#" + hid_exception).val(1);
        $("#" + imgexcpicon).css('display', 'none');
        $("#" + chkaccuracy).prop('checked',true)
        $('#exceptionstatus').dialog('close');
    });

    $("#drpexcep").change(function(){
        var exceptionvalue =  $('#drpexcep option:selected').val()
        var iscmtmandatory = exceptionstatus.filter(function(v,i,a){return v[0] == exceptionvalue})[0][2]
        if(iscmtmandatory == true){
           $("#cmdstar").removeClass('whitecolor').addClass('redcolor')
        } else {
            $("#cmdstar").removeClass('redcolor').addClass('whitecolor')
        }
    })

    enablesearchcriteria();
    loadseries();
    loadexceptionstatus();
});

$("#btnprevious").click(function(){
    getunprocessedcsid(true,false);
});

$("#btnskip").click(function(){
    if (confirm('All actions made against this response will be lost. Do you want to proceed?')){
        getunprocessedcsid(false,true)
    }
});

$(function (){   
    $("#exceptionstatus").dialog({
        modal: true,
        autoOpen: false,
        title: "Exception Status",
        beforeclose: false,
        dialogClass :"excepstatus-dialog",
        width:280,
        height:300,
        maxWidth:280,
        maxHeight:300,
    });

    $("#spinner").dialog({
        modal: true,
        autoOpen: false,
        beforeclose: false,
        dialogClass:"no-titlebar",
        width:80,
        height:100,
        maxWidth:80,
        maxHeight: 100,
        position: {
            my: "center",
            at: "center",
            of: window,
            collision: "none"
        },
        create: function (event, ui) {
            $(event.target).parent().css('position', 'fixed');
        }
    });
});

function enablesearchcriteria(){
    var selectedradio = $('input[name="searchcre"]:checked')[0].id;
    if (selectedradio == "rdobulk")
    {
        enableordisablesearch(false,true);
        $('#btnskip').css('display', 'block')
    }
    else
    {
        enableordisablesearch(true,false);
        $('#btnskip').css('display', 'none')
    }
}

function enableordisablesearch(enable,disable){
    $("#drpseries").prop("disabled",enable);
    $("#drpcomp").prop("disabled",enable);
    $("#drppaper").prop("disabled",enable);
    $("#txtcsid").prop("disabled",disable);
}

function loadseries(){
    $.ajax({
        url:"/api/series/",
		crossDomain: true,
        type: 'GET',
        dataType: 'JSON',
        async: true,
        success: function(data) {            
            $.each(data, function (key, value) {    
                $("#drpseries").append($("<option></option>").val(value[0]).html(value[1]));
            });
        },
        error: function(error) {
            print(error)
        }
    });
}

function loadexceptionstatus(){
    $.ajax({
        url:"/api/exceptionstatus/",
		crossDomain: true,
        type: 'GET',
        dataType: 'JSON',
        async: true,
        success: function(data) {            
            exceptionstatus = data
            //$("#drpexcep").append('<option value=-1>Select Exception</option>')
            $.each(data, function (key, value) {    
                $("#drpexcep").append($("<option></option>").val(value[0]).html(value[1]));
            });
        },
        error: function(error) {
            print(error)
        }
    })
}

function loadcomponent(){
    $.ajax({
        url:"/api/component/",
		crossDomain: true,
        type: 'GET',
        dataType: 'JSON',
        data : {
            sessionid : $('#drpseries option:selected').val()
        },
        async: true,
        beforeSend:function(){
            $("#drpcomp").empty();
        },
        success: function(data) {
            $("#drpcomp").append('<option value=-1>Select Component</option>')
            $.each(data, function (key, value) {    
                $("#drpcomp").append($("<option></option>").val(value[0]).html(value[1]));
            });
        },
        error: function(error) {
            alert(error)
        }
    })
}

function loadquestionpaper(){
    $.ajax({
        url:"/api/questionpaper/",
		crossDomain: true,
        type: 'GET',
        dataType: 'JSON',
        data : {
            esid : $('#drpcomp option:selected').val()
        },
        async: true,
        beforeSend:function(){
            $("#drppaper").empty();
        },
        success: function(data) {
            $("#drppaper").append('<option value=-1>Select Paper</option>')
            $.each(data, function (key, value) {    
                $("#drppaper").append($("<option></option>").val(value[0]).html(value[1]));
            });
        },
        error: function(error) {
            alert(error)
        }
    })
}
    
function getcandidatescriptids(){
    // $('div.zonewrapper').animate({scrollLeft:(0)},0);
    if (($('input[name="searchcre"]:checked')[0].id == "rdobulk" && $('#drppaper option:selected').val() == -1)
        ||($('input[name="searchcre"]:checked')[0].id == "rdosearchid" && $('#txtcsid').val() == '')){
        alert('Please fill search criteria')
    }
    else{
        getunprocessedcsid(false,false);
    }
}   

function getunprocessedcsid(isprev,isnext){
    var selectedradio = $('input[name="searchcre"]:checked')[0].id;
    if (selectedradio == "rdobulk")
    {
        esessid = $('#drpcomp option:selected').val()
        quespapid = $('#drppaper option:selected').val()
        csid1 = -1
    }else{
        esessid = -1
        quespapid = -1
        csid1 = $('#txtcsid').val()
    }
            
    $.ajax({
        url:"/api/candidatescriptids/",
        crossDomain: true,
        type: 'GET',
        dataType: 'JSON',
        data : {
            esid : esessid,
            qpid: quespapid,
            csid : csid1,
            isprev : isprev,
            isnext : isnext,
            rownum : $("#rownum").val()
        },
        async: true,
        beforeSend:function(){
            $('#zonewrapperdynamic').empty();
            $('#btnsubmit').css('display', 'none');
            $('#divpagedetails').css('display', 'none')
            $('#zoneheading').css('display', 'none')
            $("#spinner").dialog('open');
        },
        success: function(data) {
            if(data[0] == 'no scripts'){         
                alert("No scripts are available");
            } else if(data[0] == 'unzoned') {
                alert("Autozoning is not completed")
            } else{
                $('#lblcsid').text(data[0][0])
                $('#lblpagecount').text(data[0][1])
                $('#qpid').val(data[0][2])  
                $('#rownum').val(data[0][3])          
                    
                $('#zonewrapperdynamic').append(data[1])
                $('#btnsubmit').css('display', 'block') 
                //$('#btnprevious').css('display', 'block')              
                $('#divpagedetails').css('display', 'block')
                $('#zoneheading').css('display', 'block')
                var selectedradio = $('input[name="searchcre"]:checked')[0].id;
                if (selectedradio == "rdobulk")
                {
                    $('#btnskip').css('display', 'block')
                }
                else{
                    $('#btnskip').css('display', 'none')
                }        
            }
        },
        error: function(error) {
            alert(error)
        },
        complete: function(){
            $("#spinner").dialog('close');
        }
    });
}

function applyaccuracybasedpage(e){
    currentpageid = e.id.split('_')[1]
    if (e.checked == false){      
        $('#drpexcep').prop('selectedIndex', 0)
        $('#txtareacomment').val('')
        //$('#sprequired').removeClass('redcolor').addClass('whitecolor')
        $("#cmdstar").removeClass('redcolor').addClass('whitecolor')
        //$("#cmdrequired").removeClass('redcolor').addClass('whitecolor')
        //$('#sprequired').css('display', 'none');
        $('#exceptionstatus').dialog('open');
    } else{
        if(confirm('Ticking the box will delete the exception already raised against this page. Are you sure you want to Proceed?')){
        var hid_exception = 'he_' + currentpageid;
        var imgexcpicon = 'imgeicon_' + currentpageid
        $("#" + hid_exception).val(1);
        $("#" + imgexcpicon).css('display', 'none');
        }else{
            var chkaccuracy = 'chk_' + currentpageid
            $("#" + chkaccuracy).prop('checked',false)
        }
    }
}

function updateexceptionstatus(e) {
    currentpageid = e.id.split('_')[1]
    var imgexcepicon_id = e.id
    currpageid = imgexcepicon_id.split('_')[1]
    var hid_exception = 'he_' + currpageid
    values = $("#" + hid_exception).val().split('$')

    var iscmtmandatory = exceptionstatus.filter(function(v,i,a){return v[0] == values[1]})[0][2]
        if(iscmtmandatory == true){
           $("#cmdstar").removeClass('whitecolor').addClass('redcolor')
        } else {
            $("#cmdstar").removeClass('redcolor').addClass('whitecolor')
        }

    $('#drpexcep').val(values[1])
    $('#txtareacomment').val(values[2])
    //$('#sprequired').removeClass('redcolor').addClass('whitecolor')
    //$("#cmdrequired").removeClass('redcolor').addClass('whitecolor')
    //$('#sprequired').css('display', 'none');
    $('#exceptionstatus').dialog('open');
}

