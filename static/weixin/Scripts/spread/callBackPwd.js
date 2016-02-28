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
        $("#checkNum").attr('value','0');
        return
    } else {
        val.setAttribute("disabled", true);
        val.value="重新发送(" + countdown + ")";
        countdown--;
    }
    setTimeout(function() {
        settime(val)
    },1000)
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
    //判断手机号码为空，已注册。
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
        else if(checkPhoneNum == '0'){
            alert("手机号码未注册");
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

//function checkValues(checkImgValue,checkPhoneNum,val){
//    var phoneNumberID = document.getElementById("phoneNumber");
//    var checkImgV = document.getElementById("checkImg");
//     //判断手机号码为空，已注册。图形验证码为空，错误
//    //checkImgValue 判断图形验证码，0，错误，1,正确
//    //checkPhoneNum 判断手机号码，0，可以注册，1，已经被注册。
//    if($("#phoneNumber").val() == "" && $("#checkImg").val() == ""){
//        alert("手机号码不能为空，图形验证码不能为空")
//    }
//    else if($("#phoneNumber").val() == "" && $("#checkImg").val() != ""){
//        if(checkImgValue == "0"){
//            alert("手机号码不能为空，图形验证码错误，请重新输入")
//        }
//        else if(checkImgValue != "0"){
//            alert("手机号码不能为空，请重新输入");
//            phoneNumberID.setSelectionRange(0,$("#phoneNumber").val().length);
//            phoneNumberID.focus();
//        }
//
//    }
//    else if($("#phoneNumber").val() != "" && $("#checkImg").val() == ""){
//        if(checkPhoneNum == '0'){
//            alert("手机号码未注册，图形验证码不能为空，请重新输入")
//        }
//        else if(checkPhoneNum != "0"){
//            alert("图形验证码不能为空，请重新输入");
//            checkImgV.setSelectionRange(0,$("#checkImg").val().length);
//            checkImgV.focus();
//        }
//    }
//    else if($("#phoneNumber").val() != "" && $("#checkImg").val() != ""){
//        if(checkPhoneNum == '0' && checkImgValue == "0"){
//            alert("手机号码未注册，图形验证码错误，请重新输入")
//        }
//        else if(checkPhoneNum == '0' && checkImgValue != "0"){
//            if($("#phoneNumber").val() == ""){
//                alert("手机号码不能为空");
//                phoneNumberID.setSelectionRange(0,$("#phoneNumber").val().length);
//                phoneNumberID.focus();
//            }
//            else if(!reg2.test($("#phoneNumber").val()) && $("#phoneNumber").val() != ""){
//                alert("手机号码为11位有效数字");
//                phoneNumberID.setSelectionRange(0,$("#phoneNumber").val().length);
//                phoneNumberID.focus();
//            }
//            else{
//                alert("该号码未注册");
//                phoneNumberID.setSelectionRange(0,$("#phoneNumber").val().length);
//                phoneNumberID.focus();
//            }
//        }
//        else if(checkPhoneNum == '0' && checkImgValue == "0"){
//            alert("图形验证码错误，请重新输入");
//            checkImgV.setSelectionRange(0,$("#checkImg").val().length);
//            checkImgV.focus();
//        }
//        else{
//            settime(val);
//            $.ajax({
//                type:'POST',
//                url:'/spread/checkNum',
//                data:'phoneNumber='+$("#phoneNumber").val(),
//                success:function(result2){
//                    $("#checkNum").attr('value',result2)
//                }
//            })
//        }
//    }
//}

$(function() {
    $("#nextButton").click(function() {
        var phoneNumber = $("#phoneNumber").val();

        var verificationCodeID = document.getElementById("verificationCode");
        var verificationCode = $("#verificationCode").val();

        var passwordID = document.getElementById("password");
        var password = $("#password").val();

        if(password == "" && $("#verificationCode").val() == ""){
            alert("密码不能为空，短信验证码不能为空，请重新输入");
        }
        else if(password == "" && $("#checkNum").val() != ""){
            alert("密码不能为空");
            passwordID.setSelectionRange(0,password.length);
            passwordID.focus();
        }
        else if(!reg4.test(password) || password.length < 8|| password.length > 12){
            alert("密码必须以字母开头，长度在8-12之间，只能包含字符、数字和下划线");
            passwordID.setSelectionRange(0,password.length);
            passwordID.focus();
        }
        else if($("#verificationCode").val() == ""){
            alert("短信验证码不能为空，请重新输入");
            verificationCodeID.setSelectionRange(0,$("#getCode").val().length);
            verificationCodeID.focus();
        }
        else if($("#checkNum").val() == "0"){
            alert("短信验证码已过期，请重新输入");
            verificationCodeID.setSelectionRange(0,$("#getCode").val().length);
            verificationCodeID.focus();
        }
        else if($("#checkNum").val() != $("#verificationCode").val()){
            alert("短信验证码错误，请重新输入");
            verificationCodeID.setSelectionRange(0,$("#getCode").val().length);
            verificationCodeID.focus();
        }
        else if($("#checkNum").val() ==  $("#verificationCode").val()){
            $.ajax({
                type: 'POST',
                url: '/spread/newPwd',
                data: 'phoneNumber=' + $("#phoneNumber").val() + "&password=" + $("#password").val(),
                success: function (result) {
                    if (result == '0') {
                        alert("手机号码未注册")
                    }
                    else if (result == '1') {
                        $("#checkNum").attr('value', '1');
                        alert("修改密码成功");
                        window.location.href = '/spread/loginSpread'
                    }
                }
            });
        }
        });
    });

//2015-10-27 图形验证码不用了
//$(function(){
//    $("#getImg").click(function(){
//        $.ajax({
//            type:'POST',
//            url:'/spread/checkImg',
//            cache:false,
//            success:function(r){
//                var a = Math.random();
//                $("#getImg").attr('src','/static/weixin/Images/spread/code.jpg?v='+a);
//                $("#checkImgNum").attr('value',r)
//            }
//        })
//    })
//})
//
//$(document).ready(function(){
//    var a = Math.random();
//    $("#getImg").attr('src','/static/weixin/Images/spread/code.jpg?v='+a);
//}
//);