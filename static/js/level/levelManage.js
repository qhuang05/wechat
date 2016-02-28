$(document).ready(function() {
	levelManage.init();
});

var _mmg = null;
var levelManage = function(){
    return{
        init: function(){
              if ($("#msg1").val() == '1') {

                alert('提交成功！');

                 _mmg=$('#dg').datagrid({
                    url:'/level_Page',
                    params: $("#levelForm").serialize(),
                    method: 'post',
                    rownumbers: true,
                    fitColumns : true,
                    striped:true,
                    nowrap: true,
                    checkOnSelect:true,
                    showFooter:true,
                    pagination:true,
                    pageList: [10,15,20],
                    idField: 'id', //主键
                    columns:[
                        [
                            {field:'ck', checkbox:true},
                            {field: 'id', title: 'id', hidden: true},
                             {
                             field: 'levelName',
                             title: '等级名称',
                             width: 150,
                             type: 'String',
                             formatter: function (val, item, rowIndex) {
                             var s='<span><a href="#" onclick="levelManage.detail(\''+ item.id +'\')">'+val+'</a></span>'
                             return s;
                             }
                             },
                            {field:'experience', title:'经验峰值', width:150},
                            {field:'eProportion', title:'经验值比例', width:150},
                            {field:'integralName', title:'积分名称', width:150},
                            {field:'integralValue', title:'积分值', width:150},
                            {field:'Remakes', title:'备注', width:150},
                            {field:'createTime', title:'创建时间', width:150},


                        ]
                    ],


            }).datagrid("clientPaging");

                return;

            }
            if ($("#msg1").val() == '2') {

                alert('提交失败！');
                informationManage.closePopu();
                return;
            }
             if ($("#msg1").val() == "" || $("#msg1").val() == null || $("#msg1").val() == undefined) {

                 _mmg=$('#dg').datagrid({
                    url:'/level_Page',
                    params: $("#levelForm").serialize(),
                    method: 'post',
                    rownumbers: true,
                    fitColumns : true,
                    striped:true,
                    nowrap: true,
                    checkOnSelect:true,
                    showFooter:true,
                    pagination:true,
                    pageList: [10,15,20],
                    idField: 'id', //主键
                    columns:[
                        [
                            {field:'ck', checkbox:true},
                            {field: 'id', title: 'id', hidden: true},
                             {
                             field: 'levelName',
                             title: '等级名称',
                             width: 150,
                             type: 'String',
                             formatter: function (val, item, rowIndex) {
                             var s='<span><a href="#" onclick="levelManage.detail(\''+ item.id +'\')">'+val+'</a></span>'
                             return s;
                             }
                             },
                            {field:'experience', title:'经验峰值', width:150},
                            {field:'eProportion', title:'经验值比例', width:150},
                            {field:'integralName', title:'积分名称', width:150},
                            {field:'integralValue', title:'积分值', width:150},
                            {field:'Remakes', title:'备注', width:150},
                            {field:'createTime', title:'创建时间', width:150},
                        ]
                    ],

            }).datagrid("clientPaging");
             }
        },
/*
var levelManage = function(){
    return{
        init: function(){
            _mmg=$('#dg').datagrid({
                    url:'/level_Page',
                    params: $("#levelForm").serialize(),
                    method: 'post',
                    rownumbers: true,
                    fitColumns : true,
                    striped:true,
                    nowrap: true,
                    checkOnSelect:true,
                    showFooter:true,
                    pagination:true,
                    pageList: [10,15,20],
                    idField: 'id', //主键
                    columns:[
                        [
                            {field:'ck', checkbox:true},
                            {field: 'id', title: 'id', hidden: true},
                             {
                             field: 'levelName',
                             title: '等级名称',
                             width: 150,
                             type: 'String',
                             formatter: function (val, item, rowIndex) {
                             var s='<span><a href="#" onclick="levelManage.detail(\''+ item.id +'\')">'+val+'</a></span>'
                             return s;
                             }
                             },
                            {field:'experience', title:'经验峰值', width:150},
                            {field:'eProportion', title:'经验值比例', width:150},
                            {field:'integralName', title:'积分名称', width:150},
                            {field:'integralValue', title:'积分值', width:150},
                            {field:'Remakes', title:'备注', width:150},
                            {field:'createTime', title:'创建时间', width:150},


                        ]
                    ],


            }).datagrid("clientPaging");
        },
*/





        //查询
        load: function(){
            var levelName1 = $("#levelName1").val();
           $('#dg').datagrid('load',{
                levelName1:levelName1,
            });
        },
        integralName_list: function () {
            $('#integralName').combobox(
                {
                    url: '/integralName_list',
                    valueField: 'value',
                    textField: 'text',
                    method: 'POST'
                }
            )

           $('#w').window('open');
        },

        integralName_list_all: function () {
            $('#integralName').combobox(
                {
                    url: '/integralName_list_all',
                    valueField: 'value',
                    textField: 'text',
                    method: 'POST'
                }
            )


        },
         //打开弹出窗
        addPopu: function () {
           levelManage.integralName_list();
           $('#w').window('open');
        },

         //关闭_弹出框
        closePopu: function () {
            $('#level').form('clear');
            levelManage.clearForm('levelForm');
            levelManage.load();
            $('#w').window('close', true);

        },


          //保存
        save: function () {
           var id = $("#id").val();
           var parms = $("#level").serialize();
           alert(parms)
             if (id == "" || id == undefined || id == null) {
             $.ajax({
                    type: 'POST',
                    url: '/add_level',
                    dataType: 'json',
                    data: parms,
                    success: function (result) {
                        if (result == '1') {
                            alert('添加成功！');
                            $('#level').form('clear');
                            levelManage.load();
                            levelManage.closePopu();
                            return;
                        } else {
                            alert('添加失败！');
                            levelManage.closePopu();
                            return;
                        }
                    }
                })}else{
                 $.ajax({
                    type: 'POST',
                    url: '/edit_level',
                    dataType: 'json',
                    data: parms,
                    success: function (result) {
                        if (result == '1') {
                            alert('修改成功！');
                            $('#level').form('clear');
                            levelManage.load();
                            levelManage.closePopu();
                            return;
                        } else {
                            alert('修改失败！');
                            levelManage.closePopu();
                            return;
                        }
                    }
                })


             }
        },

         //删除功能
       del: function () {
            var chackedItem = $('#dg').datagrid('getChecked');
            var level_ids = [];
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
                        var level_id;
                        $.each(chackedItem1, function (index, item) {
                            level_id = item.id;


                        });
                        $.ajax({
                            type: 'POST',
                            url: '/del_Level_by_id',
                            data: 'id=' + level_id,
                            success: function (result) {
                                if (result == '1') {
                                    alert("删除成功")
                                    levelManage.load();
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
                            if (level_ids == "") {
                                level_ids = "" + item.id + "";
                            } else {
                                level_ids = "" + item.id + "" + "," + level_ids;
                                ids = level_ids.split(',');
                            }
                        });
                        $.ajax({
                            type: 'POST',
                            url: '/del_Level_by_ids',
                            data: 'id=' + JSON.stringify(ids),
                            success: function (result) {
                                if (result == '1') {
                                    alert('删除成功！');
                                    levelManage.load();
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
            var level_id;
            if (chackedItem.length == '0' || chackedItem.length > '1') {
                alert("请选择一条记录！");
                return;
            }
            $.each(chackedItem, function (index, item) {
                level_id = item.id;

            });
            $.post('/select_level_by_id', {id: level_id}, function (result) {
                 levelManage.integralName_list_all();
                if (result != null) {
                    $("#id").val(result[0].id);
                    $("#experience").val(result[0].experience1);
                    $("#levelName").val(result[0].levelName2);
                    $("#eProportion").val(result[0].eProportion1);
                    $("#integralName").combobox('setValue', result[0].integralName2);
                    $("#Remakes").val(result[0].Remakes1);
                    $("#imghead").attr("src", result[0].imgUrl)
                }
            }, 'json');
             $("#save").show();

            $('#w').window('open');
        },
         //详情
        detail: function (id) {
             levelManage.integralName_list_all();
            $.post('select_level_by_id', {id: id}, function (result) {
                if (result != null) {
                   $("#id").val(result[0].id);
                    $("#experience").val(result[0].experience1);
                    $("#levelName").val(result[0].levelName2);
                    $("#eProportion").val(result[0].eProportion1);
                    $("#integralName").combobox('setValue', result[0].integralName2);
                    $("#Remakes").val(result[0].Remakes1);
                    $("#imghead").attr("src", result[0].imgUrl)
                }
            }, 'json');
             $("#save").hide();
             levelManage.addPopu();

        },

       //清空表单
       clearForm: function(formID,unload){
           $("#" + formID).each(function () {
            // iterate the elements within the form
            $(':input', this).each(function () {
                var type = this.type, tag = this.tagName.toLowerCase();
                if (type == 'text' || type == 'password' || tag == 'textarea' || type == "file")
                    this.value = '';
                else if (type == 'checkbox' || type == 'radio')
                    this.checked = false;
                else if (tag == 'select')
                    $('#defraytype').combobox('clear');
            });
        });
                $('#dg').datagrid('load', {});
       }

    }

}
();
