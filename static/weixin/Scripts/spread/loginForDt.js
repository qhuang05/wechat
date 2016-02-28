var reg = /^\d{11}$/;


$(function () {
    $("#loginBt").click(function () {
        if(!reg.test($("#spreadTel").val())){
            alert("请输入正确的电话号码");
            $("#formAll").attr('action','#');
            $("#loginBt").attr('type','button');
        }
        else if($("#spreadPwd").val() == ""){
            alert("请输入密码");
            $("#formAll").attr('action','#');
            $("#loginBt").attr('type','button');
        }
        else{
            $.ajax({
                type:'POST',
                url:'/spread/checkPwd',
                data:'spreadTel='+$("#spreadTel").val()+"&spreadPwd="+$("#spreadPwd").val(),
                success:function(result){
                    if(result == '0'){
                        alert("账号或者密码不对，请重新输入")
                    }
                    else if(result == '1'){
                        window.location.href='/spread/spreadPage?spreadTel='+$("#spreadTel").val();
                    }
                }
            });
        }
    })




});