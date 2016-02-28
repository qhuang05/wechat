$(document).ready(function() {
});

var Login = function(){
    return{
        clear: function(){
            $('.input').val("");
        },
        login: function(){
            var username =  $('#username').val();
            var password = $('#password').val();
            if (username==""|| username==undefined){
                alert("用户名不可为空！")
                return;
            }
            if (password==""||password==undefined){
                alert("密码不可为空！")
                return;
            }
            $("#loginInputForm").submit();
        }
    }
}()

