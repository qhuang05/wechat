var count_num = 0;
$(document).ready(function () {
    var b = $(window).width();
    var a = b - 73;
    var d = (b-203)/5;
    var shu = $("#fzz").val();
    var per = $("#par").val();
    $("#JL2").attr("style","margin-left:"+d+"px;");
    $("#JL3").attr("style","margin-left:"+d+"px;");
    $("#JL4").attr("style","margin-left:"+d+"px;");
    $("#JL5").attr("style","margin-left:"+d+"px;");
    $("#JL6").attr("style","margin-left:"+d+"px;");
    $("#JDT1").attr("style","width:"+a+"px;");
    fontColor(per);
    $("#fz").html(0);
    var c = $("#JDT1").width();
    $("#JDT3").animate({left:(per*a+28)},2000);
    //进度条。
    $("#JDT2").animate({width:per*c},2000);
    //经验数。
    //$("#JYS").animate({left:(per*a+18)},2000);
    if(10> shu && shu >= 0 ){
        $("#JYS").animate({left:(per*a+33)},2000);
    }
    else if(100> shu && shu >=10){
        $("#JYS").animate({left:(per*a+28)},2000);
    }
    else if(1000 > shu && shu >=100){
        $("#JYS").animate({left:(per*a+25)},2000);
    }
    else if(10000 > shu && shu >= 1000){
        $("#JYS").animate({left:(per*a+20)},2000);
    }
    else if(shu >= 10000){
        $("#JYS").animate({left:(per*a+16)},2000);
    }
    var val2 = shu/20;
    settime(shu,val2);
});

function settime(val,val2) {
    if(parseInt(count_num) == val){
        return;
    }else {
        count_num += val2;
        $("#fz").html(parseInt(count_num));
    }
    setTimeout(function() {
        settime(val,val2)
    },90);
}

function fontColor(val){
    if(val > 0.2){
        $("#JL2").css("color","black");
    }
    if(val>0.4){
        $("#JL3").css("color","black");
    }
    if(val>0.6){
        $("#JL4").css("color","black");
    }
    if(val>0.8){
        $("#JL5").css("color","black");
    }
    if(val>=1){
        $("#JL6").css("color","black");
    }
}