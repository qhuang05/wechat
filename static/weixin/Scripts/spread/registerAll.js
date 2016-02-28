$(document).ready(function(){
    var checkNOID = document.getElementById("checkNOID");
    var checkNO = $("#checkNO").val();
    if(checkNO == '1'){
        alert("该二维码无效，请重新输入");
        $("#checkNO").attr('value','0');
        checkNOID.focus();
    }
}
);