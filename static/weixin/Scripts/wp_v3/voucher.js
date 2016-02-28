/**
 * Created by wzp on 15/12/31.
 */
$(document).ready(function(){
    //判断未使用代金券的DIV是否可以使用。
    if($("#check_voucher").val() == "1") {
        var a = $("#bb");
        $(".noUsed").show();
        $(".used").hide();
        $(".expired").hide();
        a.css({"color":"#D9A633"});
        $("#aa").css({"color":"#000000"});
        $("#abcd").css({"left": a.offset().left});
        $(".noUsed").attr("onclick","no_use(this);")
    }
    else{
        $("#aa").css({"color":"#D9A633"});
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
        $(".noUsed").show();
        $(".used").show();
        $(".expired").show();
    }
    else if(val_id == "bb"){
        $(".noUsed").show();
        $(".used").hide();
        $(".expired").hide();
    }
    else if(val_id == "cc"){
        $(".noUsed").hide();
        $(".used").show();
        $(".expired").hide();
    }
    else if(val_id == "dd"){
        $(".noUsed").hide();
        $(".used").hide();
        $(".expired").show();
    }
}

function no_use(val){
    var a = $(val).attr("id");
    // a 即为代金券的ID
    sessionStorage.setItem('voucher_id',a);
    window.location.href="/mall/orderSubmit?voucher_id="+a;
}

