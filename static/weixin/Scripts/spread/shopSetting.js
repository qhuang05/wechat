$(document).ready(function () {
        var a = Math.random();
        $("#getImg").attr('src', '/static/weixin/Images/spread/code.jpg?v=' + a);
    }
);
var reg3 = /^\d{6}$/;
var countdown = 60;
var countdown2 = 180;
function settime(val) {
    if (countdown == 0) {
        val.removeAttribute("disabled");
        val.value = "获取验证码";
        countdown = 60;
        $("#checkNum").attr('value', '0');
        return
    } else {
        val.setAttribute("disabled", true);
        val.value = "重新发送(" + countdown + ")";
        countdown--;
    }
    setTimeout(function () {
        settime(val)
    }, 1000)
}
function setCheckTimeOut() {
    if (countdown2 == 0) {
        $("#checkNum").attr('value', '0');
        countdown2 = 180;
        return
    } else {
        countdown2--;
    }
    setTimeout(function () {
        setCheckTimeOut()
    }, 1000);
}
function setRnum(val) {
    var aNum = $("#spreadTel").val();

    settime(val);
    $.ajax({
        type: 'POST',
        url: '/spread/checkNum',
        data: 'phoneNumber=' + aNum,
        success: function (result) {
            $("#checkNum").attr('value', result)
        }
    })

}
//注释掉图形验证码部分
/*$(function(){
    $("#getImg").click(function(){
        $.ajax({
            type:'POST',
            url:'/spread/checkImg',
            cache:false,
            success:function(r){
                var a = Math.random();
                $("#getImg").attr('src','/static/weixin/Images/spread/code.jpg?v='+a);
                $("#checkImgNum").attr('value',r)
            }
        })
    })
})*/

