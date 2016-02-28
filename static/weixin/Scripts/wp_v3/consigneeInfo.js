/**
 * Created by hqh on 16/1/6.
 */
$(document).ready(function(){
    var now=-1;    //now表示当前选中了收货人列表中的第几个

    $('#addConsignee .addBtn').click(function(){
        window.location.href = '/mine/addConsigneePage';
    });

    $('#consigneeList li').click(function(){
        $('#consigneeList .name img').attr('src','../../../static/weixin/Images/wp_v3/btn_squre.png');
        $(this).find('img').attr('src','../../../static/weixin/Images/wp_v3/btn_selected.png');
        now = $(this).index();
    });

    $('.appBtn img').eq(0).click(function(){
        if(now==-1) {
            alert("请选择一个收货人");
        }
        else {
            var name = $('#consigneeList li').eq(now).find('.name span').text();
            var tel = $('#consigneeList li').eq(now).find('.tel>span').text();
            var id = $('#consigneeList li').eq(now).attr('id');
            sessionStorage.setItem('consigneeName', name);
            sessionStorage.setItem('consigneeTel', tel);
            sessionStorage.setItem('consigneeId', id);
            //alert(sessionStorage.getItem('consigneeName'));
            //alert(sessionStorage.getItem('consigneeTel'));
            window.location.href = '/mall/orderSubmit';
        }
    });

    $('.appBtn img').eq(1).click(function(){
        if(now==-1) {
            alert("请选择一个收货人");
        }
        else {
            var consigneeid = $('#consigneeList li').eq(now).attr('id');
            var target = $('#consigneeList li').eq(now).get();
            delConsignee(consigneeid, target);
        }
    });
});

//删除收货人
function delConsignee(consigneeid,target){
    var delID = consigneeid;
    $.ajax({
        //type: '',
        url: '/mine/delConsignee',
        data: {id:delID},
        success: function(data){
            if(data=='1'){
                $(target).remove();
            }
        }
    });
}

//新增收货人
function addConsignee(){
    //提交表单之前，先检查收货人和联系电话的合法性
    var sName = $('#addForm #name').val();
    var sTel = $('#addForm #telephone').val();
    var iForm = document.getElementById('addForm');
    var re = /^([1][3458][0-9]{9})$|^(0\d{2,3}-\d{7,8})$/g;
    if(sName == '') {
        alert("收货人不能为空");
    }
    else if(sTel == '') {
        alert("电话号码不能为空");
    }
    else if(!re.test(sTel)) {
        alert("请输入合法的电话号码\n比如:13156789999或0592-55556666");
    }
    else {
        $.ajax({
            //type: 'post',
            url: '/mine/checkConsignee',
            data: {name: sName, tel: sTel},
            success: function(data){
                if(data=='1') {
                    alert('收货人已存在');
                }
                else {
                    iForm.submit();    //提交表单
                }
            }
        });
    }
}
