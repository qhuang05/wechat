
$(document).ready(function () {
    if($("#tian").text() == 0){
        $(".model1").show();
        $(".model2").hide();
    }else{
        $(".model1").hide();
        $(".model2").show();
    }
    if($(".if_signIn").attr("id") == '1'){
        $("#all_one").hide();
        $("#all_3").hide();
    }
    else{
        $("#all_two").hide();
        $("#all_3").hide();
    }

});
function signIn(){
    var open_id = $("#open_id").val();

    $.ajax({
        type:'POST',
        url:'/wechat/signInIng',
        dataType:"json",
        success: function (result) {
            debugger;
            $("#all_one").hide();
            $("#all_two").hide();
            $("#all_3").show();
            $("#day").html(result.counT);
            $("#JF").html(result.integral);
            $("#JY").html(result.Experence);
            $("#jf").html(result.INTEGARL);
            $("#jy").html(result.EXPERIENCE);
            $("#tian2").html(result.TIAN);

            if($("#tian2").text() == 0 || $("#tian2").text() == null){
                $(".model1").show();
                $(".model2").hide();
            }else{
                $(".model1").hide();
                $(".model2").show();
            }
        }
    })


}
