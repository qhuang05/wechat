$(document).ready(function() {
	integralManage.init();

});

var _mmg = null;
var integralManage = function(){
    return{
        init: function(){
            _mmg=$('#dg').datagrid({
                    url:'/integral_Page',
                    params: $("#integralForm").serialize(),
                    method: 'post',
                    rownumbers: true,
                    fitColumns : true,
                    striped:true,
                    nowrap: true,

                    showFooter:true,
                    pagination:true,
                    pageList: [10,15,20],
                    idField: 'id', //主键
                    columns:[
                        [
                            {field:'ck', checkbox:true},
                            {field: 'id', title: 'id', hidden: true},
                            {field:'integralName', title:'积分名称', width:150},

                            {
                            field: 'integralType', title: '积分类型', width: 150, type: 'String', formatter: function (val) {
                            if (val == '')
                                return '';
                            else if (val == '01')
                                return '新用户特权';
                            else if (val == '02')
                                return '消费获得';
                            else if (val == '03')
                                return '签到获得';
                            }

                            },
                            {field:'integralValue', title:'积分值', width:150},
                            {field:'remakes', title:'备注', width:150},
                            {field:'createTime', title:'创建时间', width:150},


                        ]
                    ],


            }).datagrid("clientPaging");
        },





        //查询
        load: function(){
            var integralName1 = $("#integralName1").val();
            var integralType1 = $("#integralType1").combobox('getValue');
           $('#dg').datagrid('load',{
                integralName1:integralName1,
                integralType1:integralType1,
            });
        },

         //打开弹出窗
        addPopu: function () {
           $('#w').window('open');
        },
         //关闭_弹出框
        closePopu: function () {
            $('#w').window('close', true);

        },
          //保存
        save: function () {
            var id = $("#id").val();
           var parms = $("#integral").serialize();

             if (id == "" || id == undefined || id == null) {
             $.ajax({
                    type: 'POST',
                    url: '/add_integral',
                    dataType: 'json',
                    data: parms,
                    success: function (result) {
                        if (result == '1') {
                            alert('添加成功！');
                            $('#integral').form('clear');
                            integralManage.load();
                            integralManage.closePopu();
                            return;
                        } else {
                            alert('添加失败！');
                            integralManage.closePopu();
                            return;
                        }
                    }
                })}else{

                 $.ajax({
                    type: 'POST',
                    url: '/edit_integral',
                    dataType: 'json',
                    data: parms,
                    success: function (result) {
                        if (result == '1') {
                            alert('修改成功！');
                            $('#integral').form('clear');
                            integralManage.load();
                            integralManage.closePopu();
                            return;
                        } else {
                            alert('修改失败！');
                            integralManage.closePopu();
                            return;
                        }
                    }
                })


             }
        },

         //删除功能
       del: function () {
            var chackedItem = $('#dg').datagrid('getChecked');
            var integral_ids = [];
            var ids;
            if (chackedItem.length == '0') {
                alert("请至少选择一条记录！");
                return;
            }
            $.messager.confirm('确认', '您确定要删除当前选中的记录吗？', function (r) {
                if (r) {
                    if (chackedItem.length == 1) {
                        //删除单条记录
                        var chackedItem1 = $('#dg').datagrid('getChecked');
                        var integral_id;
                        $.each(chackedItem1, function (index, item) {
                            integral_id = item.id;


                        });
                        $.ajax({
                            type: 'POST',
                            url: '/del_Integral_by_id',
                            data: 'id=' + integral_id,
                            success: function (result) {
                                if (result == '1') {
                                    alert("删除成功")
                                    integralManage.load();
                                    return;
                                } else {
                                    alert('删除失败！');
                                    return;

                                }
                            }
                        })
                    } else {
                        //删除多条记录
                        $.each(chackedItem, function (index, item) {
                            if (integral_ids == "") {
                                integral_ids = "" + item.id + "";
                            } else {
                                integral_ids = "" + item.id + "" + "," + integral_ids;
                                ids = integral_ids.split(',');
                            }
                        });
                        $.ajax({
                            type: 'POST',
                            url: '/del_Integral_by_ids',
                            data: 'id=' + JSON.stringify(ids),
                            success: function (result) {
                                if (result == '1') {
                                    alert('删除成功！');
                                    integralManage.load();
                                    return;
                                } else {
                                    alert('删除失败！');
                                    return;
                                }
                            }
                        })
                    }
                }
            });
        },
         //修改内容
        edit: function () {
            var chackedItem = $('#dg').datagrid('getChecked');
            var integral_id;
            if (chackedItem.length == '0' || chackedItem.length > '1') {
                alert("请选择一条记录！");
                return;
            }
            $.each(chackedItem, function (index, item) {
                integral_id = item.id;

            });
            $.post('/select_integral_by_id', {id: integral_id}, function (result) {

                if (result != null) {
                    $("#id").val(result[0].id);
                    $("#integralName").val(result[0].integralName);
                    if (result[0].integralType == '01') {
                        $("#integralType").combobox('setValue', '新用户特权');
                    } else if (result[0].integralType == '02') {
                        $("#integralType").combobox('setValue', '消费获得');
                    } else if (result[0].integralType == '03') {
                        $("#integralType").combobox('setValue', '签到获得');
                    }
                    $("#integralValue").val(result[0].integralValue);
                    $("#remakes").val(result[0].remakes);
                    $("#createTime").val(result[0].createTime);
                }
            }, 'json');
            integralManage.addPopu();
        },
       //清空表单
       clearForm: function(formID,unload){

           $("#" + formID).each(function () {
               $("#integralName1").val('')
               $("#firsttime").datetimebox('clear');
               $("#lasttime").datetimebox('clear');
               $('#sorttype').combobox('clear');

            // iterate the elements within the form
            $(':input', this).each(function () {
                var type = this.type, tag = this.tagName.toLowerCase();
                if (type == 'text' || type == 'password' || tag == 'textarea' || type == "file")
                    this.value = '';
                else if (type == 'checkbox' || type == 'radio')
                    this.checked = false;
                else if (tag == 'select')
                    $('#integralType1').combobox('clear');

            });
        });

                $('#dg').datagrid('load', {});


       }

    }

}
();
