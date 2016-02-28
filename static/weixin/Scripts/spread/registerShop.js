var countdown=60;
var countdown2=180;
var reg = /\s|[^\s]+\s/;
var reg2 = /^\d{11}$/;
var reg3 = /^\d{6}$/;
var reg4 = /^[a-zA-Z]\w{5,17}$/;
function settime(val) {
    if (countdown == 0) {
        val.removeAttribute("disabled");
        val.value="获取验证码";
        countdown = 60;
        return
    } else {
        val.setAttribute("disabled", true);
        val.value="重新发送(" + countdown + ")";
        countdown--;
    }
    setTimeout(function() {
        settime(val)
    },1000);
}

function setCheckTimeOut(){
    if(countdown2 == 0){
        $("#checkNum").attr('value','0');
        countdown2 = 180;
        return
    }else
    {
        countdown2--;
    }
    setTimeout(function(){
        setCheckTimeOut()
    },1000);
}

function setRnum(val){
    var aNum = $("#phoneNumber").val();
    var checkImgValue = "";
    //var checkPhoneNum = "";
    //2015-10-27 图形验证码不用了
    //$.ajax({
    //    type:'POST',
    //    url:'/spread/checkImgCode',
    //    data:'checkImgCode='+$("#checkImg").val().toUpperCase(),
    //    success:function(result){
    //        if(result == '2' || result == '0'){
    //            checkImgValue = "0";
    //        }
    //        else{
    //            checkImgValue = "1";
    //        }
    //        $.ajax({
    //            type:'POST',
    //            url:'/spread/checkPhone',
    //            data:'phoneNumber='+aNum,
    //            success:function(result){
    //                checkPhoneNum = result;
    //                checkValues(checkImgValue,checkPhoneNum,val);
    //            }
    //        });
    //    }
    //});

    $.ajax({
        type:'POST',
        url:'/spread/checkPhone',
        data:'phoneNumber='+aNum,
        success:function(result){
            checkPhoneNum = result;
            checkValues(checkPhoneNum,val);
        }
    })
}

function checkValues(checkPhoneNum,val){
    var phoneNumberID = document.getElementById("phoneNumber");
    var checkImgV = document.getElementById("checkImg");
     //判断手机号码为空，已注册。图形验证码为空，错误
    //checkImgValue 判断图形验证码，0，错误，1,正确
    //checkPhoneNum 判断手机号码，0，可以注册，1，已经被注册。
    if($("#phoneNumber").val() == "" || $("#phoneNumber").val() == null){
        alert("手机号码不能为空");
        phoneNumberID.focus();
    }
    else if($("#phoneNumber").val() != ""){
        if(!reg2.test($("#phoneNumber").val())){
            alert("手机号码为11位有效数字");
            phoneNumberID.setSelectionRange(0,$("#phoneNumber").val().length);
            phoneNumberID.focus();
        }
        else if(checkPhoneNum != '0'){
            alert("手机号码已注册,请重新输入");
            phoneNumberID.setSelectionRange(0,$("#phoneNumber").val().length);
            phoneNumberID.focus();
        }
        else{
             settime(val);
            $.ajax({
                type:'POST',
                url:'/spread/checkNum',
                data:'phoneNumber='+$("#phoneNumber").val(),
                success:function(result2){
                    $("#checkNum").val(result2);
                }
            })
        }
    }
}

$(document).ready(function(){
    $("#towPage").hide();
    $("#threePage").hide();
    //var a = Math.random();
    //$("#getImg").attr('src','/static/weixin/Images/spread/code.jpg?v='+a);
});

$(function() {
    $("#nextButton").click(function() {
        debugger;
        var phoneNumber = $("#phoneNumber").val();

        var verificationCodeID = document.getElementById("verificationCode");
        var verificationCode = $("#verificationCode").val();

        var passwordID = document.getElementById("password");
        var password = $("#password").val();

        if(password == "" && $("#checkNum").val() == ""){
            alert("密码不能为空，短信验证码不能为空，请重新输入");
        }
        else if(password == "" && $("#checkNum").val() != ""){
            alert("密码不能为空");
            passwordID.setSelectionRange(0,password.length);
            passwordID.focus();
        }
        else if(!reg4.test(password) || password.length < 6){
            alert("密码必须以字母开头，长度在6-12之间，只能包含字符、数字和下划线");
            passwordID.setSelectionRange(0,password.length);
            passwordID.focus();
        }
        else if(verificationCode == ""){
            alert("短信验证码不能为空，请重新输入");
            verificationCodeID.setSelectionRange(0,$("#getCode").val().length);
            verificationCodeID.focus();
        }
        else if($("#checkNum").val() == "0"){
            alert("短信验证码已过期，请重新输入");
            verificationCodeID.setSelectionRange(0,$("#getCode").val().length);
            verificationCodeID.focus();
        }
        else if($("#checkNum").val() != verificationCode){
            alert("短信验证码错误，请重新输入");
            verificationCodeID.setSelectionRange(0,$("#getCode").val().length);
            verificationCodeID.focus();
        }
        else if($("#checkNum").val() == verificationCode){
            $("#checkNum").attr('value','1');
            $("#onePage").hide();
            $("#towPage").show();
        }
        });
    });
$(function(){
    $("#nextButton2").click(function(){
        if($("#bankId").val() == ""){
            alert("银行卡号不能为空！");
            $("#bankId").focus();
        }
        else if($("#bankCardUsername").val() == ""){
            alert("持卡人姓名不能为空！");
            $("#bankCardUsername").focus();
        }
        else{
            $("#onePage").hide();
            $("#towPage").hide();
            $("#threePage").show();
        }
    })
});



$(function(){
    $("#chooseImg").click(function(){
        $("#chooseImg").attr("src","../static/weixin/Images/spread/chooseJyl.png");
        $("#chooseImg2").attr('src',"../static/weixin/Images/spread/Fjyl.png");
        $("#type").val('3');
    })
});
$(function(){
    $("#chooseImg2").click(function(){
        $("#chooseImg").attr("src","../static/weixin/Images/spread/Jyl.png");
        $("#chooseImg2").attr('src',"../static/weixin/Images/spread/chooseFjyl.png");
        $("#type").val('4');
    })
});

$(function(){
    $("#submitButton").click(function(){
        if($("#shopName").val() == ""){
            alert("商铺名称不能为空");
            $("#submitButton").attr('type','button');
            $("#registerForm").attr('ation','#');
        }
        else if($("#shopAddress").val() == ""){
            alert("商铺地址不能为空");
            $("#submitButton").attr('type','button');
            $("#registerForm").attr('ation','#');
        }
        else if($("#type").val() == 0){
            alert("请选择商铺类型");
            $("#submitButton").attr('type','button');
            $("#registerForm").attr('ation','#');
        }
    })
});