var shopSetting = function () {
    return {
        //保存银行卡
         saveCard: function () {
            var result = false;
            var params = $("#aa").serialize();
            var reg = /^[0-9]*$/g;
            var str = $("#bank_account").val();
            var checkImgV = document.getElementById("checkImg");
            var checkImgVe = $("#checkImg").val();
            //数据库以1111-2222-3333 保存形式
            /*
             var stb = $("#bank_account").val();
             alert(stb)
             var str=stb.replace(/-/g,"");
             alert(str)*/
            if (reg.test(str) == false || str.length > 19 || str == '' || str == undefined||str.length < 16) {
                alert("请输入正确的银行卡号！")
                $("#bank_account").focus();
                $(":text").focus(function () {
                    this.select();
                });
                result = false;
            }

            /*else if ($("#checkImg").val() == "" || $("#checkImg").val() == undefined || $("#checkImg").val() == null) {
                alert("图形验证码不能为空");
                checkImgV.setSelectionRange(0, checkImgVe.length);
                checkImgV.focus();
                result = false; }*/

            else if (!reg3.test($("#verificationCode").val())) {
                alert("验证码应该为6位有效数字");
                $("#verificationCode").focus();
                $(":text").focus(function () {
                    this.select();
                });
                result = false;
            }
            else if ($("#checkNum").val() == 0 || $("#checkNum").val() != $("#verificationCode").val()) {
                alert("验证码错误，请重新输入");
                $("#verificationCode").focus();
                $(":text").focus(function () {
                    this.select();
                });
                result = false;
            }
            else {
                //无图形验证码JS
                 $('#my-confirm').modal({
                                relatedTarget: this,
                                onConfirm: function (options) {
                                    var $link = $(this.relatedTarget).prev('a');
                                    $.ajax({
                                        type: 'POST',
                                        url: '/spread/editBankCardPerson',
                                        dataType: 'json',
                                        data: params,
                                        success: function (result) {
                                            if (result == '1') {
                                                alert('修改成功！');
                                                location.replace(document.referrer);
                                                /*  window.location.href = '/spread/settings';
                                                 window.history.back(-2);*/

                                            } else {
                                                alert('修改失败！');
                                                window.history.back(-2);
                                            }
                                        }
                                    })
                                },
                                // closeOnConfirm: false,
                                onCancel: function () {
                                    //不绑定就返回
                                    return;
                                }
                            });
                //注视掉有图形验证码js
               /* $.ajax({
                    type: 'POST',
                    url: '/spread/checkImgCode',
                    data: 'checkImgCode=' + $("#checkImg").val().toUpperCase(),
                    success: function (result) {
                        if (result == '0') {
                            alert("图形验证码错误，请重新输入");
                            checkImgV.setSelectionRange(0, checkImgVe.length);
                            checkImgV.focus();
                            result = false;
                        } else {
                            $('#my-confirm').modal({
                                relatedTarget: this,
                                onConfirm: function (options) {
                                    var $link = $(this.relatedTarget).prev('a');
                                    $.ajax({
                                        type: 'POST',
                                        url: '/spread/editBankCardShop',
                                        dataType: 'json',
                                        data: params,
                                        success: function (result) {
                                            if (result == '1') {
                                                alert('修改成功！');
                                                location.replace(document.referrer);
                                                /!*  window.location.href = '/spread/settings';
                                                 window.history.back(-2);*!/

                                            } else {
                                                alert('修改失败！');
                                                window.history.back(-2);
                                            }
                                        }
                                    })
                                },
                                // closeOnConfirm: false,
                                onCancel: function () {
                                    //不绑定就返回
                                    return;
                                }
                            });
                        }

                    }
                });*/
            }


        },
     /*   saveCard: function () {
            var params = $("#aa").serialize();
            var reg = /^[0-9]*$/g;
            var str = $("#bank_account").val();
            if (reg.test(str) == false || str.length > 19 || str == '' || str == undefined) {
                alert("格式出错,请输入少于19位的数字！")
                $("#bank_account").focus();
                $(":text").focus(function () {
                    this.select();
                });
                return;
            } else if (!reg3.test($("#verificationCode").val())) {
                alert("验证码应该为6位有效数字");
                $("#verificationCode").focus();
                $(":text").focus(function () {
                    this.select();
                });
                return;
            }
            else if ($("#checkNum").val() == 0 || $("#checkNum").val() != $("#verificationCode").val()) {
                alert("验证码错误，请重新输入");
                $("#verificationCode").focus();
                $(":text").focus(function () {
                    this.select();
                });
                return;
            }
            $('#my-confirm').modal({
                relatedTarget: this,
                onConfirm: function (options) {
                    var $link = $(this.relatedTarget).prev('a');
                    $.ajax({
                        type: 'POST',
                        url: '/spread/editBankCardShop',
                        dataType: 'json',
                        data: params,
                        success: function (result) {
                            if (result == '1') {
                                alert('修改成功！');
                                location.replace(document.referrer);
                                /!*  window.location.href = '/spread/settings';
                                 window.history.back(-2);*!/

                            } else {
                                alert('修改失败！');
                                window.history.back(-2);
                            }
                        }
                    })
                },
                // closeOnConfirm: false,
                onCancel: function () {
                    //不绑定就返回
                    return;
                }
            });
            /!* if (confirm("请绑定本人的银行卡！")) {
             $.ajax({
             type: 'POST',
             url: '/spread/editBankCardShop',
             dataType: 'json',
             data: params,
             success: function (result) {
             if (result == '1') {
             alert('修改成功！');
             location.replace(document.referrer);
             /!* window.location.href = '/spread/settingShop';
             window.history.back(-2);*!/
             } else {
             alert('修改失败！');
             window.history.back(-2);
             }
             }
             })
             }
             //不绑定就返回
             return;*!/
        },*/
        //保存密码
        savePwd: function () {
            var params = $("#bb").serialize();
            var str = $("#oldpassword").val();
            var stb = $("#newpassword").val();
            var pwd = $("#spread_pwd").val();
            var reg = /^[a-zA-Z]\w{5,17}$/;
            if (pwd != str) {
                alert("旧密码有误，请重新输入！")
                $("#oldpassword").focus();
                $(":text").focus(function () {
                    this.select();
                });
                $("#newpassword").val("");
                return;
            }
            if (stb.length > 12 ||stb.length < 8 || stb == '' || stb == undefined || !reg.test(stb)) {
                alert("密码必须以字母开头，长度在8-12之间，只能包含字符、数字和下划线")
                $("#newpassword").focus();
                $(":text").focus(function () {
                    this.select();
                });

                return;
            }
            $.ajax({
                type: 'POST',
                url: '/spread/editPwdShop',
                dataType: 'json',
                data: params,
                success: function (result) {
                    if (result == '1') {
                        alert('修改成功！');
                        location.replace(document.referrer);
                        /*window.location.href = '/spread/settingShop';
                         window.history.back(-2);*/
                    } else {
                        alert('修改失败！');
                        window.history.back(-2);
                    }
                }
            })

        },
        //保存店铺信息
        saveShopInfo: function () {
            var params = $("#bb").serialize();
            var str = $("#spread_shop").val();
            var stb = $("#spread_shopaddress").val();
            if (str == '' || str == undefined) {
                alert("请输入商品名称！")
                $("#spread_shop").focus();
                $(":text").focus(function () {
                    this.select();
                });
                return;
            }
            if (stb == '' || stb == undefined) {
                alert("请输入商品地址！")
                $("#spread_shopaddress").focus();
                $(":text").focus(function () {
                    this.select();
                });
                return;
            }
            $.ajax({
                type: 'POST',
                url: '/spread/editShopinfo',
                dataType: 'json',
                data: params,
                success: function (result) {
                    if (result == '1') {
                        alert('修改成功！');
                        location.replace(document.referrer);
                        /*window.location.href = '/spread/settingShop';
                         window.history.back(-2);*/
                    } else {
                        alert('修改失败！');
                        window.history.back(-2);
                    }
                }
            })

        },
    }
}()