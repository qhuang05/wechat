$(document).ready(function(){
    //alert("123");
    $("body").css("background-color","#eaeaea");
    $("div").css("background-color","#ffffff");
    $("#abcd").css("background-color","#D9A633");
    $("#aa").css({"color":"#D9A633"});
    var check_view = $("#check_view");
    if(check_view.val() == 2){
        var bb = $("#bb");
        bb.css({"color":"#D9A633"});
        $("#aa").css({"color":"#000000"});
        $("#abcd").css({"left": bb.offset().left});
        $(".check1").parent().parent().parent().parent().show();
        $(".check2").parent().parent().parent().parent().hide();
        $(".check3").parent().parent().parent().parent().hide();
        $(".check4").parent().parent().parent().parent().hide();
    }
    else if(check_view.val() == 3){
        var cc = $("#cc");
        cc.css({"color":"#D9A633"});
        $("#aa").css({"color":"#000000"});
        $("#abcd").css({"left": cc.offset().left});
        $(".check1").parent().parent().parent().parent().hide();
        $(".check2").parent().parent().parent().parent().show();
        $(".check3").parent().parent().parent().parent().show();
        $(".check4").parent().parent().parent().parent().hide();
    }

});

function clickDH(val){
    var val_id = $(val).attr("id");
    var a = $("#"+val_id);
    var b = a.offset().left;
    $("#dh div").css("color","black");
    $("#"+val_id+" div").css({"color":"#D9A633"});
    $("#abcd").animate({left: b},"fast");

    if(val_id == "aa"){
        $(".check1").parent().parent().parent().parent().show();
        $(".check2").parent().parent().parent().parent().show();
        $(".check3").parent().parent().parent().parent().show();
        $(".check4").parent().parent().parent().parent().show();
    }
    else if(val_id == "bb"){
        $(".check1").parent().parent().parent().parent().show();
        $(".check2").parent().parent().parent().parent().hide();
        $(".check3").parent().parent().parent().parent().hide();
        $(".check4").parent().parent().parent().parent().hide();
    }
    else if(val_id == "cc"){
        $(".check1").parent().parent().parent().parent().hide();
        $(".check2").parent().parent().parent().parent().show();
        $(".check3").parent().parent().parent().parent().show();
        $(".check4").parent().parent().parent().parent().hide();
    }
    else if(val_id == "dd"){
        $(".check1").parent().parent().parent().parent().hide();
        $(".check2").parent().parent().parent().parent().hide();
        $(".check3").parent().parent().parent().parent().hide();
        $(".check4").parent().parent().parent().parent().show();
    }

}